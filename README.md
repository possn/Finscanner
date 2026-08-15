# v0.50.0 — Sector Intelligence · Discover / Compare / Deep Dive

Nova camada no Stock Scanner inspirada na navegação Winston: selecionar um setor, descobrir líderes, comparar até 6 empresas head-to-head e abrir um deep dive contextual sem sair da comparação.

- Discover: top empresas do setor com Score, Quality, Growth e Value.
- Compare: Score + Profit + Cash + Stable + Value + Quality; o melhor valor de cada coluna é marcado.
- Deep Dive: cinco pilares, key metrics, insider 30d, próxima earnings e acesso ao dossier completo.
- Watchlist: vista setorial apenas das empresas guardadas.
- O seletor setorial sincroniza com o filtro principal do Stock Radar.

Ficheiros a substituir: `index.html`, `app.js`, `style.css`, `sw.js`, `README.md`.

---

# v0.49.1 — SEC Validation Hotfix

- SEC insider coverage is now treated as auxiliary/degradable data and no longer blocks publication of an otherwise valid daily dataset.
- `degraded` SEC rows count as checked issuers for diagnostics, but remain distinct from fully parsed (`ok`) rows.
- The workflow emits GitHub warnings when SEC coverage is low instead of exiting with code 1.
- Updated GitHub Actions runtime to `actions/checkout@v5` and `actions/setup-python@v6` to remove the Node 20 deprecation warning.
- No scoring or frontend behavior changed.

# Finscanner v0.47.1 — Earnings & Estimate Intelligence + ETF Holdings Hotfix

## v0.47.1 hotfix

Corrige um crash do pipeline em `scripts/score.py`: `top_holdings` é atualmente armazenado como lista de objetos `{symbol, name, weight}`, enquanto o scoring de exposição temática ainda tentava desempacotar cada holding como `(symbol, weight)`. O parser passa a aceitar ambos os formatos e ignora entradas malformadas sem abortar o run diário.


Esta release acrescenta ao Stock Scanner uma camada Winston-like de expectativas: consenso de EPS e revenue, revisões a 30 dias, última surpresa de resultados, distribuição de recomendações e price targets. Estes dados são **contexto** e não entram no score principal, porque a cobertura de analistas varia materialmente entre mercados e empresas.

No screener existem agora o preset **Revisions ↑**, a perspetiva **Estimates** e colunas selecionáveis para revisão de EPS, surpresa, target upside e crescimento forward. O dossier individual inclui um bloco **Analyst Intelligence** com cobertura explícita e nunca interpreta ausência de dados como sinal negativo.

O pipeline faz esta recolha numa segunda passagem limitada: posições do portfolio têm prioridade e o restante orçamento é preenchido com empresas de maior score/market cap. Isto mantém o workflow diário finito.

# Finscanner v0.45.0 — Financial Story Dossier

# Finscanner v0.32.0 — Portfolio Action Layer

Esta release transforma a análise estrutural do portfolio numa camada de prioridades de revisão. O motor cruza peso económico, concentração setorial, clusters de ETFs, teses a piorar e exposição zombie para ordenar onde uma revisão pode ter maior impacto. Não executa ordens nem apresenta as prioridades como recomendações automáticas de compra/venda.

# Finscanner v0.23.0 — Fund Holdings Intelligence

This release deepens the Funds experience with Yahoo/yfinance FundsData metadata, a fund-specific dossier, observed top-holdings overlap, asset/sector mix, AUM/family/category metadata, and a more defensible Fee Saver. Overlap is explicitly a lower bound over the holdings returned by the source, never presented as full-portfolio overlap unless full holdings are available.

# Finscanner v0.22.1 — Home Dashboard + Funds Intelligence

Home simplificada e novo ETF Intelligence Engine (temas, geografia, estilo, Fee Saver e head-to-head).

## v0.13.0 — REIT Native Pack

