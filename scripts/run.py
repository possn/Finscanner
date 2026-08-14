"""
run.py — pipeline entry point. Executed daily by GitHub Actions.

US screener -> intl index scrapes -> yfinance fundamentals -> scoring ->
SEC EDGAR insider activity (US only) -> data/stocks.json (committed to repo).

The PWA is a pure static consumer of data/stocks.json — it never calls
any external API directly, which is what keeps the whole thing free and
avoids CORS/rate-limit problems in the browser.
"""
from __future__ import annotations

import dataclasses
import datetime
import io
import json
import logging
import os
import sys
import traceback

from fundamentals import fetch_many
import history as history_mod
import valuation_history as valuation_history_mod
from insiders import annotate as annotate_insiders
from metals import build_metals_payload
from score import score_universe
from thesis import classify as classify_thesis, evolve as evolve_thesis
import thesis_history as thesis_history_mod
from universe import build_universe

OUT_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "stocks.json")
METALS_OUT_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "metals.json")
HISTORY_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "history.json")
VALUATION_HISTORY_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "valuation_history.json")
THESIS_HISTORY_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "thesis_history.json")
ERROR_LOG_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "last_error.log")
PIPELINE_LOG_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "pipeline_log.txt")

# Every run's log is captured to a string AND committed to the repo as
# data/pipeline_log.txt, in addition to going to stdout for the Actions
# UI. This is the primary debugging channel: GitHub Actions log storage
# is a temporary blob that expires and isn't reachable from every
# environment, but a file in the repo is reachable from anywhere with
# read access to the repo (including the plain REST contents API).
_log_buffer = io.StringIO()
_handler_stream = logging.StreamHandler(_log_buffer)
_handler_console = logging.StreamHandler(sys.stdout)
_fmt = logging.Formatter("%(asctime)s %(levelname)s %(name)s: %(message)s")
_handler_stream.setFormatter(_fmt)
_handler_console.setFormatter(_fmt)
logging.basicConfig(level=logging.WARNING, handlers=[_handler_stream, _handler_console], force=True)
for _name in ("run", "universe", "fundamentals", "insiders", "score", "thesis", "metals", "history", "valuation_history", "thesis_history"):
    logging.getLogger(_name).setLevel(logging.INFO)
log = logging.getLogger("run")


def _flush_pipeline_log():
    try:
        os.makedirs(os.path.dirname(PIPELINE_LOG_PATH), exist_ok=True)
        with open(PIPELINE_LOG_PATH, "w") as f:
            f.write(_log_buffer.getvalue())
    except Exception:
        pass  # never let log-writing itself break the run

# Reference expense-ratio benchmarks by broad category, used only for the
# fee-audit "vs. category average" comparison. Figures are illustrative
# industry averages (ballpark, low single digits of a percent) roughly in
# line with published ICI Fact Book asset-weighted averages for US funds —
# NOT ticker-specific and NOT re-verified against a live source at run
# time. Treat the fee audit as directional, not authoritative; a user who
# needs an exact figure should check the fund's own prospectus.
CATEGORY_BENCHMARKS = {
    "index_equity": 0.0005,   # broad passive index funds/ETFs, ~5 bps
    "active_equity": 0.0066,  # actively managed equity funds, ~66 bps
    "sector_thematic": 0.0045,  # thematic/sector ETFs
    "bond": 0.0035,
}


