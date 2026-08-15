"""
universe.py — builds the daily ticker universe from free sources only.

US leg:      Yahoo Finance screener (via yfinance.screen), small/micro-cap,
             same approach as the existing stock-scanner project.
Intl legs:   Index constituent tables scraped from Wikipedia (public,
             no key, no rate limit). Suffixes map to Yahoo Finance's
             exchange convention so the same fetch pipeline works for
             every market.

Nothing here requires a paid API key. Network calls are wrapped so a
single failing source degrades the universe instead of crashing the run.
"""
from __future__ import annotations

import logging
import time
import json
import os
from dataclasses import dataclass
from io import StringIO

import pandas as pd
import requests
import yfinance as yf

# Logging is configured centrally by run.py (so all module logs land in
# the committed data/pipeline_log.txt). When this module is run directly
# in isolation, output falls back to Python's default "no handlers"
# behaviour — add a handler yourself if running standalone.
log = logging.getLogger("universe")

# ETF universe: yfinance/Yahoo has no free "screen all ETFs" endpoint
# comparable to the equity screener, and Yahoo's own `sector` field is
# usually blank for funds — so both the ticker list AND the sector label
# are curated by hand here rather than fetched. This is a deliberate
# trade-off: broad, liquid, well-known ETFs across the major GICS-style
# sectors plus a few broad-market/thematic/bond funds, small enough to
# maintain by hand, large enough to make the "procurar ETFs por setor"
# filter meaningful. Expense ratio and AI-exposure are still computed
# live from real data (fundamentals.py) — only the sector tag and the
# ticker list itself are static.
ETF_UNIVERSE: dict[str, dict[str, str]] = {
    # SPDR Select Sector — cleanly maps 1:1 to GICS sectors. All US-listed,
    # investing in US-sector companies, so region = United States.
    "XLK": {"sector": "Technology", "region": "United States"},
    "XLF": {"sector": "Financial Services", "region": "United States"},
    "XLE": {"sector": "Energy", "region": "United States"},
    "XLV": {"sector": "Healthcare", "region": "United States"},
    "XLI": {"sector": "Industrials", "region": "United States"},
    "XLY": {"sector": "Consumer Cyclical", "region": "United States"},
    "XLP": {"sector": "Consumer Defensive", "region": "United States"},
    "XLU": {"sector": "Utilities", "region": "United States"},
    "XLB": {"sector": "Basic Materials", "region": "United States"},
    "XLRE": {"sector": "Real Estate", "region": "United States"},
    "XLC": {"sector": "Communication Services", "region": "United States"},
    # Broad market
    "SPY": {"sector": "Broad Market", "region": "United States"},
    "VOO": {"sector": "Broad Market", "region": "United States"},
    "IVV": {"sector": "Broad Market", "region": "United States"},
    "VTI": {"sector": "Broad Market", "region": "United States"},
    "QQQ": {"sector": "Broad Market", "region": "United States"},
    "DIA": {"sector": "Broad Market", "region": "United States"},
    "IWM": {"sector": "Small Cap", "region": "United States"},
    # International / regional — region IS the point of these funds
    "EFA": {"sector": "Broad Market", "region": "International Developed"},
    "VEA": {"sector": "Broad Market", "region": "International Developed"},
    "EEM": {"sector": "Broad Market", "region": "Emerging Markets"},
    "VWO": {"sector": "Broad Market", "region": "Emerging Markets"},
    "EWU": {"sector": "Broad Market", "region": "United Kingdom"},
    "EWG": {"sector": "Broad Market", "region": "Germany"},
    "EWJ": {"sector": "Broad Market", "region": "Japan"},
    "EWA": {"sector": "Broad Market", "region": "Australia"},
    # Thematic / sector-adjacent (mostly US-listed & US-heavy holdings)
    "SMH": {"sector": "Semiconductors", "region": "Global"},
    "SOXX": {"sector": "Semiconductors", "region": "United States"},
    "ARKK": {"sector": "Innovation/Growth", "region": "Global"},
    "SKYY": {"sector": "Cloud Computing", "region": "United States"},
    "ROBO": {"sector": "Robotics & AI", "region": "Global"},
    "HACK": {"sector": "Cybersecurity", "region": "Global"},
    "IBB": {"sector": "Biotechnology", "region": "United States"},
    "XBI": {"sector": "Biotechnology", "region": "United States"},
    "ITA": {"sector": "Aerospace & Defense", "region": "United States"},
    "TAN": {"sector": "Solar/Clean Energy", "region": "Global"},
    "URA": {"sector": "Uranium", "region": "Global"},
    # Bonds / fixed income — US treasury/corporate unless noted
    "AGG": {"sector": "Bonds", "region": "United States"},
    "BND": {"sector": "Bonds", "region": "United States"},
    "TLT": {"sector": "Bonds (Long Treasury)", "region": "United States"},
    "SHY": {"sector": "Bonds (Short Treasury)", "region": "United States"},
    "LQD": {"sector": "Bonds (Corporate)", "region": "United States"},
    "HYG": {"sector": "Bonds (High Yield)", "region": "United States"},
    # Commodities proxies (metals themselves are covered separately in metals.py)
    "GLD": {"sector": "Commodities", "region": "Global"},
    "SLV": {"sector": "Commodities", "region": "Global"},
    "USO": {"sector": "Commodities", "region": "Global"},
}

