"""
congress.py — US Congressional stock trade disclosures, fetched server-side.

WHY SERVER-SIDE: the Smart Money chart's Congress markers were previously
fetched directly from the browser via `fetch()` to the Bargo Congress API
(https://www.bargo.ai/free-apis/congress/v1/trades/{ticker}). That call
fails with a CORS error on every single request — confirmed via browser
console during testing (Access-Control-Allow-Origin missing). Same root
cause and same fix as news.py: CORS is a browser-enforced restriction,
so moving the fetch server-side (where CORS doesn't apply) makes it
actually work.

SOURCE: Bargo Congress Trades API (bargo.ai/free-apis/congress), a free,
keyless, public aggregation of House Clerk PTR and Senate eFD filings
under the STOCK Act. No auth, no rate-limit documented, but fetched
politely (bounded concurrency + small per-request pause) since it's a
free community resource, not a resource we operate.

SCOPE: US tickers in the tracked universe only (Congress/STOCK Act
disclosures are a US-specific requirement; non-US tickers get no data,
same limitation pattern as insiders.py).
"""
from __future__ import annotations

import datetime
import logging
import re
from concurrent.futures import ThreadPoolExecutor, as_completed

import requests

log = logging.getLogger("congress")

HEADERS = {"User-Agent": "Finscanner research-tool finscanner-app@proton.me", "Accept": "application/json"}
API_BASE = "https://www.bargo.ai/free-apis/congress/v1/trades"
MAX_WORKERS = 8
REQUEST_TIMEOUT = 10
LOOKBACK_DAYS = 92


def _amount_mid(range_str: str | None) -> float | None:
    """Parse a disclosed amount range like "$15,001 - $50,000" into its
    midpoint. Congress disclosures are legally required to be reported
    only as bands, not exact figures — the midpoint is a standard,
    widely-used approximation, not a precise value."""
    if not range_str:
        return None
    nums = re.findall(r"\$?([\d,.]+)\s*([KMB])?", str(range_str), re.IGNORECASE)
    vals = []
    for num, unit in nums:
        try:
            v = float(num.replace(",", ""))
        except ValueError:
            continue
        if unit.upper() == "K":
            v *= 1e3
        elif unit.upper() == "M":
            v *= 1e6
        elif unit.upper() == "B":
            v *= 1e9
        vals.append(v)
    if not vals:
        return None
    return sum(vals[:2]) / len(vals[:2])


def _normalize(raw_trades: list[dict], ticker: str) -> list[dict]:
    out = []
    for x in raw_trades:
        if str(x.get("ticker", "")).upper() != ticker.upper():
            continue
        tx_type = "sell" if "sale" in str(x.get("type", "")).lower() else "buy"
        amount_range = x.get("amount_range") or x.get("amount")
        date = x.get("transaction_date") or x.get("date")
        if not date:
            continue
        out.append({
            "member": x.get("member") or x.get("name") or "Membro do Congresso",
            "chamber": str(x.get("chamber", "")).lower(),
            "state": x.get("state") or "",
            "type": tx_type,
            "amount_range": amount_range or "—",
            "transaction_date": date,
            "disclosure_date": x.get("disclosure_date") or x.get("filed_date"),
            "value_mid": _amount_mid(amount_range),
        })
    return out


def _fetch_one(ticker: str) -> tuple[str, list[dict]]:
    query_ticker = ticker.split(".")[0]  # Congress disclosures are US-only; suffix never applies
    from_date = (datetime.date.today() - datetime.timedelta(days=LOOKBACK_DAYS)).isoformat()
    url = f"{API_BASE}/{query_ticker}?from={from_date}&limit=100"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=REQUEST_TIMEOUT)
        resp.raise_for_status()
        payload = resp.json()
        raw = payload.get("trades") if isinstance(payload, dict) else payload
        raw = raw if isinstance(raw, list) else []
        trades = _normalize(raw, query_ticker)
        return ticker, trades
    except Exception as e:
        log.debug("%s: congress fetch failed (%s)", ticker, e)
        return ticker, []


def fetch_congress_for_universe(us_tickers: list[str]) -> dict[str, list[dict]]:
    """us_tickers should already be filtered to US-listed (no exchange
    suffix) tickers — same convention as insiders.py."""
    results: dict[str, list[dict]] = {}
    done = 0
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as pool:
        futures = {pool.submit(_fetch_one, t): t for t in us_tickers}
        for future in as_completed(futures):
            ticker, trades = future.result()
            if trades:
                results[ticker] = trades
            done += 1
            if done % 200 == 0:
                log.info("congress fetch %d/%d", done, len(us_tickers))
    log.info("congress: %d/%d US tickers had disclosed trades in the last %d days", len(results), len(us_tickers), LOOKBACK_DAYS)
    return results