Adds a sector-native REIT layer using public statement-derived **FFO proxy**, **P/FFO proxy**, **FFO payout proxy** and **net debt / EBITDA**. The REIT score now ranks those metrics against REIT peers rather than applying general-company P/E/FCF logic. AFFO, NAV and occupancy remain explicitly unavailable until specialist data sources are integrated.

> Methodology boundary: `reit_ffo_proxy` is not reported FFO. It is an explainable GAAP-statement proxy (net income + D&A + available signed sale gain/loss adjustment). It must not be presented as AFFO.

## v0.12.0 — Bank Native Pack

The bank model now consumes statement-derived banking metrics rather than relying only on generic equity ratios. New fields include net interest income and YoY growth, an operating-efficiency proxy, credit-loss provision intensity, and an equity/assets capitalisation proxy. These inputs feed the bank-specific score dimensions.

Data-integrity rule: CET1/Tier 1, NPL ratio and regulatory net charge-offs are **not inferred** from generic financial statements. They remain explicitly unavailable until a regulatory data source is integrated. The UI labels all derived figures as proxies where appropriate.

## v0.11.0 — Sector-Aware Scoring

Banks, REITs and insurers now use explicit specialist proxy score packs instead of being forced through the general-company factor mix. The UI states which model is active and its limitations. Specialist confidence is capped at medium until native metrics (CET1/NPL, FFO/AFFO/NAV, combined ratio/solvency) are integrated.

# Finscanner

PWA pessoal de scanning/scoring de ações e ETFs, inspirada na app Winston,
construída inteiramente sobre **fontes de dados gratuitas**. Sem chaves de
API pagas, sem subscrição, sem backend a correr — apenas GitHub Actions
(grátis para repos públicos) + um site estático.

## Arquitetura

```
Universo (US screener + índices AU/PL/UK/Europa via Wikipedia)
        │
        ▼
yfinance (fundamentais)          SEC EDGAR (Form 4, só EUA)
        │                                 │
        ▼                                 │
   scripts/score.py  ◄─────────────────────
        │
        ▼
   data/stocks.json   (committed pelo GitHub Actions, diariamente)
        │
        ▼
   PWA estática (index.html / app.js / style.css) — lê o JSON, zero chamadas
   externas no browser
```

A PWA nunca chama nenhuma API diretamente — evita CORS, evita expor rate
limits ao browser, e mantém tudo gratuito (o processamento pesado corre
uma vez por dia no Actions, não a cada visita).

## Correr localmente

```bash
cd scripts
pip install -r requirements.txt
python run.py          # escreve ../data/stocks.json
cd ..
python -m http.server 8000   # abre http://localhost:8000
```

## Publicar (GitHub Pages / Cloudflare Pages)

Site estático puro — root do repo, sem build step. Em GitHub Pages: Settings
→ Pages → Deploy from branch → `main` / root. Em Cloudflare Pages: build
command vazio, output directory `/`.

O workflow `.github/workflows/update-data.yml` corre todos os dias às
06:15 UTC, regenera `data/stocks.json` e faz commit automático — não
precisas de fazer nada depois do primeiro deploy.

## Funcionalidades

- **Ações/ETFs**: score composto, zombie detector, insider signals (SEC EDGAR, só EUA), fee audit e AI exposure (ETFs, best-effort)
- **Europa**: DAX, CAC 40, AEX, IBEX 35, FTSE MIB e SMI (Yahoo suffixes via yfinance)
- **Intelligence**: tabs de Notícias do portfolio, Smart Money (atividade SEC Form 4) e comparação até 4 tickers
- **ETFs**: workspace dedicado aos fundos presentes no universo rastreado
- **Metais**: ouro/prata/cobre/platina/paládio (futuros) + urânio (proxy ETF), preço, variação diária, volatilidade
- **Watchlist**: marca tickers com ★, filtra por "só watchlist" — guardado em `localStorage`, só neste dispositivo
- **Portfolio ("O meu")**: marca posições que possuis, vê resumo agregado (score médio, zombies na carteira, expense ratio médio, exposição AI média) — também só `localStorage`
- **Histórico de score**: `data/history.json` acumula o score diário por ticker (até 120 dias); aparece como sparkline no detalhe de cada ticker assim que houver ≥2 dias de dados