# Ticker-suffix -> region, for equities (where they trade, not just an
# abstract "market code"). Used to set row["region"] server-side so the
# frontend has one authoritative field instead of re-deriving it from the
# ticker string in JS.
EQUITY_REGION_BY_SUFFIX: dict[str, str] = {
    "": "United States",
    ".AX": "Australia",
    ".L": "United Kingdom",
    ".DE": "Germany",
    ".PA": "France",
    ".AS": "Netherlands",
    ".MC": "Spain",
    ".MI": "Italy",
    ".SW": "Switzerland",
    ".LS": "Portugal",
    ".ST": "Sweden",
    ".CO": "Denmark",
    ".WA": "Poland",
    ".TO": "Canada",
    ".OL": "Norway",
    ".HE": "Finland",
    ".VI": "Austria",
    ".BR": "Belgium",
}


def region_for_equity(ticker: str) -> str:
    for suffix, region in EQUITY_REGION_BY_SUFFIX.items():
        if suffix and ticker.endswith(suffix):
            return region
    return EQUITY_REGION_BY_SUFFIX[""]

HEADERS = {"User-Agent": "Finscanner/0.1 (personal research tool; contact: set-your-email-here)"}


@dataclass
class Market:
    name: str
    suffix: str  # Yahoo Finance ticker suffix, "" for US


MARKETS = {
    "US": Market("United States", ""),
    "AU": Market("Australia", ".AX"),
    "PL": Market("Poland", ".WA"),
    "UK": Market("United Kingdom", ".L"),
    "EU": Market("Europe", "multi"),
}


def _us_cap_range_screener(min_cap: float, max_cap: float, limit: int, sort_desc: bool = False) -> list[str]:
    """Generic Yahoo screener call for a US market-cap band. Yahoo's
    screener API caps each individual response at 250 rows, so reaching
    a higher `limit` means paginating with `offset` rather than asking
    for a bigger `size` in one call."""
    tickers: list[str] = []
    try:
        q = yf.EquityQuery(
            "and",
            [
                yf.EquityQuery("eq", ["region", "us"]),
                yf.EquityQuery("btwn", ["intradaymarketcap", min_cap, max_cap]),
                yf.EquityQuery("gt", ["dayvolume", 100_000]),
            ],
        )
        offset = 0
        page_size = 250
        while len(tickers) < limit:
            result = yf.screen(q, sortField="intradaymarketcap", sortAsc=not sort_desc, size=page_size, offset=offset)
            quotes = result.get("quotes", [])
            if not quotes:
                break
            tickers.extend(qq["symbol"] for qq in quotes if "symbol" in qq)
            offset += page_size
            if len(quotes) < page_size:
                break
        return tickers[:limit]
    except Exception as e:
        log.warning("US screener failed for range %s-%s (%s) — returning %d tickers fetched before failure", min_cap, max_cap, e, len(tickers))
        return tickers


