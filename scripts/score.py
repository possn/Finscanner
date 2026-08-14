"""
score.py — explainable multi-factor investment scoring engine.

The score is cross-sectional: each metric is ranked against the currently
fetched equity universe. It is a screening model, not a return forecast.
Missing data are excluded rather than treated as zero.

Dimensions / weights:
  Quality       25%  ROE, ROA, net/operating/gross margins
  Growth        20%  revenue and earnings growth
  Balance       20%  liquidity, debt/equity, net cash, interest coverage
  Cash flow     10%  free-cash-flow yield, operating cash flow positivity
  Valuation     15%  trailing/forward P-E, P/B, EV/EBITDA, PEG
  Stability     10%  beta (lower is better)

A data confidence score is also emitted, based on metric coverage.
"""
from __future__ import annotations

from dataclasses import dataclass

from fundamentals import RawMetrics


@dataclass
class ScoredTicker:
    ticker: str
    name: str | None
    sector: str | None
    industry: str | None
    market_cap: float | None
    currency: str | None
    quote_type: str | None

    score: float | None
    data_confidence: str
    data_coverage_pct: float

    zombie: str
    interest_coverage: float | None

    # dimension scores
    profitability_pct: float | None  # retained for backward-compatible UI
    leverage_pct: float | None       # retained for backward-compatible UI
    value_pct: float | None
    stability_pct: float | None
    quality_pct: float | None
    growth_pct: float | None
    balance_pct: float | None
    cashflow_pct: float | None

    # raw metrics for the company dossier
    roe: float | None = None
    roa: float | None = None
    profit_margin: float | None = None
    operating_margin: float | None = None
    gross_margin: float | None = None
    revenue_growth: float | None = None
    earnings_growth: float | None = None
    earnings_quarterly_growth: float | None = None
    free_cash_flow: float | None = None
    operating_cash_flow: float | None = None
    fcf_yield: float | None = None
    current_ratio: float | None = None
    quick_ratio: float | None = None
    debt_to_equity: float | None = None
    net_cash: float | None = None
    trailing_pe: float | None = None
    forward_pe: float | None = None
    price_to_book: float | None = None
    enterprise_to_ebitda: float | None = None
    peg_ratio: float | None = None
    dividend_yield: float | None = None
    payout_ratio: float | None = None
    beta: float | None = None

    expense_ratio: float | None = None
    ai_exposure_pct: float | None = None
    current_price: float | None = None


def _percentile_rank(value: float | None, all_values: list[float | None], invert: bool = False) -> float | None:
    clean = sorted(v for v in all_values if v is not None)
    if value is None or not clean:
        return None
    rank = sum(1 for v in clean if v <= value) / len(clean)
    pct = rank * 100
    return 100 - pct if invert else pct


def _avg(values):
    vals = [v for v in values if v is not None]
    return sum(vals) / len(vals) if vals else None


def _positive_score(value: float | None) -> float | None:
    if value is None:
        return None
    return 100.0 if value > 0 else 0.0


AI_EXPOSED_TICKERS = {
    "MSFT", "NVDA", "GOOGL", "GOOG", "AMZN", "META", "ORCL", "AVGO",
    "AMD", "PLTR", "CRM", "NOW", "SNOW", "SMCI", "ARM", "TSM", "ASML",
}


