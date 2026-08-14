"""
fundamentals.py — pulls raw market/fundamental metrics per ticker from yfinance.

All fields are nullable by design. Yahoo/yfinance coverage varies materially by
country and security type; missing data must never be interpreted as zero.
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
    industry: str | None = None
    market_cap: float | None = None
    currency: str | None = None
    quote_type: str | None = None

    # profitability / quality
    roe: float | None = None
    roa: float | None = None
    profit_margin: float | None = None
    operating_margin: float | None = None
    gross_margin: float | None = None

    # growth
    revenue_growth: float | None = None
    earnings_growth: float | None = None
    earnings_quarterly_growth: float | None = None

    # quarterly growth / shareholder structure intelligence
    quarterly_revenue: list[dict] = field(default_factory=list)
    quarterly_net_income: list[dict] = field(default_factory=list)
    quarterly_diluted_shares: list[dict] = field(default_factory=list)
    revenue_yoy_latest: float | None = None
    revenue_yoy_prior: float | None = None
    revenue_yoy_acceleration_pp: float | None = None
    net_income_yoy_latest: float | None = None
    net_income_yoy_prior: float | None = None
    net_income_yoy_acceleration_pp: float | None = None
    diluted_shares_yoy: float | None = None
    net_margin_latest: float | None = None
    net_margin_yoy_change_pp: float | None = None
    net_margin_yoy_change_prior_pp: float | None = None
    repurchases_last_quarter: float | None = None

    # cash flow
    free_cash_flow: float | None = None
    operating_cash_flow: float | None = None

    # cash / leverage
    current_ratio: float | None = None
    quick_ratio: float | None = None
    debt_to_equity: float | None = None
    total_cash: float | None = None
    total_debt: float | None = None
    ebit: float | None = None
    interest_expense: float | None = None

    # valuation
    trailing_pe: float | None = None
    forward_pe: float | None = None
    price_to_book: float | None = None
    enterprise_to_ebitda: float | None = None
    peg_ratio: float | None = None
    current_price: float | None = None

    # shareholder return
    dividend_yield: float | None = None
    payout_ratio: float | None = None

    # market risk
    beta: float | None = None

    # ETF-specific
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
    if x is None:
        return None
    try:
        f = float(x)
    except (TypeError, ValueError):
        return None
    if f != f or f in (float("inf"), float("-inf")):
        return None
    return f


def fetch_one(ticker: str) -> RawMetrics:
    m = RawMetrics(ticker=ticker)
    try:
        t = yf.Ticker(ticker)
        info = t.info or {}

        m.name = info.get("shortName") or info.get("longName")
        m.sector = info.get("sector")
        m.industry = info.get("industry")
        m.currency = info.get("currency")
        m.quote_type = info.get("quoteType")
        m.market_cap = _as_float(info.get("marketCap"))
        m.current_price = _as_float(_safe_get(info, "currentPrice", "regularMarketPrice", "previousClose"))

        # quality / profitability
        m.roe = _as_float(info.get("returnOnEquity"))
        m.roa = _as_float(info.get("returnOnAssets"))
        m.profit_margin = _as_float(info.get("profitMargins"))
        m.operating_margin = _as_float(info.get("operatingMargins"))
        m.gross_margin = _as_float(info.get("grossMargins"))

        # growth
        m.revenue_growth = _as_float(info.get("revenueGrowth"))
        m.earnings_growth = _as_float(info.get("earningsGrowth"))
        m.earnings_quarterly_growth = _as_float(info.get("earningsQuarterlyGrowth"))

        # cash flow
        m.free_cash_flow = _as_float(info.get("freeCashflow"))
        m.operating_cash_flow = _as_float(info.get("operatingCashflow"))

        # balance sheet
        m.current_ratio = _as_float(info.get("currentRatio"))
        m.quick_ratio = _as_float(info.get("quickRatio"))
        m.debt_to_equity = _as_float(info.get("debtToEquity"))
        m.total_cash = _as_float(info.get("totalCash"))
        m.total_debt = _as_float(info.get("totalDebt"))

        # valuation
        m.trailing_pe = _as_float(info.get("trailingPE"))
        m.forward_pe = _as_float(info.get("forwardPE"))
        m.price_to_book = _as_float(info.get("priceToBook"))
        m.enterprise_to_ebitda = _as_float(info.get("enterpriseToEbitda"))
        m.peg_ratio = _as_float(info.get("pegRatio"))

        # shareholder return / risk
        m.dividend_yield = _as_float(info.get("dividendYield"))
        m.payout_ratio = _as_float(info.get("payoutRatio"))
        m.beta = _as_float(info.get("beta"))

        if m.quote_type == "ETF":
            m.expense_ratio = _as_float(_safe_get(info, "annualReportExpenseRatio", "netExpenseRatio"))
            try:
                funds_data = t.funds_data
                if funds_data is not None and funds_data.top_holdings is not None:
                    th = funds_data.top_holdings
                    if "Holding Percent" in th.columns:
                        m.top_holdings = list(zip(th.index.tolist(), th["Holding Percent"].tolist()))
            except Exception as e:
                log.debug("%s: no holdings data (%s)", ticker, e)
        else:
            # Quarterly trajectory: latest five quarters allow a like-for-like YoY
            # comparison (Q0 vs Q4) without pretending sequential seasonality is growth.
            try:
                qfin = t.quarterly_financials
                if qfin is not None and not qfin.empty:
                    cols = list(qfin.columns)[:6]

                    def series_for(labels):
                        for label in labels:
                            if label in qfin.index:
                                vals = []
                                for c in cols:
                                    v = _as_float(qfin.loc[label, c])
                                    vals.append({"date": str(getattr(c, "date", lambda: c)()), "value": v})
                                return vals
                        return []

                    m.quarterly_revenue = series_for(("Total Revenue", "Operating Revenue"))
                    m.quarterly_net_income = series_for(("Net Income", "Net Income Common Stockholders"))
                    m.quarterly_diluted_shares = series_for(("Diluted Average Shares", "Basic Average Shares"))

                    def yoy_at(series, offset=0):
                        old = offset + 4
                        if len(series) > old and series[offset]["value"] is not None and series[old]["value"] not in (None, 0):
                            return series[offset]["value"] / series[old]["value"] - 1.0
                        return None

                    m.revenue_yoy_latest = yoy_at(m.quarterly_revenue, 0)
                    m.revenue_yoy_prior = yoy_at(m.quarterly_revenue, 1)
                    if m.revenue_yoy_latest is not None and m.revenue_yoy_prior is not None:
                        m.revenue_yoy_acceleration_pp = (m.revenue_yoy_latest - m.revenue_yoy_prior) * 100.0
                    m.net_income_yoy_latest = yoy_at(m.quarterly_net_income, 0)
                    m.net_income_yoy_prior = yoy_at(m.quarterly_net_income, 1)
                    if m.net_income_yoy_latest is not None and m.net_income_yoy_prior is not None:
                        m.net_income_yoy_acceleration_pp = (m.net_income_yoy_latest - m.net_income_yoy_prior) * 100.0
                    m.diluted_shares_yoy = yoy_at(m.quarterly_diluted_shares, 0)

                    if m.quarterly_revenue and m.quarterly_net_income and m.quarterly_revenue[0]["value"] not in (None, 0) and m.quarterly_net_income[0]["value"] is not None:
                        m.net_margin_latest = m.quarterly_net_income[0]["value"] / m.quarterly_revenue[0]["value"]
                    if len(m.quarterly_revenue) >= 5 and len(m.quarterly_net_income) >= 5 and m.quarterly_revenue[4]["value"] not in (None, 0) and m.quarterly_net_income[4]["value"] is not None:
                        old_margin = m.quarterly_net_income[4]["value"] / m.quarterly_revenue[4]["value"]
                        if m.net_margin_latest is not None:
                            m.net_margin_yoy_change_pp = (m.net_margin_latest - old_margin) * 100.0
                    if (len(m.quarterly_revenue) >= 6 and len(m.quarterly_net_income) >= 6
                            and m.quarterly_revenue[1]["value"] not in (None, 0)
                            and m.quarterly_revenue[5]["value"] not in (None, 0)
                            and m.quarterly_net_income[1]["value"] is not None
                            and m.quarterly_net_income[5]["value"] is not None):
                        prev_margin = m.quarterly_net_income[1]["value"] / m.quarterly_revenue[1]["value"]
                        prev_old_margin = m.quarterly_net_income[5]["value"] / m.quarterly_revenue[5]["value"]
                        m.net_margin_yoy_change_prior_pp = (prev_margin - prev_old_margin) * 100.0
            except Exception as e:
                log.debug("%s: quarterly financials unavailable (%s)", ticker, e)

            # Latest quarterly repurchases are read from the cash-flow statement.
            # Yahoo commonly stores repurchases as a negative financing cash flow;
            # expose a positive absolute amount to the UI for readability.
            try:
                qcf = t.quarterly_cashflow
                if qcf is not None and not qcf.empty:
                    for label in ("Repurchase Of Capital Stock", "Repurchase Of Stock"):
                        if label in qcf.index:
                            v = _as_float(qcf.loc[label].iloc[0])
                            if v is not None:
                                m.repurchases_last_quarter = abs(v)
                            break
            except Exception as e:
                log.debug("%s: quarterly cashflow unavailable (%s)", ticker, e)

            # Interest coverage is derived from the latest income statement.
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
    results = []
    for i, tk in enumerate(tickers):
        results.append(fetch_one(tk))
        if pause:
            time.sleep(pause)
        if (i + 1) % 50 == 0:
            log.info("fetched %d/%d", i + 1, len(tickers))
    return results