def us_small_micro_cap(limit: int = 500) -> list[str]:
    """Small/micro-cap US equities ($50M-$2B)."""
    tickers = _us_cap_range_screener(50_000_000, 2_000_000_000, limit)
    log.info("US small/micro-cap screener returned %d tickers", len(tickers))
    return tickers


def us_mid_large_cap(limit: int = 500) -> list[str]:
    """Mid/large-cap US equities ($2B-$750B) not necessarily in the S&P
    500 — added because a real portfolio (dividend-focused especially)
    routinely holds mid-caps, REITs and BDCs that never make the index
    (e.g. AGNC, ADC, GAIN, CTRE) but are far too large for the
    small/micro-cap screener above."""
    tickers = _us_cap_range_screener(2_000_000_000, 750_000_000_000, limit, sort_desc=True)
    log.info("US mid/large-cap screener returned %d tickers", len(tickers))
    return tickers


def _wikipedia_table(url: str, match: str, symbol_col_candidates: list[str]) -> list[str]:
    """Fetches every table on the page (no upfront regex filter — Wikipedia's
    table headers/captions vary and shift over time, and a `match=` filter
    that misses just means an empty, un-diagnosable result) and scans each
    one for a column matching `symbol_col_candidates`. `match` is kept only
    as a logging hint, not a hard filter."""
    try:
        resp = requests.get(url, headers=HEADERS, timeout=20)
        log.info("Wikipedia GET %s -> HTTP %d, %d bytes", url, resp.status_code, len(resp.content))
        resp.raise_for_status()
        tables = pd.read_html(StringIO(resp.text))
        log.info("%s: pd.read_html found %d table(s) total (hint pattern was %r)", url, len(tables), match)

        for idx, df in enumerate(tables):
            cols = [str(c) for c in df.columns]
            col = next((c for c in df.columns if str(c) in symbol_col_candidates), None)
            if col is not None:
                vals = [str(s).strip() for s in df[col].dropna().tolist()]
                log.info("%s: table[%d] columns=%s -> matched column %r, %d symbols, e.g. %s",
                          url, idx, cols, col, len(vals), vals[:5])
                if vals:
                    return vals
            else:
                log.info("%s: table[%d] columns=%s -> no match", url, idx, cols)

        log.warning("No table on %s had a column matching %s", url, symbol_col_candidates)
        return []
    except Exception as e:
        log.warning("Wikipedia fetch failed for %s (%s: %s)", url, type(e).__name__, e)
        return []


def sp500_constituents() -> list[str]:
    """Large-cap coverage gap fix: the small/micro-cap screener above
    deliberately excludes anything over $2B market cap, but a real
    portfolio (which is the whole point of the CSV/JSON import feature)
    is likely to hold large-caps. S&P 500 constituents cover most of
    that gap for US equities at effectively zero extra engineering cost
    — same Wikipedia-table pattern as the AU/PL/UK legs."""
    raw = _wikipedia_table(
        "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies",
        match="Symbol",
        symbol_col_candidates=["Symbol", "Ticker symbol", "Ticker"],
    )
    # Wikipedia's Symbol column sometimes uses a dot for share classes
    # (e.g. "BRK.B") where Yahoo Finance expects a dash ("BRK-B").
    return [s.replace(".", "-") for s in raw]


def asx_constituents() -> list[str]:
    raw = _wikipedia_table(
        "https://en.wikipedia.org/wiki/S%26P/ASX_200",
        match="Code",
        symbol_col_candidates=["Code", "ASX code", "Ticker"],
    )
    return [f"{s}.AX" for s in raw]


