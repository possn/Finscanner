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
