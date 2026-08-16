# Finscanner v0.91.0 — Trust-Adjusted Discovery + Portfolio Action Suggestions

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



## v0.89.0 — Stocks Clarity & Sector Discovery
- Novos setores/temas: Tecnologia, Healthcare, Biotech, Água, Agricultura, Energia, Financeiro, Industriais, Consumo, Imobiliário, Utilities, Materiais, Defesa e Semicondutores.
- Presets de descoberta renomeados em linguagem simples, com explicação visível.
- A tabela principal deixa de mostrar grades A/B/C/D e abreviações Q/G/V: mostra scores 0–100 com nomes Qualidade, Crescimento e Valor.
- Portfolio Radar também usa nomes explícitos.

## v0.91.0 — Trust-Adjusted Discovery + Portfolio Action Suggestions

- Discovery no longer treats the raw Finscanner Score as a complete ranking. Ordering now also considers data confidence and company size, with strong penalties for low-confidence microcaps and financial-risk flags.
- "Empresas sólidas" becomes quality-first, so an anomalous Stability/Value sub-score cannot by itself push a tiny speculative company above an established high-quality company.
- Discovery cards show a simple size/confidence label so users can understand why one candidate ranks above another.
- Portfolio holdings gain an explicit triage suggestion: **Reforçar**, **Manter**, **Reduzir / rever**, or **Vender / sair?**, with 2–3 reasons and confidence. This is decision support, never an automatic order.
- Crypto positions are explicitly excluded from the equity action model.
- The Company Dossier shows the same suggestion when the stock is held in the imported portfolio.
