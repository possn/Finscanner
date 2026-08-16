# Finscanner v0.88.0 — Global Stocks → Portfolio Workflow

A área **Stocks** passa a seguir a mesma arquitetura simples que a área Funds:

1. **Descobrir empresas** — universo global rastreado, independente da carteira.
2. **As minhas ações** — apenas posições diretas do portfolio, com score, tese e sinais de revisão.
3. **Melhores adições** — empresas que ainda não estão na carteira e combinam qualidade absoluta com Portfolio Fit.

A exploração avançada (filtros, Sector Intelligence, perspetivas e tabela completa) continua disponível dentro de uma dropbox única.

## Ficheiros a substituir

- `index.html`
- `app.js`
- `style.css`
- `sw.js`
- `README.md`

Não é necessário alterar workflows nem ficheiros `data/` nesta release.


## v0.90.0 — Stable Footer & Broader Stock Discovery

- Footer mobile fixed and opaque, with extra safe-area/content padding so content never scrolls behind it.
- Discovery now degrades gracefully: if a strict investment profile + sector has no exact matches, the app shows the best known companies in that sector instead of an empty screen.
- Added resilient sector/theme discovery anchors for Water, Agriculture, Healthcare, Biotech, Defense and Semiconductors.
- Equity rows from previous successful workflow runs are carried forward when Yahoo is temporarily incomplete, so the stock universe grows instead of disappearing between runs.
- Metadata-only catalogue rows are clearly marked as awaiting analysis; no scores are fabricated.

## v0.89.0 — Stocks Clarity & Sector Discovery
- Novos setores/temas: Tecnologia, Healthcare, Biotech, Água, Agricultura, Energia, Financeiro, Industriais, Consumo, Imobiliário, Utilities, Materiais, Defesa e Semicondutores.
- Presets de descoberta renomeados em linguagem simples, com explicação visível.
- A tabela principal deixa de mostrar grades A/B/C/D e abreviações Q/G/V: mostra scores 0–100 com nomes Qualidade, Crescimento e Valor.
- Portfolio Radar também usa nomes explícitos.
