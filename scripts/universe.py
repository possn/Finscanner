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


def asx_constituents() -> list[str]:
    raw = _wikipedia_table(
        "https://en.wikipedia.org/wiki/S%26P/ASX_200",
        match="Code",
        symbol_col_candidates=["Code", "ASX code", "Ticker"],
    )
    return [f"{s}.AX" for s in raw]


def wig_constituents() -> list[str]:
    # The English Wikipedia WIG20 article does not carry a constituents
    # table (only historical performance + navboxes) — confirmed via
    # pipeline_log.txt on a real run, not assumed. The Polish article does.
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


def build_universe() -> dict[str, list[str]]:
    """Returns {market_code: [tickers]}. Each leg is independent — one
    source failing does not block the others."""
    universe = {
        "US": us_small_micro_cap(),
    }
    time.sleep(1)
    universe["AU"] = asx_constituents()
    time.sleep(1)
    universe["PL"] = wig_constituents()
    time.sleep(1)
    universe["UK"] = ftse_constituents()

    for market, tickers in universe.items():
        log.info("%s: %d tickers", market, len(tickers))

    return universe


if __name__ == "__main__":
    u = build_universe()
    total = sum(len(v) for v in u.values())
    print(f"Total tickers across all markets: {total}")
