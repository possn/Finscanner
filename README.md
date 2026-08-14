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