## O que falta em relação à Winston (deliberadamente, ver conversa de build)

- **Sem "Ledger"** (briefing diário em linguagem natural) — precisaria de LLM, o que deixa de ser gratuito. Decisão explícita: manter 100% grátis.
- **Sem sync entre dispositivos** — portfolio/watchlist vivem só no browser que os criou (`localStorage`). Sincronizar exigiria uma conta+backend.
- **Cobertura ainda não é "milhares"** — yfinance exige uma chamada por ticker para fundamentais; escalar para milhares tornaria a run diária impraticavelmente longa/arriscada (rate limiting da Yahoo). ~800-900 tickers é o equilíbrio atual.
- **Insider signals sem direção** — só contagem de filings Form 4, não distingue compra/venda/opções.



- **Score composto (0–100)**: média ponderada de 4 dimensões (rentabilidade
  30%, alavancagem/solvência 30%, valorização 20%, estabilidade 20%),
  cada uma normalizada por percentil dentro do universo recolhido nesse
  dia. **Não validado, não sujeito a backtest.** Ver `scripts/score.py`
  para a fórmula exata — é código, não caixa-preta.
- **Zombie detector**: cobertura de juros (EBIT/despesa de juros) < 1×.
  Se faltar EBIT ou despesa de juros, o estado é `unknown`, nunca "não é
  zombie" por omissão.
- **Insider signals**: contagem de filings Form 4 nos últimos 30 dias via
  SEC EDGAR. **Só EUA** — é uma contagem de atividade, não distingue
  compra de venda nem opções exercidas. AU/PL/UK/Europa ficam `not_available`
  por não existir equivalente gratuito unificado a EDGAR.
- **Fee audit / AI exposure**: dados de holdings de ETF via yfinance são
  inconsistentes (`funds_data.top_holdings` nem sempre disponível fora
  de grandes ETFs US). Tratado como *best-effort* — ausência de dado é
  mostrada como tal, não como zero.
- **Universo internacional**: constituintes de índice raspados de tabelas
  da Wikipedia (ASX 200, WIG20, FTSE 100). É uma aproximação prática, não
  uma fonte oficial — pode desatualizar-se quando os índices mudam de
  composição.

## Isto não é aconselhamento financeiro

Ferramenta de organização pessoal de dados públicos. O score não foi
validado estatisticamente. Confirma sempre os números na fonte primária
antes de qualquer decisão.

## v0.6 — Growth Intelligence & Smart Money

- SEC Form 4 passa a usar uma janela temporal real de 30 dias.
- O parser distingue apenas compras open-market (`P`) e vendas open-market (`S`). Awards, vesting, gifts e exercícios de opções não são tratados como compras/vendas.
- O dossier mostra contagem, valor comprado, valor vendido, fluxo líquido e até 8 transações recentes interpretáveis.
- Growth Intelligence usa até 5 trimestres para comparar receita, lucro líquido e diluted average shares com o trimestre homólogo.
- A variação YoY de diluted average shares é apresentada como diluição/redução do número de ações; buybacks do trimestre são lidos do cash-flow quando disponíveis.

### SEC User-Agent

Para maior conformidade com a política de fair access da SEC, cria no repositório um GitHub Actions secret chamado `SEC_USER_AGENT` com um identificador e email de contacto, por exemplo `Finscanner research nome@dominio.pt`. Se o secret não existir, existe um fallback técnico, mas um contacto real é preferível.


## v0.14.0 — Portfolio Coverage Repair

- Removed the verbose CSV/JSON syntax helper from the portfolio screen.
- Removed the giant visible list of unresolved portfolio symbols.
- Added `data/extra_tickers.json` as an explicit Yahoo-symbol coverage extension.
- Added common country-export to Yahoo suffix normalisation (PT/FR/GB/ES/NL/IT/CH/SE/DK/CA/NO/FI/AT/BE).
- Portfolio holdings that are valid Yahoo symbols but absent from index-based discovery can now be included in the next data workflow without expanding the full expensive universe indiscriminately.


