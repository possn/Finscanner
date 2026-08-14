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
import json
import logging
import os
import sys
import traceback

from fundamentals import fetch_many
from insiders import annotate as annotate_insiders
from metals import build_metals_payload
from score import score_universe
from universe import build_universe

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
log = logging.getLogger("run")

OUT_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "stocks.json")
METALS_OUT_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "metals.json")
ERROR_LOG_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "last_error.log")

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

    rows = []
    for s in scored:
        row = dataclasses.asdict(s)
        row["insider_form4_count_30d"] = insider_map.get(s.ticker, "not_available")
        rows.append(row)

    payload = {
        "generated_at": datetime.datetime.utcnow().isoformat() + "Z",
        "universe_counts": {k: len(v) for k, v in universe.items()},
        "category_benchmarks": CATEGORY_BENCHMARKS,
        "methodology_note": (
            "Composite score is an unvalidated, weighted blend of public "
            "fundamentals (profitability, leverage, value, stability). "
            "Not investment advice. See scripts/score.py for the exact "
            "formula and scripts/insiders.py + scripts/fundamentals.py "
            "for documented data limitations."
        ),
        "stocks": rows,
    }

    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w") as f:
        json.dump(payload, f, indent=2)

    log.info("Wrote %d rows to %s", len(rows), OUT_PATH)

    metals_payload = build_metals_payload()
    with open(METALS_OUT_PATH, "w") as f:
        json.dump(metals_payload, f, indent=2)
    log.info("Wrote metals data to %s", METALS_OUT_PATH)


if __name__ == "__main__":
    try:
        main()
        # Clear any stale error log from a previous failed run so success
        # is unambiguous in the repo state.
        if os.path.exists(ERROR_LOG_PATH):
            os.remove(ERROR_LOG_PATH)
    except Exception:
        os.makedirs(os.path.dirname(ERROR_LOG_PATH), exist_ok=True)
        with open(ERROR_LOG_PATH, "w") as f:
            f.write(f"Failed at {datetime.datetime.utcnow().isoformat()}Z\n\n")
            f.write(traceback.format_exc())
        traceback.print_exc()
        sys.exit(1)