def score_universe(raw: list[RawMetrics]) -> list[ScoredTicker]:
    equities = [r for r in raw if r.quote_type != "ETF" and r.error is None]
    etfs = [r for r in raw if r.quote_type == "ETF" and r.error is None]

    def arr(attr):
        return [getattr(r, attr) for r in equities]

    fcf_yields = [
        (r.free_cash_flow / r.market_cap) if r.free_cash_flow is not None and r.market_cap and r.market_cap > 0 else None
        for r in equities
    ]
    net_cash_values = [
        ((r.total_cash or 0) - (r.total_debt or 0)) if (r.total_cash is not None or r.total_debt is not None) else None
        for r in equities
    ]
    net_cash_to_cap = [
        (v / r.market_cap) if v is not None and r.market_cap and r.market_cap > 0 else None
        for v, r in zip(net_cash_values, equities)
    ]

    out: list[ScoredTicker] = []

    for idx, r in enumerate(equities):
        coverage = None
        zombie = "unknown"
        if r.ebit is not None and r.interest_expense is not None:
            if r.interest_expense == 0:
                zombie, coverage = "no", None
            else:
                coverage = r.ebit / r.interest_expense
                zombie = "yes" if coverage < 1.0 else "no"

        quality = _avg([
            _percentile_rank(r.roe, arr("roe")),
            _percentile_rank(r.roa, arr("roa")),
            _percentile_rank(r.profit_margin, arr("profit_margin")),
            _percentile_rank(r.operating_margin, arr("operating_margin")),
            _percentile_rank(r.gross_margin, arr("gross_margin")),
        ])

        growth = _avg([
            _percentile_rank(r.revenue_growth, arr("revenue_growth")),
            _percentile_rank(r.earnings_growth, arr("earnings_growth")),
            _percentile_rank(r.earnings_quarterly_growth, arr("earnings_quarterly_growth")),
        ])

        coverage_pct = None
        if coverage is not None:
            coverages = []
            for x in equities:
                if x.ebit is not None and x.interest_expense not in (None, 0):
                    coverages.append(x.ebit / x.interest_expense)
            coverage_pct = _percentile_rank(coverage, coverages)

        balance = _avg([
            _percentile_rank(r.current_ratio, arr("current_ratio")),
            _percentile_rank(r.quick_ratio, arr("quick_ratio")),
            _percentile_rank(r.debt_to_equity, arr("debt_to_equity"), invert=True),
            _percentile_rank(net_cash_to_cap[idx], net_cash_to_cap),
            coverage_pct,
        ])

        fcf_yield = fcf_yields[idx]
        cashflow = _avg([
            _percentile_rank(fcf_yield, fcf_yields),
            _positive_score(r.operating_cash_flow),
        ])

        value_parts = []
        for value, values in [
            (r.trailing_pe, arr("trailing_pe")),
            (r.forward_pe, arr("forward_pe")),
            (r.price_to_book, arr("price_to_book")),
            (r.enterprise_to_ebitda, arr("enterprise_to_ebitda")),
            (r.peg_ratio, arr("peg_ratio")),
        ]:
            value_parts.append(_percentile_rank(value, values, invert=True) if value is not None and value > 0 else None)
        value = _avg(value_parts)

        stability = _percentile_rank(r.beta, arr("beta"), invert=True) if r.beta is not None else None

        dims = [quality, growth, balance, cashflow, value, stability]
        weights = [0.25, 0.20, 0.20, 0.10, 0.15, 0.10]
        present = [(d, w) for d, w in zip(dims, weights) if d is not None]
        composite = None
        if present:
            wsum = sum(w for _, w in present)
            composite = sum(d * w for d, w in present) / wsum
            if zombie == "yes":
                composite = min(composite, 45.0)

        metric_values = [
            r.roe, r.roa, r.profit_margin, r.operating_margin, r.gross_margin,
            r.revenue_growth, r.earnings_growth, r.earnings_quarterly_growth,
            r.free_cash_flow, r.operating_cash_flow, r.current_ratio, r.quick_ratio,
            r.debt_to_equity, r.total_cash, r.total_debt, r.trailing_pe, r.forward_pe,
            r.price_to_book, r.enterprise_to_ebitda, r.peg_ratio, r.beta,
        ]
        metric_coverage = sum(v is not None for v in metric_values) / len(metric_values) * 100
        confidence = "high" if metric_coverage >= 70 else "medium" if metric_coverage >= 40 else "low"

        net_cash = net_cash_values[idx]
        out.append(ScoredTicker(
            ticker=r.ticker, name=r.name, sector=r.sector, industry=r.industry,
            market_cap=r.market_cap, currency=r.currency, quote_type=r.quote_type,
            score=round(composite, 1) if composite is not None else None,
            data_confidence=confidence, data_coverage_pct=round(metric_coverage, 1),
            zombie=zombie, interest_coverage=round(coverage, 2) if coverage is not None else None,
            profitability_pct=round(quality, 1) if quality is not None else None,
            leverage_pct=round(balance, 1) if balance is not None else None,
            value_pct=round(value, 1) if value is not None else None,
            stability_pct=round(stability, 1) if stability is not None else None,
            quality_pct=round(quality, 1) if quality is not None else None,
            growth_pct=round(growth, 1) if growth is not None else None,
            balance_pct=round(balance, 1) if balance is not None else None,
            cashflow_pct=round(cashflow, 1) if cashflow is not None else None,
            roe=r.roe, roa=r.roa, profit_margin=r.profit_margin,
            operating_margin=r.operating_margin, gross_margin=r.gross_margin,
            revenue_growth=r.revenue_growth, earnings_growth=r.earnings_growth,
            earnings_quarterly_growth=r.earnings_quarterly_growth,
            free_cash_flow=r.free_cash_flow, operating_cash_flow=r.operating_cash_flow,
            fcf_yield=round(fcf_yield, 6) if fcf_yield is not None else None,
            current_ratio=r.current_ratio, quick_ratio=r.quick_ratio,
            debt_to_equity=r.debt_to_equity, net_cash=net_cash,
            trailing_pe=r.trailing_pe, forward_pe=r.forward_pe,
            price_to_book=r.price_to_book, enterprise_to_ebitda=r.enterprise_to_ebitda,
            peg_ratio=r.peg_ratio, dividend_yield=r.dividend_yield,
            payout_ratio=r.payout_ratio, beta=r.beta, current_price=r.current_price,
        ))

    for r in etfs:
        ai_pct = None
        if r.top_holdings:
            ai_pct = sum(w for sym, w in r.top_holdings if sym.upper() in AI_EXPOSED_TICKERS)
            ai_pct = round(ai_pct * 100, 1)
        out.append(ScoredTicker(
            ticker=r.ticker, name=r.name, sector=r.sector, industry=r.industry,
            market_cap=r.market_cap, currency=r.currency, quote_type="ETF",
            score=None, data_confidence="low", data_coverage_pct=0,
            zombie="unknown", interest_coverage=None,
            profitability_pct=None, leverage_pct=None, value_pct=None, stability_pct=None,
            quality_pct=None, growth_pct=None, balance_pct=None, cashflow_pct=None,
            expense_ratio=r.expense_ratio, ai_exposure_pct=ai_pct, current_price=r.current_price,
        ))

    return out
