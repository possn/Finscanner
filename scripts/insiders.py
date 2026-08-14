"""
insiders.py — US insider transactions from SEC EDGAR (official, free, no API key).

v0.6 corrects an important methodological flaw in the earlier implementation:
"30 days" now really means filings whose filingDate is within the trailing 30 days.
It also parses recent ownership XML and separates open-market purchase (P) from
sale (S). Option exercises, awards, gifts and other transaction codes are NOT
mislabelled as purchases/sales.

Coverage remains US-only. Missing SEC coverage is emitted as not_available,
never as zero activity.
"""
from __future__ import annotations

import datetime as dt
import logging
import os
import time
from xml.etree import ElementTree as ET

import requests

log = logging.getLogger("insiders")

SEC_USER_AGENT = os.getenv("SEC_USER_AGENT") or "Finscanner research-tool finscanner-app@proton.me"
# NOTE: SEC's bot-filtering appears to reject User-Agent strings containing
# "/" or ":" (they read as library-generated signatures like
# "Python-urllib/3.9" rather than a genuine app identity) — confirmed by
# testing: "Finscanner/0.6 research app contact: ..." got a 403, while
# "Finscanner research-tool <contact>" (no slash, no colon) succeeded on a
# real run. Keep this format if you ever change it. A GitHub secret named
# SEC_USER_AGENT overrides this default if set.
HEADERS = {
    "User-Agent": SEC_USER_AGENT,
    "Accept-Encoding": "gzip, deflate",
}
TICKER_CIK_URL = "https://www.sec.gov/files/company_tickers.json"
SUBMISSIONS_URL = "https://data.sec.gov/submissions/CIK{cik}.json"
ARCHIVE_URL = "https://www.sec.gov/Archives/edgar/data/{cik_int}/{accession}/{primary_document}"

_ticker_to_cik: dict[str, str] | None = None


def _get(url: str, timeout: int = 20):
    r = requests.get(url, headers=HEADERS, timeout=timeout)
    r.raise_for_status()
    return r


def _load_ticker_cik_map() -> dict[str, str]:
    global _ticker_to_cik
    if _ticker_to_cik is not None:
        return _ticker_to_cik
    try:
        data = _get(TICKER_CIK_URL).json()
        _ticker_to_cik = {
            row["ticker"].upper(): str(row["cik_str"]).zfill(10)
            for row in data.values()
        }
    except Exception as e:
        log.warning("Could not load SEC ticker->CIK map (%s)", e)
        _ticker_to_cik = {}
    return _ticker_to_cik


def _text(node, path: str):
    x = node.find(path)
    if x is None or x.text is None:
        return None
    return x.text.strip()


def _float(node, path: str):
    v = _text(node, path)
    if v in (None, ""):
        return None
    try:
        return float(v.replace(",", ""))
    except (TypeError, ValueError):
        return None


def _bool_text(root, path: str) -> bool:
    v = (_text(root, path) or "").strip().lower()
    return v in {"1", "true", "yes", "x"}


def _parse_ownership_xml(content: bytes, ticker: str, accession: str) -> list[dict]:
    """Return only economically interpretable P/S transactions.

    SEC ownership XML has no namespace in most Form 4 filings; if one exists,
    strip it locally so the parser remains resilient.
    """
    try:
        root = ET.fromstring(content)
    except Exception:
        return []

    for elem in root.iter():
        if "}" in elem.tag:
            elem.tag = elem.tag.split("}", 1)[1]

    owner = _text(root, "./reportingOwner/reportingOwnerId/rptOwnerName")
    rel = root.find("./reportingOwner/reportingOwnerRelationship")
    roles = []
    if rel is not None:
        if _bool_text(rel, "./isDirector"):
            roles.append("Director")
        if _bool_text(rel, "./isOfficer"):
            roles.append(_text(rel, "./officerTitle") or "Officer")
        if _bool_text(rel, "./isTenPercentOwner"):
            roles.append("10% owner")
        if _bool_text(rel, "./isOther"):
            roles.append("Other")

    out = []
    for tx in root.findall("./nonDerivativeTable/nonDerivativeTransaction"):
        code = _text(tx, "./transactionCoding/transactionCode")
        if code not in {"P", "S"}:
            continue
        shares = _float(tx, "./transactionAmounts/transactionShares/value")
        price = _float(tx, "./transactionAmounts/transactionPricePerShare/value")
        acq_disp = _text(tx, "./transactionAmounts/transactionAcquiredDisposedCode/value")
        date = _text(tx, "./transactionDate/value")
        value = shares * price if shares is not None and price is not None else None
        out.append({
            "ticker": ticker,
            "accession": accession,
            "date": date,
            "owner": owner,
            "role": ", ".join(r for r in roles if r) or None,
            "type": "buy" if code == "P" else "sell",
            "code": code,
            "shares": shares,
            "price": price,
            "value": value,
            "acquired_disposed": acq_disp,
        })
    return out