## v0.15.0 — Portfolio Intelligence
- Portfolio Radar filters: Growth, Quality, Value, Zombies, ETFs and thesis trajectory.
- Portfolio Thesis Monitor: improving, worsening and changed theses.
- Thesis page can be scoped to the whole universe or only the imported portfolio.
- Explicit portfolio coverage comes from the complete 266-ticker DivTracker export supplied by the user.

## v0.16.0 — Correct Portfolio + FX-Weighted Intelligence

- Rebuilt explicit portfolio coverage from the correct DivTracker Combined export: 1,934 transaction rows, 489 historical tickers and 479 currently positive net positions.
- Closed/sold positions are removed after transaction aggregation instead of remaining as portfolio holdings.
- Added `data/fx.json` generated daily from Yahoo Finance FX pairs and converted all portfolio market values to EUR before calculating sector/geographic/style/thesis exposure.
- Handles LSE pence quotes (`GBp`/`GBX`) correctly as 1/100 GBP.
- Portfolio summary now includes value-weighted score, Growth/Quality/Zombie exposure and strengthening/weakening thesis exposure.
- The simple unweighted figures remain visible for comparison.

## v0.17.0 — Insurance Native Pack

Insurance companies now use a dedicated statement-derived metric pack instead of the provisional generic financial-sector model. The pipeline attempts to extract net investment income, claims/benefits, a broad claims-to-revenue proxy, an insurance operating-ratio proxy, accounting capitalisation (equity/assets), and book value per share. These metrics are peer-ranked only against other insurers and feed the insurance score dimensions.

Data-integrity boundary: the operating ratio is **not** presented as a statutory combined ratio, and equity/assets is **not** presented as Solvency II/RBC capital. Those regulatory metrics remain unavailable until a reliable structured source is integrated.

## v0.19.0 — Physical Metals Intelligence
The Metals dashboard now consumes official/public physical-market sources where automation is feasible: CME COMEX warehouse stock reports, CFTC weekly Disaggregated COT positioning, and the Shanghai Gold Exchange benchmark. A World Gold Council central-bank-flow adapter is included but deliberately fails closed if the public workbook requires a logged-in session. Physical data blocks carry source/status metadata; the app does not fabricate delivery coverage, paper/physical leverage, or institutional-positioning scores from price data.

## v0.20 — Delivery & Inventory Intelligence
Metals now parses CME's official daily Issues & Stops PDF for standard gold and silver delivery notices and builds its own daily COMEX inventory history. Delivery notices are shown as clearing events; ounce equivalents are contract-size context and are never labelled as actual vault withdrawals. Registered-inventory 7d/30d/1y trends appear only after enough daily observations have accumulated.

## v0.21 — Explainable Gold Pressure Index

- Adds a transparent 0–100 Gold Pressure Index.
- Components: registered-inventory contraction, delivery-notice intensity, Shanghai benchmark proxy, CFTC managed-money positioning, and central-bank flows when available.
- Missing components are never imputed; weights are renormalized over available official-source inputs and coverage is shown.
- Adds historical charts for COMEX registered inventory, delivery notices, CFTC positioning and the index itself.
- The index is contextual market-pressure information, not a price forecast or trading signal.


## v0.24.0 — ETF Portfolio Intelligence

Funds now analyses the ETFs held in the local portfolio as a combined economic exposure. It uses the observed top holdings returned by Yahoo/yfinance FundsData and therefore treats all look-through figures as lower bounds, never as a full-fund decomposition unless source coverage actually reaches it.

The panel reports ETF value considered in EUR, observed look-through coverage, value-weighted expense ratio, approximate annual fee drag, concentration in the largest observed underlying names, duplicated underlying holdings, and pairwise observed overlap hotspots. Selecting an overlap pair opens that pair directly in Head-to-Head.

## v0.25.0 — ETF Consolidation Intelligence

