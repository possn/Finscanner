# Finscanner

PWA pessoal de scanning/scoring de ações e ETFs, inspirada na app Winston,
construída inteiramente sobre **fontes de dados gratuitas**. Sem chaves de
API pagas, sem subscrição, sem backend a correr — apenas GitHub Actions
(grátis para repos públicos) + um site estático.

## Arquitetura

```
Universo (US screener + índices AU/PL/UK via Wikipedia)
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

## Metodologia — e as suas limitações (deliberadamente não escondidas)

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
  compra de venda nem opções exercidas. AU/PL/UK ficam `not_available`
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
