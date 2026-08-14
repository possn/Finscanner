(() => {
  "use strict";

  const state = { data: null, filtered: [], metals: null, activeView: "stocks" };

  const els = {
    list: document.getElementById("list"),
    search: document.getElementById("search"),
    marketFilter: document.getElementById("market-filter"),
    sortBy: document.getElementById("sort-by"),
    zombieOnly: document.getElementById("zombie-only"),
    generatedAt: document.getElementById("generated-at"),
    detail: document.getElementById("detail"),
    detailContent: document.getElementById("detail-content"),
    detailClose: document.getElementById("detail-close"),
    viewTitle: document.getElementById("view-title"),
    viewSub: document.getElementById("view-sub"),
    metalsList: document.getElementById("metals-list"),
    metalsNote: document.getElementById("metals-note"),
    sidenavItems: document.querySelectorAll(".sidenav-item"),
    views: document.querySelectorAll(".view"),
  };

  const VIEW_META = {
    stocks: { title: "Ações", sub: "dossiê diário · fontes gratuitas" },
    metals: { title: "Metais", sub: "futuros e proxies · fontes gratuitas" },
  };

  function switchView(view) {
    state.activeView = view;
    els.sidenavItems.forEach(btn => btn.classList.toggle("is-active", btn.dataset.view === view));
    els.views.forEach(sec => sec.classList.toggle("is-active", sec.id === `view-${view}`));
    els.viewTitle.textContent = VIEW_META[view].title;
    els.viewSub.textContent = VIEW_META[view].sub;
    updateGeneratedAt();
  }

  function updateGeneratedAt() {
    const src = state.activeView === "metals" ? state.metals : state.data;
    els.generatedAt.textContent = src
      ? "atualizado " + new Date(src.generated_at).toLocaleString("pt-PT")
      : "a carregar…";
  }

  els.sidenavItems.forEach(btn => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });

  function marketOf(ticker) {
    if (ticker.endsWith(".AX")) return "AU";
    if (ticker.endsWith(".WA")) return "PL";
    if (ticker.endsWith(".L")) return "UK";
    return "US";
  }

  function fmtCap(n) {
    if (n == null) return "—";
    if (n >= 1e9) return (n / 1e9).toFixed(1) + "B";
    if (n >= 1e6) return (n / 1e6).toFixed(0) + "M";
    return String(n);
  }

  function fmtPct(n) {
    if (n == null) return "—";
    return (n * 100).toFixed(1) + "%";
  }

  async function load() {
    try {
      const res = await fetch("data/stocks.json", { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      state.data = await res.json();
      if (state.activeView === "stocks") updateGeneratedAt();
      applyFilters();
    } catch (e) {
      els.list.innerHTML = `<p class="empty-state">Não foi possível carregar data/stocks.json.<br>Corre o pipeline (scripts/run.py) pelo menos uma vez.</p>`;
      console.error(e);
    }
  }

  async function loadMetals() {
    try {
      const res = await fetch("data/metals.json", { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      state.metals = await res.json();
      if (state.activeView === "metals") updateGeneratedAt();
      renderMetals();
    } catch (e) {
      els.metalsList.innerHTML = `<p class="empty-state">Não foi possível carregar data/metals.json.<br>Corre o pipeline (scripts/run.py) pelo menos uma vez.</p>`;
      console.error(e);
    }
  }

  function renderMetals() {
    if (!state.metals || !state.metals.instruments || !state.metals.instruments.length) {
      els.metalsList.innerHTML = `<p class="empty-state">Sem dados de metais ainda. Corre o pipeline.</p>`;
      els.metalsNote.textContent = "";
      return;
    }
    els.metalsNote.textContent = state.metals.note || "";
    els.metalsList.innerHTML = state.metals.instruments.map(metalCardHtml).join("");
  }

  function metalCardHtml(inst) {
    const d = inst.data;
    if (!d) {
      return `
        <div class="metal-card">
          <div class="metal-head"><span class="metal-label">${inst.label}</span></div>
          <p class="empty-state" style="padding:0.5rem 0;">sem dados</p>
        </div>`;
    }
    const changeClass = d.day_change_pct == null ? "" : d.day_change_pct >= 0 ? "up" : "down";
    const changeSign = d.day_change_pct == null ? "" : d.day_change_pct >= 0 ? "+" : "";
    return `
      <div class="metal-card">
        <div class="metal-head">
          <span class="metal-label">${inst.label}</span>
          <span>
            <span class="metal-price">${d.price} <span style="font-size:0.65rem;color:var(--ink-muted);">${inst.unit}</span></span>
            <span class="metal-change ${changeClass}">${changeSign}${d.day_change_pct ?? "—"}%</span>
          </span>
        </div>
        <div class="metal-meta">
          <span>90d: ${d.range_90d_low}–${d.range_90d_high}</span>
          <span>vol. anualizada: ${d.volatility_annualized_pct ?? "—"}%</span>
        </div>
        ${inst.kind === "etf_proxy" ? `<span class="metal-proxy-tag">proxy ETF, não é preço spot</span>` : ""}
      </div>`;
  }

  function applyFilters() {
    if (!state.data) return;
    const q = els.search.value.trim().toUpperCase();
    const market = els.marketFilter.value;
    const zombieOnly = els.zombieOnly.checked;

    let rows = state.data.stocks.filter(r => {
      if (market && marketOf(r.ticker) !== market) return false;
      if (zombieOnly && r.zombie !== "yes") return false;
      if (q && !(r.ticker.toUpperCase().includes(q) || (r.name || "").toUpperCase().includes(q))) return false;
      return true;
    });

    const sort = els.sortBy.value;
    rows.sort((a, b) => {
      if (sort === "score-desc") return (b.score ?? -1) - (a.score ?? -1);
      if (sort === "score-asc") return (a.score ?? 999) - (b.score ?? 999);
      if (sort === "ticker-asc") return a.ticker.localeCompare(b.ticker);
      if (sort === "cap-desc") return (b.market_cap ?? 0) - (a.market_cap ?? 0);
      return 0;
    });

    state.filtered = rows;
    render();
  }

  function render() {
    if (!state.filtered.length) {
      els.list.innerHTML = `<p class="empty-state">Sem resultados para este filtro.</p>`;
      return;
    }
    els.list.innerHTML = state.filtered.map(r => cardHtml(r)).join("");
    els.list.querySelectorAll(".card").forEach(card => {
      card.addEventListener("click", () => openDetail(card.dataset.ticker));
    });
  }

  function cardHtml(r) {
    const stampClass = r.score == null ? "stamp na" : "stamp";
    const stampText = r.score == null ? "N/A" : Math.round(r.score);
    const flags = [];
    if (r.zombie === "yes") flags.push(`<span class="badge zombie">zombie</span>`);
    if (typeof r.insider_form4_count_30d === "number" && r.insider_form4_count_30d > 0) {
      flags.push(`<span class="badge insider">${r.insider_form4_count_30d} form4 · 30d</span>`);
    }
    if (r.data_confidence === "low") flags.push(`<span class="badge low-confidence">dados limitados</span>`);

    return `
      <article class="card" data-ticker="${r.ticker}" tabindex="0">
        <div class="${stampClass}">${stampText}</div>
        <div class="card-main">
          <div class="card-ticker">${r.ticker}</div>
          <div class="card-name">${r.name || "—"}</div>
        </div>
        <div class="card-flags">${flags.join("")}</div>
      </article>
    `;
  }

  function openDetail(ticker) {
    const r = state.data.stocks.find(s => s.ticker === ticker);
    if (!r) return;

    const zombieLabel = { yes: "SIM — cobertura de juros < 1×", no: "não", unknown: "desconhecido (dados em falta)" }[r.zombie];
    const insider = typeof r.insider_form4_count_30d === "number"
      ? `${r.insider_form4_count_30d} filings Form 4 (30 dias)`
      : "não disponível (mercado fora dos EUA — EDGAR é só SEC/EUA)";

    els.detailContent.innerHTML = `
      <h2 style="font-family:var(--font-display);margin:0 0 0.9rem;">${r.ticker} <span style="color:var(--ink-muted);font-weight:400;font-size:0.85rem;">${r.name || ""}</span></h2>
      <div class="detail-row"><span>Score composto</span><span>${r.score ?? "N/A"}</span></div>
      <div class="detail-row"><span>Confiança dos dados</span><span>${r.data_confidence}</span></div>
      <div class="detail-row"><span>Setor</span><span>${r.sector || "—"}</span></div>
      <div class="detail-row"><span>Market cap</span><span>${fmtCap(r.market_cap)}</span></div>
      <div class="detail-row"><span>Rentabilidade (percentil)</span><span>${r.profitability_pct ?? "—"}</span></div>
      <div class="detail-row"><span>Alavancagem (percentil)</span><span>${r.leverage_pct ?? "—"}</span></div>
      <div class="detail-row"><span>Valorização (percentil)</span><span>${r.value_pct ?? "—"}</span></div>
      <div class="detail-row"><span>Estabilidade (percentil)</span><span>${r.stability_pct ?? "—"}</span></div>
      <div class="detail-row"><span>Zombie (cobertura de juros)</span><span>${zombieLabel}</span></div>
      <div class="detail-row"><span>Cobertura de juros (EBIT/juros)</span><span>${r.interest_coverage ?? "—"}</span></div>
      <div class="detail-row"><span>Atividade insiders</span><span>${insider}</span></div>
      ${r.quote_type === "ETF" ? `
        <div class="detail-row"><span>Expense ratio</span><span>${fmtPct(r.expense_ratio)}</span></div>
        <div class="detail-row"><span>Exposição AI (top holdings)</span><span>${r.ai_exposure_pct != null ? r.ai_exposure_pct + "%" : "sem dados"}</span></div>
      ` : ""}
      <p class="detail-note">Score não validado nem sujeito a backtest — resumo estruturado de fundamentais públicos, não é aconselhamento financeiro. Metodologia completa em scripts/score.py.</p>
    `;
    els.detail.hidden = false;
  }

  els.detailClose.addEventListener("click", () => { els.detail.hidden = true; });
  els.detail.addEventListener("click", (e) => { if (e.target === els.detail) els.detail.hidden = true; });

  [els.search, els.marketFilter, els.sortBy, els.zombieOnly].forEach(el => {
    el.addEventListener("input", applyFilters);
    el.addEventListener("change", applyFilters);
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js").catch(err => console.warn("SW registration failed", err));
    });
  }

  load();
  loadMetals();
})();