def wig_constituents() -> list[str]:
    # DISABLED — not called from build_universe(). Both the English and
    # Polish Wikipedia WIG20 articles failed to yield a parseable
    # constituents table (confirmed via pipeline_log.txt on real runs:
    # the Polish page's tables lack proper <th> headers, so pandas
    # returns generic '0'/'1' column names). No verified, current,
    # free source for the 20 tickers was found. Left here undeleted in
    # case a working source turns up later — kept honest as "off",
    # not silently broken.
    raw = _wikipedia_table(
        "https://pl.wikipedia.org/wiki/WIG20",
        match="Ticker",
        symbol_col_candidates=["Ticker", "Symbol", "Skrót", "Kod"],
    )
    return [f"{s}.WA" for s in raw]


def ftse_constituents() -> list[str]:
    raw = _wikipedia_table(
        "https://en.wikipedia.org/wiki/FTSE_100_Index",
        match="Ticker",
        symbol_col_candidates=["Ticker", "EPIC"],
    )
    return [f"{s}.L" for s in raw]



def europe_constituents() -> list[str]:
    """Pragmatic European large-cap universe from major national indices."""
    specs = [
        ("https://en.wikipedia.org/wiki/DAX", ["Ticker", "Symbol"], ".DE"),
        ("https://en.wikipedia.org/wiki/CAC_40", ["Ticker", "Symbol"], ".PA"),
        ("https://en.wikipedia.org/wiki/AEX_index", ["Ticker", "Symbol"], ".AS"),
        ("https://en.wikipedia.org/wiki/IBEX_35", ["Ticker", "Symbol"], ".MC"),
        ("https://en.wikipedia.org/wiki/FTSE_MIB", ["Ticker", "Symbol"], ".MI"),
        ("https://en.wikipedia.org/wiki/Swiss_Market_Index", ["Ticker", "Symbol"], ".SW"),
    ]
    out=[]
    for url, cols, suffix in specs:
        raw=_wikipedia_table(url, match="Ticker", symbol_col_candidates=cols)
        out.extend(f"{x.split()[0].replace('.', '-').strip()}{suffix}" for x in raw if x)
        time.sleep(0.4)
    return sorted(set(out))



def extra_portfolio_tickers() -> list[str]:
    """Load optional extra Yahoo symbols from data/extra_tickers.json.

    The base universe is discovered from screeners/indices and is intentionally
    finite. A valid Yahoo ticker can therefore exist without being selected by
    those discovery sources. Keeping a small explicit extension list prevents
    real portfolio holdings from being incorrectly labelled as unknown while
    avoiding the cost of fetching fundamentals for every symbol on every
    exchange. Invalid/stale symbols simply fail later in fetch_many and are
    skipped by the normal pipeline safeguards.
    """
    path = os.path.join(os.path.dirname(__file__), "..", "data", "extra_tickers.json")
    try:
        with open(path, encoding="utf-8") as f:
            payload = json.load(f)
        values = payload.get("tickers", payload) if isinstance(payload, dict) else payload
        out = sorted({str(x).strip().upper() for x in values if str(x).strip()})
        log.info("Extra portfolio coverage: %d ticker(s) loaded", len(out))
        return out
    except FileNotFoundError:
        log.info("No data/extra_tickers.json found; continuing without explicit portfolio extension")
        return []
    except Exception as e:
        log.warning("Could not load extra_tickers.json (%s)", e)
        return []

def build_universe() -> dict[str, list[str]]:
    """Returns {market_code: [tickers]}. Each leg is independent — one
    source failing does not block the others."""
    universe = {
        "US": sorted(set(us_small_micro_cap()) | set(sp500_constituents()) | set(us_mid_large_cap())),
    }
    time.sleep(1)
    universe["AU"] = asx_constituents()
    time.sleep(1)
    universe["UK"] = ftse_constituents()
    time.sleep(1)
    universe["EU"] = europe_constituents()
    universe["ETF"] = sorted(ETF_UNIVERSE.keys())
    universe["EXTRA"] = extra_portfolio_tickers()

    for market, tickers in universe.items():
        log.info("%s: %d tickers", market, len(tickers))

    return universe


if __name__ == "__main__":
    u = build_universe()
    total = sum(len(v) for v in u.values())
    print(f"Total tickers across all markets: {total}")
