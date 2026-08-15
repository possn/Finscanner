"""
fundamentals.py — pulls raw market/fundamental metrics per ticker from yfinance.

All fields are nullable by design. Yahoo/yfinance coverage varies materially by
country and security type; missing data must never be interpreted as zero.
"""
from __future__ import annotations

import logging
import time
from dataclasses import dataclass, field

import yfinance as yf

log = logging.getLogger("fundamentals")


@dataclass
class RawMetrics:
    ticker: str
    name: str | None = None
    sector: str | None = None
    industry: str | None = None
    market_cap: float | None = None
    currency: str | None = None
    quote_type: str | None = None

    # profitability / quality
    roe: float | None = None
    roa: float | None = None
    profit_margin: float | None = None
    operating_margin: float | None = None
    gross_margin: float | None = None

    # growth
    revenue_growth: float | None = None
    earnings_growth: float | None = None
    earnings_quarterly_growth: float | None = None

    # quarterly growth / shareholder structure intelligence
    quarterly_revenue: list[dict] = field(default_factory=list)
    quarterly_net_income: list[dict] = field(default_factory=list)
    quarterly_diluted_shares: list[dict] = field(default_factory=list)
    revenue_yoy_latest: float | None = None
    revenue_yoy_prior: float | None = None
    revenue_yoy_acceleration_pp: float | None = None
    net_income_yoy_latest: float | None = None
    net_income_yoy_prior: float | None = None
    net_income_yoy_acceleration_pp: float | None = None
    diluted_shares_yoy: float | None = None
    net_margin_latest: float | None = None
    net_margin_yoy_change_pp: float | None = None
    net_margin_yoy_change_prior_pp: float | None = None
    repurchases_last_quarter: float | None = None

    # cash flow
    free_cash_flow: float | None = None
    operating_cash_flow: float | None = None

    # cash / leverage
    current_ratio: float | None = None
    quick_ratio: float | None = None
    debt_to_equity: float | None = None
    total_cash: float | None = None
    total_debt: float | None = None
    ebit: float | None = None
    interest_expense: float | None = None

    # valuation
    trailing_pe: float | None = None
    forward_pe: float | None = None
    price_to_book: float | None = None
    enterprise_to_ebitda: float | None = None
    peg_ratio: float | None = None
    current_price: float | None = None

    # shareholder return
    dividend_yield: float | None = None
    payout_ratio: float | None = None

    # market risk
    beta: float | None = None

    # bank-specific statement-derived metrics (proxies, not regulatory ratios)
    net_interest_income: float | None = None
    net_interest_income_yoy: float | None = None
    efficiency_ratio_proxy: float | None = None
    provision_for_credit_losses: float | None = None
    provision_to_revenue: float | None = None
    equity_to_assets: float | None = None
    total_assets: float | None = None
    stockholders_equity: float | None = None
    bank_metric_coverage_pct: float | None = None

    # REIT-specific statement-derived metrics. FFO is an explicit proxy built
    # from public GAAP statements; AFFO/NAV/occupancy are never fabricated.
    ebitda: float | None = None
    reit_ffo_proxy: float | None = None
    reit_ffo_per_share_proxy: float | None = None
    reit_p_ffo_proxy: float | None = None
    reit_ffo_payout_proxy: float | None = None
    reit_net_debt_to_ebitda: float | None = None
    reit_depreciation_amortization: float | None = None
    reit_gain_loss_sale_adjustment: float | None = None
    reit_metric_coverage_pct: float | None = None

    # Insurance-specific statement-derived proxies. These are deliberately
    # labelled proxies because generic Yahoo statements do not expose
    # regulator-specific solvency metrics consistently across jurisdictions.
    insurance_net_investment_income: float | None = None
    insurance_claims_benefits: float | None = None
    insurance_claims_to_revenue: float | None = None
    insurance_operating_expense: float | None = None
    insurance_operating_ratio_proxy: float | None = None
    insurance_book_value_per_share_proxy: float | None = None
    insurance_equity_to_assets: float | None = None
    insurance_metric_coverage_pct: float | None = None

    # ETF-specific. FundsData is optional and Yahoo coverage varies by listing.
    expense_ratio: float | None = None
    top_holdings: list[dict] = field(default_factory=list)
    fund_family: str | None = None
    fund_category: str | None = None
    fund_legal_type: str | None = None
    fund_inception_date: str | None = None
    fund_description: str | None = None
    fund_total_assets: float | None = None
    fund_asset_classes: dict = field(default_factory=dict)
    fund_sector_weightings: dict = field(default_factory=dict)

    error: str | None = None


