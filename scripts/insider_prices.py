"""Fetch compact 1-year weekly price series for stocks with insider activity.

Only tickers that already have a parsed open-market P/S transaction are requested,
so this adds visual context without multiplying Yahoo requests across the full universe.
"""
from __future__ import annotations

import logging
from concurrent.futures import ThreadPoolExecutor, as_completed
import yfinance as yf

log = logging.getLogger("insider_prices")


def _one(ticker: str) -> list[dict]:
    try:
        hist = yf.Ticker(ticker).history(period="1y", interval="1wk", auto_adjust=False, timeout=20)
        if hist is None or hist.empty:
            return []
        out = []
        for idx, row in hist.iterrows():
            close = row.get("Close")
            if close is None:
                continue
            try:
                close = float(close)
            except Exception:
                continue
            if close != close:
                continue
            date = getattr(idx, "date", lambda: idx)()
            out.append({"date": str(date), "close": round(close, 6)})
        return out[-54:]
    except Exception as e:
        log.debug("%s price history unavailable: %s", ticker, e)
        return []


def fetch_many(tickers: list[str], workers: int = 5) -> dict[str, list[dict]]:
    unique = sorted(set(t for t in tickers if t and "." not in t))
    out: dict[str, list[dict]] = {}
    if not unique:
        return out
    with ThreadPoolExecutor(max_workers=max(1, min(workers, 6))) as pool:
        futs = {pool.submit(_one, t): t for t in unique}
        for i, fut in enumerate(as_completed(futs), 1):
            t = futs[fut]
            try:
                out[t] = fut.result()
            except Exception:
                out[t] = []
            if i % 25 == 0 or i == len(unique):
                log.info("insider price histories %d/%d", i, len(unique))
    return out
