(() => {
  "use strict";

  const state = { data: null, filtered: [], metals: null, metalsBrief: null, selectedMetal: "GC=F", fx: null, fxHistory: null, history: null, valuationHistory: null, thesisHistory: null, news: null, activeView: "home", portfolioFilter: "all", portfolioExposureMode: "positions", portfolioAllocationDisplay: "pct", thesisScope: "all", thesisDirectionFilter: "all", fundTheme: "all", fundGeo: "all", fundStyle: "all", fundRank: "core", smartMoneyScope: "all", smartMoneyType: "all", smartMoneyHubMode: "feed", portfolioTableSort: "value-desc", portfolioTableQuery: "", stockPreset: "all", stockDiscoverPreset: "compounders", stockPerspective: "overview", stockCustomColumns: null, sectorLabMode: "discover", sectorCompareSelection: [], sectorDeepDive: null, insiderChartFilter: "all" };

  const els = {
    list: document.getElementById("list"),
    search: document.getElementById("search"),
    stockHeroSearch: document.getElementById("stock-hero-search"),
    stockFiltersBtn: document.getElementById("stock-filters-btn"),
    stockAdvancedFilters: document.getElementById("stock-advanced-filters"),
    stockMinScore: document.getElementById("stock-min-score"),
    stockMinQuality: document.getElementById("stock-min-quality"),
    stockMinGrowth: document.getElementById("stock-min-growth"),
    stockMinValue: document.getElementById("stock-min-value"),
    stockMinCap: document.getElementById("stock-min-cap"),
    stockMaxFpe: document.getElementById("stock-max-fpe"),
    stockClearFilters: document.getElementById("stock-clear-filters"),
    stockPerspectives: document.getElementById("stock-perspectives"),
    stockColumnsBtn: document.getElementById("stock-columns-btn"),
    stockColumnsPanel: document.getElementById("stock-columns-panel"),
    stockTableHead: document.getElementById("stock-table-head"),
    stockDiscoverCategories: document.getElementById("stock-discover-categories"),
    stockDiscoverBody: document.getElementById("stock-discover-body"),
    sectorLab: document.getElementById("sector-intelligence-lab"),
    sectorLabSector: document.getElementById("sector-lab-sector"),
    sectorLabModes: document.getElementById("sector-lab-modes"),
    sectorLabBody: document.getElementById("sector-lab-body"),
    sectorLabSelection: document.getElementById("sector-lab-selection"),
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
    metalsDashboard: document.getElementById("metals-dashboard"),
    metalsList: document.getElementById("metals-list"),
    metalsNote: document.getElementById("metals-note"),
    portfolioList: document.getElementById("portfolio-list"),
    portfolioDataHealth: document.getElementById("portfolio-data-health"),
    portfolioSummary: document.getElementById("portfolio-summary"),
    portfolioDecisionCenter: document.getElementById("portfolio-decision-center"),
    portfolioPositionsTable: document.getElementById("portfolio-positions-table"),
    portfolioStructureIntel: document.getElementById("portfolio-structure-intel"),
    portfolioOpportunityEngine: document.getElementById("portfolio-opportunity-engine"),
    portfolioRebalancingLab: document.getElementById("portfolio-rebalancing-lab"),
    exposurePanel: document.getElementById("exposure-panel"),
    portfolioFile: document.getElementById("portfolio-file"),
    portfolioImportTrigger: document.getElementById("portfolio-import-trigger"),
    portfolioImportStatus: document.getElementById("portfolio-import-status"),
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
    fundThemeFilters: document.getElementById("fund-theme-filters"),
    fundGeoFilters: document.getElementById("fund-geo-filters"),
    fundStyleFilters: document.getElementById("fund-style-filters"),
    fundFeeSaver: document.getElementById("fund-fee-saver"),
    fundCompareA: document.getElementById("fund-compare-a"),
    fundCompareB: document.getElementById("fund-compare-b"),
    fundCompareResult: document.getElementById("fund-compare-result"),
    fundPortfolioIntel: document.getElementById("fund-portfolio-intel"),
    fundRankingChips: document.getElementById("fund-ranking-chips"),
    fundRankingResults: document.getElementById("fund-ranking-results"),
    newsList: document.getElementById("news-list"),
    newsSearch: document.getElementById("news-search"),
    smartmoneyList: document.getElementById("smartmoney-list"),
    smartmoneyHealth: document.getElementById("smartmoney-health"),
    smartmoneyScopeFilters: document.getElementById("smartmoney-scope-filters"),
    smartmoneyTypeFilters: document.getElementById("smartmoney-type-filters"),
    smartmoneyHubModes: document.getElementById("smartmoney-hub-modes"),
    smartmoneyControls: document.getElementById("smartmoney-controls"),
    insiderAlertPanel: document.getElementById("insider-alert-panel"),
    insiderIntelligencePanel: document.getElementById("insider-intelligence-panel"),
    settingsTheme: document.getElementById("settings-theme"),
    settingsContrast: document.getElementById("settings-contrast"),
    settingsTextSize: document.getElementById("settings-text-size"),
    settingsMotion: document.getElementById("settings-motion"),
    insiderAlertToggle: document.getElementById("insider-alert-toggle"),
    insiderAlertStatus: document.getElementById("insider-alert-status"),
    exportAlertWatchlist: document.getElementById("export-alert-watchlist"),
    thesesList: document.getElementById("theses-list"),
    compareInput: document.getElementById("compare-input"),
    compareList: document.getElementById("compare-list"),
    bottomNavItems: document.querySelectorAll(".bottom-nav button[data-view]"),
    globalSearchBtn: document.getElementById("global-search-btn"),
    briefingCard: document.getElementById("briefing-card"),
    briefingGreeting: document.getElementById("briefing-greeting"),
    homeOpportunityStrip: document.getElementById("home-opportunity-strip"),
    homeAttentionSummary: document.getElementById("home-attention-summary"),
    homeChangeBrief: document.getElementById("home-change-brief"),
    homePortfolioBrief: document.getElementById("home-portfolio-brief"),
    homePortfolioFitBrief: document.getElementById("home-portfolio-fit-brief"),
    homeInsiderBrief: document.getElementById("home-insider-brief"),
    homeEarningsBrief: document.getElementById("home-earnings-brief"),
    homeMarketBrief: document.getElementById("home-market-brief"),
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
    settings: { title: "Definições", sub: "aparência · contraste · acessibilidade" },
  };

  // ---------- localStorage: portfolio (owned) + watchlist (starred) ----------
  // Both are plain ticker->true maps, kept only on this device. No server,
  // no sync between devices — that would need a backend, which breaks the
  // "free, static site" constraint.
  const LS_PORTFOLIO = "finscanner:portfolio";
  const LS_PORTFOLIO_BACKUP = "finscanner:portfolio:backup";
  const LS_WATCHLIST = "finscanner:watchlist";
  const LS_SECTOR_COMPARE = "finscanner:sectorCompare";
  const LS_INSIDER_ALERTS = "finscanner:insiderAlerts";
  const LS_INSIDER_SEEN = "finscanner:insiderSeen";
  const LS_REBALANCE_DRAFT = "finscanner:rebalanceDraft";

  function lsGet(key) {
    try { return JSON.parse(localStorage.getItem(key) || "{}"); }
    catch { return {}; }
  }
  function lsSet(key, obj) {
    try {
      const payload = JSON.stringify(obj);
      localStorage.setItem(key, payload);
      if (key === LS_PORTFOLIO) localStorage.setItem(LS_PORTFOLIO_BACKUP, payload);
    } catch (e) { console.warn("localStorage write failed", e); }
  }
  function restorePortfolioIfNeeded() {
    const primary = lsGet(LS_PORTFOLIO);
    if (primary && Object.keys(primary).length) return primary;
    const candidates = [LS_PORTFOLIO_BACKUP, "portfolio", "finscanner_portfolio", "finscanner:owned", "owned"];
    for (const key of candidates) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object" && Object.keys(parsed).length) {
          localStorage.setItem(LS_PORTFOLIO, JSON.stringify(parsed));
          localStorage.setItem(LS_PORTFOLIO_BACKUP, JSON.stringify(parsed));
          return parsed;
        }
      } catch {}
    }
    return {};
  }
  restorePortfolioIfNeeded();

  // Canonical portfolio accessor. Several intelligence modules call this
  // helper because it also restores the local backup when an iOS/PWA update
  // temporarily exposes an empty primary key. Keep all portfolio reads on
  // this path when they are used by dynamic views.
  function loadPortfolio() {
    const current = lsGet(LS_PORTFOLIO);
    if (current && Object.keys(current).length) return current;
    return restorePortfolioIfNeeded();
  }

  // Portfolio entries are objects: { qty: number|null, value: number|null }.
  // `true` (from the old boolean "owned" toggle) is treated as qty:1 for
  // backward compatibility with positions marked before the import
  // feature existed.
  function isOwned(ticker) { return !!lsGet(LS_PORTFOLIO)[ticker]; }
  function isWatched(ticker) { return !!lsGet(LS_WATCHLIST)[ticker]; }
  function loadSectorCompareSelection() {
    try { const v=JSON.parse(localStorage.getItem(LS_SECTOR_COMPARE)||"[]"); return Array.isArray(v)?v.filter(Boolean).slice(0,8):[]; } catch { return []; }
  }
  function saveSectorCompareSelection() {
    try { localStorage.setItem(LS_SECTOR_COMPARE, JSON.stringify(state.sectorCompareSelection.slice(0,8))); } catch {}
  }
  state.sectorCompareSelection = loadSectorCompareSelection();
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

  function exportAlertWatchlist() {
    const tickers = Object.keys(lsGet(LS_WATCHLIST)).filter(Boolean).sort();
    const payload = { schema_version: 1, generated_at: new Date().toISOString(), tickers };
    const blob = new Blob([JSON.stringify(payload, null, 2)+"\n"], {type:"application/json"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="alert_watchlist.json"; a.click();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  }

  function insiderSignalUi(r) {
    const txs = Array.isArray(r.insider_transactions_365d) ? r.insider_transactions_365d : (Array.isArray(r.insider_transactions) ? r.insider_transactions : []);
    const cutoff = Date.now() - 14*86400000;
    const recentBuys = txs.filter(tx=>tx.type==='buy' && Date.parse(tx.date||'')>=cutoff);
    const buyers = new Set(recentBuys.map(tx=>String(tx.owner||'Insider')));
    const latest = txs[0] || null;
    if (buyers.size >= 2) return {label:'CLUSTER BUYING', cls:'cluster'};
    if (latest?.type==='buy' && Number(latest.value||0)>=500000 && /CEO|Chief Executive|CFO|Chief Financial|President|Chairman|Director/i.test(latest.role||'')) return {label:'STRONG BUY',cls:'strong'};
    if (latest?.type==='sell' && Number(latest.value||0)>=1000000) return {label:'LARGE SALE',cls:'sale'};
    return null;
  }

  function insiderConviction(r) {
    const txs = Array.isArray(r.insider_transactions_365d) ? r.insider_transactions_365d : (Array.isArray(r.insider_transactions) ? r.insider_transactions : []);
    if (!txs.length) return {score:0,direction:'none',label:'Sem sinal',tx:null,reasons:[]};
    const sorted = txs.slice().sort((a,b)=>String(b.date||'').localeCompare(String(a.date||'')));
    const tx = sorted[0];
    const isBuy = tx.type === 'buy';
    const value = Math.max(0, Number(tx.value)||0);
    const role = String(tx.role||'');
    const senior = /CEO|Chief Executive|CFO|Chief Financial|President|Chairman/i.test(role);
    const director = /Director/i.test(role);
    const now = Date.now(), when = Date.parse(tx.date||'');
    const age = Number.isFinite(when) ? Math.max(0,(now-when)/86400000) : 999;
    let score = 0; const reasons=[];
    if(value>=2000000){score+=35;reasons.push('operação ≥ $2M');}
    else if(value>=1000000){score+=32;reasons.push('operação ≥ $1M');}
    else if(value>=500000){score+=28;reasons.push('operação ≥ $500k');}
    else if(value>=100000){score+=22;reasons.push('operação ≥ $100k');}
    else if(value>=50000){score+=16;reasons.push('operação ≥ $50k');}
    else if(value>0){score+=9;reasons.push('valor reduzido/moderado');}
    else {score+=5;reasons.push('valor não reportado');}
    if(senior){score+=20;reasons.push('executivo sénior');}
    else if(director){score+=13;reasons.push('director');}
    else {score+=7;}
    if(age<=7){score+=15;reasons.push('≤7 dias');} else if(age<=30){score+=11;reasons.push('≤30 dias');} else if(age<=90){score+=6;}
    const clusterCut=now-14*86400000;
    const sameSideRecent=sorted.filter(x=>x.type===tx.type && Date.parse(x.date||'')>=clusterCut);
    if(isBuy && new Set(sameSideRecent.map(x=>String(x.owner||''))).size>=2){score+=18;reasons.push('cluster buying');}
    const prevOpp=sorted.slice(1).find(x=>x.owner===tx.owner && x.type!==tx.type && Number.isFinite(when) && (when-Date.parse(x.date||''))>=0 && (when-Date.parse(x.date||''))<=90*86400000);
    if(prevOpp){score+=9;reasons.push('reversal');}
    const txPrice=Number(tx.price), cur=Number(r.current_price);
    if(Number.isFinite(txPrice)&&txPrice>0&&Number.isFinite(cur)&&cur>0){
      const gap=Math.abs(cur/txPrice-1);
      if(gap<=0.05){score+=10;reasons.push('preço atual ±5%');}
      else if(gap<=0.10){score+=7;reasons.push('preço atual ±10%');}
      else if(gap<=0.20){score+=4;}
    }
    score=Math.min(100,Math.round(score));
    const label=score>=80?'Muito forte':score>=60?'Forte':score>=40?'Moderado':'Fraco';
    return {score,direction:isBuy?'buy':'sell',label,tx,reasons};
  }

  function insiderNearLow(r) {
    const hist = Array.isArray(r.insider_price_history_1y) ? r.insider_price_history_1y : [];
    const vals = hist.map(x=>Number(x.close ?? x.price ?? x.value)).filter(Number.isFinite);
    if (vals.length < 8) return null;
    const low = Math.min(...vals), current = Number(r.current_price ?? vals[vals.length-1]);
    if (!Number.isFinite(current) || low <= 0) return null;
    const pct = (current/low - 1) * 100;
    return {pct, isNear:pct <= 15, low, current};
  }

  function insiderOpportunityScore(r) {
    const txs = Array.isArray(r.insider_transactions_365d) ? r.insider_transactions_365d : (Array.isArray(r.insider_transactions) ? r.insider_transactions : []);
    const buys = txs.filter(tx => tx.type === 'buy');
    if (!buys.length) return {score:0,label:'Sem compra',reasons:[],components:{}};
    const buyConv = insiderConviction({...r, insider_transactions_365d: buys, insider_transactions: buys});
    const quality = Math.max(0, Math.min(100, Number(r.quality_pct ?? r.profitability_pct ?? 50)));
    const value = Math.max(0, Math.min(100, Number(r.value_pct ?? 50)));
    const growth = Math.max(0, Math.min(100, Number(r.growth_pct ?? 50)));
    const near = insiderNearLow(r);
    const thesis = String(r.thesis_direction || '').toLowerCase();

    let score = buyConv.score * 0.45 + quality * 0.20 + value * 0.15 + growth * 0.05;
    const reasons = [];
    if (buyConv.score >= 80) reasons.push('conviction insider muito forte');
    else if (buyConv.score >= 60) reasons.push('conviction insider forte');
    if (quality >= 75) reasons.push(`quality ${Math.round(quality)}`);
    if (value >= 70) reasons.push(`value ${Math.round(value)}`);
    if (near) {
      if (near.pct <= 5) { score += 10; reasons.push(`preço +${near.pct.toFixed(1)}% do mínimo 1Y`); }
      else if (near.pct <= 15) { score += 8; reasons.push(`perto do mínimo 1Y`); }
      else if (near.pct <= 30) { score += 4; }
    }
    if (thesis === 'strengthening') { score += 5; reasons.push('tese a reforçar'); }
    else if (thesis === 'stable' || thesis === 'baseline') score += 2;
    else if (thesis === 'weakening') { score -= 6; reasons.push('tese a piorar'); }
    if (Number(r.insider_net_value_30d || 0) > 0) score += 3;
    if (String(r.zombie || '').toLowerCase() === 'yes') { score -= 12; reasons.push('penalização zombie'); }
    score = Math.max(0, Math.min(100, Math.round(score)));
    const label = score >= 80 ? 'Excecional' : score >= 65 ? 'Forte' : score >= 50 ? 'Interessante' : score >= 35 ? 'Fraco' : 'Baixo';
    return {
      score, label, reasons,
      components: {conviction:buyConv.score, quality:Math.round(quality), value:Math.round(value), growth:Math.round(growth), nearLowPct:near?.pct ?? null}
    };
  }

  function insiderAlertConfig() {
    try { return JSON.parse(localStorage.getItem(LS_INSIDER_ALERTS)||'{"enabled":false}'); } catch { return {enabled:false}; }
  }
  function insiderSeenKeys() {
    try { const x=JSON.parse(localStorage.getItem(LS_INSIDER_SEEN)||'[]'); return new Set(Array.isArray(x)?x:[]); } catch { return new Set(); }
  }
  function saveInsiderSeen(keys) {
    try { localStorage.setItem(LS_INSIDER_SEEN,JSON.stringify([...keys].slice(-700))); } catch {}
  }
  function alertUniverseRows() {
    const p=lsGet(LS_PORTFOLIO), w=lsGet(LS_WATCHLIST);
    return (state.data?.stocks||[]).filter(r=>p[r.ticker]||w[r.ticker]);
  }
  function allAlertTransactions() {
    const out=[];
    for(const r of alertUniverseRows()){
      const txs=Array.isArray(r.insider_transactions_365d)?r.insider_transactions_365d:(Array.isArray(r.insider_transactions)?r.insider_transactions:[]);
      for(const tx of txs) out.push({ticker:r.ticker,name:r.name||r.ticker,currency:r.currency||'USD',tx,key:insiderTxKey(r.ticker,tx)});
    }
    return out.sort((a,b)=>String(b.tx.date||'').localeCompare(String(a.tx.date||'')));
  }
  function refreshInsiderAlertUi() {
    if(!els.insiderAlertToggle||!els.insiderAlertStatus)return;
    const cfg=insiderAlertConfig(); const perm=('Notification'in window)?Notification.permission:'unsupported';
    els.insiderAlertToggle.textContent=cfg.enabled?'Desativar alertas':'Ativar alertas';
    els.insiderAlertToggle.classList.toggle('import-btn--secondary',cfg.enabled);
    els.insiderAlertStatus.textContent=cfg.enabled ? (perm==='granted'?'Ativos para portfolio + watchlist. Aviso local quando a PWA detetar uma nova transação SEC.':'Ativos, mas o browser ainda não autorizou notificações.') : 'Alertas locais desativados. O push em background via ntfy funciona separadamente através do GitHub Actions.';
  }
  async function toggleInsiderAlerts() {
    const cfg=insiderAlertConfig();
    if(cfg.enabled){localStorage.setItem(LS_INSIDER_ALERTS,JSON.stringify({enabled:false}));refreshInsiderAlertUi();return;}
    if(!('Notification'in window)){alert('Este browser não suporta notificações Web.');return;}
    const perm=await Notification.requestPermission();
    if(perm!=='granted'){refreshInsiderAlertUi();return;}
    // Baseline current data to avoid a flood of historical alerts on first enable.
    const seen=new Set(allAlertTransactions().map(x=>x.key)); saveInsiderSeen(seen);
    localStorage.setItem(LS_INSIDER_ALERTS,JSON.stringify({enabled:true,enabledAt:new Date().toISOString()}));
    refreshInsiderAlertUi();
  }
  async function checkInsiderAlerts() {
    const cfg=insiderAlertConfig(); if(!cfg.enabled||!state.data||!('Notification'in window)||Notification.permission!=='granted')return;
    const seen=insiderSeenKeys(), all=allAlertTransactions(); const fresh=all.filter(x=>!seen.has(x.key));
    all.forEach(x=>seen.add(x.key)); saveInsiderSeen(seen); if(!fresh.length)return;
    const reg=await navigator.serviceWorker?.ready?.catch(()=>null);
    for(const x of fresh.slice(0,4)){
      const tx=x.tx; const title=`${x.ticker}: insider ${tx.type==='buy'?'comprou':'vendeu'}`;
      const body=`${tx.owner||'Insider'}${tx.role?' · '+tx.role:''} · ${tx.shares==null?'':Number(tx.shares).toLocaleString('pt-PT')+' ações · '}${fmtMoney(tx.value,x.currency)} · ${tx.date||''}`;
      if(reg?.showNotification) await reg.showNotification(title,{body,tag:'insider-'+x.key,data:{ticker:x.ticker,url:location.href},icon:'icons/icon-192.png',badge:'icons/icon-192.png'});
      else new Notification(title,{body,tag:'insider-'+x.key});
    }
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

  // ---------- Appearance settings, persisted ----------
  const LS_THEME = "finscanner:theme";
  const LS_CONTRAST = "finscanner:contrast";
  const LS_TEXT_SIZE = "finscanner:textSize";
  const LS_REDUCE_MOTION = "finscanner:reduceMotion";
  const systemThemeQuery = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function currentThemePreference(){ return localStorage.getItem(LS_THEME) || "system"; }
  function resolvedTheme(pref=currentThemePreference()) {
    if (pref === "system") return systemThemeQuery?.matches ? "dark" : "light";
    return pref === "dark" ? "dark" : "light";
  }
  function syncSettingsUi(){
    const themePref=currentThemePreference();
    els.settingsTheme?.querySelectorAll('[data-theme-choice]').forEach(b=>b.classList.toggle('is-active',b.dataset.themeChoice===themePref));
    const contrast=localStorage.getItem(LS_CONTRAST)||'normal';
    els.settingsContrast?.querySelectorAll('[data-contrast-choice]').forEach(b=>b.classList.toggle('is-active',b.dataset.contrastChoice===contrast));
    const text=localStorage.getItem(LS_TEXT_SIZE)||'normal';
    els.settingsTextSize?.querySelectorAll('[data-text-choice]').forEach(b=>b.classList.toggle('is-active',b.dataset.textChoice===text));
    const motion=localStorage.getItem(LS_REDUCE_MOTION)==='true';
    if(els.settingsMotion){els.settingsMotion.classList.toggle('is-active',motion);els.settingsMotion.setAttribute('aria-checked',String(motion));}
  }
  function applyAppearance() {
    const pref=currentThemePreference(), theme=resolvedTheme(pref);
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.setAttribute("data-theme-preference", pref);
    document.documentElement.setAttribute("data-contrast", localStorage.getItem(LS_CONTRAST)||"normal");
    document.documentElement.setAttribute("data-text-size", localStorage.getItem(LS_TEXT_SIZE)||"normal");
    document.documentElement.setAttribute("data-reduce-motion", localStorage.getItem(LS_REDUCE_MOTION)==='true'?'true':'false');
    const themeMeta=document.querySelector('meta[name="theme-color"]');
    if(themeMeta) themeMeta.setAttribute('content',theme==='dark'?'#20241d':'#fef5e8');
    if(els.themeIcon) els.themeIcon.textContent=theme==='dark'?'☀':'☾';
    if(els.themeLabel) els.themeLabel.textContent=`Aparência · ${pref==='system'?'Sistema':theme==='dark'?'Escuro':'Claro'}`;
    syncSettingsUi();
  }
  function initTheme(){ applyAppearance(); }
  on(els.themeToggle,"click",()=>switchView('settings'));
  els.settingsTheme?.querySelectorAll('[data-theme-choice]').forEach(btn=>on(btn,'click',()=>{localStorage.setItem(LS_THEME,btn.dataset.themeChoice);applyAppearance();}));
  els.settingsContrast?.querySelectorAll('[data-contrast-choice]').forEach(btn=>on(btn,'click',()=>{localStorage.setItem(LS_CONTRAST,btn.dataset.contrastChoice);applyAppearance();}));
  els.settingsTextSize?.querySelectorAll('[data-text-choice]').forEach(btn=>on(btn,'click',()=>{localStorage.setItem(LS_TEXT_SIZE,btn.dataset.textChoice);applyAppearance();}));
  on(els.settingsMotion,'click',()=>{const next=localStorage.getItem(LS_REDUCE_MOTION)!=='true';localStorage.setItem(LS_REDUCE_MOTION,String(next));applyAppearance();});
  systemThemeQuery?.addEventListener?.('change',()=>{if(currentThemePreference()==='system')applyAppearance();});
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
    else if (v === "settings") syncSettingsUi();
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

  // Interaction router for all dynamically rendered controls. Capture phase is
  // deliberate: it survives nested cards, re-renders and iOS PWA click quirks.
  function safeOpenTicker(ticker) {
    const raw = String(ticker || "").trim();
    if (!raw) return false;
    const hit = state.data?.stocks?.find?.(r => String(r.ticker || "").toUpperCase() === raw.toUpperCase());
    const tk = hit?.ticker || raw;
    try {
      openDetail(tk);
      if (!els.detail?.hidden) return true;
      console.warn("Ticker not found for dossier", tk);
      return false;
    } catch (err) {
      console.error("openDetail failed", tk, err);
      // Do not silently redirect to Stocks: that masked runtime failures and
      // made every button look as though it navigated to the same screen.
      const msg = document.createElement("div");
      msg.className = "interaction-error-toast";
      msg.textContent = `Não foi possível abrir ${tk}. Tenta novamente após recarregar a app.`;
      document.body.appendChild(msg);
      setTimeout(() => msg.remove(), 3200);
      return false;
    }
  }
  function dossierHash(ticker) { return `#dossier=${encodeURIComponent(String(ticker || ""))}`; }
  function routeDossierHash() {
    const m = String(location.hash || "").match(/^#dossier=(.+)$/);
    if (!m) return;
    const tk = decodeURIComponent(m[1] || "");
    if (state.data?.stocks?.length) safeOpenTicker(tk);
  }
  document.addEventListener("click", (e) => {
    const target = e.target instanceof Element ? e.target : null;
    const openBtn = target?.closest("[data-open-dossier], .briefing-open, .home-opportunity-card, [data-brief-ticker]");
    if (openBtn) {
      const ticker = openBtn.dataset.openDossier || openBtn.dataset.ticker || openBtn.dataset.briefTicker;
      if (ticker) {
        e.preventDefault();
        if (location.hash !== dossierHash(ticker)) history.replaceState(null, "", dossierHash(ticker));
        safeOpenTicker(ticker);
        return;
      }
    }
    const goto = target?.closest("[data-brief-goto]");
    if (goto?.dataset.briefGoto) { e.preventDefault(); switchView(goto.dataset.briefGoto); }
  }, true);
  window.addEventListener("hashchange", routeDossierHash);

  function renderHome() {
    if (els.briefingGreeting) {
      const h = new Date().getHours();
      els.briefingGreeting.textContent = h < 12 ? "Bom dia" : h < 19 ? "Boa tarde" : "Boa noite";
    }
    if (!els.briefingCard || !state.data?.stocks?.length) return;
    const rows = state.data.stocks.filter(r => r.quote_type !== "ETF" && !isAustralianScannerRow(r) && Number.isFinite(Number(r.score)));
    const strengthen = rows.filter(r => r.thesis_direction === "strengthening").sort((a,b)=>(b.thesis_score_delta||0)-(a.thesis_score_delta||0))[0];
    const insider = rows.filter(r => Number(r.insider_net_value_30d) > 0).sort((a,b)=>(b.insider_net_value_30d||0)-(a.insider_net_value_30d||0))[0];
    const top = strengthen || insider || rows.slice().sort((a,b)=>(b.score||0)-(a.score||0))[0];
    if (!top) return;
    const signal = strengthen ? "Tese a reforçar" : insider ? "Smart money" : "Qualidade em destaque";
    const body = strengthen ? (top.thesis_evolution_summary || top.thesis_summary) : insider ? `Compras líquidas de insiders: ${fmtMoney(top.insider_net_value_30d, top.currency || "USD")}.` : `Score ${Math.round(top.score)} · qualidade ${Math.round(top.quality_pct ?? 0)} · crescimento ${Math.round(top.growth_pct ?? 0)}.`;
    els.briefingCard.innerHTML = `<span class="briefing-signal">${escapeHtml(signal)}</span><small>${escapeHtml(top.ticker)}</small><h3>${escapeHtml(top.name || top.ticker)}</h3><p>${escapeHtml(body || "")}</p><a class="briefing-open" href="${dossierHash(top.ticker)}" data-open-dossier="${escapeHtml(top.ticker)}">Abrir dossier →</a>`;

    renderHomeOpportunities(rows, top.ticker);
    renderHomeDailyBrief(rows);
    if (location.hash.startsWith("#dossier=")) setTimeout(routeDossierHash, 0);
  }

  function briefRowHtml(r, meta, tone="neutral") {
    return `<a class="home-brief-row ${tone}" href="${dossierHash(r.ticker)}" data-open-dossier="${escapeHtml(r.ticker)}"><span><b>${escapeHtml(r.ticker)}</b><small>${escapeHtml(r.name || r.ticker)}</small></span><em>${escapeHtml(meta)}</em></a>`;
  }

  function renderHomeDailyBrief(rows) {
    const owned = new Set(Object.keys(lsGet(LS_PORTFOLIO) || {}));
    const portfolioRows = rows.filter(r => owned.has(r.ticker));
    const strengthening = portfolioRows.filter(r => r.thesis_direction === "strengthening").sort((a,b)=>Number(b.thesis_score_delta||0)-Number(a.thesis_score_delta||0));
    const weakening = portfolioRows.filter(r => r.thesis_direction === "weakening").sort((a,b)=>Number(a.thesis_score_delta||0)-Number(b.thesis_score_delta||0));
    const earnings = rows.filter(r => { const d=Number(r.analyst_days_to_earnings); return Number.isFinite(d) && d>=0 && d<=7; }).sort((a,b)=>Number(a.analyst_days_to_earnings)-Number(b.analyst_days_to_earnings));
    const insider = rows.filter(r => Number(r.insider_buy_count_365d||0)>0 || Number(r.insider_net_value_30d||0)>0)
      .map(r => ({r, score: insiderOpportunityScore ? insiderOpportunityScore(r).score : Number(r.insider_conviction_score||0)}))
      .filter(x => Number.isFinite(x.score) && x.score>0).sort((a,b)=>b.score-a.score);

    if (els.homeAttentionSummary) {
      const ownedCount = portfolioRows.length;
      const highInsider = insider.filter(x=>x.score>=65).length;
      const portfolio = loadPortfolio();
      const hasPortfolio = portfolio && Object.keys(portfolio).length > 0;

      const bestCompanies = rows
        .filter(r => r.zombie !== 'yes' && r.zombie !== true && Number(r.score) >= 55)
        .map(r => {
          const q = Number(r.quality_pct ?? r.profitability_pct ?? 0);
          const v = Number(r.value_pct ?? 0);
          const g = Number(r.growth_pct ?? 0);
          const thesis = r.thesis_direction === 'strengthening' ? 8 : r.thesis_direction === 'weakening' ? -6 : 0;
          const rank = Number(r.score||0)*0.52 + q*0.18 + v*0.15 + g*0.15 + thesis;
          return {r, rank};
        })
        .sort((a,b)=>b.rank-a.rank).slice(0,3);

      const bestFit = hasPortfolio ? rows
        .filter(r => r.zombie !== 'yes' && r.zombie !== true && Number(r.score) >= 50)
        .map(r => ({r, pf: portfolioFitSnapshot(r, portfolio, state.data?.stocks || [])}))
        .filter(x => x.pf && !x.pf.held && Number.isFinite(x.pf.fit))
        .sort((a,b) => (b.pf.fit + Number(b.r.score||0)*0.18) - (a.pf.fit + Number(a.r.score||0)*0.18))
        .slice(0,3) : [];

      const risks = portfolioRows
        .map(r => {
          let risk = 0; const reasons = [];
          if (r.thesis_direction === 'weakening') { risk += 40 + Math.min(20, Math.abs(Number(r.thesis_score_delta||0))*2); reasons.push('tese ↓'); }
          if (r.zombie === 'yes' || r.zombie === true) { risk += 35; reasons.push('zombie'); }
          if (Number(r.score) < 45) { risk += 18; reasons.push(`score ${Math.round(Number(r.score||0))}`); }
          const d = Number(r.analyst_days_to_earnings);
          if (Number.isFinite(d) && d >= 0 && d <= 3) { risk += 10; reasons.push(d===0?'earnings hoje':`earnings ${Math.round(d)}d`); }
          return {r, risk, reasons};
        })
        .filter(x => x.risk > 0).sort((a,b)=>b.risk-a.risk).slice(0,3);

      const lane = (title, sub, body, tone='') => `<section class="attention-lane ${tone}"><header><span><b>${title}</b><small>${sub}</small></span></header><div>${body}</div></section>`;
      const bestHtml = bestCompanies.length ? bestCompanies.map(x=>briefRowHtml(x.r, `Score ${Math.round(Number(x.r.score||0))} · Q ${Math.round(Number(x.r.quality_pct ?? x.r.profitability_pct ?? 0))}`, 'good')).join('') : `<p class="home-brief-empty">Sem candidatos com dados suficientes.</p>`;
      const fitHtml = bestFit.length ? bestFit.map(x=>briefRowHtml(x.r, `Fit ${Math.round(x.pf.fit)}/100 · Score ${Math.round(Number(x.r.score||0))}`, x.pf.fit>=75?'good':'neutral')).join('') : `<p class="home-brief-empty">${hasPortfolio?'Sem candidatos com encaixe suficiente neste momento.':'Importa o portfolio para ativar este ranking.'}</p>`;
      const riskHtml = risks.length ? risks.map(x=>briefRowHtml(x.r, x.reasons.join(' · '), 'bad')).join('') : `<p class="home-brief-empty">Sem riscos prioritários detetados nas posições analisadas.</p>`;

      els.homeAttentionSummary.innerHTML = `<div class="home-brief-kpis">
        <div><b>${strengthening.length}</b><span>teses a melhorar</span></div>
        <div><b>${weakening.length}</b><span>teses a piorar</span></div>
        <div><b>${earnings.length}</b><span>earnings ≤7d</span></div>
        <div><b>${highInsider}</b><span>insider opp. ≥65</span></div>
      </div>
      <div class="attention-ranking">
        ${lane('Best Companies','força absoluta multifator',bestHtml,'attention-lane--best')}
        ${lane('Best Portfolio Fit','boas empresas que melhoram a carteira',fitHtml,'attention-lane--fit')}
        ${lane('Risks to Review','posições que merecem revisão primeiro',riskHtml,'attention-lane--risk')}
      </div>
      <p class="home-brief-note">${ownedCount ? `${ownedCount} posições do portfolio têm análise disponível neste briefing.` : 'Importa o portfolio para personalizar este resumo.'}</p>`;
    }

    if (els.homeChangeBrief) {
      const byTicker = new Map();
      const ensure = r => {
        if (!byTicker.has(r.ticker)) byTicker.set(r.ticker,{r, events:[]});
        return byTicker.get(r.ticker);
      };
      const add = (r, kind, weight, meta, tone='neutral', direction=0) => ensure(r).events.push({kind,weight,meta,tone,direction});

      rows.forEach(r => {
        const sd = Number(r.thesis_score_delta);
        if (Number.isFinite(sd) && Math.abs(sd) >= 1) add(r,'score',Math.abs(sd)*3,`Score ${sd>0?'+':''}${sd.toFixed(1)} vs última atualização`,sd>0?'good':'bad',Math.sign(sd));
        if (r.thesis_direction === 'changed') add(r,'thesis-change',34,`Mudança de tese${r.thesis_previous_type ? ` · ${r.thesis_previous_type} → ${r.thesis_type||'nova tese'}` : ''}`,'bad',-1);
        else if (r.thesis_direction === 'strengthening') add(r,'thesis',21,'Tese a reforçar','good',1);
        else if (r.thesis_direction === 'weakening') add(r,'thesis',25,'Tese a enfraquecer','bad',-1);
        const id = Number(r.insider_net_value_delta);
        if (Number.isFinite(id) && Math.abs(id) >= 50000) add(r,'insider',Math.min(26,Math.log10(Math.abs(id)+1)*3),`Insider flow ${id>0?'+':''}${fmtMoney(id,r.currency||'USD')} vs última atualização`,id>0?'good':'bad',Math.sign(id));
        const er = Number(r.analyst_eps_next_y_revision_delta_pp);
        if (Number.isFinite(er) && Math.abs(er) >= 0.25) add(r,'eps-revision',Math.min(22,Math.abs(er)*2.5),`Revisão EPS 30d ${er>0?'+':''}${er.toFixed(1)} pp`,er>0?'good':'bad',Math.sign(er));
        const pt = Number(r.analyst_price_target_upside_delta_pp);
        if (Number.isFinite(pt) && Math.abs(pt) >= 1) add(r,'target',Math.min(16,Math.abs(pt)),`Upside alvo ${pt>0?'+':''}${pt.toFixed(1)} pp`,pt>0?'good':'bad',Math.sign(pt));
        if (r.analyst_latest_earnings_date_changed && r.analyst_latest_eps_surprise_pct != null) {
          const sp=Number(r.analyst_latest_eps_surprise_pct);
          if (Number.isFinite(sp)) add(r,'earnings',25,`Novo earnings · surpresa EPS ${sp>0?'+':''}${sp.toFixed(1)}%`,sp>=0?'good':'bad',Math.sign(sp));
        }
      });

      const classified=[...byTicker.values()].map(x=>{
        const ev=x.events.sort((a,b)=>b.weight-a.weight);
        const kinds=new Set(ev.map(e=>e.kind));
        const sd=Number(x.r.thesis_score_delta||0), er=Number(x.r.analyst_eps_next_y_revision_delta_pp||0);
        const s7=Number(x.r.thesis_score_delta_7d), s30=Number(x.r.thesis_score_delta_30d);
        const e7=Number(x.r.analyst_eps_next_y_revision_delta_7d_pp), e30=Number(x.r.analyst_eps_next_y_revision_delta_30d_pp);
        const has7=Number.isFinite(s7) && x.r.thesis_history_7d_date;
        const has30=Number.isFinite(s30) && x.r.thesis_history_30d_date;
        const aligned = ev.filter(e=>e.direction!==0).reduce((a,e)=>a+e.direction,0);
        let cls='noise', confidence=35;
        if (kinds.has('thesis-change') || (kinds.has('thesis') && Math.abs(sd)>=3) || (Math.abs(sd)>=5 && Math.abs(er)>=1 && Math.sign(sd)===Math.sign(er))) {
          cls='structural'; confidence=Math.min(95,70+ev.length*4+Math.min(12,Math.abs(sd)*2));
        } else if (kinds.has('earnings') || Math.abs(er)>=2 || kinds.has('insider') || Math.abs(sd)>=2) {
          cls='event'; confidence=Math.min(85,55+ev.length*4+Math.min(10,Math.abs(er)*2));
        }
        // Multiple small signals that point the same way are promoted from noise.
        if(cls==='noise' && ev.length>=3 && Math.abs(aligned)>=2){ cls='event'; confidence=58; }

        // Persistence lens: daily change is interpreted in the context of ~7d and ~30d snapshots.
        // This deliberately describes persistence, not expected future returns.
        let persistence='new', persistenceLabel='Nova alteração', persistenceTone='neutral';
        let persistenceDetail=has7 ? `7d ${s7>=0?'+':''}${s7.toFixed(1)} score` : 'histórico 7d ainda curto';
        const currentSign = Math.sign(sd || aligned || er);
        const sign7 = has7 ? Math.sign(s7) : 0;
        const sign30 = has30 ? Math.sign(s30) : 0;
        const aligned7 = currentSign && sign7 && currentSign===sign7;
        const aligned30 = currentSign && sign30 && currentSign===sign30;
        const reversal = currentSign && ((sign7 && currentSign!==sign7) || (sign30 && currentSign!==sign30));
        if (has30 && aligned7 && aligned30 && (Math.abs(s30)>=3 || Math.abs(e30)>=1)) {
          persistence='persistent'; persistenceLabel='Persistente 30d'; persistenceTone=currentSign>0?'good':'bad';
          persistenceDetail=`7d ${s7>=0?'+':''}${s7.toFixed(1)} · 30d ${s30>=0?'+':''}${s30.toFixed(1)} score`;
          confidence=Math.min(97,confidence+10);
          if(cls==='event' && Math.abs(s30)>=5) cls='structural';
        } else if (has7 && aligned7 && (Math.abs(s7)>=2 || Math.abs(e7)>=0.75)) {
          persistence='confirming'; persistenceLabel='A confirmar 7d'; persistenceTone=currentSign>0?'good':'bad';
          persistenceDetail=`7d ${s7>=0?'+':''}${s7.toFixed(1)} score${has30?` · 30d ${s30>=0?'+':''}${s30.toFixed(1)}`:''}`;
          confidence=Math.min(92,confidence+5);
        } else if (reversal) {
          persistence='reversal'; persistenceLabel='Reversão'; persistenceTone='warn';
          persistenceDetail=`hoje ${sd>=0?'+':''}${sd.toFixed(1)} · ${has7?`7d ${s7>=0?'+':''}${s7.toFixed(1)}`:''}${has30?` · 30d ${s30>=0?'+':''}${s30.toFixed(1)}`:''}`;
          confidence=Math.max(45,confidence-5);
        } else if (has30) {
          persistence='isolated'; persistenceLabel='Isolada'; persistenceTone='neutral';
          persistenceDetail=`30d ${s30>=0?'+':''}${s30.toFixed(1)} score`;
        }

        const best=ev[0];
        const score=(cls==='structural'?100:cls==='event'?55:0)+(best?.weight||0)+(ev.length-1)*3+(persistence==='persistent'?18:persistence==='confirming'?8:persistence==='reversal'?4:0);
        return {...x,cls,confidence,score,best,persistence,persistenceLabel,persistenceTone,persistenceDetail};
      });
      const structural=classified.filter(x=>x.cls==='structural').sort((a,b)=>b.score-a.score).slice(0,5);
      const events=classified.filter(x=>x.cls==='event').sort((a,b)=>b.score-a.score).slice(0,5);
      const noiseCount=classified.filter(x=>x.cls==='noise').length;
      const persistentCount=classified.filter(x=>x.persistence==='persistent' && x.cls!=='noise').length;
      const confirmingCount=classified.filter(x=>x.persistence==='confirming' && x.cls!=='noise').length;
      const reversalCount=classified.filter(x=>x.persistence==='reversal' && x.cls!=='noise').length;
      const group=(label,subtitle,list,cls)=>list.length?`<section class="change-intel-group ${cls}"><header><span><b>${label}</b><small>${subtitle}</small></span><em>${list.length}</em></header><div>${list.map(x=>`<div class="change-intel-item">${briefRowHtml(x.r,x.best.meta,x.best.tone)}<div class="change-temporal-meta"><span class="change-persistence ${x.persistenceTone}">${x.persistenceLabel}</span><small>${x.persistenceDetail}</small><span class="change-confidence">conf. ${Math.round(x.confidence)}%</span></div></div>`).join('')}</div></section>`:'';
      els.homeChangeBrief.innerHTML = structural.length || events.length
        ? `<div class="change-intel-summary"><span><b>${structural.length}</b> estruturais</span><span><b>${events.length}</b> eventos</span><span><b>${persistentCount}</b> persistentes 30d</span><span><b>${confirmingCount}</b> a confirmar 7d</span>${reversalCount?`<span><b>${reversalCount}</b> reversões</span>`:''}<span><b>${noiseCount}</b> ruído filtrado</span></div>${group('Mudança estrutural','pode alterar a tese ou o valor económico',structural,'structural')}${group('Evento relevante','merece atenção, mas precisa confirmação',events,'event')}${noiseCount?`<p class="change-noise-note">${noiseCount} oscilações pequenas foram ocultadas. A persistência de 7/30 dias aumenta a confiança; uma reversão reduz a urgência até confirmação.</p>`:''}`
        : `<p class="home-brief-empty">Ainda não há alterações materiais face à atualização anterior. O motor ignora pequenas oscilações isoladas e fica mais útil após dois ou mais workflows diários.</p>`;
    }

    if (els.homePortfolioBrief) {
      const list = [...strengthening.slice(0,3).map(r=>({r,meta:`↑ ${Number(r.thesis_score_delta||0)>=0?'+':''}${Number(r.thesis_score_delta||0).toFixed(1)} score`,tone:'good'})), ...weakening.slice(0,3).map(r=>({r,meta:`↓ ${Number(r.thesis_score_delta||0).toFixed(1)} score`,tone:'bad'}))];
      els.homePortfolioBrief.innerHTML = list.length ? list.map(x=>briefRowHtml(x.r,x.meta,x.tone)).join('') : `<p class="home-brief-empty">Sem mudanças materiais de tese nas posições analisadas.</p>`;
    }

    if (els.homePortfolioFitBrief) {
      const portfolio = loadPortfolio();
      const hasPortfolio = portfolio && Object.keys(portfolio).length > 0;
      const fitRows = hasPortfolio ? rows.map(r => ({r, pf: portfolioFitSnapshot(r, portfolio, state.data?.stocks || [])}))
        .filter(x => x.pf && !x.pf.held && Number.isFinite(x.pf.fit) && x.pf.fit >= 55)
        .sort((a,b) => b.pf.fit - a.pf.fit)
        .slice(0,6) : [];
      els.homePortfolioFitBrief.innerHTML = fitRows.length ? fitRows.map(x => briefRowHtml(x.r, `Portfolio Fit ${Math.round(x.pf.fit)}/100 · ${x.pf.label}`, x.pf.fit >= 75 ? 'good' : 'neutral')).join('') : `<p class="home-brief-empty">${hasPortfolio ? 'Ainda não há candidatos com encaixe estrutural suficiente nos dados disponíveis.' : 'Importa o portfolio para calcular quais empresas melhoram mais a estrutura atual.'}</p>`;
    }

    if (els.homeInsiderBrief) {
      const list = insider.slice(0,5);
      els.homeInsiderBrief.innerHTML = list.length ? list.map(x=>briefRowHtml(x.r,`Opportunity ${Math.round(x.score)}/100`,x.score>=75?'good':'neutral')).join('') : `<p class="home-brief-empty">Sem compras insider com contexto suficiente neste momento.</p>`;
    }

    if (els.homeEarningsBrief) {
      els.homeEarningsBrief.innerHTML = earnings.length ? earnings.slice(0,6).map(r=>{ const d=Math.max(0,Math.round(Number(r.analyst_days_to_earnings))); return briefRowHtml(r,d===0?'hoje':d===1?'amanhã':`${d} dias`,d<=2?'bad':'neutral'); }).join('') : `<p class="home-brief-empty">Nenhum earnings relevante nos próximos 7 dias dentro do universo analisado.</p>`;
    }

    if (els.homeMarketBrief) {
      const quality = rows.filter(r=>Number(r.score)>=75).length;
      const median = rows.map(r=>Number(r.score)).filter(Number.isFinite).sort((a,b)=>a-b);
      const med = median.length ? median[Math.floor(median.length/2)] : null;
      const gold = state.metals?.metals?.find?.(m=>m.symbol==='GC=F') || state.metals?.find?.(m=>m.symbol==='GC=F');
      const goldText = gold && Number.isFinite(Number(gold.price)) ? `Ouro ${Number(gold.price).toLocaleString('pt-PT',{maximumFractionDigits:0})}` : 'Metais disponíveis na tab Metals';
      els.homeMarketBrief.innerHTML = `<div class="home-brief-kpis home-brief-kpis--three"><div><b>${rows.length}</b><span>ações analisadas</span></div><div><b>${quality}</b><span>score ≥75</span></div><div><b>${med==null?'—':Math.round(med)}</b><span>score mediano</span></div></div><button class="home-brief-link" data-brief-goto="metals">${escapeHtml(goldText)} · abrir Metals →</button>`;
    }

  }

  function renderHomeOpportunities(rows, featuredTicker) {
    if (!els.homeOpportunityStrip) return;
    const eligible = rows.filter(r => r.ticker !== featuredTicker && r.zombie !== "yes" && r.zombie !== true);
    const strict = eligible.filter(r => Number(r.score) >= 60 && Number(r.quality_pct ?? r.profitability_pct ?? 0) >= 60 && Number(r.value_pct ?? 0) >= 45);
    const pool = strict.length >= 4 ? strict : (eligible.length ? eligible : rows.filter(r => r.ticker !== featuredTicker));
    const ranked = pool.slice().sort((a,b) => {
      const ax = Number(a.quality_value_score ?? 0) + (a.thesis_direction === "strengthening" ? 8 : 0) + Number(a.score ?? 0) * 0.12;
      const bx = Number(b.quality_value_score ?? 0) + (b.thesis_direction === "strengthening" ? 8 : 0) + Number(b.score ?? 0) * 0.12;
      return bx - ax;
    }).slice(0, 8);
    if (!ranked.length) {
      els.homeOpportunityStrip.innerHTML = `<div class="home-opportunity-loading">Ainda não há oportunidades com dados suficientes.</div>`;
      return;
    }
    els.homeOpportunityStrip.innerHTML = ranked.map(r => {
      const q = Math.round(Number(r.quality_pct ?? r.profitability_pct ?? 0));
      const v = Math.round(Number(r.value_pct ?? 0));
      const g = Math.round(Number(r.growth_pct ?? 0));
      const direction = r.thesis_direction === "strengthening" ? "↗ tese a reforçar" : r.thesis_direction === "weakening" ? "↘ tese a enfraquecer" : "→ tese estável";
      return `<a class="home-opportunity-card" href="${dossierHash(r.ticker)}" data-open-dossier="${escapeHtml(r.ticker)}">
        <span class="home-opportunity-card__meta"><b>${escapeHtml(r.ticker)}</b><em>${Math.round(Number(r.score ?? 0))}</em></span>
        <strong>${escapeHtml(r.name || r.ticker)}</strong>
        <small>${escapeHtml(direction)}</small>
        <span class="home-opportunity-card__axes"><i>Q ${q}</i><i>V ${v}</i><i>G ${g}</i></span>
        <span class="home-opportunity-card__open">Abrir dossier →</span>
      </a>`;
    }).join("");
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

  // Yahoo/yfinance dividendYield is delivered in percentage points in the
  // current pipeline (e.g. 2.89 means 2.89%, unlike payout/FCF ratios which
  // are fractions). Keep a dedicated formatter to avoid 100× inflation.
  function fmtDividendYield(n) {
    if (n == null || !Number.isFinite(Number(n))) return "—";
    return Number(n).toFixed(1) + "%";
  }

  function dividendYieldFraction(n) {
    if (n == null || !Number.isFinite(Number(n))) return null;
    return Number(n) / 100;
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
      refreshInsiderAlertUi();
      setTimeout(()=>checkInsiderAlerts().catch(()=>{}),500);
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

  async function loadMetalsBrief() {
    try {
      state.metalsBrief = await fetchJson("data/metals_brief.json", 10000);
      if (state.activeView === "metals" && state.metals) renderMetals();
    } catch (e) {
      state.metalsBrief = null;
      console.warn("metals_brief.json unavailable", e);
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

  async function loadFxHistory() {
    try {
      state.fxHistory = await fetchJson("data/fx_history.json", 15000);
      if (state.activeView === "portfolio") renderPortfolio();
    } catch (e) {
      state.fxHistory = { base: "EUR", series: {} };
      console.warn("fx_history.json unavailable; cost basis will temporarily use current FX", e);
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

  function fmtSigned(v, digits=1) {
    if (v == null || !Number.isFinite(Number(v))) return "—";
    const n = Number(v);
    return `${n >= 0 ? "+" : ""}${n.toFixed(digits)}%`;
  }

  function metalInstrument(ticker) {
    return state.metals?.instruments?.find(i => i.ticker === ticker) || null;
  }

  function ratioValue(aTicker, bTicker) {
    const a = metalInstrument(aTicker)?.data?.price;
    const b = metalInstrument(bTicker)?.data?.price;
    return Number.isFinite(Number(a)) && Number.isFinite(Number(b)) && Number(b) !== 0 ? Number(a) / Number(b) : null;
  }

  function relativeSignal(value, low, high, lowLabel, fairLabel, highLabel) {
    if (!Number.isFinite(Number(value))) return { label: "sem dados", cls: "neutral" };
    if (value < low) return { label: lowLabel, cls: "good" };
    if (value > high) return { label: highLabel, cls: "weak" };
    return { label: fairLabel, cls: "neutral" };
  }

  function drawMetalSeries(canvas, days, field, opts = {}) {
    if (!canvas || !Array.isArray(days)) return false;
    const pts = days.map(d => ({date:d.date, value:Number(d[field])})).filter(x => Number.isFinite(x.value));
    if (pts.length < 2) return false;
    const values = pts.map(x => x.value);
    let min = Math.min(...values), max = Math.max(...values);
    if (max === min) { min -= 1; max += 1; }
    const ratio = window.devicePixelRatio || 1;
    const cssW = Math.max(260, canvas.clientWidth || 320), cssH = opts.height || 120;
    canvas.width = Math.round(cssW * ratio); canvas.height = Math.round(cssH * ratio);
    canvas.style.height = cssH + "px";
    const ctx = canvas.getContext("2d"); ctx.scale(ratio, ratio);
    const pad = {l:8,r:8,t:10,b:18}; const w=cssW-pad.l-pad.r, h=cssH-pad.t-pad.b;
    ctx.clearRect(0,0,cssW,cssH);
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--line').trim() || '#e5e7eb'; ctx.lineWidth=1;
    ctx.beginPath(); ctx.moveTo(pad.l,pad.t+h); ctx.lineTo(pad.l+w,pad.t+h); ctx.stroke();
    ctx.strokeStyle = opts.stroke || '#C9A063'; ctx.lineWidth=2.4; ctx.lineJoin='round'; ctx.lineCap='round'; ctx.beginPath();
    pts.forEach((pt,i)=>{ const x=pad.l+(i/(pts.length-1))*w; const y=pad.t+h-((pt.value-min)/(max-min))*h; i?ctx.lineTo(x,y):ctx.moveTo(x,y); }); ctx.stroke();
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--ink-muted').trim() || '#6b7280'; ctx.font='11px system-ui';
    ctx.fillText(pts[0].date?.slice(5)||'', pad.l, cssH-3); const end=pts[pts.length-1].date?.slice(5)||''; ctx.fillText(end, cssW-pad.r-ctx.measureText(end).width, cssH-3);
    return true;
  }

  function selectedMetalInstrument() {
    return metalInstrument(state.selectedMetal || "GC=F") || metalInstrument("GC=F");
  }

  function metalTabsHtml() {
    const tabs = [
      ["GC=F", "◇", "Gold"],
      ["SI=F", "ϟ", "Silver"],
      ["HG=F", "◔", "Copper"],
    ];
    return `<div class="metal-tabs" role="tablist" aria-label="Escolher metal">${tabs.map(([ticker,icon,label]) => `<button class="metal-tab ${state.selectedMetal===ticker?'is-active':''}" data-metal-tab="${ticker}" role="tab" aria-selected="${state.selectedMetal===ticker?'true':'false'}"><span>${icon}</span>${label}</button>`).join("")}</div>`;
  }

  function metalPriceCard(inst) {
    if (!inst?.data) return "";
    const d = inst.data;
    const unit = inst.unit || "";
    const positive = Number(d.day_change_pct) > 0;
    const changeCls = Number(d.day_change_pct) < 0 ? "down" : positive ? "up" : "";
    return `<section class="metal-primary-card">
      <div class="metal-primary-head"><div><span class="eyebrow">${escapeHtml(inst.label).toUpperCase()} · FUTURES</span><h3>${escapeHtml(inst.label)} <small>${escapeHtml(unit)}</small></h3></div><span class="metal-live-badge ${changeCls}">${fmtSigned(d.day_change_pct)}</span></div>
      <div class="metal-primary-price">${Number(d.price).toLocaleString("pt-PT", {maximumFractionDigits:3})}</div>
      <div class="metal-primary-facts">
        <span><strong>${fmtSigned(d.change_1y_pct)}</strong> em 12 meses</span>
        <span><strong>${fmtSigned(d.vs_200d_pct)}</strong> vs média 200d</span>
        <span><strong>${d.position_52w_pct != null ? Math.round(d.position_52w_pct) + "%" : "—"}</strong> da faixa 52s</span>
      </div>
      <div class="range-track"><span style="width:${Math.max(0,Math.min(100,Number(d.position_52w_pct)||0))}%"></span></div>
      <div class="range-labels"><span>mínimo 52s</span><span>máximo 52s</span></div>
    </section>`;
  }

  function metalsDailyBriefHtml() {
    const b = state.metalsBrief;
    if (!b || b.status !== "ok") return `<section class="metals-daily-brief metals-section-block"><div class="section-heading compact"><div><span class="eyebrow">DAILY METALS BRIEF</span><h3>Resumo diário</h3></div></div><p class="method-note">O relatório diário será gerado automaticamente pelo workflow das 06:00 (Portugal) quando os dados estiverem disponíveis.</p></section>`;
    const bullets = Array.isArray(b.bullets) ? b.bullets : [];
    return `<section class="metals-daily-brief metals-section-block">
      <div class="daily-brief-header"><div><span class="eyebrow">FINSCANNER DAILY METALS BRIEF</span><h3>${escapeHtml(b.title || "Metals Brief")}</h3><small>${escapeHtml(b.edition || "")}</small></div><span class="daily-brief-score">${b.pressure_score == null ? "—" : Math.round(Number(b.pressure_score))}</span></div>
      <p class="daily-brief-lead">${escapeHtml(b.lead || "")}</p>
      ${bullets.length ? `<ul class="daily-brief-list">${bullets.map(x=>`<li>${escapeHtml(x)}</li>`).join("")}</ul>` : ""}
      <p class="method-note">Relatório gerado deterministicamente a partir dos dados do pipeline; não é recomendação de investimento.</p>
    </section>`;
  }

  function renderMetals() {
    if (!state.metals || !state.metals.instruments || !state.metals.instruments.length) {
      if (els.metalsDashboard) els.metalsDashboard.innerHTML = `<p class="empty-state">Sem dados de metais ainda. Corre o pipeline.</p>`;
      els.metalsList.innerHTML = "";
      els.metalsNote.textContent = "";
      return;
    }
    const gold = metalInstrument("GC=F");
    const silver = metalInstrument("SI=F");
    const platinum = metalInstrument("PL=F");
    const palladium = metalInstrument("PA=F");
    const gsr = ratioValue("GC=F", "SI=F");
    const gpr = ratioValue("GC=F", "PL=F");
    const gpdr = ratioValue("GC=F", "PA=F");
    const gsrSig = relativeSignal(gsr, 55, 85, "prata relativamente cara", "faixa intermédia", "prata relativamente barata");
    const gprSig = relativeSignal(gpr, 1.4, 2.6, "platina relativamente cara", "faixa intermédia", "platina relativamente barata");
    const gpdrSig = relativeSignal(gpdr, 1.2, 3.2, "paládio relativamente caro", "faixa intermédia", "paládio relativamente barato");

    const physical = state.metals.physical || {};
    const comexGold = physical.comex?.gold || {};
    const comexSilver = physical.comex?.silver || {};
    const cotGold = physical.positioning?.gold || {};
    const sgeGold = physical.shanghai?.gold_benchmark || {};
    const centralBanks = physical.central_banks || {};
    const deliveries = physical.deliveries || {};
    const goldDelivery = deliveries.gold || {};
    const silverDelivery = deliveries.silver || {};
    const histTrend = state.metals.physical_history?.trends?.gold || {};
    const historyObs = state.metals.physical_history?.observations || 0;
    const historyRecent = state.metals.physical_history?.recent || [];
    const pressure = state.metals.physical_pressure_index || {};
    const ways = state.metals.ways_to_play || {};
    const pills = (ways.own_metal || []).map(x => `<button class="metal-pill" data-open-stock="${escapeHtml(x)}">${escapeHtml(x)}</button>`).join("");
    const minerPills = (ways.miners || []).map(x => `<button class="metal-pill" data-open-stock="${escapeHtml(x)}">${escapeHtml(x)}</button>`).join("");
    const royaltyPills = (ways.royalty_streaming || []).map(x => `<button class="metal-pill" data-open-stock="${escapeHtml(x)}">${escapeHtml(x)}</button>`).join("");

    const selectedMetal = selectedMetalInstrument();
    if (state.selectedMetal !== "GC=F") {
      const sd = selectedMetal?.data || {};
      const selectedComex = state.selectedMetal === "SI=F" ? comexSilver : {};
      const selectedDelivery = state.selectedMetal === "SI=F" ? silverDelivery : {};
      const selectedName = selectedMetal?.label || "Metal";
      const physicalStatus = state.selectedMetal === "SI=F" && selectedComex.status === "ok";
      if (els.metalsDashboard) els.metalsDashboard.innerHTML = `
        ${metalTabsHtml()}
        ${metalPriceCard(selectedMetal)}
        <section class="metals-section-block">
          <div class="section-heading compact"><div><span class="eyebrow">THE THREE FORCES</span><h3>O que está a mover ${escapeHtml(selectedName.toLowerCase())}</h3></div></div>
          <div class="force-grid">
            <article class="force-card"><span>TENDÊNCIA</span><strong>${sd.vs_200d_pct != null ? (sd.vs_200d_pct >= 0 ? "Acima" : "Abaixo") + " da média 200d" : "—"}</strong><small>${fmtSigned(sd.vs_200d_pct)} vs tendência longa</small></article>
            <article class="force-card"><span>VOLATILIDADE</span><strong>${sd.volatility_annualized_pct != null ? Number(sd.volatility_annualized_pct).toFixed(1) + "%" : "—"}</strong><small>volatilidade anualizada</small></article>
            <article class="force-card"><span>MERCADO FÍSICO</span><strong>${physicalStatus ? (Number(selectedComex.registered_oz||0)/1e6).toFixed(1)+" Moz" : "—"}</strong><small>${physicalStatus ? "COMEX registered inventory" : "sem fonte física integrada para este metal"}</small></article>
          </div>
        </section>
        ${state.selectedMetal === "SI=F" ? `<section class="metals-section-block"><div class="section-heading compact"><div><span class="eyebrow">SILVER · COMEX</span><h3>Inventário e deliveries</h3></div></div><div class="physical-grid"><article class="physical-card"><span>REGISTERED</span><strong class="physical-big">${physicalStatus ? (Number(selectedComex.registered_oz||0)/1e6).toFixed(1)+" Moz" : "—"}</strong><small>${physicalStatus ? "CME warehouse stocks" : "indisponível"}</small></article><article class="physical-card"><span>DELIVERY NOTICES</span><strong class="physical-big">${selectedDelivery.status === "ok" ? Number(selectedDelivery.daily_notices||0).toLocaleString("pt-PT") : "—"}</strong><small>${selectedDelivery.status === "ok" ? "notices do dia · não equivalem a saída de vault" : "indisponível"}</small></article></div></section>` : `<section class="metals-section-block"><div class="section-heading compact"><div><span class="eyebrow">COPPER CONTEXT</span><h3>Preço, tendência e volatilidade</h3></div></div><p class="method-note">O cobre permanece, por agora, uma leitura de mercado via futuros. Inventários LME/COMEX e positioning serão integrados apenas quando a fonte oficial estiver estável no pipeline.</p></section>`}
      `;
      els.metalsDashboard?.querySelectorAll("[data-metal-tab]").forEach(btn => btn.addEventListener("click", () => { state.selectedMetal = btn.dataset.metalTab || "GC=F"; renderMetals(); document.getElementById("view-metals")?.scrollIntoView({behavior:"smooth", block:"start"}); }));
      els.metalsNote.textContent = state.metals.note || "";
      els.metalsList.innerHTML = state.metals.instruments.map(metalCardHtml).join("");
      els.metalsList.querySelectorAll(".metal-card[data-ticker]").forEach(card => card.addEventListener("click", () => openMetalDetail(card.dataset.ticker)));
      return;
    }
    if (els.metalsDashboard) els.metalsDashboard.innerHTML = `
      ${metalTabsHtml()}
      ${metalPriceCard(selectedMetal)}
      <section class="metals-section-block">
        <div class="section-heading compact"><div><span class="eyebrow">THE THREE FORCES</span><h3>O que está a mover o metal</h3></div></div>
        <div class="force-grid">
          <article class="force-card"><span>TENDÊNCIA</span><strong>${gold?.data?.vs_200d_pct != null ? (gold.data.vs_200d_pct >= 0 ? "Acima" : "Abaixo") + " da média 200d" : "—"}</strong><small>${fmtSigned(gold?.data?.vs_200d_pct)} vs tendência longa</small></article>
          <article class="force-card"><span>VOLATILIDADE</span><strong>${gold?.data?.volatility_annualized_pct != null ? gold.data.volatility_annualized_pct.toFixed(1) + "%" : "—"}</strong><small>volatilidade anualizada</small></article>
          <article class="force-card"><span>PRESSÃO DE MERCADO</span><strong>${pressure.status === "ok" ? Math.round(Number(pressure.score)) + "/100" : "—"}</strong><small>${pressure.status === "ok" ? escapeHtml(pressure.label || "") + " · cobertura " + Math.round(Number(pressure.coverage_pct||0)) + "%" : "dados oficiais ainda insuficientes"}</small></article>
        </div>
      </section>

      <section class="metals-section-block pressure-index-block">
        <div class="section-heading compact"><div><span class="eyebrow">GOLD PRESSURE INDEX</span><h3>Pressão física e de procura, explicada</h3></div></div>
        ${pressure.status === "ok" ? `<div class="pressure-hero">
          <div class="pressure-score-ring" style="--pressure:${Math.max(0,Math.min(100,Number(pressure.score)||0))}"><strong>${Math.round(Number(pressure.score))}</strong><span>/100</span></div>
          <div><strong class="pressure-label">${escapeHtml(pressure.label || "")}</strong><p>Cobertura atual: ${Math.round(Number(pressure.coverage_pct||0))}% das componentes previstas. Componentes em falta são removidas e os pesos disponíveis são renormalizados.</p></div>
        </div>
        <div class="pressure-components">${(pressure.components||[]).map(c=>`<div class="pressure-component"><div><span>${escapeHtml(c.label||c.key)}</span><small>${escapeHtml(c.explain||"")}</small></div><div class="pressure-component-bar"><i style="width:${Math.max(0,Math.min(100,Number(c.score)||0))}%"></i></div><strong>${Math.round(Number(c.score)||0)}</strong></div>`).join("")}</div>
        <div class="metals-history-grid">
          <article><div class="physical-card-head"><span>REGISTERED INVENTORY</span><span class="source-state ${historyObs>1?'ok':'off'}">${historyObs} obs.</span></div><canvas id="gold-inventory-chart" class="metals-history-chart"></canvas><small>COMEX gold registered · onças</small></article>
          <article><div class="physical-card-head"><span>DELIVERY INTENSITY</span><span class="source-state ${historyObs>1?'ok':'off'}">histórico</span></div><canvas id="gold-delivery-chart" class="metals-history-chart"></canvas><small>notices diários · não equivale a retirada do vault</small></article>
          <article><div class="physical-card-head"><span>CFTC POSITIONING</span><span class="source-state ${historyObs>1?'ok':'off'}">semanal</span></div><canvas id="gold-positioning-chart" class="metals-history-chart"></canvas><small>managed-money net como % do open interest</small></article>
          <article><div class="physical-card-head"><span>PRESSURE INDEX</span><span class="source-state ${historyObs>1?'ok':'off'}">memória</span></div><canvas id="gold-pressure-chart" class="metals-history-chart"></canvas><small>índice 0–100 · histórico próprio</small></article>
        </div>
        <p class="method-note">${escapeHtml(pressure.method || "O índice só é mostrado quando existe cobertura material de fontes oficiais.")}</p>` : `<div class="empty-state">Ainda não existe cobertura suficiente para calcular o índice. O Finscanner não preenche componentes em falta com estimativas.</div>`}
      </section>

      <section class="metals-section-block physical-intelligence">
        <div class="section-heading compact"><div><span class="eyebrow">PHYSICAL & POSITIONING</span><h3>O que o preço não mostra</h3></div></div>
        <div class="physical-grid">
          <article class="physical-card">
            <div class="physical-card-head"><span>CFTC · MANAGED MONEY</span><span class="source-state ${cotGold.status === "ok" ? "ok" : "off"}">${cotGold.status === "ok" ? "oficial" : "indisponível"}</span></div>
            ${cotGold.status === "ok" ? `<div class="positioning-gauge"><span style="--gauge:${Math.max(0,Math.min(100,Number(cotGold.display_gauge_0_100)||0))}%"></span></div><strong class="physical-big">${Number(cotGold.managed_money_net_pct_oi).toFixed(1)}% <small>net / OI</small></strong><p>${escapeHtml(cotGold.label || "")}</p><small>Δ semanal líquido: ${Number(cotGold.weekly_change_net || 0).toLocaleString("pt-PT")} contratos · ${escapeHtml(cotGold.report_date || "")}</small>` : `<strong class="physical-big">—</strong><p>O pipeline tenta a publicação semanal oficial da CFTC. Não é inferido a partir do preço.</p>`}
          </article>
          <article class="physical-card">
            <div class="physical-card-head"><span>COMEX · GOLD STOCKS</span><span class="source-state ${comexGold.status === "ok" ? "ok" : "off"}">${comexGold.status === "ok" ? "CME" : "indisponível"}</span></div>
            ${comexGold.status === "ok" ? `<strong class="physical-big">${(Number(comexGold.registered_oz || 0)/1e6).toFixed(2)} <small>Moz registered</small></strong><div class="physical-split"><span>Eligible <b>${(Number(comexGold.eligible_oz || 0)/1e6).toFixed(2)} Moz</b></span><span>Total <b>${(Number(comexGold.total_oz || 0)/1e6).toFixed(2)} Moz</b></span></div>` : `<strong class="physical-big">—</strong><p>Inventário registered/eligible só aparece quando o XLS oficial da CME é lido com sucesso.</p>`}
          </article>
          <article class="physical-card">
            <div class="physical-card-head"><span>COMEX · DELIVERY NOTICES</span><span class="source-state ${deliveries.status === "ok" ? "ok" : "off"}">${deliveries.status === "ok" ? "CME" : "indisponível"}</span></div>
            ${goldDelivery.status === "ok" ? `<strong class="physical-big">${Number(goldDelivery.daily_notices || 0).toLocaleString("pt-PT")} <small>gold notices/dia</small></strong><p>${goldDelivery.daily_oz_equivalent != null ? (Number(goldDelivery.daily_oz_equivalent)/1e6).toFixed(3)+" Moz equivalente" : ""}</p><div class="physical-split"><span>MTD <b>${Number(goldDelivery.month_to_date_notices || 0).toLocaleString("pt-PT")}</b></span><span>Registered equiv. <b>${comexGold.registered_oz && goldDelivery.daily_oz_equivalent != null ? (Number(goldDelivery.daily_oz_equivalent)/Number(comexGold.registered_oz)*100).toFixed(2)+"%" : "—"}</b></span></div><small>${escapeHtml(deliveries.business_date || "")} · notices ≠ retirada de metal do vault</small>` : `<strong class="physical-big">—</strong><p>O pipeline tenta o PDF diário oficial Issues & Stops da CME.</p>`}
          </article>
          <article class="physical-card">
            <div class="physical-card-head"><span>REGISTERED INVENTORY TREND</span><span class="source-state ${historyObs > 1 ? "ok" : "off"}">${historyObs} obs.</span></div>
            <strong class="physical-big">${comexGold.registered_oz ? (Number(comexGold.registered_oz)/1e6).toFixed(2)+" <small>Moz</small>" : "—"}</strong>
            <div class="physical-split"><span>7d <b class="${Number(histTrend.registered_change_7d_pct)>=0 ? "good":"weak"}">${fmtSigned(histTrend.registered_change_7d_pct)}</b></span><span>30d <b class="${Number(histTrend.registered_change_30d_pct)>=0 ? "good":"weak"}">${fmtSigned(histTrend.registered_change_30d_pct)}</b></span><span>1a <b>${fmtSigned(histTrend.registered_change_365d_pct)}</b></span></div>
            <p>${historyObs < 8 ? "A memória própria está a ser construída diariamente." : (Number(histTrend.registered_change_30d_pct) < -5 ? "Registered inventory em contração material no último mês." : "Inventário acompanhado diariamente pelo Finscanner.")}</p>
          </article>
          <article class="physical-card">
            <div class="physical-card-head"><span>SHANGHAI BENCHMARK</span><span class="source-state ${sgeGold.status === "ok" ? "ok" : "off"}">${sgeGold.status === "ok" ? "SGE" : "indisponível"}</span></div>
            ${sgeGold.status === "ok" ? `<strong class="physical-big">¥${Number(sgeGold.benchmark_cny_per_g).toFixed(2)} <small>/g</small></strong>${sgeGold.premium_vs_comex_front_pct != null ? `<p class="${Number(sgeGold.premium_vs_comex_front_pct)>=0 ? "good" : "weak"}">${fmtSigned(sgeGold.premium_vs_comex_front_pct)} vs COMEX front-month</p>` : ""}<small>${escapeHtml(sgeGold.trade_date || "")} · proxy cross-market, não Shanghai-London spot premium</small>` : `<strong class="physical-big">—</strong><p>Benchmark oficial SGE. Sem valor se a página não puder ser processada no workflow.</p>`}
          </article>
          <article class="physical-card">
            <div class="physical-card-head"><span>CENTRAL BANKS</span><span class="source-state ${centralBanks.status === "ok" ? "ok" : "off"}">${centralBanks.status === "ok" ? "WGC/IMF" : "indisponível"}</span></div>
            ${centralBanks.status === "ok" && (centralBanks.buyers || []).length ? `<strong class="physical-big">${escapeHtml(centralBanks.buyers[0].country)} <small>${fmtSigned(centralBanks.buyers[0].tonnes,1)}t</small></strong><p>Maior comprador no período disponível</p><div class="flow-mini">${(centralBanks.buyers || []).slice(0,3).map(x=>`<span>↑ ${escapeHtml(x.country)} <b>${fmtSigned(x.tonnes,1)}t</b></span>`).join("")}${(centralBanks.sellers || []).slice(0,2).map(x=>`<span class="weak">↓ ${escapeHtml(x.country)} <b>${fmtSigned(x.tonnes,1)}t</b></span>`).join("")}</div>` : `<strong class="physical-big">—</strong><p>O workbook público do WGC pode exigir sessão/login. Se bloquear, o Finscanner não inventa fluxos.</p>`}
          </article>
        </div>
        ${comexSilver.status === "ok" ? `<div class="silver-strip"><span>COMEX SILVER</span><strong>${(Number(comexSilver.registered_oz || 0)/1e6).toFixed(1)} Moz registered</strong><small>${(Number(comexSilver.eligible_oz || 0)/1e6).toFixed(1)} Moz eligible${silverDelivery.status === "ok" ? ` · ${Number(silverDelivery.daily_notices||0).toLocaleString("pt-PT")} delivery notices hoje` : ""}</small></div>` : ""}
        <p class="method-note">CFTC: posições semanais reportadas; CME: stocks dos depositários; SGE: benchmark oficial. O gauge é uma visualização do net managed-money como % do open interest — não é um score preditivo. Delivery notices são eventos de clearing; o equivalente em onças não significa retirada efetiva do depósito.</p>
      </section>

      <section class="metals-section-block">
        <div class="section-heading compact"><div><span class="eyebrow">KEY RATIOS</span><h3>Valor relativo</h3></div></div>
        <div class="ratio-grid">
          <article><span>GOLD / SILVER</span><strong>${gsr ? gsr.toFixed(1)+":1" : "—"}</strong><small class="${gsrSig.cls}">${gsrSig.label}</small></article>
          <article><span>GOLD / PLATINUM</span><strong>${gpr ? gpr.toFixed(2)+":1" : "—"}</strong><small class="${gprSig.cls}">${gprSig.label}</small></article>
          <article><span>GOLD / PALLADIUM</span><strong>${gpdr ? gpdr.toFixed(2)+":1" : "—"}</strong><small class="${gpdrSig.cls}">${gpdrSig.label}</small></article>
        </div>
        <p class="method-note">Os rótulos são heurísticas de valor relativo, não “fair value”. Servem para contexto; não são sinais de compra/venda.</p>
      </section>

      <section class="metals-section-block ways-card">
        <div class="section-heading compact"><div><span class="eyebrow">WAYS TO PLAY</span><h3>Formas de obter exposição</h3></div></div>
        <div class="ways-row"><strong>Metal / ETFs</strong><div>${pills || "—"}</div></div>
        <div class="ways-row"><strong>Mineradoras</strong><div>${minerPills || "—"}</div></div>
        <div class="ways-row"><strong>Royalty & streaming</strong><div>${royaltyPills || "—"}</div></div>
      </section>
      ${metalsDailyBriefHtml()}
    `;
    if (pressure.status === "ok" && historyRecent.length > 1) {
      drawMetalSeries(document.getElementById("gold-inventory-chart"), historyRecent, "gold_registered_oz", {stroke:"#b07a33"});
      drawMetalSeries(document.getElementById("gold-delivery-chart"), historyRecent, "gold_daily_delivery_notices", {stroke:"#b07a33"});
      drawMetalSeries(document.getElementById("gold-positioning-chart"), historyRecent, "gold_mm_net_pct_oi", {stroke:"#3b8f70"});
      drawMetalSeries(document.getElementById("gold-pressure-chart"), historyRecent, "gold_pressure_index", {stroke:"#b07a33"});
    }

    els.metalsDashboard?.querySelectorAll("[data-metal-tab]").forEach(btn => btn.addEventListener("click", () => {
      state.selectedMetal = btn.dataset.metalTab || "GC=F";
      renderMetals();
      document.getElementById("view-metals")?.scrollIntoView({behavior:"smooth", block:"start"});
    }));

    els.metalsDashboard?.querySelectorAll("[data-open-stock]").forEach(btn => btn.addEventListener("click", () => {
      const ticker = btn.dataset.openStock;
      const row = state.data?.stocks?.find(x => x.ticker === ticker);
      if (row) openDetail(row);
      else { state.activeView = "stocks"; switchView("stocks"); if (els.search) { els.search.value = ticker; applyFilters(); } }
    }));

    els.metalsNote.textContent = state.metals.note || "";
    els.metalsList.innerHTML = state.metals.instruments.map(metalCardHtml).join("");
    els.metalsList.querySelectorAll(".metal-card[data-ticker]").forEach(card => card.addEventListener("click", () => openMetalDetail(card.dataset.ticker)));
  }

  function metalCardHtml(inst) {
    const d = inst.data;
    if (!d) return `<div class="metal-card"><div class="metal-head"><span class="metal-label">${inst.label}</span></div><p class="empty-state" style="padding:0.5rem 0;">sem dados</p></div>`;
    const changeClass = d.day_change_pct == null ? "" : d.day_change_pct >= 0 ? "up" : "down";
    return `<div class="metal-card" data-ticker="${escapeHtml(inst.ticker)}" tabindex="0" role="button">
      <div class="metal-head"><span class="metal-label">${inst.label}</span><span><span class="metal-price">${d.price} <span class="metal-unit">${inst.unit}</span></span><span class="metal-change ${changeClass}">${fmtSigned(d.day_change_pct,2)}</span></span></div>
      <div class="metal-meta"><span>12m ${fmtSigned(d.change_1y_pct)}</span><span>vs 200d ${fmtSigned(d.vs_200d_pct)}</span><span>vol ${d.volatility_annualized_pct ?? "—"}%</span></div>
      ${inst.kind === "etf_proxy" ? `<span class="metal-proxy-tag">proxy ETF, não é preço spot</span>` : ""}<span class="metal-expand-hint">ver detalhe →</span>
    </div>`;
  }

  function openMetalDetail(ticker) {
    const inst = state.metals?.instruments?.find(i => i.ticker === ticker);
    if (!inst || !inst.data) return;
    const d = inst.data;
    const yChange = (v, label) => v != null ? `<div class="detail-row"><span>${label}</span><span>${fmtSigned(v)}</span></div>` : "";
    els.detailContent.innerHTML = `<h2 style="font-family:var(--font-display, inherit);margin:0 0 0.9rem;">${inst.label}</h2>
      <div class="detail-row"><span>Preço</span><span>${d.price} ${inst.unit}</span></div><div class="detail-row"><span>Variação diária</span><span>${fmtSigned(d.day_change_pct,2)}</span></div>
      ${yChange(d.change_ytd_pct,"Variação no ano (YTD)")}${yChange(d.change_1y_pct,"Variação em 12 meses")}${yChange(d.vs_200d_pct,"Distância da média 200d")}
      <div class="detail-row"><span>Posição na faixa 52 semanas</span><span>${d.position_52w_pct != null ? Math.round(d.position_52w_pct)+"%" : "—"}</span></div>
      <div class="detail-row"><span>Intervalo 12 meses</span><span>${d.range_1y_low}–${d.range_1y_high}</span></div><div class="detail-row"><span>Volatilidade anualizada</span><span>${d.volatility_annualized_pct ?? "—"}%</span></div>
      ${inst.kind === "etf_proxy" ? `<p class="detail-note">Proxy via ETF — não é o preço spot do metal.</p>` : ""}${inst.context ? `<p class="detail-note">${escapeHtml(inst.context)}</p>` : ""}
      ${inst.context_links ? `<div class="news-actions">${inst.context_links.map(l => `<a href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${escapeHtml(l.label)}</a>`).join("")}</div>` : ""}
      <p class="detail-note">Não são apresentados inventários COMEX, deliveries, Shanghai premium ou positioning sem uma fonte de dados efetivamente ligada ao pipeline.</p>`;
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
    const rows = state.data.stocks.filter(r => !isAustralianScannerRow(r));
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

    const strictOpportunities = scored
      .filter(r => r.zombie !== "yes" && r.zombie !== true && r.data_confidence !== "low" && Number(r.quality_pct ?? r.profitability_pct) >= 60 && Number(r.value_pct) >= 55)
      .sort((a,b) => (b.quality_value_score ?? 0) - (a.quality_value_score ?? 0));
    const opportunities = (strictOpportunities.length ? strictOpportunities : scored
      .filter(r => r.zombie !== "yes" && r.zombie !== true)
      .sort((a,b) => {
        const ax = Number(a.quality_value_score ?? 0) + Number(a.score ?? 0) * 0.15 + (a.thesis_direction === "strengthening" ? 8 : 0);
        const bx = Number(b.quality_value_score ?? 0) + Number(b.score ?? 0) * 0.15 + (b.thesis_direction === "strengthening" ? 8 : 0);
        return bx-ax;
      })).slice(0, 6);
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

  function isAustralianScannerRow(r) {
    return r?.region === "Australia" || String(r?.ticker || "").toUpperCase().endsWith(".AX");
  }

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

  function stockPresetMatch(r, preset) {
    if (!preset || preset === "all") return true;
    const q = Number(r.quality_pct ?? r.profitability_pct ?? -1);
    const g = Number(r.growth_pct ?? -1);
    const v = Number(r.value_pct ?? -1);
    const s = Number(r.score ?? -1);
    if (preset === "compounders") return q >= 70 && g >= 65 && Number(r.stability_pct ?? 0) >= 60 && s >= 68 && r.zombie !== "yes";
    if (preset === "quality") return q >= 70 && s >= 65 && r.zombie !== "yes";
    if (preset === "value") return v >= 65 && s >= 55 && r.zombie !== "yes";
    if (preset === "growth") return g >= 70 && s >= 55 && r.zombie !== "yes";
    if (preset === "garp") return q >= 60 && g >= 60 && v >= 50 && s >= 60 && r.zombie !== "yes";
    if (preset === "dividend") return Number(r.dividend_yield ?? 0) >= 2.0 && Number(r.payout_ratio ?? 0) < 0.9 && s >= 50;
    if (preset === "insider") return Number(r.insider_net_value_30d ?? 0) > 0 || Number(r.insider_buy_count_30d ?? 0) > 0;
    if (preset === "near-low") {
      const px=Number(r.current_price), hist=Array.isArray(r.insider_price_history_1y)?r.insider_price_history_1y:[];
      const vals=hist.map(x=>Number(x.close ?? x.price ?? x.value)).filter(Number.isFinite);
      if(!Number.isFinite(px)||!vals.length) return false; const lo=Math.min(...vals); return lo>0 && px <= lo*1.15 && s>=50 && r.zombie!=="yes";
    }
    if (preset === "improving") return r.thesis_direction === "strengthening" || Number(r.thesis_score_delta ?? 0) >= 5;
    if (preset === "revisions") {
      const qrev=Number(r.analyst_eps_next_q_revision_30d_pct);
      const yrev=Number(r.analyst_eps_next_y_revision_30d_pct);
      const up=Number(r.analyst_eps_revisions_up_30d || 0), down=Number(r.analyst_eps_revisions_down_30d || 0);
      return (Number.isFinite(qrev)&&qrev>0.01) || (Number.isFinite(yrev)&&yrev>0.01) || up>down;
    }
    if (preset === "earnings") { const d=Number(r.analyst_days_to_earnings); return Number.isFinite(d) && d>=0 && d<=7; }
    if (preset === "zombie") return r.zombie === "yes" || r.zombie === true;
    return true;
  }

  function metricGrade(v) {
    const n=Number(v); if(!Number.isFinite(n)) return "—";
    if(n>=85) return "A+"; if(n>=75) return "A"; if(n>=65) return "B+"; if(n>=55) return "B"; if(n>=45) return "C"; return "D";
  }

  function perspectiveSortValue(r, perspective) {
    const n=v=>Number.isFinite(Number(v))?Number(v):null;
    if (perspective === "profitability") return n(r.quality_pct ?? r.profitability_pct) ?? -999;
    if (perspective === "growth") return n(r.growth_pct) ?? -999;
    if (perspective === "valuation") return n(r.value_pct) ?? -999;
    if (perspective === "income") {
      const y=n(r.dividend_yield), payout=n(r.payout_ratio), fcf=n(r.fcf_yield);
      if (y == null) return -999;
      const sustainability=(payout!=null && payout>0 && payout<=0.9 ? 15 : 0) + (fcf!=null && fcf>0 ? 10 : 0);
      return y + sustainability;
    }
    if (perspective === "smartmoney") {
      const net=n(r.insider_net_value_30d) ?? 0, buys=n(r.insider_buy_count_30d) ?? 0;
      return Math.sign(net)*Math.log10(Math.abs(net)+1) * 10 + buys*3;
    }
    if (perspective === "estimates") return n(r.analyst_eps_next_q_revision_30d_pct ?? r.analyst_eps_next_y_revision_30d_pct) ?? -999;
    if (perspective === "catalysts") {
      const d=n(r.analyst_days_to_earnings); return d==null ? -999 : -Math.max(0,d);
    }
    return n(r.score) ?? -999;
  }


  function sectorMetric(r, key) {
    const map = {
      score: r.score,
      profit: r.quality_pct ?? r.profitability_pct,
      cash: r.cashflow_pct,
      stable: r.stability_pct,
      value: r.value_pct,
      quality: r.quality_pct ?? r.profitability_pct,
    };
    const n = Number(map[key]);
    return Number.isFinite(n) ? n : null;
  }

  function sectorMetricBar(label, value, best=false) {
    const v = Number.isFinite(Number(value)) ? Math.max(0, Math.min(100, Number(value))) : null;
    return `<div class="sector-pillar ${best?'is-best':''}"><span>${escapeHtml(label)}</span><b>${v==null?'—':Math.round(v)}</b><i><em style="width:${v==null?0:v}%"></em></i>${best?'<small>BEST</small>':''}</div>`;
  }

  function sectorDeepDiveHtml(r) {
    if (!r) return `<div class="sector-empty">Seleciona uma empresa para abrir o deep dive.</div>`;
    const rev = r.revenue_yoy_latest ?? r.revenue_growth;
    const eps = r.earnings_growth ?? r.analyst_eps_next_y_growth;
    const insider = Number(r.insider_net_value_30d);
    const insiderLabel = Number.isFinite(insider) ? `${insider>=0?'+':'−'}${fmtMoney(Math.abs(insider), r.currency || 'USD')}` : '—';
    const dte = Number(r.analyst_days_to_earnings);
    const verdict = investmentVerdict(r);
    return `<aside class="sector-deep-dive" data-deep-ticker="${escapeHtml(r.ticker)}">
      <div class="sector-deep-head"><div><span class="eyebrow">DEEP DIVE · ${escapeHtml(r.sector||'SETOR')}</span><h3>${escapeHtml(r.ticker)}</h3><p>${escapeHtml(r.name||'')}</p></div><span class="sector-deep-score ${verdict.cls}">${r.score==null?'—':Math.round(r.score)}</span></div>
      <div class="sector-deep-verdict ${verdict.cls}"><strong>${escapeHtml(verdict.label)}</strong><span>${escapeHtml(verdict.text)}</span></div>
      <div class="sector-pillar-stack">
        ${sectorMetricBar('Profitable', sectorMetric(r,'profit'))}
        ${sectorMetricBar('Cash', sectorMetric(r,'cash'))}
        ${sectorMetricBar('Stable', sectorMetric(r,'stable'))}
        ${sectorMetricBar('Valuation', sectorMetric(r,'value'))}
        ${sectorMetricBar('Quality', sectorMetric(r,'quality'))}
      </div>
      <div class="sector-key-metrics">
        <div><span>Forward P/E</span><b>${fmtRatio(r.forward_pe)}</b></div>
        <div><span>Revenue growth</span><b>${fmtRawPct(rev)}</b></div>
        <div><span>Gross margin</span><b>${fmtRawPct(r.gross_margin)}</b></div>
        <div><span>EPS growth</span><b>${fmtRawPct(eps)}</b></div>
        <div><span>Insider 30d</span><b class="${Number.isFinite(insider)?(insider>=0?'positive-text':'negative-text'):''}">${insiderLabel}</b></div>
        <div><span>Next earnings</span><b>${Number.isFinite(dte)?`${Math.max(0,Math.round(dte))}d`:'—'}</b></div>
      </div>
      <button class="sector-open-dossier" data-sector-open-dossier="${escapeHtml(r.ticker)}">Abrir dossier completo →</button>
    </aside>`;
  }

  function renderSectorDiscover(rows, sector) {
    const pool = rows.filter(r=>r.sector===sector).sort((a,b)=>(b.score??-1)-(a.score??-1)).slice(0,12);
    if (!pool.length) return `<div class="sector-empty">Sem empresas disponíveis para ${escapeHtml(sector||'este setor')}.</div>`;
    return `<div class="sector-discover-strip">${pool.map((r,i)=>`<article class="sector-discover-card" data-sector-deep="${escapeHtml(r.ticker)}">
      <div class="sector-rank">#${i+1}</div><span class="eyebrow">${escapeHtml(r.ticker)}</span><h4>${escapeHtml(r.name||r.ticker)}</h4>
      <div class="sector-discover-score">${r.score==null?'—':Math.round(r.score)}<small>/100</small></div>
      <div class="sector-mini-grid"><span>Q <b>${r.quality_pct==null?'—':Math.round(r.quality_pct)}</b></span><span>G <b>${r.growth_pct==null?'—':Math.round(r.growth_pct)}</b></span><span>V <b>${r.value_pct==null?'—':Math.round(r.value_pct)}</b></span></div>
      <div class="sector-discover-actions"><button data-sector-compare-add="${escapeHtml(r.ticker)}">+ comparar</button><button data-sector-deep="${escapeHtml(r.ticker)}">deep dive</button></div>
    </article>`).join('')}</div>`;
  }

  function renderSectorCompare(rows, sector) {
    const sectorRows = rows.filter(r=>r.sector===sector).sort((a,b)=>(b.score??-1)-(a.score??-1));
    let selected = state.sectorCompareSelection.map(t=>rows.find(r=>r.ticker===t)).filter(Boolean);
    if (!selected.length) selected = sectorRows.slice(0,6);
    if (!selected.length) return `<div class="sector-empty">Sem empresas para comparar neste setor.</div>`;
    const keys=[['score','Finscanner'],['profit','Profit'],['cash','Cash'],['stable','Stable'],['value','Value'],['quality','Quality']];
    const best={}; keys.forEach(([k])=>{ best[k]=Math.max(...selected.map(r=>sectorMetric(r,k)??-Infinity)); });
    const deep = selected.find(r=>r.ticker===state.sectorDeepDive) || selected[0];
    return `<div class="sector-compare-layout"><div class="sector-compare-main">
      <div class="sector-compare-toolbar"><span>${selected.length} empresas · grupo persistente, mesmo entre setores</span><button data-sector-clear-compare>Limpar seleção</button></div>
      <div class="sector-compare-adder"><input data-sector-compare-search placeholder="Adicionar ticker ou empresa (ex.: NVDA, ASML, TSM)…"><button data-sector-compare-add-search>Adicionar</button></div>
      <div class="sector-compare-table-wrap"><div class="sector-compare-table">
        <div class="sector-compare-header"><span>COMPANY</span>${keys.map(([,l])=>`<span>${escapeHtml(l)}</span>`).join('')}</div>
        ${selected.map(r=>`<button class="sector-compare-row ${deep?.ticker===r.ticker?'is-selected':''}" data-sector-deep="${escapeHtml(r.ticker)}"><span class="sector-compare-company"><b>${escapeHtml(r.ticker)}</b><small>${escapeHtml(r.name||'')}</small></span>${keys.map(([k])=>{const v=sectorMetric(r,k), isBest=v!=null&&v===best[k]; return `<span class="sector-compare-cell ${isBest?'is-best':''}"><b>${v==null?'—':Math.round(v)}</b><i><em style="width:${v==null?0:Math.max(0,Math.min(100,v))}%"></em></i>${isBest?'<small>BEST</small>':''}</span>`}).join('')}</button>`).join('')}
      </div></div>
    </div>${sectorDeepDiveHtml(deep)}</div>`;
  }

  function renderSectorWatchlist(rows, sector) {
    const pool=rows.filter(r=>r.sector===sector && isWatched(r.ticker)).sort((a,b)=>(b.score??-1)-(a.score??-1));
    if(!pool.length) return `<div class="sector-empty">A tua watchlist ainda não tem empresas em ${escapeHtml(sector)}.</div>`;
    return `<div class="sector-watch-grid">${pool.map(r=>`<button data-sector-deep="${escapeHtml(r.ticker)}"><b>${escapeHtml(r.ticker)}</b><span>${escapeHtml(r.name||'')}</span><strong>${r.score==null?'—':Math.round(r.score)}</strong></button>`).join('')}</div>`;
  }

  function bindSectorLabActions(rows, sector) {
    if (!els.sectorLabBody) return;
    els.sectorLabBody.querySelectorAll('[data-sector-deep]').forEach(el=>el.addEventListener('click',e=>{
      if(e.target.closest('[data-sector-compare-add]')) return;
      const t=el.dataset.sectorDeep; state.sectorDeepDive=t; renderSectorIntelligence(rows);
    }));
    els.sectorLabBody.querySelectorAll('[data-sector-compare-add]').forEach(btn=>btn.addEventListener('click',e=>{
      e.stopPropagation(); const t=btn.dataset.sectorCompareAdd;
      if(!state.sectorCompareSelection.includes(t)) state.sectorCompareSelection.push(t);
      if(state.sectorCompareSelection.length>8) state.sectorCompareSelection.shift();
      saveSectorCompareSelection();
      state.sectorLabMode='compare'; state.sectorDeepDive=t; renderSectorIntelligence(rows);
    }));
    const addInput=els.sectorLabBody.querySelector('[data-sector-compare-search]');
    const addSearch=()=>{const q=(addInput?.value||'').trim();if(!q)return;const hit=resolveCompareTicker(q);if(!hit){addInput.value='';addInput.placeholder='Não encontrado no universo';return;}if(!state.sectorCompareSelection.includes(hit.ticker))state.sectorCompareSelection.push(hit.ticker);if(state.sectorCompareSelection.length>8)state.sectorCompareSelection.shift();saveSectorCompareSelection();state.sectorDeepDive=hit.ticker;renderSectorIntelligence(rows);};
    els.sectorLabBody.querySelector('[data-sector-compare-add-search]')?.addEventListener('click',addSearch);
    addInput?.addEventListener('keydown',e=>{if(e.key==='Enter')addSearch();});
    els.sectorLabBody.querySelector('[data-sector-clear-compare]')?.addEventListener('click',()=>{state.sectorCompareSelection=[]; saveSectorCompareSelection(); renderSectorIntelligence(rows);});
    els.sectorLabBody.querySelectorAll('[data-sector-open-dossier]').forEach(btn=>btn.addEventListener('click',()=>openDetail(btn.dataset.sectorOpenDossier)));
  }

  function renderSectorIntelligence(rows) {
    if (!els.sectorLab || !els.sectorLabBody || !Array.isArray(rows)) return;
    const sectors=[...new Set(rows.map(r=>r.sector).filter(Boolean))].sort();
    if (els.sectorLabSector && !els.sectorLabSector.dataset.ready) {
      els.sectorLabSector.innerHTML=`<option value="">Escolhe um setor</option>`+sectors.map(s=>`<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
      els.sectorLabSector.dataset.ready='1';
      const preferred=sectors.find(s=>/technology/i.test(s)) || sectors[0] || '';
      if(preferred) els.sectorLabSector.value=preferred;
    }
    const sector=els.sectorLabSector?.value || '';
    els.sectorLabModes?.querySelectorAll('[data-sector-mode]').forEach(b=>b.classList.toggle('is-active',b.dataset.sectorMode===state.sectorLabMode));
    if (els.sectorLabSelection) els.sectorLabSelection.textContent=sector ? `${sector} · ${rows.filter(r=>r.sector===sector).length} empresas` : 'Seleciona um setor';
    if(!sector){els.sectorLabBody.innerHTML='<div class="sector-empty">Escolhe um setor para descobrir, comparar e abrir deep dives.</div>'; return;}
    if(state.sectorLabMode==='compare') els.sectorLabBody.innerHTML=renderSectorCompare(rows,sector);
    else if(state.sectorLabMode==='watchlist') els.sectorLabBody.innerHTML=renderSectorWatchlist(rows,sector);
    else els.sectorLabBody.innerHTML=renderSectorDiscover(rows,sector);
    bindSectorLabActions(rows,sector);
  }

  const DISCOVER_LABELS = {compounders:"Compounders",quality:"High Quality",garp:"GARP",growth:"Growth",value:"Value",dividend:"Dividend",insider:"Insider Buying","near-low":"Near 52W Low",improving:"Improving Thesis",earnings:"Earnings Soon"};
  function discoverRankValue(r,preset){
    if(preset==='compounders') return (Number(r.quality_pct||0)*.35)+(Number(r.growth_pct||0)*.30)+(Number(r.stability_pct||0)*.20)+(Number(r.score||0)*.15);
    if(preset==='quality') return Number(r.quality_pct ?? r.profitability_pct ?? -1);
    if(preset==='garp') return Number(r.quality_pct||0)+Number(r.growth_pct||0)+Number(r.value_pct||0);
    if(preset==='growth') return Number(r.growth_pct??-1); if(preset==='value') return Number(r.value_pct??-1);
    if(preset==='dividend') return Number(r.dividend_yield??-1);
    if(preset==='insider') return Math.log10(Math.abs(Number(r.insider_net_value_30d||0))+1)*10+Number(r.insider_buy_count_30d||0)*4;
    if(preset==='near-low'){const px=Number(r.current_price),h=Array.isArray(r.insider_price_history_1y)?r.insider_price_history_1y:[],v=h.map(x=>Number(x.close??x.price??x.value)).filter(Number.isFinite); if(!Number.isFinite(px)||!v.length)return -999; const lo=Math.min(...v); return lo>0?100-(px/lo-1)*100:-999;}
    if(preset==='improving') return Number(r.thesis_score_delta??0)*10+Number(r.score??0);
    if(preset==='earnings'){const d=Number(r.analyst_days_to_earnings); return Number.isFinite(d)?100-Math.min(100,Math.max(0,d)*10):-999;}
    return Number(r.score??-1);
  }
  function discoverReason(r,preset){
    if(preset==='compounders') return `Q ${Math.round(Number(r.quality_pct||0))} · G ${Math.round(Number(r.growth_pct||0))} · estabilidade ${Math.round(Number(r.stability_pct||0))}`;
    if(preset==='insider') return `${Number(r.insider_buy_count_30d||0)} compra(s) · ${fmtMoney(Math.abs(Number(r.insider_net_value_30d||0)),r.currency||'USD')} net 30d`;
    if(preset==='improving') return `tese ↑ · score ${Number(r.thesis_score_delta||0)>=0?'+':''}${Number(r.thesis_score_delta||0).toFixed(1)}`;
    if(preset==='earnings') return `${Number.isFinite(Number(r.analyst_days_to_earnings))?Math.max(0,Math.round(Number(r.analyst_days_to_earnings)))+' dias':'—'} até earnings`;
    return `Q ${Math.round(Number(r.quality_pct||0))} · G ${Math.round(Number(r.growth_pct||0))} · V ${Math.round(Number(r.value_pct||0))}`;
  }
  function renderStockDiscover(rows){
    if(!els.stockDiscoverBody) return; const p=state.stockDiscoverPreset||'compounders';
    const pool=rows.filter(r=>stockPresetMatch(r,p)).sort((a,b)=>discoverRankValue(b,p)-discoverRankValue(a,p)).slice(0,12);
    els.stockDiscoverCategories?.querySelectorAll('[data-discover-preset]').forEach(b=>b.classList.toggle('is-active',b.dataset.discoverPreset===p));
    if(!pool.length){els.stockDiscoverBody.innerHTML=`<div class="sector-empty">Sem candidatos com dados suficientes para ${escapeHtml(DISCOVER_LABELS[p]||p)}.</div>`;return;}
    els.stockDiscoverBody.innerHTML=`<div class="stock-discover-strip">${pool.map((r,i)=>`<article class="stock-discover-card" data-discover-open="${escapeHtml(r.ticker)}"><div class="stock-discover-rank">#${i+1}</div><span class="eyebrow">${escapeHtml(r.ticker)}</span><h4>${escapeHtml(r.name||r.ticker)}</h4><div class="stock-discover-score">${r.score==null?'—':Math.round(r.score)}<small>/100</small></div><p>${escapeHtml(discoverReason(r,p))}</p><div class="stock-discover-actions"><button data-discover-open="${escapeHtml(r.ticker)}">Deep dive</button><button data-discover-filter="${escapeHtml(p)}">Ver lista</button></div></article>`).join('')}</div>`;
    els.stockDiscoverBody.querySelectorAll('[data-discover-open]').forEach(el=>el.addEventListener('click',e=>{if(e.target.closest('[data-discover-filter]'))return;openDetail(el.dataset.discoverOpen);}));
    els.stockDiscoverBody.querySelectorAll('[data-discover-filter]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();state.stockPreset=btn.dataset.discoverFilter;applyFilters();els.list?.scrollIntoView({behavior:'smooth',block:'start'});}));
  }

  function applyFilters() {
    if (!state.data) return;
    const equities = state.data.stocks.filter(r => r.quote_type !== "ETF" && !isAustralianScannerRow(r));
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
    const minScore = Number(els.stockMinScore?.value || 0);
    const minQuality = Number(els.stockMinQuality?.value || 0);
    const minGrowth = Number(els.stockMinGrowth?.value || 0);
    const minValue = Number(els.stockMinValue?.value || 0);
    const minCap = Number(els.stockMinCap?.value || 0);
    const maxFpe = Number(els.stockMaxFpe?.value || 0);

    let rows = state.data.stocks.filter(r => {
      if (r.quote_type === "ETF") return false;
      if (isAustralianScannerRow(r)) return false;
      if (region && r.region !== region) return false;
      if (sector && r.sector !== sector) return false;
      if (zombieOnly && r.zombie !== "yes") return false;
      if (watchlistOnly && !isWatched(r.ticker)) return false;
      if (q && !(r.ticker.toUpperCase().includes(q) || (r.name || "").toUpperCase().includes(q))) return false;
      if (minScore && Number(r.score ?? -1) < minScore) return false;
      if (minQuality && Number(r.quality_pct ?? r.profitability_pct ?? -1) < minQuality) return false;
      if (minGrowth && Number(r.growth_pct ?? -1) < minGrowth) return false;
      if (minValue && Number(r.value_pct ?? -1) < minValue) return false;
      if (minCap && Number(r.market_cap ?? 0) < minCap) return false;
      if (maxFpe && (r.forward_pe == null || Number(r.forward_pe) > maxFpe)) return false;
      if (!stockPresetMatch(r, state.stockPreset)) return false;
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
      if (sort === "revision-desc") return (b.analyst_eps_next_q_revision_30d_pct ?? b.analyst_eps_next_y_revision_30d_pct ?? -999) - (a.analyst_eps_next_q_revision_30d_pct ?? a.analyst_eps_next_y_revision_30d_pct ?? -999);
      if (sort === "earnings-asc") return (a.analyst_days_to_earnings ?? 99999) - (b.analyst_days_to_earnings ?? 99999);
      if (sort === "perspective") return perspectiveSortValue(b, state.stockPerspective) - perspectiveSortValue(a, state.stockPerspective);
      return 0;
    });

    state.filtered = rows;
    renderStockDiscover(equities);
    renderSectorIntelligence(equities);
    if (els.resultCount) els.resultCount.textContent = `${rows.length} resultados`;
    renderStockTableHead();
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

  const STOCK_COLUMN_DEFS = {
    score: { label:"Score", short:"Score", value:r=>r.score, format:v=>v==null?"—":Math.round(v), grade:true },
    quality: { label:"Quality", short:"Q", value:r=>r.quality_pct ?? r.profitability_pct, format:v=>v==null?"—":Math.round(v), grade:true },
    growth: { label:"Growth", short:"G", value:r=>r.growth_pct, format:v=>v==null?"—":Math.round(v), grade:true },
    value: { label:"Value", short:"V", value:r=>r.value_pct, format:v=>v==null?"—":Math.round(v), grade:true },
    roe: { label:"ROE", short:"ROE", value:r=>r.roe, format:v=>fmtRawPct(v) },
    opmargin: { label:"Op. margin", short:"Op M", value:r=>r.operating_margin, format:v=>fmtRawPct(v) },
    netmargin: { label:"Net margin", short:"Net M", value:r=>r.profit_margin, format:v=>fmtRawPct(v) },
    revgrowth: { label:"Revenue YoY", short:"Rev", value:r=>r.revenue_yoy_latest ?? r.revenue_growth, format:v=>fmtRawPct(v) },
    epsgrowth: { label:"Earnings growth", short:"EPS", value:r=>r.earnings_growth, format:v=>fmtRawPct(v) },
    acceleration: { label:"Revenue accel.", short:"Accel", value:r=>r.revenue_yoy_acceleration_pp, format:v=>v==null?"—":`${Number(v)>=0?'+':''}${Number(v).toFixed(1)} pp` },
    fpe: { label:"Forward P/E", short:"Fwd P/E", value:r=>r.forward_pe, format:v=>fmtRatio(v) },
    ev: { label:"EV/EBITDA", short:"EV/EBITDA", value:r=>r.enterprise_to_ebitda, format:v=>fmtRatio(v) },
    fcfyield: { label:"FCF yield", short:"FCF Y", value:r=>r.fcf_yield, format:v=>fmtRawPct(v) },
    dividend: { label:"Dividend yield", short:"Yield", value:r=>r.dividend_yield, format:v=>fmtDividendYield(v) },
    payout: { label:"Payout", short:"Payout", value:r=>r.payout_ratio, format:v=>fmtRawPct(v) },
    insider: { label:"Insider net 30d", short:"Insider", value:r=>r.insider_net_value_30d, format:(v,r)=>v==null?"—":fmtMoney(v,r.currency||"USD") },
    buys: { label:"Insider buys", short:"Buys", value:r=>r.insider_buy_count_30d, format:v=>v==null?"—":String(v) },
    epsrev: { label:"EPS revision 30d", short:"EPS Rev", value:r=>r.analyst_eps_next_q_revision_30d_pct ?? r.analyst_eps_next_y_revision_30d_pct, format:v=>fmtRawPct(v) },
    surprise: { label:"Latest EPS surprise", short:"Surprise", value:r=>r.analyst_latest_eps_surprise_pct, format:v=>fmtRawPct(v) },
    target: { label:"Analyst target upside", short:"Target", value:r=>r.analyst_price_target_upside_pct, format:v=>fmtRawPct(v) },
    epsfwd: { label:"Next-year EPS growth", short:"EPS fwd", value:r=>r.analyst_eps_next_y_growth, format:v=>fmtRawPct(v) },
    revfwd: { label:"Next-year revenue growth", short:"Rev fwd", value:r=>r.analyst_revenue_next_y_growth, format:v=>fmtRawPct(v) },
    analysts: { label:"EPS analysts", short:"Analysts", value:r=>r.analyst_eps_next_q_analysts ?? r.analyst_eps_next_y_analysts, format:v=>v==null?"—":String(Math.round(v)) },
    earningsdays: { label:"Dias até earnings", short:"Earnings", value:r=>r.analyst_days_to_earnings, format:v=>v==null?"—":`${Math.round(v)}d` },
    beats4q: { label:"Beats últimos 4Q", short:"Beats", value:r=>r.analyst_earnings_beats_4q, format:v=>v==null?"—":`${Math.round(v)}/4` },
    avgsurprise4q: { label:"Surpresa média 4Q", short:"Avg Surp", value:r=>r.analyst_earnings_avg_surprise_4q, format:v=>fmtRawPct(v) },
    beatstreak: { label:"Beat streak", short:"Streak", value:r=>r.analyst_earnings_beat_streak, format:v=>v==null?"—":`${Math.round(v)}Q` },
    debt: { label:"Debt / Equity", short:"D/E", value:r=>r.debt_to_equity, format:v=>v==null?"—":Number(v).toFixed(1) },
  };
  const STOCK_PERSPECTIVES = {
    overview:["score","quality","growth","value"],
    profitability:["score","roe","opmargin","netmargin"],
    growth:["score","revgrowth","epsgrowth","acceleration"],
    valuation:["score","fpe","ev","fcfyield"],
    income:["score","dividend","payout","fcfyield"],
    smartmoney:["score","insider","buys","quality"],
    estimates:["score","epsrev","surprise","target"],
    catalysts:["earningsdays","epsrev","beats4q","target"],
  };
  function activeStockColumns(){
    const custom=Array.isArray(state.stockCustomColumns)&&state.stockCustomColumns.length ? state.stockCustomColumns : null;
    return (custom || STOCK_PERSPECTIVES[state.stockPerspective] || STOCK_PERSPECTIVES.overview).slice(0,4);
  }
  function metricCellTone(key, value){
    const n=Number(value); if(!Number.isFinite(n)) return "neutral";
    if(["quality","growth","value","score"].includes(key)) return n>=65?"positive":n<35?"negative":"neutral";
    if(["roe","opmargin","netmargin","revgrowth","epsgrowth","acceleration","fcfyield","dividend","insider","buys","epsrev","surprise","target","epsfwd","revfwd","beats4q","avgsurprise4q","beatstreak"].includes(key)) return n>0?"positive":n<0?"negative":"neutral";
    if(key==="earningsdays") return n<=3?"negative":n<=7?"neutral":"positive";
    if(key==="fpe"||key==="ev") return n>0&&n<20?"positive":n>35?"negative":"neutral";
    return "neutral";
  }
  function renderStockTableHead(){
    if(!els.stockTableHead) return;
    const cols=activeStockColumns();
    els.stockTableHead.innerHTML=`<span>Empresa</span>${cols.map(k=>`<span>${escapeHtml(STOCK_COLUMN_DEFS[k]?.short||k)}</span>`).join("")}`;
    els.stockTableHead.style.setProperty('--stock-cols', String(cols.length));
  }
  function renderStockColumnsPanel(){
    if(!els.stockColumnsPanel) return;
    const selected=new Set(activeStockColumns());
    els.stockColumnsPanel.innerHTML=`<p>Seleciona até 4 métricas. A primeira coluna Empresa é fixa. Ao escolher uma 5.ª métrica, a mais antiga é substituída.</p><div class="stock-column-options">${Object.entries(STOCK_COLUMN_DEFS).map(([k,d])=>`<label><input type="checkbox" value="${k}" ${selected.has(k)?'checked':''}><span>${escapeHtml(d.label)}</span></label>`).join('')}</div><div class="stock-column-actions"><button type="button" data-columns-clear>Limpar</button><button type="button" data-columns-reset>Usar perspetiva</button><button type="button" data-columns-apply>Aplicar</button></div>`;
    const selectionOrder=[...selected];
    els.stockColumnsPanel.querySelector('[data-columns-apply]')?.addEventListener('click',()=>{
      const vals=selectionOrder.filter(k=>els.stockColumnsPanel.querySelector(`input[value="${k}"]`)?.checked).slice(-4);
      state.stockCustomColumns=vals.length?vals:null; renderStockTableHead(); applyFilters(); els.stockColumnsPanel.hidden=true;
    });
    els.stockColumnsPanel.querySelector('[data-columns-reset]')?.addEventListener('click',()=>{state.stockCustomColumns=null; renderStockColumnsPanel(); renderStockTableHead(); applyFilters();});
    els.stockColumnsPanel.querySelector('[data-columns-clear]')?.addEventListener('click',()=>{
      selectionOrder.length=0; els.stockColumnsPanel.querySelectorAll('input').forEach(x=>x.checked=false);
    });
    els.stockColumnsPanel.querySelectorAll('input').forEach(cb=>cb.addEventListener('change',()=>{
      const key=cb.value;
      const ix=selectionOrder.indexOf(key); if(ix>=0) selectionOrder.splice(ix,1);
      if(cb.checked){
        selectionOrder.push(key);
        if(selectionOrder.length>4){
          const removed=selectionOrder.shift();
          const oldCb=els.stockColumnsPanel.querySelector(`input[value="${removed}"]`);
          if(oldCb) oldCb.checked=false;
        }
      }
    }));
  }

  function cardHtml(r) {
    const flags = [];
    if (r.zombie === "yes") flags.push(`<span class="badge zombie">risco financeiro</span>`);
    if (r.data_confidence === "low") flags.push(`<span class="badge low-confidence">dados limitados</span>`);
    if (isOwned(r.ticker)) flags.push(`<span class="badge owned">na carteira</span>`);
    const starred = isWatched(r.ticker);
    const verdict = investmentVerdict(r);
    const thesis = r.thesis_direction === "strengthening" ? "↑ tese" : r.thesis_direction === "weakening" ? "↓ tese" : "→ tese";
    const thesisCls = r.thesis_direction === "strengthening" ? "positive-text" : r.thesis_direction === "weakening" ? "negative-text" : "";
    const cols=activeStockColumns();
    const metricCells=cols.map(k=>{
      const d=STOCK_COLUMN_DEFS[k]; const val=d?.value(r); const tone=metricCellTone(k,val);
      if(k==='score') return `<div class="stock-row-score"><span class="score-pill ${verdict.cls}">${val==null?'—':Math.round(val)}</span><small>${verdict.label}</small></div>`;
      if(d?.grade) return `<div class="stock-row-metric ${tone}"><b>${metricGrade(val)}</b><small>${d.short} ${val==null?'—':Math.round(val)}</small></div>`;
      return `<div class="stock-row-metric ${tone}"><b>${d?d.format(val,r):'—'}</b><small>${d?.short||k}</small></div>`;
    }).join('');
    return `
      <article class="card stock-card stock-radar-row" data-ticker="${r.ticker}" tabindex="0" style="--stock-cols:${cols.length}">
        <div class="stock-card__identity">
          <div class="company-mark">${r.ticker.replace(/\..*/, '').slice(0,2)}</div>
          <div class="card-main">
            <div class="card-ticker">${r.ticker} <button class="star-btn ${starred ? 'is-active' : ''}" data-ticker="${r.ticker}" aria-label="Watchlist">${starred ? "★" : "☆"}</button></div>
            <div class="card-name">${r.name || "—"}</div>
            <div class="card-sector">${r.sector || "Sem setor"}${r.region ? " · " + regionLabel(r.region) : ""}</div>
            <div class="stock-row-signals"><span class="${thesisCls}">${thesis}</span>${Number(r.insider_net_value_30d??0)>0?'<span class="positive-text">insiders +</span>':''}${flags.join("")}</div>
          </div>
        </div>${metricCells}
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
    if (model === "insurance") return [["Insurance Quality",r.quality_pct ?? r.profitability_pct],["Underwriting Proxy",null],["Capital Proxy",r.balance_pct ?? r.leverage_pct],["Growth",r.growth_pct],["Valuation",r.value_pct],["Income",null],["Stability",r.stability_pct]];
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

  function metricCardHtml({title, value, subtitle, explanation, series, tone="neutral", badge, context}) {
    return `<article class="w-metric-card ${tone}">
      <div class="w-metric-head"><span>${escapeHtml(title)}</span>${badge ? `<b>${escapeHtml(badge)}</b>` : ''}</div>
      <div class="w-metric-main"><strong>${value}</strong>${miniBarsHtml(series, tone)}</div>
      ${subtitle ? `<p class="w-metric-sub">${escapeHtml(subtitle)}</p>` : ''}
      ${context ? metricContextHtml(context) : ''}
      ${explanation ? `<p class="w-metric-explain">${escapeHtml(explanation)}</p>` : ''}
    </article>`;
  }

  function annualMetricContext(r, key, current, sectorMedian, formatter=fmtRawPct) {
    const hist=(r.annual_quality_history||[]).filter(x=>Number.isFinite(Number(x?.[key])));
    const one=hist[1]?.[key] ?? hist[0]?.[key] ?? null;
    const old=hist[3]?.[key] ?? hist[hist.length-1]?.[key] ?? null;
    let trend='—';
    if(Number.isFinite(Number(current)) && Number.isFinite(Number(old))){
      const d=(Number(current)-Number(old))*100; trend=`${d>=0?'+':''}${d.toFixed(1)} pp`;
    }
    return {current:formatter(current), oneYear:formatter(one), trend, sector:formatter(sectorMedian)};
  }

  function valuationMetricContext(r, field, current, sectorMedian){
    const series=state.valuationHistory?.[r.ticker]||{};
    const dates=Object.keys(series).sort();
    let one=null;
    if(dates.length){
      const target=Date.now()-365*86400000;
      const best=dates.map(d=>({d,t:new Date(d).getTime(),v:series[d]?.[field]})).filter(x=>Number.isFinite(Number(x.v))).sort((a,b)=>Math.abs(a.t-target)-Math.abs(b.t-target))[0];
      if(best && Math.abs(best.t-target) < 75*86400000) one=best.v;
    }
    const own=ownValuationContext(r.ticker,field,current);
    return {current:fmtRatio(current), oneYear:fmtRatio(one), trend:own.median==null?'em construção':`${fmtSignedPct(own.rel)} vs mediana`, sector:fmtRatio(sectorMedian)};
  }

  function dividendMetricContext(r){
    const hist=(r.annual_dividend_history||[]).filter(x=>Number.isFinite(Number(x?.value)));
    const cur=hist[0]?.value, one=hist[1]?.value, old=hist[3]?.value ?? hist[hist.length-1]?.value;
    let trend='—';
    if(Number.isFinite(Number(cur))&&Number.isFinite(Number(old))&&Number(old)>0){
      const yrs=Math.max(1,Math.min(3,hist.length-1)); const cagr=(Math.pow(Number(cur)/Number(old),1/yrs)-1)*100; trend=`${cagr>=0?'+':''}${cagr.toFixed(1)}% CAGR`;
    }
    return {current:cur==null?'—':Number(cur).toFixed(2), oneYear:one==null?'—':Number(one).toFixed(2), trend, sector:fmtDividendYield(r.sector_dividend_yield_median)};
  }

  function metricContextHtml(c){
    return `<div class="metric-context-grid"><div><span>Atual</span><b>${c.current??'—'}</b></div><div><span>1 ano</span><b>${c.oneYear??'—'}</b></div><div><span>3Y tendência</span><b>${c.trend??'—'}</b></div><div><span>Setor</span><b>${c.sector??'—'}</b></div></div>`;
  }

  function pctTone(v, positiveAbove = 0) {
    if (v == null || !Number.isFinite(Number(v))) return "neutral";
    return Number(v) > positiveAbove ? "positive" : Number(v) < positiveAbove ? "negative" : "neutral";
  }

  function capitalAllocationIntelligenceHtml(r) {
    const hist=(r.annual_dividend_history||[]).filter(x=>Number.isFinite(Number(x?.value)) && Number(x.value)>=0);
    const currentDiv=hist[0]?.value ?? null;
    const oldDiv=hist[Math.min(3, hist.length-1)]?.value ?? null;
    const years=Math.max(1, Math.min(3, hist.length-1));
    const divCagr=(Number.isFinite(Number(currentDiv)) && Number.isFinite(Number(oldDiv)) && Number(oldDiv)>0)
      ? (Math.pow(Number(currentDiv)/Number(oldDiv),1/years)-1) : null;
    let streak=0;
    for(let i=0;i<hist.length-1;i++){
      if(Number(hist[i].value) >= Number(hist[i+1].value)) streak++; else break;
    }
    const mcap=Number(r.market_cap), rep=Number(r.repurchases_last_quarter);
    const annualisedBuybackYield=(Number.isFinite(rep)&&rep>0&&Number.isFinite(mcap)&&mcap>0) ? (rep*4/mcap) : null;
    const dyPct=Number(r.dividend_yield), dy=dividendYieldFraction(r.dividend_yield), dilution=Number(r.dilution_yoy), fcfCov=Number(r.dividend_fcf_coverage), payout=Number(r.payout_ratio);
    const shareholderYield=(Number.isFinite(dy)?dy:0) + (Number.isFinite(annualisedBuybackYield)?annualisedBuybackYield:0) - (Number.isFinite(dilution)&&dilution>0?dilution:0);
    const hasAny=[dyPct,annualisedBuybackYield,dilution,fcfCov,payout,divCagr].some(Number.isFinite);
    if(!hasAny) return '';
    const allocationTone = Number.isFinite(shareholderYield) ? (shareholderYield>0.04?'positive':shareholderYield<0?'negative':'neutral') : 'neutral';
    return `<section class="capital-allocation-block">
      <div class="section-kicker">CAPITAL ALLOCATION</div>
      <h3>Dividendos, buybacks & diluição</h3>
      <p class="section-sub">Como a empresa distribui — ou dilui — o valor económico por ação.</p>
      <div class="w-metric-grid">
        ${metricCardHtml({title:'Dividend Growth', value:divCagr==null?'—':`${divCagr>=0?'+':''}${(divCagr*100).toFixed(1)}%`, subtitle:hist.length>=2?`${streak} período(s) sem corte no histórico observado`:'histórico insuficiente', explanation:divCagr==null?'Requer vários anos de dividendos por ação.':'CAGR observado do dividendo por ação; crescimento sustentável é mais útil do que yield elevado isolado.', series:hist.slice().reverse().map(x=>x.value), tone:divCagr==null?'neutral':divCagr>0.05?'positive':divCagr<0?'negative':'neutral'} )}
        ${metricCardHtml({title:'Buyback Yield · annualizado', value:annualisedBuybackYield==null?'—':fmtRawPct(annualisedBuybackYield), subtitle:r.repurchases_last_quarter==null?'sem recompra observada':`${fmtMoney(r.repurchases_last_quarter,r.currency)} no último trimestre`, explanation:'Proxy anualizado a partir do último trimestre. Recompras só criam valor quando não são anuladas por emissão/diluição excessiva.', tone:annualisedBuybackYield==null?'neutral':annualisedBuybackYield>0.02?'positive':'neutral'} )}
        ${metricCardHtml({title:'Shareholder Yield · proxy', value:Number.isFinite(shareholderYield)?fmtRawPct(shareholderYield):'—', subtitle:'dividend yield + buyback yield − diluição positiva', explanation:'Mede retorno de capital observável ao acionista. É um proxy: buybacks são annualizados a partir do último trimestre.', tone:allocationTone} )}
        ${metricCardHtml({title:'Dilution / Share Count', value:Number.isFinite(dilution)?`${dilution>=0?'+':''}${(dilution*100).toFixed(1)}%`:'—', subtitle:Number.isFinite(dilution)?(dilution>0.03?'diluição material':dilution<-.03?'redução líquida do share count':'estável'):'sem histórico suficiente', explanation:'Crescimento do número de ações reduz o valor económico por ação e pode neutralizar buybacks anunciados.', series:r.quarterly_diluted_shares, tone:Number.isFinite(dilution)?(dilution>.03?'negative':dilution<-.03?'positive':'neutral'):'neutral'} )}
        ${metricCardHtml({title:'Dividend Safety', value:Number.isFinite(fcfCov)?`${fcfCov.toFixed(1)}×`:Number.isFinite(payout)?fmtRawPct(payout):'—', subtitle:Number.isFinite(fcfCov)?'cobertura por FCF':Number.isFinite(payout)?'payout contabilístico':'sem cobertura suficiente', explanation:Number.isFinite(fcfCov)?(fcfCov>=1.5?'FCF dá margem confortável ao dividendo.':fcfCov>=1?'FCF cobre o dividendo, mas com margem limitada.':'FCF atual não cobre integralmente o dividendo implícito.'):'Payout e FCF ajudam a distinguir rendimento sustentável de yield potencialmente frágil.', tone:Number.isFinite(fcfCov)?(fcfCov>=1.5?'positive':fcfCov<1?'negative':'neutral'):'neutral'} )}
      </div>
      <p class="detail-note">Buyback yield é uma proxy anualizada a partir do último trimestre; não assume que o ritmo se mantenha. Shareholder yield desconta apenas diluição positiva observada e não substitui uma análise completa de emissão de opções ou M&A.</p>
    </section>`;
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
      cards.push(metricCardHtml({title:"Dividend Yield", value:fmtDividendYield(r.dividend_yield), subtitle:ffoPayout == null ? "payout FFO indisponível" : `FFO payout ${fmtRawPct(ffoPayout)}`, explanation:"Rendimento distribuído contextualizado pelo payout sobre FFO proxy, quando disponível.", tone:pctTone(r.dividend_yield)}));
      cards.push(metricCardHtml({title:"AFFO · NAV · Occupancy", value:"—", subtitle:reitCoverage == null ? "fontes especializadas não integradas" : `${Number(reitCoverage).toFixed(0)}% cobertura do REIT Native Pack`, explanation:"AFFO, NAV e ocupação exigem dados específicos do REIT e continuam deliberadamente ausentes. A app não os inventa nem transforma capex total em AFFO.", tone:"neutral", badge:"DATA INTEGRITY"}));
    } else if (insurance) {
      const claims = r.insurance_claims_to_revenue;
      const opRatio = r.insurance_operating_ratio_proxy;
      const capProxy = r.insurance_equity_to_assets;
      const bvps = r.insurance_book_value_per_share_proxy;
      const invIncome = r.insurance_net_investment_income;
      const insCoverage = r.insurance_metric_coverage_pct;
      cards.push(metricCardHtml({title:"Return on Equity", value:fmtRawPct(r.roe), subtitle:scoreWord(r.quality_pct), explanation:"Rentabilidade do capital próprio; deve ser lida com capitalização, qualidade da subscrição e mix de negócio.", tone:scoreTone(r.quality_pct)}));
      cards.push(metricCardHtml({title:"Claims / Revenue · proxy", value:fmtRawPct(claims), subtitle:claims == null ? "sem dados" : "carga de sinistros/benefícios", explanation:"Sinistros ou benefícios identificados nas demonstrações divididos pela receita. É um proxy transversal e não substitui o loss ratio reportado.", tone:claims == null ? "neutral" : Number(claims) < .65 ? "positive" : Number(claims) > .85 ? "negative" : "neutral", badge:"INSURANCE NATIVE"}));
      cards.push(metricCardHtml({title:"Insurance Operating Ratio · proxy", value:fmtRawPct(opRatio), subtitle:opRatio == null ? "sem dados" : "sinistros + custos / receita", explanation:"Proxy amplo da carga operacional. Não é o combined ratio estatutário: fontes genéricas não separam de forma consistente prémios ganhos, sinistros e acquisition costs.", tone:opRatio == null ? "neutral" : Number(opRatio) < .90 ? "positive" : Number(opRatio) > 1.05 ? "negative" : "neutral"}));
      cards.push(metricCardHtml({title:"Equity / Assets · capital proxy", value:fmtRawPct(capProxy), subtitle:"capitalização contabilística", explanation:"Capital próprio sobre ativos. Ajuda a comparar colchões contabilísticos, mas não substitui Solvency II, RBC ou outros rácios regulatórios.", tone:capProxy == null ? "neutral" : Number(capProxy) >= .10 ? "positive" : Number(capProxy) < .05 ? "negative" : "neutral"}));
      cards.push(metricCardHtml({title:"Book Value / Share · proxy", value:bvps == null ? "—" : fmtMoney(bvps, r.currency), subtitle:"equity / ações diluídas", explanation:"Valor contabilístico por ação calculado a partir das demonstrações. Deve ser lido em conjunto com P/B e ROE.", tone:"neutral"}));
      cards.push(metricCardHtml({title:"Net Investment Income", value:fmtMoney(invIncome, r.currency), subtitle:invIncome == null ? "sem dados" : "rendimento da carteira de investimentos", explanation:"Quando disponível, mostra a contribuição do portefólio financeiro para os resultados da seguradora.", tone:invIncome == null ? "neutral" : Number(invIncome) > 0 ? "positive" : "negative"}));
      cards.push(metricCardHtml({title:"Price / Book", value:fmtRatio(r.price_to_book), subtitle:r.pb_vs_sector_pct == null ? "sem benchmark" : `${fmtSignedPct(r.pb_vs_sector_pct)} vs setor`, explanation:"P/B é especialmente relevante em seguradoras quando interpretado com ROE, crescimento do book value e qualidade da subscrição.", tone:r.pb_vs_sector_pct == null ? "neutral" : Number(r.pb_vs_sector_pct) < 0 ? "positive" : "neutral"}));
      cards.push(metricCardHtml({title:"Regulatory data gap", value:insCoverage == null ? "—" : `${Number(insCoverage).toFixed(0)}%`, subtitle:"cobertura do Insurance Native Pack", explanation:"Combined ratio reportado, loss ratio estatutário e solvência regulatória continuam ausentes quando não existem em fonte pública estruturada. A app não os fabrica.", tone:"neutral", badge:"DATA INTEGRITY"}));
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
      cards.push(metricCardHtml({title:"Dividend Yield", value:fmtDividendYield(r.dividend_yield), subtitle:r.payout_ratio == null ? "payout indisponível" : `payout ${fmtRawPct(r.payout_ratio)}`, explanation:"Rendimento anual distribuído; sustentabilidade depende de payout, cash flow e balanço.", tone:"neutral"}));
    }

    return `<section class="w-metric-section"><div class="w-section-intro"><span>${bank ? 'BANK METRICS' : reit ? 'REIT METRICS' : insurance ? 'INSURANCE METRICS' : 'COMPANY METRICS'}</span><h3>Os números que importam</h3><p>Cada métrica combina valor atual, tendência quando disponível e contexto. Valores ausentes são mostrados como ausentes — nunca estimados sem fonte.</p></div><div class="w-metric-stack">${cards.join('')}</div></section>`;
  }

  function metricStorySection(title, eyebrow, cards, id='') {
    const valid = cards.filter(Boolean);
    if (!valid.length) return '';
    return `<section class="metric-story-section dossier-block"${id?` id="${escapeHtml(id)}"`:''}><div class="metric-story-title"><span class="eyebrow">${escapeHtml(eyebrow)}</span><h3>${escapeHtml(title)}</h3></div><div class="metric-story-grid">${valid.join('')}</div></section>`;
  }

  function winstonMetricStoriesHtml(r) {
    if (scoreModelFor(r) !== 'general') return '';
    const epsAccel = Number(r.eps_yoy_acceleration_pp);
    const revAccel = Number(r.revenue_yoy_acceleration_pp);
    const rndYoY = Number(r.rnd_yoy);
    const rndRatio = Number(r.rnd_to_revenue);
    const roce = Number(r.roce_proxy);
    const dil = Number(r.diluted_shares_yoy);
    const divCov = Number(r.dividend_fcf_coverage);
    const payout = Number(r.payout_ratio);
    const insiderNet = Number(r.insider_net_value_30d);

    const growthCards = [
      metricCardHtml({title:'Revenue Growth', value:fmtRawPct(r.revenue_yoy_latest), subtitle:Number.isFinite(revAccel) ? `${revAccel>=0?'+':''}${revAccel.toFixed(1)} pp de aceleração` : 'YoY · último trimestre', explanation:Number.isFinite(revAccel) ? (revAccel>2 ? 'A receita está a acelerar face ao trimestre anterior.' : revAccel<-2 ? 'A receita está a desacelerar face ao trimestre anterior.' : 'O ritmo de crescimento está relativamente estável.') : 'Compara o trimestre mais recente com o trimestre homólogo.', series:r.quarterly_revenue, tone:pctTone(r.revenue_yoy_latest)}),
      metricCardHtml({title:'EPS Growth', value:fmtRawPct(r.eps_yoy_latest ?? r.earnings_quarterly_growth), subtitle:Number.isFinite(epsAccel) ? `${epsAccel>=0?'+':''}${epsAccel.toFixed(1)} pp de aceleração` : 'crescimento por ação', explanation:Number.isFinite(epsAccel) ? (epsAccel>3 ? 'O crescimento do lucro por ação está a acelerar.' : epsAccel<-3 ? 'O crescimento do lucro por ação está a desacelerar.' : 'O crescimento por ação está relativamente estável.') : 'O EPS incorpora o efeito de crescimento dos lucros e da diluição.', series:r.quarterly_eps, tone:pctTone(r.eps_yoy_latest ?? r.earnings_quarterly_growth)}),
      r.rnd_latest_quarter != null ? metricCardHtml({title:'R&D Spend', value:fmtMoney(r.rnd_latest_quarter, r.currency), subtitle:Number.isFinite(rndRatio) ? `${(rndRatio*100).toFixed(1)}% da receita` : (Number.isFinite(rndYoY) ? `${rndYoY>=0?'+':''}${(rndYoY*100).toFixed(1)}% YoY` : 'último trimestre'), explanation:Number.isFinite(rndRatio) ? `Investimento em investigação e desenvolvimento equivalente a ${(rndRatio*100).toFixed(1)}% da receita trimestral.` : 'Investimento trimestral em investigação e desenvolvimento, quando reportado separadamente.', series:r.quarterly_rnd, tone:Number.isFinite(rndYoY) && rndYoY < -.15 ? 'negative' : 'neutral'}) : null,
      metricCardHtml({title:'Share Count / Dilution', value:Number.isFinite(dil) ? `${dil>=0?'+':''}${(dil*100).toFixed(1)}%` : '—', subtitle:Number.isFinite(dil) ? (dil>0.03?'diluição material':dil<-.03?'buyback líquido':'estável') : 'sem histórico suficiente', explanation:Number.isFinite(dil) ? (dil>0 ? 'O aumento do número de ações reduz o crescimento económico por ação.' : 'A redução do número de ações aumenta a participação económica por ação.') : 'Requer pelo menos cinco trimestres comparáveis de ações diluídas.', series:r.quarterly_diluted_shares, tone:Number.isFinite(dil) ? (dil>.03?'negative':dil<-.03?'positive':'neutral') : 'neutral'})
    ];

    const qualityCards = [
      metricCardHtml({title:'Gross Margin', value:fmtRawPct(r.gross_margin), subtitle:'economia unitária', context:annualMetricContext(r,'gross_margin',r.gross_margin,r.sector_gross_margin_median), explanation:'Percentagem da receita que sobra depois dos custos diretos.', tone:r.gross_margin == null ? 'neutral' : Number(r.gross_margin)>.5?'positive':Number(r.gross_margin)<.2?'negative':'neutral'}),
      metricCardHtml({title:'Operating Margin', value:fmtRawPct(r.operating_margin), context:annualMetricContext(r,'operating_margin',r.operating_margin,r.sector_operating_margin_median), subtitle:r.net_margin_yoy_change_pp == null ? 'rentabilidade operacional' : `${Number(r.net_margin_yoy_change_pp)>=0?'+':''}${Number(r.net_margin_yoy_change_pp).toFixed(1)} pp margem líquida YoY`, explanation:'Mostra a eficiência do negócio antes do resultado financeiro e impostos.', tone:r.operating_margin == null?'neutral':Number(r.operating_margin)>.15?'positive':Number(r.operating_margin)<0?'negative':'neutral'}),
      metricCardHtml({title:'ROE', value:fmtRawPct(r.roe), subtitle:'return on equity', context:annualMetricContext(r,'roe',r.roe,r.sector_roe_median), explanation:'Retorno contabilístico gerado sobre o capital dos acionistas.', tone:r.roe == null?'neutral':Number(r.roe)>.18?'positive':Number(r.roe)<.07?'negative':'neutral'}),
      metricCardHtml({title:'ROCE · proxy', value:Number.isFinite(roce)?fmtRawPct(roce):'—', subtitle:'EBIT / capital empregado', context:annualMetricContext(r,'roce_proxy',roce,r.sector_roce_proxy_median), explanation:'Proxy de eficiência do capital: EBIT dividido por ativos menos passivos correntes. Não substitui o ROCE reportado pela empresa.', tone:Number.isFinite(roce)?(roce>.15?'positive':roce<.07?'negative':'neutral'):'neutral', badge:'CAPITAL EFFICIENCY'})
    ];

    const cashCards = [
      metricCardHtml({title:'Free Cash Flow', value:fmtMoney(r.free_cash_flow,r.currency), subtitle:`FCF yield ${fmtRawPct(r.fcf_yield)}`, explanation:'Caixa gerado depois do investimento operacional necessário.', tone:r.free_cash_flow == null?'neutral':Number(r.free_cash_flow)>0?'positive':'negative'}),
      metricCardHtml({title:'Net Cash / Debt', value:fmtMoney(r.net_cash,r.currency), subtitle:r.net_cash == null?'sem dados':Number(r.net_cash)>=0?'net cash':'net debt', explanation:'Caixa menos dívida total. Deve ser lido em conjunto com geração de FCF e maturidades.', tone:r.net_cash == null?'neutral':Number(r.net_cash)>=0?'positive':'negative'}),
      metricCardHtml({title:'Dividend Safety', value:r.dividend_yield == null?'—':fmtDividendYield(r.dividend_yield), context:dividendMetricContext(r), subtitle:Number.isFinite(divCov)?`${divCov.toFixed(1)}× cobertura FCF`:Number.isFinite(payout)?`payout ${(payout*100).toFixed(0)}%`:'sem payout/cobertura', explanation:Number.isFinite(divCov)?(divCov>=1.5?'FCF oferece margem confortável sobre o dividendo implícito.':divCov>=1?'FCF cobre o dividendo, mas com margem limitada.':'FCF atual não cobre integralmente o dividendo implícito.'):'A segurança do dividendo exige payout e cash flow suficientes.', tone:Number.isFinite(divCov)?(divCov>=1.5?'positive':divCov<1?'negative':'neutral'):'neutral'}),
      metricCardHtml({title:'Balance Sheet', value:r.interest_coverage==null?'—':`${Number(r.interest_coverage).toFixed(1)}×`, subtitle:`D/E ${r.debt_to_equity==null?'—':Number(r.debt_to_equity).toFixed(0)}`, explanation:'Cobertura de juros e dívida/equity dão contexto à resistência financeira.', tone:r.interest_coverage==null?'neutral':Number(r.interest_coverage)>=5?'positive':Number(r.interest_coverage)<1.5?'negative':'neutral'})
    ];

    const marketCards = [
      metricCardHtml({title:'Forward P/E', value:fmtRatio(r.forward_pe), context:valuationMetricContext(r,'fpe',r.forward_pe,r.sector_forward_pe_median), subtitle:r.forward_pe_vs_sector_pct==null?'sem benchmark setorial':`${fmtSignedPct(r.forward_pe_vs_sector_pct)} vs setor`, explanation:'Valuation com base nos lucros esperados. Um desconto só é atrativo se a qualidade e crescimento forem sustentáveis.', tone:r.forward_pe_vs_sector_pct==null?'neutral':Number(r.forward_pe_vs_sector_pct)<-10?'positive':Number(r.forward_pe_vs_sector_pct)>20?'negative':'neutral'}),
      metricCardHtml({title:'FCF Yield', value:fmtRawPct(r.fcf_yield), subtitle:'cash yield', explanation:'Free cash flow relativo ao valor de mercado; permite comparar preço e capacidade de geração de caixa.', tone:r.fcf_yield==null?'neutral':Number(r.fcf_yield)>.06?'positive':Number(r.fcf_yield)<.02?'negative':'neutral'}),
      metricCardHtml({title:'Insider Activity · 30d', value:Number.isFinite(insiderNet)?fmtMoney(Math.abs(insiderNet),r.currency||'USD'):'—', subtitle:Number.isFinite(insiderNet)?(insiderNet>0?'net buying':insiderNet<0?'net selling':'sem fluxo líquido'):'SEC sem sinal P/S', explanation:Number.isFinite(insiderNet)?`${r.insider_buy_count_30d||0} compras e ${r.insider_sell_count_30d||0} vendas open-market identificadas.`:'Apenas transações SEC P/S são consideradas; awards e opções são excluídos.', tone:Number.isFinite(insiderNet)?(insiderNet>0?'positive':insiderNet<0?'negative':'neutral'):'neutral', badge:'SMART MONEY'}),
      metricCardHtml({title:'Valuation vs Sector', value:r.forward_pe_vs_sector_pct==null?'—':fmtSignedPct(r.forward_pe_vs_sector_pct), subtitle:'forward P/E vs mediana', explanation:`Benchmark construído com ${r.peer_count??0} pares do mesmo setor quando existe cobertura suficiente.`, tone:r.forward_pe_vs_sector_pct==null?'neutral':Number(r.forward_pe_vs_sector_pct)<0?'positive':'negative'})
    ];

    return `<section class="winston-dossier-flow"><div class="w-section-intro dossier-flow-intro"><span>FINANCIAL STORY</span><h3>Leitura por blocos</h3><p>Valor atual, tendência, contexto e interpretação — organizados numa sequência única para investigação.</p></div>${metricStorySection('Growth Profile','GROWTH',growthCards,'dossier-growth')}${metricStorySection('Profitability & Capital','QUALITY',qualityCards,'dossier-profitability')}${metricStorySection('Cash & Balance Sheet','FINANCIAL STRENGTH',cashCards,'dossier-balance')}${metricStorySection('Valuation','MARKET CONTEXT',marketCards,'dossier-valuation')}</section>`;
  }

  const DOSSIER_SECTIONS = [
    ['dossier-overview','Snapshot'],['dossier-score','Score'],['dossier-changes','Mudanças'],
    ['dossier-growth','Growth'],['dossier-profitability','Profit'],['dossier-balance','Balanço'],
    ['dossier-valuation','Valuation'],['dossier-dividends','Dividendos'],['dossier-insiders','Insiders'],
    ['dossier-estimates','Estimates'],['dossier-catalysts','Catalysts'],['dossier-thesis','Tese']
  ];

  function dossierNavHtml() {
    // Native select is deliberately used on mobile: iOS handles it reliably even
    // inside a fixed, independently scrolling PWA overlay. Chips remain as a
    // secondary desktop affordance and use the same single jump function.
    return `<nav class="dossier-nav" aria-label="Navegação do dossier">
      <label class="dossier-section-picker"><span>Ir para</span><select data-dossier-select aria-label="Ir para secção do dossier">${DOSSIER_SECTIONS.map(([id,label])=>`<option value="${id}">${label}</option>`).join('')}</select></label>
      <div class="dossier-nav-chips">${DOSSIER_SECTIONS.map(([id,label])=>`<button type="button" data-dossier-jump="${id}" onclick="window.__finscannerDossierJump && window.__finscannerDossierJump('${id}', this); return false;">${label}</button>`).join('')}</div>
    </nav>`;
  }

  function dossierJumpTo(id, sourceBtn=null) {
    const target = document.getElementById(id);
    if (!target || !els.detail || els.detail.hidden) return false;
    // scrollIntoView is the most reliable path in iOS Safari/PWA because it
    // automatically scrolls the nearest scrollable ancestor (.detail-overlay).
    try { target.scrollIntoView({ behavior: appSettings().reduceMotion ? 'auto' : 'smooth', block: 'start', inline: 'nearest' }); }
    catch (_) { target.scrollIntoView(true); }
    // Small correction keeps the section heading clear of the overlay edge.
    setTimeout(() => { try { els.detail.scrollTop = Math.max(0, els.detail.scrollTop - 10); } catch (_) {} }, appSettings().reduceMotion ? 0 : 260);
    const nav = els.detailContent.querySelector('.dossier-nav');
    const buttons = [...els.detailContent.querySelectorAll('[data-dossier-jump]')];
    buttons.forEach(x => x.classList.toggle('is-active', x.dataset.dossierJump === id));
    const select = nav?.querySelector('[data-dossier-select]');
    if (select && select.value !== id) select.value = id;
    const btn = sourceBtn || buttons.find(x => x.dataset.dossierJump === id);
    if (btn) { try { btn.scrollIntoView({behavior:'auto',block:'nearest',inline:'center'}); } catch (_) {} }
    return true;
  }
  window.__finscannerDossierJump = dossierJumpTo;

  function bindDossierNav() {
    const nav = els.detailContent.querySelector('.dossier-nav');
    if (!nav) return;
    const select = nav.querySelector('[data-dossier-select]');
    select?.addEventListener('change', () => dossierJumpTo(select.value));
    // Delegation is kept as a non-inline fallback for desktop and accessibility.
    nav.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-dossier-jump]');
      if (!btn) return;
      e.preventDefault();
      e.stopPropagation();
      dossierJumpTo(btn.dataset.dossierJump, btn);
    }, true);
  }

  function scoreDescriptor(v) {
    const n=Number(v); if(!Number.isFinite(n)) return "sem dados";
    if(n>=80) return "Exceptional"; if(n>=68) return "Strong"; if(n>=56) return "Good"; if(n>=44) return "Mixed"; return "Weak";
  }

  function scoreOrbs(score) {
    const n=Math.max(0,Math.min(100,Number(score)||0));
    const filled=Math.max(0,Math.min(5,Math.ceil(n/20)));
    return `<div class="score-orbs" aria-label="rating ${filled} de 5">${[0,1,2,3,4].map(i=>`<i class="${i<filled?'on':''}"></i>`).join('')}</div>`;
  }

  function stockChangeSignalsHtml(r) {
    const items=[];
    const rev=Number(r.revenue_yoy_acceleration_pp), ni=Number(r.net_income_yoy_acceleration_pp), md=Number(r.net_margin_yoy_change_pp), dil=Number(r.diluted_shares_yoy) * 100;
    if(Number.isFinite(rev) && Math.abs(rev)>=2) items.push({tone:rev>0?'good':'bad',title:`Receita ${rev>0?'a acelerar':'a desacelerar'}`,text:`${rev>0?'+':''}${rev.toFixed(1)} pp vs crescimento YoY anterior`});
    if(Number.isFinite(ni) && Math.abs(ni)>=3) items.push({tone:ni>0?'good':'bad',title:`Lucro ${ni>0?'a acelerar':'a desacelerar'}`,text:`${ni>0?'+':''}${ni.toFixed(1)} pp de aceleração YoY`});
    if(Number.isFinite(md) && Math.abs(md)>=1) items.push({tone:md>0?'good':'bad',title:`Margem ${md>0?'em expansão':'sob pressão'}`,text:`${md>0?'+':''}${md.toFixed(1)} pp vs trimestre homólogo`});
    if(Number.isFinite(dil) && Math.abs(dil)>=1) items.push({tone:dil<0?'good':'warn',title:dil>0?'Share count rising':'Share count falling',text:`${dil>0?'+':''}${dil.toFixed(1)}% YoY`});
    const inet=Number(r.insider_net_value_30d);
    if(Number.isFinite(inet) && inet!==0) items.push({tone:inet>0?'good':'warn',title:inet>0?'Insider accumulation':'Insider selling',text:`Fluxo líquido 30d ${fmtMoney(inet,r.currency||'USD')}`});
    if(r.thesis_direction==='strengthening') items.unshift({tone:'good',title:'Tese a reforçar',text:r.thesis_evolution_summary||r.thesis_summary||'Sinais recentes reforçam a tese.'});
    if(r.thesis_direction==='weakening') items.unshift({tone:'bad',title:'Tese a deteriorar',text:r.thesis_evolution_summary||r.thesis_summary||'Sinais recentes enfraquecem a tese.'});
    return items.length ? `<section class="stock-change-panel"><div class="section-heading"><div><span class="eyebrow">WHAT CHANGED</span><h3>O que mudou recentemente</h3></div></div><div class="stock-change-strip">${items.slice(0,5).map(x=>`<article class="stock-change-card ${x.tone}"><strong>${escapeHtml(x.title)}</strong><p>${escapeHtml(x.text)}</p></article>`).join('')}</div></section>` : '';
  }

  function analystConsensusHtml(r){
    const sb=Number(r.analyst_strong_buy), b=Number(r.analyst_buy), h=Number(r.analyst_hold), s=Number(r.analyst_sell), ss=Number(r.analyst_strong_sell);
    const vals=[sb,b,h,s,ss];
    if(!vals.some(Number.isFinite)) return '<span class="analyst-consensus-empty">—</span>';
    const safe=vals.map(x=>Number.isFinite(x)?x:0), total=safe.reduce((a,x)=>a+x,0)||1;
    const positive=safe[0]+safe[1], negative=safe[3]+safe[4];
    const label=positive>safe[2]&&positive>negative?'Buy-leaning':negative>positive&&negative>safe[2]?'Sell-leaning':'Mixed / Hold';
    return `<div class="analyst-consensus"><strong>${label}</strong><span>${safe[0]} strong buy · ${safe[1]} buy · ${safe[2]} hold · ${safe[3]} sell · ${safe[4]} strong sell</span></div>`;
  }
  function estimateTone(v, positiveThreshold=0){
    const n=Number(v); if(!Number.isFinite(n)) return 'neutral';
    return n>positiveThreshold?'positive':n<0?'negative':'neutral';
  }

  function catalystIntelligenceHtml(r){
    const d=Number(r.analyst_days_to_earnings);
    const hasDate=Number.isFinite(d) && r.analyst_next_earnings_date;
    const hist=Array.isArray(r.analyst_earnings_history_4q)?r.analyst_earnings_history_4q:[];
    const beats=Number(r.analyst_earnings_beats_4q), misses=Number(r.analyst_earnings_misses_4q), streak=Number(r.analyst_earnings_beat_streak);
    const avg=r.analyst_earnings_avg_surprise_4q;
    if(!hasDate && !hist.length) return '';
    const band=!hasDate?'unknown':d<=3?'imminent':d<=7?'week':d<=14?'near':'scheduled';
    const label=!hasDate?'Data não disponível':d===0?'Hoje':d===1?'Amanhã':d<=7?`Em ${d} dias · esta semana`:`Em ${d} dias`;
    const posture=!hasDate?'Evento não calendarizado':d<=3?'Evento binário iminente':d<=7?'Catalisador próximo':d<=14?'Catalisador a aproximar-se':'Fora da janela crítica';
    const dots=hist.map(q=>{const sp=Number(q.surprise_pct); const cls=Number.isFinite(sp)?sp>0?'beat':sp<0?'miss':'flat':'na'; return `<div class="earnings-dot ${cls}" title="${escapeHtml(q.date||'')} · ${fmtRawPct(q.surprise_pct)}"><i></i><span>${escapeHtml((q.date||'').slice(0,7))}</span></div>`}).join('');
    return `<section class="catalyst-intel"><div class="section-heading"><div><span class="eyebrow">CATALYST INTELLIGENCE</span><h3>Earnings event risk</h3><p>Calendário + comportamento recente de resultados. Não altera o score.</p></div><span class="catalyst-badge ${band}">${escapeHtml(posture)}</span></div><div class="catalyst-grid"><article class="catalyst-primary ${band}"><span>PRÓXIMOS RESULTADOS</span><strong>${escapeHtml(r.analyst_next_earnings_date||'—')}</strong><b>${escapeHtml(label)}</b><p>${d<=3?'Evita interpretar o score isoladamente: o próximo resultado pode dominar o preço no curto prazo.':d<=7?'A tese estrutural pode estar correta e ainda assim existir risco de gap no evento.':'Sem evento de earnings imediato dentro da janela crítica.'}</p></article><article class="catalyst-card"><span>4Q EARNINGS RECORD</span><strong>${Number.isFinite(beats)?beats:'—'} beats · ${Number.isFinite(misses)?misses:'—'} misses</strong><small>surpresa média ${fmtRawPct(avg)} · streak ${Number.isFinite(streak)?streak:'—'}Q</small><div class="earnings-dots">${dots||'<em>sem histórico</em>'}</div></article><article class="catalyst-card"><span>EXPECTATION MOMENTUM</span><strong>${fmtRawPct(r.analyst_eps_next_q_revision_30d_pct ?? r.analyst_eps_next_y_revision_30d_pct)}</strong><small>EPS revisions · 30d</small><p>${Number(r.analyst_eps_revisions_up_30d||0)} ↑ vs ${Number(r.analyst_eps_revisions_down_30d||0)} ↓</p></article></div><p class="detail-note">Uma data de resultados é um catalisador, não um sinal direcional. O Finscanner separa qualidade estrutural de risco de evento.</p></section>`;
  }

  function analystIntelligenceHtml(r){
    const status=r.analyst_status||'not_requested';
    const coverage=Number(r.analyst_coverage_pct||0);
    const qrev=r.analyst_eps_next_q_revision_30d_pct, yrev=r.analyst_eps_next_y_revision_30d_pct;
    const rev=qrev!=null?qrev:yrev;
    const surprise=r.analyst_latest_eps_surprise_pct;
    const target=r.analyst_price_target_upside_pct;
    const up=Number(r.analyst_eps_revisions_up_30d||0), down=Number(r.analyst_eps_revisions_down_30d||0);
    const hasAny=coverage>0 || [r.analyst_eps_next_q,r.analyst_revenue_next_q,rev,surprise,r.analyst_price_target_mean].some(v=>v!=null);
    if(!hasAny){
      return `<section class="analyst-intel"><div class="section-heading"><div><span class="eyebrow">EARNINGS & ESTIMATES</span><h3>Analyst Intelligence</h3></div><span class="section-count">sem cobertura</span></div><p class="detail-note">Yahoo não disponibilizou estimativas estruturadas para este título nesta execução. Ausência de dados não é sinal negativo.</p></section>`;
    }
    return `<section class="analyst-intel">
      <div class="section-heading"><div><span class="eyebrow">EARNINGS & ESTIMATES</span><h3>Analyst Intelligence</h3><p>Expectativas forward, revisões e surpresa — contexto, não componente do score.</p></div><span class="analyst-coverage ${status==='ok'?'good':status==='partial'?'mid':''}">${Math.round(coverage)}% cobertura</span></div>
      <div class="analyst-intel-grid">
        <article class="analyst-card"><span>NEXT QUARTER EPS</span><strong>${r.analyst_eps_next_q==null?'—':Number(r.analyst_eps_next_q).toFixed(2)}</strong><small>${r.analyst_eps_next_q_growth==null?'crescimento —':`growth ${fmtRawPct(r.analyst_eps_next_q_growth)}`} · ${r.analyst_eps_next_q_analysts??'—'} analistas</small><p>${r.analyst_eps_next_q_low==null||r.analyst_eps_next_q_high==null?'intervalo não disponível':`${Number(r.analyst_eps_next_q_low).toFixed(2)} – ${Number(r.analyst_eps_next_q_high).toFixed(2)}`}</p></article>
        <article class="analyst-card"><span>NEXT QUARTER REVENUE</span><strong>${fmtMoney(r.analyst_revenue_next_q,r.currency)}</strong><small>${r.analyst_revenue_next_q_growth==null?'crescimento —':`growth ${fmtRawPct(r.analyst_revenue_next_q_growth)}`} · ${r.analyst_revenue_next_q_analysts??'—'} analistas</small><p>${r.analyst_revenue_next_y_growth==null?'forward anual —':`próximo ano ${fmtRawPct(r.analyst_revenue_next_y_growth)}`}</p></article>
        <article class="analyst-card ${estimateTone(rev)}"><span>EPS REVISION · 30D</span><strong>${fmtRawPct(rev)}</strong><small>${up} revisões ↑ · ${down} revisões ↓</small><p>${rev==null?'sem histórico de revisão':Number(rev)>0.01?'consenso de EPS foi revisto em alta':Number(rev)<-0.01?'consenso de EPS foi revisto em baixa':'consenso aproximadamente estável'}</p></article>
        <article class="analyst-card ${estimateTone(surprise)}"><span>LATEST EPS SURPRISE</span><strong>${fmtRawPct(surprise)}</strong><small>${escapeHtml(r.analyst_latest_earnings_date||'data —')}</small><p>${r.analyst_latest_eps_actual==null?'resultado não disponível':`EPS ${Number(r.analyst_latest_eps_actual).toFixed(2)} vs ${r.analyst_latest_eps_estimate==null?'—':Number(r.analyst_latest_eps_estimate).toFixed(2)} esperado`}</p></article>
        <article class="analyst-card ${estimateTone(target)}"><span>ANALYST PRICE TARGET</span><strong>${fmtMoney(r.analyst_price_target_mean,r.currency)}</strong><small>${fmtRawPct(target)} vs preço atual</small><p>${r.analyst_price_target_low==null||r.analyst_price_target_high==null?'intervalo —':`${fmtMoney(r.analyst_price_target_low,r.currency)} – ${fmtMoney(r.analyst_price_target_high,r.currency)}`}</p></article>
        <article class="analyst-card"><span>CONSENSUS</span>${analystConsensusHtml(r)}<small>Contagem de recomendações atuais disponibilizada pela fonte.</small></article>
      </div>
      <p class="detail-note">Estimativas e price targets são opiniões de analistas agregadas pela fonte e podem mudar sem aviso. Não são previsões do Finscanner e não entram no score principal.</p>
    </section>`;
  }

  function insiderTxKey(ticker, tx) {
    return [ticker, tx?.accession||'', tx?.date||'', tx?.owner||'', tx?.type||'', tx?.shares??'', tx?.price??''].join('|');
  }

  function insiderActivitySectionHtml(r) {
    const txs = Array.isArray(r.insider_transactions_365d) ? r.insider_transactions_365d : (Array.isArray(r.insider_transactions) ? r.insider_transactions : []);
    const buys = r.insider_buy_count_365d ?? r.insider_buy_count_30d;
    const sells = r.insider_sell_count_365d ?? r.insider_sell_count_30d;
    const buyV = r.insider_buy_value_365d ?? r.insider_buy_value_30d;
    const sellV = r.insider_sell_value_365d ?? r.insider_sell_value_30d;
    const conviction = insiderConviction(r);
    const txList = txs.length ? txs.slice(0,16).map(tx=>`<button class="insider-ledger-row ${tx.type==='buy'?'buy':'sell'}" data-insider-ledger="${escapeHtml(insiderTxKey(r.ticker,tx))}"><span>${tx.type==='buy'?'▲ COMPRA':'▼ VENDA'} · ${escapeHtml(tx.date||'—')}</span><strong>${escapeHtml(tx.owner||'Insider')}</strong><small>${escapeHtml(tx.role||'')}${tx.shares!=null?` · ${Number(tx.shares).toLocaleString('pt-PT')} ações`:''}${tx.price!=null?` @ ${Number(tx.price).toFixed(2)}`:''}${tx.value!=null?` · ${fmtMoney(tx.value,r.currency||'USD')}`:''}</small></button>`).join('') : '<p class="detail-note">Sem transações P/S estruturadas disponíveis nos últimos 12 meses.</p>';
    return `<section class="insider-activity-panel">
      <div class="section-heading"><div><span class="eyebrow">SMART MONEY · SEC FORM 4</span><h3>Compras e vendas de insiders</h3><p>Preço da ação + transações open-market P/S observadas nos últimos 12 meses.</p></div><span class="insider-year-net ${(Number(buyV||0)-Number(sellV||0))>=0?'positive-text':'negative-text'}">${fmtMoney(Number(buyV||0)-Number(sellV||0),r.currency||'USD')}</span></div>
      ${conviction.score?`<div class="conviction-dossier ${conviction.direction}"><div><span>INSIDER CONVICTION</span><strong>${conviction.score}<small>/100</small></strong></div><div><b>${escapeHtml(conviction.label)} · ${conviction.direction==='buy'?'compra':'venda'}</b><p>${escapeHtml(conviction.reasons.join(' · '))}</p></div></div>`:''}
      <div class="insider-year-summary"><span><b>${buys??'—'}</b> compras</span><span><b>${sells??'—'}</b> vendas</span><span>comprado <b>${fmtMoney(buyV,r.currency||'USD')}</b></span><span>vendido <b>${fmtMoney(sellV,r.currency||'USD')}</b></span></div>
      <div class="insider-chart-controls" data-insider-chart-controls><button class="is-active" data-insider-chart-filter="all">Todos</button><button data-insider-chart-filter="buy">Compras</button><button data-insider-chart-filter="sell">Vendas</button></div>
      <div class="insider-chart-wrap"><canvas id="insider-price-chart" class="insider-price-chart" height="220"></canvas><div id="insider-chart-tooltip" class="insider-chart-tooltip" hidden></div></div>
      <div class="insider-chart-legend"><span class="buy">▲ compra insider</span><span class="sell">▼ venda insider</span></div>
      <div class="insider-ledger">${txList}</div>
      <p class="detail-note">Só códigos SEC P e S. O tamanho visual dos marcadores usa o valor da transação quando conhecido. Ausência de marcador pode significar cobertura SEC parcial.</p>
    </section>`;
  }

  function drawInsiderChart(r, filter='all') {
    const canvas=document.getElementById('insider-price-chart');
    if(!canvas) return;
    const history=Array.isArray(r.insider_price_history_1y)?r.insider_price_history_1y:[];
    const txs=(Array.isArray(r.insider_transactions_365d)?r.insider_transactions_365d:[]).filter(tx=>filter==='all'||tx.type===filter);
    const wrap=canvas.parentElement, tooltip=document.getElementById('insider-chart-tooltip');
    const ratio=window.devicePixelRatio||1, cssW=Math.max(300,canvas.clientWidth||680), cssH=220;
    canvas.width=Math.round(cssW*ratio); canvas.height=Math.round(cssH*ratio); canvas.style.height=cssH+'px';
    const ctx=canvas.getContext('2d'); ctx.scale(ratio,ratio); ctx.clearRect(0,0,cssW,cssH);
    if(history.length<2){ctx.fillStyle='#8a93a1';ctx.font='13px system-ui';ctx.fillText('Histórico de preço será preenchido no próximo workflow para ações com atividade insider.',18,40);return;}
    const pts=history.map(x=>({date:String(x.date),close:Number(x.close)})).filter(x=>Number.isFinite(x.close));
    if(pts.length<2)return;
    const parse=d=>new Date(d+'T00:00:00Z').getTime(); const minT=parse(pts[0].date),maxT=parse(pts[pts.length-1].date);
    let minP=Math.min(...pts.map(x=>x.close)),maxP=Math.max(...pts.map(x=>x.close)); if(maxP===minP){minP-=1;maxP+=1}
    const pad={l:46,r:18,t:18,b:30},w=cssW-pad.l-pad.r,h=cssH-pad.t-pad.b;
    const xOf=d=>pad.l+((parse(d)-minT)/(maxT-minT))*w, yOf=v=>pad.t+h-((v-minP)/(maxP-minP))*h;
    ctx.strokeStyle='#e7e9ee';ctx.lineWidth=1; for(let i=0;i<4;i++){const y=pad.t+i*h/3;ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(pad.l+w,y);ctx.stroke()}
    ctx.strokeStyle='#5aa99a';ctx.lineWidth=2.2;ctx.lineJoin='round';ctx.beginPath();pts.forEach((p,i)=>{const x=xOf(p.date),y=yOf(p.close);i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();
    ctx.fillStyle='#8a93a1';ctx.font='10px system-ui';ctx.fillText(maxP.toFixed(2),4,pad.t+4);ctx.fillText(minP.toFixed(2),4,pad.t+h);ctx.fillText(pts[0].date.slice(5),pad.l,cssH-7);const end=pts.at(-1).date.slice(5);ctx.fillText(end,cssW-pad.r-ctx.measureText(end).width,cssH-7);
    const nearestPrice=date=>pts.reduce((best,p)=>Math.abs(parse(p.date)-parse(date))<Math.abs(parse(best.date)-parse(date))?p:best,pts[0]);
    const knownVals=txs.map(t=>Number(t.value)).filter(v=>v>0);const maxV=knownVals.length?Math.max(...knownVals):1;
    const markers=[];
    txs.forEach(tx=>{if(!tx.date||parse(tx.date)<minT||parse(tx.date)>maxT)return;const base=Number(tx.price);const yprice=Number.isFinite(base)?base:nearestPrice(tx.date).close;const x=xOf(tx.date),y=yOf(yprice);const size=6+Math.min(8,Math.sqrt(Math.max(0,Number(tx.value)||0)/maxV)*8);ctx.fillStyle=tx.type==='buy'?'#17a673':'#e34e59';ctx.beginPath();if(tx.type==='buy'){ctx.moveTo(x,y-size);ctx.lineTo(x-size,y+size*.7);ctx.lineTo(x+size,y+size*.7)}else{ctx.moveTo(x,y+size);ctx.lineTo(x-size,y-size*.7);ctx.lineTo(x+size,y-size*.7)}ctx.closePath();ctx.fill();markers.push({x,y,size,tx});});
    canvas._insiderMarkers=markers;
    canvas.onclick=e=>{const rect=canvas.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;let m=null,dist=Infinity;for(const z of markers){const d=Math.hypot(x-z.x,y-z.y);if(d<dist){dist=d;m=z}}if(!m||dist>28){if(tooltip)tooltip.hidden=true;return;}const tx=m.tx;if(tooltip){tooltip.hidden=false;tooltip.innerHTML=`<strong>${tx.type==='buy'?'COMPRA':'VENDA'} · ${escapeHtml(tx.owner||'Insider')}</strong><span>${escapeHtml(tx.role||'')}</span><span>${escapeHtml(tx.date||'—')} · ${tx.shares==null?'—':Number(tx.shares).toLocaleString('pt-PT')} ações · ${tx.price==null?'—':Number(tx.price).toFixed(2)} · ${fmtMoney(tx.value,r.currency||'USD')}</span>`;tooltip.style.left=Math.max(6,Math.min(cssW-260,m.x-100))+'px';tooltip.style.top=Math.max(8,m.y-86)+'px';}};
  }

  function bindInsiderChart(r) {
    const controls=document.querySelector('[data-insider-chart-controls]');
    if(!controls)return;
    drawInsiderChart(r,'all');
    controls.querySelectorAll('[data-insider-chart-filter]').forEach(btn=>btn.addEventListener('click',()=>{controls.querySelectorAll('button').forEach(b=>b.classList.toggle('is-active',b===btn));drawInsiderChart(r,btn.dataset.insiderChartFilter||'all')}));
  }

  function openDetail(ticker) {
    const r = state.data.stocks.find(s => s.ticker === ticker);
    if (!r) return;
    if (r.quote_type === "ETF") { openFundDetail(r); return; }

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
    const starred = isWatched(r.ticker);
    const series = (state.history && state.history[r.ticker]) || {};
    const valuation = valuationLabel(r);
    const ownPe = ownValuationContext(r.ticker, "pe", r.trailing_pe);
    const ownFpe = ownValuationContext(r.ticker, "fpe", r.forward_pe);
    const ownPb = ownValuationContext(r.ticker, "pb", r.price_to_book);
    const ownEv = ownValuationContext(r.ticker, "ev", r.enterprise_to_ebitda);
    const hasHistory = Object.keys(series).length >= 2;
    const verdict = investmentVerdict(r);
    const dimensions = scoreDimensionsFor(r);
    const dimHtml = dimensions.map(([label,val]) => `<div class="dimension"><span>${label}</span><em>${scoreDescriptor(val)}</em><strong>${val == null ? "—" : Math.round(val)}</strong><i><b style="width:${Math.max(0,Math.min(100,Number(val)||0))}%"></b></i></div>`).join("");

    els.detailContent.innerHTML = `
      <div class="detail-hero stock-detail-hero dossier-block" id="dossier-overview">
        <div class="stock-detail-brand"><div class="company-mark detail-company-mark">${r.ticker.replace(/\..*/, '').slice(0,2)}</div><div><span class="eyebrow">STOCK DETAIL</span><h2>${r.name || r.ticker} <small>${r.ticker}</small></h2><p>${r.sector || "—"}${r.industry ? " · " + r.industry : ""}</p></div></div>
        <button class="detail-watch star-btn ${starred ? 'is-active' : ''}" data-ticker="${r.ticker}" aria-label="Watchlist">${starred ? '★ Saved' : '☆ Save'}</button>
        <div class="stock-facts"><div><span>PRICE</span><strong>${r.current_price ?? '—'} ${r.currency || ''}</strong></div><div><span>MARKET CAP</span><strong>${fmtCap(r.market_cap)}</strong></div><div><span>EXCHANGE</span><strong>${escapeHtml(r.exchange || r.full_exchange_name || marketOf(r.ticker) || '—')}</strong></div></div>
        <div class="stock-score-hero"><span class="eyebrow">FINSCANNER SCORE</span><strong>${r.score ?? "—"}</strong>${scoreOrbs(r.score)}<p>${verdict.label}</p><small>${verdict.text}</small></div>
      </div>
      ${dossierNavHtml()}
      <div class="verdict-panel ${verdict.cls}"><strong>${verdict.label}</strong><p>${verdict.text}</p><span>Cobertura de dados: ${r.data_coverage_pct ?? "—"}% · confiança ${r.data_confidence || "—"}</span></div>
      <section class="dossier-block" id="dossier-changes">${stockChangeSignalsHtml(r)}</section>
      <div class="score-model-note"><span>${scoreModelLabel(r)}</span><p>${escapeHtml(r.score_model_note || (scoreModelFor(r) === "bank" ? "Modelo bancário nativo: acrescenta eficiência, provisões de crédito, capital contabilístico e crescimento do net interest income; CET1/NPL continuam dependentes de fonte regulatória." : scoreModelFor(r) === "reit" ? "Modelo REIT nativo por proxy: FFO, P/FFO, payout FFO e net-debt/EBITDA entram no score; AFFO, NAV e ocupação continuam dependentes de fontes especializadas." : scoreModelFor(r) === "insurance" ? "Modelo Insurance Native por proxy: qualidade, sinistros/custos, capitalização, valuation e rendimento. Combined ratio e solvência regulatória só aparecem quando houver fonte estruturada fiável." : "Modelo geral multifator para empresas não financeiras especializadas."))}</p></div>
      <label class="owned-toggle"><input type="checkbox" id="owned-checkbox" ${owned ? "checked" : ""}><span>Tenho esta posição (guardado só neste dispositivo)</span></label>
      ${stockPortfolioFitHtml(r)}

      <section class="dossier-block" id="dossier-score">
        <h3 class="dossier-title">How the score breaks down</h3>
        <div class="dimension-grid">${dimHtml}</div>
        ${companyMetricPackHtml(r)}
      </section>

      ${winstonMetricStoriesHtml(r)}
      <section class="dossier-block" id="dossier-dividends">${capitalAllocationIntelligenceHtml(r)}</section>

      <details class="legacy-metrics"><summary>Ver tabela técnica completa</summary>
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
        <div><span>PEG</span><strong>${r.peg_ratio == null ? "—" : Number(r.peg_ratio).toFixed(2)}</strong></div><div><span>Dividend yield</span><strong>${fmtDividendYield(r.dividend_yield)}</strong></div>
        <div><span>Payout ratio</span><strong>${fmtRawPct(r.payout_ratio)}</strong></div><div><span>Beta</span><strong>${r.beta == null ? "—" : Number(r.beta).toFixed(2)}</strong></div>
      </div>
      </details>

      <section class="dossier-block" id="dossier-insiders">${insiderActivitySectionHtml(r)}</section>
      <section class="dossier-block" id="dossier-estimates">${analystIntelligenceHtml(r)}</section>
      <section class="dossier-block" id="dossier-catalysts">${catalystIntelligenceHtml(r)}</section>
      <section class="dossier-block dossier-thesis-final" id="dossier-thesis">
        <h3 class="dossier-title">Tese quantitativa</h3>
        ${thesisPanelHtml(r)}
        ${hasHistory ? `<section class="score-history-card"><div><span class="eyebrow">SCORE HISTORY</span><h3>Trajetória do score</h3><p>${Object.keys(series).length} observações disponíveis</p></div><canvas id="sparkline" width="340" height="70" class="sparkline"></canvas></section>` : ""}
      </section>

      <h3 class="dossier-title">Risco & contexto</h3>
      <div class="detail-row"><span>Zombie (cobertura de juros)</span><span>${zombieLabel}</span></div>
      <div class="detail-row"><span>Atividade insiders</span><span>${insider}</span></div>
      <div class="detail-row"><span>Market cap</span><span>${fmtCap(r.market_cap)}</span></div>
      <div class="detail-row"><span>Preço atual</span><span>${r.current_price ?? "—"} ${r.currency || ""}</span></div>
      ${r.quote_type === "ETF" ? `<div class="detail-row"><span>Expense ratio</span><span>${fmtExpenseRatio(r.expense_ratio)}</span></div><div class="detail-row"><span>Exposição AI</span><span>${r.ai_exposure_pct != null ? r.ai_exposure_pct + "%" : "—"}</span></div>` : ""}
      <p class="detail-note">O verdict é uma classificação quantitativa explicável e relativa ao universo analisado. Não constitui previsão de retorno nem aconselhamento financeiro.</p>
    `;
    els.detail.hidden = false;
    bindInsiderChart(r);
    bindDossierNav();

    document.getElementById("owned-checkbox").addEventListener("change", () => {
      toggleOwned(r.ticker);
      if (state.activeView === "stocks") applyFilters();
    });
    els.detailContent.querySelectorAll(".detail-watch").forEach(btn => btn.addEventListener("click", (e) => { e.stopPropagation(); toggleWatched(r.ticker); openDetail(r.ticker); }));
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

  function detectCsvDelimiter(firstLine) {
    const comma = (firstLine.match(/,/g) || []).length;
    const semi = (firstLine.match(/;/g) || []).length;
    const tab = (firstLine.match(/\t/g) || []).length;
    if (semi > comma && semi >= tab) return ";";
    if (tab > comma && tab > semi) return "\t";
    return ",";
  }

  function parseCsvLine(line, delimiter = ",") {
    const out = [];
    let cur = "", quoted = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (quoted && line[i + 1] === '"') { cur += '"'; i++; }
        else quoted = !quoted;
      } else if (ch === delimiter && !quoted) { out.push(cur.trim()); cur = ""; }
      else cur += ch;
    }
    out.push(cur.trim());
    return out;
  }

  function accumulatePosition(portfolio, ticker, qty, value, sourceCurrency = null, netCashFlow = null) {
    const existing = portfolio[ticker];
    if (!existing) {
      portfolio[ticker] = {
        qty: Number.isFinite(qty) ? qty : null,
        value: Number.isFinite(value) ? value : null,
        sourceCurrency: sourceCurrency || null,
        netCashFlow: Number.isFinite(netCashFlow) ? netCashFlow : null,
      };
      return;
    }
    if (!existing.sourceCurrency && sourceCurrency) existing.sourceCurrency = sourceCurrency;
    if (Number.isFinite(qty)) existing.qty = (Number.isFinite(existing.qty) ? existing.qty : 0) + qty;
    if (Number.isFinite(value)) existing.value = (Number.isFinite(existing.value) ? existing.value : 0) + value;
    if (Number.isFinite(netCashFlow)) existing.netCashFlow = (Number.isFinite(existing.netCashFlow) ? existing.netCashFlow : 0) + netCashFlow;
  }

  function finalizePortfolio(portfolio) {
    for (const [ticker, entry] of Object.entries(portfolio)) {
      if (entry && typeof entry === "object" && Number.isFinite(entry.qty) && entry.qty <= 1e-9) delete portfolio[ticker];
    }
    return portfolio;
  }

  function parseCsvPortfolio(text) {
    const cleanText = String(text || "").replace(/^\uFEFF/, "");
    const lines = cleanText.split(/\r?\n/).filter(l => l.trim());
    if (!lines.length) return {};
    const delimiter = detectCsvDelimiter(lines[0]);
    const header = parseCsvLine(lines[0], delimiter).map(h => h.trim().toLowerCase());
    const tickerIdx = header.findIndex(h => ["ticker", "symbol"].includes(h));
    const qtyIdx = header.findIndex(h => ["quantity", "qty", "shares", "units"].includes(h));
    const valueIdx = header.findIndex(h => ["value", "amount", "market_value", "market value"].includes(h));
    const currencyIdx = header.findIndex(h => ["currency", "ccy"].includes(h));
    const costIdx = header.findIndex(h => ["cost per share", "cost_per_share", "price", "transaction price"].includes(h));
    const commissionIdx = header.findIndex(h => ["commission", "fee", "fees"].includes(h));
    const commissionCurrencyIdx = header.findIndex(h => ["commission currency", "commission_currency", "fee currency"].includes(h));
    const dateIdx = header.findIndex(h => ["date", "trade date", "transaction date"].includes(h));
    if (tickerIdx === -1) throw new Error("Coluna 'ticker' ou 'symbol' não encontrada no cabeçalho do CSV.");

    // DivTracker Combined is a transaction ledger. Build the current position from
    // the whole ledger instead of treating each row as an independent holding.
    // This also preserves a weighted-average remaining cost basis locally on-device.
    if (qtyIdx !== -1 && costIdx !== -1) {
      const txByTicker = {};
      for (let i = 1; i < lines.length; i++) {
        const cols = parseCsvLine(lines[i], delimiter);
        const rawTicker = cols[tickerIdx];
        if (!rawTicker) continue;
        const ticker = normalizeTicker(rawTicker);
        const qty = Number.parseFloat(cols[qtyIdx]);
        const price = Number.parseFloat(cols[costIdx]);
        if (!Number.isFinite(qty)) continue;
        const currency = currencyIdx !== -1 ? String(cols[currencyIdx] || "").trim() : "";
        const commission = commissionIdx !== -1 ? Number.parseFloat(cols[commissionIdx]) : 0;
        const commissionCurrency = commissionCurrencyIdx !== -1 ? String(cols[commissionCurrencyIdx] || "").trim() : "";
        const date = dateIdx !== -1 ? String(cols[dateIdx] || "") : "";
        (txByTicker[ticker] ||= []).push({ qty, price, currency, commission, commissionCurrency, date, order: i });
      }

      const portfolio = {};
      for (const [ticker, txs] of Object.entries(txByTicker)) {
        txs.sort((a,b) => String(a.date).localeCompare(String(b.date)) || a.order - b.order);
        let qty = 0, costBasis = 0, realized = 0, buys = 0, sells = 0;
        let currency = "", firstDate = "", lastDate = "";
        for (const tx of txs) {
          if (!currency && tx.currency) currency = tx.currency;
          if (tx.date) { if (!firstDate) firstDate = tx.date; lastDate = tx.date; }
          const commissionSameCurrency = Number.isFinite(tx.commission) && (!tx.commissionCurrency || !currency || tx.commissionCurrency.toUpperCase() === currency.toUpperCase()) ? tx.commission : 0;
          if (tx.qty > 0) {
            const gross = Number.isFinite(tx.price) ? tx.qty * tx.price : 0;
            qty += tx.qty;
            costBasis += gross + commissionSameCurrency;
            buys += gross + commissionSameCurrency;
          } else if (tx.qty < 0) {
            const sellQty = Math.min(-tx.qty, Math.max(0, qty));
            if (sellQty <= 0) continue;
            const avgCost = qty > 0 ? costBasis / qty : 0;
            const removedCost = avgCost * sellQty;
            const proceeds = Number.isFinite(tx.price) ? sellQty * tx.price - commissionSameCurrency : 0;
            realized += proceeds - removedCost;
            sells += proceeds;
            qty -= sellQty;
            costBasis = Math.max(0, costBasis - removedCost);
          }
        }
        if (qty > 1e-9) {
          portfolio[ticker] = {
            qty,
            value: null,
            sourceCurrency: currency || null,
            costBasisLocal: costBasis,
            avgCostLocal: qty > 0 ? costBasis / qty : null,
            realizedLocal: realized,
            grossBuysLocal: buys,
            grossSellsLocal: sells,
            firstDate: firstDate || null,
            lastDate: lastDate || null,
            ledgerDerived: true,
            ledgerTransactions: txs.map(tx => ({
              qty: tx.qty, price: Number.isFinite(tx.price) ? tx.price : null,
              currency: tx.currency || currency || null,
              commission: Number.isFinite(tx.commission) ? tx.commission : 0,
              commissionCurrency: tx.commissionCurrency || null,
              date: tx.date || null
            })),
          };
        }
      }
      return portfolio;
    }

    // Generic position CSV fallback.
    const portfolio = {};
    for (let i = 1; i < lines.length; i++) {
      const cols = parseCsvLine(lines[i], delimiter);
      const rawTicker = cols[tickerIdx];
      if (!rawTicker) continue;
      const ticker = normalizeTicker(rawTicker);
      const qty = qtyIdx !== -1 ? Number.parseFloat(cols[qtyIdx]) : null;
      const value = valueIdx !== -1 ? Number.parseFloat(cols[valueIdx]) : null;
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
        accumulatePosition(portfolio, ticker, qty, value, row.currency || row.ccy || null);
      }
    } else if (data && typeof data === "object") {
      for (const [rawTicker, v] of Object.entries(data)) {
        const ticker = normalizeTicker(rawTicker);
        if (typeof v === "number") accumulatePosition(portfolio, ticker, v, null);
        else if (v && typeof v === "object") {
          const qty = Number(v.quantity ?? v.qty ?? v.shares);
          const value = Number(v.value ?? v.amount);
          accumulatePosition(portfolio, ticker, qty, value, v.currency || v.ccy || null);
        }
      }
    }
    return finalizePortfolio(portfolio);
  }

  function setPortfolioImportStatus(message = "", tone = "neutral") {
    if (!els.portfolioImportStatus) return;
    els.portfolioImportStatus.textContent = message;
    els.portfolioImportStatus.dataset.tone = tone;
    els.portfolioImportStatus.hidden = !message;
  }

  function handlePortfolioFile(file) {
    if (!file) return;
    setPortfolioImportStatus(`A importar ${file.name}…`, "neutral");
    const reader = new FileReader();
    reader.onerror = () => setPortfolioImportStatus("Não foi possível ler o ficheiro selecionado.", "bad");
    reader.onload = () => {
      try {
        const text = String(reader.result || "");
        const portfolio = file.name.toLowerCase().endsWith(".json")
          ? parseJsonPortfolio(text)
          : parseCsvPortfolio(text);
        const tickers = Object.keys(portfolio);
        if (!tickers.length) {
          setPortfolioImportStatus("Não encontrei posições válidas neste ficheiro.", "bad");
          alert("Não encontrei nenhuma posição válida no ficheiro.");
          return;
        }
        lsSet(LS_PORTFOLIO, portfolio);
        const universeTickers = new Set((state.data?.stocks || []).map(r => r.ticker));
        const matched = tickers.filter(t => universeTickers.has(t)).length;
        const missed = tickers.length - matched;
        setPortfolioImportStatus(`✓ ${tickers.length} posições importadas · ${matched} com análise disponível${missed ? ` · ${missed} aguardam cobertura` : ""}.`, "good");
        renderPortfolio();
        if (state.activeView !== "portfolio") switchView("portfolio");
      } catch (e) {
        setPortfolioImportStatus(`Erro ao importar: ${e.message}`, "bad");
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

  function historicalFxToEur(currency, date) {
    const raw = String(currency || "EUR");
    if (raw.toUpperCase() === "EUR") return 1;
    const isPence = raw === "GBp" || raw === "GBX" || raw.toUpperCase() === "GBPENCE";
    const code = isPence ? "GBP" : raw.toUpperCase();
    const points = state.fxHistory?.series?.[code];
    if (!Array.isArray(points) || !points.length || !date) return null;
    const target = String(date).slice(0,10);
    let lo = 0, hi = points.length - 1, best = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const d = String(points[mid]?.[0] || "");
      if (d <= target) { best = mid; lo = mid + 1; } else hi = mid - 1;
    }
    if (best < 0) return null;
    const rate = Number(points[best]?.[1]);
    if (!Number.isFinite(rate) || rate <= 0) return null;
    return isPence ? rate / 100 : rate;
  }

  function ledgerCostBasisEur(entry) {
    const txs = entry?.ledgerTransactions;
    if (!Array.isArray(txs) || !txs.length) return null;
    let qty = 0, basisEur = 0, realizedEur = 0, histRows = 0, fallbackRows = 0;
    for (const tx of txs) {
      const q = Number(tx.qty);
      if (!Number.isFinite(q) || q === 0) continue;
      const px = Number(tx.price);
      const ccy = tx.currency || entry.sourceCurrency || "EUR";
      let rate = historicalFxToEur(ccy, tx.date);
      if (rate == null) { rate = fxToEur(ccy); fallbackRows++; } else histRows++;
      if (rate == null) return null;
      const commission = Number(tx.commission || 0);
      const feeCcy = tx.commissionCurrency || ccy;
      let feeRate = historicalFxToEur(feeCcy, tx.date);
      if (feeRate == null) feeRate = fxToEur(feeCcy);
      const feeEur = Number.isFinite(commission) && feeRate != null ? commission * feeRate : 0;
      if (q > 0) {
        const grossEur = Number.isFinite(px) ? q * px * rate : 0;
        qty += q; basisEur += grossEur + feeEur;
      } else {
        const sellQty = Math.min(-q, Math.max(0, qty));
        if (sellQty <= 0) continue;
        const avgBasisEur = qty > 0 ? basisEur / qty : 0;
        const removed = avgBasisEur * sellQty;
        const proceedsEur = Number.isFinite(px) ? sellQty * px * rate - feeEur : 0;
        realizedEur += proceedsEur - removed;
        qty -= sellQty; basisEur = Math.max(0, basisEur - removed);
      }
    }
    return { basisEur, realizedEur, qty, histRows, fallbackRows, method: fallbackRows ? "mixed" : "historical" };
  }

  function portfolioCostBasisEur(entry, stockRow) {
    const historical = ledgerCostBasisEur(entry);
    if (historical && Number.isFinite(historical.basisEur)) return historical.basisEur;
    if (!entry || !Number.isFinite(Number(entry.costBasisLocal))) return null;
    const currency = entry.sourceCurrency || stockRow?.currency || "EUR";
    const rate = fxToEur(currency);
    return rate == null ? null : Number(entry.costBasisLocal) * rate;
  }

  function portfolioPerformanceSnapshot(portfolio, rows) {
    const byTicker = Object.fromEntries(rows.map(r => [r.ticker, r]));
    const positions = Object.entries(portfolio).map(([ticker, entry]) => {
      const row = byTicker[ticker];
      const current = row ? positionValue(entry, row, true) : null;
      const hist = entry?.ledgerDerived ? ledgerCostBasisEur(entry) : null;
      const basis = row ? (hist && Number.isFinite(hist.basisEur) ? hist.basisEur : portfolioCostBasisEur(entry, row)) : null;
      const pnl = Number.isFinite(current) && Number.isFinite(basis) ? current - basis : null;
      const pnlPct = Number.isFinite(pnl) && basis > 0 ? pnl / basis * 100 : null;
      return { ticker, entry, row, current, basis, pnl, pnlPct, basisMethod: hist?.method || (entry?.costBasisLocal != null ? "current-fx" : null), histRows: hist?.histRows || 0, fallbackRows: hist?.fallbackRows || 0 };
    });
    const covered = positions.filter(x => Number.isFinite(x.current) && Number.isFinite(x.basis) && x.basis > 0);
    const current = covered.reduce((s,x)=>s+x.current,0);
    const basis = covered.reduce((s,x)=>s+x.basis,0);
    const pnl = current - basis;
    return { positions, covered, current, basis, pnl, pnlPct: basis > 0 ? pnl/basis*100 : null };
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



  function portfolioFitSnapshot(r, portfolio = loadPortfolio(), rows = (state.data?.stocks || [])) {
    if (!r || r.quote_type === 'ETF' || !portfolio || !Object.keys(portfolio).length || !rows?.length) return null;
    const byTicker = Object.fromEntries(rows.map(x => [x.ticker, x]));
    const valued = Object.entries(portfolio).map(([ticker, entry]) => {
      const row = byTicker[ticker];
      const eur = row ? positionValue(entry, row, true) : null;
      return { ticker, row, eur };
    }).filter(x => x.row && Number.isFinite(x.eur) && x.eur > 0);
    const total = valued.reduce((sum,x)=>sum+x.eur,0);
    if (!(total > 0)) return null;

    const sectorWeights = new Map(), geographyWeights = new Map(), indirectExposure = new Map();
    for (const x of valued) {
      const row=x.row;
      if (row.quote_type === 'ETF') {
        for (const [sec,w] of normalizeSectorWeights(row)) sectorWeights.set(sec,(sectorWeights.get(sec)||0)+x.eur*Math.max(0,Math.min(1,w)));
        const geo=String(row.fund_region||row.region||row.country||'').trim();
        if (geo) geographyWeights.set(geo,(geographyWeights.get(geo)||0)+x.eur);
        for (const [sym,h] of fundHoldingsMap(row)) indirectExposure.set(sym,(indirectExposure.get(sym)||0)+x.eur*Number(h.weight||0));
      } else {
        const sec=row.sector||'Sem setor'; sectorWeights.set(sec,(sectorWeights.get(sec)||0)+x.eur);
        const geo=String(row.country||row.region||'').trim(); if (geo) geographyWeights.set(geo,(geographyWeights.get(geo)||0)+x.eur);
      }
    }
    const sector=r.sector||'Sem setor', geo=String(r.country||r.region||'').trim();
    const sectorPct=((sectorWeights.get(sector)||0)/total)*100;
    const geoPct=geo?((geographyWeights.get(geo)||0)/total)*100:0;
    const hiddenPct=((indirectExposure.get(r.ticker)||0)/total)*100;
    const directEntry=portfolio[r.ticker];
    const directRow=directEntry ? byTicker[r.ticker] : null;
    const directValue=directRow ? positionValue(directEntry,directRow,true) : null;
    const directPct=Number.isFinite(directValue) ? directValue/total*100 : 0;

    const q=Number(r.quality_pct??r.profitability_pct??0), v=Number(r.value_pct??0), g=Number(r.growth_pct??0), score=Number(r.score??0);
    const thesis=r.thesis_direction==='strengthening'?8:r.thesis_direction==='weakening'?-8:0;
    const diversification=Math.max(0,100-sectorPct*2.2-geoPct*.55);
    const hiddenPenalty=Math.min(25,hiddenPct*5);
    const investment=0.34*score+0.25*q+0.20*v+0.13*g+thesis;
    const fit=Math.max(0,Math.min(100,0.72*investment+0.28*diversification-hiddenPenalty));
    const reasons=[];
    if(q>=75) reasons.push(`Quality ${Math.round(q)}`);
    if(v>=65) reasons.push(`Value ${Math.round(v)}`);
    if(g>=65) reasons.push(`Growth ${Math.round(g)}`);
    if(r.thesis_direction==='strengthening') reasons.push('tese ↑');
    if(sectorPct<10) reasons.push(`${sector} pouco representado`); else if(sectorPct>=25) reasons.push(`${sector} já pesa ${sectorPct.toFixed(0)}%`);
    if(hiddenPct>=1) reasons.push(`${hiddenPct.toFixed(1)}% já via ETFs`);
    if(directPct>=1) reasons.push(`${directPct.toFixed(1)}% já diretamente`);
    const label=fit>=78?'Excelente encaixe':fit>=68?'Bom encaixe':fit>=58?'Encaixe moderado':'Encaixe fraco';
    return {fit, label, investment, diversification, sectorPct, geoPct, hiddenPct, directPct, reasons, held:!!directEntry};
  }

  function stockPortfolioFitHtml(r) {
    const pf=portfolioFitSnapshot(r);
    if(!pf) return '';
    return `<details class="stock-portfolio-fit-box" ${pf.held?'':'open'}><summary><div><span class="eyebrow">PORTFOLIO FIT</span><b>${pf.held?'Impacto desta posição na carteira':'Como encaixa na tua carteira'}</b><small>${escapeHtml(pf.label)}</small></div><strong>${Math.round(pf.fit)}<i>/100</i></strong></summary><div class="stock-portfolio-fit-body"><div class="portfolio-fit-metrics"><span>Setor atual<b>${pf.sectorPct.toFixed(1)}%</b></span><span>Via ETFs<b>${pf.hiddenPct.toFixed(1)}%</b></span><span>Diversificação<b>${Math.round(pf.diversification)}</b></span>${pf.held?`<span>Posição direta<b>${pf.directPct.toFixed(1)}%</b></span>`:''}</div><p>${escapeHtml(pf.reasons.slice(0,4).join(' · ') || 'Sem sinais fortes de concentração ou sobreposição nos dados observados.')}</p><small>Fit estrutural, não recomendação de compra. Não assume um montante de investimento novo.</small></div></details>`;
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
    if (!Object.keys(portfolio).length) { els.exposurePanel.innerHTML = ""; return; }
    const rowByTicker = Object.fromEntries(matchedRows.map(r => [r.ticker, r]));
    const entries = Object.entries(portfolio).map(([ticker, entry]) => {
      const row = rowByTicker[ticker];
      const val = positionValue(entry, row);
      return { ticker, entry, row, val };
    });
    const valued = entries.filter(e => e.row && e.val != null && e.val > 0);
    const totalValue = valued.reduce((s,e)=>s+e.val,0);
    const unmatchedCount = entries.filter(e=>!e.row).length;
    const qtyMissing = entries.filter(e=>!Number.isFinite(Number(e.entry?.qty))).length;
    const priceMissing = entries.filter(e=>e.row && Number.isFinite(Number(e.entry?.qty)) && e.row.current_price == null && e.entry?.value == null).length;
    const fxMissing = entries.filter(e=>{
      if (!e.row || e.val != null || e.entry?.value != null) return false;
      const currency = e.row?.currency || e.entry?.sourceCurrency || 'EUR';
      return fxToEur(currency) == null;
    }).length;
    const perf = portfolioPerformanceSnapshot(portfolio, matchedRows);
    const historicalBasisCount = perf.covered.filter(x=>x.basisMethod === "historical").length;
    const mixedBasisCount = perf.covered.filter(x=>x.basisMethod === "mixed").length;
    const currentFxBasisCount = perf.covered.filter(x=>x.basisMethod === "current-fx").length;
    const perfMoney = v => new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(v||0);

    if (!valued.length) {
      els.exposurePanel.innerHTML = `<div class="exposure-block"><h3>Distribuição do portfolio</h3><p class="unmatched-note">Não consigo calcular o valor atual enquanto faltarem preços/FX. Quantidades presentes: ${entries.length-qtyMissing}/${entries.length}. ${priceMissing?`Sem preço atual: ${priceMissing}. `:''}${fxMissing?`Sem conversão FX: ${fxMissing}.`:''}</p></div>`;
      return;
    }

    const money = v => new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(v||0);
    const mode = state.portfolioExposureMode || 'positions';
    const display = state.portfolioAllocationDisplay || 'pct';
    const bySector={}, byRegion={}, byCurrency={}, byTheme={};
    for (const e of valued) {
      const sector=e.row?.sector || (e.row?.quote_type==='ETF'?'ETF / Fundo':'Sem setor');
      bySector[sector]=(bySector[sector]||0)+e.val;
      const region=e.row?.region ? regionLabel(e.row.region) : (e.row?.country || 'Região desconhecida');
      byRegion[region]=(byRegion[region]||0)+e.val;
      const currency=String(e.row?.currency || e.entry?.sourceCurrency || '—');
      byCurrency[currency]=(byCurrency[currency]||0)+e.val;
      portfolioThemeTags(e.row).forEach(tag=>{ byTheme[tag]=(byTheme[tag]||0)+e.val; });
    }
    const sortRows=obj=>Object.entries(obj).sort((a,b)=>b[1]-a[1]);
    const sectorRows=sortRows(bySector), regionRows=sortRows(byRegion), currencyRows=sortRows(byCurrency), themeRows=sortRows(byTheme);
    const posSorted=[...valued].sort((a,b)=>b.val-a.val);
    const top=posSorted.slice(0,15);
    const otherVal=posSorted.slice(15).reduce((s,e)=>s+e.val,0);
    const positionRows=top.map(e=>[e.ticker,e.val]);
    if (otherVal>0) positionRows.push(['Outros',otherVal]);

    const pct=v=>totalValue ? v/totalValue*100 : 0;
    const barRows=(rows, allowOver100=false)=>`<div class="portfolio-allocation-list">${rows.slice(0,18).map(([label,val],i)=>{
      const p=pct(val); const width=allowOver100?Math.min(100,p):p;
      return `<div class="portfolio-allocation-row"><span class="allocation-rank">${i+1}</span><b>${escapeHtml(label)}</b><i><em style="width:${Math.min(100,width).toFixed(1)}%"></em></i><strong>${display==='eur'?money(val):p.toFixed(2)+'%'}</strong></div>`;
    }).join('')}</div>`;

    let content='';
    if (mode==='positions') {
      content=`${donutBlockHtml('donut-positions','Distribuição por posição',positionRows,totalValue)}${barRows(positionRows)}`;
    } else if (mode==='sector') {
      content=`${donutBlockHtml('donut-sector','Exposição por setor',sectorRows,totalValue)}${barRows(sectorRows)}`;
    } else if (mode==='geo') {
      content=`${donutBlockHtml('donut-region','Exposição geográfica',regionRows,totalValue)}${barRows(regionRows)}`;
    } else if (mode==='currency') {
      content=`${donutBlockHtml('donut-currency','Moeda de negociação',currencyRows,totalValue)}${barRows(currencyRows)}<p class="unmatched-note">Moeda de negociação não equivale necessariamente à exposição cambial económica das empresas subjacentes.</p>`;
    } else if (mode==='performance') {
      const perfRows = perf.covered.filter(x=>Number.isFinite(x.pnl)).sort((a,b)=>b.pnl-a.pnl);
      const winners = perfRows.filter(x=>x.pnl>0).slice(0,10);
      const losers = [...perfRows].filter(x=>x.pnl<0).sort((a,b)=>a.pnl-b.pnl).slice(0,10);
      const perfList = (arr, cls) => arr.length ? `<div class="portfolio-performance-list ${cls}">${arr.map(x=>`<button data-ticker="${escapeHtml(x.ticker)}"><b>${escapeHtml(x.ticker)}</b><span>${x.pnlPct==null?'—':`${x.pnlPct>=0?'+':''}${x.pnlPct.toFixed(1)}%`}</span><strong>${x.pnl>=0?'+':''}${perfMoney(x.pnl)}</strong></button>`).join('')}</div>` : '<p class="unmatched-note">Sem posições suficientes.</p>';
      content=`<div class="exposure-block portfolio-performance-block"><h3 class="exposure-title">Rentabilidade não realizada</h3><div class="portfolio-performance-columns"><div><h4>Maiores ganhos</h4>${perfList(winners,'positive')}</div><div><h4>Maiores perdas</h4>${perfList(losers,'negative')}</div></div><p class="unmatched-note">P/L calculado sobre o custo médio remanescente do ledger. Compras e vendas são convertidas para EUR à taxa ECB da data da transação; quando uma data/moeda não tem série disponível, a app identifica o fallback para FX atual.</p></div>`;
    } else {
      content=`<div class="exposure-block"><h3 class="exposure-title">Temas observados</h3>${barRows(themeRows,true)}<p class="unmatched-note">Os temas não são exclusivos: uma empresa pode pertencer a mais de um. IA/Digital é apenas um dos temas e deixa de ser tratado como exposição privilegiada.</p></div>`;
    }

    els.exposurePanel.innerHTML=`
      <section class="portfolio-value-hero portfolio-value-hero--performance">
        <div class="portfolio-value-main"><span class="eyebrow">VALOR ATUAL DO PORTFOLIO</span><strong>${money(totalValue)}</strong><small>${valued.length}/${entries.length} posições valorizadas</small></div>
        <div class="portfolio-value-coverage"><b>${(valued.length/entries.length*100).toFixed(0)}%</b><span>cobertura</span></div>
        ${perf.covered.length ? `<div class="portfolio-pnl-strip"><div><span>Custo base coberto</span><b>${perfMoney(perf.basis)}</b></div><div class="${perf.pnl>=0?'is-positive':'is-negative'}"><span>P/L não realizado</span><b>${perf.pnl>=0?'+':''}${perfMoney(perf.pnl)}</b></div><div class="${perf.pnl>=0?'is-positive':'is-negative'}"><span>Rentabilidade</span><b>${perf.pnlPct==null?'—':`${perf.pnlPct>=0?'+':''}${perf.pnlPct.toFixed(2)}%`}</b></div></div><div class="historical-fx-status"><b>FX histórico</b><span>${historicalBasisCount} posições integralmente históricas${mixedBasisCount?` · ${mixedBasisCount} com fallback parcial`:''}${currentFxBasisCount?` · ${currentFxBasisCount} com FX atual`:''}</span></div>` : `<div class="portfolio-pnl-strip portfolio-pnl-strip--locked"><span>Reimporta o ficheiro Combined uma vez para ativar custo base e P/L por posição.</span></div>`}
      </section>
      <div class="portfolio-exposure-toolbar">
        <div class="portfolio-exposure-modes">
          ${[['positions','Posições'],['sector','Setores'],['geo','Geografia'],['performance','Rentabilidade'],['themes','Temas'],['currency','Moeda']].map(([id,label])=>`<button class="${mode===id?'is-active':''}" data-exposure-mode="${id}">${label}</button>`).join('')}
        </div>
        <div class="portfolio-value-toggle"><button class="${display==='pct'?'is-active':''}" data-allocation-display="pct">%</button><button class="${display==='eur'?'is-active':''}" data-allocation-display="eur">€</button></div>
      </div>
      ${content}
      <div class="exposure-block portfolio-data-note"><p class="unmatched-note">Quantidade importada: ${entries.length-qtyMissing}/${entries.length}. ${unmatchedCount?`${unmatchedCount} ainda sem linha analítica. `:''}${priceMissing?`${priceMissing} sem preço atual. `:''}${fxMissing?`${fxMissing} sem taxa FX. `:''}O valor atual usa quantidade × preço de mercado × FX; o Cost Per Share do CSV é histórico e não é usado como se fosse preço atual.</p></div>`;

    const donutMap={positions:['donut-positions',positionRows],sector:['donut-sector',sectorRows],geo:['donut-region',regionRows],currency:['donut-currency',currencyRows]};
    if (donutMap[mode]) paintDonut(donutMap[mode][0],donutMap[mode][1],totalValue);
    els.exposurePanel.querySelectorAll('[data-exposure-mode]').forEach(btn=>btn.addEventListener('click',()=>{state.portfolioExposureMode=btn.dataset.exposureMode; renderExposure(portfolio,matchedRows);}));
    els.exposurePanel.querySelectorAll('[data-allocation-display]').forEach(btn=>btn.addEventListener('click',()=>{state.portfolioAllocationDisplay=btn.dataset.allocationDisplay; renderExposure(portfolio,matchedRows);}));
    els.exposurePanel.querySelectorAll('[data-ticker]').forEach(btn=>btn.addEventListener('click',()=>openDetail(btn.dataset.ticker)));
  }

  function renderPortfolioPositionsTable(portfolio, rows) {
    if (!els.portfolioPositionsTable) return;
    const byTicker = Object.fromEntries(rows.map(r => [r.ticker, r]));
    const perf = portfolioPerformanceSnapshot(portfolio, rows);
    const totalValue = perf.positions.filter(x=>Number.isFinite(x.current) && x.current>0).reduce((s,x)=>s+x.current,0);
    const q = String(state.portfolioTableQuery || '').trim().toLowerCase();
    let items = perf.positions.map(x => {
      const row=x.row;
      const qty=Number(x.entry?.qty);
      const current=Number.isFinite(x.current)?x.current:null;
      const basis=Number.isFinite(x.basis)?x.basis:null;
      const pnl=Number.isFinite(x.pnl)?x.pnl:null;
      const pnlPct=Number.isFinite(x.pnlPct)?x.pnlPct:null;
      const weight=current!=null && totalValue>0 ? current/totalValue*100 : null;
      const unitBasis=basis!=null && Number.isFinite(qty) && qty>0 ? basis/qty : null;
      return { ...x, row, qty:Number.isFinite(qty)?qty:null, current, basis, pnl, pnlPct, weight, unitBasis };
    });
    if (q) items=items.filter(x=>String(x.ticker).toLowerCase().includes(q)||String(x.row?.name||'').toLowerCase().includes(q));
    const [key,dir]=String(state.portfolioTableSort||'value-desc').split('-');
    const getter={
      ticker:x=>x.ticker, value:x=>x.current, basis:x=>x.basis, pnl:x=>x.pnl, return:x=>x.pnlPct, weight:x=>x.weight, score:x=>Number(x.row?.score)
    }[key] || (x=>x.current);
    items.sort((a,b)=>{ const av=getter(a), bv=getter(b); if (typeof av==='string') return (dir==='asc'?1:-1)*av.localeCompare(bv||''); const an=Number.isFinite(av)?av:-Infinity, bn=Number.isFinite(bv)?bv:-Infinity; return dir==='asc'?an-bn:bn-an; });
    const money0=v=>Number.isFinite(v)?new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(v):'—';
    const money2=v=>Number.isFinite(v)?new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR',maximumFractionDigits:2}).format(v):'—';
    const pct=v=>Number.isFinite(v)?`${v>=0?'+':''}${v.toFixed(2)}%`:'—';
    const rowsHtml=items.map(x=>`<button class="portfolio-position-row" data-position-ticker="${escapeHtml(x.ticker)}">
      <span class="pp-symbol"><b>${escapeHtml(x.ticker)}</b><small>${escapeHtml(x.row?.name||'Sem análise')}</small></span>
      <span><small>Qtd.</small><b>${x.qty==null?'—':new Intl.NumberFormat('pt-PT',{maximumFractionDigits:4}).format(x.qty)}</b></span>
      <span><small>Investido</small><b>${money0(x.basis)}</b></span>
      <span><small>Atual</small><b>${money0(x.current)}</b></span>
      <span class="${x.pnl==null?'':x.pnl>=0?'is-positive':'is-negative'}"><small>P/L</small><b>${x.pnl==null?'—':`${x.pnl>=0?'+':''}${money0(x.pnl)}`}</b><em>${pct(x.pnlPct)}</em></span>
      <span><small>Peso</small><b>${x.weight==null?'—':x.weight.toFixed(2)+'%'}</b></span>
      <span><small>Score</small><b>${x.row?.score==null?'—':Number(x.row.score).toFixed(0)}</b></span>
    </button>`).join('');
    els.portfolioPositionsTable.innerHTML=`
      <section class="portfolio-positions-ledger">
        <div class="section-heading"><div><span class="eyebrow">POSITIONS LEDGER</span><h3>Posições, capital e rentabilidade</h3></div><span class="section-count">${items.length} posições</span></div>
        <div class="portfolio-ledger-controls">
          <div class="portfolio-search-wrap"><input id="portfolio-table-query" type="search" placeholder="Pesquisar posição…" autocomplete="off" spellcheck="false" value="${escapeHtml(state.portfolioTableQuery||'')}"><div class="portfolio-search-suggestions" role="listbox" hidden></div></div>
          <select id="portfolio-table-sort">
            ${[['value-desc','Valor atual ↓'],['weight-desc','Peso ↓'],['pnl-desc','P/L € ↓'],['return-desc','Rentabilidade ↓'],['basis-desc','Capital investido ↓'],['score-desc','Score ↓'],['ticker-asc','Ticker A–Z']].map(([v,l])=>`<option value="${v}" ${state.portfolioTableSort===v?'selected':''}>${l}</option>`).join('')}
          </select>
        </div>
        <div class="portfolio-ledger-summary">
          <div><span>Capital investido coberto</span><strong>${money0(perf.basis)}</strong></div>
          <div><span>Valor atual coberto</span><strong>${money0(perf.current)}</strong></div>
          <div class="${perf.pnl>=0?'is-positive':'is-negative'}"><span>P/L não realizado</span><strong>${perf.pnl>=0?'+':''}${money0(perf.pnl)}</strong><small>${pct(perf.pnlPct)}</small></div>
        </div>
        <div class="portfolio-position-list">${rowsHtml || '<p class="empty-state">Sem posições para este filtro.</p>'}</div>
        <p class="fund-method-note">Capital investido usa o custo médio remanescente reconstruído pelo ledger. Quando existe FX histórico, cada transação é convertida para EUR à taxa da respetiva data; posições sem preço atual continuam listadas mas não entram no valor total.</p>
      </section>`;
    const input=els.portfolioPositionsTable.querySelector('#portfolio-table-query');
    const suggestions=els.portfolioPositionsTable.querySelector('.portfolio-search-suggestions');
    const updateSuggestions=()=>{
      if(!input || !suggestions) return;
      const q=input.value.trim().toUpperCase();
      if(!q){ suggestions.hidden=true; suggestions.innerHTML=''; return; }
      const matches=items.filter(x => `${x.symbol} ${x.name||''}`.toUpperCase().includes(q)).slice(0,7);
      suggestions.innerHTML=matches.map(x=>`<button type="button" role="option" data-portfolio-suggest="${escapeHtml(x.symbol)}"><strong>${escapeHtml(x.symbol)}</strong><span>${escapeHtml(x.name||'')}</span></button>`).join('');
      suggestions.hidden=!matches.length;
      suggestions.querySelectorAll('[data-portfolio-suggest]').forEach(btn=>btn.addEventListener('mousedown',e=>e.preventDefault()));
      suggestions.querySelectorAll('[data-portfolio-suggest]').forEach(btn=>btn.addEventListener('click',()=>{
        state.portfolioTableQuery=btn.dataset.portfolioSuggest;
        renderPortfolioPositionsTable(portfolio,rows);
        requestAnimationFrame(()=>els.portfolioPositionsTable.querySelector('#portfolio-table-query')?.focus());
      }));
    };
    let portfolioSearchTimer;
    input?.addEventListener('input',e=>{
      state.portfolioTableQuery=e.target.value;
      updateSuggestions();
      clearTimeout(portfolioSearchTimer);
      portfolioSearchTimer=setTimeout(()=>{
        const caret=e.target.selectionStart ?? e.target.value.length;
        renderPortfolioPositionsTable(portfolio,rows);
        requestAnimationFrame(()=>{
          const next=els.portfolioPositionsTable.querySelector('#portfolio-table-query');
          if(next){ next.focus({preventScroll:true}); const n=Math.min(caret,next.value.length); next.setSelectionRange(n,n); }
        });
      },180);
    });
    input?.addEventListener('focus',updateSuggestions);
    input?.addEventListener('keydown',e=>{
      if((e.key==='Enter'||e.key==='Tab') && suggestions && !suggestions.hidden){
        const first=suggestions.querySelector('[data-portfolio-suggest]');
        if(first){ e.preventDefault(); state.portfolioTableQuery=first.dataset.portfolioSuggest; renderPortfolioPositionsTable(portfolio,rows); requestAnimationFrame(()=>els.portfolioPositionsTable.querySelector('#portfolio-table-query')?.focus()); }
      }
      if(e.key==='Escape' && suggestions) suggestions.hidden=true;
    });
    input?.addEventListener('blur',()=>setTimeout(()=>{if(suggestions) suggestions.hidden=true},120));
    els.portfolioPositionsTable.querySelector('#portfolio-table-sort')?.addEventListener('change',e=>{state.portfolioTableSort=e.target.value; renderPortfolioPositionsTable(portfolio,rows);});
    els.portfolioPositionsTable.querySelectorAll('[data-position-ticker]').forEach(btn=>btn.addEventListener('click',()=>{ const t=btn.dataset.positionTicker; if(byTicker[t]) openDetail(t); }));
  }

  function portfolioFilterMatches(r, filter) {
    if (filter === "all") return true;
    if (filter === "growth") return r.quote_type !== "ETF" && Number(r.growth_pct ?? -1) >= 65;
    if (filter === "quality") return r.quote_type !== "ETF" && Number(r.quality_pct ?? r.profitability_pct ?? -1) >= 70;
    if (filter === "value") return r.quote_type !== "ETF" && Number(r.value_pct ?? -1) >= 65;
    if (filter === "zombie") return r.quote_type !== "ETF" && r.zombie === "yes";
    if (filter === "stocks") return r.quote_type !== "ETF";
    if (filter === "etf") return r.quote_type === "ETF";
    if (filter === "thesis-up") return r.quote_type !== "ETF" && r.thesis_direction === "strengthening";
    if (filter === "thesis-down") return r.quote_type !== "ETF" && r.thesis_direction === "weakening";
    if (filter === "thesis-changed") return r.quote_type !== "ETF" && r.thesis_direction === "changed";
    return true;
  }

  function portfolioFilterCounts(rows) {
    const filters = ["all","stocks","growth","quality","value","zombie","etf","thesis-up","thesis-down","thesis-changed"];
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
      ["all","Todos"], ["stocks","Ações"], ["growth","Growth"], ["quality","Quality"], ["value","Value"], ["zombie","Zombies"],
      ["etf","ETFs"], ["thesis-up","Tese ↑"], ["thesis-down","Tese ↓"], ["thesis-changed","Mudou"]
    ];
    els.portfolioFilters.innerHTML = defs.map(([id,label]) => `<button class="portfolio-filter-chip ${state.portfolioFilter===id?"is-active":""}" data-filter="${id}">${label}<span>${c[id]}</span></button>`).join("");
    els.portfolioFilters.querySelectorAll("[data-filter]").forEach(btn => btn.addEventListener("click", () => {
      state.portfolioFilter = btn.dataset.filter;
      renderPortfolio();
    }));
  }

  function normalizeSectorWeights(row) {
    const raw = row?.fund_sector_weightings || row?.fund_sector_weights || row?.sector_weightings || null;
    if (!raw) return [];
    const out = [];
    if (Array.isArray(raw)) {
      for (const item of raw) {
        if (!item) continue;
        const label = item.sector || item.name || item.label;
        let weight = Number(item.weight ?? item.value ?? item.percent ?? item.pct);
        if (!label || !Number.isFinite(weight)) continue;
        if (weight > 1.0001) weight /= 100;
        if (weight > 0) out.push([String(label), weight]);
      }
    } else if (typeof raw === 'object') {
      for (const [label, value] of Object.entries(raw)) {
        let weight = Number(value);
        if (!Number.isFinite(weight)) continue;
        if (weight > 1.0001) weight /= 100;
        if (weight > 0) out.push([String(label), weight]);
      }
    }
    return out;
  }

  function portfolioThemeTags(row) {
    const text = `${row?.ticker||''} ${row?.name||''} ${row?.sector||''} ${row?.industry||''} ${row?.fund_theme||''}`.toLowerCase();
    const tags = new Set();
    if (AI_EXPOSED_TICKERS.has(row?.ticker) || Number(row?.ai_exposure_pct||0) >= 20 || /artificial intelligence|\bai\b|semiconductor|chip|gpu|data center|cloud|software/.test(text)) tags.add('AI / Digital');
    if (/semiconductor|chip|gpu/.test(text)) tags.add('Semiconductors');
    if (/defen[cs]e|aerospace|military/.test(text)) tags.add('Defence / Aerospace');
    if (/energy|oil|gas|petroleum|uranium|nuclear/.test(text)) tags.add('Energy');
    if (/gold|silver|mining|miner|precious metal|basic materials/.test(text)) tags.add('Metals / Mining');
    if (/health|pharma|biotech|medical/.test(text)) tags.add('Healthcare');
    if (/bank|financial|insurance|asset management|capital markets/.test(text)) tags.add('Financials');
    if (/real estate|reit/.test(text)) tags.add('Real Estate');
    if (/consumer|retail|restaurant|automotive|luxury/.test(text)) tags.add('Consumer');
    return [...tags];
  }

  function concentrationRiskLabel(pct, moderate, high) {
    if (pct == null) return {label:'Sem dados', cls:'neutral'};
    if (pct >= high) return {label:'Elevada', cls:'risk-high'};
    if (pct >= moderate) return {label:'Moderada', cls:'risk-mid'};
    return {label:'Dispersa', cls:'risk-low'};
  }

  function concentrationListHtml(title, eyebrow, entries, total, thresholds=[25,40], note='') {
    if (!entries.length || !(total>0)) return '';
    const max = entries[0][1] || 1;
    const rows = entries.slice(0,6).map(([label,value])=>{
      const pct=value/total*100;
      const risk=concentrationRiskLabel(pct, thresholds[0], thresholds[1]);
      return `<div class="risk-breakdown-row"><span><b>${escapeHtml(label)}</b><small>${risk.label}</small></span><span class="risk-mini-track"><i class="${risk.cls}" style="width:${Math.min(100,value/max*100).toFixed(1)}%"></i></span><strong>${pct.toFixed(1)}%</strong></div>`;
    }).join('');
    return `<article class="risk-dimension"><span class="eyebrow">${escapeHtml(eyebrow)}</span><h4>${escapeHtml(title)}</h4>${rows}${note?`<p class="risk-note">${escapeHtml(note)}</p>`:''}</article>`;
  }


  function buildPortfolioRiskMap(valued, total) {
    const intersections = new Map();
    const add = (a,b,value,kind='exact') => {
      if (!a || !b || !(value>0)) return;
      const key = `${a}|||${b}`;
      const prev = intersections.get(key) || {a,b,value:0,kind};
      prev.value += value;
      if (prev.kind !== kind) prev.kind = 'mixed';
      intersections.set(key,prev);
    };

    for (const x of valued) {
      const row=x.row;
      const isEtf=row.quote_type === 'ETF';
      const region=regionLabel(row.region || (isEtf ? 'Global / ETF' : 'Unknown'));
      const themes=portfolioThemeTags(row);
      if (!isEtf) {
        const sector=row.sector || 'Sem setor';
        add(region,sector,x.eur,'exact');
        themes.forEach(t=>add(region,t,x.eur,'exact'));
        themes.forEach(t=>add(sector,t,x.eur,'exact'));
      } else {
        const sw=normalizeSectorWeights(row);
        if (sw.length) {
          for (const [sector,w] of sw) {
            const safe=Math.max(0,Math.min(1,w));
            add(region,sector,x.eur*safe,'estimated');
            themes.forEach(t=>add(sector,t,x.eur*safe,'estimated'));
          }
        }
        const ai=Number(row.ai_exposure_pct);
        if (Number.isFinite(ai) && ai>0) add(region,'AI / Digital',x.eur*Math.min(1,ai/100),'estimated');
      }
    }

    const ranked=[...intersections.values()].map(x=>({...x,pct:total?x.value/total*100:0})).filter(x=>x.pct>=2).sort((a,b)=>b.value-a.value);
    const top=ranked.slice(0,10);
    const maxPct=top.length ? top[0].pct : 1;
    const score = top.length ? Math.min(100, top.slice(0,5).reduce((s,x,i)=>s+x.pct*(1.5-i*0.12),0)) : null;
    const label = score==null ? 'Sem dados' : score>=65 ? 'Interdependência elevada' : score>=38 ? 'Interdependência moderada' : 'Interdependência dispersa';
    const cls = score==null ? 'neutral' : score>=65 ? 'risk-high' : score>=38 ? 'risk-mid' : 'risk-low';
    return {ranked,top,maxPct,score,label,cls};
  }

  function portfolioRiskMapHtml(valued,total) {
    const m=buildPortfolioRiskMap(valued,total);
    if (!m.top.length) return '';
    const cards=m.top.slice(0,6).map((x,i)=>{
      const exact=x.kind==='exact';
      return `<article class="risk-map-card ${i===0?'is-primary':''}">
        <div class="risk-map-card-head"><span>${i+1}</span><small>${exact?'observado':'proxy look-through'}</small></div>
        <h5>${escapeHtml(x.a)} <b>×</b> ${escapeHtml(x.b)}</h5>
        <strong>${x.pct.toFixed(1)}%</strong>
        <div class="risk-map-track"><i style="width:${Math.min(100,x.pct/m.maxPct*100).toFixed(1)}%"></i></div>
        <p>${exact?'Exposição diretamente observável nas posições.':'Estimativa conservadora a partir dos pesos/metadata disponíveis dos ETFs.'}</p>
      </article>`;
    }).join('');
    const list=m.top.slice(0,10).map(x=>`<div class="risk-map-list-row"><span><b>${escapeHtml(x.a)}</b><em>×</em>${escapeHtml(x.b)}</span><strong>${x.pct.toFixed(1)}%</strong></div>`).join('');
    return `<section class="portfolio-risk-map">
      <div class="risk-map-hero"><div><span class="eyebrow">PORTFOLIO RISK MAP</span><h4>Riscos que se cruzam</h4><p>Mostra concentrações simultâneas — por exemplo EUA × Tecnologia ou Tecnologia × AI — que podem ficar escondidas quando cada dimensão é analisada isoladamente.</p></div><div class="risk-map-score ${m.cls}"><strong>${m.score==null?'—':Math.round(m.score)}</strong><span>/100</span><small>${m.label}</small></div></div>
      <div class="risk-map-scroll">${cards}</div>
      <details class="risk-map-details"><summary>Ver cruzamentos principais</summary>${list}</details>
      <p class="risk-map-method">Ações diretas usam setor/geografia observados. Nos ETFs, cruzamentos setoriais usam os pesos disponibilizados pela fonte e a região do fundo como proxy; não representam necessariamente a geografia de cada holding.</p>
    </section>`;
  }

  function portfolioDataReadiness(portfolio, rows) {
    const ownedTickers = Object.keys(portfolio || {});
    const byTicker = new Set((state.data?.stocks || []).map(r => r.ticker));
    const matched = ownedTickers.filter(t => byTicker.has(t));
    const etfs = rows.filter(r => r.quote_type === "ETF");
    const etfsWithHoldings = etfs.filter(r => fundHoldingsMap(r).size > 0).length;
    const etfsWithFees = etfs.filter(r => Number.isFinite(Number(r.expense_ratio))).length;
    const fxCount = Object.keys(state.fx?.rates_to_eur || {}).length;
    const schema = Number(state.data?.schema_version || 0);
    const generated = state.data?.generated_at ? new Date(state.data.generated_at) : null;
    const ageHours = generated && !Number.isNaN(generated.getTime()) ? (Date.now() - generated.getTime()) / 36e5 : null;
    const matchedPct = ownedTickers.length ? matched.length / ownedTickers.length * 100 : 100;
    return {
      owned: ownedTickers.length,
      matched: matched.length,
      matchedPct,
      etfs: etfs.length,
      etfsWithHoldings,
      etfsWithFees,
      fxCount,
      schema,
      ageHours,
      holdingsReady: etfs.length === 0 || etfsWithHoldings > 0,
      fxReady: fxCount >= 3,
      schemaReady: schema >= 30,
      coverageReady: matchedPct >= 70,
    };
  }

  function renderPortfolioDataHealth(portfolio, rows) {
    if (!els.portfolioDataHealth) return;
    const h = portfolioDataReadiness(portfolio, rows);
    if (!h.owned) { els.portfolioDataHealth.innerHTML = ''; return; }
    const problems = [];
    if (!h.schemaReady) problems.push('dataset anterior à versão de Portfolio Intelligence');
    if (!h.coverageReady) problems.push(`apenas ${h.matched}/${h.owned} posições têm análise (${h.matchedPct.toFixed(0)}%)`);
    if (h.etfs && !h.holdingsReady) problems.push('holdings dos ETFs ainda não foram recolhidas');
    if (!h.fxReady) problems.push('taxas FX ainda não foram atualizadas');
    if (h.ageHours != null && h.ageHours > 36) problems.push(`stocks.json tem ${Math.floor(h.ageHours)} h`);
    const ok = problems.length === 0;
    els.portfolioDataHealth.innerHTML = `<section class="portfolio-health ${ok ? 'is-ready' : 'is-warning'}">
      <div><span class="eyebrow">DATA READINESS</span><h3>${ok ? 'Portfolio Intelligence ativo' : 'Análise incompleta — dados ainda não acompanharam a interface'}</h3></div>
      <strong>${h.matched}/${h.owned}</strong>
      <p>${ok ? `Cobertura de posições ${h.matchedPct.toFixed(0)}% · ${h.etfsWithHoldings}/${h.etfs} ETFs com holdings · ${h.fxCount} moedas FX.` : escapeHtml(problems.join(' · '))}</p>
      ${!ok ? '<small>As funções de overlap/consolidação não devem concluir “sem sobreposição” enquanto faltarem holdings. Corre o workflow v0.40.0 e confirma que o passo “Validate portfolio coverage” fica verde.</small>' : ''}
    </section>`;
  }


  function portfolioActionLayerHtml({valued,total,exposures,sectorRiskRows,sectorObservedValue,etfs,weightedPortfolio}) {
    if (!valued?.length || !(total>0)) return '';
    const actions=[];
    const money = v => new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(v||0);
    const top=exposures?.[0];
    if (top?.total>0) {
      const w=top.total/total*100;
      if (w>=6) actions.push({kind:'position',priority:w>=10?'high':'mid',title:`${top.symbol} é uma das maiores exposições`,metric:`${w.toFixed(1)}% da carteira`,body:`Inclui ${money(top.direct)} diretamente e ${money(top.indirect)} via ETFs. Uma redução de 25% desta exposição baixaria o peso em cerca de ${(w*.25).toFixed(1)} pp, mantendo o resto da carteira constante.`,ticker:top.symbol,label:'Abrir dossier'});
    }
    if (sectorRiskRows?.length && sectorObservedValue>0) {
      const [sector,val]=sectorRiskRows[0];
      const pct=val/sectorObservedValue*100;
      if (pct>=25) {
        const contrib=valued.map(x=>{
          if (x.row.quote_type!=='ETF') return (x.row.sector||'Sem setor')===sector ? {ticker:x.ticker,eur:x.eur}:null;
          const sw=normalizeSectorWeights(x.row);
          const hit=sw.find(([name])=>name===sector);
          return hit?{ticker:x.ticker,eur:x.eur*Math.max(0,Math.min(1,hit[1]))}:null;
        }).filter(Boolean).sort((a,b)=>b.eur-a.eur).slice(0,3);
        actions.push({kind:'sector',priority:pct>=40?'high':'mid',title:`${sector} domina a exposição setorial`,metric:`${pct.toFixed(1)}% do setor observado`,body:`Maiores contribuintes: ${contrib.map(x=>`${x.ticker} ${total?(x.eur/total*100).toFixed(1):'0.0'}%`).join(' · ') || 'sem detalhe suficiente'}. Rever estes nomes produz maior impacto do que mexer em posições pequenas.`,label:'Ver posições',filterSector:sector});
      }
    }
    const etfHeld=etfs.map(x=>({ticker:x.ticker,row:x.row,eur:x.eur,hmap:fundHoldingsMap(x.row),coverage:[...fundHoldingsMap(x.row).values()].reduce((sum,h)=>sum+Number(h.weight||0),0)}));
    if (etfHeld.length>=2) {
      const {clusters}=buildFundOverlapClusters(etfHeld,.30);
      if (clusters.length) {
        const cm=clusters.map(cluster=>({cluster,c:consolidationCandidate(cluster),value:cluster.reduce((s,x)=>s+(x.eur||0),0)})).filter(x=>x.c?.preferred).sort((a,b)=>b.value-a.value)[0];
        if (cm) {
          const core=cm.c.preferred;
          const others=cm.cluster.filter(x=>x.ticker!==core.ticker);
          const rels=others.map(x=>({ticker:x.ticker,ov:fundOverlap(core.row,x.row)?.value||0})).sort((a,b)=>b.ov-a.ov);
          actions.push({kind:'etf',priority:'mid',title:`${cm.cluster.length} ETFs formam um cluster redundante`,metric:`${total?(cm.value/total*100).toFixed(1):'0.0'}% da carteira`,body:`Candidato a núcleo: ${core.ticker}. Sobreposições observadas: ${rels.slice(0,3).map(x=>`${x.ticker} ${(x.ov*100).toFixed(0)}%`).join(' · ')}. Confirmar índice, UCITS, moeda, distribuição e tracking antes de qualquer alteração.`,label:'Abrir Consolidation Lab'});
        }
      }
    }
    const weakening=valued.filter(x=>x.row.thesis_direction==='weakening').sort((a,b)=>b.eur-a.eur)[0];
    if (weakening) {
      const w=weakening.eur/total*100;
      actions.push({kind:'thesis',priority:w>=5?'mid':'low',title:`Tese a piorar: ${weakening.ticker}`,metric:`${w.toFixed(1)}% da carteira`,body:`Esta é a maior posição, por valor, cuja tese está a enfraquecer. A prioridade aqui é rever o dossier e os drivers da alteração, não inferir automaticamente venda.`,ticker:weakening.ticker,label:'Rever tese'});
    }
    const zombie=valued.filter(x=>String(x.row.zombie).toLowerCase()==='yes').sort((a,b)=>b.eur-a.eur)[0];
    if (zombie) {
      const w=zombie.eur/total*100;
      actions.push({kind:'zombie',priority:w>=3?'high':'mid',title:`Zombie exposure: ${zombie.ticker}`,metric:`${w.toFixed(1)}% da carteira`,body:`O modelo assinala fragilidade de cobertura financeira. Confirma balanço, dívida e capacidade de financiamento antes de manter esta exposição como parte estrutural da carteira.`,ticker:zombie.ticker,label:'Abrir dossier'});
    }
    if (!actions.length) return `<section class="portfolio-action-layer"><div class="section-heading"><div><span class="eyebrow">PORTFOLIO ACTION LAYER</span><h4>Prioridades de revisão</h4></div></div><p class="muted">Não encontrei uma prioridade estrutural forte nos dados atualmente observáveis.</p></section>`;
    const rank={high:0,mid:1,low:2};
    actions.sort((a,b)=>rank[a.priority]-rank[b.priority]).splice(5);
    return `<section class="portfolio-action-layer"><div class="action-layer-head"><div><span class="eyebrow">PORTFOLIO ACTION LAYER</span><h4>Onde uma revisão tem maior impacto</h4><p>Prioriza investigação por contribuição real para concentração, redundância ou deterioração. Não é uma lista automática de compras/vendas.</p></div><span class="action-layer-count">${actions.length} prioridades</span></div><div class="action-layer-grid">${actions.map((a,i)=>`<article class="action-card priority-${a.priority}"><div class="action-card-top"><span>${i+1}</span><em>${escapeHtml(a.metric)}</em></div><h5>${escapeHtml(a.title)}</h5><p>${escapeHtml(a.body)}</p><button ${a.ticker?`data-action-ticker="${escapeHtml(a.ticker)}"`:a.kind==='etf'?'data-action-etf-lab':''}>${escapeHtml(a.label)} →</button></article>`).join('')}</div></section>`;
  }


  function portfolioScenarioMetrics(valued, cash = 0) {
    const invested = valued.reduce((s,x)=>s+(x.eur||0),0);
    const total = invested + Math.max(0,cash||0);
    if (!(total>0)) return null;
    const byTicker = [...valued].sort((a,b)=>(b.eur||0)-(a.eur||0));
    const top1 = byTicker[0]?.eur/total*100 || 0;
    const top5 = byTicker.slice(0,5).reduce((s,x)=>s+(x.eur||0),0)/total*100;
    const riskWeight = pred => valued.filter(x=>pred(x.row)).reduce((s,x)=>s+(x.eur||0),0)/total*100;
    const scored=valued.filter(x=>x.row?.score!=null);
    const scoredTotal=scored.reduce((s,x)=>s+(x.eur||0),0);
    const weightedScore=scoredTotal?scored.reduce((s,x)=>s+(x.eur||0)*Number(x.row.score),0)/scoredTotal:null;
    const sectors=new Map();
    for (const x of valued) {
      if (!x.row) continue;
      if (x.row.quote_type==='ETF') {
        for (const [name,w] of normalizeSectorWeights(x.row)) sectors.set(name,(sectors.get(name)||0)+(x.eur||0)*Math.max(0,Math.min(1,w)));
      } else {
        const sec=x.row.sector||'Sem setor';
        sectors.set(sec,(sectors.get(sec)||0)+(x.eur||0));
      }
    }
    const topSector=[...sectors.entries()].sort((a,b)=>b[1]-a[1])[0] || ['—',0];
    const hhi=byTicker.reduce((s,x)=>{const w=(x.eur||0)/total; return s+w*w;},0)*10000;
    return {total,invested,cash,top1,top5,hhi,topSectorName:topSector[0],topSectorPct:topSector[1]/total*100,weightedScore,
      zombiePct:riskWeight(r=>r?.quote_type!=='ETF' && String(r?.zombie).toLowerCase()==='yes'),
      worseningPct:riskWeight(r=>r?.quote_type!=='ETF' && r?.thesis_direction==='weakening'),
      growthPct:riskWeight(r=>r?.quote_type!=='ETF' && Number(r?.growth_pct??-1)>=65),
      qualityPct:riskWeight(r=>r?.quote_type!=='ETF' && Number(r?.quality_pct??r?.profitability_pct??-1)>=70)};
  }

  function renderPortfolioRebalancingLab(portfolio, rows) {
    if (!els.portfolioRebalancingLab) return;
    const byTicker=Object.fromEntries(rows.map(r=>[r.ticker,r]));
    const valued=Object.entries(portfolio).map(([ticker,entry])=>{const row=byTicker[ticker]; const eur=row?positionValue(entry,row,true):null; return {ticker,row,eur};}).filter(x=>x.row && x.eur!=null && x.eur>0);
    if (valued.length<2) { els.portfolioRebalancingLab.innerHTML=''; return; }
    valued.sort((a,b)=>b.eur-a.eur);
    const before=portfolioScenarioMetrics(valued,0);
    const money=new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR',maximumFractionDigits:0});
    const optionHtml=valued.map(x=>`<option value="${escapeHtml(x.ticker)}">${escapeHtml(x.ticker)} · ${money.format(x.eur)}</option>`).join('');
    let ops=[];
    try {
      const draft=JSON.parse(localStorage.getItem(LS_REBALANCE_DRAFT)||'null');
      if (draft?.ops && Array.isArray(draft.ops)) {
        ops=draft.ops.filter(op=>valued.some(x=>x.ticker===op.source) && (op.target==='__cash__' || valued.some(x=>x.ticker===op.target))).slice(0,12);
        localStorage.removeItem(LS_REBALANCE_DRAFT);
      }
    } catch {}

    els.portfolioRebalancingLab.innerHTML=`<section class="rebalance-lab">
      <div class="rebalance-head"><div><span class="eyebrow">PORTFOLIO REBALANCING LAB</span><h4>Constrói um cenário completo</h4><p>Adiciona várias alterações à mesma proposta — reduzir posições, eliminar ETFs redundantes, concentrar num núcleo ou reservar cash — e compara a carteira atual com a proposta antes de mexer em qualquer posição.</p></div><span class="rebalance-badge">what-if</span></div>
      <div class="rebalance-builder">
        <div class="rebalance-controls">
          <label><span>De</span><select data-rebalance-source>${optionHtml}</select></label>
          <label><span>Para</span><select data-rebalance-target><option value="__cash__">Cash / reserva</option>${optionHtml}</select></label>
          <label class="rebalance-range"><span>Percentagem a mover <b data-rebalance-pct>25%</b></span><input data-rebalance-range type="range" min="5" max="100" step="5" value="25"></label>
        </div>
        <div class="rebalance-builder-actions">
          <button class="rebalance-add" data-rebalance-add>+ Adicionar alteração</button>
        </div>
      </div>
      <div class="rebalance-strategies" data-rebalance-strategies></div>
      ${ops.length?`<div class="rebalance-import-note"><strong>Cenário importado do ETF Consolidation Lab</strong><span>${ops.length} alterações prontas para rever antes de simular.</span></div>`:''}
      <div class="rebalance-plan" data-rebalance-plan></div>
      <div class="rebalance-scenario" data-rebalance-result></div>
      <p class="detail-note">Modelo estático: mantém preços, FX, holdings dos ETFs e métricas constantes. Alterações são aplicadas sequencialmente e não são guardadas nem executadas. Não inclui impostos, spreads, tracking difference ou custos de transação.</p>
    </section>`;

    const source=els.portfolioRebalancingLab.querySelector('[data-rebalance-source]');
    const target=els.portfolioRebalancingLab.querySelector('[data-rebalance-target]');
    const range=els.portfolioRebalancingLab.querySelector('[data-rebalance-range]');
    const pctLabel=els.portfolioRebalancingLab.querySelector('[data-rebalance-pct]');
    const addBtn=els.portfolioRebalancingLab.querySelector('[data-rebalance-add]');
    const strategies=els.portfolioRebalancingLab.querySelector('[data-rebalance-strategies]');
    const plan=els.portfolioRebalancingLab.querySelector('[data-rebalance-plan]');
    const result=els.portfolioRebalancingLab.querySelector('[data-rebalance-result]');
    const fmt=v=>v==null?'—':`${v.toFixed(1)}%`;
    const delta=(a,b,unit='pp')=>{if(a==null||b==null)return '—'; const d=b-a; return `${d>=0?'+':''}${d.toFixed(1)} ${unit}`;};
    const metricDeltaClass=(beforeVal,afterVal,lowerBetter=false)=>{
      if(beforeVal==null||afterVal==null) return '';
      const d=afterVal-beforeVal;
      if(Math.abs(d)<0.05) return 'is-neutral';
      return (lowerBetter ? d<0 : d>0) ? 'is-better' : 'is-worse';
    };

    const applyOps=()=>{
      const scenario=valued.map(x=>({...x}));
      let cash=0;
      const realized=[];
      for (const op of ops) {
        const s=scenario.find(x=>x.ticker===op.source);
        if (!s || !(s.eur>0)) continue;
        const moved=Math.max(0,s.eur)*(op.pct/100);
        if (!(moved>0)) continue;
        s.eur=Math.max(0,s.eur-moved);
        if(op.target==='__cash__') cash+=moved;
        else {
          const t=scenario.find(x=>x.ticker===op.target);
          if(t) t.eur+=moved; else cash+=moved;
        }
        realized.push({...op,moved});
      }
      return {scenario,cash,realized,after:portfolioScenarioMetrics(scenario,cash)};
    };

    const renderPlan=()=>{
      if(!ops.length){
        plan.innerHTML='<div class="rebalance-empty-plan"><strong>Nenhuma alteração adicionada</strong><span>Cria uma ou várias operações acima para comparar Atual vs Proposta.</span></div>';
        return;
      }
      plan.innerHTML=`<div class="rebalance-plan-head"><div><span class="eyebrow">CENÁRIO PROPOSTO</span><strong>${ops.length} ${ops.length===1?'alteração':'alterações'}</strong></div><button data-rebalance-clear>Limpar cenário</button></div>
        <div class="rebalance-ops">${ops.map((op,i)=>`<div class="rebalance-op"><span class="rebalance-op-index">${i+1}</span><div><strong>${escapeHtml(op.source)} → ${escapeHtml(op.target==='__cash__'?'Cash / reserva':op.target)}</strong><small>${op.pct}% da posição remanescente${op.reason?` · ${escapeHtml(op.reason)}`:' no momento desta operação'}</small></div><button data-rebalance-remove="${i}" aria-label="Remover alteração">×</button></div>`).join('')}</div>`;
      plan.querySelectorAll('[data-rebalance-remove]').forEach(btn=>btn.addEventListener('click',()=>{ops.splice(Number(btn.dataset.rebalanceRemove),1); renderAll();}));
      plan.querySelector('[data-rebalance-clear]')?.addEventListener('click',()=>{ops.splice(0,ops.length);renderAll();});
    };

    const renderResult=()=>{
      const {cash,realized,after}=applyOps();
      if(!after){ result.innerHTML=''; return; }
      const movedTotal=realized.reduce((s,x)=>s+x.moved,0);
      const headline=ops.length ? `${ops.length} ${ops.length===1?'alteração simulada':'alterações simuladas'}` : 'Carteira atual';
      const sectorChanged=before.topSectorName!==after.topSectorName;
      result.innerHTML=`<div class="rebalance-compare-head"><div><span class="eyebrow">ATUAL VS PROPOSTA</span><h5>${headline}</h5></div><div class="rebalance-total-moved"><strong>${money.format(movedTotal)}</strong><span>capital movimentado no cenário</span></div></div>
        <div class="rebalance-comparison-table">
          <div class="rebalance-row rebalance-row-head"><span>Métrica</span><b>Atual</b><b>Proposta</b><em>Δ</em></div>
          <div class="rebalance-row"><span>Maior posição</span><b>${fmt(before.top1)}</b><b>${fmt(after.top1)}</b><em class="${metricDeltaClass(before.top1,after.top1,true)}">${delta(before.top1,after.top1)}</em></div>
          <div class="rebalance-row"><span>Top 5</span><b>${fmt(before.top5)}</b><b>${fmt(after.top5)}</b><em class="${metricDeltaClass(before.top5,after.top5,true)}">${delta(before.top5,after.top5)}</em></div>
          <div class="rebalance-row"><span>HHI</span><b>${before.hhi.toFixed(0)}</b><b>${after.hhi.toFixed(0)}</b><em class="${metricDeltaClass(before.hhi,after.hhi,true)}">${after.hhi-before.hhi>=0?'+':''}${(after.hhi-before.hhi).toFixed(0)}</em></div>
          <div class="rebalance-row"><span>Maior setor</span><b>${escapeHtml(before.topSectorName)} · ${fmt(before.topSectorPct)}</b><b>${escapeHtml(after.topSectorName)} · ${fmt(after.topSectorPct)}</b><em class="${metricDeltaClass(before.topSectorPct,after.topSectorPct,true)}">${sectorChanged?'mudou':delta(before.topSectorPct,after.topSectorPct)}</em></div>
          <div class="rebalance-row"><span>Score ponderado</span><b>${before.weightedScore==null?'—':before.weightedScore.toFixed(1)}</b><b>${after.weightedScore==null?'—':after.weightedScore.toFixed(1)}</b><em class="${metricDeltaClass(before.weightedScore,after.weightedScore,false)}">${before.weightedScore!=null&&after.weightedScore!=null?(after.weightedScore-before.weightedScore>=0?'+':'')+(after.weightedScore-before.weightedScore).toFixed(1):'—'}</em></div>
          <div class="rebalance-row"><span>Zombie</span><b>${fmt(before.zombiePct)}</b><b>${fmt(after.zombiePct)}</b><em class="${metricDeltaClass(before.zombiePct,after.zombiePct,true)}">${delta(before.zombiePct,after.zombiePct)}</em></div>
          <div class="rebalance-row"><span>Tese ↓</span><b>${fmt(before.worseningPct)}</b><b>${fmt(after.worseningPct)}</b><em class="${metricDeltaClass(before.worseningPct,after.worseningPct,true)}">${delta(before.worseningPct,after.worseningPct)}</em></div>
          <div class="rebalance-row"><span>Growth</span><b>${fmt(before.growthPct)}</b><b>${fmt(after.growthPct)}</b><em class="${metricDeltaClass(before.growthPct,after.growthPct,false)}">${delta(before.growthPct,after.growthPct)}</em></div>
          <div class="rebalance-row"><span>Quality</span><b>${fmt(before.qualityPct)}</b><b>${fmt(after.qualityPct)}</b><em class="${metricDeltaClass(before.qualityPct,after.qualityPct,false)}">${delta(before.qualityPct,after.qualityPct)}</em></div>
          <div class="rebalance-row"><span>Cash / reserva</span><b>0.0%</b><b>${fmt(cash/after.total*100)}</b><em>${fmt(cash/after.total*100)}</em></div>
        </div>
        ${ops.length?`<div class="rebalance-verdict ${after.hhi<before.hhi?'is-positive':''}"><strong>${after.hhi<before.hhi?'Estrutura menos concentrada no cenário':'Compara os trade-offs'}</strong><p>${after.hhi<before.hhi?`O HHI baixa ${Math.abs(after.hhi-before.hhi).toFixed(0)} pontos e o Top 5 passa de ${fmt(before.top5)} para ${fmt(after.top5)}.`:`A concentração não melhora globalmente. Observa se a proposta compensa por qualidade, tese, custo ou simplificação.`} ${cash>0?`${fmt(cash/after.total*100)} fica em cash/reserva.`:''}</p></div>`:''}`;
    };


    const buildAutoScenario=(kind='simplify')=>{
      const generated=[];
      const usedSources=new Set();
      const total=valued.reduce((sum,x)=>sum+(x.eur||0),0);

      const add=(source,target,pct,reason)=>{
        if(!source || !target || source===target || usedSources.has(source)) return;
        generated.push({source,target,pct,reason});
        usedSources.add(source);
      };

      const etfHeld=valued.filter(x=>x.row?.quote_type==='ETF').map(x=>({...x,hmap:fundHoldingsMap(x.row)}));
      const simplification=etfHeld.length>=2 ? portfolioSimplificationModel(etfHeld,etfHeld.reduce((sum,x)=>sum+(x.eur||0),0)) : null;

      if(kind==='simplify'){
        for(const r of simplification?.review||[]){
          if(!r?.ticker || !r?.core || r.ticker===r.core) continue;
          add(r.ticker,r.core,100,`ETF redundante · overlap ${Number.isFinite(r.overlap)?(r.overlap*100).toFixed(0)+'%':'observado'}`);
        }
        const largest=valued.find(x=>!usedSources.has(x.ticker));
        if(largest && total>0 && largest.eur/total>=0.10) add(largest.ticker,'__cash__',25,`Concentração ${(largest.eur/total*100).toFixed(1)}%`);
      }

      if(kind==='risk'){
        // First reduce the largest structural concentration.
        const largest=valued[0];
        if(largest && total>0 && largest.eur/total>=0.08) add(largest.ticker,'__cash__',30,`Maior posição · ${(largest.eur/total*100).toFixed(1)}% da carteira`);
        // Then reduce material zombie / weakening positions, prioritising capital at risk.
        const riskCandidates=valued.filter(x=>{
          if(usedSources.has(x.ticker) || x.row?.quote_type==='ETF') return false;
          const worsening=x.row?.thesis_direction==='weakening';
          const zombie=String(x.row?.zombie).toLowerCase()==='yes';
          return (worsening||zombie) && total>0 && x.eur/total>=0.01;
        }).sort((a,b)=>b.eur-a.eur).slice(0,4);
        for(const x of riskCandidates){
          const zombie=String(x.row?.zombie).toLowerCase()==='yes';
          add(x.ticker,'__cash__',zombie?50:30,zombie?'Zombie · reduzir exposição no cenário':'Tese a piorar · reduzir exposição no cenário');
        }
      }

      if(kind==='quality'){
        // Select an existing high-quality holding as a modelling anchor; never invent a new security.
        const anchors=valued.filter(x=>x.row?.quote_type!=='ETF' && String(x.row?.zombie).toLowerCase()!=='yes' && x.row?.thesis_direction!=='weakening')
          .map(x=>({...x,q:Number(x.row?.quality_pct??x.row?.profitability_pct??-1),score:Number(x.row?.score??-1)}))
          .filter(x=>x.q>=70 && x.score>=60)
          .sort((a,b)=>(b.q+b.score*.35)-(a.q+a.score*.35));
        const anchor=anchors[0];
        if(anchor){
          const low=valued.filter(x=>x.ticker!==anchor.ticker && x.row?.quote_type!=='ETF' && total>0 && x.eur/total>=0.01)
            .map(x=>({...x,q:Number(x.row?.quality_pct??x.row?.profitability_pct??-1),score:Number(x.row?.score??-1)}))
            .filter(x=>x.q>=0 && (x.q<55 || String(x.row?.zombie).toLowerCase()==='yes' || x.row?.thesis_direction==='weakening'))
            .sort((a,b)=>a.q-b.q || b.eur-a.eur).slice(0,4);
          for(const x of low) add(x.ticker,anchor.ticker,25,`Qualidade ${x.q.toFixed(0)} → núcleo ${anchor.ticker} · qualidade ${anchor.q.toFixed(0)}`);
        }
        // Consolidate obvious ETF redundancy as a separate quality-preserving simplification.
        for(const r of (simplification?.review||[]).slice(0,3)){
          if(!r?.ticker || !r?.core || r.ticker===r.core) continue;
          add(r.ticker,r.core,100,`Consolidar ETF · overlap ${Number.isFinite(r.overlap)?(r.overlap*100).toFixed(0)+'%':'observado'}`);
        }
      }
      return generated;
    };

    const metricsForOps=(candidateOps)=>{
      const original=ops.splice(0,ops.length,...candidateOps);
      const out=applyOps();
      ops.splice(0,ops.length,...original);
      return out;
    };

    const strategyDefs=[
      {id:'simplify',title:'Simplificar',desc:'Consolidar ETFs redundantes e reduzir concentração estrutural.',accent:'simplify'},
      {id:'risk',title:'Reduzir risco',desc:'Reduzir maiores concentrações, zombies e teses em deterioração.',accent:'risk'},
      {id:'quality',title:'Maximizar qualidade',desc:'Modelar rotação parcial para holdings de qualidade já existentes.',accent:'quality'}
    ];

    const renderStrategies=()=>{
      const cards=strategyDefs.map(def=>{
        const cand=buildAutoScenario(def.id);
        if(!cand.length) return `<article class="strategy-card strategy-${def.accent} is-unavailable"><span class="eyebrow">${escapeHtml(def.title)}</span><strong>Sem cenário defensável</strong><p>${escapeHtml(def.desc)}</p><small>Os dados/limiares atuais não justificam alterações automáticas.</small></article>`;
        const {after,cash}=metricsForOps(cand);
        const hhiDelta=after?after.hhi-before.hhi:0;
        const qualityDelta=after?.qualityPct!=null?after.qualityPct-before.qualityPct:0;
        const riskDelta=after?.zombiePct!=null?after.zombiePct-before.zombiePct:0;
        return `<button class="strategy-card strategy-${def.accent}" data-strategy="${def.id}"><span class="eyebrow">${escapeHtml(def.title)}</span><strong>${cand.length} alterações</strong><p>${escapeHtml(def.desc)}</p><div class="strategy-kpis"><span>HHI <b>${hhiDelta>=0?'+':''}${hhiDelta.toFixed(0)}</b></span><span>Quality <b>${qualityDelta>=0?'+':''}${qualityDelta.toFixed(1)} pp</b></span><span>Zombie <b>${riskDelta>=0?'+':''}${riskDelta.toFixed(1)} pp</b></span>${cash>0&&after?`<span>Cash <b>${(cash/after.total*100).toFixed(1)}%</b></span>`:''}</div><em>Carregar cenário →</em></button>`;
      }).join('');
      strategies.innerHTML=`<div class="strategy-head"><div><span class="eyebrow">CENÁRIOS AUTOMÁTICOS</span><h5>Três formas de reorganizar a mesma carteira</h5></div><small>Modelos what-if · editáveis</small></div><div class="strategy-scroll">${cards}</div>`;
      strategies.querySelectorAll('[data-strategy]').forEach(btn=>btn.addEventListener('click',()=>{
        const generated=buildAutoScenario(btn.dataset.strategy);
        ops.splice(0,ops.length,...generated);
        renderAll();
        plan.scrollIntoView({behavior:'smooth',block:'nearest'});
      }));
    };

    const renderAll=()=>{renderPlan();renderResult();};
    range.addEventListener('input',()=>{pctLabel.textContent=`${range.value}%`;});
    source.addEventListener('change',()=>{if(target.value===source.value) target.value='__cash__';});
    addBtn.addEventListener('click',()=>{
      const src=source.value;
      let dst=target.value;
      if(dst===src) dst='__cash__';
      const pct=Number(range.value);
      if(!src || !(pct>0)) return;
      ops.push({source:src,target:dst,pct});
      renderAll();
    });
    renderStrategies();
    renderAll();
  }

  function renderPortfolioStructureIntel(portfolio, rows) {
    if (!els.portfolioStructureIntel) return;
    const byTicker = Object.fromEntries(rows.map(r => [r.ticker, r]));
    const valued = Object.entries(portfolio).map(([ticker, entry]) => {
      const row = byTicker[ticker];
      if (!row) return null;
      const eur = positionValue(entry, row, true);
      return Number.isFinite(eur) && eur > 0 ? { ticker, entry, row, eur } : null;
    }).filter(Boolean);

    if (!valued.length) {
      els.portfolioStructureIntel.innerHTML = '';
      return;
    }

    const total = valued.reduce((s,x)=>s+x.eur,0);
    const direct = valued.filter(x=>x.row.quote_type !== 'ETF');
    const etfs = valued.filter(x=>x.row.quote_type === 'ETF');
    const directValue = direct.reduce((s,x)=>s+x.eur,0);
    const etfValue = etfs.reduce((s,x)=>s+x.eur,0);

    const economic = new Map();
    const upsert = (symbol, name) => {
      const key = String(symbol || '').toUpperCase();
      if (!key) return null;
      if (!economic.has(key)) economic.set(key,{symbol:key,name:name||key,direct:0,indirect:0,funds:new Set()});
      return economic.get(key);
    };

    // Direct equities are fully observed economic exposures.
    for (const x of direct) {
      const e=upsert(x.ticker,x.row.name||x.ticker);
      if (e) e.direct += x.eur;
    }

    // ETFs are decomposed only through holdings actually returned by the source.
    let observedEtfValue=0;
    let etfsWithHoldings=0;
    for (const x of etfs) {
      const hmap=fundHoldingsMap(x.row);
      if (!hmap.size) continue;
      etfsWithHoldings++;
      let coverage=0;
      for (const h of hmap.values()) {
        const weight=Number(h.weight)||0;
        if (!(weight>0)) continue;
        coverage += weight;
        const e=upsert(h.symbol,h.name||h.symbol);
        if (!e) continue;
        e.indirect += x.eur*weight;
        e.funds.add(x.ticker);
      }
      observedEtfValue += x.eur*Math.min(1,coverage);
    }

    const knownEconomicValue=directValue+observedEtfValue;
    const coverage=total ? knownEconomicValue/total : null;
    const exposures=[...economic.values()].map(x=>({...x,total:x.direct+x.indirect})).sort((a,b)=>b.total-a.total);
    const top10=exposures.slice(0,10);
    const top10Pct=total ? top10.reduce((s,x)=>s+x.total,0)/total*100 : null;
    const top5Pct=total ? exposures.slice(0,5).reduce((s,x)=>s+x.total,0)/total*100 : null;
    const directPlusEtf=exposures.filter(x=>x.direct>0 && x.indirect>0).sort((a,b)=>b.indirect-a.indirect);
    const multiFund=exposures.filter(x=>x.funds.size>=2).sort((a,b)=>b.indirect-a.indirect);
    const hiddenTopUp=directPlusEtf.reduce((s,x)=>s+x.indirect,0);
    const hiddenTopUpPct=total ? hiddenTopUp/total*100 : null;

    // Effective number is calculated only on the observed economic layer.
    const hhiBase=knownEconomicValue>0 ? exposures.reduce((s,x)=>s+Math.pow(x.total/knownEconomicValue,2),0) : null;
    const effectiveNames=hhiBase ? 1/hhiBase : null;
    const hhi=hhiBase ? hhiBase*10000 : null;
    const concentrationLabel = hhi==null ? '—' : hhi>=1800 ? 'Elevada' : hhi>=1000 ? 'Moderada' : 'Dispersa';


    // Concentration & Risk Intelligence. We deliberately distinguish trading
    // currency from true underlying FX exposure and only look through ETFs
    // where the source exposes sector weights/holdings.
    const bySectorRisk = new Map();
    const byRegionRisk = new Map();
    const byCurrencyRisk = new Map();
    const byThemeRisk = new Map();
    const addRisk = (map,key,value) => {
      if (!key || !(value>0)) return;
      map.set(key,(map.get(key)||0)+value);
    };
    let sectorObservedValue=0;
    for (const x of direct) {
      addRisk(bySectorRisk,x.row.sector || 'Sem setor',x.eur);
      addRisk(byRegionRisk,regionLabel(x.row.region || 'Unknown'),x.eur);
      addRisk(byCurrencyRisk,String(x.row.currency || x.entry?.sourceCurrency || '—').toUpperCase(),x.eur);
      portfolioThemeTags(x.row).forEach(tag=>addRisk(byThemeRisk,tag,x.eur));
      sectorObservedValue += x.eur;
    }
    for (const x of etfs) {
      addRisk(byRegionRisk,regionLabel(x.row.region || 'Global / ETF'),x.eur);
      addRisk(byCurrencyRisk,String(x.row.currency || x.entry?.sourceCurrency || '—').toUpperCase(),x.eur);
      const sectorWeights=normalizeSectorWeights(x.row);
      if (sectorWeights.length) {
        let cov=0;
        for (const [sector,w] of sectorWeights) {
          const safe=Math.max(0,Math.min(1,w));
          addRisk(bySectorRisk,sector,x.eur*safe); cov+=safe;
        }
        sectorObservedValue += x.eur*Math.min(1,cov);
      }
      const ai=Number(x.row.ai_exposure_pct);
      if (Number.isFinite(ai) && ai>0) addRisk(byThemeRisk,'AI / Digital',x.eur*Math.min(1,ai/100));
      const ft=String(x.row.fund_theme||'').trim();
      if (ft && ft.toLowerCase()!=='all') addRisk(byThemeRisk,ft,x.eur);
    }
    const sortRisk = map => [...map.entries()].sort((a,b)=>b[1]-a[1]);
    const sectorRiskRows=sortRisk(bySectorRisk);
    const regionRiskRows=sortRisk(byRegionRisk);
    const currencyRiskRows=sortRisk(byCurrencyRisk);
    const themeRiskRows=sortRisk(byThemeRisk);
    const topNamePct=total && exposures.length ? exposures[0].total/total*100 : null;
    const topSectorPct=sectorObservedValue && sectorRiskRows.length ? sectorRiskRows[0][1]/sectorObservedValue*100 : null;
    const topRegionPct=total && regionRiskRows.length ? regionRiskRows[0][1]/total*100 : null;
    const topCurrencyPct=total && currencyRiskRows.length ? currencyRiskRows[0][1]/total*100 : null;
    const topThemePct=total && themeRiskRows.length ? themeRiskRows[0][1]/total*100 : null;
    const riskFlags=[];
    if (topNamePct!=null && topNamePct>=10) riskFlags.push(`maior empresa ${topNamePct.toFixed(1)}%`);
    if (topSectorPct!=null && topSectorPct>=30) riskFlags.push(`setor dominante ${topSectorPct.toFixed(1)}%`);
    if (topRegionPct!=null && topRegionPct>=55) riskFlags.push(`região dominante ${topRegionPct.toFixed(1)}%`);
    if (topThemePct!=null && topThemePct>=20) riskFlags.push(`tema dominante ${topThemePct.toFixed(1)}%`);
    const riskScoreRaw = [
      topNamePct==null?null:Math.min(100,topNamePct*5),
      top5Pct==null?null:Math.min(100,Math.max(0,(top5Pct-20)*2)),
      topSectorPct==null?null:Math.min(100,Math.max(0,(topSectorPct-15)*2.3)),
      topRegionPct==null?null:Math.min(100,Math.max(0,(topRegionPct-30)*1.7)),
      topThemePct==null?null:Math.min(100,Math.max(0,(topThemePct-10)*2.2)),
    ].filter(Number.isFinite);
    const concentrationRiskScore=riskScoreRaw.length ? riskScoreRaw.reduce((a,b)=>a+b,0)/riskScoreRaw.length : null;
    const overallRisk=concentrationRiskScore==null ? {label:'Sem dados',cls:'neutral'} : concentrationRiskScore>=65 ? {label:'Concentração elevada',cls:'risk-high'} : concentrationRiskScore>=38 ? {label:'Concentração moderada',cls:'risk-mid'} : {label:'Estrutura dispersa',cls:'risk-low'};

    const money = v => new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(v||0);
    const pct = v => v==null ? '—' : `${v.toFixed(1)}%`;
    const directPct=total ? directValue/total*100 : null;
    const etfPct=total ? etfValue/total*100 : null;
    const weightedPortfolio = portfolioWeightedStats(portfolio,rows);

    const exposureRows=top10.map((x,i)=>{
      const totalPct=total ? x.total/total*100 : 0;
      const directPart=x.total ? x.direct/x.total*100 : 0;
      const indirectPart=x.total ? x.indirect/x.total*100 : 0;
      const source=x.direct>0 && x.indirect>0 ? `direta + ${x.funds.size} ETF${x.funds.size===1?'':'s'}` : x.direct>0 ? 'posição direta' : `${x.funds.size} ETF${x.funds.size===1?'':'s'}`;
      return `<button class="structure-exposure-row" data-structure-ticker="${escapeHtml(x.symbol)}">
        <span class="structure-rank">${i+1}</span>
        <span class="structure-name"><b>${escapeHtml(x.symbol)}</b><small>${escapeHtml(x.name||x.symbol)} · ${source}</small></span>
        <span class="structure-stack" title="Direta ${directPart.toFixed(0)}% · ETFs ${indirectPart.toFixed(0)}%"><i style="width:${Math.min(100,directPart)}%"></i><em style="width:${Math.min(100,indirectPart)}%"></em></span>
        <strong>${totalPct.toFixed(1)}%</strong>
      </button>`;
    }).join('');

    const overlapRows=directPlusEtf.slice(0,6).map(x=>`<button class="hidden-overlap-row" data-structure-ticker="${escapeHtml(x.symbol)}"><span><b>${escapeHtml(x.symbol)}</b><small>${escapeHtml(x.name||x.symbol)} · direta ${money(x.direct)} + ETFs ${money(x.indirect)}</small></span><strong>+${total ? (x.indirect/total*100).toFixed(1) : '0.0'}%</strong></button>`).join('');

    const multiRows=multiFund.slice(0,6).map(x=>`<div class="hidden-overlap-row is-static"><span><b>${escapeHtml(x.symbol)}</b><small>${[...x.funds].slice(0,5).map(escapeHtml).join(' · ')}${x.funds.size>5?' · …':''}</small></span><strong>${x.funds.size} ETFs</strong></div>`).join('');

    const interpretation = (()=>{
      if (coverage!=null && coverage<0.55) return 'A cobertura look-through ainda é limitada; trata a concentração abaixo como um mínimo observável.';
      if (hiddenTopUpPct!=null && hiddenTopUpPct>=10) return 'Há exposição indireta material a empresas que já possuis diretamente. O número de linhas da carteira subestima a concentração económica real.';
      if (top10Pct!=null && top10Pct>=50) return 'As maiores exposições económicas têm peso elevado. Convém analisar risco por empresa, não apenas por ticker ou ETF.';
      return 'A estrutura observada está relativamente distribuída. Mantém atenção aos overlaps entre ETFs e posições diretas.';
    })();

    els.portfolioStructureIntel.innerHTML=`
      <section class="portfolio-structure-panel">
        <div class="section-heading"><div><span class="eyebrow">PORTFOLIO STRUCTURE INTELLIGENCE</span><h3>O que possuis realmente</h3></div><span class="section-count">${valued.length} posições valorizadas</span></div>
        <p class="fund-method-note">Combina ações diretas com o look-through observado dos ETFs. Holdings de ETF incompletas ficam fora do cálculo, por isso a concentração apresentada é conservadora sobre o total da carteira.</p>
        <div class="portfolio-structure-kpis">
          <div><span>Ações diretas</span><strong>${pct(directPct)}</strong><small>${money(directValue)}</small></div>
          <div><span>ETFs</span><strong>${pct(etfPct)}</strong><small>${money(etfValue)}</small></div>
          <div><span>Cobertura económica</span><strong>${coverage==null?'—':(coverage*100).toFixed(1)+'%'}</strong><small>${etfsWithHoldings}/${etfs.length} ETFs com holdings</small></div>
          <div><span>Top 5 económico</span><strong>${pct(top5Pct)}</strong><small>mínimo observado</small></div>
          <div><span>Top 10 económico</span><strong>${pct(top10Pct)}</strong><small>mínimo observado</small></div>
          <div><span>Concentração observada</span><strong>${concentrationLabel}</strong><small>${effectiveNames==null?'—':effectiveNames.toFixed(1)+' posições efetivas'}${hhi==null?'':` · HHI ${hhi.toFixed(0)}`}</small></div>
        </div>
        <div class="portfolio-structure-insight"><strong>${hiddenTopUpPct==null?'—':hiddenTopUpPct.toFixed(1)+'%'}</strong><span>da carteira é exposição ETF observada a empresas que também possuis diretamente.</span><p>${escapeHtml(interpretation)}</p></div>
        <section class="concentration-risk-panel">
          <div class="risk-hero"><div><span class="eyebrow">CONCENTRATION & RISK INTELLIGENCE</span><h4>Onde a carteira está realmente concentrada</h4><p>Mede concentração estrutural, não volatilidade futura. ETF look-through só é usado quando a fonte fornece composição suficiente.</p></div><div class="risk-gauge ${overallRisk.cls}"><strong>${concentrationRiskScore==null?'—':Math.round(concentrationRiskScore)}</strong><span>/100</span><small>${overallRisk.label}</small></div></div>
          ${riskFlags.length ? `<div class="risk-alert"><b>Concentrações a rever</b><span>${escapeHtml(riskFlags.join(' · '))}</span></div>` : `<div class="risk-alert is-calm"><b>Sem concentração extrema detetada</b><span>nos componentes atualmente observáveis.</span></div>`}
          <div class="risk-dimensions-grid">
            ${concentrationListHtml('Setores','SECTOR RISK',sectorRiskRows,sectorObservedValue,[25,40],`Cobertura setorial observada: ${total?((sectorObservedValue/total)*100).toFixed(0):0}% da carteira.`)}
            ${concentrationListHtml('Geografia','GEOGRAPHIC RISK',regionRiskRows,total,[45,65],'Para ETFs sem look-through geográfico, usa a classificação regional disponível do fundo; é uma aproximação.')}
            ${concentrationListHtml('Moeda de negociação','TRADING CURRENCY',currencyRiskRows,total,[45,65],'Não equivale à exposição cambial económica das empresas subjacentes.')}
            ${concentrationListHtml('Temas observados','THEMATIC RISK',themeRiskRows,total,[18,30],'Temas são heurísticos para ações diretas e usam metadados disponíveis dos ETFs.')}
          </div>
          ${portfolioRiskMapHtml(valued,total)}
          <div class="factor-risk-strip">
            <div><span>Growth</span><strong>${weightedPortfolio.growthPct==null?'—':weightedPortfolio.growthPct.toFixed(1)+'%'}</strong></div>
            <div><span>Quality</span><strong>${weightedPortfolio.qualityPct==null?'—':weightedPortfolio.qualityPct.toFixed(1)+'%'}</strong></div>
            <div class="${weightedPortfolio.zombiePct>=5?'risk-high':''}"><span>Zombie</span><strong>${weightedPortfolio.zombiePct==null?'—':weightedPortfolio.zombiePct.toFixed(1)+'%'}</strong></div>
            <div><span>Tese ↑</span><strong>${weightedPortfolio.improvingPct==null?'—':weightedPortfolio.improvingPct.toFixed(1)+'%'}</strong></div>
            <div class="${weightedPortfolio.worseningPct>=10?'risk-mid':''}"><span>Tese ↓</span><strong>${weightedPortfolio.worseningPct==null?'—':weightedPortfolio.worseningPct.toFixed(1)+'%'}</strong></div>
          </div>
        </section>
        ${portfolioActionLayerHtml({valued,total,exposures,sectorRiskRows,sectorObservedValue,etfs,weightedPortfolio})}
        <div class="portfolio-structure-columns">
          <article><span class="eyebrow">ECONOMIC EXPOSURE</span><h4>Maiores exposições reais observadas</h4><div class="structure-exposure-list">${exposureRows || '<p class="muted">Sem dados suficientes.</p>'}</div><div class="structure-legend"><span><i></i>Direta</span><span><em></em>Via ETFs</span></div></article>
          <article><span class="eyebrow">HIDDEN OVERLAP</span><h4>Ação direta + ETFs</h4>${overlapRows || (etfs.length && etfsWithHoldings===0 ? '<p class="muted data-gap">Análise indisponível: nenhum ETF da carteira tem holdings carregadas no dataset atual.</p>' : '<p class="muted">Não detetei sobreposição direta/ETF nas holdings observadas.</p>')}<span class="eyebrow structure-subhead">REPETIDA ENTRE ETFs</span>${multiRows || (etfs.length && etfsWithHoldings===0 ? '<p class="muted data-gap">Aguardando holdings dos ETFs para medir repetições.</p>' : '<p class="muted">Sem holdings repetidas em dois ou mais ETFs observados.</p>')}</article>
        </div>
        ${etfs.length>=2 ? '<button class="portfolio-etf-consolidation-cta structure-lab-cta" data-structure-etf-lab><span><b>ETF Consolidation Lab</b><small>Ver quais fundos criam estas duplicações e qual o melhor candidato a núcleo.</small></span><strong>Abrir →</strong></button>' : ''}
      </section>`;

    els.portfolioStructureIntel.querySelectorAll('[data-action-ticker]').forEach(btn=>btn.addEventListener('click',()=>openDetail(btn.dataset.actionTicker)));
    els.portfolioStructureIntel.querySelector('[data-action-etf-lab]')?.addEventListener('click',()=>{ switchView('funds'); setTimeout(()=>els.fundPortfolioIntel?.scrollIntoView({behavior:'smooth',block:'start'}),80); });
    els.portfolioStructureIntel.querySelectorAll('[data-structure-ticker]').forEach(btn=>btn.addEventListener('click',()=>{
      const ticker=btn.dataset.structureTicker;
      if (byTicker[ticker]) openDetail(ticker);
      else { state.activeView='stocks'; switchView('stocks'); if (els.search) { els.search.value=ticker; els.search.dispatchEvent(new Event('input')); } }
    }));
    els.portfolioStructureIntel.querySelector('[data-structure-etf-lab]')?.addEventListener('click',()=>{ switchView('funds'); setTimeout(()=>els.fundPortfolioIntel?.scrollIntoView({behavior:'smooth',block:'start'}),80); });
  }


  function renderPortfolioOpportunityEngine(portfolio, rows) {
    if (!els.portfolioOpportunityEngine || !state.data?.stocks) return;
    const byTicker=Object.fromEntries(rows.map(r=>[r.ticker,r]));
    const valued=Object.entries(portfolio).map(([ticker,entry])=>{
      const row=byTicker[ticker];
      const eur=row?positionValue(entry,row,true):null;
      return {ticker,row,eur};
    }).filter(x=>x.row && x.eur!=null && x.eur>0);
    const total=valued.reduce((s,x)=>s+x.eur,0);
    if (!(total>0)) { els.portfolioOpportunityEngine.innerHTML=''; return; }

    const sectorWeights=new Map();
    const geographyWeights=new Map();
    const indirectExposure=new Map();
    for (const x of valued) {
      const r=x.row;
      if (r.quote_type==='ETF') {
        for (const [sec,w] of normalizeSectorWeights(r)) sectorWeights.set(sec,(sectorWeights.get(sec)||0)+x.eur*Math.max(0,Math.min(1,w)));
        const region=String(r.fund_region||r.region||r.country||'').trim();
        if (region) geographyWeights.set(region,(geographyWeights.get(region)||0)+x.eur);
        for (const [sym,h] of fundHoldingsMap(r)) indirectExposure.set(sym,(indirectExposure.get(sym)||0)+x.eur*Number(h.weight||0));
      } else {
        const sec=r.sector||'Sem setor';
        sectorWeights.set(sec,(sectorWeights.get(sec)||0)+x.eur);
        const geo=String(r.country||r.region||'').trim();
        if (geo) geographyWeights.set(geo,(geographyWeights.get(geo)||0)+x.eur);
      }
    }
    const held=new Set(Object.keys(portfolio));
    const sectorPct=sec=>(sectorWeights.get(sec)||0)/total*100;
    const geoPct=geo=>(geographyWeights.get(geo)||0)/total*100;
    const isZombie=r=>String(r.zombie||'').toLowerCase()==='yes';
    const candidates=state.data.stocks.filter(r=>r.quote_type!=='ETF' && !isAustralianScannerRow(r) && !held.has(r.ticker) && r.score!=null && !isZombie(r));
    const ranked=candidates.map(r=>{
      const q=Number(r.quality_pct??r.profitability_pct??0), v=Number(r.value_pct??0), g=Number(r.growth_pct??0), score=Number(r.score??0);
      const thesis=r.thesis_direction==='strengthening'?8:r.thesis_direction==='weakening'?-8:0;
      const sec=r.sector||'Sem setor', geo=String(r.country||r.region||'').trim();
      const secNow=sectorPct(sec), geoNow=geo?geoPct(geo):0;
      const diversification=Math.max(0,100-secNow*2.2-geoNow*.55);
      const hiddenPct=(indirectExposure.get(r.ticker)||0)/total*100;
      const hiddenPenalty=Math.min(25,hiddenPct*5);
      const investment=0.34*score+0.25*q+0.20*v+0.13*g+thesis;
      const fit=Math.max(0,Math.min(100,0.72*investment+0.28*diversification-hiddenPenalty));
      const reasons=[];
      if (q>=75) reasons.push(`Quality ${Math.round(q)}`);
      if (v>=65) reasons.push(`Value ${Math.round(v)}`);
      if (g>=65) reasons.push(`Growth ${Math.round(g)}`);
      if (r.thesis_direction==='strengthening') reasons.push('tese ↑');
      if (secNow<10) reasons.push(`${sec} pouco representado`);
      else if (secNow>=25) reasons.push(`${sec} já pesa ${secNow.toFixed(0)}%`);
      if (hiddenPct>=1) reasons.push(`${hiddenPct.toFixed(1)}% já via ETFs`);
      return {r,fit,investment,diversification,secNow,geoNow,hiddenPct,reasons};
    }).filter(x=>x.investment>=55).sort((a,b)=>b.fit-a.fit).slice(0,10);

    const cards=ranked.map(x=>{
      const r=x.r;
      const fitLabel=x.fit>=78?'Excelente encaixe':x.fit>=68?'Bom encaixe':'Encaixe moderado';
      const fitCls=x.fit>=78?'fit-high':x.fit>=68?'fit-mid':'fit-low';
      return `<button class="portfolio-opportunity-card ${fitCls}" data-portfolio-opportunity="${escapeHtml(r.ticker)}">
        <div class="portfolio-opportunity-top"><span><b>${escapeHtml(r.ticker)}</b><small>${escapeHtml(r.name||'')}</small></span><em>${Math.round(x.fit)}<i>/100</i></em></div>
        <strong>${fitLabel}</strong>
        <div class="portfolio-opportunity-axes"><span>Score <b>${Math.round(Number(r.score||0))}</b></span><span>Q <b>${Math.round(Number(r.quality_pct??r.profitability_pct??0))}</b></span><span>V <b>${Math.round(Number(r.value_pct??0))}</b></span><span>G <b>${Math.round(Number(r.growth_pct??0))}</b></span></div>
        <p>${escapeHtml(x.reasons.slice(0,3).join(' · ')||'Boa combinação quantitativa com a estrutura atual da carteira.')}</p>
        <small class="portfolio-opportunity-context">Setor atual ${x.secNow.toFixed(1)}%${x.hiddenPct>=0.5?` · já tens ${x.hiddenPct.toFixed(1)}% via ETFs`:''}</small>
      </button>`;
    }).join('');

    els.portfolioOpportunityEngine.innerHTML=`<section class="portfolio-opportunity-section">
      <div class="section-heading"><div><span class="eyebrow">PORTFOLIO OPPORTUNITY ENGINE</span><h4>Boas empresas que também encaixam na tua carteira</h4><p>Combina qualidade, valor, crescimento e trajetória da tese com concentração setorial/geográfica e exposição que já tens através dos ETFs.</p></div><span class="opportunity-engine-count">${ranked.length}</span></div>
      ${ranked.length?`<div class="portfolio-opportunity-strip">${cards}</div>`:'<p class="muted">Ainda não existem candidatos com dados suficientes e encaixe mínimo para esta análise.</p>'}
      <p class="detail-note">O Portfolio Fit não é uma recomendação de compra. Penaliza candidatos que aumentariam concentrações já elevadas ou que já possuis indiretamente através dos ETFs.</p>
    </section>`;
    els.portfolioOpportunityEngine.querySelectorAll('[data-portfolio-opportunity]').forEach(btn=>btn.addEventListener('click',()=>openDetail(btn.dataset.portfolioOpportunity)));
  }

  function renderPortfolioDecisionCenter(portfolio, rows) {
    if (!els.portfolioDecisionCenter) return;
    const ownedTickers = Object.keys(portfolio || {});
    if (!ownedTickers.length || !rows.length) { els.portfolioDecisionCenter.innerHTML = ""; return; }
    const weighted = portfolioWeightedStats(portfolio, rows);
    const perf = portfolioPerformanceSnapshot(portfolio, rows);
    const equities = rows.filter(r => r.quote_type !== "ETF");
    const etfs = rows.filter(r => r.quote_type === "ETF");
    const valued = Object.entries(portfolio).map(([ticker,entry])=>{
      const r=rows.find(x=>x.ticker===ticker); const eur=r?positionValue(entry,r,true):null;
      return {ticker,r,eur:Number.isFinite(eur)?eur:0};
    }).filter(x=>x.eur>0).sort((a,b)=>b.eur-a.eur);
    const total=valued.reduce((s,x)=>s+x.eur,0);
    const top5Pct=total?valued.slice(0,5).reduce((s,x)=>s+x.eur,0)/total*100:null;
    const coverage=ownedTickers.length ? weighted.count/ownedTickers.length*100 : 0;
    const issues=[];
    if (coverage < 85) issues.push({tone:'warn',title:'Cobertura incompleta',body:`${weighted.count}/${ownedTickers.length} posições valorizadas (${coverage.toFixed(0)}%).`,target:'portfolio-ledger-box',label:'Ver posições'});
    if ((weighted.worseningPct||0) >= 8) issues.push({tone:'bad',title:'Teses em deterioração',body:`${weighted.worseningPct.toFixed(1)}% do valor observado está em teses a piorar.`,target:'portfolio-thesis-box',label:'Rever teses'});
    if ((weighted.zombiePct||0) >= 5) issues.push({tone:'bad',title:'Exposição Zombie',body:`${weighted.zombiePct.toFixed(1)}% do valor observado está classificado como Zombie.`,target:'portfolio-radar-box',label:'Filtrar zombies',filter:'zombie'});
    if (top5Pct != null && top5Pct >= 30) issues.push({tone:'warn',title:'Concentração nas maiores posições',body:`Top 5 representa ${top5Pct.toFixed(1)}% do valor atual observado.`,target:'portfolio-structure-box',label:'Ver risco'});
    if (etfs.length >= 2) issues.push({tone:'info',title:'Consolidação de ETFs',body:`Tens ${etfs.length} ETFs analisados. Verifica redundância, custos e overlap.`,target:'funds',label:'Abrir ETF Lab',funds:true});
    if (perf?.covered?.length && Number.isFinite(perf.pnl)) {
      const sign=perf.pnl>=0?'+':'';
      issues.push({tone:perf.pnl>=0?'good':'warn',title:'P/L coberto',body:`${sign}${new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(perf.pnl)} nas posições com custo-base disponível.`,target:'portfolio-ledger-box',label:'Ver ledger'});
    }
    const top=issues.slice(0,5);
    const headline = top.some(x=>x.tone==='bad') ? 'Há pontos que merecem revisão' : top.length ? 'Prioridades da carteira' : 'Sem prioridade estrutural forte';
    els.portfolioDecisionCenter.innerHTML=`<section class="portfolio-decision-panel">
      <div class="portfolio-decision-head"><div><span class="eyebrow">PORTFOLIO DECISION CENTER</span><h3>${headline}</h3><p>Resume o que merece atenção primeiro. Abre os módulos abaixo apenas quando precisares do detalhe.</p></div><span class="decision-count">${top.length}</span></div>
      ${top.length?`<div class="portfolio-decision-grid">${top.map((x,i)=>`<button class="portfolio-decision-card ${x.tone}" data-decision-target="${x.funds?'funds':x.target}" ${x.filter?`data-decision-filter="${x.filter}"`:''}><span>${i+1}</span><div><b>${escapeHtml(x.title)}</b><p>${escapeHtml(x.body)}</p><em>${escapeHtml(x.label)} →</em></div></button>`).join('')}</div>`:`<p class="muted">Os dados atuais não mostram uma prioridade estrutural clara.</p>`}
    </section>`;
    els.portfolioDecisionCenter.querySelectorAll('[data-decision-target]').forEach(btn=>btn.addEventListener('click',()=>{
      if(btn.dataset.decisionTarget==='funds'){ switchView('funds'); setTimeout(()=>els.fundPortfolioIntel?.scrollIntoView({behavior:'smooth',block:'start'}),80); return; }
      if(btn.dataset.decisionFilter==='zombie'){ state.portfolioFilter='zombie'; renderPortfolioFilterBar(rows); const box=document.getElementById('portfolio-radar-box'); if(box){box.open=true; box.scrollIntoView({behavior:'smooth',block:'start'});} return; }
      const box=document.getElementById(btn.dataset.decisionTarget); if(box){ box.open=true; box.scrollIntoView({behavior:'smooth',block:'start'}); }
    }));
  }

  function renderPortfolio() {
    if (!state.data) return;
    const portfolio = lsGet(LS_PORTFOLIO);
    const ownedTickers = Object.keys(portfolio);
    const rows = state.data.stocks.filter(r => ownedTickers.includes(r.ticker));

    renderPortfolioDataHealth(portfolio, rows);
    renderExposure(portfolio, rows);

    if (!rows.length) {
      if (els.portfolioFilters) els.portfolioFilters.innerHTML = "";
      if (els.portfolioThesisMonitor) els.portfolioThesisMonitor.innerHTML = "";
      els.portfolioSummary.innerHTML = "";
      if (els.portfolioDecisionCenter) els.portfolioDecisionCenter.innerHTML = "";
      if (els.portfolioStructureIntel) els.portfolioStructureIntel.innerHTML = "";
      if (els.portfolioPositionsTable) els.portfolioPositionsTable.innerHTML = "";
      if (els.portfolioOpportunityEngine) els.portfolioOpportunityEngine.innerHTML = "";
      if (els.portfolioRebalancingLab) els.portfolioRebalancingLab.innerHTML = "";
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
        <div class="summary-item portfolio-total-value"><span class="summary-label">valor atual</span><span class="summary-value">${weighted.total > 0 ? new Intl.NumberFormat("pt-PT",{style:"currency",currency:"EUR",maximumFractionDigits:0}).format(weighted.total) : "—"}</span><small>${ownedTickers.length ? `${weighted.count}/${ownedTickers.length} posições valorizadas` : ""}</small></div>
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
      <p class="detail-note">Valor atual = quantidade líquida importada × preço de mercado × taxa FX para EUR. O score ponderado e as exposições usam esse valor económico atual.</p>
      ${etfs.length >= 2 ? `<button class="portfolio-etf-consolidation-cta" data-portfolio-etf-consolidation><span><b>ETF Consolidation Lab</b><small>${etfs.length} ETFs na carteira · analisar overlap, redundância e candidato a núcleo</small></span><strong>Analisar →</strong></button>` : ''}
    `;
    els.portfolioSummary.querySelector('[data-portfolio-etf-consolidation]')?.addEventListener('click',()=>{ switchView('funds'); setTimeout(()=>els.fundPortfolioIntel?.scrollIntoView({behavior:'smooth',block:'start'}),80); });
    renderPortfolioDecisionCenter(portfolio, rows);

    renderPortfolioPositionsTable(portfolio, rows);
    renderPortfolioStructureIntel(portfolio, rows);
    renderPortfolioOpportunityEngine(portfolio, rows);
    renderPortfolioRebalancingLab(portfolio, rows);
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
  let fundCompareOptionsPopulated = false;

  function fundMeta(r) {
    const text = `${r.ticker || ""} ${r.name || ""} ${r.sector || ""}`.toLowerCase();
    const themes = [];
    const add = (label, re) => { if (re.test(text)) themes.push(label); };
    add("AI", /artificial|\bai\b|cloud|innovation/);
    add("Semiconductors", /semiconductor|chip|soxx|smh/);
    add("Defense", /defen[cs]e|aerospace|ita\b/);
    add("Energy", /energy|oil|gas|xle\b/);
    add("Nuclear", /uranium|nuclear|ura\b/);
    add("Gold", /gold|gld\b|miners|precious/);
    add("Cybersecurity", /cyber|hack\b/);
    add("Robotics", /robot|automation|robo\b/);
    add("Clean Energy", /clean energy|solar|tan\b/);

    let style = "Broad";
    if (/bond|treasury|fixed income|aggregate/.test(text)) style = "Bonds";
    else if (/dividend|income|yield/.test(text)) style = "Dividend";
    else if (/small cap|iwm\b/.test(text)) style = "Small Cap";
    else if (/growth|innovation|nasdaq|qqq\b/.test(text)) style = "Growth";

    let geo = r.region || "Global";
    if (["Germany","France","Netherlands","Spain","Italy","Portugal","Switzerland","Sweden","Denmark","Poland","Norway","Finland","Austria","Belgium","Europe"].includes(geo)) geo = "Europe";
    return { themes, style, geo };
  }

  function pctFundWeight(v) {
    if (v == null || !Number.isFinite(Number(v))) return "—";
    const n = Number(v);
    return `${(n <= 1 ? n * 100 : n).toFixed(1)}%`;
  }

  function fundHoldingsMap(r) {
    const out = new Map();
    (Array.isArray(r.top_holdings) ? r.top_holdings : []).forEach(h => {
      if (Array.isArray(h)) {
        const [symbol, weight] = h;
        if (symbol && Number.isFinite(Number(weight))) out.set(String(symbol).toUpperCase(), {symbol:String(symbol), name:String(symbol), weight:Number(weight)});
      } else if (h && h.symbol && Number.isFinite(Number(h.weight))) {
        out.set(String(h.symbol).toUpperCase(), {symbol:String(h.symbol), name:h.name || h.symbol, weight:Number(h.weight)});
      }
    });
    return out;
  }

  function fundOverlap(a, b) {
    const ah = fundHoldingsMap(a), bh = fundHoldingsMap(b);
    if (!ah.size || !bh.size) return null;
    let overlap = 0;
    const shared = [];
    ah.forEach((ha, symbol) => {
      const hb = bh.get(symbol);
      if (!hb) return;
      const w = Math.min(Number(ha.weight), Number(hb.weight));
      overlap += w;
      shared.push({symbol, name:ha.name || hb.name || symbol, weight:w});
    });
    shared.sort((x,y)=>y.weight-x.weight);
    return { value: overlap, shared, coverageA:[...ah.values()].reduce((x,h)=>x+Number(h.weight),0), coverageB:[...bh.values()].reduce((x,h)=>x+Number(h.weight),0) };
  }

  function fundBars(obj, limit=8) {
    const entries = Object.entries(obj || {}).filter(([,v])=>Number.isFinite(Number(v))).sort((a,b)=>Number(b[1])-Number(a[1])).slice(0,limit);
    if (!entries.length) return '<p class="muted">Sem dados estruturados disponíveis.</p>';
    const max = Math.max(...entries.map(([,v])=>Number(v)), .0001);
    return `<div class="fund-bars">${entries.map(([k,v])=>`<div class="fund-bar-row"><span>${escapeHtml(String(k).replace(/_/g,' '))}</span><i><b style="width:${Math.max(4, Number(v)/max*100)}%"></b></i><strong>${pctFundWeight(v)}</strong></div>`).join('')}</div>`;
  }

  function fundPortfolioFit(r) {
    const allFunds = (state.data?.stocks || []).filter(x => x.quote_type === "ETF");
    const ownedMap = lsGet(LS_PORTFOLIO);
    const peers = allFunds.filter(x => x.ticker !== r.ticker && ownedMap[x.ticker]);
    const overlaps = peers.map(x => ({ticker:x.ticker, overlap:fundOverlap(r,x)?.value})).filter(x => Number.isFinite(Number(x.overlap))).sort((a,b)=>b.overlap-a.overlap);
    const maxOverlap = overlaps.length ? Number(overlaps[0].overlap) : null;
    const m = fundMeta(r);
    const holdings = [...fundHoldingsMap(r).values()].sort((a,b)=>b.weight-a.weight);
    const observedCoverage = holdings.reduce((x,h)=>x+Number(h.weight),0);
    const top5 = holdings.slice(0,5).reduce((x,h)=>x+Number(h.weight),0);
    const fee = Number(r.expense_ratio);
    const aum = Number(r.fund_total_assets);

    let costScore = 50;
    if (Number.isFinite(fee)) {
      const pct = fee; // Yahoo expense ratio is already in percentage points: 0.03 = 0.03%
      costScore = pct <= .10 ? 100 : pct <= .20 ? 88 : pct <= .30 ? 76 : pct <= .50 ? 58 : pct <= .75 ? 40 : 24;
    }
    let sizeScore = 50;
    if (Number.isFinite(aum) && aum > 0) sizeScore = aum >= 20e9 ? 100 : aum >= 5e9 ? 90 : aum >= 1e9 ? 78 : aum >= 250e6 ? 62 : aum >= 50e6 ? 45 : 28;
    let diversificationScore = 50;
    if (holdings.length) {
      diversificationScore = 45 + Math.min(30, holdings.length * 2.5);
      if (top5 <= .20) diversificationScore += 20;
      else if (top5 <= .35) diversificationScore += 10;
      else if (top5 >= .60) diversificationScore -= 20;
      diversificationScore = Math.max(10, Math.min(100, Math.round(diversificationScore)));
    }
    let concentrationScore = holdings.length ? Math.max(0, Math.min(100, Math.round((1 - Math.min(1, top5)) * 100))) : 50;

    const thematic = m.themes.length > 0;
    const broad = m.style === 'Broad' && !thematic;
    let role = 'Satellite';
    let roleReason = thematic ? `Exposição temática: ${m.themes.join(', ')}` : `${m.geo} · ${m.style}`;
    if (m.style === 'Bonds') { role = 'Diversifier'; roleReason = 'Renda fixa pode reduzir dependência do risco acionista.'; }
    else if (m.style === 'Dividend') { role = 'Income'; roleReason = 'Perfil orientado para rendimento/distribuição.'; }
    else if (maxOverlap != null && maxOverlap >= .60) { role = 'Redundant'; roleReason = `${Math.round(maxOverlap*100)}% de overlap observado com ${overlaps[0].ticker}.`; }
    else if (broad && (m.geo === 'Global' || m.geo === 'Europe' || /world|global|all.?world|msci|s&p 500/i.test(`${r.name||''} ${r.ticker||''}`))) { role = 'Core'; roleReason = 'Exposição broad suficientemente diversificada para potencial função de núcleo.'; }
    else if (maxOverlap != null && maxOverlap <= .20 && peers.length) { role = 'Diversifier'; roleReason = `Baixo overlap observado com os outros ETFs da carteira (máx. ${Math.round(maxOverlap*100)}%).`; }

    const overall = Math.round(costScore*.22 + sizeScore*.18 + diversificationScore*.28 + concentrationScore*.17 + (role === 'Core' ? 92 : role === 'Diversifier' ? 82 : role === 'Income' ? 72 : role === 'Redundant' ? 35 : 65)*.15);
    return { costScore, sizeScore, diversificationScore, concentrationScore, overall, role, roleReason, maxOverlap, overlaps, observedCoverage, top5 };
  }

  function fundScoreLabel(v) {
    if (!Number.isFinite(Number(v))) return '—';
    if (v >= 85) return 'Excelente';
    if (v >= 70) return 'Forte';
    if (v >= 55) return 'Razoável';
    return 'Fraco';
  }

  function openFundDetail(r) {
    const meta = fundMeta(r);
    const holdings = [...fundHoldingsMap(r).values()].sort((a,b)=>b.weight-a.weight);
    const topCoverage = holdings.reduce((x,h)=>x+Number(h.weight),0);
    const starred = isWatched(r.ticker);
    const owned = isOwned(r.ticker);
    const fit = fundPortfolioFit(r);
    const overlapText = fit.maxOverlap == null ? '—' : `${Math.round(fit.maxOverlap*100)}%`;
    const roleClass = String(fit.role).toLowerCase();
    els.detailContent.innerHTML = `
      <div class="fund-detail-hero">
        <div><span class="eyebrow">FUND DOSSIER</span><h2>${escapeHtml(r.ticker)}</h2><p>${escapeHtml(r.name || 'ETF')}</p><small>${escapeHtml(r.fund_category || r.sector || 'ETF')} · ${escapeHtml(meta.geo)} · ${escapeHtml(meta.style)}</small></div>
        <div class="fund-detail-fee"><span>Expense ratio</span><strong>${fmtExpenseRatio(r.expense_ratio)}</strong></div>
      </div>
      <div class="fund-detail-actions"><button class="fund-action" id="fund-watch">${starred?'★ Na watchlist':'☆ Watchlist'}</button><label class="fund-action fund-owned"><input id="fund-owned" type="checkbox" ${owned?'checked':''}> Na carteira</label></div>

      <section class="fund-role-hero">
        <div class="fund-role-score"><span>Fund fit</span><strong>${fit.overall}</strong><small>${fundScoreLabel(fit.overall)}</small></div>
        <div class="fund-role-copy"><span class="fund-role-chip role-${roleClass}">${escapeHtml(fit.role)}</span><h3>${escapeHtml(fit.roleReason)}</h3><p>Leitura estrutural baseada apenas nos dados observáveis disponíveis. Não é uma recomendação automática de compra ou venda.</p></div>
      </section>

      <section class="fund-dimension-grid">
        ${[
          ['Cost', fit.costScore, Number.isFinite(Number(r.expense_ratio)) ? fmtExpenseRatio(r.expense_ratio) : 'sem TER'],
          ['Size', fit.sizeScore, r.fund_total_assets == null ? 'AUM indisponível' : fmtCap(r.fund_total_assets)],
          ['Diversification', fit.diversificationScore, holdings.length ? `${holdings.length} holdings observadas` : 'sem holdings'],
          ['Concentration', fit.concentrationScore, holdings.length ? `Top 5 ${pctFundWeight(fit.top5)}` : 'sem holdings'],
          ['Overlap', fit.maxOverlap == null ? 50 : Math.max(0, Math.round((1-fit.maxOverlap)*100)), fit.maxOverlap == null ? 'sem pares observáveis' : `${overlapText} máx.`]
        ].map(([label,score,note])=>`<div><span>${label}</span><strong>${score}</strong><small>${escapeHtml(note)}</small></div>`).join('')}
      </section>

      <details class="fund-dossier-box" open>
        <summary><div><span class="eyebrow">SNAPSHOT</span><h3>Estrutura do fundo</h3></div><span class="section-count">${escapeHtml(fit.role)}</span></summary>
        <div class="fund-kpi-grid">
          <div><span>AUM</span><strong>${r.fund_total_assets == null ? '—' : fmtCap(r.fund_total_assets)}</strong></div>
          <div><span>Família</span><strong>${escapeHtml(r.fund_family || '—')}</strong></div>
          <div><span>Categoria</span><strong>${escapeHtml(r.fund_category || r.sector || '—')}</strong></div>
          <div><span>Início</span><strong>${escapeHtml(r.fund_inception_date || '—')}</strong></div>
          <div><span>Região</span><strong>${escapeHtml(meta.geo)}</strong></div>
          <div><span>Estilo</span><strong>${escapeHtml(meta.style)}</strong></div>
        </div>
        ${r.fund_description ? `<div class="fund-editorial-card"><span class="eyebrow">WHAT IT OWNS</span><p>${escapeHtml(r.fund_description)}</p></div>` : ''}
      </details>

      <details class="fund-dossier-box">
        <summary><div><span class="eyebrow">COMPOSITION</span><h3>Principais posições</h3></div><span class="section-count">${holdings.length ? pctFundWeight(topCoverage) : '—'}</span></summary>
        ${holdings.length ? `<div class="fund-holdings-list">${holdings.map(h=>`<div><span><b>${escapeHtml(h.symbol)}</b><small>${escapeHtml(h.name)}</small></span><i><b style="width:${Math.min(100, Math.max(3, Number(h.weight)*500))}%"></b></i><strong>${pctFundWeight(h.weight)}</strong></div>`).join('')}</div><p class="fund-method-note">A percentagem no cabeçalho é apenas a cobertura das posições devolvidas pela fonte, não 100% do fundo.</p>` : '<p class="muted">A fonte não devolveu top holdings para esta cotação.</p>'}
      </details>

      <details class="fund-dossier-box">
        <summary><div><span class="eyebrow">EXPOSURES</span><h3>Classes de ativos & setores</h3></div><span class="section-count">abrir</span></summary>
        <section class="fund-detail-two"><article><span class="eyebrow">ASSET MIX</span><h3>Classes de ativos</h3>${fundBars(r.fund_asset_classes)}</article><article><span class="eyebrow">SECTOR MIX</span><h3>Exposição setorial</h3>${fundBars(r.fund_sector_weightings)}</article></section>
      </details>

      <details class="fund-dossier-box">
        <summary><div><span class="eyebrow">PORTFOLIO ROLE</span><h3>O papel deste ETF na carteira</h3></div><span class="section-count">${overlapText}</span></summary>
        <div class="fund-role-detail">
          <div><span>Papel provável</span><strong>${escapeHtml(fit.role)}</strong><small>${escapeHtml(fit.roleReason)}</small></div>
          <div><span>Maior overlap observado</span><strong>${overlapText}</strong><small>${fit.overlaps.length ? `com ${escapeHtml(fit.overlaps[0].ticker)}` : 'sem outro ETF comparável na carteira'}</small></div>
          <div><span>Cobertura observada</span><strong>${holdings.length ? pctFundWeight(fit.observedCoverage) : '—'}</strong><small>limite inferior; depende das holdings devolvidas pela fonte</small></div>
        </div>
        ${fit.overlaps.length ? `<div class="fund-overlap-list">${fit.overlaps.slice(0,5).map(x=>`<div><span>${escapeHtml(x.ticker)}</span><strong>${Math.round(x.overlap*100)}%</strong></div>`).join('')}</div>` : ''}
      </details>

      <details class="fund-dossier-box">
        <summary><div><span class="eyebrow">DATA INTEGRITY</span><h3>O que este dossier sabe</h3></div><span class="section-count">metodologia</span></summary>
        <div class="fund-editorial-card integrity"><p>Holdings, classes de ativos e pesos setoriais vêm do módulo FundsData quando Yahoo os disponibiliza. O overlap usa apenas as holdings observadas e deve ser lido como limite inferior. Cost, Size, Diversification, Concentration e Fund fit são heurísticas transparentes de triagem — não estimativas de retorno.</p></div>
      </details>
    `;
    els.detail.hidden = false;
    document.getElementById('fund-watch')?.addEventListener('click', e => { toggleWatched(r.ticker); e.currentTarget.textContent = isWatched(r.ticker) ? '★ Na watchlist' : '☆ Watchlist'; });
    document.getElementById('fund-owned')?.addEventListener('change', () => { toggleOwned(r.ticker); openFundDetail(r); });
  }

  function renderFundCards(rows) {
    if (!els.fundsList) return;
    els.fundsList.innerHTML = rows.length ? rows.map(r => {
      const m = fundMeta(r);
      const fee = r.expense_ratio == null ? "—" : fmtExpenseRatio(Number(r.expense_ratio));
      const ai = r.ai_exposure_pct == null ? "—" : `${Number(r.ai_exposure_pct).toFixed(1)}%`;
      const theme = m.themes[0] || r.sector || "Diversified";
      return `<article class="fund-result-card" data-ticker="${escapeHtml(r.ticker)}">
        <div class="fund-result-top"><div><span class="eyebrow">${escapeHtml(theme)}</span><h3>${escapeHtml(r.ticker)}</h3><p>${escapeHtml(r.name || "ETF")}</p></div><button class="fund-open" data-fund-open="${escapeHtml(r.ticker)}">Abrir →</button></div>
        <div class="fund-result-metrics">
          <div><span>Expense ratio</span><strong>${fee}</strong></div>
          <div><span>Região</span><strong>${escapeHtml(m.geo)}</strong></div>
          <div><span>Estilo</span><strong>${escapeHtml(m.style)}</strong></div>
          <div><span>AI exposure</span><strong>${ai}</strong></div>
          <div><span>AUM</span><strong>${r.fund_total_assets == null ? "—" : fmtCap(r.fund_total_assets)}</strong></div>
          <div><span>Top holdings</span><strong>${Array.isArray(r.top_holdings) ? r.top_holdings.length : 0}</strong></div>
        </div>
      </article>`;
    }).join("") : '<p class="empty-state">Nenhum ETF corresponde a estes filtros.</p>';
    els.fundsList.querySelectorAll('[data-fund-open]').forEach(x => x.addEventListener('click', () => openDetail(x.dataset.fundOpen)));
  }

  function renderFundFeeSaver(allFunds) {
    if (!els.fundFeeSaver) return;
    const owned = lsGet(LS_PORTFOLIO);
    const ownedFunds = allFunds.filter(r => owned[r.ticker] && Number.isFinite(Number(r.expense_ratio)));
    const candidates = [];
    for (const held of ownedFunds) {
      const hm = fundMeta(held);
      const peers = allFunds.filter(r => r.ticker !== held.ticker && Number.isFinite(Number(r.expense_ratio)) && fundMeta(r).style === hm.style && (r.region === held.region || fundMeta(r).geo === hm.geo));
      peers.sort((a,b) => {
        const ao = fundOverlap(held,a)?.value ?? -1, bo = fundOverlap(held,b)?.value ?? -1;
        if (ao >= 0 || bo >= 0) return bo-ao || Number(a.expense_ratio)-Number(b.expense_ratio);
        return Number(a.expense_ratio)-Number(b.expense_ratio);
      });
      const alt = peers.find(x => { const ov=fundOverlap(held,x); return !ov || ov.value >= .15; }) || peers[0];
      if (!alt) continue;
      const diff = Number(held.expense_ratio) - Number(alt.expense_ratio);
      if (diff <= 0.02) continue;
      candidates.push({held, alt, diff});
    }
    candidates.sort((a,b)=>b.diff-a.diff);
    if (!candidates.length) {
      els.fundFeeSaver.innerHTML = `<p class="muted">Não encontrei ainda uma alternativa claramente mais barata entre os ETFs rastreados da tua carteira.</p>`;
      return;
    }
    els.fundFeeSaver.innerHTML = candidates.slice(0,4).map(({held,alt,diff}) => {
      const annual10k = diff / 100 * 10000;
      return `<button class="fee-saver-row" data-fund-open="${escapeHtml(alt.ticker)}"><span><strong>${escapeHtml(held.ticker)} → ${escapeHtml(alt.ticker)}</strong><small>${fmtExpenseRatio(Number(held.expense_ratio))} → ${fmtExpenseRatio(Number(alt.expense_ratio))}</small></span><b>≈ €${annual10k.toFixed(0)}/10k ano</b></button>`;
    }).join("") + `<p class="fund-method-note">Quando existem holdings observadas, o Fee Saver favorece alternativas com maior overlap antes do custo. Ainda assim confirma índice, réplica, moeda, tracking difference e fiscalidade.</p>`;
    els.fundFeeSaver.querySelectorAll('[data-fund-open]').forEach(x => x.addEventListener('click',()=>openDetail(x.dataset.fundOpen)));
  }

  function populateFundCompare(allFunds) {
    if (fundCompareOptionsPopulated || !els.fundCompareA || !els.fundCompareB) return;
    const opts = allFunds.slice().sort((a,b)=>(a.ticker||'').localeCompare(b.ticker||'')).map(r => `<option value="${escapeHtml(r.ticker)}">${escapeHtml(r.ticker)} · ${escapeHtml(r.name || '')}</option>`).join('');
    els.fundCompareA.innerHTML = `<option value="">ETF A</option>${opts}`;
    els.fundCompareB.innerHTML = `<option value="">ETF B</option>${opts}`;
    fundCompareOptionsPopulated = true;
  }

  function renderFundCompare() {
    if (!els.fundCompareResult || !state.data) return;
    const a = state.data.stocks.find(r => r.ticker === els.fundCompareA?.value && r.quote_type === 'ETF');
    const b = state.data.stocks.find(r => r.ticker === els.fundCompareB?.value && r.quote_type === 'ETF');
    if (!a || !b) { els.fundCompareResult.innerHTML = '<p class="muted">Escolhe dois fundos para comparar custo, tamanho, concentração, overlap e papel na carteira.</p>'; return; }
    const am = fundMeta(a), bm = fundMeta(b);
    const af = fundPortfolioFit(a), bf = fundPortfolioFit(b);
    const feeA = Number.isFinite(Number(a.expense_ratio)) ? Number(a.expense_ratio) : null;
    const feeB = Number.isFinite(Number(b.expense_ratio)) ? Number(b.expense_ratio) : null;
    const aumA = Number(a.fund_total_assets), aumB = Number(b.fund_total_assets);
    const overlap = fundOverlap(a,b);
    const sameStructure = am.geo === bm.geo && am.style === bm.style;
    const overlapValue = overlap ? Number(overlap.value) : null;
    const comparable = sameStructure || (Number.isFinite(overlapValue) && overlapValue >= .35);
    const cheaper = feeA != null && feeB != null ? (feeA < feeB ? a.ticker : feeB < feeA ? b.ticker : 'igual') : null;
    const larger = Number.isFinite(aumA) && Number.isFinite(aumB) ? (aumA > aumB ? a.ticker : aumB > aumA ? b.ticker : 'igual') : null;
    const lessConcentrated = af.concentrationScore === bf.concentrationScore ? 'igual' : (af.concentrationScore > bf.concentrationScore ? a.ticker : b.ticker);
    const betterFit = af.overall === bf.overall ? 'igual' : (af.overall > bf.overall ? a.ticker : b.ticker);

    let lead = betterFit === 'igual' ? a : (betterFit === a.ticker ? a : b);
    let other = lead === a ? b : a;
    let verdict = `${lead.ticker} tem o Fund Fit mais forte (${lead===a?af.overall:bf.overall}/100).`;
    if (comparable && cheaper && cheaper !== 'igual') verdict += ` Entre os dois, ${cheaper} é mais barato.`;
    if (Number.isFinite(overlapValue) && overlapValue >= .65) verdict += ` O overlap observado de ${pctFundWeight(overlapValue)} sugere duplicação relevante; normalmente não precisas dos dois para a mesma função.`;
    else if (Number.isFinite(overlapValue) && overlapValue <= .25) verdict += ` O overlap observado é baixo (${pctFundWeight(overlapValue)}), por isso podem cumprir funções complementares.`;
    if (!comparable) verdict += ` A comparação estrutural é limitada: geografia/estilo diferem, por isso evita escolher apenas pelo TER.`;

    const roleSentence = `${a.ticker}: ${af.role}. ${b.ticker}: ${bf.role}.`;
    const bestBadges = (ticker) => [
      cheaper === ticker ? '<span>BEST COST</span>' : '',
      larger === ticker ? '<span>BEST SIZE</span>' : '',
      lessConcentrated === ticker ? '<span>LESS CONCENTRATED</span>' : '',
      betterFit === ticker ? '<span>BEST FIT</span>' : ''
    ].filter(Boolean).join('');

    const scoreRow = (label, av, bv, fmt=(x)=>String(x)) => {
      const an=Number(av), bn=Number(bv); const okA=Number.isFinite(an), okB=Number.isFinite(bn);
      let winner=''; if(okA&&okB&&an!==bn) winner=an>bn?'a':'b';
      return `<div class="fund-compare-row"><span>${escapeHtml(label)}</span><strong class="${winner==='a'?'is-best':''}">${okA?fmt(an):'—'}</strong><strong class="${winner==='b'?'is-best':''}">${okB?fmt(bn):'—'}</strong></div>`;
    };

    const overlapHtml = overlap ? `<div class="fund-overlap"><span class="eyebrow">OBSERVED HOLDINGS OVERLAP</span><strong>${pctFundWeight(overlap.value)}</strong><p>Limite inferior calculado apenas nas holdings devolvidas pela fonte (${pctFundWeight(overlap.coverageA)} de ${escapeHtml(a.ticker)}; ${pctFundWeight(overlap.coverageB)} de ${escapeHtml(b.ticker)}).</p>${overlap.shared.length ? `<div class="shared-holdings">${overlap.shared.slice(0,8).map(h=>`<span>${escapeHtml(h.symbol)} ${pctFundWeight(h.weight)}</span>`).join('')}</div>`:''}</div>` : `<p class="fund-method-note">A fonte não devolveu holdings suficientes para calcular overlap observado.</p>`;

    els.fundCompareResult.innerHTML = `
      <section class="fund-decision-verdict">
        <span class="eyebrow">DECISION VIEW</span>
        <h3>${escapeHtml(lead.ticker)} parece mais forte para a função atual</h3>
        <p>${escapeHtml(verdict)}</p>
        <small>${escapeHtml(roleSentence)}</small>
      </section>
      <div class="fund-h2h-grid decision">
        <div><div class="fund-best-badges">${bestBadges(a.ticker)}</div><strong>${escapeHtml(a.ticker)}</strong><span>${escapeHtml(am.geo)} · ${escapeHtml(am.style)}</span><b>${feeA==null?'—':fmtExpenseRatio(feeA)}</b><small>${a.fund_total_assets==null?'AUM —':`AUM ${fmtCap(a.fund_total_assets)}`}</small><em>${escapeHtml(af.role)} · Fit ${af.overall}</em></div>
        <div><div class="fund-best-badges">${bestBadges(b.ticker)}</div><strong>${escapeHtml(b.ticker)}</strong><span>${escapeHtml(bm.geo)} · ${escapeHtml(bm.style)}</span><b>${feeB==null?'—':fmtExpenseRatio(feeB)}</b><small>${b.fund_total_assets==null?'AUM —':`AUM ${fmtCap(b.fund_total_assets)}`}</small><em>${escapeHtml(bf.role)} · Fit ${bf.overall}</em></div>
      </div>
      <details class="fund-compare-box" open>
        <summary><b>Essencial</b><span>${escapeHtml(a.ticker)} vs ${escapeHtml(b.ticker)}</span></summary>
        <div class="fund-compare-table-head"><span>Métrica</span><strong>${escapeHtml(a.ticker)}</strong><strong>${escapeHtml(b.ticker)}</strong></div>
        ${scoreRow('Fund Fit',af.overall,bf.overall,x=>`${Math.round(x)}/100`)}
        ${scoreRow('Cost score',af.costScore,bf.costScore,x=>`${Math.round(x)}`)}
        ${scoreRow('Size score',af.sizeScore,bf.sizeScore,x=>`${Math.round(x)}`)}
        ${scoreRow('Diversification',af.diversificationScore,bf.diversificationScore,x=>`${Math.round(x)}`)}
        ${scoreRow('Concentration',af.concentrationScore,bf.concentrationScore,x=>`${Math.round(x)}`)}
      </details>
      <details class="fund-compare-box">
        <summary><b>Overlap & composição</b><span>${overlap?`${pctFundWeight(overlap.value)} observado`:'dados insuficientes'}</span></summary>
        ${overlapHtml}
      </details>
      <details class="fund-compare-box">
        <summary><b>Papel na carteira</b><span>${escapeHtml(af.role)} · ${escapeHtml(bf.role)}</span></summary>
        <div class="fund-role-compare"><article><strong>${escapeHtml(a.ticker)} · ${escapeHtml(af.role)}</strong><p>${escapeHtml(af.roleReason)}</p></article><article><strong>${escapeHtml(b.ticker)} · ${escapeHtml(bf.role)}</strong><p>${escapeHtml(bf.roleReason)}</p></article></div>
      </details>
      <p class="fund-method-note">A conclusão é heurística e usa apenas dados observáveis. Confirma índice, réplica, moeda, domicílio, UCITS, tracking difference, fiscalidade e liquidez antes de substituir um ETF.</p>`;
  }


  function fundExpenseCostPct(r) {
    const n = Number(r?.expense_ratio);
    return Number.isFinite(n) && n >= 0 ? n : null; // percentage points, e.g. 0.20 = 0.20%
  }

  function buildFundOverlapClusters(held, minOverlap = 0.30) {
    const n = held.length;
    const adj = Array.from({length:n},()=>new Set());
    const pairMap = new Map();
    for (let i=0;i<n;i++) for (let j=i+1;j<n;j++) {
      const ov = fundOverlap(held[i].row, held[j].row);
      if (!ov) continue;
      pairMap.set(`${i}:${j}`, ov);
      if (ov.value >= minOverlap) { adj[i].add(j); adj[j].add(i); }
    }
    const seen = new Set(), clusters=[];
    for (let i=0;i<n;i++) {
      if (seen.has(i) || !adj[i].size) continue;
      const stack=[i], idx=[]; seen.add(i);
      while (stack.length) {
        const k=stack.pop(); idx.push(k);
        for (const j of adj[k]) if (!seen.has(j)) { seen.add(j); stack.push(j); }
      }
      if (idx.length>=2) clusters.push(idx.map(k=>held[k]));
    }
    return {clusters, pairMap};
  }

  function consolidationCandidate(cluster) {
    if (!cluster?.length) return null;
    // Transparent, data-availability-aware score. It is a consolidation heuristic,
    // not a forecast of future returns or a sell instruction.
    const fees = cluster.map(x=>fundExpenseCostPct(x.row)).filter(Number.isFinite);
    const aums = cluster.map(x=>Number(x.row.fund_total_assets)).filter(x=>Number.isFinite(x)&&x>0);
    const minFee = fees.length ? Math.min(...fees) : null;
    const maxFee = fees.length ? Math.max(...fees) : null;
    const logAums = aums.map(x=>Math.log10(x));
    const minA = logAums.length ? Math.min(...logAums) : null;
    const maxA = logAums.length ? Math.max(...logAums) : null;

    const scored = cluster.map(x=>{
      const pieces=[];
      const fee=fundExpenseCostPct(x.row);
      if (fee!=null) {
        const v = maxFee===minFee ? 1 : 1-(fee-minFee)/(maxFee-minFee);
        pieces.push({w:.40,v,reason:`custo ${fmtExpenseRatio(fee)}`});
      }
      const aum=Number(x.row.fund_total_assets);
      if (Number.isFinite(aum)&&aum>0) {
        const la=Math.log10(aum), v=maxA===minA?1:(la-minA)/(maxA-minA);
        pieces.push({w:.20,v,reason:`AUM ${fmtCap(aum)}`});
      }
      if (Number.isFinite(x.coverage)) pieces.push({w:.15,v:Math.max(0,Math.min(1,x.coverage)),reason:`holdings observadas ${pctFundWeight(x.coverage)}`});
      const ovs=cluster.filter(y=>y!==x).map(y=>fundOverlap(x.row,y.row)?.value).filter(Number.isFinite);
      if (ovs.length) {
        const avg=ovs.reduce((a,b)=>a+b,0)/ovs.length;
        pieces.push({w:.25,v:Math.max(0,Math.min(1,avg)),reason:`representatividade ${pctFundWeight(avg)}`});
      }
      const wsum=pieces.reduce((a,b)=>a+b.w,0);
      const score=wsum?pieces.reduce((a,b)=>a+b.w*b.v,0)/wsum:null;
      return {...x,score,pieces};
    }).sort((a,b)=>(b.score??-1)-(a.score??-1));
    return {preferred:scored[0], ranked:scored};
  }

  function renderFundConsolidation(held, totalValue) {
    const {clusters}=buildFundOverlapClusters(held, .30);
    if (!clusters.length) {
      const withHoldings = held.filter(x => (x.hmap instanceof Map ? x.hmap.size : fundHoldingsMap(x.row).size) > 0).length;
      if (held.length >= 2 && withHoldings < 2) return `<article class="fund-consolidation-panel is-data-gap"><span class="eyebrow">CONSOLIDATION LAB</span><h4>Ainda não é possível medir redundância</h4><p class="fund-method-note">${withHoldings}/${held.length} ETFs têm holdings carregadas. O dataset precisa de ser atualizado antes de concluir que os fundos não se sobrepõem.</p></article>`;
      return `<article class="fund-consolidation-panel"><span class="eyebrow">CONSOLIDATION LAB</span><h4>Sem redundâncias fortes detetadas</h4><p class="fund-method-note">Com as holdings observadas, nenhum grupo de ETFs da carteira ultrapassa 30% de overlap entre si. Isto não exclui redundância nas holdings que a fonte não devolve.</p></article>`;
    }

    const cards=clusters.map((cluster,idx)=>{
      const c=consolidationCandidate(cluster); if (!c?.preferred) return '';
      const preferred=c.preferred;
      const others=c.ranked.filter(x=>x.ticker!==preferred.ticker);
      const clusterValue=cluster.reduce((s,x)=>s+(x.eur||0),0);
      const feeP=fundExpenseCostPct(preferred.row);
      let currentCost=0, modeledCost=0, costCoverage=0;
      for (const x of cluster) {
        const fee=fundExpenseCostPct(x.row);
        if (x.eur!=null && fee!=null) { currentCost += x.eur*fee/100; costCoverage += x.eur; if (feeP!=null) modeledCost += x.eur*feeP/100; }
      }
      const saving=(feeP!=null && costCoverage>0)?Math.max(0,currentCost-modeledCost):null;
      const avgOv=others.map(x=>fundOverlap(preferred.row,x.row)?.value).filter(Number.isFinite);
      const represent=avgOv.length?avgOv.reduce((a,b)=>a+b,0)/avgOv.length:null;
      const reasons=[];
      if (feeP!=null) reasons.push(`expense ratio ${fmtExpenseRatio(feeP)}`);
      if (preferred.row.fund_total_assets) reasons.push(`AUM ${fmtCap(preferred.row.fund_total_assets)}`);
      if (represent!=null) reasons.push(`overlap médio ${pctFundWeight(represent)}`);
      const tags=cluster.map(x=>`<button class="consolidation-ticker ${x.ticker===preferred.ticker?'is-preferred':''}" data-fund-open="${escapeHtml(x.ticker)}">${escapeHtml(x.ticker)}</button>`).join('');
      const review=others.map(x=>{
        const ov=fundOverlap(preferred.row,x.row);
        const fee=fundExpenseCostPct(x.row);
        const feeDelta=(fee!=null&&feeP!=null)?fee-feeP:null;
        return `<div class="consolidation-review-row"><span><b>${escapeHtml(x.ticker)} → ${escapeHtml(preferred.ticker)}</b><small>${ov?`${pctFundWeight(ov.value)} overlap observado`:'overlap indisponível'}${fee!=null?` · custo ${fmtExpenseRatio(fee)}`:''}${feeDelta!=null&&feeDelta>0?` · +${feeDelta.toFixed(2)} pp vs núcleo`:''}</small></span><button data-fund-pair-a="${escapeHtml(preferred.ticker)}" data-fund-pair-b="${escapeHtml(x.ticker)}">Comparar</button></div>`;
      }).join('');
      const ops=others.map(x=>({source:x.ticker,target:preferred.ticker,pct:100,reason:`Consolidar ETF · overlap ${Number.isFinite(fundOverlap(preferred.row,x.row)?.value)?pctFundWeight(fundOverlap(preferred.row,x.row).value):'observado'}`}));
      const encoded=encodeURIComponent(JSON.stringify(ops));
      return `<details class="consolidation-cluster" ${idx===0?'open':''}>
        <summary><div><span class="eyebrow">GRUPO ${idx+1} · ${cluster.length} ETFs</span><h5>${tags}</h5></div><span class="cluster-weight">${totalValue&&clusterValue?`${(clusterValue/totalValue*100).toFixed(1)}% da carteira`:'—'} <i>⌄</i></span></summary>
        <div class="consolidation-decision-strip">
          <div><span>Manter como núcleo</span><strong>${escapeHtml(preferred.ticker)}</strong></div>
          <div><span>ETFs a rever</span><strong>${others.length}</strong></div>
          <div><span>Overlap médio</span><strong>${represent==null?'—':pctFundWeight(represent)}</strong></div>
          <div><span>Poupança modelada</span><strong>${saving!=null&&saving>0?`≈ €${saving.toFixed(0)}/ano`:'—'}</strong></div>
        </div>
        <div class="retain-candidate"><span>Candidato a <strong>núcleo</strong></span><b>${escapeHtml(preferred.ticker)}</b><p>${escapeHtml(reasons.join(' · ') || 'melhor combinação disponível de custo, dimensão, cobertura e representatividade')}</p><small>Confirma índice seguido, UCITS/domicílio, moeda, distribuição/acumulação e tracking difference antes de consolidar.</small></div>
        <div class="consolidation-review"><span class="eyebrow">REVER / POSSÍVEL REDUNDÂNCIA</span>${review}</div>
        <div class="consolidation-actions"><button class="primary" data-consolidation-simulate="${encoded}">Simular consolidar este grupo →</button><small>Cria um cenário what-if; não altera nem executa a carteira.</small></div>
      </details>`;
    }).join('');

    return `<article class="fund-consolidation-panel"><div class="section-heading"><div><span class="eyebrow">CONSOLIDATION LAB</span><h4>Que ETFs se sobrepõem — e qual parece o núcleo mais eficiente</h4></div><span class="section-count">${clusters.length} grupo${clusters.length===1?'':'s'}</span></div><p class="fund-method-note">Cada grupo é expansível. O candidato a reter usa uma heurística transparente: 40% custo, 25% representatividade, 20% AUM e 15% cobertura de holdings, com pesos renormalizados quando faltam dados. Serve para priorizar revisão — não é uma ordem de venda.</p>${cards}</article>`;
  }


  function fundUcitsStatus(r) {
    const text = `${r?.name||''} ${r?.fund_category||''} ${r?.fund_family||''} ${r?.fund_description||''}`.toLowerCase();
    if (/\bucits\b/.test(text)) return {status:'confirmed',label:'UCITS confirmado'};
    const t = String(r?.ticker||'').toUpperCase();
    const europeanListing = /\.(L|DE|PA|AS|MI|MC|SW|LS|BR|ST|CO|HE|OL|VI)$/.test(t);
    if (europeanListing) return {status:'possible',label:'cotação europeia · UCITS não confirmado'};
    return {status:'unknown',label:'UCITS não confirmado'};
  }

  function fundReplacementCompatibility(held, alt) {
    const hm=fundMeta(held), am=fundMeta(alt);
    const ov=fundOverlap(held,alt);
    const sameGeo = hm.geo && am.geo && hm.geo===am.geo;
    const sameStyle = hm.style && am.style && hm.style===am.style;
    const sharedThemes = hm.themes.filter(x=>am.themes.includes(x));
    let score=0, evidence=[];
    if (ov) { score += Math.min(.55, ov.value*.70); evidence.push(`${pctFundWeight(ov.value)} overlap observado`); }
    if (sameStyle) { score += .16; evidence.push(`mesmo estilo (${hm.style})`); }
    if (sameGeo) { score += .14; evidence.push(`mesma geografia (${hm.geo})`); }
    if (sharedThemes.length) { score += .10; evidence.push(`tema ${sharedThemes[0]}`); }
    if (!ov && sameStyle && sameGeo) score += .08;
    return {score:Math.min(1,score),overlap:ov,evidence,sameGeo,sameStyle,sharedThemes};
  }

  function fundReplacementCandidates(held, allFunds) {
    const feeHeld=fundExpenseCostPct(held);
    const aumHeld=Number(held?.fund_total_assets);
    const ucHeld=fundUcitsStatus(held);
    const out=[];
    for (const alt of allFunds) {
      if (!alt || alt.ticker===held.ticker) continue;
      const comp=fundReplacementCompatibility(held,alt);
      if (comp.score < .22) continue;
      const feeAlt=fundExpenseCostPct(alt);
      const aumAlt=Number(alt.fund_total_assets);
      const ucAlt=fundUcitsStatus(alt);
      const cheaper=feeHeld!=null && feeAlt!=null && feeAlt < feeHeld-.005;
      const bigger=Number.isFinite(aumHeld)&&aumHeld>0&&Number.isFinite(aumAlt)&&aumAlt>aumHeld*1.20;
      const betterCoverage=fundHoldingsMap(alt).size > fundHoldingsMap(held).size;
      const ucitsUpgrade=ucHeld.status!=='confirmed' && ucAlt.status==='confirmed';
      if (!cheaper && !bigger && !betterCoverage && !ucitsUpgrade) continue;
      let merit=comp.score*.50;
      const reasons=[];
      if (cheaper) {
        const save=feeHeld-feeAlt;
        merit += Math.min(.22, save/0.60*.22);
        reasons.push(`TER −${save.toFixed(2)} pp`);
      }
      if (bigger) { merit += .10; reasons.push('AUM superior'); }
      if (betterCoverage) { merit += .05; reasons.push('melhor cobertura de holdings'); }
      if (ucAlt.status==='confirmed') { merit += .13; reasons.push('UCITS confirmado'); }
      else if (ucAlt.status==='possible') { merit += .03; }
      out.push({held,alt,comp,feeHeld,feeAlt,aumHeld,aumAlt,ucHeld,ucAlt,merit:Math.min(1,merit),reasons});
    }
    return out.sort((a,b)=>b.merit-a.merit);
  }

  function renderFundReplacementIntel(held, allFunds, totalValue) {
    const candidates=[];
    for (const h of held) {
      const list=fundReplacementCandidates(h.row, allFunds);
      if (list.length) candidates.push({...list[0],eur:h.eur});
    }
    candidates.sort((a,b)=>b.merit-a.merit);
    if (!candidates.length) {
      return `<details class="fund-replacement-panel"><summary><div><span class="eyebrow">ETF REPLACEMENT INTELLIGENCE</span><h4>Alternativas potencialmente mais eficientes</h4></div><span class="section-count">0 <i>⌄</i></span></summary><div class="replacement-empty"><p>Não encontrei ainda substitutos com evidência suficiente de equivalência e melhoria de custo/estrutura no universo rastreado.</p><small>O motor só propõe revisão quando existe semelhança observável e pelo menos uma melhoria: TER, AUM, cobertura de holdings ou UCITS confirmado.</small></div></details>`;
    }
    const cards=candidates.slice(0,8).map((x,i)=>{
      const feeSave=x.feeHeld!=null&&x.feeAlt!=null?Math.max(0,x.feeHeld-x.feeAlt):null;
      const annual=(feeSave!=null&&Number.isFinite(x.eur))?x.eur*feeSave/100:null;
      const ov=x.comp.overlap?.value;
      const confidence = ov>=.60 ? 'Alta' : ov>=.35 ? 'Moderada' : (x.comp.sameGeo&&x.comp.sameStyle?'Moderada':'Baixa');
      const ops=encodeURIComponent(JSON.stringify([{source:x.held.ticker,target:x.alt.ticker,pct:100,reason:`ETF Replacement · ${Number.isFinite(ov)?pctFundWeight(ov)+' overlap observado':'semelhança estrutural'}${feeSave!=null&&feeSave>0?` · TER -${feeSave.toFixed(2)} pp`:''}`}]));
      return `<details class="replacement-card" ${i===0?'open':''}>
        <summary><div><span class="replacement-route"><b>${escapeHtml(x.held.ticker)}</b><i>→</i><b>${escapeHtml(x.alt.ticker)}</b></span><small>${escapeHtml(x.reasons.slice(0,3).join(' · ') || 'candidato estrutural')}</small></div><span class="replacement-score">${Math.round(x.merit*100)}<small>/100</small></span></summary>
        <div class="replacement-body">
          <div class="replacement-kpis">
            <div><span>Overlap observado</span><strong>${Number.isFinite(ov)?pctFundWeight(ov):'—'}</strong></div>
            <div><span>TER atual → candidato</span><strong>${x.feeHeld==null?'—':fmtExpenseRatio(x.feeHeld)} → ${x.feeAlt==null?'—':fmtExpenseRatio(x.feeAlt)}</strong></div>
            <div><span>AUM candidato</span><strong>${Number.isFinite(x.aumAlt)&&x.aumAlt>0?fmtCap(x.aumAlt):'—'}</strong></div>
            <div><span>UCITS</span><strong>${escapeHtml(x.ucAlt.label)}</strong></div>
            <div><span>Confiança equivalência</span><strong>${confidence}</strong></div>
            <div><span>Poupança estimada</span><strong>${annual!=null&&annual>0?`≈ €${annual.toFixed(0)}/ano`:'—'}</strong></div>
          </div>
          <p class="replacement-evidence">${escapeHtml(x.comp.evidence.join(' · ') || 'Semelhança baseada em classificação do fundo.')}</p>
          <div class="replacement-actions"><button data-fund-pair-a="${escapeHtml(x.held.ticker)}" data-fund-pair-b="${escapeHtml(x.alt.ticker)}">Comparar lado a lado</button><button class="primary" data-replacement-simulate="${ops}">Simular substituição</button></div>
          <p class="fund-method-note">Não é uma recomendação automática. Confirma índice, TER oficial, tracking difference, réplica, securities lending, moeda, distribuição/acumulação, fiscalidade, liquidez e UCITS no KID/prospeto antes de trocar.</p>
        </div>
      </details>`;
    }).join('');
    return `<details class="fund-replacement-panel" open><summary><div><span class="eyebrow">ETF REPLACEMENT INTELLIGENCE</span><h4>Onde pode existir um fundo equivalente mais eficiente</h4></div><span class="section-count">${candidates.length} <i>⌄</i></span></summary><p class="fund-method-note">Compara os ETFs que tens com todo o universo rastreado. Prioriza overlap/semelhança, menor TER, maior AUM e UCITS quando explicitamente confirmado pela fonte. “Cotação europeia” nunca é tratada automaticamente como UCITS.</p>${cards}</details>`;
  }

  function buildObservedLookthrough(items) {
    const map = new Map();
    for (const item of items || []) {
      const eur = Number(item.eur);
      if (!Number.isFinite(eur) || eur <= 0) continue;
      const hmap = item.hmap instanceof Map ? item.hmap : fundHoldingsMap(item.row);
      for (const h of hmap.values()) {
        const symbol = String(h.symbol || '').toUpperCase();
        const weight = Number(h.weight) || 0;
        if (!symbol || weight <= 0) continue;
        map.set(symbol, (map.get(symbol) || 0) + eur * weight);
      }
    }
    return map;
  }

  function observedDistributionSimilarity(a, b) {
    const sa=[...a.values()].reduce((x,y)=>x+y,0), sb=[...b.values()].reduce((x,y)=>x+y,0);
    if (!sa || !sb) return null;
    const keys=new Set([...a.keys(),...b.keys()]);
    let overlap=0;
    for (const k of keys) overlap += Math.min((a.get(k)||0)/sa, (b.get(k)||0)/sb);
    return Math.max(0,Math.min(1,overlap));
  }

  function portfolioSimplificationModel(held, totalValue) {
    const {clusters}=buildFundOverlapClusters(held, .30);
    const memberToCluster=new Map();
    const clusterModels=[];
    const review=[];
    for (let i=0;i<clusters.length;i++) {
      const cluster=clusters[i];
      const ranked=consolidationCandidate(cluster);
      if (!ranked?.preferred) continue;
      const preferred=ranked.preferred;
      cluster.forEach(x=>memberToCluster.set(x.ticker,i));
      const clusterValue=cluster.reduce((sum,x)=>sum+(Number(x.eur)||0),0);
      const others=cluster.filter(x=>x.ticker!==preferred.ticker);
      const rels=others.map(x=>({x,ov:fundOverlap(preferred.row,x.row)}));
      clusterModels.push({index:i,cluster,preferred,others,clusterValue,rels});
      for (const {x,ov} of rels) review.push({ticker:x.ticker,core:preferred.ticker,overlap:ov?.value??null,eur:x.eur,row:x.row});
    }

    const cores=[];
    const seen=new Set();
    for (const cm of clusterModels) {
      const x=cm.preferred;
      if (!seen.has(x.ticker)) { cores.push({...x,role:`núcleo de ${cm.cluster.length} ETFs semelhantes`,clusterSize:cm.cluster.length}); seen.add(x.ticker); }
    }
    for (const x of held) if (!memberToCluster.has(x.ticker) && !seen.has(x.ticker)) {
      cores.push({...x,role:'exposição distinta nas holdings observadas',clusterSize:1}); seen.add(x.ticker);
    }

    // Model: capital inside each redundancy cluster is represented by its preferred core ETF.
    const modeled=[];
    for (const cm of clusterModels) {
      if (cm.clusterValue>0) modeled.push({...cm.preferred,eur:cm.clusterValue,hmap:fundHoldingsMap(cm.preferred.row)});
    }
    for (const x of held) if (!memberToCluster.has(x.ticker) && x.eur!=null) modeled.push(x);
    const originalMap=buildObservedLookthrough(held);
    const modeledMap=buildObservedLookthrough(modeled);
    const similarity=observedDistributionSimilarity(originalMap,modeledMap);

    let weightedRedundancy=0;
    if (totalValue>0) for (const r of review) if (Number.isFinite(r.eur) && Number.isFinite(r.overlap)) weightedRedundancy += (r.eur/totalValue)*r.overlap;
    const countReduction=held.length ? review.length/held.length : 0;
    const countSignal=Math.min(1,countReduction/0.50); // 50% removable candidates saturates count signal
    const capitalSignal=Math.min(1,weightedRedundancy/0.30); // 30% overlap-weighted capital saturates capital signal
    const opportunity=Math.round(100*(0.45*countSignal+0.55*capitalSignal));

    let currentCost=0, modeledCost=0, costCoverage=0;
    for (const x of held) {
      const fee=fundExpenseCostPct(x.row);
      if (x.eur!=null && fee!=null) { currentCost += x.eur*fee/100; costCoverage += x.eur; }
    }
    for (const x of modeled) {
      const fee=fundExpenseCostPct(x.row);
      if (x.eur!=null && fee!=null) modeledCost += x.eur*fee/100;
    }
    const saving=(costCoverage>0 && modeledCost>0)?Math.max(0,currentCost-modeledCost):null;
    const label=opportunity>=75?'muito elevada':opportunity>=50?'elevada':opportunity>=25?'moderada':'baixa';
    return {clusters:clusterModels,cores,review,similarity,opportunity,label,weightedRedundancy,countReduction,currentCost,modeledCost,saving};
  }

  function renderPortfolioSimplification(held,totalValue) {
    if (!held?.length) return '';
    const m=portfolioSimplificationModel(held,totalValue);
    const eur=n=>new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(n);
    const coreHtml=m.cores.slice(0,14).map(x=>`<button class="simplification-core" data-fund-open="${escapeHtml(x.ticker)}"><b>${escapeHtml(x.ticker)}</b><small>${escapeHtml(x.role)}</small></button>`).join('');
    const reviewHtml=m.review.length?m.review.slice(0,14).map(x=>`<div class="simplification-review-row"><span><b>${escapeHtml(x.ticker)} → ${escapeHtml(x.core)}</b><small>${Number.isFinite(x.overlap)?pctFundWeight(x.overlap)+' overlap observado':'overlap indisponível'}${Number.isFinite(x.eur)?` · ${eur(x.eur)}`:''}</small></span><button data-fund-pair-a="${escapeHtml(x.core)}" data-fund-pair-b="${escapeHtml(x.ticker)}">Comparar</button></div>`).join(''):`<p class="muted">Não há candidatos claros a consolidação com overlap ≥30% nas holdings observadas.</p>`;
    const delta=Math.max(0,held.length-m.cores.length);
    const similarity=m.similarity==null?'—':(m.similarity*100).toFixed(0)+'%';
    const saving=m.saving!=null&&m.saving>0?`≈ ${eur(m.saving)}/ano`:'—';
    return `<article class="portfolio-simplification-panel">
      <div class="section-heading"><div><span class="eyebrow">PORTFOLIO SIMPLIFICATION</span><h4>Quantos ETFs acrescentam diversificação real?</h4></div><span class="simplification-score">${m.opportunity}<small>/100</small></span></div>
      <div class="simplification-meter"><i style="width:${m.opportunity}%"></i></div>
      <p class="simplification-summary">Oportunidade de simplificação <strong>${m.label}</strong>. Com as holdings observadas, ${delta?`há ${delta} ETF${delta===1?'':'s'} que parecem redundantes dentro de grupos semelhantes.`:'não há redução clara sugerida neste momento.'}</p>
      <div class="simplification-kpis">
        <div><span>ETFs atuais</span><strong>${held.length}</strong></div>
        <div><span>Estrutura candidata</span><strong>${m.cores.length}</strong><small>${delta?`−${delta} fundos`:'sem redução'}</small></div>
        <div><span>Similaridade look-through</span><strong>${similarity}</strong><small>apenas holdings observadas</small></div>
        <div><span>Poupança modelada</span><strong>${saving}</strong><small>expense ratio apenas</small></div>
      </div>
      <div class="simplification-grid">
        <section><span class="eyebrow">ESTRUTURA MAIS SIMPLES · CANDIDATOS A NÚCLEO</span><div class="simplification-cores">${coreHtml}</div></section>
        <section><span class="eyebrow">REVER / POSSÍVEL REDUNDÂNCIA</span><div class="simplification-review">${reviewHtml}</div></section>
      </div>
      <p class="fund-method-note">O score mede <strong>potencial de simplificação</strong>, não qualidade da carteira: quanto maior, maior a redundância observada. O modelo combina número de fundos potencialmente redundantes e capital overlap-weighted. A estrutura candidata realoca, apenas para simulação, cada grupo para o ETF com melhor heurística de custo, representatividade, AUM e cobertura. Antes de qualquer alteração confirma índice, tracking difference, UCITS/domicílio, moeda, distribuição/acumulação, fiscalidade, spreads e objetivos de cada posição.</p>
    </article>`;
  }

  function renderFundPortfolioIntel(allFunds) {
    if (!els.fundPortfolioIntel) return;
    const portfolio = lsGet(LS_PORTFOLIO);
    const byTicker = Object.fromEntries(allFunds.map(r => [r.ticker, r]));
    const held = Object.entries(portfolio).map(([ticker, entry]) => {
      const row = byTicker[ticker];
      if (!row) return null;
      const eur = positionValue(entry, row, true);
      const hmap = fundHoldingsMap(row);
      const coverage = [...hmap.values()].reduce((sum,h)=>sum+Number(h.weight||0),0);
      return { ticker, entry, row, eur: Number.isFinite(eur) && eur > 0 ? eur : null, hmap, coverage };
    }).filter(Boolean);

    if (!held.length) {
      els.fundPortfolioIntel.innerHTML = `<div class="fund-portfolio-empty"><p>Não tens ETFs rastreados na carteira atual. Importa a carteira em <strong>Portfolio</strong> para analisar overlap e concentração económica.</p><button data-open-portfolio>Ir para Portfolio →</button></div>`;
      els.fundPortfolioIntel.querySelector('[data-open-portfolio]')?.addEventListener('click', ()=>switchView('portfolio'));
      return;
    }

    const valued = held.filter(x=>x.eur != null);
    const totalValue = valued.reduce((s,x)=>s+x.eur,0);
    const withHoldings = held.filter(x=>x.hmap.size);
    const observedValue = totalValue ? valued.reduce((s,x)=>s + x.eur * Math.min(1, x.coverage),0) : 0;
    const observedCoverage = totalValue ? observedValue / totalValue : null;

    const feeRows = valued.filter(x=>fundExpenseCostPct(x.row)!=null);
    const feeValue = feeRows.reduce((s,x)=>s+x.eur,0);
    const weightedFee = feeValue ? feeRows.reduce((s,x)=>s+x.eur*fundExpenseCostPct(x.row),0)/feeValue : null;
    const annualFeeEur = feeRows.reduce((s,x)=>s + x.eur*(fundExpenseCostPct(x.row)/100),0);

    // Look-through exposure: a lower bound because FundsData generally returns top holdings only.
    const underlying = new Map();
    for (const f of valued) {
      for (const h of f.hmap.values()) {
        const symbol = String(h.symbol).toUpperCase();
        const weight = Number(h.weight)||0;
        if (!weight) continue;
        const prev = underlying.get(symbol) || { symbol, name:h.name||symbol, eur:0, funds:new Set() };
        prev.eur += f.eur * weight;
        prev.funds.add(f.ticker);
        underlying.set(symbol, prev);
      }
    }
    const lookThrough = [...underlying.values()].sort((a,b)=>b.eur-a.eur);
    const duplicates = lookThrough.filter(x=>x.funds.size>=2);
    const topUnderlying = lookThrough.slice(0,10);
    const top10Pct = totalValue ? topUnderlying.reduce((s,x)=>s+x.eur,0)/totalValue : null;
    const duplicatedPct = totalValue ? duplicates.reduce((s,x)=>s+x.eur,0)/totalValue : null;

    // Pairwise overlap among held ETFs.
    const pairs=[];
    for (let i=0;i<held.length;i++) for (let j=i+1;j<held.length;j++) {
      const ov=fundOverlap(held[i].row, held[j].row);
      if (ov) pairs.push({a:held[i].ticker,b:held[j].ticker,...ov});
    }
    pairs.sort((a,b)=>b.value-a.value);

    const topUnderlyingHtml = topUnderlying.length ? topUnderlying.map((x,i)=>{
      const pct=totalValue ? x.eur/totalValue*100 : null;
      const funds=[...x.funds];
      return `<div class="portfolio-lookthrough-row"><span><b>${i+1}. ${escapeHtml(x.symbol)}</b><small>${escapeHtml(x.name||x.symbol)} · ${funds.length} ETF${funds.length===1?'':'s'}</small></span><i><b style="width:${pct==null?4:Math.max(4,Math.min(100,pct*4))}%"></b></i><strong>${pct==null?'—':pct.toFixed(1)+'%'}</strong></div>`;
    }).join('') : '<p class="muted">As holdings dos ETFs da carteira ainda não estão disponíveis na fonte.</p>';

    const pairHtml = pairs.length ? pairs.slice(0,6).map(p=>`<button class="fund-overlap-pair" data-fund-pair-a="${escapeHtml(p.a)}" data-fund-pair-b="${escapeHtml(p.b)}"><span><b>${escapeHtml(p.a)} ↔ ${escapeHtml(p.b)}</b><small>cobertura observada ${pctFundWeight(p.coverageA)} / ${pctFundWeight(p.coverageB)}</small></span><strong>${pctFundWeight(p.value)}</strong></button>`).join('') : '<p class="muted">Sem pares com holdings observadas suficientes.</p>';

    const duplicateHtml = duplicates.length ? duplicates.slice(0,8).map(x=>`<div class="duplicate-holding"><span><b>${escapeHtml(x.symbol)}</b><small>${[...x.funds].slice(0,5).map(escapeHtml).join(' · ')}${x.funds.size>5?' · …':''}</small></span><strong>${totalValue ? (x.eur/totalValue*100).toFixed(1)+'%' : '—'}</strong></div>`).join('') : (held.length>=2 && withHoldings.length<2 ? '<p class="muted data-gap">Holdings insuficientes no dataset atual para testar duplicações entre ETFs.</p>' : '<p class="muted">Não detetei duplicações nas holdings observadas.</p>');

    els.fundPortfolioIntel.innerHTML = `
      <div class="section-heading"><div><span class="eyebrow">ETF PORTFOLIO INTELLIGENCE</span><h3>O que possuis realmente por baixo dos fundos</h3></div><span class="section-count">${held.length} ETF${held.length===1?'':'s'}</span></div>
      <p class="fund-method-note">Look-through calculado apenas nas holdings que a fonte devolve. As percentagens abaixo são portanto <strong>limites inferiores observados</strong>, não uma decomposição integral do portfolio.</p>
      <div class="fund-portfolio-kpis">
        <div><span>Valor ETF considerado</span><strong>${totalValue ? new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(totalValue) : '—'}</strong></div>
        <div><span>Cobertura look-through</span><strong>${observedCoverage==null?'—':(observedCoverage*100).toFixed(1)+'%'}</strong></div>
        <div><span>Expense ratio ponderado</span><strong>${weightedFee==null?'—':weightedFee.toFixed(2)+'%'}</strong><small>${feeValue ? `≈ ${new Intl.NumberFormat('pt-PT',{style:'currency',currency:'EUR',maximumFractionDigits:0}).format(annualFeeEur)}/ano` : ''}</small></div>
        <div><span>Exposição duplicada observada</span><strong>${duplicatedPct==null?'—':(duplicatedPct*100).toFixed(1)+'%'}</strong></div>
        <div><span>Top 10 subjacentes</span><strong>${top10Pct==null?'—':(top10Pct*100).toFixed(1)+'%'}</strong></div>
        <div><span>Holdings repetidas</span><strong>${duplicates.length}</strong></div>
      </div>
      ${renderFundReplacementIntel(held, allFunds, totalValue)}
      ${renderPortfolioSimplification(held,totalValue)}
      <div class="fund-portfolio-columns">
        <article><span class="eyebrow">ECONOMIC LOOK-THROUGH</span><h4>Maiores exposições observadas</h4><div class="portfolio-lookthrough-list">${topUnderlyingHtml}</div></article>
        <article><span class="eyebrow">OVERLAP HOTSPOTS</span><h4>ETFs mais semelhantes</h4><div class="fund-overlap-pairs">${pairHtml}</div></article>
      </div>
      <article class="duplicate-holdings-panel"><span class="eyebrow">DUPLICATE HOLDINGS</span><h4>Empresas repetidas entre vários ETFs</h4>${duplicateHtml}</article>
      ${renderFundConsolidation(held, totalValue)}
    `;

    els.fundPortfolioIntel.querySelectorAll('[data-fund-pair-a]').forEach(btn=>btn.addEventListener('click',()=>{
      const a=btn.dataset.fundPairA,b=btn.dataset.fundPairB;
      if (els.fundCompareA) els.fundCompareA.value=a;
      if (els.fundCompareB) els.fundCompareB.value=b;
      renderFundCompare();
      els.fundCompareResult?.scrollIntoView({behavior:'smooth',block:'center'});
    }));
    els.fundPortfolioIntel.querySelectorAll('[data-fund-open]').forEach(btn=>btn.addEventListener('click',()=>openDetail(btn.dataset.fundOpen)));
    els.fundPortfolioIntel.querySelectorAll('[data-replacement-simulate]').forEach(btn=>btn.addEventListener('click',()=>{
      try {
        const ops=JSON.parse(decodeURIComponent(btn.dataset.replacementSimulate||''));
        localStorage.setItem(LS_REBALANCE_DRAFT,JSON.stringify({source:'etf-replacement',createdAt:new Date().toISOString(),ops}));
        switchView('portfolio');
        setTimeout(()=>{
          const box=document.getElementById('portfolio-rebalance-box');
          if (box) box.open=true;
          els.portfolioRebalancingLab?.scrollIntoView({behavior:'smooth',block:'start'});
          renderPortfolio();
        },100);
      } catch {}
    }));
    els.fundPortfolioIntel.querySelectorAll('[data-consolidation-simulate]').forEach(btn=>btn.addEventListener('click',()=>{
      try {
        const ops=JSON.parse(decodeURIComponent(btn.dataset.consolidationSimulate||''));
        localStorage.setItem(LS_REBALANCE_DRAFT,JSON.stringify({source:'etf-consolidation',createdAt:new Date().toISOString(),ops}));
        switchView('portfolio');
        setTimeout(()=>{
          const box=document.getElementById('portfolio-rebalance-box');
          if (box) box.open=true;
          els.portfolioRebalancingLab?.scrollIntoView({behavior:'smooth',block:'start'});
          renderPortfolio();
        },100);
      } catch {}
    }));
  }

  function fundRankProfile(r, mode) {
    const fit = fundPortfolioFit(r);
    const meta = fundMeta(r);
    const fee = Number.isFinite(Number(r.expense_ratio)) ? Number(r.expense_ratio) : null;
    const aum = Number.isFinite(Number(r.fund_total_assets)) ? Number(r.fund_total_assets) : null;
    const name = `${r.ticker||''} ${r.name||''} ${r.fund_category||''}`.toLowerCase();
    const owned = isOwned(r.ticker);
    const ucits = fundUcitsStatus(r);
    const hasHoldings = fundHoldingsMap(r).size > 0;
    const base = fit.overall;
    let score = base, eligible = true, reasons=[];

    if (mode === 'core') {
      const broadish = meta.style === 'Broad' && !meta.themes.length;
      eligible = broadish || /world|global|all.?world|msci|s&p 500|stoxx|broad|total market/.test(name);
      score = fit.overall*.55 + fit.diversificationScore*.20 + fit.costScore*.15 + fit.sizeScore*.10;
      if (fit.role === 'Core') { score += 7; reasons.push('perfil Core'); }
      if (fit.role === 'Redundant') { score -= 14; reasons.push('overlap elevado na carteira'); }
      reasons.push(`Fund Fit ${fit.overall}`);
    } else if (mode === 'europe') {
      eligible = meta.geo === 'Europe' || /europe|stoxx|euro zone|eurozone|euro stoxx/.test(name);
      score = fit.overall*.60 + fit.costScore*.15 + fit.sizeScore*.15 + fit.diversificationScore*.10;
      reasons.push('exposição europeia', `Fit ${fit.overall}`);
    } else if (mode === 'ex-us') {
      const us = meta.geo === 'United States' || /\bus\b|united states|s&p 500|nasdaq/.test(name);
      const explicitEx = /ex[- ]?us|excluding us|world ex/.test(name);
      eligible = explicitEx || (!us && (meta.geo === 'Global' || meta.geo === 'Europe' || meta.geo === 'Emerging Markets' || /world|international|developed|emerging/.test(name)));
      score = fit.overall*.55 + fit.diversificationScore*.20 + fit.costScore*.15 + fit.sizeScore*.10;
      if (explicitEx) { score += 7; reasons.push('ex-US explícito'); } else reasons.push('não-US pela classificação disponível');
    } else if (mode === 'dividend') {
      eligible = meta.style === 'Dividend' || /dividend|income|yield/.test(name);
      score = fit.overall*.55 + fit.costScore*.15 + fit.sizeScore*.15 + fit.diversificationScore*.15;
      reasons.push('orientado a rendimento', `custo ${fee==null?'—':fee.toFixed(2)+'%'}`);
    } else if (mode === 'low-cost') {
      eligible = fee != null;
      score = fit.costScore*.55 + fit.overall*.25 + fit.sizeScore*.10 + fit.diversificationScore*.10;
      reasons.push(`TER ${fee==null?'—':fee.toFixed(2)+'%'}`, `Fit ${fit.overall}`);
    } else if (mode === 'diversifier') {
      eligible = true;
      const overlapPenalty = fit.maxOverlap == null ? 0 : Math.min(30, fit.maxOverlap*40);
      const diversifierBonus = fit.role === 'Diversifier' ? 12 : 0;
      score = fit.overall*.40 + fit.diversificationScore*.30 + fit.concentrationScore*.15 + fit.costScore*.15 + diversifierBonus - overlapPenalty;
      reasons.push(fit.maxOverlap==null?'overlap sem dados':`máx. overlap ${(fit.maxOverlap*100).toFixed(0)}%`, fit.role);
    }

    if (owned) { score += 2; reasons.push('já na carteira'); }
    if (ucits.status === 'confirmed') { score += 2; reasons.push('UCITS confirmado'); }
    if (!hasHoldings) score -= 4;
    if (aum != null && aum < 50e6) score -= 5;
    return {r, fit, meta, fee, aum, ucits, eligible, score:Math.max(0,Math.min(100,Math.round(score))), reasons};
  }

  function fundRankLabel(mode) {
    return ({core:'Best Core',europe:'Best Europe','ex-us':'Global ex-US',dividend:'Best Dividend','low-cost':'Best Low Cost',diversifier:'Best Diversifier'})[mode] || 'ETF ranking';
  }

  function renderFundRankings(allFunds) {
    if (!els.fundRankingResults) return;
    const mode = state.fundRank || 'core';
    els.fundRankingChips?.querySelectorAll('[data-fund-rank]').forEach(b=>b.classList.toggle('is-active',b.dataset.fundRank===mode));
    const ranked = allFunds.map(r=>fundRankProfile(r,mode)).filter(x=>x.eligible).sort((a,b)=>b.score-a.score || (a.fee??999)-(b.fee??999)).slice(0,8);
    if (!ranked.length) {
      els.fundRankingResults.innerHTML = `<div class="fund-ranking-empty"><p>Não há ETFs com dados suficientes para <strong>${escapeHtml(fundRankLabel(mode))}</strong> no universo atual.</p></div>`;
      return;
    }
    const cards = ranked.map((x,i)=>{
      const role=x.fit.role;
      const overlap=x.fit.maxOverlap==null?'—':`${Math.round(x.fit.maxOverlap*100)}%`;
      const badges=[x.ucits.status==='confirmed'?'UCITS':null, role, x.fee!=null?`${x.fee.toFixed(2)}% TER`:null].filter(Boolean);
      return `<article class="fund-rank-card">
        <div class="fund-rank-top"><span class="fund-rank-pos">#${i+1}</span><span class="fund-rank-score">${x.score}<small>/100</small></span></div>
        <button class="fund-rank-main" data-fund-open="${escapeHtml(x.r.ticker)}"><b>${escapeHtml(x.r.ticker)}</b><strong>${escapeHtml(x.r.name||'ETF')}</strong><small>${escapeHtml(x.meta.geo)} · ${escapeHtml(x.meta.style)}</small></button>
        <div class="fund-rank-badges">${badges.map(b=>`<span>${escapeHtml(b)}</span>`).join('')}</div>
        <div class="fund-rank-kpis"><div><span>Fit</span><b>${x.fit.overall}</b></div><div><span>Cost</span><b>${x.fit.costScore}</b></div><div><span>Overlap</span><b>${overlap}</b></div></div>
        <p>${escapeHtml(x.reasons.slice(0,3).join(' · '))}</p>
        <div class="fund-rank-actions"><button data-fund-open="${escapeHtml(x.r.ticker)}">Abrir dossier</button>${i>0?`<button data-fund-pair-a="${escapeHtml(ranked[0].r.ticker)}" data-fund-pair-b="${escapeHtml(x.r.ticker)}">Comparar com #1</button>`:''}</div>
      </article>`;
    }).join('');
    els.fundRankingResults.innerHTML = `<div class="fund-ranking-headline"><span>${escapeHtml(fundRankLabel(mode))}</span><small>Score contextual · usa apenas dados observados</small></div><div class="fund-rank-carousel">${cards}</div><p class="fund-method-note">O ranking é heurístico e contextual à carteira deste dispositivo. Combina Fund Fit, custo, dimensão, diversificação, concentração e overlap quando disponível. Confirma sempre KID/prospeto, índice, tracking difference, réplica, moeda e fiscalidade antes de decidir.</p>`;
    els.fundRankingResults.querySelectorAll('[data-fund-open]').forEach(btn=>btn.addEventListener('click',()=>{ const r=allFunds.find(x=>x.ticker===btn.dataset.fundOpen); if(r) openFundDetail(r); }));
    els.fundRankingResults.querySelectorAll('[data-fund-pair-a]').forEach(btn=>btn.addEventListener('click',()=>{
      if (els.fundCompareA) els.fundCompareA.value=btn.dataset.fundPairA;
      if (els.fundCompareB) els.fundCompareB.value=btn.dataset.fundPairB;
      renderFundCompare();
      els.fundCompareResult?.scrollIntoView({behavior:'smooth',block:'center'});
    }));
  }

  function renderFunds() {
    if (!state.data) return;
    const allFunds = state.data.stocks.filter(r => r.quote_type === "ETF");
    populateFundCompare(allFunds);

    const q = (els.fundsSearch?.value || "").trim().toUpperCase();
    const rows = allFunds.filter(r => {
      const m = fundMeta(r);
      if (state.fundTheme !== 'all' && !m.themes.includes(state.fundTheme)) return false;
      if (state.fundGeo !== 'all' && m.geo !== state.fundGeo) return false;
      if (state.fundStyle !== 'all' && m.style !== state.fundStyle) return false;
      if (q && !(r.ticker.toUpperCase().includes(q) || (r.name || "").toUpperCase().includes(q))) return false;
      return true;
    }).sort((a,b) => {
      const af = Number.isFinite(Number(a.expense_ratio)) ? Number(a.expense_ratio) : Infinity;
      const bf = Number.isFinite(Number(b.expense_ratio)) ? Number(b.expense_ratio) : Infinity;
      return af - bf || (a.ticker||'').localeCompare(b.ticker||'');
    });

    if (els.fundsCount) els.fundsCount.textContent = `${rows.length} de ${allFunds.length}`;
    renderFundRankings(allFunds);
    renderFundCards(rows);
    renderFundFeeSaver(allFunds);
    renderFundPortfolioIntel(allFunds);
    renderFundCompare();
  }

  function renderSmartMoney() {
    const hub=state.smartMoneyHubMode||'feed';
    els.smartmoneyHubModes?.querySelectorAll('[data-smartmoney-hub]').forEach(b=>b.classList.toggle('is-active',b.dataset.smartmoneyHub===hub));
    if(els.smartmoneyControls) els.smartmoneyControls.hidden = hub==='alerts';
    if(els.smartmoneyHealth) els.smartmoneyHealth.hidden = hub==='alerts';
    if(els.insiderAlertPanel) els.insiderAlertPanel.hidden = hub!=='alerts';
    if(els.insiderIntelligencePanel) els.insiderIntelligencePanel.hidden = hub!=='alerts';
    if(els.smartmoneyList) els.smartmoneyList.hidden = hub==='alerts';
    if(hub==='opportunities' && state.smartMoneyType==='all') state.smartMoneyType='opportunity';
    if(hub==='feed' && state.smartMoneyType==='opportunity') state.smartMoneyType='all';
    if (!state.data || !els.smartmoneyList) return;
    const quality = state.data.data_quality || {};
    const portfolio = lsGet(LS_PORTFOLIO);
    const owned = new Set(Object.keys(portfolio));
    const usRows = state.data.stocks.filter(r => r.quote_type !== "ETF" && !String(r.ticker || "").includes("."));
    const checkedRows = usRows.filter(r => r.insider_status === "ok" || typeof r.insider_form4_count_30d === "number");
    const degraded = usRows.filter(r => r.insider_status === "degraded").length;
    const withFilings = checkedRows.filter(r => Number(r.insider_form4_count_30d) > 0).length;
    const withPS = checkedRows.filter(r => Number(r.insider_buy_count_30d || 0) + Number(r.insider_sell_count_30d || 0) > 0).length;
    const coverage = usRows.length ? checkedRows.length / usRows.length * 100 : 0;

    if (els.smartmoneyHealth) {
      const pipelineCoverage = Number(quality.insider_sec_coverage_pct);
      const effectiveCoverage = Number.isFinite(pipelineCoverage) ? pipelineCoverage : coverage;
      const cls = effectiveCoverage >= 80 ? 'good' : effectiveCoverage >= 40 ? 'warn' : 'bad';
      els.smartmoneyHealth.innerHTML = `<div class="data-health-head"><div><span class="eyebrow">SEC DATA READINESS</span><strong>${Math.round(effectiveCoverage)}% cobertura</strong></div><span class="data-health-status ${cls}">${effectiveCoverage >= 80 ? 'operacional' : effectiveCoverage >= 40 ? 'parcial' : 'insuficiente'}</span></div><div class="data-health-grid"><div><strong>${checkedRows.length}</strong><span>empresas verificadas</span></div><div><strong>${withFilings}</strong><span>com Form 4 · 30d</span></div><div><strong>${withPS}</strong><span>com compra/venda P/S</span></div><div><strong>${degraded}</strong><span>filings degradados</span></div></div>${effectiveCoverage < 40 ? '<p class="data-health-warning">A SEC não foi recolhida com cobertura suficiente neste run. A ausência de sinais abaixo não deve ser interpretada como ausência de atividade insider.</p>' : ''}`;
    }

    if (els.smartmoneyScopeFilters) els.smartmoneyScopeFilters.querySelectorAll('[data-smartmoney-scope]').forEach(btn => btn.classList.toggle('is-active', btn.dataset.smartmoneyScope === state.smartMoneyScope));
    if (els.smartmoneyTypeFilters) els.smartmoneyTypeFilters.querySelectorAll('[data-smartmoney-type]').forEach(btn => btn.classList.toggle('is-active', btn.dataset.smartmoneyType === state.smartMoneyType));

    let rows = checkedRows.filter(r => state.smartMoneyScope !== 'portfolio' || owned.has(r.ticker));
    rows = rows.filter(r => {
      const buys = Number(r.insider_buy_count_30d || 0), sells = Number(r.insider_sell_count_30d || 0), net = Number(r.insider_net_value_30d || 0);
      if (state.smartMoneyType === 'buy') return buys > 0;
      if (state.smartMoneyType === 'sell') return sells > 0;
      if (state.smartMoneyType === 'netbuy') return net > 0;
      if (state.smartMoneyType === 'netsell') return net < 0;
      if (state.smartMoneyType === 'conviction') return insiderConviction(r).score >= 60;
      if (state.smartMoneyType === 'strongbuy') return insiderSignalUi(r)?.cls === 'strong';
      if (state.smartMoneyType === 'cluster') return insiderSignalUi(r)?.cls === 'cluster';
      if (state.smartMoneyType === 'nearlow') return buys > 0 && insiderNearLow(r)?.isNear;
      if (state.smartMoneyType === 'opportunity') return insiderOpportunityScore(r).score >= 65;
      return Number(r.insider_form4_count_30d || 0) > 0 || buys > 0 || sells > 0;
    }).sort((a,b)=>{
      const an = Number(a.insider_net_value_30d || 0), bn = Number(b.insider_net_value_30d || 0);
      if (state.smartMoneyType === 'opportunity') return insiderOpportunityScore(b).score - insiderOpportunityScore(a).score;
      if (state.smartMoneyType === 'conviction' || state.smartMoneyType === 'strongbuy' || state.smartMoneyType === 'cluster') return insiderConviction(b).score - insiderConviction(a).score;
      if (state.smartMoneyType === 'nearlow') return (insiderNearLow(a)?.pct ?? 999) - (insiderNearLow(b)?.pct ?? 999);
      if (state.smartMoneyType === 'sell' || state.smartMoneyType === 'netsell') return an - bn;
      if (bn !== an) return bn - an;
      return Number(b.insider_form4_count_30d||0)-Number(a.insider_form4_count_30d||0);
    }).slice(0,150);

    const opportunityLeaders = checkedRows
      .filter(r => state.smartMoneyScope !== 'portfolio' || owned.has(r.ticker))
      .map(r => ({r, opp: insiderOpportunityScore(r)}))
      .filter(x => x.opp.score >= 50)
      .sort((a,b) => b.opp.score - a.opp.score)
      .slice(0,3);
    const leadersHtml = opportunityLeaders.length ? `<section class="insider-opportunity-leaders"><div class="section-heading"><div><span class="eyebrow">INSIDER OPPORTUNITY RANKING</span><h3>Compras que merecem investigação</h3><p>Conviction insider + Quality + Value + Growth + contexto de preço. Não é recomendação de investimento.</p></div></div><div class="insider-opportunity-scroll">${opportunityLeaders.map(({r,opp},i)=>`<button class="insider-opportunity-card" data-ticker="${escapeHtml(r.ticker)}"><span>#${i+1} · ${escapeHtml(r.ticker)}</span><strong>${opp.score}<small>/100</small></strong><b>${escapeHtml(opp.label)}</b><p>${escapeHtml(opp.reasons.slice(0,3).join(' · '))}</p><div><em>Conv ${opp.components.conviction}</em><em>Q ${opp.components.quality}</em><em>V ${opp.components.value}</em></div></button>`).join('')}</div></section>` : '';

    els.smartmoneyList.innerHTML = rows.length ? leadersHtml + rows.map(r => {
      const net = r.insider_net_value_30d;
      const signal = net == null ? 'activity' : net > 0 ? 'buy' : net < 0 ? 'sell' : 'flat';
      const netText = net == null ? 'P/S indisponível' : `${net >= 0 ? '+' : '−'}${fmtMoney(Math.abs(net), r.currency || 'USD')}`;
      const latest = Array.isArray(r.insider_transactions) && r.insider_transactions.length ? r.insider_transactions[0] : null;
      const latestText = latest ? `${latest.type === 'buy' ? 'Compra' : 'Venda'} · ${latest.owner || 'Insider'}${latest.role ? ' · '+latest.role : ''}` : `${r.insider_form4_count_30d || 0} Form 4 nos últimos 30 dias`;
      const sigUi = insiderSignalUi(r);
      const conviction = insiderConviction(r);
      const nearLow = insiderNearLow(r);
      const opportunity = insiderOpportunityScore(r);
      const nearLowBadge = nearLow?.isNear ? `<span class="insider-signal-badge near-low">NEAR 52W LOW · +${nearLow.pct.toFixed(1)}%</span>` : '';
      return `<article class="intel-card smartmoney-card ${signal}" data-ticker="${escapeHtml(r.ticker)}"><div><span class="eyebrow">${escapeHtml(r.ticker)}</span>${sigUi?`<span class="insider-signal-badge ${sigUi.cls}">${escapeHtml(sigUi.label)}</span>`:''}${nearLowBadge}<h3>${escapeHtml(r.name || r.ticker)}</h3><p>${escapeHtml(latestText)}</p>${conviction.score?`<div class="conviction-inline ${conviction.direction}"><span>Conviction</span><strong>${conviction.score}/100</strong><small>${escapeHtml(conviction.label)} · ${escapeHtml(conviction.reasons.slice(0,3).join(' · '))}</small></div>`:''}${opportunity.score?`<div class="opportunity-inline"><span>Insider Opportunity</span><strong>${opportunity.score}/100</strong><small>${escapeHtml(opportunity.label)} · ${escapeHtml(opportunity.reasons.slice(0,3).join(' · '))}</small></div>`:''}</div><div class="smartmoney-stats"><div><strong>${r.insider_buy_count_30d ?? '—'}</strong><span>compras P</span></div><div><strong>${r.insider_sell_count_30d ?? '—'}</strong><span>vendas S</span></div><div><strong class="${net != null && net >= 0 ? 'positive-text' : net != null ? 'negative-text' : ''}">${netText}</strong><span>fluxo líquido</span></div><div><strong>${conviction.score||'—'}</strong><span>conviction</span></div></div></article>`;
    }).join("") : `<p class="empty-state">${state.smartMoneyScope === 'portfolio' ? 'Nenhuma posição da carteira cumpre este filtro insider nos últimos 30 dias.' : 'Nenhuma empresa cumpre este filtro insider nos últimos 30 dias.'}</p>`;
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

  function stockCompareMetric(r, key) {
    const map = {
      score: r.score,
      quality: r.quality_pct,
      growth: r.growth_pct,
      profitability: r.profitability_pct ?? r.quality_pct,
      cash: r.cashflow_pct ?? r.balance_pct,
      stability: r.stability_pct,
      value: r.value_pct,
      insider: insiderConvictionScore(r)?.score ?? null,
      estimates: r.analyst_score ?? r.revision_score ?? null,
    };
    const v = Number(map[key]);
    return Number.isFinite(v) ? Math.max(0, Math.min(100, v)) : null;
  }

  function stockCompareVerdict(picks) {
    if (!picks.length) return null;
    const weights = { score:.18, quality:.16, growth:.13, profitability:.13, cash:.10, stability:.10, value:.12, insider:.04, estimates:.04 };
    const ranked = picks.map(r => {
      let total=0, used=0;
      for (const [k,w] of Object.entries(weights)) {
        const v=stockCompareMetric(r,k); if(v==null) continue; total += v*w; used += w;
      }
      return {r, composite: used ? total/used : 0, coverage: used};
    }).sort((a,b)=>b.composite-a.composite);
    const first=ranked[0], second=ranked[1];
    if (!first) return null;
    const strengths=[];
    const metrics=[['quality','qualidade'],['profitability','rentabilidade'],['growth','crescimento'],['value','valuation'],['cash','cash/balanço'],['stability','estabilidade']];
    const best={};
    for(const [k] of metrics){ const vals=ranked.map(x=>[x.r,stockCompareMetric(x.r,k)]).filter(([,v])=>v!=null); if(vals.length){const m=Math.max(...vals.map(x=>x[1]));best[k]=vals.filter(x=>x[1]===m).map(x=>x[0].ticker);} }
    for(const [k,label] of metrics) if((best[k]||[]).includes(first.r.ticker)) strengths.push(label);
    const gap = second ? first.composite-second.composite : null;
    let tone='mixed', title=`${first.r.ticker} lidera a comparação`;
    if(gap!=null && gap>=8){tone='good'; title=`${first.r.ticker} tem a vantagem multifator mais clara`;}
    else if(gap!=null && gap<3){title=`${first.r.ticker} lidera, mas a diferença é pequena`;}
    const reason = strengths.length ? `Vence sobretudo em ${strengths.slice(0,3).join(', ')}.` : 'A vantagem resulta do conjunto dos fatores com dados disponíveis.';
    return {first, second, gap, tone, title, reason, ranked};
  }

  function formatGrowthRate(v) { const n=Number(v); if(!Number.isFinite(n)) return '—'; const x=Math.abs(n)<=3 ? n*100 : n; return `${x>=0?'+':''}${x.toFixed(1)}%`; }

  function renderCompare() {
    if (!state.data) return;
    const raw = (els.compareInput?.value || "").split(/[,;]+/).map(s => s.trim()).filter(Boolean).slice(0, 8);
    if (!raw.length) { els.compareList.innerHTML = '<p class="empty-state">Escreve até 8 tickers ou nomes de empresas, separados por vírgulas.</p>'; return; }

    const picks = [];
    const misses = [];
    const seen = new Set();
    for (const term of raw) {
      const hit = resolveCompareTicker(term);
      if (hit && hit.quote_type !== 'ETF' && !seen.has(hit.ticker)) { picks.push(hit); seen.add(hit.ticker); }
      else if (!hit) misses.push(term);
    }
    if (!picks.length) { els.compareList.innerHTML = '<p class="empty-state">Nenhuma empresa encontrada no universo atual.</p>'; return; }

    const portfolio = loadPortfolio();
    const portfolioFits = Object.fromEntries(picks.map(r=>[r.ticker,portfolioFitSnapshot(r,portfolio,state.data.stocks)]));
    const hasPortfolioFit = Object.values(portfolioFits).some(Boolean);
    const metricDefs=[['score','Score'],['quality','Quality'],['profitability','Profit'],['growth','Growth'],['cash','Cash'],['stability','Stable'],['value','Value'],['insider','Insider'],['estimates','Estimates']];
    if(hasPortfolioFit) metricDefs.push(['portfolioFit','Portfolio Fit']);
    const best={};
    for(const [k] of metricDefs){ const vals=picks.map(r=>[r,k==='portfolioFit' ? portfolioFits[r.ticker]?.fit ?? null : stockCompareMetric(r,k)]).filter(([,v])=>v!=null); if(vals.length){const m=Math.max(...vals.map(x=>x[1]));best[k]=new Set(vals.filter(x=>x[1]===m).map(x=>x[0].ticker));} }
    const verdict=stockCompareVerdict(picks);
    const decision = verdict ? `<section class="stock-compare-verdict ${verdict.tone}"><span class="eyebrow">DECISION VIEW</span><h3>${escapeHtml(verdict.title)}</h3><p>${escapeHtml(verdict.reason)} ${verdict.gap!=null?`Vantagem composta: ${verdict.gap.toFixed(1)} pts.`:''}</p><div class="stock-compare-leader"><strong>${escapeHtml(verdict.first.r.ticker)}</strong><span>${verdict.first.composite.toFixed(0)}/100 composite</span><button data-compare-open="${escapeHtml(verdict.first.r.ticker)}">Abrir dossier →</button></div></section>` : '';

    const table = `<div class="stock-compare-table-wrap"><div class="stock-compare-table" style="--compare-cols:${picks.length}"><div class="stock-compare-head"><span>Métrica</span>${picks.map(r=>`<button data-compare-open="${escapeHtml(r.ticker)}"><b>${escapeHtml(r.ticker)}</b><small>${escapeHtml(r.name||'')}</small></button>`).join('')}</div>${metricDefs.map(([k,l])=>`<div class="stock-compare-row"><span>${escapeHtml(l)}</span>${picks.map(r=>{const v=k==='portfolioFit' ? portfolioFits[r.ticker]?.fit ?? null : stockCompareMetric(r,k); const win=best[k]?.has(r.ticker); return `<strong class="${win?'is-best':''}">${v==null?'—':Math.round(v)}${win?'<small>BEST</small>':''}</strong>`}).join('')}</div>`).join('')}</div></div>`;

    const fundamentals = picks.map(r=>`<article class="stock-compare-mini"><div><span class="eyebrow">${escapeHtml(r.ticker)}</span><h4>${escapeHtml(r.name||r.ticker)}</h4></div><div class="stock-compare-mini-grid"><span>Fwd P/E<b>${fmtRatio(r.forward_pe)}</b></span><span>Market cap<b>${r.market_cap!=null?new Intl.NumberFormat('en',{notation:'compact',maximumFractionDigits:1}).format(r.market_cap):'—'}</b></span><span>Rev growth<b>${r.revenue_growth!=null?formatGrowthRate(r.revenue_growth):'—'}</b></span><span>EPS growth<b>${r.earnings_growth!=null?formatGrowthRate(r.earnings_growth):'—'}</b></span></div><button data-compare-open="${escapeHtml(r.ticker)}">Deep dive</button></article>`).join('');

    const thesis = picks.map(r=>`<article class="stock-compare-thesis"><div><b>${escapeHtml(r.ticker)}</b>${thesisDirectionBadge(r)}</div><p>${escapeHtml(r.thesis_summary||'Sem tese resumida disponível.')}</p><small>${escapeHtml(r.sector||'Setor não disponível')}</small></article>`).join('');

    const portfolioImpact = hasPortfolioFit ? picks.map(r=>{const pf=portfolioFits[r.ticker]; if(!pf) return ''; return `<article class="stock-compare-portfolio-card"><div><span class="eyebrow">${escapeHtml(r.ticker)}</span><strong>${Math.round(pf.fit)}<small>/100</small></strong></div><h4>${escapeHtml(pf.label)}</h4><div class="stock-compare-portfolio-grid"><span>Setor atual<b>${pf.sectorPct.toFixed(1)}%</b></span><span>Via ETFs<b>${pf.hiddenPct.toFixed(1)}%</b></span><span>Diversificação<b>${Math.round(pf.diversification)}</b></span><span>Direto<b>${pf.directPct.toFixed(1)}%</b></span></div><p>${escapeHtml(pf.reasons.slice(0,3).join(' · ')||'Sem concentração material observada.')}</p><button data-compare-open="${escapeHtml(r.ticker)}">Ver no dossier</button></article>`}).join('') : '';

    const missNote = misses.length ? `<p class="unmatched-note">Não encontrado no universo rastreado: ${misses.map(escapeHtml).join(", ")}</p>` : "";
    els.compareList.innerHTML = `${decision}<details class="stock-compare-box" open><summary><div><b>Scorecard multifator</b><span>BEST por pilar${hasPortfolioFit?' · inclui Portfolio Fit':''}</span></div></summary>${table}</details>${hasPortfolioFit?`<details class="stock-compare-box stock-compare-portfolio-box"><summary><div><b>Impacto na tua carteira</b><span>concentração · overlap · diversificação</span></div></summary><div class="stock-compare-portfolio-list">${portfolioImpact}</div><p class="detail-note">Portfolio Fit é estrutural e independente do tamanho de uma nova compra. Serve para comparar encaixe, não para definir posição.</p></details>`:''}<details class="stock-compare-box"><summary><div><b>Fundamentais</b><span>valuation · crescimento · dimensão</span></div></summary><div class="stock-compare-mini-list">${fundamentals}</div></details><details class="stock-compare-box"><summary><div><b>Tese & contexto</b><span>trajetória e resumo</span></div></summary><div class="stock-compare-thesis-list">${thesis}</div></details>${missNote}`;
    els.compareList.querySelectorAll('[data-compare-open]').forEach(btn=>btn.addEventListener('click',()=>openDetail(btn.dataset.compareOpen)));
  }



  if (els.stockPerspectives) {
    els.stockPerspectives.querySelectorAll('[data-stock-perspective]').forEach(btn=>btn.addEventListener('click',()=>{
      state.stockPerspective=btn.dataset.stockPerspective || 'overview';
      state.stockCustomColumns=null;
      if(els.sortBy) els.sortBy.value='perspective';
      els.stockPerspectives.querySelectorAll('[data-stock-perspective]').forEach(b=>b.classList.toggle('is-active',b===btn));
      renderStockTableHead(); renderStockColumnsPanel(); applyFilters();
    }));
  }
  on(els.stockColumnsBtn,'click',()=>{ if(!els.stockColumnsPanel) return; els.stockColumnsPanel.hidden=!els.stockColumnsPanel.hidden; if(!els.stockColumnsPanel.hidden) renderStockColumnsPanel(); });


  on(els.sectorLabSector,'change',()=>{
    state.sectorDeepDive=null;
    if(els.stocksSectorFilter) els.stocksSectorFilter.value=els.sectorLabSector.value;
    applyFilters();
  });
  if(els.sectorLabModes) els.sectorLabModes.querySelectorAll('[data-sector-mode]').forEach(btn=>btn.addEventListener('click',()=>{
    state.sectorLabMode=btn.dataset.sectorMode || 'discover';
    renderSectorIntelligence((state.data?.stocks||[]).filter(r=>r.quote_type!=='ETF'&&!isAustralianScannerRow(r)));
  }));

  els.stockDiscoverCategories?.querySelectorAll('[data-discover-preset]').forEach(btn=>btn.addEventListener('click',()=>{
    state.stockDiscoverPreset=btn.dataset.discoverPreset||'compounders';
    renderStockDiscover((state.data?.stocks||[]).filter(r=>r.quote_type!=='ETF'&&!isAustralianScannerRow(r)));
  }));

  function bindStockAutocomplete(input, syncInput) {
    if (!input) return;
    let box = input.parentElement?.querySelector('.stock-autocomplete-box');
    if (!box) {
      box = document.createElement('div');
      box.className = 'stock-autocomplete-box';
      box.hidden = true;
      input.parentElement?.appendChild(box);
    }
    const update = () => {
      if (!state.data?.stocks) return;
      const q = input.value.trim().toUpperCase();
      if (!q) { box.hidden = true; box.innerHTML = ''; return; }
      const matches = state.data.stocks
        .filter(r => r.quote_type !== 'ETF' && !isAustralianScannerRow(r))
        .filter(r => `${r.ticker} ${r.name||''}`.toUpperCase().includes(q))
        .sort((a,b) => (a.ticker.toUpperCase().startsWith(q)?-1:0) - (b.ticker.toUpperCase().startsWith(q)?-1:0) || (b.score??0)-(a.score??0))
        .slice(0,7);
      box.innerHTML = matches.map(r => `<button type="button" data-stock-suggest="${escapeHtml(r.ticker)}"><strong>${escapeHtml(r.ticker)}</strong><span>${escapeHtml(r.name||'')}</span><em>${r.score==null?'—':Number(r.score).toFixed(0)}</em></button>`).join('');
      box.hidden = !matches.length;
      box.querySelectorAll('[data-stock-suggest]').forEach(btn=>btn.addEventListener('mousedown',e=>e.preventDefault()));
      box.querySelectorAll('[data-stock-suggest]').forEach(btn=>btn.addEventListener('click',()=>{
        input.value = btn.dataset.stockSuggest;
        if(syncInput) syncInput.value = input.value;
        box.hidden = true;
        applyFilters();
        input.focus({preventScroll:true});
      }));
    };
    input.addEventListener('input', update);
    input.addEventListener('focus', update);
    input.addEventListener('keydown', e => {
      if ((e.key === 'Enter' || e.key === 'Tab') && !box.hidden) {
        const first = box.querySelector('[data-stock-suggest]');
        if (first) { e.preventDefault(); first.click(); }
      }
      if (e.key === 'Escape') box.hidden = true;
    });
    input.addEventListener('blur',()=>setTimeout(()=>{box.hidden=true},120));
  }

  on(els.stockHeroSearch, "input", () => { if(els.search){ els.search.value=els.stockHeroSearch.value; applyFilters(); } });
  bindStockAutocomplete(els.stockHeroSearch, els.search);
  bindStockAutocomplete(els.search, els.stockHeroSearch);
  on(els.stockFiltersBtn, "click", () => { if(els.stockAdvancedFilters) els.stockAdvancedFilters.hidden = !els.stockAdvancedFilters.hidden; });
  [els.stockMinScore,els.stockMinQuality,els.stockMinGrowth,els.stockMinValue,els.stockMinCap,els.stockMaxFpe].forEach(el=>on(el,"input",applyFilters));
  on(els.stockClearFilters, "click", () => {
    [els.stockMinScore,els.stockMinQuality,els.stockMinGrowth,els.stockMinValue,els.stockMaxFpe].forEach(el=>{if(el)el.value="";});
    if(els.stockMinCap) els.stockMinCap.value="0";
    state.stockPreset="all";
    applyFilters();
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

  els.smartmoneyHubModes?.querySelectorAll('[data-smartmoney-hub]').forEach(btn => btn.addEventListener('click', () => {
    state.smartMoneyHubMode = btn.dataset.smartmoneyHub || 'feed';
    if (state.smartMoneyHubMode === 'opportunities') state.smartMoneyType = 'opportunity';
    else if (state.smartMoneyHubMode === 'feed' && state.smartMoneyType === 'opportunity') state.smartMoneyType = 'all';
    renderSmartMoney();
  }));

  if (els.smartmoneyScopeFilters) els.smartmoneyScopeFilters.querySelectorAll("[data-smartmoney-scope]").forEach(btn => btn.addEventListener("click", () => {
    state.smartMoneyScope = btn.dataset.smartmoneyScope;
    renderSmartMoney();
  }));
  if (els.smartmoneyTypeFilters) els.smartmoneyTypeFilters.querySelectorAll("[data-smartmoney-type]").forEach(btn => btn.addEventListener("click", () => {
    state.smartMoneyType = btn.dataset.smartmoneyType;
    renderSmartMoney();
  }));

  on(els.insiderAlertToggle, "click", () => toggleInsiderAlerts().catch(err=>console.warn("notification permission failed",err)));
  on(els.exportAlertWatchlist, "click", () => { exportAlertWatchlist(); setTimeout(()=>alert('Watchlist exportada como alert_watchlist.json. Agora substitui data/alert_watchlist.json no GitHub e faz Commit changes. As instruções completas estão logo abaixo deste botão.'),120); });
  refreshInsiderAlertUi();

  on(els.portfolioImportTrigger, "click", () => {
    if (!els.portfolioFile) return;
    els.portfolioFile.value = "";
    try {
      if (typeof els.portfolioFile.showPicker === "function") els.portfolioFile.showPicker();
      else els.portfolioFile.click();
    } catch { els.portfolioFile.click(); }
  });
  on(els.portfolioFile, "change", (e) => {
    const file = e.target.files?.[0];
    if (file) handlePortfolioFile(file);
  });

  on(els.portfolioClear, "click", () => {
    if (!confirm("Limpar todo o portfolio importado/marcado?")) return;
    try { localStorage.setItem(LS_PORTFOLIO, "{}"); localStorage.setItem(LS_PORTFOLIO_BACKUP, "{}"); } catch {}
    setPortfolioImportStatus("Portfolio removido deste dispositivo.", "neutral");
    renderPortfolio();
  });

  els.newsSearch?.addEventListener("keydown", (e) => { if (e.key === "Enter") renderNews(); });
  els.newsSearch?.addEventListener("blur", renderNews);

  els.compareInput?.addEventListener("input", renderCompare);

  [els.fundsSearch].filter(Boolean).forEach(el => el.addEventListener("input", renderFunds));
  els.fundRankingChips?.addEventListener("click", (e)=>{ const b=e.target.closest("[data-fund-rank]"); if(!b) return; state.fundRank=b.dataset.fundRank; renderFunds(); });
  els.fundThemeFilters?.querySelectorAll('[data-fund-theme]').forEach(btn => btn.addEventListener('click', () => {
    state.fundTheme = btn.dataset.fundTheme;
    els.fundThemeFilters.querySelectorAll('[data-fund-theme]').forEach(x => x.classList.toggle('is-active', x === btn));
    renderFunds();
  }));
  els.fundGeoFilters?.querySelectorAll('[data-fund-geo]').forEach(btn => btn.addEventListener('click', () => {
    state.fundGeo = btn.dataset.fundGeo;
    els.fundGeoFilters.querySelectorAll('[data-fund-geo]').forEach(x => x.classList.toggle('is-active', x === btn));
    renderFunds();
  }));
  els.fundStyleFilters?.querySelectorAll('[data-fund-style]').forEach(btn => btn.addEventListener('click', () => {
    state.fundStyle = btn.dataset.fundStyle;
    els.fundStyleFilters.querySelectorAll('[data-fund-style]').forEach(x => x.classList.toggle('is-active', x === btn));
    renderFunds();
  }));
  on(els.fundCompareA, 'change', renderFundCompare);
  on(els.fundCompareB, 'change', renderFundCompare);

  on(els.stocksSectorFilter, "change", () => { if(els.sectorLabSector && els.stocksSectorFilter.value) els.sectorLabSector.value=els.stocksSectorFilter.value; });

  [els.search, els.marketFilter, els.stocksSectorFilter, els.sortBy, els.zombieOnly, els.watchlistOnly].filter(Boolean).forEach(el => {
    el.addEventListener("input", applyFilters);
    el.addEventListener("change", applyFilters);
  });

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("sw.js?v=0.80.0").then(reg => reg.update()).catch(err => console.warn("SW registration failed", err));
    });
  }

  load();
  loadMetals();
  loadMetalsBrief();
  loadFx();
  loadFxHistory();
  loadHistory();
  loadValuationHistory();
  loadThesisHistory();
  loadNews();
})();