def _safe_get(d: dict, *keys, default=None):
    for k in keys:
        v = d.get(k)
        if v is not None:
            return v
    return default


def _as_float(x):
    if x is None:
        return None
    try:
        f = float(x)
    except (TypeError, ValueError):
        return None
    if f != f or f in (float("inf"), float("-inf")):
        return None
    return f



def _row_value(frame, labels, col_index=0):
    if frame is None or getattr(frame, "empty", True):
        return None
    for label in labels:
        if label in frame.index:
            try:
                return _as_float(frame.loc[label].iloc[col_index])
            except Exception:
                return None
    return None


def _row_series(frame, labels, limit=6):
    if frame is None or getattr(frame, "empty", True):
        return []
    for label in labels:
        if label in frame.index:
            vals=[]
            for c in list(frame.columns)[:limit]:
                try:
                    v=_as_float(frame.loc[label, c])
                    vals.append(v)
                except Exception:
                    vals.append(None)
            return vals
    return []


def fetch_one(ticker: str) -> RawMetrics:
    m = RawMetrics(ticker=ticker)
    try:
        t = yf.Ticker(ticker)
        info = t.info or {}

        m.name = info.get("shortName") or info.get("longName")
        m.sector = info.get("sector")
        m.industry = info.get("industry")
        m.currency = info.get("currency")
        m.quote_type = info.get("quoteType")
        m.market_cap = _as_float(info.get("marketCap"))
        m.current_price = _as_float(_safe_get(info, "currentPrice", "regularMarketPrice", "previousClose"))

        # quality / profitability
        m.roe = _as_float(info.get("returnOnEquity"))
        m.roa = _as_float(info.get("returnOnAssets"))
        m.profit_margin = _as_float(info.get("profitMargins"))
        m.operating_margin = _as_float(info.get("operatingMargins"))
        m.gross_margin = _as_float(info.get("grossMargins"))

        # growth
        m.revenue_growth = _as_float(info.get("revenueGrowth"))
        m.earnings_growth = _as_float(info.get("earningsGrowth"))
        m.earnings_quarterly_growth = _as_float(info.get("earningsQuarterlyGrowth"))

        # cash flow
        m.free_cash_flow = _as_float(info.get("freeCashflow"))
        m.operating_cash_flow = _as_float(info.get("operatingCashflow"))

        # balance sheet
        m.current_ratio = _as_float(info.get("currentRatio"))
        m.quick_ratio = _as_float(info.get("quickRatio"))
        m.debt_to_equity = _as_float(info.get("debtToEquity"))
        m.total_cash = _as_float(info.get("totalCash"))
        m.total_debt = _as_float(info.get("totalDebt"))
        m.ebitda = _as_float(info.get("ebitda"))

        # valuation
        m.trailing_pe = _as_float(info.get("trailingPE"))
        m.forward_pe = _as_float(info.get("forwardPE"))
        m.price_to_book = _as_float(info.get("priceToBook"))
        m.enterprise_to_ebitda = _as_float(info.get("enterpriseToEbitda"))
        m.peg_ratio = _as_float(info.get("pegRatio"))

        # shareholder return / risk
        m.dividend_yield = _as_float(info.get("dividendYield"))
        m.payout_ratio = _as_float(info.get("payoutRatio"))
        m.beta = _as_float(info.get("beta"))

        if m.quote_type == "ETF":
            # Yahoo reports fund expense ratios in percentage points (e.g. 0.03 = 0.03%).
            m.expense_ratio = _as_float(_safe_get(info, "annualReportExpenseRatio", "netExpenseRatio"))
            m.fund_family = _safe_get(info, "fundFamily", "fundFamilyName")
            m.fund_category = _safe_get(info, "category", "fundCategory")
            m.fund_legal_type = info.get("legalType")
            m.fund_total_assets = _as_float(_safe_get(info, "totalAssets", "netAssets"))
            inception = info.get("fundInceptionDate")
            if inception is not None:
                try:
                    import datetime as _dt
                    m.fund_inception_date = _dt.datetime.utcfromtimestamp(float(inception)).date().isoformat()
                except Exception:
                    m.fund_inception_date = str(inception)
            try:
                funds_data = t.funds_data
                if funds_data is not None:
                    try:
                        m.fund_description = funds_data.description or None
                    except Exception:
                        pass
                    try:
                        overview = funds_data.fund_overview or {}
                        if isinstance(overview, dict):
                            m.fund_family = m.fund_family or overview.get("family") or overview.get("fundFamily")
                            m.fund_category = m.fund_category or overview.get("categoryName") or overview.get("category")
                            m.fund_legal_type = m.fund_legal_type or overview.get("legalType")
                    except Exception:
                        pass
                    try:
                        ac = funds_data.asset_classes or {}
                        if isinstance(ac, dict):
                            m.fund_asset_classes = {str(k): _as_float(v) for k,v in ac.items() if _as_float(v) is not None}
                    except Exception:
                        pass
                    try:
                        sw = funds_data.sector_weightings or {}
                        if isinstance(sw, dict):
                            m.fund_sector_weightings = {str(k): _as_float(v) for k,v in sw.items() if _as_float(v) is not None}
                    except Exception:
                        pass
                    try:
                        th = funds_data.top_holdings
                        if th is not None and not th.empty and "Holding Percent" in th.columns:
                            holdings=[]
                            for symbol, row in th.iterrows():
                                weight=_as_float(row.get("Holding Percent"))
                                if weight is None: continue
                                holdings.append({"symbol": str(symbol), "name": str(row.get("Name") or symbol), "weight": weight})
                            m.top_holdings = holdings
                    except Exception as e:
                        log.debug("%s: no top holdings data (%s)", ticker, e)
            except Exception as e:
                log.debug("%s: no funds data (%s)", ticker, e)
        else:
            # Quarterly trajectory: latest five quarters allow a like-for-like YoY
            # comparison (Q0 vs Q4) without pretending sequential seasonality is growth.
            try:
                qfin = t.quarterly_financials
                if qfin is not None and not qfin.empty:
                    cols = list(qfin.columns)[:6]

                    def series_for(labels):
                        for label in labels:
                            if label in qfin.index:
                                vals = []
                                for c in cols:
                                    v = _as_float(qfin.loc[label, c])
                                    vals.append({"date": str(getattr(c, "date", lambda: c)()), "value": v})
                                return vals
                        return []

                    m.quarterly_revenue = series_for(("Total Revenue", "Operating Revenue"))
                    m.quarterly_net_income = series_for(("Net Income", "Net Income Common Stockholders"))
                    m.quarterly_diluted_shares = series_for(("Diluted Average Shares", "Basic Average Shares"))

                    def yoy_at(series, offset=0):
                        old = offset + 4
                        if len(series) > old and series[offset]["value"] is not None and series[old]["value"] not in (None, 0):
                            return series[offset]["value"] / series[old]["value"] - 1.0
                        return None

                    m.revenue_yoy_latest = yoy_at(m.quarterly_revenue, 0)
                    m.revenue_yoy_prior = yoy_at(m.quarterly_revenue, 1)
                    if m.revenue_yoy_latest is not None and m.revenue_yoy_prior is not None:
                        m.revenue_yoy_acceleration_pp = (m.revenue_yoy_latest - m.revenue_yoy_prior) * 100.0
                    m.net_income_yoy_latest = yoy_at(m.quarterly_net_income, 0)
                    m.net_income_yoy_prior = yoy_at(m.quarterly_net_income, 1)
                    if m.net_income_yoy_latest is not None and m.net_income_yoy_prior is not None:
                        m.net_income_yoy_acceleration_pp = (m.net_income_yoy_latest - m.net_income_yoy_prior) * 100.0
                    m.diluted_shares_yoy = yoy_at(m.quarterly_diluted_shares, 0)

                    if m.quarterly_revenue and m.quarterly_net_income and m.quarterly_revenue[0]["value"] not in (None, 0) and m.quarterly_net_income[0]["value"] is not None:
                        m.net_margin_latest = m.quarterly_net_income[0]["value"] / m.quarterly_revenue[0]["value"]
                    if len(m.quarterly_revenue) >= 5 and len(m.quarterly_net_income) >= 5 and m.quarterly_revenue[4]["value"] not in (None, 0) and m.quarterly_net_income[4]["value"] is not None:
                        old_margin = m.quarterly_net_income[4]["value"] / m.quarterly_revenue[4]["value"]
                        if m.net_margin_latest is not None:
                            m.net_margin_yoy_change_pp = (m.net_margin_latest - old_margin) * 100.0
                    if (len(m.quarterly_revenue) >= 6 and len(m.quarterly_net_income) >= 6
                            and m.quarterly_revenue[1]["value"] not in (None, 0)
                            and m.quarterly_revenue[5]["value"] not in (None, 0)
                            and m.quarterly_net_income[1]["value"] is not None
                            and m.quarterly_net_income[5]["value"] is not None):
                        prev_margin = m.quarterly_net_income[1]["value"] / m.quarterly_revenue[1]["value"]
                        prev_old_margin = m.quarterly_net_income[5]["value"] / m.quarterly_revenue[5]["value"]
                        m.net_margin_yoy_change_prior_pp = (prev_margin - prev_old_margin) * 100.0
            except Exception as e:
                log.debug("%s: quarterly financials unavailable (%s)", ticker, e)

            # Latest quarterly repurchases are read from the cash-flow statement.
            # Yahoo commonly stores repurchases as a negative financing cash flow;
            # expose a positive absolute amount to the UI for readability.
            try:
                qcf = t.quarterly_cashflow
                if qcf is not None and not qcf.empty:
                    for label in ("Repurchase Of Capital Stock", "Repurchase Of Stock"):
                        if label in qcf.index:
                            v = _as_float(qcf.loc[label].iloc[0])
                            if v is not None:
                                m.repurchases_last_quarter = abs(v)
                            break
            except Exception as e:
                log.debug("%s: quarterly cashflow unavailable (%s)", ticker, e)

            # Interest coverage is derived from the latest income statement.
            try:
                fin = t.financials
                if fin is not None and not fin.empty:
                    for label in ("EBIT", "Operating Income"):
                        if label in fin.index:
                            m.ebit = _as_float(fin.loc[label].iloc[0])
                            break
                    for label in ("Interest Expense", "Interest Expense Non Operating"):
                        if label in fin.index:
                            val = _as_float(fin.loc[label].iloc[0])
                            m.interest_expense = abs(val) if val is not None else None
                            break
            except Exception as e:
                log.debug("%s: financials unavailable (%s)", ticker, e)

            # Bank-native proxies from public financial statements. These are
            # intentionally labelled proxies: CET1 and NPL ratios require
            # regulatory filings and are NOT inferred from generic statements.
            sector = (m.sector or "").lower()
            industry = (m.industry or "").lower()
            is_bank = "financial" in sector and any(k in industry for k in ("bank", "credit", "savings", "thrift"))
            if is_bank:
                try:
                    qfin = t.quarterly_financials
                    fin = t.financials
                    bs = t.balance_sheet

                    nii_series = _row_series(qfin, ("Net Interest Income", "Net Interest Income After Provision"), 6)
                    if nii_series:
                        m.net_interest_income = nii_series[0]
                        if len(nii_series) >= 5 and nii_series[0] is not None and nii_series[4] not in (None, 0):
                            m.net_interest_income_yoy = nii_series[0] / nii_series[4] - 1.0

                    latest_revenue = _row_value(fin, ("Total Revenue", "Operating Revenue"))
                    latest_opex = _row_value(fin, ("Operating Expense", "Total Operating Expenses", "Non Interest Expense"))
                    if latest_revenue not in (None, 0) and latest_opex is not None:
                        m.efficiency_ratio_proxy = abs(latest_opex) / abs(latest_revenue)

                    provision = _row_value(fin, ("Provision For Loan Losses", "Provision for Credit Losses", "Credit Losses Provision"))
                    if provision is not None:
                        m.provision_for_credit_losses = abs(provision)
                        if latest_revenue not in (None, 0):
                            m.provision_to_revenue = abs(provision) / abs(latest_revenue)

                    m.total_assets = _row_value(bs, ("Total Assets",))
                    m.stockholders_equity = _row_value(bs, ("Stockholders Equity", "Total Equity Gross Minority Interest", "Common Stock Equity"))
                    if m.total_assets not in (None, 0) and m.stockholders_equity is not None:
                        m.equity_to_assets = m.stockholders_equity / m.total_assets

                    bank_vals = [m.net_interest_income, m.net_interest_income_yoy, m.efficiency_ratio_proxy,
                                 m.provision_to_revenue, m.equity_to_assets]
                    m.bank_metric_coverage_pct = sum(v is not None for v in bank_vals) / len(bank_vals) * 100.0
                except Exception as e:
                    log.debug("%s: bank proxy metrics unavailable (%s)", ticker, e)

            # Insurance-native public-statement proxies. Generic Yahoo statements
            # vary materially between life, P&C and reinsurance businesses, so
            # these are intentionally conservative and never presented as
            # regulatory solvency ratios or as a reported combined ratio.
            is_insurance = "financial" in sector and any(k in industry for k in ("insurance", "insur"))
            if is_insurance:
                try:
                    fin = t.financials
                    bs = t.balance_sheet

                    latest_revenue = _row_value(fin, ("Total Revenue", "Operating Revenue"))
                    m.insurance_net_investment_income = _row_value(fin, (
                        "Net Investment Income", "Investment Income", "Net Investment Income Net"
                    ))
                    claims = _row_value(fin, (
                        "Policyholder Benefits", "Policyholder Benefits And Claims Payable",
                        "Losses And Loss Adjustment Expenses", "Loss And Loss Adjustment Expense",
                        "Insurance And Claims"
                    ))
                    if claims is not None:
                        m.insurance_claims_benefits = abs(claims)
                        if latest_revenue not in (None, 0):
                            m.insurance_claims_to_revenue = abs(claims) / abs(latest_revenue)

                    opex = _row_value(fin, (
                        "Operating Expense", "Total Operating Expenses",
                        "Selling General And Administration", "General And Administrative Expense"
                    ))
                    if opex is not None:
                        m.insurance_operating_expense = abs(opex)
                    # This ratio is a broad cost-load proxy only. It is NOT a
                    # statutory combined ratio because generic statements do not
                    # reliably separate earned premium, claims and acquisition costs.
                    if latest_revenue not in (None, 0) and claims is not None and opex is not None:
                        m.insurance_operating_ratio_proxy = (abs(claims) + abs(opex)) / abs(latest_revenue)

                    total_assets = _row_value(bs, ("Total Assets",))
                    equity = _row_value(bs, (
                        "Stockholders Equity", "Total Equity Gross Minority Interest", "Common Stock Equity"
                    ))
                    if total_assets not in (None, 0) and equity is not None:
                        m.insurance_equity_to_assets = equity / total_assets

                    diluted = _row_value(fin, ("Diluted Average Shares", "Basic Average Shares"))
                    if equity is not None and diluted not in (None, 0):
                        m.insurance_book_value_per_share_proxy = equity / diluted

                    ins_vals = [
                        m.insurance_net_investment_income, m.insurance_claims_to_revenue,
                        m.insurance_operating_ratio_proxy, m.insurance_book_value_per_share_proxy,
                        m.insurance_equity_to_assets,
                    ]
                    m.insurance_metric_coverage_pct = sum(v is not None for v in ins_vals) / len(ins_vals) * 100.0
                except Exception as e:
                    log.debug("%s: insurance proxy metrics unavailable (%s)", ticker, e)

            # REIT-native public-statement proxies. NAREIT FFO requires net income
            # adjusted for real-estate depreciation/amortisation and gains/losses
            # on property sales. Yahoo does not consistently expose every
            # component, so this remains explicitly labelled an FFO proxy. AFFO,
            # NAV and occupancy are not inferred.
            is_reit = "real estate" in sector or "reit" in industry
            if is_reit:
                try:
                    fin = t.financials
                    cf = t.cashflow
                    net_income = _row_value(fin, ("Net Income", "Net Income Common Stockholders"))
                    dep_amort = _row_value(cf, (
                        "Depreciation And Amortization",
                        "Depreciation Amortization Depletion",
                        "Depreciation",
                    ))
                    sale_adj = _row_value(cf, (
                        "Gain Loss On Sale Of PPE",
                        "Gain Loss On Sale Of Property Plant Equipment",
                        "Gain Loss On Sale Of Assets",
                    ))
                    m.reit_depreciation_amortization = abs(dep_amort) if dep_amort is not None else None
                    m.reit_gain_loss_sale_adjustment = sale_adj
                    if net_income is not None and dep_amort is not None:
                        # Cash-flow reconciliation normally reports gains as a
                        # negative adjustment and losses as positive, matching
                        # the FFO add-back/subtraction direction.
                        m.reit_ffo_proxy = net_income + abs(dep_amort) + (sale_adj or 0.0)

                    diluted = _row_value(fin, ("Diluted Average Shares", "Basic Average Shares"))
                    if m.reit_ffo_proxy is not None and diluted not in (None, 0):
                        m.reit_ffo_per_share_proxy = m.reit_ffo_proxy / diluted
                        if m.current_price is not None and m.reit_ffo_per_share_proxy > 0:
                            m.reit_p_ffo_proxy = m.current_price / m.reit_ffo_per_share_proxy

                    dividends_paid = _row_value(cf, ("Cash Dividends Paid", "Common Stock Dividend Paid"))
                    if m.reit_ffo_proxy not in (None, 0) and dividends_paid is not None and m.reit_ffo_proxy > 0:
                        m.reit_ffo_payout_proxy = abs(dividends_paid) / m.reit_ffo_proxy

                    if m.ebitda not in (None, 0) and m.ebitda > 0 and (m.total_debt is not None or m.total_cash is not None):
                        net_debt = (m.total_debt or 0.0) - (m.total_cash or 0.0)
                        m.reit_net_debt_to_ebitda = net_debt / m.ebitda

                    reit_vals = [m.reit_ffo_proxy, m.reit_p_ffo_proxy, m.reit_ffo_payout_proxy,
                                 m.reit_net_debt_to_ebitda, m.dividend_yield]
                    m.reit_metric_coverage_pct = sum(v is not None for v in reit_vals) / len(reit_vals) * 100.0
                except Exception as e:
                    log.debug("%s: REIT proxy metrics unavailable (%s)", ticker, e)

    except Exception as e:
        m.error = str(e)
        log.warning("%s: fetch failed (%s)", ticker, e)

    return m


def fetch_many(tickers: list[str], pause: float = 0.15) -> list[RawMetrics]:
    results = []
    for i, tk in enumerate(tickers):
        results.append(fetch_one(tk))
        if pause:
            time.sleep(pause)
        if (i + 1) % 50 == 0:
            log.info("fetched %d/%d", i + 1, len(tickers))
    return results