- Adds an **ETF Consolidation Lab** inside Fund Portfolio Intelligence.
- Detects overlap clusters among ETFs actually held in the imported portfolio using observed top holdings.
- For each redundancy cluster, ranks a **preferred core candidate** using a transparent, data-availability-aware heuristic:
  - 40% cost efficiency (expense ratio)
  - 25% representativeness of the overlap cluster
  - 20% AUM
  - 15% observed-holdings coverage
  - missing inputs are omitted and the remaining weights are renormalized.
- Shows which ETFs deserve redundancy review, pairwise observed overlap, and a theoretical annual cost delta where possible.
- Adds a Portfolio shortcut directly to the ETF Consolidation Lab when 2+ ETFs are held.
- This is a consolidation-review heuristic, not a sell instruction. It does not model taxes, bid/ask spreads, tracking difference, distribution policy, currency hedging, or investor-specific constraints.

## v0.26.0 — Portfolio Simplification Intelligence
A análise de ETFs da carteira inclui agora um Portfolio Simplification Score. O score mede oportunidade de simplificação (100 = maior redundância observada), constrói uma estrutura candidata com um ETF núcleo por cluster de overlap e preserva ETFs sem redundância forte. A simulação reporta ainda similaridade look-through observada e potencial diferença de expense ratio. Como FundsData normalmente fornece apenas top holdings, a análise é deliberadamente apresentada como lower-bound/heurística e não como recomendação automática de venda.

## v0.27.0 — Portfolio Structure Intelligence

A carteira passa a ser analisada economicamente, combinando posições diretas com o look-through observado dos ETFs. O painel mostra a divisão ações/ETFs, cobertura económica disponível, concentração Top 5/Top 10, número efetivo de exposições observadas, e identifica empresas que aparecem simultaneamente como posição direta e dentro de ETFs.

A análise é deliberadamente conservadora: holdings de ETF que a fonte não devolve não são inventadas. Por isso, as métricas de concentração e hidden overlap devem ser lidas como a parte observável da estrutura, com cobertura explicitamente indicada.

Foi também acrescentado o filtro **Ações** ao Portfolio Radar, mantendo Growth, Quality, Value, Zombies, ETFs e direção das teses.

## v0.29.0 — Concentration & Risk Intelligence

Portfolio Structure Intelligence now adds an explainable concentration layer across observed economic exposures. It surfaces single-name, sector, geography, trading-currency and thematic concentration, plus a compact factor/thesis strip. ETF sector look-through is used only when sector weights are available. Trading currency is explicitly not presented as true underlying FX exposure. The concentration score is structural and descriptive; it is not a volatility or loss forecast.


## v0.29.0 — Portfolio Risk Map
Portfolio Intelligence now identifies cross-dimensional concentrations such as geography × sector and sector × theme. Direct-equity intersections are observed; ETF intersections are conservative proxies based only on source-provided sector weights/metadata.

## v0.31.0 — Morning Metals Brief & Opportunity Repair

- Home Opportunities repaired: candidates are no longer accidentally removed when `zombie` is the string `"no"`.
- Metals uses a mobile-first Gold / Silver / Copper selector. Gold retains the full physical-intelligence stack; Silver exposes available COMEX warehouse/delivery context; Copper remains price/trend/volatility until official physical feeds are integrated.
- `data/metals_brief.json` is generated deterministically from the daily metals payload and rendered at the bottom of Metals.
- The GitHub Action is scheduled for **06:00 Europe/Lisbon every day**. Because GitHub cron is UTC, both 05:00 and 06:00 UTC are scheduled and a timezone gate runs only the invocation corresponding to 06:00 in Portugal, including DST changes. Manual runs bypass the gate.


## v0.33.0 — Portfolio Rebalancing Lab