def _recent_form4_rows(cik: str, days: int) -> list[dict]:
    data = _get(SUBMISSIONS_URL.format(cik=cik)).json()
    recent = (data.get("filings") or {}).get("recent") or {}
    forms = recent.get("form") or []
    dates = recent.get("filingDate") or []
    accessions = recent.get("accessionNumber") or []
    docs = recent.get("primaryDocument") or []
    cutoff = dt.date.today() - dt.timedelta(days=days)
    rows = []
    for form, date_s, acc, doc in zip(forms, dates, accessions, docs):
        if form not in {"4", "4/A"}:
            continue
        try:
            filing_date = dt.date.fromisoformat(date_s)
        except Exception:
            continue
        if filing_date < cutoff:
            continue
        rows.append({
            "filing_date": date_s,
            "accession": acc,
            "primary_document": doc,
        })
    return rows


def insider_activity(ticker: str, days: int = 30, max_detail_filings: int = 6) -> dict:
    if "." in ticker:
        return {"status": "not_available"}

    cik = _load_ticker_cik_map().get(ticker.upper())
    if not cik:
        return {"status": "not_available"}

    try:
        filings = _recent_form4_rows(cik, days)
    except Exception as e:
        log.debug("%s: submissions fetch failed (%s)", ticker, e)
        return {"status": "not_available"}

    transactions: list[dict] = []
    cik_int = str(int(cik))
    for filing in filings[:max_detail_filings]:
        accession_no_dash = filing["accession"].replace("-", "")
        primary = filing["primary_document"]
        url = ARCHIVE_URL.format(
            cik_int=cik_int,
            accession=accession_no_dash,
            primary_document=primary,
        )
        try:
            content = _get(url).content
            transactions.extend(_parse_ownership_xml(content, ticker, filing["accession"]))
        except Exception as e:
            log.debug("%s: filing %s parse failed (%s)", ticker, filing["accession"], e)
        time.sleep(0.12)

    buys = [x for x in transactions if x["type"] == "buy"]
    sells = [x for x in transactions if x["type"] == "sell"]

    def sum_known(items):
        vals = [x["value"] for x in items if x.get("value") is not None]
        return sum(vals) if vals else 0.0

    buy_value = sum_known(buys)
    sell_value = sum_known(sells)
    transactions.sort(key=lambda x: x.get("date") or "", reverse=True)
    return {
        "status": "ok",
        "form4_count_30d": len(filings),
        "buy_count_30d": len(buys),
        "sell_count_30d": len(sells),
        "buy_value_30d": buy_value,
        "sell_value_30d": sell_value,
        "net_value_30d": buy_value - sell_value,
        "transactions": transactions[:8],
        "detail_filings_parsed": min(len(filings), max_detail_filings),
    }


def annotate(tickers: list[str], pause: float = 0.18) -> dict[str, dict]:
    cik_map = _load_ticker_cik_map()
    log.info("SEC ticker->CIK map loaded with %d entries", len(cik_map))
    out: dict[str, dict] = {}
    for i, tk in enumerate(tickers):
        out[tk] = insider_activity(tk)
        time.sleep(pause)
        if (i + 1) % 25 == 0:
            log.info("insider intelligence %d/%d", i + 1, len(tickers))
    return out
