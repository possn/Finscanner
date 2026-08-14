"""
fundamentals.py — pulls raw metrics per ticker from yfinance.

Design constraint: yfinance is an unofficial wrapper around Yahoo's
internal endpoints. It has no SLA, fields are inconsistent across tickers
(especially outside the US), and it will occasionally return None for
things it should have. Every consumer of this data must treat missing
fields as missing, not as zero — a None interest-expense is NOT the same
as zero interest expense (the former means "unknown", the latter means
"zombie-proof"), and conflating them would misclassify healthy companies
as zombies or vice versa.
"""
from __future__ import annotations

import logging
import time
from dataclasses import dataclass, field

import yfinance as yf

log = logging.getLogger("fundamentals")


@dataclass
class RawMetrics:
    ticker: str
    name: str | None = None
    sector: str | None = None
    market_cap: float | None = None
    currency: str | None = None
    quote_type: str | None = None  # EQUITY, ETF, ...

    # profitability
    roe: float | None = None
    profit_margin: float | None = None

    # cash / leverage
    current_ratio: float | None = None
    debt_to_equity: float | None = None
    ebit: float | None = None
    interest_expense: float | None = None

    # value
    trailing_pe: float | None = None
    price_to_book: float | None = None
    current_price: float | None = None

    # stability
    beta: float | None = None

    # ETF-specific (fee audit / AI exposure)
    expense_ratio: float | None = None
    top_holdings: list[tuple[str, float]] = field(default_factory=list)

    error: str | None = None


def _safe_get(d: dict, *keys, default=None):
    for k in keys:
        v = d.get(k)
        if v is not None:
            return v
    return default


def _as_float(x):
    """yfinance's `.info` dict is loosely-typed JSON from Yahoo's backend —
    numeric fields occasionally arrive as strings, 'Infinity', or other
    non-numeric junk. Every numeric field pulled from it must go through
    this: silently returns None for anything that isn't a real, finite
    number rather than propagating a str/inf into downstream sorting and
    percentile math, which crashes with a TypeError."""
    if x is None:
        return None
    try:
        f = float(x)
    except (TypeError, ValueError):
        return None
    if f != f or f in (float("inf"), float("-inf")):  # NaN / inf
        return None
    return f


def fetch_one(ticker: str) -> RawMetrics:
    m = RawMetrics(ticker=ticker)
    try:
        t = yf.Ticker(ticker)
        info = t.info or {}

        m.name = info.get("shortName") or info.get("longName")
        m.sector = info.get("sector")
        m.currency = info.get("currency")
        m.quote_type = info.get("quoteType")

        m.roe = _as_float(info.get("returnOnEquity"))
        m.profit_margin = _as_float(info.get("profitMargins"))
        m.current_ratio = _as_float(info.get("currentRatio"))
        m.debt_to_equity = _as_float(info.get("debtToEquity"))
        m.trailing_pe = _as_float(info.get("trailingPE"))
        m.price_to_book = _as_float(info.get("priceToBook"))
        m.current_price = _as_float(_safe_get(info, "currentPrice", "regularMarketPrice", "previousClose"))
        m.beta = _as_float(info.get("beta"))
        m.market_cap = _as_float(info.get("marketCap"))

        if m.quote_type == "ETF":
            m.expense_ratio = _as_float(_safe_get(info, "annualReportExpenseRatio", "netExpenseRatio"))
            try:
                funds_data = t.funds_data
                if funds_data is not None and funds_data.top_holdings is not None:
                    th = funds_data.top_holdings
                    # top_holdings is a DataFrame indexed by symbol with a
                    # "Holding Percent" column when available
                    if "Holding Percent" in th.columns:
                        m.top_holdings = list(zip(th.index.tolist(), th["Holding Percent"].tolist()))
            except Exception as e:
                log.debug("%s: no holdings data (%s)", ticker, e)

        else:
            # interest coverage needs the income statement, not .info
            try:
                fin = t.financials
                if fin is not None and not fin.empty:
                    for label in ("EBIT", "Operating Income"):
                        if label in fin.index:
                            m.ebit = _as_float(fin.loc[label].iloc[0])
                            break
                    for label in ("Interest Expense", "Interest Expense Non Operating"):
                        if label in fin.index:
                            val = _as_float(fin.loc[label].iloc[0])
                            m.interest_expense = abs(val) if val is not None else None
                            break
            except Exception as e:
                log.debug("%s: financials unavailable (%s)", ticker, e)

    except Exception as e:
        m.error = str(e)
        log.warning("%s: fetch failed (%s)", ticker, e)

    return m


def fetch_many(tickers: list[str], pause: float = 0.15) -> list[RawMetrics]:
    """Sequential, polite fetch. yfinance has no official free bulk endpoint
    and hammering it concurrently is a good way to get temporarily blocked —
    a fixed small pause is cheaper than debugging rate-limit errors."""
    results = []
    for i, tk in enumerate(tickers):
        results.append(fetch_one(tk))
        if pause:
            time.sleep(pause)
        if (i + 1) % 50 == 0:
            log.info("fetched %d/%d", i + 1, len(tickers))
    return results