Adds an interactive, non-persistent portfolio scenario lab. Select a source position, a destination (cash or another existing holding), and the percentage to move. The app recalculates observed concentration metrics without changing the saved portfolio: largest position, Top-5 concentration, dominant sector, HHI, weighted score, zombie exposure, weakening-thesis exposure, and quality exposure. The simulation keeps prices, FX rates, ETF holdings and fundamentals fixed; it is a structural what-if tool, not trade execution or investment advice.

## v0.34.0 — Multi-step Portfolio Scenario Builder
- O Portfolio Rebalancing Lab passa a aceitar várias alterações simultâneas no mesmo cenário.
- Cada operação pode reduzir uma posição e transferir o valor para cash/reserva ou para outra posição existente.
- As operações são aplicadas sequencialmente, permitindo simular consolidação de vários ETFs num núcleo e reduções de risco em simultâneo.
- Comparação Atual vs Proposta para maior posição, Top 5, HHI, maior setor, score ponderado, zombies, tese a piorar, Growth, Quality e cash.
- Nenhuma alteração é guardada ou executada; é apenas um laboratório de estrutura.


## v0.35.0 — Auto Simplification Scenario

O Portfolio Rebalancing Lab ganhou **Gerar cenário de simplificação**. O modelo cria automaticamente uma proposta editável a partir de três camadas observáveis: (1) consolidação de clusters de ETFs redundantes no candidato a núcleo, (2) redução parcial de uma concentração individual >=10% e (3) revisão parcial de até duas posições materiais (>2%) com tese a piorar ou classificadas como zombie.

A proposta é apenas um cenário de análise. Não executa ordens e não incorpora fiscalidade, spreads, tracking difference, moeda, distribuição/acumulação ou objetivos pessoais. Cada operação criada mostra a razão objetiva que a originou e pode ser removida ou alterada manualmente.

## v0.36.0 — Smart Money / SEC Integrity Repair
- Corrige parsing de Form 4: o `primaryDocument` da SEC é frequentemente HTML; o pipeline passa a procurar primeiro o XML estruturado companheiro.
- Retry/backoff + throttling global abaixo do limite de fair access da SEC.
- Smart Money com filtros Universo/Portfolio e Compras/Vendas/Fluxo líquido.
- Data Readiness SEC: distingue ausência real de atividade de falha de cobertura.
- O workflow recusa publicar um dataset com cobertura SEC gravemente degradada.


## v0.38.0 — Portfolio Opportunity Engine

O Portfolio passa a cruzar as melhores oportunidades do universo com a estrutura atual da carteira. O Portfolio Fit combina score, Quality, Value, Growth e trajetória da tese com concentração setorial/geográfica e exposição indireta já existente via ETFs. Os candidatos que aumentariam riscos já dominantes ou que já estejam materialmente presentes através de fundos são penalizados.


## v0.39.0 — Portfolio Valuation & Allocation Repair
- DivTracker Combined is parsed as a transaction ledger: every row contributes to the net quantity by ticker.
- Current value uses net quantity × current Yahoo price × FX to EUR; historical Cost Per Share is not mislabelled as current value.
- ECB reference rates are now the primary FX source, with Yahoo and the previous snapshot as fallbacks.
- The workflow refuses to publish if USD/GBP/CHF/CAD/PLN/SEK/DKK FX coverage is missing.
- Portfolio exposure is selectable: Positions, Sectors, Geography, Themes and Trading Currency, with %/€ display toggle. AI/Digital is no longer a privileged standalone exposure.
- Portfolio allocation now shows the total current value and top positions + Others.


## v0.40.0 — Portfolio Cost Basis & Performance

- O import DivTracker Combined é tratado como ledger cronológico, incluindo compras e vendas (quantidades negativas).
- Calcula custo médio remanescente por posição e P/L não realizado.
- Novo separador Portfolio → Rentabilidade com maiores ganhos/perdas.
- O topo do Portfolio mostra valor atual, custo base coberto, P/L e rentabilidade.
- Limitação explícita: o custo histórico é convertido com o FX atual; a rentabilidade cambial histórica exata exigirá FX por data de transação.

## v0.41.0 — Historical FX Cost Basis

