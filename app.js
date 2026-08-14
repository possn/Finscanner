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
    const stampClass = r.score == null ? "stamp na" : "stamp";
    const stampText = r.score == null ? "N/A" : Math.round(r.score);
    const flags = [];
    if (r.zombie === "yes") flags.push(`<span class="badge zombie">zombie</span>`);
    if (typeof r.insider_form4_count_30d === "number" && r.insider_form4_count_30d > 0) {
      flags.push(`<span class="badge insider">${r.insider_form4_count_30d} form4 · 30d</span>`);
    }
    if (r.data_confidence === "low") flags.push(`<span class="badge low-confidence">dados limitados</span>`);
    if (isOwned(r.ticker)) flags.push(`<span class="badge owned">na carteira</span>`);

    const starred = isWatched(r.ticker);
    return `
      <article class="card" data-ticker="${r.ticker}" tabindex="0">
        <div class="${stampClass}">${stampText}</div>
        <div class="card-main">
          <div class="card-ticker">${r.ticker} <button class="star-btn ${starred ? 'is-active' : ''}" data-ticker="${r.ticker}" aria-label="Watchlist">${starred ? "★" : "☆"}</button></div>
          <div class="card-name">${r.name || "—"}</div>
        </div>
        <div class="card-flags">${flags.join("")}</div>
      </article>
    `;
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

    const zombieLabel = { yes: "SIM — cobertura de juros < 1×", no: "não", unknown: "desconhecido (dados em falta)" }[r.zombie];
    const insider = typeof r.insider_form4_count_30d === "number"
      ? `${r.insider_form4_count_30d} filings Form 4 (30 dias)`
      : "não disponível (mercado fora dos EUA — EDGAR é só SEC/EUA)";

    const owned = isOwned(r.ticker);
    const series = (state.history && state.history[r.ticker]) || {};
    const hasHistory = Object.keys(series).length >= 2;

    els.detailContent.innerHTML = `
      <h2 style="font-family:var(--font-display);margin:0 0 0.9rem;">${r.ticker} <span style="color:var(--ink-muted);font-weight:400;font-size:0.85rem;">${r.name || ""}</span></h2>
      <label class="owned-toggle">
        <input type="checkbox" id="owned-checkbox" ${owned ? "checked" : ""}>
        <span>Tenho esta posição (guardado só neste dispositivo)</span>
      </label>
      ${hasHistory ? `<canvas id="sparkline" width="300" height="48" class="sparkline"></canvas><p class="detail-note" style="margin-top:0.2rem;">tendência do score, últimos ${Object.keys(series).length} dias com dados</p>` : ""}
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

    document.getElementById("owned-checkbox").addEventListener("change", () => {
      toggleOwned(r.ticker);
      if (state.activeView === "stocks") applyFilters();
    });

    if (hasHistory) {
      const canvas = document.getElementById("sparkline");
      drawSparkline(canvas, series);
    }
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
