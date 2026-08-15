"""Background SEC Form 4 watcher -> ntfy push notifications.

Designed for the lightweight hourly GitHub Actions workflow. It does NOT rebuild
Finscanner's full dataset. It checks SEC submissions metadata for the user's
portfolio universe, fetches structured Form 4 XML only for newly-seen filings,
and sends one ntfy notification per open-market buy/sell group.

First run is baseline-only (no historical flood). Manual workflow runs may set
FINSCANNER_ALERT_TEST=1 to send a connectivity test notification.
"""
from __future__ import annotations

import datetime as dt
import json
import logging
import os
import sys
from pathlib import Path
from typing import Iterable
from urllib.parse import quote

import requests

# Reuse the SEC client/parsing logic already hardened for the main pipeline.
from insiders import (
    _fetch_structured_filing,
    _load_ticker_cik_map,
    _recent_form4_rows,
)

ROOT = Path(__file__).resolve().parents[1]
EXTRA_TICKERS = ROOT / "data" / "extra_tickers.json"
ALERT_WATCHLIST = ROOT / "data" / "alert_watchlist.json"
STATE_PATH = ROOT / "data" / "insider_alert_state.json"

LOOKBACK_DAYS = max(3, min(30, int(os.getenv("FINSCANNER_INSIDER_ALERT_LOOKBACK_DAYS", "10"))))
MAX_NEW_FILINGS_PER_TICKER = max(1, min(20, int(os.getenv("FINSCANNER_INSIDER_ALERT_MAX_NEW", "8"))))
NTFY_SERVER = (os.getenv("NTFY_SERVER") or "https://ntfy.sh").rstrip("/")
NTFY_TOPIC = (os.getenv("NTFY_TOPIC") or "").strip().strip("/")
NTFY_TOKEN = (os.getenv("NTFY_TOKEN") or "").strip()
SEND_TEST = (os.getenv("FINSCANNER_ALERT_TEST") or "").lower() in {"1", "true", "yes", "on"}

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("insider-alerts")


def _load_json(path: Path, fallback):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return fallback


def _load_alert_tickers() -> list[str]:
    """Portfolio from extra_tickers + optional repository-side watchlist.

    Browser localStorage cannot be read by GitHub Actions, so background watchlist
    symbols can optionally be mirrored in data/alert_watchlist.json.
    """
    extra = _load_json(EXTRA_TICKERS, {})
    if isinstance(extra, dict):
        tickers = extra.get("tickers") or []
    elif isinstance(extra, list):
        tickers = extra
    else:
        tickers = []

    wl = _load_json(ALERT_WATCHLIST, {})
    if isinstance(wl, dict):
        watch = wl.get("tickers") or []
    elif isinstance(wl, list):
        watch = wl
    else:
        watch = []

    out = []
    seen = set()
    for tk in [*tickers, *watch]:
        s = str(tk or "").strip().upper()
        if not s or s in seen:
            continue
        seen.add(s)
        out.append(s)
    return out


def _load_state() -> dict:
    state = _load_json(STATE_PATH, {})
    if not isinstance(state, dict):
        state = {}
    if not isinstance(state.get("tickers"), dict):
        state["tickers"] = {}
    state.setdefault("schema_version", 1)
    return state