Portfolio P/L can now use the ECB reference FX rate applicable on each transaction date instead of converting the entire historical cost basis at today's exchange rate. `scripts/fx_history.py` builds `data/fx_history.json` from the ECB historical euro reference series. The browser uses the latest available ECB business-day rate on or before each trade date, handles GBp/GBX as 1/100 GBP, and falls back explicitly to current FX only when a historical point is unavailable.

After deploying v0.41.0, run **Update stock data** once and then re-import the DivTracker Combined CSV once so the locally stored portfolio includes its transaction ledger. The Portfolio screen reports how many valued positions use full historical FX versus partial/current-FX fallback.


## v0.42.0 — Portfolio Positions Ledger

Portfolio now includes a sortable positions ledger inspired by dedicated portfolio trackers. It shows quantity, covered invested capital, current EUR value, unrealized P/L in EUR and %, economic weight, and Finscanner score for every imported position. Sorting supports value, weight, P/L, return, invested capital, score and ticker. Positions without a current quote remain visible instead of disappearing from the portfolio.


## v0.44.0 — Selectable Stock Screener Perspectives

Stock Radar gains selectable perspectives (Overview, Profitability, Growth, Valuation, Income, Smart Money) plus a custom column picker with up to four metrics. The results table now changes metrics without opening each company dossier, while preserving filters, presets and sector-aware scoring.


## v0.46.0 — Temporal Metric Context
Company dossiers now add a Winston-style context strip to key general-company metrics: **Current · 1Y ago · 3Y trend · Sector median**. Annual statement history powers Gross Margin, Operating Margin, ROE and ROCE proxy; actual dividend events power dividend-per-share history; valuation uses the scanner's own rolling valuation history for 1Y/self-relative context. Missing history remains explicitly unavailable.


## v0.48.1 — Earnings Calendar & Catalyst Intelligence

- Próxima data de resultados e dias até ao evento.
- Classificação explícita do risco de evento: iminente / esta semana / próximo / calendarizado.
- Histórico visual dos últimos 4 trimestres: beats, misses, surpresa média e beat streak.
- Novo preset `Earnings ≤7d` e perspetiva `Catalysts` no Stock Radar.
- A camada de catalisadores é contextual e não altera o Finscanner Score.
- Schema de dados 48.


## v0.49.0 — Capital Allocation Intelligence + Australia Universe Removal

- Removes the Australian/ASX discovery universe from the daily stock scanner.
- Removes curated EWA from the default ETF discovery list.
- Australian tickers explicitly present in the user's portfolio remain supported through `data/extra_tickers.json`; they are analysed for portfolio accounting but are not surfaced as scanner-universe opportunities.
- Adds Capital Allocation Intelligence to stock dossiers: dividend growth, annualised buyback-yield proxy, shareholder-yield proxy, dilution/share-count context and dividend safety.
- Scanner/Home additionally exclude stale `.AX` rows client-side until the next workflow rebuild, so the change is visible immediately after deploying the frontend.

## v0.49.2 — Stock Perspective Interaction Repair

- Corrige o seletor de colunas do Stock Radar: agora é possível trocar métricas mesmo quando já existem quatro selecionadas; uma quinta substitui a seleção mais antiga.
- Adiciona botão **Limpar** e mantém **Usar perspetiva** para regressar ao conjunto padrão.
- Cada perspetiva passa a ordenar os resultados pela métrica relevante, em vez de mostrar sempre as mesmas empresas no topo.
- Corrige a unidade de `dividend_yield` proveniente do Yahoo/yfinance, que estava a ser multiplicada por 100 no frontend (ex.: 2.86% aparecia como 286%).
- Corrige o cálculo do Shareholder Yield para converter dividend yield de pontos percentuais para fração antes de combinar com buybacks/diluição.

## v0.51.0 — Insider Timeline + Persistent Compare Groups

