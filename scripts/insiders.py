"""
insiders.py — insider activity signal from SEC EDGAR (free, official, no key).

LIMITATION, stated plainly: this is a US-only signal. EDGAR is the SEC's
filing system; Australia (ASIC), Poland (KNF) and the UK (FCA) have their
own separate disclosure regimes with no free unified API. AU/PL/UK
tickers will always show insider_signal = "not_available" — this is not
a bug, it's a coverage gap. Do not present it to the user as "no insider
activity"; that would misrepresent absence of data as a negative signal.

What this measures: count of Form 4 (change in beneficial ownership)
filings for the issuer in the trailing N days, via EDGAR's browse-edgar
company search, filtered to type=4. This is an ACTIVITY-LEVEL proxy —
it does not parse individual transaction codes (buy vs. sell, open-market
vs. option exercise), which would require parsing each filing's XML.
That's a real limitation: a burst of Form 4s can mean insiders are
buying, selling, or just exercising options on a routine vesting
schedule. Treat this as "insiders are transacting" not "insiders are
bullish".
"""
from __future__ import annotations

import logging
import time
from xml.etree import ElementTree

import requests

log = logging.getLogger("insiders")

HEADERS = {"User-Agent": "Finscanner/0.1 (personal research tool; contact: set-your-email-here)"}
TICKER_CIK_URL = "https://www.sec.gov/files/company_tickers.json"

_ticker_to_cik: dict[str, str] | None = None


def _load_ticker_cik_map() -> dict[str, str]:
    global _ticker_to_cik
    if _ticker_to_cik is not None:
        return _ticker_to_cik
    try:
        resp = requests.get(TICKER_CIK_URL, headers=HEADERS, timeout=20)
        resp.raise_for_status()
        data = resp.json()
        _ticker_to_cik = {
            row["ticker"].upper(): str(row["cik_str"]).zfill(10)
            for row in data.values()
        }
    except Exception as e:
        log.warning("Could not load SEC ticker->CIK map (%s)", e)
        _ticker_to_cik = {}
    return _ticker_to_cik


def form4_activity(ticker: str, days: int = 30) -> str | int:
    """Returns 'not_available' for non-US tickers, or an integer count of
    Form 4 filings in the trailing `days` for US tickers."""
    if "." in ticker:  # any suffixed (non-US) ticker
        return "not_available"

    cik_map = _load_ticker_cik_map()
    cik = cik_map.get(ticker.upper())
    if not cik:
        return "not_available"

    url = (
        "https://www.sec.gov/cgi-bin/browse-edgar"
        f"?action=getcompany&CIK={cik}&type=4&dateb=&owner=include&count=40&output=atom"
    )
    try:
        resp = requests.get(url, headers=HEADERS, timeout=20)
        resp.raise_for_status()
        root = ElementTree.fromstring(resp.content)
        ns = {"a": "http://www.w3.org/2005/Atom"}
        entries = root.findall("a:entry", ns)
        return len(entries)  # entries returned are already the most recent `count`
    except Exception as e:
        log.debug("%s: EDGAR fetch failed (%s)", ticker, e)
        return "not_available"


def annotate(tickers: list[str], pause: float = 0.15) -> dict[str, str | int]:
    """SEC asks for <=10 req/s from a single source; we go far slower to
    stay a good citizen on a free, shared resource."""
    cik_map = _load_ticker_cik_map()
    log.info("SEC ticker->CIK map loaded with %d entries", len(cik_map))

    out = {}
    resolved = 0
    for i, tk in enumerate(tickers):
        out[tk] = form4_activity(tk)
        if out[tk] != "not_available":
            resolved += 1
        time.sleep(pause)
        if (i + 1) % 50 == 0:
            log.info("insider check %d/%d (resolved so far: %d)", i + 1, len(tickers), resolved)
    log.info("insider annotate done: %d/%d tickers resolved to a CIK+filing count", resolved, len(tickers))
    return out
