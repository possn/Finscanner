# Finscanner v0.98.2 — Baseline Consolidation

Esta release consolida como baseline funcional a versão validada em workflow após a revisão externa. Não altera a lógica financeira, os scores, o pipeline de insiders/Congresso nem o comportamento do portfolio.

## Arquitetura atual

### Stocks
1. **Descobrir empresas** — pesquisa o universo global rastreado, independentemente da carteira; permite depois considerar o encaixe no portfolio.
2. **As minhas ações** — mostra qualidade, tese, riscos e sugestões sobre posições já detidas.

Os dossiers usam cinco tabs principais: **Overview · Growth · Earnings · Pillars · Deep Dive**. A informação técnica extensa fica em exploração aprofundada, em vez de ocupar o fluxo principal.

### Smart Money
- Insiders empresariais: SEC Form 4.
- Congresso dos EUA: dados recolhidos server-side no pipeline e gravados no `stocks.json`.
- O mesmo histórico `price_history_1y` alimenta a leitura visual de preço e transações.
- `insider_price_history_1y` é mantido apenas como alias de compatibilidade quando necessário.

### Funds / ETFs
O universo de ETFs é independente da carteira. A carteira serve como contexto para overlap, redundância, comparação e possíveis alternativas. O pipeline enriquece progressivamente preço, AUM, TER, holdings e exposições quando as fontes os disponibilizam. Dados ausentes devem permanecer ausentes; não devem ser convertidos em pontuações neutras artificiais.

### Portfolio
O portfolio continua local ao dispositivo, com importação CSV/JSON e contexto económico para pesos, tese, risco e adequação estrutural.

## Limpeza desta release
- removidos `*.bak`;
- removidos `__pycache__` / `.pyc`;
- removidas referências residuais ao AI Analyst / Cloudflare Worker da interface e documentação;
- README reescrito para refletir a arquitetura realmente ativa;
- cache/versionamento sincronizado para `v0.98.2`.

## Ficheiros a substituir
- `app.js`
- `style.css`
- `sw.js`
- `README.md`

Não é necessário voltar a correr o workflow apenas por causa desta release de limpeza.