- Sector Intelligence comparison groups are now persistent in localStorage and can mix companies from different sectors/markets. In Compare mode, add a ticker/company directly and keep up to eight names as a reusable peer group.
- Smart Money deep dives now include a Winston-style 12-month insider timeline: weekly stock price plus SEC Form 4 open-market buy/sell markers, filters for All/Buys/Sells, transaction detail and 12-month buy/sell totals.
- The SEC pipeline keeps the existing 30-day metrics for ranking while adding a 365-day transaction window for visual history.
- Weekly 1-year price history is fetched only for US equities that actually have parsed insider P/S activity, limiting Yahoo load.
- Optional PWA insider alerts can be enabled for portfolio + watchlist. The current static GitHub Pages architecture can show a notification when the PWA next loads/refreshes and detects a new SEC transaction; true background push while the app is fully closed still requires an external push service/backend.
- Data schema: 510.

## v0.52.0 — Background Insider Push (ntfy)

O Finscanner inclui agora um workflow leve separado, `.github/workflows/insider-alerts.yml`, que verifica novos Form 4 SEC de hora a hora (minuto 17) e envia push para o ntfy mesmo com a PWA fechada.

### GitHub Secrets

- `NTFY_TOPIC` — obrigatório; nome do tópico ntfy.
- `NTFY_TOKEN` — opcional; apenas se o tópico exigir autenticação.
- `SEC_USER_AGENT` — recomendado, como no pipeline principal.

A primeira execução faz baseline dos filings atuais, evitando uma avalanche de alertas históricos. Quando o workflow é executado manualmente (`Run workflow`), envia também uma notificação de teste para confirmar a ligação.

O universo background usa `data/extra_tickers.json` (portfolio) e, opcionalmente, `data/alert_watchlist.json`. A watchlist guardada apenas no localStorage do iPhone não é visível para GitHub Actions; para alertas remotos de watchlist, os tickers podem ser espelhados nesse ficheiro.

O estado anti-duplicação é persistido em `data/insider_alert_state.json`. Só são publicados alertas para operações open-market `P`/`S`; grants, options, gifts e vesting não geram push.

## v0.54.0 — Dark Mode Accessibility & Dossier Readability

- Repara o modo escuro do dossier mobile: fundo, cards, headings, thesis panel, score breakdown, metric stories e navegação passam a respeitar os tokens dark em vez de valores brancos/navy fixos.
- A barra de estado/PWA acompanha a mudança de tema através de `theme-color` dinâmico.
- Corrige contraste insuficiente em `Tese quantitativa`, trajectory strip, score-model note e metric cards.
- Corrige headings e textos cortados em ecrãs estreitos; o score breakdown passa a aceitar labels longos sem overflow.
- Mantém todo o pipeline SEC/ntfy e Sector Intelligence da v0.52.x.


## v0.55.0 — Insider Conviction + Watchlist Guide
- Insider Conviction 0–100 no Smart Money e dossier.
- Combina dimensão da operação, cargo, recência, cluster/reversal e proximidade ao preço atual quando disponível.
- Filtro `Conviction ≥60` e score nas notificações ntfy.
- Guia passo a passo dentro da app para exportar e sincronizar `alert_watchlist.json`.
- Dark mode preservado nos novos componentes.


## v0.56.0
- Dark-mode contrast hardening for Home Briefing, Opportunities, Sector Intelligence and Portfolio Simplification.
- Smart Money adds Strong Buy, Cluster Buying and Buy Near 52W Low discovery filters.
- Near-low signal uses existing 1-year price history for stocks with insider activity; scoring is unchanged.


## v0.57.0 — Insider Opportunity Score

Smart Money passa a distinguir tamanho de operação de qualidade de oportunidade. O `Insider Opportunity Score` (0–100) combina conviction da compra insider, Quality, Value, Growth, proximidade ao mínimo de 1 ano, direção da tese e penalização zombie.

- novo filtro `Opportunity ≥65`;
- ranking Top 3 no topo do Smart Money;
- breakdown Conviction / Quality / Value em cada candidato;
- o score é uma ferramenta de triagem e não altera o Finscanner Score fundamental.
- componentes novos respeitam light/dark mode.
