"""Daily FX snapshot for portfolio weighting.

Stores conversion factors to EUR so browser-side portfolio analytics can compare
positions quoted in different currencies. Yahoo symbols are queried through
`yfinance`; when a direct CUR->EUR pair is unavailable we try the inverse
EUR->CUR pair and invert it.
"""
from __future__ import annotations

import datetime as _dt
import logging
import math
from typing import Iterable

import yfinance as yf

log = logging.getLogger(__name__)

DEFAULT_CURRENCIES = ("USD", "GBP", "CHF", "CAD", "PLN", "SEK", "DKK", "AUD", "JPY", "NOK")


def _last_close(symbol: str) -> float | None:
    try:
        hist = yf.Ticker(symbol).history(period="5d", interval="1d", auto_adjust=False)
        if hist is None or hist.empty or "Close" not in hist:
            return None
        vals = [float(v) for v in hist["Close"].dropna().tolist() if math.isfinite(float(v))]
        return vals[-1] if vals else None
    except Exception as exc:
        log.warning("FX fetch failed for %s: %s", symbol, exc)
        return None


def _to_eur(currency: str) -> tuple[float | None, str | None]:
    c = currency.upper()
    if c == "EUR":
        return 1.0, "identity"
    direct = _last_close(f"{c}EUR=X")
    if direct and direct > 0:
        return direct, f"{c}EUR=X"
    inverse = _last_close(f"EUR{c}=X")
    if inverse and inverse > 0:
        return 1.0 / inverse, f"EUR{c}=X (inverted)"
    return None, None


def build_fx_payload(currencies: Iterable[str] = DEFAULT_CURRENCIES) -> dict:
    rates = {"EUR": 1.0}
    sources = {"EUR": "identity"}
    for currency in currencies:
        c = currency.upper()
        if c == "EUR":
            continue
        rate, source = _to_eur(c)
        if rate is not None:
            rates[c] = rate
            sources[c] = source
    return {
        "generated_at": _dt.datetime.utcnow().isoformat() + "Z",
        "base": "EUR",
        "rates_to_eur": rates,
        "sources": sources,
        "note": "rate = EUR value of 1 unit of the quoted currency; GBp/GBX are handled browser-side as 1/100 GBP",
    }
