(() => {
  "use strict";

  const state = { data: null, filtered: [], metals: null, history: null, activeView: "stocks" };

  const els = {
    list: document.getElementById("list"),
    search: document.getElementById("search"),
    marketFilter: document.getElementById("market-filter"),
    sortBy: document.getElementById("sort-by"),
    zombieOnly: document.getElementById("zombie-only"),
    watchlistOnly: document.getElementById("watchlist-only"),
    generatedAt: document.getElementById("generated-at"),
    detail: document.getElementById("detail"),
    detailContent: document.getElementById("detail-content"),
    detailClose: document.getElementById("detail-close"),
    viewTitle: document.getElementById("view-title"),
    viewSub: document.getElementById("view-sub"),
    metalsList: document.getElementById("metals-list"),
    metalsNote: document.getElementById("metals-note"),
    portfolioList: document.getElementById("portfolio-list"),
    portfolioSummary: document.getElementById("portfolio-summary"),
    exposurePanel: document.getElementById("exposure-panel"),
    portfolioFile: document.getElementById("portfolio-file"),
    portfolioClear: document.getElementById("portfolio-clear"),
    sidenavItems: document.querySelectorAll(".sidebar__item[data-view]"),
    views: document.querySelectorAll(".view"),
    sidebar: document.getElementById("sidebar"),
    sidebarBackdrop: document.getElementById("sidebar-backdrop"),
    menuBtn: document.getElementById("menu-btn"),
    sidebarClose: document.getElementById("sidebar-close"),
    mobileTitle: document.getElementById("mobile-title"),
    themeToggle: document.getElementById("theme-toggle"),
    themeIcon: document.getElementById("theme-icon"),
    themeLabel: document.getElementById("theme-label"),
    marketStats: document.getElementById("market-stats"),
    insightStrip: document.getElementById("insight-strip"),
    resultCount: document.getElementById("result-count"),
  };

  const VIEW_META = {
    stocks: { title: "Ações", sub: "dossiê diário · fontes gratuitas" },
    metals: { title: "Metais", sub: "futuros e proxies · fontes gratuitas" },
    portfolio: { title: "O meu portfolio", sub: "guardado só neste dispositivo (localStorage)" },
  };

  // ---------- localStorage: portfolio (owned) + watchlist (starred) ----------
  // Both are plain ticker->true maps, kept only on this device. No server,
  // no sync between devices — that would need a backend, which breaks the
  // "free, static site" constraint.
  const LS_PORTFOLIO = "finscanner:portfolio";
  const LS_WATCHLIST = "finscanner:watchlist";

  function lsGet(key) {
    try { return JSON.parse(localStorage.getItem(key) || "{}"); }
    catch { return {}; }
  }
  function lsSet(key, obj) {
    try { localStorage.setItem(key, JSON.stringify(obj)); } catch (e) { console.warn("localStorage write failed", e); }
  }
  // Portfolio entries are objects: { qty: number|null, value: number|null }.
  // `true` (from the old boolean "owned" toggle) is treated as qty:1 for
  // backward compatibility with positions marked before the import
  // feature existed.
  function isOwned(ticker) { return !!lsGet(LS_PORTFOLIO)[ticker]; }
  function isWatched(ticker) { return !!lsGet(LS_WATCHLIST)[ticker]; }
  function toggleOwned(ticker) {
    const p = lsGet(LS_PORTFOLIO);
    if (p[ticker]) delete p[ticker]; else p[ticker] = true;
    lsSet(LS_PORTFOLIO, p);
  }
  function toggleWatched(ticker) {
    const w = lsGet(LS_WATCHLIST);
    if (w[ticker]) delete w[ticker]; else w[ticker] = true;
    lsSet(LS_WATCHLIST, w);
  }

  function switchView(view) {
    state.activeView = view;
    els.sidenavItems.forEach(btn => btn.classList.toggle("sidebar__item--ativo", btn.dataset.view === view));
    els.views.forEach(sec => sec.classList.toggle("is-active", sec.id === `view-${view}`));
    els.viewTitle.textContent = VIEW_META[view].title;
    els.viewSub.textContent = VIEW_META[view].sub;
    els.mobileTitle.textContent = VIEW_META[view].title;
    updateGeneratedAt();
    if (view === "portfolio") renderPortfolio();
    closeMobileSidebar();
  }

  function openMobileSidebar() {
    els.sidebar.classList.add("sidebar--aberta");
    els.sidebarBackdrop.hidden = false;
  }
  function closeMobileSidebar() {
    els.sidebar.classList.remove("sidebar--aberta");
    els.sidebarBackdrop.hidden = true;
  }
  els.menuBtn.addEventListener("click", openMobileSidebar);
  els.sidebarClose.addEventListener("click", closeMobileSidebar);
  els.sidebarBackdrop.addEventListener("click", closeMobileSidebar);

  // ---------- Theme (light/dark), persisted ----------
  const LS_THEME = "finscanner:theme";
  function applyTheme(theme) {
    if (theme === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
      els.themeIcon.textContent = "☀";
      els.themeLabel.textContent = "Modo claro";
    } else {
      document.documentElement.removeAttribute("data-theme");
      els.themeIcon.textContent = "☾";
      els.themeLabel.textContent = "Modo escuro";
    }
  }
  function initTheme() {
    const saved = localStorage.getItem(LS_THEME);
    if (saved) { applyTheme(saved); return; }
    const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
  }
  els.themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(LS_THEME, next); } catch (e) { /* ignore */ }
  });
  initTheme();

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

  function fmtRawPct(n) {
    if (n == null || !Number.isFinite(Number(n))) return "—";
    return (Number(n) * 100).toFixed(1) + "%";
  }

  function fmtRatio(n, digits = 1) {
    if (n == null || !Number.isFinite(Number(n))) return "—";
    return Number(n).toFixed(digits) + "×";
  }

  function fmtMoney(n, currency = "") {
    if (n == null || !Number.isFinite(Number(n))) return "—";
    const abs = Math.abs(Number(n));
    const sign = Number(n) < 0 ? "−" : "";
    const suffix = abs >= 1e9 ? (abs/1e9).toFixed(1)+"B" : abs >= 1e6 ? (abs/1e6).toFixed(1)+"M" : abs.toLocaleString("pt-PT", {maximumFractionDigits:0});
    return `${sign}${suffix}${currency ? " " + currency : ""}`;
  }

  function investmentVerdict(r) {
    if (r.quote_type === "ETF") return {label:"ETF", cls:"neutral", text:"Avaliação por métricas de fundo."};
    if (r.zombie === "yes") return {label:"Evitar / investigar", cls:"weak", text:"Cobertura de juros inferior a 1× limita qualquer conclusão positiva do score."};
    const s = Number(r.score);
    const cov = Number(r.data_coverage_pct);
    if (!Number.isFinite(s)) return {label:"Sem conclusão", cls:"neutral", text:"Dados insuficientes para um verdict quantitativo."};
    if (Number.isFinite(cov) && cov < 40) return {label:"Dados insuficientes", cls:"neutral", text:"A cobertura de dados é demasiado baixa para sustentar a classificação."};
    if (s >= 75) return {label:"Candidato forte", cls:"excellent", text:"Perfil multifator de topo; merece análise fundamental completa antes de qualquer decisão."};
    if (s >= 65) return {label:"Interessante", cls:"good", text:"Combinação favorável de qualidade, crescimento, balanço, cash flow e valuation."};
    if (s >= 50) return {label:"Neutro", cls:"neutral", text:"Não existe vantagem multifator suficientemente forte neste universo."};
    return {label:"Fraco", cls:"weak", text:"O conjunto atual de métricas apresenta mais fragilidades do que vantagens relativas."};
  }

  async function load() {
    try {
      const res = await fetch("data/stocks.json", { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      state.data = await res.json();
      if (state.activeView === "stocks") updateGeneratedAt();
      renderMarketOverview();
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

  async function loadHistory() {
    try {
      const res = await fetch("data/history.json", { cache: "no-store" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      state.history = await res.json();
    } catch (e) {
      state.history = {};
      console.warn("history.json unavailable yet", e);
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


  function scoreBand(score) {
    if (score == null) return { label: "Sem classificação", cls: "neutral" };
    if (score >= 75) return { label: "Excelente", cls: "excellent" };
    if (score >= 65) return { label: "Atrativa", cls: "good" };
    if (score >= 50) return { label: "Neutra", cls: "neutral" };
    return { label: "Frágil", cls: "weak" };
  }

  function renderMarketOverview() {
    if (!state.data?.stocks?.length) return;
    const rows = state.data.stocks;
    const scored = rows.filter(r => Number.isFinite(r.score));
    const sortedScores = scored.map(r => r.score).sort((a,b)=>a-b);
    const median = sortedScores.length ? sortedScores[Math.floor(sortedScores.length/2)] : null;
    const quality = scored.filter(r => r.score >= 70).length;
    els.marketStats.innerHTML = `
      <div class="hero-stat"><span>Universo</span><strong>${rows.length}</strong></div>
      <div class="hero-stat"><span>Score ≥ 70</span><strong>${quality}</strong></div>
      <div class="hero-stat"><span>Score mediano</span><strong>${median == null ? "—" : median.toFixed(1)}</strong></div>`;

    const candidates = scored
      .filter(r => r.zombie !== "yes" && r.data_confidence !== "low")
      .sort((a,b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, 3);
    els.insightStrip.innerHTML = candidates.map((r, i) => {
      const band = scoreBand(r.score);
      const why = i === 0 ? "Maior score do universo filtrado" :
        (r.profitability_pct >= 70 ? "Rentabilidade acima da maioria" :
        (r.stability_pct >= 70 ? "Estabilidade operacional elevada" : "Perfil composto equilibrado"));
      return `<button class="insight-card" data-ticker="${r.ticker}">
        <span class="insight-card__rank">0${i+1}</span>
        <span class="insight-card__body"><strong>${r.ticker}</strong><small>${r.name || ""}</small><em>${why}</em></span>
        <span class="score-pill ${band.cls}">${Math.round(r.score)}</span>
      </button>`;
    }).join("");
    els.insightStrip.querySelectorAll(".insight-card").forEach(btn => btn.addEventListener("click", () => openDetail(btn.dataset.ticker)));
  }

  function applyFilters() {
    if (!state.data) return;
    const q = els.search.value.trim().toUpperCase();
    const market = els.marketFilter.value;
    const zombieOnly = els.zombieOnly.checked;
    const watchlistOnly = els.watchlistOnly.checked;

    let rows = state.data.stocks.filter(r => {
      if (market && marketOf(r.ticker) !== market) return false;
      if (zombieOnly && r.zombie !== "yes") return false;
      if (watchlistOnly && !isWatched(r.ticker)) return false;
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
    if (els.resultCount) els.resultCount.textContent = `${rows.length} resultados`;
    render(els.list, state.filtered);
  }

  function render(container, rows) {
    if (!rows.length) {
      container.innerHTML = `<p class="empty-state">Sem resultados para este filtro.</p>`;
      return;
    }
    container.innerHTML = rows.map(r => cardHtml(r)).join("");
    container.querySelectorAll(".card").forEach(card => {
      card.addEventListener("click", (e) => {
        if (e.target.closest(".star-btn")) return; // star handled separately
        openDetail(card.dataset.ticker);
      });
    });
    container.querySelectorAll(".star-btn").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleWatched(btn.dataset.ticker);
        btn.classList.toggle("is-active");
        btn.textContent = btn.classList.contains("is-active") ? "★" : "☆";
        if (els.watchlistOnly.checked) applyFilters();
      });
    });
  }

  function cardHtml(r) {
    const flags = [];
    if (r.zombie === "yes") flags.push(`<span class="badge zombie">risco financeiro</span>`);
    if (r.data_confidence === "low") flags.push(`<span class="badge low-confidence">dados limitados</span>`);
    if (isOwned(r.ticker)) flags.push(`<span class="badge owned">na carteira</span>`);
    const starred = isWatched(r.ticker);
    const verdict = investmentVerdict(r);
    const metrics = [
      ["Qualidade", r.quality_pct ?? r.profitability_pct],
      ["Crescimento", r.growth_pct],
      ["Balanço", r.balance_pct ?? r.leverage_pct],
      ["Cash flow", r.cashflow_pct],
      ["Valor", r.value_pct],
      ["Estabilidade", r.stability_pct],
    ];
    return `
      <article class="card stock-card" data-ticker="${r.ticker}" tabindex="0">
        <div class="stock-card__identity">
          <div class="company-mark">${r.ticker.replace(/\..*/, '').slice(0,2)}</div>
          <div class="card-main">
            <div class="card-ticker">${r.ticker} <button class="star-btn ${starred ? 'is-active' : ''}" data-ticker="${r.ticker}" aria-label="Watchlist">${starred ? "★" : "☆"}</button></div>
            <div class="card-name">${r.name || "—"}</div>
            <div class="card-sector">${r.sector || "Sem setor"}${r.industry ? " · " + r.industry : ""} · ${marketOf(r.ticker)}</div>
          </div>
        </div>
        <div class="metric-ribbon">${metrics.map(([label,val]) => `<div><span>${label}</span><strong>${val == null ? "—" : Math.round(val)}</strong></div>`).join("")}</div>
        <div class="stock-card__verdict">
          <span class="score-pill ${verdict.cls}">${r.score == null ? "—" : Math.round(r.score)}</span>
          <strong>${verdict.label}</strong>
          <small>${r.current_price != null ? r.current_price + (r.currency ? " " + r.currency : "") : fmtCap(r.market_cap)}</small>
          <div class="card-flags">${flags.join("")}</div>
        </div>
      </article>`;
  }

  // ---------- score history sparkline (plain <canvas>, no chart library) ----------
  function drawSparkline(canvas, series) {
    const dates = Object.keys(series).sort();
    if (dates.length < 2) return false;
    const values = dates.map(d => series[d]);
    const min = Math.min(...values), max = Math.max(...values);
    const w = canvas.width, h = canvas.height;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = "#C9A063";
    ctx.lineWidth = 2;
    ctx.beginPath();
    values.forEach((v, i) => {
      const x = (i / (values.length - 1)) * (w - 4) + 2;
      const y = max === min ? h / 2 : h - 2 - ((v - min) / (max - min)) * (h - 4);
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
    return true;
  }

  function openDetail(ticker) {
    const r = state.data.stocks.find(s => s.ticker === ticker);
    if (!r) return;

    const zombieLabel = { yes: "SIM — cobertura de juros < 1×", no: "não", unknown: "desconhecido" }[r.zombie];
    const insider = typeof r.insider_form4_count_30d === "number"
      ? `${r.insider_form4_count_30d} filings Form 4 (30 dias)`
      : "não disponível";
    const owned = isOwned(r.ticker);
    const series = (state.history && state.history[r.ticker]) || {};
    const hasHistory = Object.keys(series).length >= 2;
    const verdict = investmentVerdict(r);
    const dimensions = [
      ["Qualidade", r.quality_pct ?? r.profitability_pct],
      ["Crescimento", r.growth_pct],
      ["Balanço", r.balance_pct ?? r.leverage_pct],
      ["Cash flow", r.cashflow_pct],
      ["Valor", r.value_pct],
      ["Estabilidade", r.stability_pct],
    ];
    const dimHtml = dimensions.map(([label,val]) => `<div class="dimension"><span>${label}</span><strong>${val == null ? "—" : Math.round(val)}</strong><i><b style="width:${Math.max(0,Math.min(100,Number(val)||0))}%"></b></i></div>`).join("");

    els.detailContent.innerHTML = `
      <div class="detail-hero">
        <div><span class="eyebrow">INVESTMENT DOSSIER</span><h2>${r.ticker}</h2><p>${r.name || ""}</p><small>${r.sector || "—"}${r.industry ? " · " + r.industry : ""}</small></div>
        <div class="detail-score ${verdict.cls}"><strong>${r.score ?? "—"}</strong><span>${verdict.label}</span></div>
      </div>
      <div class="verdict-panel ${verdict.cls}"><strong>${verdict.label}</strong><p>${verdict.text}</p><span>Cobertura de dados: ${r.data_coverage_pct ?? "—"}% · confiança ${r.data_confidence || "—"}</span></div>
      <label class="owned-toggle"><input type="checkbox" id="owned-checkbox" ${owned ? "checked" : ""}><span>Tenho esta posição (guardado só neste dispositivo)</span></label>
      ${hasHistory ? `<canvas id="sparkline" width="300" height="48" class="sparkline"></canvas><p class="detail-note" style="margin-top:0.2rem;">tendência do score, últimos ${Object.keys(series).length} dias com dados</p>` : ""}

      <h3 class="dossier-title">Score por dimensão</h3>
      <div class="dimension-grid">${dimHtml}</div>

      <h3 class="dossier-title">Qualidade & crescimento</h3>
      <div class="dossier-grid">
        <div><span>ROE</span><strong>${fmtRawPct(r.roe)}</strong></div><div><span>ROA</span><strong>${fmtRawPct(r.roa)}</strong></div>
        <div><span>Margem líquida</span><strong>${fmtRawPct(r.profit_margin)}</strong></div><div><span>Margem operacional</span><strong>${fmtRawPct(r.operating_margin)}</strong></div>
        <div><span>Margem bruta</span><strong>${fmtRawPct(r.gross_margin)}</strong></div><div><span>Crescimento receita</span><strong>${fmtRawPct(r.revenue_growth)}</strong></div>
        <div><span>Crescimento lucros</span><strong>${fmtRawPct(r.earnings_growth)}</strong></div><div><span>Crescimento EPS trimestral</span><strong>${fmtRawPct(r.earnings_quarterly_growth)}</strong></div>
      </div>

      <h3 class="dossier-title">Cash flow & balanço</h3>
      <div class="dossier-grid">
        <div><span>Free cash flow</span><strong>${fmtMoney(r.free_cash_flow, r.currency)}</strong></div><div><span>FCF yield</span><strong>${fmtRawPct(r.fcf_yield)}</strong></div>
        <div><span>Operating cash flow</span><strong>${fmtMoney(r.operating_cash_flow, r.currency)}</strong></div><div><span>Net cash</span><strong>${fmtMoney(r.net_cash, r.currency)}</strong></div>
        <div><span>Current ratio</span><strong>${fmtRatio(r.current_ratio)}</strong></div><div><span>Quick ratio</span><strong>${fmtRatio(r.quick_ratio)}</strong></div>
        <div><span>Dívida / equity</span><strong>${r.debt_to_equity == null ? "—" : Number(r.debt_to_equity).toFixed(1)}</strong></div><div><span>Cobertura de juros</span><strong>${fmtRatio(r.interest_coverage)}</strong></div>
      </div>

      <h3 class="dossier-title">Valuation & retorno ao acionista</h3>
      <div class="dossier-grid">
        <div><span>P/E trailing</span><strong>${fmtRatio(r.trailing_pe)}</strong></div><div><span>P/E forward</span><strong>${fmtRatio(r.forward_pe)}</strong></div>
        <div><span>Price / book</span><strong>${fmtRatio(r.price_to_book)}</strong></div><div><span>EV / EBITDA</span><strong>${fmtRatio(r.enterprise_to_ebitda)}</strong></div>
        <div><span>PEG</span><strong>${r.peg_ratio == null ? "—" : Number(r.peg_ratio).toFixed(2)}</strong></div><div><span>Dividend yield</span><strong>${fmtRawPct(r.dividend_yield)}</strong></div>
        <div><span>Payout ratio</span><strong>${fmtRawPct(r.payout_ratio)}</strong></div><div><span>Beta</span><strong>${r.beta == null ? "—" : Number(r.beta).toFixed(2)}</strong></div>
      </div>

      <h3 class="dossier-title">Risco & contexto</h3>
      <div class="detail-row"><span>Zombie (cobertura de juros)</span><span>${zombieLabel}</span></div>
      <div class="detail-row"><span>Atividade insiders</span><span>${insider}</span></div>
      <div class="detail-row"><span>Market cap</span><span>${fmtCap(r.market_cap)}</span></div>
      <div class="detail-row"><span>Preço atual</span><span>${r.current_price ?? "—"} ${r.currency || ""}</span></div>
      ${r.quote_type === "ETF" ? `<div class="detail-row"><span>Expense ratio</span><span>${fmtPct(r.expense_ratio)}</span></div><div class="detail-row"><span>Exposição AI</span><span>${r.ai_exposure_pct != null ? r.ai_exposure_pct + "%" : "—"}</span></div>` : ""}
      <p class="detail-note">O verdict é uma classificação quantitativa explicável e relativa ao universo analisado. Não constitui previsão de retorno nem aconselhamento financeiro.</p>
    `;
    els.detail.hidden = false;

    document.getElementById("owned-checkbox").addEventListener("change", () => {
      toggleOwned(r.ticker);
      if (state.activeView === "stocks") applyFilters();
    });
    if (hasHistory) drawSparkline(document.getElementById("sparkline"), series);
  }

  // ---------- Portfolio import (CSV/JSON) ----------
  // Mirrors the AI_EXPOSED_TICKERS set in scripts/score.py — kept in sync
  // by hand since the two run in completely different environments
  // (Python pipeline vs. browser).
  const AI_EXPOSED_TICKERS = new Set([
    "MSFT", "NVDA", "GOOGL", "GOOG", "AMZN", "META", "ORCL", "AVGO",
    "AMD", "PLTR", "CRM", "NOW", "SNOW", "SMCI", "ARM", "TSM", "ASML",
  ]);

  function parseCsvPortfolio(text) {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (!lines.length) return {};
    const header = lines[0].split(",").map(h => h.trim().toLowerCase());
    const tickerIdx = header.findIndex(h => ["ticker", "symbol"].includes(h));
    const qtyIdx = header.findIndex(h => ["quantity", "qty", "shares", "units"].includes(h));
    const valueIdx = header.findIndex(h => ["value", "amount", "market_value"].includes(h));
    if (tickerIdx === -1) throw new Error("Coluna 'ticker' ou 'symbol' não encontrada no cabeçalho do CSV.");

    const portfolio = {};
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map(c => c.trim());
      const ticker = cols[tickerIdx]?.toUpperCase();
      if (!ticker) continue;
      const qty = qtyIdx !== -1 ? parseFloat(cols[qtyIdx]) : null;
      const value = valueIdx !== -1 ? parseFloat(cols[valueIdx]) : null;
      portfolio[ticker] = {
        qty: Number.isFinite(qty) ? qty : null,
        value: Number.isFinite(value) ? value : null,
      };
    }
    return portfolio;
  }

  function parseJsonPortfolio(text) {
    const data = JSON.parse(text);
    const portfolio = {};
    if (Array.isArray(data)) {
      for (const row of data) {
        const ticker = (row.ticker || row.symbol || "").toUpperCase();
        if (!ticker) continue;
        const qty = Number(row.quantity ?? row.qty ?? row.shares ?? row.units);
        const value = Number(row.value ?? row.amount ?? row.market_value);
        portfolio[ticker] = {
          qty: Number.isFinite(qty) ? qty : null,
          value: Number.isFinite(value) ? value : null,
        };
      }
    } else if (data && typeof data === "object") {
      for (const [ticker, v] of Object.entries(data)) {
        const upper = ticker.toUpperCase();
        if (typeof v === "number") {
          portfolio[upper] = { qty: v, value: null };
        } else if (v && typeof v === "object") {
          const qty = Number(v.quantity ?? v.qty ?? v.shares);
          const value = Number(v.value ?? v.amount);
          portfolio[upper] = {
            qty: Number.isFinite(qty) ? qty : null,
            value: Number.isFinite(value) ? value : null,
          };
        }
      }
    }
    return portfolio;
  }

  function handlePortfolioFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result);
        const portfolio = file.name.toLowerCase().endsWith(".json")
          ? parseJsonPortfolio(text)
          : parseCsvPortfolio(text);
        if (!Object.keys(portfolio).length) {
          alert("Não encontrei nenhuma posição válida no ficheiro.");
          return;
        }
        lsSet(LS_PORTFOLIO, portfolio);
        renderPortfolio();
      } catch (e) {
        alert("Erro a ler o ficheiro: " + e.message);
        console.error(e);
      }
    };
    reader.readAsText(file);
  }

  // Position value: explicit `value` wins; otherwise qty × current_price
  // from stocks.json (when we have a price for that ticker); otherwise
  // null (position is counted but excluded from the value-weighted bars).
  function positionValue(entry, stockRow) {
    if (entry && typeof entry === "object") {
      if (entry.value != null) return entry.value;
      if (entry.qty != null && stockRow?.current_price != null) return entry.qty * stockRow.current_price;
    }
    return null;
  }

  function renderExposure(portfolio, matchedRows) {
    if (!Object.keys(portfolio).length) {
      els.exposurePanel.innerHTML = "";
      return;
    }
    const rowByTicker = Object.fromEntries(matchedRows.map(r => [r.ticker, r]));
    const entries = Object.entries(portfolio).map(([ticker, entry]) => {
      const row = rowByTicker[ticker];
      const val = positionValue(entry, row);
      return { ticker, row, val };
    });

    const valued = entries.filter(e => e.val != null && e.val > 0);
    const totalValue = valued.reduce((s, e) => s + e.val, 0);
    const unmatchedCount = entries.filter(e => !e.row).length;
    const noValueCount = entries.filter(e => e.row && e.val == null).length;

    if (!valued.length) {
      els.exposurePanel.innerHTML = `
        <div class="exposure-block">
          <p class="unmatched-note">
            Sem dados suficientes para calcular exposição ponderada por valor
            (${unmatchedCount} ticker(s) fora do universo rastreado, ${noValueCount} sem preço/quantidade/valor).
            A lista de posições abaixo continua a mostrar o que temos por ticker.
          </p>
        </div>`;
      return;
    }

    // Sector breakdown (Yahoo Finance's own sector taxonomy — Technology,
    // Consumer Cyclical, Financial Services, Basic Materials, etc.)
    const bySector = {};
    for (const e of valued) {
      const sector = e.row ? (e.row.sector || "Sem setor / ETF") : "Fora do universo rastreado";
      bySector[sector] = (bySector[sector] || 0) + e.val;
    }
    const sectorRows = Object.entries(bySector).sort((a, b) => b[1] - a[1]);

    // AI exposure: direct AI-flagged equities + weighted ETF ai_exposure_pct
    const aiValue = valued.reduce((sum, e) => {
      if (AI_EXPOSED_TICKERS.has(e.ticker)) return sum + e.val;
      if (e.row?.quote_type === "ETF" && e.row.ai_exposure_pct != null) {
        return sum + e.val * (e.row.ai_exposure_pct / 100);
      }
      return sum;
    }, 0);
    const aiPct = (aiValue / totalValue) * 100;

    const sectorBars = sectorRows.map(([sector, val]) => {
      const pct = (val / totalValue) * 100;
      return `
        <div class="exposure-row">
          <span class="exposure-label">${sector}</span>
          <span class="exposure-bar-track"><span class="exposure-bar-fill" style="width:${pct.toFixed(1)}%"></span></span>
          <span class="exposure-pct">${pct.toFixed(1)}%</span>
        </div>`;
    }).join("");

    els.exposurePanel.innerHTML = `
      <div class="exposure-block">
        <h3 class="exposure-title">Exposição por setor (ponderada por valor)</h3>
        ${sectorBars}
        <div class="exposure-row" style="margin-top:0.5rem;">
          <span class="exposure-label">Exposição a IA</span>
          <span class="exposure-bar-track"><span class="exposure-bar-fill ai" style="width:${Math.min(aiPct,100).toFixed(1)}%"></span></span>
          <span class="exposure-pct">${aiPct.toFixed(1)}%</span>
        </div>
        <p class="unmatched-note">
          Valor total considerado: ${totalValue.toLocaleString("pt-PT", {maximumFractionDigits:0})}
          (${valued.length} de ${entries.length} posições com valor calculável).
          ${unmatchedCount ? `${unmatchedCount} ticker(s) fora do universo rastreado — sem setor/score.` : ""}
          ${noValueCount ? `${noValueCount} posição(ões) sem quantidade nem valor explícito — não entram no peso.` : ""}
          Exposição IA é direta (ações da lista fixa de nomes ligados a IA) + indireta via <code>ai_exposure_pct</code> de ETFs que possuis; não faz look-through a fundos que não tenham essa métrica.
        </p>
      </div>`;
  }

  // ---------- Portfolio view ----------
  function renderPortfolio() {
    if (!state.data) return;
    const portfolio = lsGet(LS_PORTFOLIO);
    const ownedTickers = Object.keys(portfolio);
    const rows = state.data.stocks.filter(r => ownedTickers.includes(r.ticker));

    renderExposure(portfolio, rows);

    if (!rows.length) {
      els.portfolioSummary.innerHTML = "";
      els.portfolioList.innerHTML = ownedTickers.length
        ? `<p class="empty-state">${ownedTickers.length} ticker(s) importado(s), mas nenhum está no universo rastreado atualmente (fora do S&amp;P 500 / small-cap EUA / ASX200 / WIG20 / FTSE100).</p>`
        : `<p class="empty-state">Ainda não marcaste nenhuma posição. Importa um ficheiro acima, ou abre um ticker em Ações e toca em "Tenho esta posição".</p>`;
      return;
    }

    const equities = rows.filter(r => r.quote_type !== "ETF");
    const etfs = rows.filter(r => r.quote_type === "ETF");
    const scored = equities.filter(r => r.score != null);
    const avgScore = scored.length ? (scored.reduce((s, r) => s + r.score, 0) / scored.length).toFixed(1) : "—";
    const zombieCount = equities.filter(r => r.zombie === "yes").length;
    const feesWithData = etfs.filter(r => r.expense_ratio != null);
    const avgFee = feesWithData.length ? (feesWithData.reduce((s, r) => s + r.expense_ratio, 0) / feesWithData.length) : null;
    const aiWithData = etfs.filter(r => r.ai_exposure_pct != null);
    const avgAi = aiWithData.length ? (aiWithData.reduce((s, r) => s + r.ai_exposure_pct, 0) / aiWithData.length) : null;

    els.portfolioSummary.innerHTML = `
      <div class="summary-grid">
        <div class="summary-item"><span class="summary-label">posições marcadas</span><span class="summary-value">${rows.length}</span></div>
        <div class="summary-item"><span class="summary-label">score médio (ações)</span><span class="summary-value">${avgScore}</span></div>
        <div class="summary-item"><span class="summary-label">zombies na carteira</span><span class="summary-value ${zombieCount > 0 ? 'alert' : ''}">${zombieCount}</span></div>
        <div class="summary-item"><span class="summary-label">expense ratio médio (ETFs)</span><span class="summary-value">${avgFee != null ? fmtPct(avgFee) : "sem dados"}</span></div>
        <div class="summary-item"><span class="summary-label">exposição AI média (ETFs)</span><span class="summary-value">${avgAi != null ? avgAi.toFixed(1) + "%" : "sem dados"}</span></div>
      </div>
      <p class="detail-note">Cálculo simples (não ponderado por quantidade — o Finscanner não pede número de unidades, só se possuis ou não).</p>
    `;
    render(els.portfolioList, rows);
  }

  els.detailClose.addEventListener("click", () => { els.detail.hidden = true; });
  els.detail.addEventListener("click", (e) => { if (e.target === els.detail) els.detail.hidden = true; });

  els.portfolioFile.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) handlePortfolioFile(file);
    e.target.value = ""; // allow re-selecting the same file
  });

  els.portfolioClear.addEventListener("click", () => {
    if (!confirm("Limpar todo o portfolio importado/marcado?")) return;
    lsSet(LS_PORTFOLIO, {});
    renderPortfolio();
  });

  [els.search, els.marketFilter, els.sortBy, els.zombieOnly, els.watchlistOnly].forEach(el => {
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
  loadHistory();
})();
