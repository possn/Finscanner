"""Deterministic investment-thesis classifier for Finscanner.

This is a research taxonomy, not a recommendation engine. It converts the
already-calculated quantitative signals into an explainable archetype with
explicit supporting evidence and risks. Missing values never count as zero.
"""
from __future__ import annotations


def _n(v):
    try:
        return float(v) if v is not None else None
    except (TypeError, ValueError):
        return None


def _pct(v):
    v = _n(v)
    return None if v is None else v * 100.0


def _add(items, condition, text):
    if condition:
        items.append(text)


def classify(row: dict) -> dict:
    if row.get("quote_type") == "ETF":
        return {
            "thesis_type": "ETF",
            "thesis_slug": "etf",
            "thesis_confidence": "medium",
            "thesis_summary": "Fundo cotado; a taxonomia de teses empresariais não se aplica diretamente.",
            "thesis_evidence": [],
            "thesis_risks": [],
        }

    q = _n(row.get("quality_pct"))
    g = _n(row.get("growth_pct"))
    b = _n(row.get("balance_pct"))
    cf = _n(row.get("cashflow_pct"))
    v = _n(row.get("value_pct"))
    score = _n(row.get("score"))
    rev_yoy = _pct(row.get("revenue_yoy_latest"))
    ni_yoy = _pct(row.get("net_income_yoy_latest"))
    dilution = _pct(row.get("diluted_shares_yoy"))
    margin_delta = _n(row.get("net_margin_yoy_change_pp"))
    debt_equity = _n(row.get("debt_to_equity"))
    insider_net = _n(row.get("insider_net_value_30d"))
    insider_buys = _n(row.get("insider_buy_count_30d")) or 0
    coverage = _n(row.get("data_coverage_pct"))
    zombie = row.get("zombie") == "yes"

    # Priority matters: explicit risk archetypes outrank superficially attractive scores.
    if zombie or (v is not None and v >= 65 and ((q is not None and q < 40) or (g is not None and g < 30))):
        thesis_type, slug = "Value Trap Risk", "value-trap"
        summary = "O valuation parece apelativo, mas a qualidade, crescimento ou solvência levantam risco de armadilha de valor."
    elif (g is not None and g >= 65 or (rev_yoy is not None and rev_yoy >= 20)) and dilution is not None and dilution >= 8:
        thesis_type, slug = "High Growth / High Dilution", "growth-dilution"
        summary = "Crescimento forte, mas com aumento material do número de ações; importa avaliar criação de valor por ação."
    elif (g is not None and g >= 65 or (rev_yoy is not None and rev_yoy >= 20)) and ((b is not None and b < 40) or (debt_equity is not None and debt_equity > 150)):
        thesis_type, slug = "Leveraged Growth", "leveraged-growth"
        summary = "A empresa cresce, mas a estrutura de capital é mais frágil do que o perfil operacional."
    elif q is not None and q >= 70 and g is not None and g >= 55 and cf is not None and cf >= 55 and b is not None and b >= 55 and (dilution is None or dilution <= 5):
        thesis_type, slug = "Quality Compounder", "compounder"
        summary = "Qualidade, crescimento, cash flow e balanço combinam-se num perfil de possível compounder."
    elif q is not None and q >= 60 and g is not None and g >= 60 and v is not None and v >= 55:
        thesis_type, slug = "GARP", "garp"
        summary = "Crescimento e qualidade acima da média sem exigir um valuation extremo relativamente ao universo."
    elif v is not None and v >= 75 and q is not None and q >= 45 and not zombie:
        thesis_type, slug = "Deep Value", "deep-value"
        summary = "Valuation muito favorável no universo atual, com qualidade suficiente para justificar investigação adicional."
    elif rev_yoy is not None and rev_yoy >= 10 and ni_yoy is not None and ni_yoy > 0 and margin_delta is not None and margin_delta >= 2:
        thesis_type, slug = "Turnaround", "turnaround"
        summary = "Receitas, lucros e margens estão a melhorar simultaneamente, compatível com uma recuperação operacional."
    elif insider_net is not None and insider_net >= 100_000 and insider_buys >= 2:
        thesis_type, slug = "Insider Accumulation", "insider-accumulation"
        summary = "Compras open-market de insiders criam um sinal adicional de alinhamento, sem substituir a análise fundamental."
    elif score is not None and score >= 65:
        thesis_type, slug = "Balanced Candidate", "balanced"
        summary = "Perfil multifator favorável, mas sem concentração suficiente de sinais para uma tese mais específica."
    else:
        thesis_type, slug = "Watch / No Edge", "watch"
        summary = "Os dados atuais não mostram uma vantagem quantitativa suficientemente clara para uma tese forte."

    evidence, risks = [], []
    if q is not None and q >= 65:
        evidence.append(f"Qualidade no percentil {q:.0f} do universo.")
    if g is not None and g >= 65:
        evidence.append(f"Crescimento no percentil {g:.0f}.")
    if v is not None and v >= 65:
        evidence.append(f"Valuation no percentil {v:.0f} (mais atrativo é melhor).")
    if cf is not None and cf >= 65:
        evidence.append(f"Cash flow no percentil {cf:.0f}.")
    if b is not None and b >= 65:
        evidence.append(f"Balanço no percentil {b:.0f}.")
    if rev_yoy is not None and rev_yoy >= 10:
        evidence.append(f"Receita do último trimestre +{rev_yoy:.1f}% YoY.")
    if ni_yoy is not None and ni_yoy >= 10:
        evidence.append(f"Lucro líquido do último trimestre +{ni_yoy:.1f}% YoY.")
    if margin_delta is not None and margin_delta >= 1:
        evidence.append(f"Margem líquida melhorou {margin_delta:.1f} pp YoY.")
    if insider_net is not None and insider_net > 0 and insider_buys > 0:
        evidence.append("Fluxo líquido de insiders open-market positivo nos últimos 30 dias.")

    if zombie:
        risks.append("Cobertura de juros inferior a 1×.")
    if dilution is not None and dilution >= 5:
        risks.append(f"Ações diluídas aumentaram {dilution:.1f}% YoY.")
    if margin_delta is not None and margin_delta <= -2:
        risks.append(f"Margem líquida deteriorou {abs(margin_delta):.1f} pp YoY.")
    if b is not None and b < 35:
        risks.append(f"Balanço apenas no percentil {b:.0f}.")
    if g is not None and g < 30:
        risks.append(f"Crescimento apenas no percentil {g:.0f}.")
    if q is not None and q < 35:
        risks.append(f"Qualidade apenas no percentil {q:.0f}.")
    if insider_net is not None and insider_net < -100_000:
        risks.append("Fluxo líquido de insiders open-market negativo nos últimos 30 dias.")

    # Keep the UI concise and deterministic.
    evidence = evidence[:4]
    risks = risks[:4]
    if coverage is None or coverage < 40:
        confidence = "low"
    elif coverage >= 70 and len(evidence) >= 2:
        confidence = "high"
    else:
        confidence = "medium"

    return {
        "thesis_type": thesis_type,
        "thesis_slug": slug,
        "thesis_confidence": confidence,
        "thesis_summary": summary,
        "thesis_evidence": evidence,
        "thesis_risks": risks,
    }
