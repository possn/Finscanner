"""
score.py — composite scoring engine.

METHODOLOGY (documented on purpose — this is the opposite of a black box):

The composite score is a weighted blend of four dimensions, each built
from ordinary, publicly-documented ratios. It is NOT a validated
predictive model, has NOT been backtested here, and should be read as a
structured summary of public fundamentals, not as investment advice or
a forecast of returns. The general idea of combining a handful of
accounting ratios into a single composite quality/value signal follows
the same logic as academic factor-scoring frameworks such as
Piotroski's F-Score (Piotroski, J.D., 2000, "Value Investing: The Use
of Historical Financial Statement Information to Separate Winners from
Losers", Journal of Accounting Research) — this implementation is a
much simpler, unvalidated variant inspired by that idea, not a
reproduction of it.

Dimensions (each normalized 0-100 within the fetched universe, then
averaged with the weights below):
  - Profitability (30%): ROE, profit margin
  - Leverage / cash safety (30%): current ratio, debt/equity, interest coverage
  - Value (20%): trailing P/E, P/B, cross-sectionally ranked (cheap = higher score)
  - Stability (20%): beta (lower = higher score) — a proxy, not a full
    volatility/drawdown model

Missing fields are excluded from that dimension's average rather than
treated as zero or as a penalty. A ticker with too many missing fields
gets a "data_confidence" flag instead of a silently inflated/deflated
score.

ZOMBIE FLAG: interest coverage = EBIT / interest_expense. Flagged if
coverage < 1.0, following the standard textbook definition (a company
whose operating earnings don't cover its interest bill). Requires both
EBIT and interest_expense to be present — otherwise flagged "unknown",
never silently treated as healthy.
"""
from __future__ import annotations

from dataclasses import dataclass

from fundamentals import RawMetrics


@dataclass
class ScoredTicker:
    ticker: str
    name: str | None
    sector: str | None
    market_cap: float | None
    quote_type: str | None

    score: float | None
    data_confidence: str  # "high" | "medium" | "low"

    zombie: str  # "yes" | "no" | "unknown"
    interest_coverage: float | None

    profitability_pct: float | None
    leverage_pct: float | None
    value_pct: float | None
    stability_pct: float | None

    expense_ratio: float | None = None
    ai_exposure_pct: float | None = None
    current_price: float | None = None


def _percentile_rank(value: float | None, all_values: list[float], invert: bool = False) -> float | None:
    """Rank value within all_values as a 0-100 percentile. invert=True
    means lower raw values should score higher (e.g. P/E, beta)."""
    clean = [v for v in all_values if v is not None]
    if value is None or not clean:
        return None
    clean_sorted = sorted(clean)
    rank = sum(1 for v in clean_sorted if v <= value) / len(clean_sorted)
    pct = rank * 100
    return 100 - pct if invert else pct


AI_EXPOSED_TICKERS = {
    "MSFT", "NVDA", "GOOGL", "GOOG", "AMZN", "META", "ORCL", "AVGO",
    "AMD", "PLTR", "CRM", "NOW", "SNOW", "SMCI", "ARM", "TSM", "ASML",
}


def score_universe(raw: list[RawMetrics]) -> list[ScoredTicker]:
    equities = [r for r in raw if r.quote_type != "ETF" and r.error is None]
    etfs = [r for r in raw if r.quote_type == "ETF" and r.error is None]

    roes = [r.roe for r in equities]
    margins = [r.profit_margin for r in equities]
    current_ratios = [r.current_ratio for r in equities]
    d2es = [r.debt_to_equity for r in equities]
    pes = [r.trailing_pe for r in equities]
    pbs = [r.price_to_book for r in equities]
    betas = [r.beta for r in equities]

    out: list[ScoredTicker] = []

    for r in equities:
        prof_components = [
            _percentile_rank(r.roe, roes),
            _percentile_rank(r.profit_margin, margins),
        ]
        prof_components = [c for c in prof_components if c is not None]
        profitability = sum(prof_components) / len(prof_components) if prof_components else None

        lev_components = [
            _percentile_rank(r.current_ratio, current_ratios),
            _percentile_rank(r.debt_to_equity, d2es, invert=True),
        ]
        lev_components = [c for c in lev_components if c is not None]
        leverage = sum(lev_components) / len(lev_components) if lev_components else None

        val_components = [
            _percentile_rank(r.trailing_pe, pes, invert=True) if r.trailing_pe and r.trailing_pe > 0 else None,
            _percentile_rank(r.price_to_book, pbs, invert=True) if r.price_to_book and r.price_to_book > 0 else None,
        ]
        val_components = [c for c in val_components if c is not None]
        value = sum(val_components) / len(val_components) if val_components else None

        stability = _percentile_rank(r.beta, betas, invert=True) if r.beta is not None else None

        dims = [profitability, leverage, value, stability]
        weights = [0.30, 0.30, 0.20, 0.20]
        present = [(d, w) for d, w in zip(dims, weights) if d is not None]

        if present:
            wsum = sum(w for _, w in present)
            composite = sum(d * w for d, w in present) / wsum
        else:
            composite = None

        n_present = sum(1 for d in dims if d is not None)
        confidence = "high" if n_present == 4 else "medium" if n_present >= 2 else "low"

        coverage = None
        zombie = "unknown"
        if r.ebit is not None and r.interest_expense is not None:
            if r.interest_expense == 0:
                zombie = "no"
                coverage = float("inf")
            else:
                coverage = r.ebit / r.interest_expense
                zombie = "yes" if coverage < 1.0 else "no"

        out.append(ScoredTicker(
            ticker=r.ticker, name=r.name, sector=r.sector, market_cap=r.market_cap,
            quote_type=r.quote_type, score=round(composite, 1) if composite is not None else None,
            data_confidence=confidence, zombie=zombie,
            interest_coverage=round(coverage, 2) if coverage not in (None, float("inf")) else coverage,
            profitability_pct=round(profitability, 1) if profitability is not None else None,
            leverage_pct=round(leverage, 1) if leverage is not None else None,
            value_pct=round(value, 1) if value is not None else None,
            stability_pct=round(stability, 1) if stability is not None else None,
            current_price=r.current_price,
        ))

    for r in etfs:
        ai_pct = None
        if r.top_holdings:
            ai_pct = sum(w for sym, w in r.top_holdings if sym.upper() in AI_EXPOSED_TICKERS)
            ai_pct = round(ai_pct * 100, 1) if ai_pct is not None else None
        out.append(ScoredTicker(
            ticker=r.ticker, name=r.name, sector=r.sector, market_cap=r.market_cap,
            quote_type="ETF", score=None, data_confidence="low",
            zombie="unknown", interest_coverage=None,
            profitability_pct=None, leverage_pct=None, value_pct=None, stability_pct=None,
            expense_ratio=r.expense_ratio, ai_exposure_pct=ai_pct, current_price=r.current_price,
        ))

    return out
