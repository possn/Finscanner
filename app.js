(() => {
  "use strict";

  const state = { data: null, filtered: [], metals: null, fx: null, history: null, valuationHistory: null, thesisHistory: null, news: null, activeView: "home", portfolioFilter: "all", thesisScope: "all", thesisDirectionFilter: "all" };

  const els = {
    list: document.getElementById("list"),
    search: document.getElementById("search"),
    marketFilter: document.getElementById("market-filter"),
    stocksSectorFilter: document.getElementById("stocks-sector-filter"),
    sortBy: document.getElementById("sort-by"),
    zombieOnly: document.getElementById("zombie-only"),
    watchlistOnly: document.getElementById("watchlist-only"),
    generatedAt: document.getElementById("generated-at"),
    startupStatus: document.getElementById("startup-status"),
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
    portfolioFilters: document.getElementById("portfolio-filters"),
    portfolioThesisMonitor: document.getElementById("portfolio-thesis-monitor"),
    thesisScopeFilters: document.getElementById("thesis-scope-filters"),
    thesisDirectionFilters: document.getElementById("thesis-direction-filters"),
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
    opportunityGrid: document.getElementById("opportunity-grid"),
    fundsList: document.getElementById("funds-list"),
    fundsCount: document.getElementById("funds-count"),
    fundsSearch: document.getElementById("funds-search"),
    fundsSectorFilter: document.getElementById("funds-sector-filter"),
    fundsRegionFilter: document.getElementById("funds-region-filter"),
    newsList: document.getElementById("news-list"),
    newsSearch: document.getElementById("news-search"),
    smartmoneyList: document.getElementById("smartmoney-list"),
    thesesList: document.getElementById("theses-list"),
    compareInput: document.getElementById("compare-input"),
    compareList: document.getElementById("compare-list"),
    bottomNavItems: document.querySelectorAll(".bottom-nav button[data-view]"),
    globalSearchBtn: document.getElementById("global-search-btn"),
    briefingCard: document.getElementById("briefing-card"),
    briefingGreeting: document.getElementById("briefing-greeting"),
  };

  function on(el, event, handler) {
    if (el) el.addEventListener(event, handler);
  }

  const VIEW_META = {
    home: { title: "Home", sub: "briefing diário" },
    stocks: { title: "Ações", sub: "dossiê diário · fontes gratuitas" },
    metals: { title: "Metais", sub: "futuros e proxies · fontes gratuitas" },
    portfolio: { title: "O meu portfolio", sub: "guardado só neste dispositivo (localStorage)" },
    funds: { title: "ETFs", sub: "fundos cotados no universo rastreado" },
    news: { title: "Notícias", sub: "posições, watchlist, ou pesquisa manual" },
    smartmoney: { title: "Smart Money", sub: "atividade de insiders · SEC Form 4" },
    theses: { title: "Teses", sub: "arquétipos quantitativos · hipóteses explicáveis" },
    compare: { title: "Comparar", sub: "comparação multifator lado a lado" },
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
    if (!VIEW_META[view]) return;
    state.activeView = view;
    els.sidenavItems.forEach(btn => btn.classList.toggle("sidebar__item--ativo", btn.dataset.view === view));
    els.bottomNavItems?.forEach(btn => btn.classList.toggle("is-active", btn.dataset.view === view));
    els.views.forEach(sec => sec.classList.toggle("is-active", sec.id === `view-${view}`));
    if (els.viewTitle) els.viewTitle.textContent = VIEW_META[view].title;
    if (els.viewSub) els.viewSub.textContent = VIEW_META[view].sub;
    if (els.mobileTitle) els.mobileTitle.textContent = VIEW_META[view].title;
    updateGeneratedAt();
    renderActiveView();
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
  on(els.menuBtn, "click", openMobileSidebar);
  on(els.sidebarClose, "click", closeMobileSidebar);
  on(els.sidebarBackdrop, "click", closeMobileSidebar);

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
  on(els.themeToggle, "click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    const next = isDark ? "light" : "dark";
    applyTheme(next);
    try { localStorage.setItem(LS_THEME, next); } catch (e) { /* ignore */ }
  });
  initTheme();

  function updateGeneratedAt() {
    if (!els.generatedAt) return;
    const src = state.activeView === "metals" ? state.metals : state.data;
    if (!src?.generated_at) {
      els.generatedAt.textContent = state.activeView === "metals" ? "metais a carregar…" : "dados a carregar…";
      return;
    }
    const d = new Date(src.generated_at);
    els.generatedAt.textContent = Number.isNaN(d.getTime()) ? "dados carregados" : "atualizado " + d.toLocaleString("pt-PT");
  }

  function setStartupStatus(message = "", isError = false) {
    if (!els.startupStatus) return;
    els.startupStatus.hidden = !message;
    els.startupStatus.textContent = message;
    els.startupStatus.classList.toggle("startup-status--error", !!isError);
  }

  function renderActiveView() {
    const v = state.activeView;
    if (v === "home") renderHome();
    else if (v === "stocks") { renderMarketOverview(); applyFilters(); }
    else if (v === "portfolio") renderPortfolio();
    else if (v === "funds") renderFunds();
    else if (v === "news") renderNews();
    else if (v === "smartmoney") renderSmartMoney();
    else if (v === "theses") renderTheses();
    else if (v === "compare") renderCompare();
  }

  els.sidenavItems.forEach(btn => {
    btn.addEventListener("click", () => switchView(btn.dataset.view));
  });

  els.bottomNavItems?.forEach(btn => {
    btn.addEventListener("click", () => {
      const v = btn.dataset.view;
      if (v === "more") return openMobileSidebar();
      switchView(v);
    });
  });
  on(els.globalSearchBtn, "click", () => { switchView("stocks"); setTimeout(() => { els.search?.focus(); window.scrollTo({top:0,behavior:"smooth"}); }, 50); });

  document.querySelectorAll(".orientation-card[data-goto]").forEach(btn => {
    btn.addEventListener("click", () => switchView(btn.dataset.goto));
  });

  function renderHome() {
    if (els.briefingGreeting) {
      const h = new Date().getHours();
      els.briefingGreeting.textContent = h < 12 ? "Bom dia" : h < 19 ? "Boa tarde" : "Boa noite";
    }
    if (!els.briefingCard || !state.data?.stocks?.length) return;
    const rows = state.data.stocks.filter(r => r.quote_type !== "ETF" && Number.isFinite(Number(r.score)));
    const strengthen = rows.filter(r => r.thesis_direction === "strengthening").sort((a,b)=>(b.thesis_score_delta||0)-(a.thesis_score_delta||0))[0];
    const insider = rows.filter(r => Number(r.insider_net_value_30d) > 0).sort((a,b)=>(b.insider_net_value_30d||0)-(a.insider_net_value_30d||0))[0];
    const top = strengthen || insider || rows.slice().sort((a,b)=>(b.score||0)-(a.score||0))[0];
    if (!top) return;
    const signal = strengthen ? "Tese a reforçar" : insider ? "Smart money" : "Qualidade em destaque";
    const body = strengthen ? (top.thesis_evolution_summary || top.thesis_summary) : insider ? `Compras líquidas de insiders: ${fmtMoney(top.insider_net_value_30d, top.currency || "USD")}.` : `Score ${Math.round(top.score)} · qualidade ${Math.round(top.quality_pct ?? 0)} · crescimento ${Math.round(top.growth_pct ?? 0)}.`;
    els.briefingCard.innerHTML = `<span class="briefing-signal">${escapeHtml(signal)}</span><small>${escapeHtml(top.ticker)}</small><h3>${escapeHtml(top.name || top.ticker)}</h3><p>${escapeHtml(body || "")}</p><button class="briefing-open" data-ticker="${escapeHtml(top.ticker)}">Abrir dossier →</button>`;
    els.briefingCard.querySelector(".briefing-open")?.addEventListener("click", () => openDetail(top.ticker));
  }

  function marketOf(ticker) {
    if (ticker.endsWith(".AX")) return "AU";
    if (ticker.endsWith(".WA")) return "PL";
    if (ticker.endsWith(".L")) return "UK";
    if ([".DE",".PA",".AS",".MC",".MI",".SW"].some(x => ticker.endsWith(x))) return "EU";
    return "US";
  }

  function fmtExpenseRatio(n) {
    // Yahoo's annualReportExpenseRatio/netExpenseRatio come back already
    // in percentage points (0.03 means "0.03%", not a 0.0003 fraction) —
    // confirmed against known real expense ratios (SPY≈0.09%, VOO≈0.03%).
    // Do NOT run this through fmtPct(), which assumes a fraction and
    // would multiply by 100 again, showing 100x too high.
    if (n == null) return "—";
    return n.toFixed(2) + "%";
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

  function fmtSignedPct(n) {
    if (n == null || !Number.isFinite(Number(n))) return "—";
    const x = Number(n);
    return `${x > 0 ? "+" : ""}${x.toFixed(1)}%`;
  }

  function relativeClass(n) {
    if (n == null || !Number.isFinite(Number(n))) return "neutral";
    if (Number(n) <= -10) return "discount";
    if (Number(n) >= 10) return "premium";
    return "neutral";
  }

  function valuationLabel(r) {
    const rels = [r.trailing_pe_vs_sector_pct, r.forward_pe_vs_sector_pct, r.pb_vs_sector_pct, r.ev_ebitda_vs_sector_pct]
      .filter(v => Number.isFinite(Number(v))).map(Number);
    if (!rels.length) return {label:"Sem benchmark", cls:"neutral", avg:null};
    const avg = rels.reduce((a,b)=>a+b,0) / rels.length;
    if (avg <= -15) return {label:"Desconto vs setor", cls:"discount", avg};
    if (avg >= 15) return {label:"Prémio vs setor", cls:"premium", avg};
    return {label:"Em linha com setor", cls:"neutral", avg};
  }

  function ownValuationContext(ticker, field, current) {
    const series = state.valuationHistory?.[ticker] || {};
    const vals = Object.values(series).map(x => x?.[field]).filter(v => Number.isFinite(Number(v)) && Number(v) > 0).map(Number).sort((a,b)=>a-b);
    if (!Number.isFinite(Number(current)) || Number(current) <= 0) return {days:vals.length, median:null, rel:null};
    if (vals.length < 5) return {days:vals.length, median:null, rel:null};
    const mid = Math.floor(vals.length/2);
    const median = vals.length % 2 ? vals[mid] : (vals[mid-1] + vals[mid]) / 2;
    return {days:vals.length, median, rel:(Number(current)/median - 1)*100};
  }

  function thesisBadge(r) {
    const label = r.thesis_type || "Sem tese";
    const slug = r.thesis_slug || "watch";
    return `<span class="thesis-chip thesis-${slug}">${label}</span>`;
  }

  function thesisDirectionBadge(r) {
    const dir = r.thesis_direction || "baseline";
    const label = r.thesis_direction_label || ({strengthening:"A reforçar", weakening:"A enfraquecer", changed:"Mudança de tese", stable:"Estável", baseline:"Baseline"}[dir] || dir);
    const icon = ({strengthening:"↗", weakening:"↘", changed:"⇄", stable:"→", baseline:"•"}[dir] || "•");
    return `<span class="trajectory-chip trajectory-${dir}">${icon} ${escapeHtml(label)}</span>`;
  }

  function thesisPanelHtml(r) {
    if (!r.thesis_type) return "";
    const evidence = (r.thesis_evidence || []).map(x => `<li>${escapeHtml(x)}</li>`).join("") || "<li>Sem evidência suficiente para destacar.</li>";
    const risks = (r.thesis_risks || []).map(x => `<li>${escapeHtml(x)}</li>`).join("") || "<li>Sem risco quantitativo dominante identificado nos campos disponíveis.</li>";
    const drivers = (r.thesis_evolution_drivers || []).map(x => `<li>${escapeHtml(x)}</li>`).join("") || "<li>Ainda sem mudança material mensurável.</li>";
    const obs = Object.keys(state.thesisHistory?.[r.ticker] || {}).length;
    const previous = r.thesis_previous_type ? `<span>Anterior: <b>${escapeHtml(r.thesis_previous_type)}</b>${r.thesis_previous_date ? ` · ${escapeHtml(r.thesis_previous_date)}` : ""}</span>` : `<span>${obs ? `${obs} observação${obs === 1 ? "" : "ões"} persistida${obs === 1 ? "" : "s"}` : "histórico a iniciar"}</span>`;
    return `<div class="thesis-panel thesis-${r.thesis_slug || "watch"}">
      <div class="thesis-panel__head"><div>${thesisBadge(r)}<strong>${escapeHtml(r.thesis_summary || "")}</strong></div><span>confiança ${escapeHtml(r.thesis_confidence || "—")}</span></div>
      <div class="trajectory-strip"><div>${thesisDirectionBadge(r)}<strong>${escapeHtml(r.thesis_evolution_summary || "Direção ainda não calculada.")}</strong></div>${previous}</div>
      <div class="thesis-panel__cols"><div><em>A favor</em><ul>${evidence}</ul></div><div><em>O que pode invalidar</em><ul>${risks}</ul></div></div>
      <div class="trajectory-drivers"><em>O que está a mudar</em><ul>${drivers}</ul></div>
    </div>`;
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

  async function fetchJson(path, timeoutMs = 15000) {
    const url = new URL(path, document.baseURI);
    url.searchParams.set("_", String(Date.now()));
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url.href, { cache: "no-store", signal: controller.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status} · ${url.pathname}`);
      return await res.json();
    } catch (e) {
      if (e?.name === "AbortError") throw new Error(`timeout ao carregar ${path}`);
      throw e;
    } finally { clearTimeout(timer); }
  }

  async function load() {
    setStartupStatus("A carregar universo…");
    try {
      const payload = await fetchJson("data/stocks.json", 20000);
      if (!payload || !Array.isArray(payload.stocks)) throw new Error("data/stocks.json não contém um array stocks válido");
      state.data = payload;
      updateGeneratedAt();
      setStartupStatus("");
      renderActiveView();
    } catch (e) {
      state.data = null;
      if (els.list) els.list.innerHTML = `<div class="load-error"><strong>Falha ao carregar os dados.</strong><p>O ficheiro <code>data/stocks.json</code> não está acessível ou é inválido nesta publicação.</p><button id="retry-data" class="import-btn import-btn--secondary">Tentar novamente</button><small>${escapeHtml(e?.message || e)}</small></div>`;
      if (els.generatedAt) els.generatedAt.textContent = "dados indisponíveis";
      setStartupStatus("Falha no carregamento dos dados", true);
      document.getElementById("retry-data")?.addEventListener("click", load);
      console.error("stocks load failed", e);
    }
  }

  async function loadMetals() {
    try {
      state.metals = await fetchJson("data/metals.json", 15000);
      if (state.activeView === "metals") updateGeneratedAt();
      renderMetals();
    } catch (e) {
      state.metals = null;
      if (els.metalsList) els.metalsList.innerHTML = `<p class="empty-state">Não foi possível carregar <code>data/metals.json</code>.</p>`;
      console.warn("metals.json unavailable", e);
    }
  }

  async function loadFx() {
    try {
      state.fx = await fetchJson("data/fx.json", 10000);
      if (state.activeView === "portfolio") renderPortfolio();
    } catch (e) {
      state.fx = { base: "EUR", rates_to_eur: { EUR: 1 } };
      console.warn("fx.json unavailable; EUR-only weighting until next pipeline run", e);
    }
  }

  async function loadHistory() {
    try { state.history = await fetchJson("data/history.json", 10000); }
    catch (e) { state.history = {}; console.warn("history.json unavailable yet", e); }
  }

  async function loadValuationHistory() {
    try { state.valuationHistory = await fetchJson("data/valuation_history.json", 10000); }
    catch (e) { state.valuationHistory = {}; console.warn("valuation_history.json unavailable yet", e); }
  }

  async function loadThesisHistory() {
    try { state.thesisHistory = await fetchJson("data/thesis_history.json", 10000); }
    catch (e) { state.thesisHistory = {}; console.warn("thesis_history.json unavailable yet", e); }
  }

  function renderMetals() {
    if (!state.metals || !state.metals.instruments || !state.metals.instruments.length) {
      els.metalsList.innerHTML = `<p class="empty-state">Sem dados de metais ainda. Corre o pipeline.</p>`;
      els.metalsNote.textContent = "";
      return;
    }
    els.metalsNote.textContent = state.metals.note || "";
    els.metalsList.innerHTML = state.metals.instruments.map(metalCardHtml).join("");
    els.metalsList.querySelectorAll(".metal-card[data-ticker]").forEach(card => {
      card.addEventListener("click", () => openMetalDetail(card.dataset.ticker));
    });
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
      <div class="metal-card" data-ticker="${escapeHtml(inst.ticker)}" tabindex="0" role="button">
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
        <span class="metal-expand-hint">toca para mais detalhe →</span>
      </div>`;
  }

  function openMetalDetail(ticker) {
    const inst = state.metals?.instruments?.find(i => i.ticker === ticker);
    if (!inst || !inst.data) return;
    const d = inst.data;
    const yChange = (v, label) => v != null
      ? `<div class="detail-row"><span>${label}</span><span>${v >= 0 ? "+" : ""}${v}%</span></div>` : "";

    els.detailContent.innerHTML = `
      <h2 style="font-family:var(--font-display, inherit);margin:0 0 0.9rem;">${inst.label}</h2>
      <div class="detail-row"><span>Preço</span><span>${d.price} ${inst.unit}</span></div>
      <div class="detail-row"><span>Variação diária</span><span>${d.day_change_pct != null ? (d.day_change_pct >= 0 ? "+" : "") + d.day_change_pct + "%" : "—"}</span></div>
      ${yChange(d.change_ytd_pct, "Variação no ano (YTD)")}
      ${yChange(d.change_1y_pct, "Variação em 12 meses")}
      <div class="detail-row"><span>Intervalo 90 dias</span><span>${d.range_90d_low}–${d.range_90d_high}</span></div>
      ${d.range_1y_low != null && d.range_1y_high != null ? `<div class="detail-row"><span>Intervalo 12 meses</span><span>${d.range_1y_low}–${d.range_1y_high}</span></div>` : ""}
      <div class="detail-row"><span>Volatilidade anualizada</span><span>${d.volatility_annualized_pct ?? "—"}%</span></div>
      ${inst.kind === "etf_proxy" ? `<p class="detail-note">Proxy via ETF de mineradoras — não é o preço spot do metal. Não existe fonte gratuita de preço spot de urânio.</p>` : ""}
      ${inst.context ? `<p class="detail-note" style="margin-top:0.9rem;">${escapeHtml(inst.context)}</p>` : ""}
      ${inst.context_links ? `<div class="news-actions" style="margin-top:0.6rem;">${inst.context_links.map(l => `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${escapeHtml(l.label)}</a>`).join("")}</div>` : ""}
      <p class="detail-note" style="margin-top:0.9rem;">Preço de futuros (não spot). Sem indicador de stress de mercado calculado — exigiria dados de inventário/lease rates que não estão disponíveis gratuitamente.</p>
    `;
    els.detail.hidden = false;
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

    const opportunities = scored
      .filter(r => r.zombie !== "yes" && r.data_confidence !== "low" && Number(r.quality_pct ?? r.profitability_pct) >= 60 && Number(r.value_pct) >= 55)
      .sort((a,b) => (b.quality_value_score ?? 0) - (a.quality_value_score ?? 0))
      .slice(0, 6);
    if (els.opportunityGrid) {
      els.opportunityGrid.innerHTML = opportunities.length ? opportunities.map(r => {
        const v = valuationLabel(r);
        return `<button class="opportunity-card" data-ticker="${r.ticker}">
          <span class="opportunity-card__top"><strong>${r.ticker}</strong><em class="valuation-chip ${v.cls}">${v.label}</em></span>
          <small>${r.name || ""}</small>
          <span class="opportunity-card__axes"><b>Q ${Math.round(r.quality_pct ?? r.profitability_pct ?? 0)}</b><b>V ${Math.round(r.value_pct ?? 0)}</b><b>G ${Math.round(r.growth_pct ?? 0)}</b></span>
          <span class="opportunity-card__score">Q×V ${r.quality_value_score ?? "—"}</span>
        </button>`;
      }).join("") : `<p class="empty-state compact">Nenhuma empresa cumpre simultaneamente os limiares de qualidade e valor neste universo.</p>`;
      els.opportunityGrid.querySelectorAll(".opportunity-card").forEach(btn => btn.addEventListener("click", () => openDetail(btn.dataset.ticker)));
    }
  }

  const REGION_LABELS_PT = {
    "United States": "Estados Unidos",
    "United Kingdom": "Reino Unido",
    "Australia": "Austrália",
    "Germany": "Alemanha",
    "France": "França",
    "Netherlands": "Países Baixos",
    "Spain": "Espanha",
    "Italy": "Itália",
    "Switzerland": "Suíça",
    "International Developed": "Internacional Desenvolvido",
    "Emerging Markets": "Mercados Emergentes",
    "Japan": "Japão",
    "Global": "Global",
  };
  function regionLabel(region) { return REGION_LABELS_PT[region] || region; }

  function populateRegionFilter(selectEl, rows, populatedFlagSetter) {
    if (!selectEl) return;
    const regions = [...new Set(rows.map(r => r.region).filter(Boolean))]
      .sort((a, b) => regionLabel(a).localeCompare(regionLabel(b), "pt"));
    selectEl.innerHTML = `<option value="">todas as regiões</option>` +
      regions.map(r => `<option value="${escapeHtml(r)}">${escapeHtml(regionLabel(r))}</option>`).join("");
    populatedFlagSetter();
  }

  let stocksRegionsPopulated = false;
  let stocksSectorsPopulated = false;
  function applyFilters() {
    if (!state.data) return;
    const equities = state.data.stocks.filter(r => r.quote_type !== "ETF");
    if (!stocksRegionsPopulated) {
      populateRegionFilter(els.marketFilter, equities, () => { stocksRegionsPopulated = true; });
    }
    if (!stocksSectorsPopulated && els.stocksSectorFilter) {
      const sectors = [...new Set(equities.map(r => r.sector).filter(Boolean))].sort();
      els.stocksSectorFilter.innerHTML = `<option value="">todos os setores</option>` +
        sectors.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join("");
      stocksSectorsPopulated = true;
    }
    const q = els.search.value.trim().toUpperCase();
    const region = els.marketFilter.value;
    const sector = els.stocksSectorFilter?.value || "";
    const zombieOnly = els.zombieOnly.checked;
    const watchlistOnly = els.watchlistOnly.checked;

    let rows = state.data.stocks.filter(r => {
      if (r.quote_type === "ETF") return false;
      if (region && r.region !== region) return false;
      if (sector && r.sector !== sector) return false;
      if (zombieOnly && r.zombie !== "yes") return false;
      if (watchlistOnly && !isWatched(r.ticker)) return false;
      if (q && !(r.ticker.toUpperCase().includes(q) || (r.name || "").toUpperCase().includes(q))) return false;
      return true;
    });

    const sort = els.sortBy.value;
    rows.sort((a, b) => {
      if (sort === "score-desc") return (b.score ?? -1) - (a.score ?? -1);
      if (sort === "score-asc") return (a.score ?? 999) - (b.score ?? 999);
      if (sort === "quality-desc") return (b.quality_pct ?? -1) - (a.quality_pct ?? -1);
      if (sort === "growth-desc") return (b.growth_pct ?? -1) - (a.growth_pct ?? -1);
      if (sort === "balance-desc") return (b.balance_pct ?? -1) - (a.balance_pct ?? -1);
      if (sort === "cashflow-desc") return (b.cashflow_pct ?? -1) - (a.cashflow_pct ?? -1);
      if (sort === "value-desc") return (b.value_pct ?? -1) - (a.value_pct ?? -1);
      if (sort === "stability-desc") return (b.stability_pct ?? -1) - (a.stability_pct ?? -1);
      if (sort === "ticker-asc") return a.ticker.localeCompare(b.ticker);
      if (sort === "cap-desc") return (b.market_cap ?? 0) - (a.market_cap ?? 0);
      if (sort === "qv-desc") return (b.quality_value_score ?? -1) - (a.quality_value_score ?? -1);
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
    const isEtf = r.quote_type === "ETF";
    const metrics = isEtf ? [
      ["Expense ratio", r.expense_ratio != null ? r.expense_ratio.toFixed(2) + "%" : null],
      ["Exposição IA", r.ai_exposure_pct != null ? r.ai_exposure_pct + "%" : null],
      ["Setor", r.sector || null],
      ["Região", r.region ? regionLabel(r.region) : null],
      ["Preço", r.current_price ?? null],
      ["Categoria", r.kind === "etf_proxy" ? "proxy" : "ETF"],
    ] : scoreDimensionsFor(r).slice(0,6);
    return `
      <article class="card stock-card" data-ticker="${r.ticker}" tabindex="0">
        <div class="stock-card__identity">
          <div class="company-mark">${r.ticker.replace(/\..*/, '').slice(0,2)}</div>
          <div class="card-main">
            <div class="card-ticker">${r.ticker} <button class="star-btn ${starred ? 'is-active' : ''}" data-ticker="${r.ticker}" aria-label="Watchlist">${starred ? "★" : "☆"}</button></div>
            <div class="card-name">${r.name || "—"}</div>
            <div class="card-sector">${r.sector || "Sem setor"}${r.industry ? " · " + r.industry : ""} · ${r.region ? regionLabel(r.region) : marketOf(r.ticker)}</div>
          </div>
        </div>
        <div class="metric-ribbon">${metrics.map(([label,val]) => `<div><span>${label}</span><strong>${val == null ? "—" : (typeof val === "number" ? Math.round(val) : val)}</strong></div>`).join("")}</div>
        <div class="stock-card__verdict">
          <span class="score-pill ${verdict.cls}">${r.score == null ? (isEtf ? "ETF" : "—") : Math.round(r.score)}</span>
          <strong>${isEtf ? (r.name || r.ticker) : verdict.label}</strong>
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

  function valuationCompareHtml(label, current, sectorMedian, relSector, own) {
    const cls = relativeClass(relSector);
    const ownText = own.median == null
      ? (own.days ? `histórico próprio em construção · ${own.days} dia(s)` : "histórico próprio ainda sem dados")
      : `mediana própria ${fmtRatio(own.median)} · ${fmtSignedPct(own.rel)} vs histórico observado`;
    return `<div class="comparison-card">
      <span>${label}</span>
      <strong>${fmtRatio(current)}</strong>
      <div><small>setor ${fmtRatio(sectorMedian)}</small><em class="${cls}">${fmtSignedPct(relSector)}</em></div>
      <p>${ownText}</p>
    </div>`;
  }


  function scoreModelFor(r) {
    if (r && r.score_model) return String(r.score_model);
    if (isReitStock(r)) return "reit";
    if (isBankStock(r)) return "bank";
    const sector = String((r && r.sector) || "").toLowerCase();
    const industry = String((r && r.industry) || "").toLowerCase();
    if (sector.includes("financial") && (industry.includes("insurance") || industry.includes("insur"))) return "insurance";
    return "general";
  }

  function scoreModelLabel(r) {
    return ({bank:"BANK MODEL", reit:"REIT MODEL", insurance:"INSURANCE MODEL", general:"GENERAL MODEL"})[scoreModelFor(r)] || "GENERAL MODEL";
  }

  function scoreDimensionsFor(r) {
    if (r && r.score_dimensions && typeof r.score_dimensions === "object") {
      return Object.entries(r.score_dimensions);
    }
    const model = scoreModelFor(r);
    if (model === "bank") return [["Bank Quality", r.quality_pct ?? r.profitability_pct],["Growth",r.growth_pct],["Valuation",r.value_pct],["Income",null],["Stability",r.stability_pct]];
    if (model === "reit") return [["REIT Quality",r.quality_pct ?? r.profitability_pct],["Growth",r.growth_pct],["Leverage",r.balance_pct ?? r.leverage_pct],["P/FFO Value",r.value_pct],["Distribution",null],["Stability",r.stability_pct]];
    if (model === "insurance") return [["Insurance Quality",r.quality_pct ?? r.profitability_pct],["Growth",r.growth_pct],["Balance",r.balance_pct ?? r.leverage_pct],["Valuation",r.value_pct],["Income",null],["Stability",r.stability_pct]];
    return [["Quality",r.quality_pct ?? r.profitability_pct],["Growth",r.growth_pct],["Balance",r.balance_pct ?? r.leverage_pct],["Cash Flow",r.cashflow_pct],["Valuation",r.value_pct],["Stability",r.stability_pct]];
  }

  function isBankStock(r) {
    const sector = String(r.sector || "").toLowerCase();
    const industry = String(r.industry || "").toLowerCase();
    return sector.includes("financial") && (industry.includes("bank") || industry.includes("credit") || industry.includes("savings"));
  }

  function isReitStock(r) {
    const sector = String(r.sector || "").toLowerCase();
    const industry = String(r.industry || "").toLowerCase();
    return sector.includes("real estate") || industry.includes("reit");
  }

  function miniBarsHtml(series, tone = "positive") {
    const pts = (Array.isArray(series) ? series : [])
      .filter(x => x && Number.isFinite(Number(x.value)))
      .slice(0, 8)
      .reverse();
    if (pts.length < 2) return '<span class="metric-no-trend">sem histórico</span>';
    const vals = pts.map(x => Number(x.value));
    const min = Math.min(...vals), max = Math.max(...vals);
    const range = max - min || 1;
    return `<span class="metric-mini-bars ${tone}">${vals.map((v,i) => {
      const h = 28 + ((v-min)/range)*44;
      const prev = i ? vals[i-1] : v;
      const cls = v >= prev ? 'up' : 'down';
      return `<i class="${cls}" style="height:${h.toFixed(0)}%"></i>`;
    }).join('')}</span>`;
  }

  function scoreWord(v) {
    if (v == null || !Number.isFinite(Number(v))) return "Sem dados";
    const n = Number(v);
    if (n >= 80) return "Excecional";
    if (n >= 65) return "Forte";
    if (n >= 50) return "Bom";
    if (n >= 35) return "Misto";
    return "Fraco";
  }

  function scoreTone(v) {
    if (v == null || !Number.isFinite(Number(v))) return "neutral";
    const n = Number(v);
    if (n >= 65) return "positive";
    if (n < 35) return "negative";
    return "neutral";
  }

  function metricCardHtml({title, value, subtitle, explanation, series, tone="neutral", badge}) {
    return `<article class="w-metric-card ${tone}">
      <div class="w-metric-head"><span>${escapeHtml(title)}</span>${badge ? `<b>${escapeHtml(badge)}</b>` : ''}</div>
      <div class="w-metric-main"><strong>${value}</strong>${miniBarsHtml(series, tone)}</div>
      ${subtitle ? `<p class="w-metric-sub">${escapeHtml(subtitle)}</p>` : ''}
      ${explanation ? `<p class="w-metric-explain">${escapeHtml(explanation)}</p>` : ''}
    </article>`;
  }

  function pctTone(v, positiveAbove = 0) {
    if (v == null || !Number.isFinite(Number(v))) return "neutral";
    return Number(v) > positiveAbove ? "positive" : Number(v) < positiveAbove ? "negative" : "neutral";
  }

  function companyMetricPackHtml(r) {
    const revAccel = r.revenue_yoy_acceleration_pp;
    const niAccel = r.net_income_yoy_acceleration_pp;
    const dilution = r.diluted_shares_yoy;
    const bank = scoreModelFor(r) === "bank";
    const reit = scoreModelFor(r) === "reit";
    const insurance = scoreModelFor(r) === "insurance";
    const cards = [];

    if (bank) {
      const eff = r.efficiency_ratio_proxy;
      const provisions = r.provision_to_revenue;
      const capitalProxy = r.equity_to_assets;
      const niiGrowth = r.net_interest_income_yoy;
      const bankCoverage = r.bank_metric_coverage_pct;
      cards.push(metricCardHtml({title:"Return on Equity", value:fmtRawPct(r.roe), subtitle: scoreWord(r.quality_pct), explanation:"Rentabilidade do capital próprio. Em bancos deve ser lida com capitalização e qualidade do crédito.", tone:scoreTone(r.quality_pct)}));
      cards.push(metricCardHtml({title:"Return on Assets", value:fmtRawPct(r.roa), subtitle:"Eficiência do balanço", explanation:"Lucro gerado por unidade de ativos; útil para comparar bancos com modelos semelhantes.", tone:pctTone(r.roa)}));
      cards.push(metricCardHtml({title:"Net Interest Income", value:fmtMoney(r.net_interest_income, r.currency), subtitle:niiGrowth == null ? "crescimento YoY indisponível" : `${Number(niiGrowth)>=0?'+':''}${(Number(niiGrowth)*100).toFixed(1)}% YoY`, explanation:"Evolução da principal margem económica de muitos bancos: rendimento líquido de juros antes do restante negócio.", tone:pctTone(niiGrowth), badge:"BANK NATIVE"}));
      cards.push(metricCardHtml({title:"Efficiency Ratio · proxy", value:fmtRawPct(eff), subtitle:eff == null ? "sem dados" : Number(eff) < .55 ? "eficiência forte" : Number(eff) > .70 ? "custos elevados" : "intermédio", explanation:"Despesas operacionais / receita a partir das demonstrações públicas. Menor tende a ser melhor. Não é o efficiency ratio regulatório reportado pelo banco.", tone:eff == null ? "neutral" : Number(eff) < .55 ? "positive" : Number(eff) > .70 ? "negative" : "neutral"}));
      cards.push(metricCardHtml({title:"Credit-loss provision · proxy", value:fmtRawPct(provisions), subtitle:provisions == null ? "sem dados" : "provisões / receita", explanation:"Intensidade das provisões para perdas de crédito relativamente à receita. Menor tende a ser melhor, mas deve ser contextualizado pelo ciclo de crédito.", tone:provisions == null ? "neutral" : Number(provisions) < .08 ? "positive" : Number(provisions) > .20 ? "negative" : "neutral"}));
      cards.push(metricCardHtml({title:"Equity / Assets · capital proxy", value:fmtRawPct(capitalProxy), subtitle:"não substitui CET1", explanation:"Capital contabilístico sobre ativos. É apenas um proxy de capitalização; CET1/Tier 1 exigem dados regulatórios próprios.", tone:capitalProxy == null ? "neutral" : Number(capitalProxy) >= .08 ? "positive" : Number(capitalProxy) < .05 ? "negative" : "neutral"}));
      cards.push(metricCardHtml({title:"Price / Book", value:fmtRatio(r.price_to_book), subtitle:r.pb_vs_sector_pct == null ? "benchmark setorial indisponível" : `${fmtSignedPct(r.pb_vs_sector_pct)} vs setor`, explanation:"Para bancos, P/B é especialmente útil quando interpretado em conjunto com ROE e qualidade do balanço.", tone:r.pb_vs_sector_pct == null ? 'neutral' : Number(r.pb_vs_sector_pct) < 0 ? 'positive' : 'neutral'}));
      cards.push(metricCardHtml({title:"Regulatory data gap", value:bankCoverage == null ? "—" : `${Number(bankCoverage).toFixed(0)}%`, subtitle:"cobertura do Bank Native Pack", explanation:"CET1, NPL ratio e net charge-offs continuam deliberadamente ausentes até existir uma fonte regulatória fiável. A app não os estima.", tone:"neutral", badge:"DATA INTEGRITY"}));
    } else if (reit) {
      const ffo = r.reit_ffo_proxy;
      const ffoPs = r.reit_ffo_per_share_proxy;
      const pFfo = r.reit_p_ffo_proxy;
      const ffoPayout = r.reit_ffo_payout_proxy;
      const ndEbitda = r.reit_net_debt_to_ebitda;
      const reitCoverage = r.reit_metric_coverage_pct;
      cards.push(metricCardHtml({title:"FFO · proxy", value:fmtMoney(ffo, r.currency), subtitle:ffoPs == null ? "FFO/share indisponível" : `${Number(ffoPs).toFixed(2)} por ação`, explanation:"Proxy construído a partir de lucro líquido + depreciação/amortização + ajuste disponível de ganhos/perdas de venda. Não é AFFO nem substitui o FFO reportado pela empresa.", tone:ffo != null && Number(ffo) > 0 ? "positive" : "neutral", badge:"REIT NATIVE"}));
      cards.push(metricCardHtml({title:"Price / FFO · proxy", value:fmtRatio(pFfo), subtitle:"valuation REIT-native", explanation:"Preço dividido pelo FFO por ação proxy. É geralmente mais informativo para REITs do que P/E, mas deve ser confirmado contra FFO/AFFO reportado.", tone:pFfo == null ? "neutral" : Number(pFfo) < 15 ? "positive" : Number(pFfo) > 25 ? "negative" : "neutral"}));
      cards.push(metricCardHtml({title:"FFO payout · proxy", value:fmtRawPct(ffoPayout), subtitle:"dividendos pagos / FFO proxy", explanation:"Mede quanto do FFO proxy é consumido pelos dividendos. Valores muito elevados reduzem a margem de segurança da distribuição.", tone:ffoPayout == null ? "neutral" : Number(ffoPayout) <= .80 ? "positive" : Number(ffoPayout) > 1 ? "negative" : "neutral"}));
      cards.push(metricCardHtml({title:"Net Debt / EBITDA", value:fmtRatio(ndEbitda), subtitle:"alavancagem", explanation:"Proxy de alavancagem financeira. Em REITs deve ser complementado por maturidades, custo da dívida e dívida garantida/não garantida.", tone:ndEbitda == null ? "neutral" : Number(ndEbitda) < 5 ? "positive" : Number(ndEbitda) > 7 ? "negative" : "neutral"}));
      cards.push(metricCardHtml({title:"Dividend Yield", value:fmtRawPct(r.dividend_yield), subtitle:ffoPayout == null ? "payout FFO indisponível" : `FFO payout ${fmtRawPct(ffoPayout)}`, explanation:"Rendimento distribuído contextualizado pelo payout sobre FFO proxy, quando disponível.", tone:pctTone(r.dividend_yield)}));
      cards.push(metricCardHtml({title:"AFFO · NAV · Occupancy", value:"—", subtitle:reitCoverage == null ? "fontes especializadas não integradas" : `${Number(reitCoverage).toFixed(0)}% cobertura do REIT Native Pack`, explanation:"AFFO, NAV e ocupação exigem dados específicos do REIT e continuam deliberadamente ausentes. A app não os inventa nem transforma capex total em AFFO.", tone:"neutral", badge:"DATA INTEGRITY"}));
    } else if (insurance) {
      cards.push(metricCardHtml({title:"Return on Equity", value:fmtRawPct(r.roe), subtitle:scoreWord(r.quality_pct), explanation:"Rentabilidade do capital próprio; deve ser lida com solvência e qualidade da subscrição.", tone:scoreTone(r.quality_pct)}));
      cards.push(metricCardHtml({title:"Price / Book", value:fmtRatio(r.price_to_book), subtitle:r.pb_vs_sector_pct == null ? "sem benchmark" : `${fmtSignedPct(r.pb_vs_sector_pct)} vs setor`, explanation:"P/B é uma referência útil para seguradoras, em conjunto com ROE e qualidade do capital.", tone:r.pb_vs_sector_pct == null ? "neutral" : Number(r.pb_vs_sector_pct) < 0 ? "positive" : "neutral"}));
      cards.push(metricCardHtml({title:"Combined Ratio & Solvency", value:"—", subtitle:"dados especializados ainda não integrados", explanation:"Combined ratio e solvency capital são métricas essenciais para seguradoras e não são inferidas a partir de dados genéricos.", tone:"neutral", badge:"INSURANCE PACK"}));
    } else {
      cards.push(metricCardHtml({title:"Gross Margin", value:fmtRawPct(r.gross_margin), subtitle:scoreWord(r.profitability_pct), explanation:"Quanto da receita sobra depois do custo direto dos produtos/serviços.", tone:scoreTone(r.profitability_pct)}));
      cards.push(metricCardHtml({title:"Operating Margin", value:fmtRawPct(r.operating_margin), subtitle:r.net_margin_yoy_change_pp == null ? "margem operacional" : `${Number(r.net_margin_yoy_change_pp)>=0?'+':''}${Number(r.net_margin_yoy_change_pp).toFixed(1)} pp na margem líquida YoY`, explanation:"Eficiência operacional antes de juros e impostos.", tone:scoreTone(r.profitability_pct)}));
      cards.push(metricCardHtml({title:"Return on Equity", value:fmtRawPct(r.roe), subtitle:"rentabilidade do capital", explanation:"Retorno contabilístico sobre o capital dos acionistas.", tone:pctTone(r.roe)}));
    }

    cards.push(metricCardHtml({title:"Revenue Growth", value:fmtRawPct(r.revenue_yoy_latest), subtitle:revAccel == null ? "YoY último trimestre" : `${Number(revAccel)>=0?'+':''}${Number(revAccel).toFixed(1)} pp de aceleração`, explanation:revAccel == null ? "Crescimento do trimestre mais recente face ao homólogo." : Number(revAccel) >= 0 ? "O crescimento das receitas está a acelerar." : "O crescimento das receitas está a desacelerar.", series:r.quarterly_revenue, tone:pctTone(r.revenue_yoy_latest)}));
    cards.push(metricCardHtml({title:"Earnings Growth", value:fmtRawPct(r.net_income_yoy_latest), subtitle:niAccel == null ? "YoY último trimestre" : `${Number(niAccel)>=0?'+':''}${Number(niAccel).toFixed(1)} pp de aceleração`, explanation:niAccel == null ? "Crescimento do lucro líquido vs trimestre homólogo." : Number(niAccel) >= 0 ? "O crescimento dos lucros está a acelerar." : "O crescimento dos lucros está a desacelerar.", series:r.quarterly_net_income, tone:pctTone(r.net_income_yoy_latest)}));
    cards.push(metricCardHtml({title:"Share Count", value:dilution == null ? "—" : `${Number(dilution)>=0?'+':''}${(Number(dilution)*100).toFixed(1)}%`, subtitle:dilution == null ? "sem dados suficientes" : Number(dilution) > .03 ? "diluição material" : Number(dilution) < -.03 ? "buyback líquido" : "estável", explanation:dilution == null ? "É necessário histórico comparável de ações diluídas." : Number(dilution) > 0 ? "Mais ações em circulação reduzem a participação económica de cada ação existente." : "Menos ações em circulação aumentam a participação económica por ação.", series:r.quarterly_diluted_shares, tone:dilution == null ? 'neutral' : Number(dilution) > .03 ? 'negative' : Number(dilution) < -.03 ? 'positive' : 'neutral'}));
    if (!reit) {
      cards.push(metricCardHtml({title:"Free Cash Flow", value:fmtMoney(r.free_cash_flow, r.currency), subtitle:`FCF yield ${fmtRawPct(r.fcf_yield)}`, explanation:"Caixa disponível depois do investimento necessário no negócio.", tone:scoreTone(r.cashflow_pct)}));
      cards.push(metricCardHtml({title:"Forward P/E", value:fmtRatio(r.forward_pe), subtitle:r.forward_pe_vs_sector_pct == null ? "sem benchmark setorial" : `${fmtSignedPct(r.forward_pe_vs_sector_pct)} vs setor`, explanation:"Preço atual relativo ao lucro esperado. Deve ser lido com crescimento e qualidade.", tone:r.forward_pe_vs_sector_pct == null ? 'neutral' : Number(r.forward_pe_vs_sector_pct) < -10 ? 'positive' : Number(r.forward_pe_vs_sector_pct) > 20 ? 'negative' : 'neutral'}));
      cards.push(metricCardHtml({title:"Dividend Yield", value:fmtRawPct(r.dividend_yield), subtitle:r.payout_ratio == null ? "payout indisponível" : `payout ${fmtRawPct(r.payout_ratio)}`, explanation:"Rendimento anual distribuído; sustentabilidade depende de payout, cash flow e balanço.", tone:"neutral"}));
    }

    return `<section class="w-metric-section"><div class="w-section-intro"><span>${bank ? 'BANK METRICS' : reit ? 'REIT METRICS' : insurance ? 'INSURANCE METRICS' : 'COMPANY METRICS'}</span><h3>Os números que importam</h3><p>Cada métrica combina valor atual, tendência quando disponível e contexto. Valores ausentes são mostrados como ausentes — nunca estimados sem fonte.</p></div><div class="w-metric-stack">${cards.join('')}</div></section>`;
  }

  function openDetail(ticker) {
    const r = state.data.stocks.find(s => s.ticker === ticker);
    if (!r) return;

    const zombieLabel = { yes: "SIM — cobertura de juros < 1×", no: "não", unknown: "desconhecido" }[r.zombie];
    const insider = typeof r.insider_form4_count_30d === "number"
      ? `${r.insider_form4_count_30d} filings Form 4 (30 dias)`
      : "não disponível";
    const insiderNet = r.insider_net_value_30d;
    const insiderNetLabel = insiderNet == null ? "—" : `${insiderNet >= 0 ? "+" : "−"}${fmtMoney(Math.abs(insiderNet), r.currency || "USD")}`;
    const insiderTx = Array.isArray(r.insider_transactions) ? r.insider_transactions : [];
    const insiderTxHtml = insiderTx.length ? insiderTx.map(tx => `
      <div class="insider-tx ${tx.type === 'buy' ? 'buy' : 'sell'}">
        <span>${tx.type === 'buy' ? 'COMPRA' : 'VENDA'} · ${escapeHtml(tx.date || '—')}</span>
        <strong>${escapeHtml(tx.owner || 'Insider')}</strong>
        <small>${escapeHtml(tx.role || '')}${tx.shares != null ? ` · ${Number(tx.shares).toLocaleString('pt-PT')} ações` : ''}${tx.price != null ? ` @ ${Number(tx.price).toFixed(2)}` : ''}${tx.value != null ? ` · ${fmtMoney(tx.value, r.currency || 'USD')}` : ''}</small>
      </div>`).join('') : '<p class="detail-note">Sem compras/vendas open-market P/S detalhadas nos filings recentes analisados.</p>';

    const dilution = r.diluted_shares_yoy;
    const dilutionLabel = dilution == null ? "—" : `${dilution >= 0 ? "+" : ""}${(dilution * 100).toFixed(1)}%`;
    const dilutionClass = dilution == null ? "neutral" : dilution > 0.03 ? "negative" : dilution < -0.03 ? "positive" : "neutral";
    const marginDelta = r.net_margin_yoy_change_pp;
    const marginDeltaLabel = marginDelta == null ? "—" : `${marginDelta >= 0 ? "+" : ""}${Number(marginDelta).toFixed(1)} pp`;
    const owned = isOwned(r.ticker);
    const series = (state.history && state.history[r.ticker]) || {};
    const valuation = valuationLabel(r);
    const ownPe = ownValuationContext(r.ticker, "pe", r.trailing_pe);
    const ownFpe = ownValuationContext(r.ticker, "fpe", r.forward_pe);
    const ownPb = ownValuationContext(r.ticker, "pb", r.price_to_book);
    const ownEv = ownValuationContext(r.ticker, "ev", r.enterprise_to_ebitda);
    const hasHistory = Object.keys(series).length >= 2;
    const verdict = investmentVerdict(r);
    const dimensions = scoreDimensionsFor(r);
    const dimHtml = dimensions.map(([label,val]) => `<div class="dimension"><span>${label}</span><strong>${val == null ? "—" : Math.round(val)}</strong><i><b style="width:${Math.max(0,Math.min(100,Number(val)||0))}%"></b></i></div>`).join("");

    els.detailContent.innerHTML = `
      <div class="detail-hero">
        <div><span class="eyebrow">INVESTMENT DOSSIER</span><h2>${r.ticker}</h2><p>${r.name || ""}</p><small>${r.sector || "—"}${r.industry ? " · " + r.industry : ""}</small></div>
        <div class="detail-score ${verdict.cls}"><strong>${r.score ?? "—"}</strong><span>${verdict.label}</span></div>
      </div>
      <div class="verdict-panel ${verdict.cls}"><strong>${verdict.label}</strong><p>${verdict.text}</p><span>Cobertura de dados: ${r.data_coverage_pct ?? "—"}% · confiança ${r.data_confidence || "—"}</span></div>
      <div class="score-model-note"><span>${scoreModelLabel(r)}</span><p>${escapeHtml(r.score_model_note || (scoreModelFor(r) === "bank" ? "Modelo bancário nativo: acrescenta eficiência, provisões de crédito, capital contabilístico e crescimento do net interest income; CET1/NPL continuam dependentes de fonte regulatória." : scoreModelFor(r) === "reit" ? "Modelo REIT nativo por proxy: FFO, P/FFO, payout FFO e net-debt/EBITDA entram no score; AFFO, NAV e ocupação continuam dependentes de fontes especializadas." : scoreModelFor(r) === "insurance" ? "Modelo de seguradora provisório: combined ratio e solvência ainda não estão integrados." : "Modelo geral multifator para empresas não financeiras especializadas."))}</p></div>
      <h3 class="dossier-title">Tese quantitativa</h3>
      ${thesisPanelHtml(r)}
      <label class="owned-toggle"><input type="checkbox" id="owned-checkbox" ${owned ? "checked" : ""}><span>Tenho esta posição (guardado só neste dispositivo)</span></label>
      ${hasHistory ? `<canvas id="sparkline" width="300" height="48" class="sparkline"></canvas><p class="detail-note" style="margin-top:0.2rem;">tendência do score, últimos ${Object.keys(series).length} dias com dados</p>` : ""}

      <h3 class="dossier-title">Score por dimensão</h3>
      <div class="dimension-grid">${dimHtml}</div>

      ${companyMetricPackHtml(r)}

      <h3 class="dossier-title legacy-detail-title">Dados complementares</h3>
      <h3 class="dossier-title">Qualidade & crescimento</h3>
      <div class="dossier-grid">
        <div><span>ROE</span><strong>${fmtRawPct(r.roe)}</strong></div><div><span>ROA</span><strong>${fmtRawPct(r.roa)}</strong></div>
        <div><span>Margem líquida</span><strong>${fmtRawPct(r.profit_margin)}</strong></div><div><span>Margem operacional</span><strong>${fmtRawPct(r.operating_margin)}</strong></div>
        <div><span>Margem bruta</span><strong>${fmtRawPct(r.gross_margin)}</strong></div><div><span>Crescimento receita</span><strong>${fmtRawPct(r.revenue_growth)}</strong></div>
        <div><span>Crescimento lucros</span><strong>${fmtRawPct(r.earnings_growth)}</strong></div><div><span>Crescimento EPS trimestral</span><strong>${fmtRawPct(r.earnings_quarterly_growth)}</strong></div>
      </div>

      <h3 class="dossier-title">Growth Intelligence</h3>
      <div class="growth-intel-grid">
        <div><span>Receita YoY · último trimestre</span><strong>${fmtRawPct(r.revenue_yoy_latest)}</strong><small>${r.revenue_yoy_acceleration_pp == null ? 'aceleração: —' : `aceleração ${Number(r.revenue_yoy_acceleration_pp)>=0?'+':''}${Number(r.revenue_yoy_acceleration_pp).toFixed(1)} pp`}</small></div>
        <div><span>Lucro líquido YoY · último trimestre</span><strong>${fmtRawPct(r.net_income_yoy_latest)}</strong><small>${r.net_income_yoy_acceleration_pp == null ? 'aceleração: —' : `aceleração ${Number(r.net_income_yoy_acceleration_pp)>=0?'+':''}${Number(r.net_income_yoy_acceleration_pp).toFixed(1)} pp`}</small></div>
        <div><span>Margem líquida · último trimestre</span><strong>${fmtRawPct(r.net_margin_latest)}</strong><small>${marginDeltaLabel} vs trimestre homólogo</small></div>
        <div class="${dilutionClass}"><span>Diluição de ações · YoY</span><strong>${dilutionLabel}</strong><small>${dilution != null && dilution > 0 ? 'mais ações em circulação diluída' : dilution != null && dilution < 0 ? 'redução do número diluído de ações' : 'sem sinal material'}</small></div>
        <div><span>Buybacks · último trimestre</span><strong>${fmtMoney(r.repurchases_last_quarter, r.currency)}</strong></div>
      </div>
      <p class="detail-note">Comparação YoY usa o trimestre mais recente vs o homólogo. A aceleração compara esse crescimento com o crescimento YoY do trimestre imediatamente anterior e requer 6 observações trimestrais.</p>

      <h3 class="dossier-title">Cash flow & balanço</h3>
      <div class="dossier-grid">
        <div><span>Free cash flow</span><strong>${fmtMoney(r.free_cash_flow, r.currency)}</strong></div><div><span>FCF yield</span><strong>${fmtRawPct(r.fcf_yield)}</strong></div>
        <div><span>Operating cash flow</span><strong>${fmtMoney(r.operating_cash_flow, r.currency)}</strong></div><div><span>Net cash</span><strong>${fmtMoney(r.net_cash, r.currency)}</strong></div>
        <div><span>Current ratio</span><strong>${fmtRatio(r.current_ratio)}</strong></div><div><span>Quick ratio</span><strong>${fmtRatio(r.quick_ratio)}</strong></div>
        <div><span>Dívida / equity</span><strong>${r.debt_to_equity == null ? "—" : Number(r.debt_to_equity).toFixed(1)}</strong></div><div><span>Cobertura de juros</span><strong>${fmtRatio(r.interest_coverage)}</strong></div>
      </div>

      <h3 class="dossier-title">Valuation Lens</h3>
      <div class="valuation-summary ${valuation.cls}">
        <div><span class="eyebrow">RELATIVE VALUATION</span><strong>${valuation.label}</strong><p>${r.peer_count ?? 0} pares do mesmo setor usados como universo comparável.</p></div>
        <div class="valuation-summary__number">${valuation.avg == null ? "—" : fmtSignedPct(valuation.avg)}<span>média simples dos múltiplos disponíveis vs mediana setorial</span></div>
      </div>
      <div class="comparison-grid">
        ${valuationCompareHtml("P/E trailing", r.trailing_pe, r.sector_trailing_pe_median, r.trailing_pe_vs_sector_pct, ownPe)}
        ${valuationCompareHtml("P/E forward", r.forward_pe, r.sector_forward_pe_median, r.forward_pe_vs_sector_pct, ownFpe)}
        ${valuationCompareHtml("Price / book", r.price_to_book, r.sector_pb_median, r.pb_vs_sector_pct, ownPb)}
        ${valuationCompareHtml("EV / EBITDA", r.enterprise_to_ebitda, r.sector_ev_ebitda_median, r.ev_ebitda_vs_sector_pct, ownEv)}
      </div>

      <h3 class="dossier-title">Valuation & retorno ao acionista</h3>
      <div class="dossier-grid">
        <div><span>P/E trailing</span><strong>${fmtRatio(r.trailing_pe)}</strong></div><div><span>P/E forward</span><strong>${fmtRatio(r.forward_pe)}</strong></div>
        <div><span>Price / book</span><strong>${fmtRatio(r.price_to_book)}</strong></div><div><span>EV / EBITDA</span><strong>${fmtRatio(r.enterprise_to_ebitda)}</strong></div>
        <div><span>PEG</span><strong>${r.peg_ratio == null ? "—" : Number(r.peg_ratio).toFixed(2)}</strong></div><div><span>Dividend yield</span><strong>${fmtRawPct(r.dividend_yield)}</strong></div>
        <div><span>Payout ratio</span><strong>${fmtRawPct(r.payout_ratio)}</strong></div><div><span>Beta</span><strong>${r.beta == null ? "—" : Number(r.beta).toFixed(2)}</strong></div>
      </div>

      <h3 class="dossier-title">Smart Money · SEC Form 4</h3>
      <div class="smartmoney-summary">
        <div><span>Compras open-market</span><strong>${r.insider_buy_count_30d ?? '—'}</strong><small>${fmtMoney(r.insider_buy_value_30d, r.currency || 'USD')}</small></div>
        <div><span>Vendas open-market</span><strong>${r.insider_sell_count_30d ?? '—'}</strong><small>${fmtMoney(r.insider_sell_value_30d, r.currency || 'USD')}</small></div>
        <div><span>Fluxo líquido P/S</span><strong class="${insiderNet == null ? '' : insiderNet >= 0 ? 'positive-text' : 'negative-text'}">${insiderNetLabel}</strong><small>${insider}</small></div>
      </div>
      <div class="insider-transactions">${insiderTxHtml}</div>
      <p class="detail-note">Só códigos SEC P (open-market purchase) e S (open-market sale). Awards, vesting, opções, gifts e outras transações não são tratados como compra/venda.</p>

      <h3 class="dossier-title">Risco & contexto</h3>
      <div class="detail-row"><span>Zombie (cobertura de juros)</span><span>${zombieLabel}</span></div>
      <div class="detail-row"><span>Atividade insiders</span><span>${insider}</span></div>
      <div class="detail-row"><span>Market cap</span><span>${fmtCap(r.market_cap)}</span></div>
      <div class="detail-row"><span>Preço atual</span><span>${r.current_price ?? "—"} ${r.currency || ""}</span></div>
      ${r.quote_type === "ETF" ? `<div class="detail-row"><span>Expense ratio</span><span>${fmtExpenseRatio(r.expense_ratio)}</span></div><div class="detail-row"><span>Exposição AI</span><span>${r.ai_exposure_pct != null ? r.ai_exposure_pct + "%" : "—"}</span></div>` : ""}
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

  // DivTracker and several other portfolio exports use ISO-country-style
  // suffixes (.FR, .GB, .PT...) instead of the actual Yahoo Finance
  // exchange suffixes Finscanner's universe is keyed on (.PA, .L, .LS...).
  // Without this remap, e.g. "AIR.FR" would never match "AIR.PA" even
  // though it's the same company on the same exchange — remapping first
  // maximizes real matches against the tracked universe.
  const TICKER_SUFFIX_REMAP = {
    ".FR": ".PA",   // France -> Euronext Paris
    ".GB": ".L",    // UK -> London Stock Exchange
    ".ES": ".MC",   // Spain -> Madrid
    ".NL": ".AS",   // Netherlands -> Euronext Amsterdam
    ".CH": ".SW",   // Switzerland -> SIX Swiss Exchange
    ".SE": ".ST",   // Sweden -> Stockholm (not currently tracked, but matches cleanly if added later)
    ".DK": ".CO",   // Denmark -> Copenhagen (not currently tracked)
    ".PT": ".LS",   // Portugal -> Euronext Lisbon (not currently tracked)
    ".PL": ".WA",   // Poland -> Warsaw (not currently tracked — see universe.py)
    ".IT": ".MI",   // Italy -> Borsa Italiana
    ".CA": ".TO",   // Canada -> TSX (common portfolio-export convention)
    ".NO": ".OL",   // Norway -> Oslo
    ".FI": ".HE",   // Finland -> Helsinki
    ".AT": ".VI",   // Austria -> Vienna
    ".BE": ".BR",   // Belgium -> Brussels
  };
  function normalizeTicker(raw) {
    const t = raw.trim().toUpperCase();
    const dot = t.lastIndexOf(".");
    if (dot === -1) return t;
    const suffix = t.slice(dot);
    const mapped = TICKER_SUFFIX_REMAP[suffix];
    return mapped ? t.slice(0, dot) + mapped : t;
  }

  function accumulatePosition(portfolio, ticker, qty, value, sourceCurrency = null) {
    const existing = portfolio[ticker];
    if (!existing) {
      portfolio[ticker] = { qty: Number.isFinite(qty) ? qty : null, value: Number.isFinite(value) ? value : null, sourceCurrency: sourceCurrency || null };
      return;
    }
    if (!existing.sourceCurrency && sourceCurrency) existing.sourceCurrency = sourceCurrency;
    // Same ticker appearing again (multiple purchase lots) — accumulate
    // rather than overwrite, so a position bought in 4 tranches doesn't
    // end up recorded as only the last tranche's quantity.
    if (Number.isFinite(qty)) existing.qty = (existing.qty || 0) + qty;
    if (Number.isFinite(value)) existing.value = (existing.value || 0) + value;
  }

  function finalizePortfolio(portfolio) {
    // Combined transaction exports contain historical buys and sells. The
    // portfolio is the net position today, not every ticker ever traded.
    for (const [ticker, entry] of Object.entries(portfolio)) {
      if (entry && typeof entry === "object" && Number.isFinite(entry.qty) && entry.qty <= 1e-9) delete portfolio[ticker];
    }
    return portfolio;
  }

  function parseCsvPortfolio(text) {
    const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    if (!lines.length) return {};
    const header = lines[0].split(",").map(h => h.trim().toLowerCase());
    const tickerIdx = header.findIndex(h => ["ticker", "symbol"].includes(h));
    const qtyIdx = header.findIndex(h => ["quantity", "qty", "shares", "units"].includes(h));
    const valueIdx = header.findIndex(h => ["value", "amount", "market_value"].includes(h));
    const currencyIdx = header.findIndex(h => ["currency", "ccy"].includes(h));
    if (tickerIdx === -1) throw new Error("Coluna 'ticker' ou 'symbol' não encontrada no cabeçalho do CSV.");

    const portfolio = {};
    for (let i = 1; i < lines.length; i++) {
      const cols = lines[i].split(",").map(c => c.trim());
      const rawTicker = cols[tickerIdx];
      if (!rawTicker) continue;
      const ticker = normalizeTicker(rawTicker);
      const qty = qtyIdx !== -1 ? parseFloat(cols[qtyIdx]) : null;
      const value = valueIdx !== -1 ? parseFloat(cols[valueIdx]) : null;
      const sourceCurrency = currencyIdx !== -1 ? String(cols[currencyIdx] || "").toUpperCase() : null;
      accumulatePosition(portfolio, ticker, qty, value, sourceCurrency);
    }
    return finalizePortfolio(portfolio);
  }

  function parseJsonPortfolio(text) {
    const data = JSON.parse(text);
    const portfolio = {};
    if (Array.isArray(data)) {
      for (const row of data) {
        const rawTicker = row.ticker || row.symbol || "";
        if (!rawTicker) continue;
        const ticker = normalizeTicker(rawTicker);
        const qty = Number(row.quantity ?? row.qty ?? row.shares ?? row.units);
        const value = Number(row.value ?? row.amount ?? row.market_value);
        accumulatePosition(portfolio, ticker, qty, value);
      }
    } else if (data && typeof data === "object") {
      for (const [rawTicker, v] of Object.entries(data)) {
        const ticker = normalizeTicker(rawTicker);
        if (typeof v === "number") {
          accumulatePosition(portfolio, ticker, v, null);
        } else if (v && typeof v === "object") {
          const qty = Number(v.quantity ?? v.qty ?? v.shares);
          const value = Number(v.value ?? v.amount);
          accumulatePosition(portfolio, ticker, qty, value);
        }
      }
    }
    return finalizePortfolio(portfolio);
  }

  function handlePortfolioFile(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result);
        const portfolio = file.name.toLowerCase().endsWith(".json")
          ? parseJsonPortfolio(text)
          : parseCsvPortfolio(text);
        const tickers = Object.keys(portfolio);
        if (!tickers.length) {
          alert("Não encontrei nenhuma posição válida no ficheiro.");
          return;
        }
        lsSet(LS_PORTFOLIO, portfolio);
        const universeTickers = new Set((state.data?.stocks || []).map(r => r.ticker));
        const matched = tickers.filter(t => universeTickers.has(t)).length;
        const missed = tickers.length - matched;
        renderPortfolio();
        if (missed > 0) {
          alert(`Importado: ${tickers.length} posições.\n${matched} já têm análise disponível; ${missed} ainda aguardam cobertura de dados.`);
        }
      } catch (e) {
        alert("Erro a ler o ficheiro: " + e.message);
        console.error(e);
      }
    };
    reader.readAsText(file);
  }

  // ---------- Portfolio valuation / FX ----------
  // data/fx.json stores the EUR value of one unit of each currency.
  // LSE instruments can be quoted in pence (GBp/GBX), which is 1/100 GBP.
  function fxToEur(currency) {
    const raw = String(currency || "EUR");
    if (raw === "GBp" || raw === "GBX") {
      const gbp = Number(state.fx?.rates_to_eur?.GBP);
      return Number.isFinite(gbp) ? gbp / 100 : null;
    }
    const code = raw.toUpperCase();
    const rate = Number(state.fx?.rates_to_eur?.[code]);
    return Number.isFinite(rate) && rate > 0 ? rate : (code === "EUR" ? 1 : null);
  }

  function positionValue(entry, stockRow, convertToEur = true) {
    let value = null;
    let currency = stockRow?.currency || entry?.sourceCurrency || "EUR";
    if (entry && typeof entry === "object") {
      if (entry.value != null) value = Number(entry.value);
      else if (entry.qty != null && stockRow?.current_price != null) value = Number(entry.qty) * Number(stockRow.current_price);
    }
    if (!Number.isFinite(value)) return null;
    if (!convertToEur) return value;
    const rate = fxToEur(currency);
    return rate == null ? null : value * rate;
  }

  function portfolioWeightedStats(portfolio, rows) {
    const byTicker = Object.fromEntries(rows.map(r => [r.ticker, r]));
    const valued = Object.entries(portfolio).map(([ticker, entry]) => {
      const row = byTicker[ticker];
      const eur = row ? positionValue(entry, row, true) : null;
      return { ticker, row, eur };
    }).filter(x => x.row && x.eur != null && x.eur > 0);
    const total = valued.reduce((s,x)=>s+x.eur,0);
    const weightSum = pred => total ? valued.filter(x=>pred(x.row)).reduce((s,x)=>s+x.eur,0) / total * 100 : null;
    const scored = valued.filter(x => x.row.score != null);
    const scoredTotal = scored.reduce((s,x)=>s+x.eur,0);
    const weightedScore = scoredTotal ? scored.reduce((s,x)=>s+x.eur*Number(x.row.score),0)/scoredTotal : null;
    return {
      total,
      count: valued.length,
      weightedScore,
      growthPct: weightSum(r=>r.quote_type!=="ETF" && Number(r.growth_pct ?? -1)>=65),
      qualityPct: weightSum(r=>r.quote_type!=="ETF" && Number(r.quality_pct ?? r.profitability_pct ?? -1)>=70),
      zombiePct: weightSum(r=>r.quote_type!=="ETF" && r.zombie==="yes"),
      improvingPct: weightSum(r=>r.quote_type!=="ETF" && r.thesis_direction==="strengthening"),
      worseningPct: weightSum(r=>r.quote_type!=="ETF" && r.thesis_direction==="weakening"),
    };
  }

  // ---------- donut chart (plain <canvas>, no chart library) ----------
  const DONUT_COLORS = ["#86977c","#a15c2f","#6b5b95","#c9a063","#5c8a99","#a15c8f","#7c9c5c","#b08968","#5c7c99","#8f6b5c","#6b8f5c","#996b5c"];
  function drawDonut(canvas, entries, totalValue) {
    const ctx = canvas.getContext("2d");
    const w = canvas.width, h = canvas.height;
    const cx = w / 2, cy = h / 2;
    const rOuter = Math.min(w, h) / 2 - 2;
    const rInner = rOuter * 0.58;
    ctx.clearRect(0, 0, w, h);
    let angle = -Math.PI / 2;
    entries.forEach(([, val], i) => {
      const frac = val / totalValue;
      const next = angle + frac * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, rOuter, angle, next);
      ctx.closePath();
      ctx.fillStyle = DONUT_COLORS[i % DONUT_COLORS.length];
      ctx.fill();
      angle = next;
    });
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(cx, cy, rInner, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }

  function donutBlockHtml(id, title, entries, totalValue) {
    const legend = entries.map(([label, val], i) => {
      const pct = (val / totalValue) * 100;
      return `<div class="donut-legend-row">
        <span class="donut-swatch" style="background:${DONUT_COLORS[i % DONUT_COLORS.length]}"></span>
        <span class="donut-legend-label">${escapeHtml(label)}</span>
        <span class="donut-legend-pct">${pct.toFixed(1)}%</span>
      </div>`;
    }).join("");
    return `
      <div class="exposure-block donut-block">
        <h3 class="exposure-title">${escapeHtml(title)}</h3>
        <div class="donut-row">
          <canvas id="${id}" width="140" height="140" class="donut-canvas"></canvas>
          <div class="donut-legend">${legend}</div>
        </div>
      </div>`;
  }

  function paintDonut(id, entries, totalValue) {
    const canvas = document.getElementById(id);
    if (canvas) drawDonut(canvas, entries, totalValue);
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

    // Exposure charts must only use rows for which we have analysed metadata;
    // otherwise an explicit CSV market_value from an unresolved symbol would
    // become a misleading synthetic sector called "outside universe".
    const valued = entries.filter(e => e.row && e.val != null && e.val > 0);
    const totalValue = valued.reduce((s, e) => s + e.val, 0);
    const unmatched = entries.filter(e => !e.row);
    const unmatchedCount = unmatched.length;
    const noValueCount = entries.filter(e => e.row && e.val == null).length;

    // Do not dump a wall of unresolved symbols into the main portfolio UI.
    // A valid Yahoo symbol can be absent from today's analysed universe simply
    // because it was not selected by the base index/screener discovery step.
    // The pipeline now has an explicit extra-ticker coverage layer for these.
    const unmatchedListHtml = "";

    if (!valued.length) {
      els.exposurePanel.innerHTML = `
        <div class="exposure-block">
          <p class="unmatched-note">
            Sem dados suficientes para calcular exposição ponderada por valor.
            ${unmatchedCount ? `${unmatchedCount} posição(ões) ainda aguardam análise de dados.` : ""}
            ${noValueCount ? `${noValueCount} posição(ões) não têm preço/quantidade/valor suficiente para calcular o peso.` : ""}
          </p>
        </div>` + unmatchedListHtml;
      return;
    }

    // Sector breakdown (Yahoo Finance's own sector taxonomy — Technology,
    // Consumer Cyclical, Financial Services, Basic Materials, etc.)
    const bySector = {};
    const byRegion = {};
    for (const e of valued) {
      const sector = e.row ? (e.row.sector || "Sem setor / ETF") : "Fora do universo rastreado";
      bySector[sector] = (bySector[sector] || 0) + e.val;
      const region = e.row ? (e.row.region ? regionLabel(e.row.region) : "Região desconhecida") : "Fora do universo rastreado";
      byRegion[region] = (byRegion[region] || 0) + e.val;
    }
    const sectorRows = Object.entries(bySector).sort((a, b) => b[1] - a[1]);
    const regionRows = Object.entries(byRegion).sort((a, b) => b[1] - a[1]);

    // AI exposure: direct AI-flagged equities + weighted ETF ai_exposure_pct
    const aiValue = valued.reduce((sum, e) => {
      if (AI_EXPOSED_TICKERS.has(e.ticker)) return sum + e.val;
      if (e.row?.quote_type === "ETF" && e.row.ai_exposure_pct != null) {
        return sum + e.val * (e.row.ai_exposure_pct / 100);
      }
      return sum;
    }, 0);
    const aiPct = (aiValue / totalValue) * 100;

    const barRow = (label, val, cls = "") => {
      const pct = (val / totalValue) * 100;
      return `
        <div class="exposure-row">
          <span class="exposure-label">${escapeHtml(label)}</span>
          <span class="exposure-bar-track"><span class="exposure-bar-fill ${cls}" style="width:${pct.toFixed(1)}%"></span></span>
          <span class="exposure-pct">${pct.toFixed(1)}%</span>
        </div>`;
    };

    els.exposurePanel.innerHTML = `
      ${donutBlockHtml("donut-sector", "Exposição por setor", sectorRows, totalValue)}
      ${donutBlockHtml("donut-region", "Exposição geográfica", regionRows, totalValue)}
      <div class="exposure-block">
        <h3 class="exposure-title">Exposição por setor — detalhe</h3>
        ${sectorRows.map(([sector, val]) => barRow(sector, val)).join("")}
      </div>
      <div class="exposure-block">
        <h3 class="exposure-title">Exposição geográfica — detalhe</h3>
        ${regionRows.map(([region, val]) => barRow(region, val, "ai")).join("")}
      </div>
      <div class="exposure-block">
        <h3 class="exposure-title">Exposição a IA</h3>
        ${barRow("IA (direta + via ETFs)", aiValue)}
        <p class="unmatched-note">Direta (ações da lista fixa de nomes ligados a IA) + indireta via <code>ai_exposure_pct</code> de ETFs que possuis; não faz look-through a fundos sem essa métrica.</p>
      </div>
      <div class="exposure-block">
        <p class="unmatched-note">
          Valor total considerado: €${totalValue.toLocaleString("pt-PT", {maximumFractionDigits:0})}
          (${valued.length} de ${entries.length} posições com valor calculável).
          ${unmatchedCount ? `${unmatchedCount} posição(ões) ainda aguardam análise.` : ""}
          ${noValueCount ? `${noValueCount} posição(ões) sem quantidade nem valor explícito — não entram no peso.` : ""}
        </p>
      </div>
      ${unmatchedListHtml}`;

    paintDonut("donut-sector", sectorRows, totalValue);
    paintDonut("donut-region", regionRows, totalValue);
  }

  // ---------- Portfolio view ----------
  function portfolioFilterMatches(r, filter) {
    if (filter === "all") return true;
    if (filter === "growth") return r.quote_type !== "ETF" && Number(r.growth_pct ?? -1) >= 65;
    if (filter === "quality") return r.quote_type !== "ETF" && Number(r.quality_pct ?? r.profitability_pct ?? -1) >= 70;
    if (filter === "value") return r.quote_type !== "ETF" && Number(r.value_pct ?? -1) >= 65;
    if (filter === "zombie") return r.quote_type !== "ETF" && r.zombie === "yes";
    if (filter === "etf") return r.quote_type === "ETF";
    if (filter === "thesis-up") return r.quote_type !== "ETF" && r.thesis_direction === "strengthening";
    if (filter === "thesis-down") return r.quote_type !== "ETF" && r.thesis_direction === "weakening";
    if (filter === "thesis-changed") return r.quote_type !== "ETF" && r.thesis_direction === "changed";
    return true;
  }

  function portfolioFilterCounts(rows) {
    const filters = ["all","growth","quality","value","zombie","etf","thesis-up","thesis-down","thesis-changed"];
    return Object.fromEntries(filters.map(f => [f, rows.filter(r => portfolioFilterMatches(r, f)).length]));
  }

  function renderPortfolioThesisMonitor(rows) {
    if (!els.portfolioThesisMonitor) return;
    const equities = rows.filter(r => r.quote_type !== "ETF" && r.thesis_type);
    const improving = equities.filter(r => r.thesis_direction === "strengthening")
      .sort((a,b)=>(b.thesis_score_delta ?? 0)-(a.thesis_score_delta ?? 0));
    const worsening = equities.filter(r => r.thesis_direction === "weakening")
      .sort((a,b)=>(a.thesis_score_delta ?? 0)-(b.thesis_score_delta ?? 0));
    const changed = equities.filter(r => r.thesis_direction === "changed")
      .sort((a,b)=>Math.abs(b.thesis_score_delta ?? 0)-Math.abs(a.thesis_score_delta ?? 0));

    const miniCards = (items, cls) => items.slice(0,5).map(r => `
      <button class="portfolio-thesis-card ${cls}" data-ticker="${escapeHtml(r.ticker)}">
        <div><strong>${escapeHtml(r.ticker)}</strong>${thesisDirectionBadge(r)}</div>
        <small>${escapeHtml(r.name || "")}</small>
        <p>${escapeHtml(r.thesis_evolution_summary || r.thesis_summary || "")}</p>
        ${r.thesis_score_delta == null ? "" : `<span>Δ score ${Number(r.thesis_score_delta)>=0?"+":""}${Number(r.thesis_score_delta).toFixed(1)}</span>`}
      </button>`).join("");

    els.portfolioThesisMonitor.innerHTML = `
      <section class="portfolio-thesis-monitor__head">
        <div><span class="eyebrow">PORTFOLIO THESIS MONITOR</span><h3>O que está a melhorar e a piorar</h3></div>
        <button class="text-link-btn" data-open-theses>Ver todas as teses</button>
      </section>
      <div class="portfolio-thesis-stats">
        <button data-portfolio-filter="thesis-up"><strong>${improving.length}</strong><span>↑ a melhorar</span></button>
        <button data-portfolio-filter="thesis-down"><strong>${worsening.length}</strong><span>↓ a piorar</span></button>
        <button data-portfolio-filter="thesis-changed"><strong>${changed.length}</strong><span>⇄ mudança</span></button>
      </div>
      ${(improving.length || worsening.length || changed.length) ? `<div class="portfolio-thesis-columns">
        <div><h4>↑ A melhorar</h4>${miniCards(improving,"is-improving") || '<p class="empty-state compact">Nenhuma.</p>'}</div>
        <div><h4>↓ A piorar</h4>${miniCards(worsening,"is-worsening") || '<p class="empty-state compact">Nenhuma.</p>'}</div>
      </div>` : `<p class="empty-state compact">Ainda não existe histórico suficiente para medir a direção das teses da carteira. O monitor ganha informação a cada execução do pipeline.</p>`}`;

    els.portfolioThesisMonitor.querySelectorAll("[data-ticker]").forEach(btn => btn.addEventListener("click", () => openDetail(btn.dataset.ticker)));
    els.portfolioThesisMonitor.querySelectorAll("[data-portfolio-filter]").forEach(btn => btn.addEventListener("click", () => {
      state.portfolioFilter = btn.dataset.portfolioFilter;
      renderPortfolio();
    }));
    const open = els.portfolioThesisMonitor.querySelector("[data-open-theses]");
    if (open) open.addEventListener("click", () => { state.thesisScope = "portfolio"; state.thesisDirectionFilter = "all"; switchView("theses"); });
  }

  function renderPortfolioFilterBar(rows) {
    if (!els.portfolioFilters) return;
    const c = portfolioFilterCounts(rows);
    const defs = [
      ["all","Todos"], ["growth","Growth"], ["quality","Quality"], ["value","Value"], ["zombie","Zombies"],
      ["etf","ETFs"], ["thesis-up","Tese ↑"], ["thesis-down","Tese ↓"], ["thesis-changed","Mudou"]
    ];
    els.portfolioFilters.innerHTML = defs.map(([id,label]) => `<button class="portfolio-filter-chip ${state.portfolioFilter===id?"is-active":""}" data-filter="${id}">${label}<span>${c[id]}</span></button>`).join("");
    els.portfolioFilters.querySelectorAll("[data-filter]").forEach(btn => btn.addEventListener("click", () => {
      state.portfolioFilter = btn.dataset.filter;
      renderPortfolio();
    }));
  }

  function renderPortfolio() {
    if (!state.data) return;
    const portfolio = lsGet(LS_PORTFOLIO);
    const ownedTickers = Object.keys(portfolio);
    const rows = state.data.stocks.filter(r => ownedTickers.includes(r.ticker));

    renderExposure(portfolio, rows);

    if (!rows.length) {
      if (els.portfolioFilters) els.portfolioFilters.innerHTML = "";
      if (els.portfolioThesisMonitor) els.portfolioThesisMonitor.innerHTML = "";
      els.portfolioSummary.innerHTML = "";
      els.portfolioList.innerHTML = ownedTickers.length
        ? `<p class="empty-state">${ownedTickers.length} posição(ões) importada(s), mas ainda não há análise disponível. O ficheiro importado foi aceite; corre o workflow para incorporar esses símbolos no universo analisado.</p>`
        : `<p class="empty-state">Ainda não marcaste nenhuma posição. Importa um ficheiro acima, ou abre um ticker em Stocks e toca em "Tenho esta posição".</p>`;
      return;
    }

    const equities = rows.filter(r => r.quote_type !== "ETF");
    const etfs = rows.filter(r => r.quote_type === "ETF");
    const scored = equities.filter(r => r.score != null);
    const avgScore = scored.length ? (scored.reduce((s, r) => s + r.score, 0) / scored.length).toFixed(1) : "—";
    const zombieCount = equities.filter(r => r.zombie === "yes").length;
    const growthCount = equities.filter(r => Number(r.growth_pct ?? -1) >= 65).length;
    const qualityCount = equities.filter(r => Number(r.quality_pct ?? r.profitability_pct ?? -1) >= 70).length;
    const improvingCount = equities.filter(r => r.thesis_direction === "strengthening").length;
    const worseningCount = equities.filter(r => r.thesis_direction === "weakening").length;
    const feesWithData = etfs.filter(r => r.expense_ratio != null);
    const avgFee = feesWithData.length ? (feesWithData.reduce((s, r) => s + r.expense_ratio, 0) / feesWithData.length) : null;
    const weighted = portfolioWeightedStats(portfolio, rows);
    const pctOrDash = v => v == null ? "—" : `${v.toFixed(1)}%`;

    els.portfolioSummary.innerHTML = `
      <div class="summary-grid portfolio-summary-grid">
        <div class="summary-item"><span class="summary-label">posições analisadas</span><span class="summary-value">${rows.length}<small> / ${ownedTickers.length}</small></span></div>
        <div class="summary-item"><span class="summary-label">score médio (ações)</span><span class="summary-value">${avgScore}</span></div>
        <div class="summary-item"><span class="summary-label">score ponderado (€)</span><span class="summary-value">${weighted.weightedScore == null ? "—" : weighted.weightedScore.toFixed(1)}</span></div>
        <div class="summary-item"><span class="summary-label">Growth</span><span class="summary-value">${growthCount}</span></div>
        <div class="summary-item"><span class="summary-label">Quality</span><span class="summary-value">${qualityCount}</span></div>
        <div class="summary-item"><span class="summary-label">zombies</span><span class="summary-value ${zombieCount > 0 ? 'alert' : ''}">${zombieCount}</span></div>
        <div class="summary-item"><span class="summary-label">teses ↑ / ↓</span><span class="summary-value thesis-split"><b>${improvingCount}</b><i>${worseningCount}</i></span></div>
        <div class="summary-item"><span class="summary-label">Growth · peso</span><span class="summary-value">${pctOrDash(weighted.growthPct)}</span></div>
        <div class="summary-item"><span class="summary-label">Quality · peso</span><span class="summary-value">${pctOrDash(weighted.qualityPct)}</span></div>
        <div class="summary-item"><span class="summary-label">Zombies · peso</span><span class="summary-value ${weighted.zombiePct > 0 ? 'alert' : ''}">${pctOrDash(weighted.zombiePct)}</span></div>
        <div class="summary-item"><span class="summary-label">Teses ↑ / ↓ · peso</span><span class="summary-value thesis-split"><b>${pctOrDash(weighted.improvingPct)}</b><i>${pctOrDash(weighted.worseningPct)}</i></span></div>
        <div class="summary-item"><span class="summary-label">expense ratio médio (ETFs)</span><span class="summary-value">${avgFee != null ? fmtExpenseRatio(avgFee) : "sem dados"}</span></div>
      </div>
      <p class="detail-note">Ponderação económica convertida para EUR com data/fx.json. O score médio simples continua disponível para comparação; o score ponderado e as exposições por estilo/tese usam o valor atual de cada posição.</p>
    `;

    renderPortfolioThesisMonitor(rows);
    renderPortfolioFilterBar(rows);
    const filteredRows = rows.filter(r => portfolioFilterMatches(r, state.portfolioFilter));
    if (!filteredRows.length) {
      els.portfolioList.innerHTML = `<p class="empty-state">Nenhuma posição da tua carteira cumpre este filtro.</p>`;
      return;
    }
    render(els.portfolioList, filteredRows);
  }


  function escapeHtml(v) { return String(v ?? "").replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }

  let fundsSectorsPopulated = false;

  function renderFunds() {
    if (!state.data) return;
    const allFunds = state.data.stocks.filter(r => r.quote_type === "ETF");

    if (!fundsSectorsPopulated && els.fundsSectorFilter) {
      const sectors = [...new Set(allFunds.map(r => r.sector).filter(Boolean))].sort();
      els.fundsSectorFilter.innerHTML = `<option value="">todos os setores</option>` +
        sectors.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join("");
      populateRegionFilter(els.fundsRegionFilter, allFunds, () => {});
      fundsSectorsPopulated = true;
    }

    const q = (els.fundsSearch?.value || "").trim().toUpperCase();
    const sector = els.fundsSectorFilter?.value || "";
    const region = els.fundsRegionFilter?.value || "";
    const rows = allFunds.filter(r => {
      if (sector && r.sector !== sector) return false;
      if (region && r.region !== region) return false;
      if (q && !(r.ticker.toUpperCase().includes(q) || (r.name || "").toUpperCase().includes(q))) return false;
      return true;
    });

    els.fundsCount.textContent = `${rows.length} de ${allFunds.length} fundos`;
    render(els.fundsList, rows);
  }

  function renderSmartMoney() {
    if (!state.data) return;
    const rows = state.data.stocks.filter(r => typeof r.insider_form4_count_30d === "number")
      .sort((a,b)=>{
        const an = a.insider_net_value_30d ?? -Infinity;
        const bn = b.insider_net_value_30d ?? -Infinity;
        if (bn !== an) return bn - an;
        return (b.insider_form4_count_30d||0)-(a.insider_form4_count_30d||0);
      }).slice(0,100);
    els.smartmoneyList.innerHTML = rows.length ? rows.map(r => {
      const net = r.insider_net_value_30d;
      const signal = net == null ? 'activity' : net > 0 ? 'buy' : net < 0 ? 'sell' : 'flat';
      const netText = net == null ? 'sem P/S detalhado' : `${net >= 0 ? '+' : '−'}${fmtMoney(Math.abs(net), r.currency || 'USD')}`;
      return `
      <article class="intel-card smartmoney-card ${signal}" data-ticker="${escapeHtml(r.ticker)}">
        <div><span class="eyebrow">${escapeHtml(r.ticker)}</span><h3>${escapeHtml(r.name || r.ticker)}</h3><p>${escapeHtml(r.sector || "")}</p></div>
        <div class="smartmoney-stats">
          <div><strong>${r.insider_buy_count_30d ?? '—'}</strong><span>compras</span></div>
          <div><strong>${r.insider_sell_count_30d ?? '—'}</strong><span>vendas</span></div>
          <div><strong class="${net != null && net >= 0 ? 'positive-text' : net != null ? 'negative-text' : ''}">${netText}</strong><span>fluxo líquido</span></div>
        </div>
      </article>`;
    }).join("") : '<p class="empty-state">Sem dados SEC disponíveis.</p>';
    els.smartmoneyList.querySelectorAll('[data-ticker]').forEach(x=>x.addEventListener('click',()=>openDetail(x.dataset.ticker)));
  }

  async function loadNews() {
    try { state.news = await fetchJson("data/news.json", 15000); }
    catch (e) { state.news = null; console.warn("news.json unavailable yet", e); }
  }

  function renderNews() {
    if (!state.data) return;
    const portfolio = lsGet(LS_PORTFOLIO);
    const watchlist = lsGet(LS_WATCHLIST);
    const manual = (els.newsSearch?.value || "").trim().toUpperCase();
    const tickers = [...new Set([...Object.keys(portfolio), ...Object.keys(watchlist), ...(manual ? [manual] : [])])];
    if (!tickers.length) { els.newsList.innerHTML='<p class="empty-state">Adiciona posições ao portfolio, marca tickers na watchlist (★), ou pesquisa um ticker acima.</p>'; return; }

    const newsByTicker = state.news?.tickers || {};
    els.newsList.innerHTML = tickers.map(ticker => {
      const items = newsByTicker[ticker] || [];
      const g = `https://www.google.com/search?tbm=nws&q=${encodeURIComponent(ticker + " stock")}`;
      const y = `https://finance.yahoo.com/quote/${encodeURIComponent(ticker)}/news/`;
      if (items.length) {
        return `<article class="news-group"><h3>${escapeHtml(ticker)}</h3>${items.map(n => `<a class="news-item" href="${escapeHtml(n.link)}" target="_blank" rel="noopener"><strong>${escapeHtml(n.title)}</strong><span>${escapeHtml(n.source || "")}</span></a>`).join("")}<div class="news-actions"><a href="${g}" target="_blank" rel="noopener">Google News</a><a href="${y}" target="_blank" rel="noopener">Yahoo Finance</a></div></article>`;
      }
      const reason = state.news
        ? "Sem notícias pré-carregadas para este ticker (fora do universo rastreado, ou nenhuma notícia recente encontrada)."
        : "Ficheiro de notícias ainda não gerado — corre o pipeline (scripts/run.py) pelo menos uma vez.";
      return `<article class="news-group"><h3>${escapeHtml(ticker)}</h3><p>${reason}</p><div class="news-actions"><a href="${g}" target="_blank" rel="noopener">Pesquisar notícias</a><a href="${y}" target="_blank" rel="noopener">Yahoo Finance</a></div></article>`;
    }).join("");
  }

  function renderTheses() {
    if (!els.thesesList) return;
    const portfolio = lsGet(LS_PORTFOLIO);
    const owned = new Set(Object.keys(portfolio));
    const baseRows = (state.data?.stocks || []).filter(r => r.quote_type !== "ETF" && r.thesis_type);
    const scopedRows = state.thesisScope === "portfolio" ? baseRows.filter(r => owned.has(r.ticker)) : baseRows;
    const rows = state.thesisDirectionFilter === "all" ? scopedRows : scopedRows.filter(r => {
      if (state.thesisDirectionFilter === "up") return r.thesis_direction === "strengthening";
      if (state.thesisDirectionFilter === "down") return r.thesis_direction === "weakening";
      if (state.thesisDirectionFilter === "changed") return r.thesis_direction === "changed";
      if (state.thesisDirectionFilter === "stable") return ["stable","baseline"].includes(r.thesis_direction);
      return true;
    });
    if (els.thesisScopeFilters) {
      els.thesisScopeFilters.querySelectorAll("[data-thesis-scope]").forEach(btn => btn.classList.toggle("is-active", btn.dataset.thesisScope === state.thesisScope));
    }
    if (els.thesisDirectionFilters) {
      els.thesisDirectionFilters.querySelectorAll("[data-thesis-direction]").forEach(btn => btn.classList.toggle("is-active", btn.dataset.thesisDirection === state.thesisDirectionFilter));
    }
    if (!rows.length) { els.thesesList.innerHTML = `<p class="empty-state">As teses serão geradas na próxima execução do pipeline.</p>`; return; }
    const changing = rows.filter(r => ["changed","weakening","strengthening"].includes(r.thesis_direction))
      .sort((a,b) => {
        const rank={changed:3,weakening:2,strengthening:1};
        return (rank[b.thesis_direction]||0)-(rank[a.thesis_direction]||0) || Math.abs(b.thesis_score_delta||0)-Math.abs(a.thesis_score_delta||0);
      });
    const radar = changing.length ? `<section class="change-radar"><div class="section-heading"><div><span class="eyebrow">THESIS CHANGE RADAR</span><h3>O que está a mudar</h3></div><span class="section-count">${changing.length}</span></div><div class="trajectory-cards">${changing.slice(0,12).map(r => `<button class="trajectory-card trajectory-card--${r.thesis_direction}" data-ticker="${r.ticker}"><div><strong>${escapeHtml(r.ticker)}</strong>${thesisDirectionBadge(r)}</div><small>${escapeHtml(r.name || "")}</small><p>${escapeHtml(r.thesis_evolution_summary || "")}</p>${r.thesis_score_delta == null ? "" : `<span>Δ score ${Number(r.thesis_score_delta)>=0?"+":""}${Number(r.thesis_score_delta).toFixed(1)}</span>`}</button>`).join("")}</div></section>` : `<section class="change-radar"><div class="section-heading"><div><span class="eyebrow">THESIS CHANGE RADAR</span><h3>O que está a mudar</h3></div></div><p class="empty-state">Ainda não há mudanças persistidas suficientes. O radar ganhará profundidade a cada execução diária.</p></section>`;
    const order = ["Quality Compounder","GARP","Deep Value","Turnaround","Insider Accumulation","Balanced Candidate","High Growth / High Dilution","Leveraged Growth","Value Trap Risk","Watch / No Edge"];
    const groups = new Map();
    rows.forEach(r => { if (!groups.has(r.thesis_type)) groups.set(r.thesis_type, []); groups.get(r.thesis_type).push(r); });
    const grouped = order.filter(k => groups.has(k)).map(k => {
      const items = groups.get(k).sort((a,b)=>(b.score ?? -1)-(a.score ?? -1));
      return `<section class="thesis-group"><div class="section-heading"><div>${thesisBadge(items[0])}<h3>${escapeHtml(k)}</h3></div><span class="section-count">${items.length}</span></div><div class="thesis-cards">${items.slice(0,12).map(r => `<button class="thesis-card" data-ticker="${r.ticker}"><div><strong>${escapeHtml(r.ticker)}</strong><small>${escapeHtml(r.name || "")}</small></div><span>${r.score ?? "—"}</span><p>${escapeHtml(r.thesis_summary || "")}</p>${thesisDirectionBadge(r)}</button>`).join("")}</div></section>`;
    }).join("");
    els.thesesList.innerHTML = radar + grouped;
    els.thesesList.querySelectorAll("[data-ticker]").forEach(btn => btn.addEventListener("click", () => openDetail(btn.dataset.ticker)));
  }

  function resolveCompareTicker(term) {
    if (!state.data) return null;
    const t = term.toUpperCase();
    // 1) exact ticker match
    let hit = state.data.stocks.find(r => r.ticker.toUpperCase() === t);
    if (hit) return hit;
    // 2) ticker without exchange suffix (e.g. "AAL" matching "AAL.L")
    hit = state.data.stocks.find(r => r.ticker.toUpperCase().split(".")[0] === t);
    if (hit) return hit;
    // 3) company name — exact word-boundary match first, then substring
    const nameLower = term.toLowerCase();
    hit = state.data.stocks.find(r => (r.name || "").toLowerCase().split(/[\s,.]+/).includes(nameLower));
    if (hit) return hit;
    hit = state.data.stocks.find(r => (r.name || "").toLowerCase().includes(nameLower));
    return hit || null;
  }

  function renderCompare() {
    if (!state.data) return;
    const raw = (els.compareInput?.value || "").split(/[,;]+/).map(s => s.trim()).filter(Boolean).slice(0, 4);
    if (!raw.length) { els.compareList.innerHTML = '<p class="empty-state">Escreve até 4 tickers ou nomes de empresas, separados por vírgulas.</p>'; return; }

    const picks = [];
    const misses = [];
    const seen = new Set();
    for (const term of raw) {
      const hit = resolveCompareTicker(term);
      if (hit && !seen.has(hit.ticker)) { picks.push(hit); seen.add(hit.ticker); }
      else if (!hit) misses.push(term);
    }

    const cards = picks.map(r => {
      const isEtf = r.quote_type === "ETF";
      const rows = isEtf ? [
        ["Expense ratio", r.expense_ratio != null ? fmtExpenseRatio(r.expense_ratio) : "—"],
        ["Exposição AI", r.ai_exposure_pct != null ? r.ai_exposure_pct + "%" : "sem dados"],
        ["Setor", r.sector || "—"],
        ["Preço", r.current_price != null ? r.current_price : "—"],
      ] : [
        ["Qualidade", r.quality_pct ?? "—"],
        ["Crescimento", r.growth_pct ?? "—"],
        ["Balanço", r.balance_pct ?? "—"],
        ["Cash flow", r.cashflow_pct ?? "—"],
        ["Valor", r.value_pct ?? "—"],
        ["Estabilidade", r.stability_pct ?? "—"],
        ["P/E fwd", fmtRatio(r.forward_pe)],
      ];
      return `<article class="compare-card">
        <span class="eyebrow">${escapeHtml(r.ticker)}${isEtf ? " · ETF" : ""}</span>
        <h3>${escapeHtml(r.name || r.ticker)}</h3>
        <div class="compare-score">${r.score ?? "—"}</div>
        ${rows.map(([label, val]) => `<div class="detail-row"><span>${label}</span><b>${val}</b></div>`).join("")}
      </article>`;
    }).join("");

    const missNote = misses.length ? `<p class="unmatched-note">Não encontrado no universo rastreado: ${misses.map(escapeHtml).join(", ")}</p>` : "";
    els.compareList.innerHTML = (cards || '<p class="empty-state">Nenhum ticker ou nome encontrado no universo atual.</p>') + missNote;
  }


  document.querySelectorAll("#preset-filters [data-preset]").forEach(btn => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#preset-filters [data-preset]").forEach(b => b.classList.toggle("is-active", b === btn));
      const p = btn.dataset.preset;
      if (p === "zombie") { els.zombieOnly.checked = true; els.sortBy.value = "score-desc"; }
      else { els.zombieOnly.checked = false; els.sortBy.value = p === "quality" ? "quality-desc" : p === "growth" ? "growth-desc" : "value-desc"; }
      applyFilters();
    });
  });

  on(els.detailClose, "click", () => { if (els.detail) els.detail.hidden = true; });
  on(els.detail, "click", (e) => { if (e.target === els.detail) els.detail.hidden = true; });

  if (els.thesisScopeFilters) els.thesisScopeFilters.querySelectorAll("[data-thesis-scope]").forEach(btn => btn.addEventListener("click", () => {
    state.thesisScope = btn.dataset.thesisScope;
    renderTheses();
  }));
  if (els.thesisDirectionFilters) els.thesisDirectionFilters.querySelectorAll("[data-thesis-direction]").forEach(btn => btn.addEventListener("click", () => {
    state.thesisDirectionFilter = btn.dataset.thesisDirection;
    renderTheses();
  }));

  on(els.portfolioFile, "change", (e) => {
    const file = e.target.files[0];
    if (file) handlePortfolioFile(file);
    e.target.value = ""; // allow re-selecting the same file
  });

  on(els.portfolioClear, "click", () => {
    if (!confirm("Limpar todo o portfolio importado/marcado?")) return;
    lsSet(LS_PORTFOLIO, {});
    renderPortfolio();
  });

  els.newsSearch?.addEventListener("keydown", (e) => { if (e.key === "Enter") renderNews(); });
  els.newsSearch?.addEventListener("blur", renderNews);

  els.compareInput?.addEventListener("input", renderCompare);

  [els.fundsSearch, els.fundsSectorFilter, els.fundsRegionFilter].filter(Boolean).forEach(el => {
    el.addEventListener("input", renderFunds);
    el.addEventListener("change", renderFunds);
  });

  [els.search, els.marketFilter, els.stocksSectorFilter, els.sortBy, els.zombieOnly, els.watchlistOnly].filter(Boolean).forEach(el => {
    el.addEventListener("input", applyFilters);
    el.addEventListener("change", applyFilters);
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js?v=0.16.0").then(reg => reg.update()).catch(err => console.warn("SW registration failed", err));
    });
  }

  load();
  loadMetals();
  loadFx();
  loadHistory();
  loadValuationHistory();
  loadThesisHistory();
  loadNews();
})();
