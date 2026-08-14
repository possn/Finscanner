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
ETF_UNIVERSE: dict[str, str] = {
    # SPDR Select Sector — cleanly maps 1:1 to GICS sectors
    "XLK": "Technology", "XLF": "Financial Services", "XLE": "Energy",
    "XLV": "Healthcare", "XLI": "Industrials", "XLY": "Consumer Cyclical",
    "XLP": "Consumer Defensive", "XLU": "Utilities", "XLB": "Basic Materials",
    "XLRE": "Real Estate", "XLC": "Communication Services",
    # Broad market
    "SPY": "Broad Market", "VOO": "Broad Market", "IVV": "Broad Market",
    "VTI": "Broad Market", "QQQ": "Broad Market", "DIA": "Broad Market",
    "IWM": "Small Cap",
    # International / regional
    "EFA": "International Developed", "VEA": "International Developed",
    "EEM": "Emerging Markets", "VWO": "Emerging Markets",
    "EWU": "United Kingdom", "EWG": "Germany", "EWJ": "Japan", "EWA": "Australia",
    # Thematic / sector-adjacent
    "SMH": "Semiconductors", "SOXX": "Semiconductors", "ARKK": "Innovation/Growth",
    "SKYY": "Cloud Computing", "ROBO": "Robotics & AI", "HACK": "Cybersecurity",
    "IBB": "Biotechnology", "XBI": "Biotechnology", "ITA": "Aerospace & Defense",
    "TAN": "Solar/Clean Energy", "URA": "Uranium",
    # Bonds / fixed income
    "AGG": "Bonds", "BND": "Bonds", "TLT": "Bonds (Long Treasury)",
    "SHY": "Bonds (Short Treasury)", "LQD": "Bonds (Corporate)", "HYG": "Bonds (High Yield)",
    # Commodities proxies (metals themselves are covered separately in metals.py)
    "GLD": "Commodities", "SLV": "Commodities", "USO": "Commodities",
}

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


def us_small_micro_cap(limit: int = 500) -> list[str]:
    """Reuses the same Yahoo screener approach as the existing stock-scanner:
    yf.screen + EquityQuery, filtered to small/micro-cap US equities.
    Yahoo's screener API caps each individual response at 250 rows, so
    reaching a higher `limit` means paginating with `offset` rather than
    asking for a bigger `size` in one call."""
    tickers: list[str] = []
    try:
        q = yf.EquityQuery(
            "and",
            [
                yf.EquityQuery("eq", ["region", "us"]),
                yf.EquityQuery("btwn", ["intradaymarketcap", 50_000_000, 2_000_000_000]),
                yf.EquityQuery("gt", ["dayvolume", 100_000]),
            ],
        )
        offset = 0
        page_size = 250
        while len(tickers) < limit:
            result = yf.screen(q, sortField="intradaymarketcap", sortAsc=False, size=page_size, offset=offset)
            quotes = result.get("quotes", [])
            if not quotes:
                break
            tickers.extend(qq["symbol"] for qq in quotes if "symbol" in qq)
            offset += page_size
            if len(quotes) < page_size:
                break  # fewer than a full page means we've exhausted the screener's matches
        tickers = tickers[:limit]
        log.info("US screener returned %d tickers (paginated)", len(tickers))
        return tickers
    except Exception as e:
        log.warning("US screener failed (%s) — falling back to %d tickers fetched before failure", e, len(tickers))
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

def build_universe() -> dict[str, list[str]]:
    """Returns {market_code: [tickers]}. Each leg is independent — one
    source failing does not block the others."""
    universe = {
        "US": sorted(set(us_small_micro_cap()) | set(sp500_constituents())),
    }
    time.sleep(1)
    universe["AU"] = asx_constituents()
    time.sleep(1)
    universe["UK"] = ftse_constituents()
    time.sleep(1)
    universe["EU"] = europe_constituents()
    universe["ETF"] = sorted(ETF_UNIVERSE.keys())

    for market, tickers in universe.items():
        log.info("%s: %d tickers", market, len(tickers))

    return universe


if __name__ == "__main__":
    u = build_universe()
    total = sum(len(v) for v in u.values())
    print(f"Total tickers across all markets: {total}")