def _save_state(state: dict) -> None:
    state["updated_at"] = dt.datetime.now(dt.timezone.utc).isoformat()
    STATE_PATH.parent.mkdir(parents=True, exist_ok=True)
    STATE_PATH.write_text(json.dumps(state, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8")


def _money(v) -> str:
    if not isinstance(v, (int, float)):
        return "valor não indicado"
    a = abs(float(v))
    if a >= 1_000_000_000:
        return f"${v/1_000_000_000:.2f}B"
    if a >= 1_000_000:
        return f"${v/1_000_000:.2f}M"
    if a >= 1_000:
        return f"${v/1_000:.0f}k"
    return f"${v:,.0f}"


def _number(v) -> str:
    if not isinstance(v, (int, float)):
        return "—"
    return f"{v:,.0f}".replace(",", " ")


def _post_ntfy(title: str, message: str, *, priority: int = 3, tags: str = "chart_with_upwards_trend", click: str | None = None) -> None:
    """Publish through ntfy's JSON API.

    Do not put user-visible Unicode text in HTTP headers: Python's http.client
    encodes header values as latin-1, so characters such as ✓/→ raise
    UnicodeEncodeError before the request even leaves GitHub Actions.
    JSON is UTF-8 and safely carries Portuguese text and symbols.
    """
    if not NTFY_TOPIC:
        raise RuntimeError("NTFY_TOPIC is not configured")

    headers = {"Content-Type": "application/json; charset=utf-8"}
    if NTFY_TOKEN:
        headers["Authorization"] = f"Bearer {NTFY_TOKEN}"

    payload = {
        "topic": NTFY_TOPIC,
        "title": title,
        "message": message,
        "priority": int(priority),
        "tags": [t.strip() for t in str(tags).split(",") if t.strip()],
    }
    if click:
        payload["click"] = click

    r = requests.post(NTFY_SERVER, json=payload, headers=headers, timeout=20)
    r.raise_for_status()


def _filing_url(cik: str, filing: dict) -> str | None:
    acc = str(filing.get("accession") or "").replace("-", "")
    doc = str(filing.get("primary_document") or "").strip()
    if not acc or not doc:
        return None
    return f"https://www.sec.gov/Archives/edgar/data/{int(cik)}/{acc}/{doc}"


def _group_transactions(transactions: Iterable[dict]) -> list[dict]:
    """Aggregate multiple same-side rows in one Form 4 into concise alerts."""
    groups: dict[tuple, dict] = {}
    for tx in transactions:
        kind = tx.get("type")
        if kind not in {"buy", "sell"}:
            continue
        key = (kind, tx.get("owner") or "Insider", tx.get("role") or "", tx.get("date") or "")
        g = groups.setdefault(key, {
            "type": kind,
            "owner": tx.get("owner") or "Insider",
            "role": tx.get("role") or "",
            "date": tx.get("date") or "",
            "shares": 0.0,
            "value": 0.0,
            "known_shares": False,
            "known_value": False,
            "prices": [],
        })
        if isinstance(tx.get("shares"), (int, float)):
            g["shares"] += float(tx["shares"])
            g["known_shares"] = True
        if isinstance(tx.get("value"), (int, float)):
            g["value"] += float(tx["value"])
            g["known_value"] = True
        if isinstance(tx.get("price"), (int, float)):
            g["prices"].append(float(tx["price"]))
    return list(groups.values())


def _send_transaction_alert(ticker: str, group: dict, filing_url: str | None) -> None:
    is_buy = group["type"] == "buy"
    verb = "COMPROU" if is_buy else "VENDEU"
    role = f" · {group['role']}" if group.get("role") else ""
    shares = _number(group["shares"]) if group.get("known_shares") else "—"
    value = _money(group["value"]) if group.get("known_value") else "valor não indicado"
    prices = group.get("prices") or []
    if prices:
        if min(prices) == max(prices):
            price_txt = f"${prices[0]:,.2f}/ação"
        else:
            price_txt = f"${min(prices):,.2f}–${max(prices):,.2f}/ação"
    else:
        price_txt = "preço não indicado"
    message = (
        f"{group['owner']}{role}\n"
        f"{shares} ações · {value} · {price_txt}\n"
        f"Data da transação: {group.get('date') or '—'} · Form 4 SEC"
    )
    _post_ntfy(
        f"{ticker}: insider {verb}",
        message,
        priority=4 if is_buy else 3,
        tags="chart_with_upwards_trend,moneybag" if is_buy else "chart_with_downwards_trend,money_with_wings",
        click=filing_url,
    )


def run() -> int:
    if not NTFY_TOPIC:
        log.error("NTFY_TOPIC secret is missing. Configure it in GitHub Actions secrets.")
        return 2

    if SEND_TEST:
        _post_ntfy(
            "Finscanner Insider Alerts ✓",
            "Ligação GitHub Actions → ntfy ativa. O Finscanner vai verificar novos Form 4 de hora a hora.",
            priority=3,
            tags="white_check_mark,chart_with_upwards_trend",
        )
        log.info("ntfy test notification sent")

    all_requested = _load_alert_tickers()
    cik_map = _load_ticker_cik_map()
    us_tickers = [tk for tk in all_requested if tk in cik_map]
    state = _load_state()
    per_ticker = state["tickers"]
    state_changed = False

    log.info("alert universe: %d requested · %d SEC/US issuers", len(all_requested), len(us_tickers))
    new_filings = alerts_sent = detail_failures = 0
    baselined = 0

    for idx, ticker in enumerate(us_tickers, 1):
        cik = cik_map[ticker]
        try:
            filings = _recent_form4_rows(cik, LOOKBACK_DAYS)
        except Exception as e:
            log.warning("%s submissions unavailable: %s", ticker, e)
            continue

        current = {str(f.get("accession") or ""): f for f in filings if f.get("accession")}
        previous = per_ticker.get(ticker)
        if not isinstance(previous, dict):
            # First observation: baseline current filings, never send historical flood.
            per_ticker[ticker] = {
                "seen_accessions": sorted(current.keys()),
                "last_checked": dt.datetime.now(dt.timezone.utc).isoformat(),
            }
            baselined += 1
            state_changed = True
            continue

        seen = set(previous.get("seen_accessions") or [])
        unseen = [current[a] for a in sorted(current.keys()) if a not in seen]
        unseen = unseen[-MAX_NEW_FILINGS_PER_TICKER:]

        for filing in unseen:
            accession = filing["accession"]
            new_filings += 1
            txs, raw_count, detail = _fetch_structured_filing(cik, filing, ticker)
            if raw_count <= 0:
                detail_failures += 1
                log.warning("%s %s structured Form 4 unavailable; will retry next run (%s)", ticker, accession, detail)
                continue

            url = _filing_url(cik, filing)
            groups = _group_transactions(txs)
            try:
                for group in groups:
                    _send_transaction_alert(ticker, group, url)
                    alerts_sent += 1
                # Mark seen after notifications succeed. A Form 4 with no P/S (award,
                # option, gift...) is also safely marked seen once parsed.
                seen.add(accession)
                state_changed = True
            except Exception as e:
                log.error("%s %s ntfy publish failed; filing remains unseen: %s", ticker, accession, e)
                continue

        # Keep bounded state; accessions are tiny but no reason to grow forever.
        merged = list(dict.fromkeys([*(previous.get("seen_accessions") or []), *sorted(seen)]))
        bounded = merged[-120:]
        if bounded != (previous.get("seen_accessions") or []):
            previous["seen_accessions"] = bounded
            per_ticker[ticker] = previous
            state_changed = True

        if idx % 50 == 0:
            log.info("checked %d/%d SEC issuers", idx, len(us_tickers))

    if state_changed:
        state["last_change"] = {
            "requested": len(all_requested),
            "sec_issuers": len(us_tickers),
            "baselined": baselined,
            "new_filings": new_filings,
            "alerts_sent": alerts_sent,
            "detail_failures": detail_failures,
            "lookback_days": LOOKBACK_DAYS,
        }
        _save_state(state)
    else:
        log.info("no alert-state changes; repository will not be committed")
    log.info(
        "done: baseline %d · new filings %d · alerts %d · detail retries %d",
        baselined, new_filings, alerts_sent, detail_failures,
    )
    return 0


if __name__ == "__main__":
    sys.exit(run())