def _json_safe(obj):
    """Recursively replaces NaN/Infinity floats with None. Python's json
    module happily writes the literal tokens NaN/Infinity by default
    (allow_nan=True) — those are NOT valid JSON per the spec, and
    browsers' JSON.parse rejects the entire file when it hits one. This
    is a last-line-of-defense sweep so a single bad float anywhere in
    the pipeline can't silently corrupt the whole stocks.json for every
    user, the way it did before this function existed."""
    if isinstance(obj, float):
        return obj if (obj == obj and obj not in (float("inf"), float("-inf"))) else None
    if isinstance(obj, dict):
        return {k: _json_safe(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [_json_safe(v) for v in obj]
    return obj


def main():
    universe = build_universe()
    all_tickers = sorted({t for tickers in universe.values() for t in tickers})
    log.info("Total universe: %d tickers", len(all_tickers))

    if not all_tickers:
        log.error("Empty universe — aborting without overwriting existing data/stocks.json")
        return

    raw = fetch_many(all_tickers)
    scored = score_universe(raw)

    us_tickers = [s.ticker for s in scored if "." not in s.ticker]
    insider_map = annotate_insiders(us_tickers)
    raw_by_ticker = {r.ticker: r for r in raw}
    today = datetime.date.today().isoformat()
    thesis_history = thesis_history_mod.load(THESIS_HISTORY_PATH)

    rows = []
    for s in scored:
        row = dataclasses.asdict(s)
        insider = insider_map.get(s.ticker, {"status": "not_available"})
        row["insider_status"] = insider.get("status", "not_available")
        row["insider_form4_count_30d"] = insider.get("form4_count_30d", "not_available")
        row["insider_buy_count_30d"] = insider.get("buy_count_30d")
        row["insider_sell_count_30d"] = insider.get("sell_count_30d")
        row["insider_buy_value_30d"] = insider.get("buy_value_30d")
        row["insider_sell_value_30d"] = insider.get("sell_value_30d")
        row["insider_net_value_30d"] = insider.get("net_value_30d")
        row["insider_transactions"] = insider.get("transactions", [])

        rm = raw_by_ticker.get(s.ticker)
        if rm is not None:
            row["quarterly_revenue"] = rm.quarterly_revenue
            row["quarterly_net_income"] = rm.quarterly_net_income
            row["quarterly_diluted_shares"] = rm.quarterly_diluted_shares
            row["revenue_yoy_latest"] = rm.revenue_yoy_latest
            row["revenue_yoy_prior"] = rm.revenue_yoy_prior
            row["revenue_yoy_acceleration_pp"] = rm.revenue_yoy_acceleration_pp
            row["net_income_yoy_latest"] = rm.net_income_yoy_latest
            row["net_income_yoy_prior"] = rm.net_income_yoy_prior
            row["net_income_yoy_acceleration_pp"] = rm.net_income_yoy_acceleration_pp
            row["diluted_shares_yoy"] = rm.diluted_shares_yoy
            row["net_margin_latest"] = rm.net_margin_latest
            row["net_margin_yoy_change_pp"] = rm.net_margin_yoy_change_pp
            row["net_margin_yoy_change_prior_pp"] = rm.net_margin_yoy_change_prior_pp
            row["repurchases_last_quarter"] = rm.repurchases_last_quarter
        row.update(classify_thesis(row))
        prev_date, prev_snapshot = thesis_history_mod.previous(thesis_history, s.ticker, today)
        row.update(evolve_thesis(row, prev_snapshot, prev_date))
        rows.append(row)

    payload = {
        "generated_at": datetime.datetime.utcnow().isoformat() + "Z",
        "universe_counts": {k: len(v) for k, v in universe.items()},
        "category_benchmarks": CATEGORY_BENCHMARKS,
        "methodology_note": (
            "Composite score is an unvalidated, explainable multi-factor blend of public "
            "fundamentals (quality, growth, balance sheet, cash flow, valuation and stability). "
            "Valuation context compares positive multiples with same-sector medians and also "
            "accumulates the scanner's own daily valuation observations over time. "
            "Not investment advice. See scripts/score.py for the exact "
            "formula and scripts/insiders.py + scripts/fundamentals.py "
            "for documented data limitations. The thesis taxonomy is deterministic and "
            "explainable (scripts/thesis.py), not a recommendation or forecast. Insider P/S signals are limited to "
            "open-market Form 4 transaction codes and quarterly growth/dilution and acceleration "
            "use up to the latest six Yahoo Finance quarters when available."
        ),
        "stocks": rows,
    }

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w") as f:
        json.dump(_json_safe(payload), f, indent=2)

    log.info("Wrote %d rows to %s", len(rows), OUT_PATH)

    metals_payload = build_metals_payload()
    with open(METALS_OUT_PATH, "w") as f:
        json.dump(_json_safe(metals_payload), f, indent=2)
    log.info("Wrote metals data to %s", METALS_OUT_PATH)

    history = history_mod.load(HISTORY_PATH)
    history = history_mod.update(history, rows, today)
    history_mod.save(history, HISTORY_PATH)

    valuation_history = valuation_history_mod.load(VALUATION_HISTORY_PATH)
    valuation_history = valuation_history_mod.update(valuation_history, rows, today)
    valuation_history_mod.save(valuation_history, VALUATION_HISTORY_PATH)

    thesis_history = thesis_history_mod.update(thesis_history, rows, today)
    thesis_history_mod.save(thesis_history, THESIS_HISTORY_PATH)


if __name__ == "__main__":
    try:
        main()
        # Clear any stale error log from a previous failed run so success
        # is unambiguous in the repo state.
        if os.path.exists(ERROR_LOG_PATH):
            os.remove(ERROR_LOG_PATH)
        _flush_pipeline_log()
    except Exception:
        os.makedirs(os.path.dirname(ERROR_LOG_PATH), exist_ok=True)
        with open(ERROR_LOG_PATH, "w") as f:
            f.write(f"Failed at {datetime.datetime.utcnow().isoformat()}Z\n\n")
            f.write(traceback.format_exc())
        traceback.print_exc()
        _flush_pipeline_log()
        sys.exit(1)
