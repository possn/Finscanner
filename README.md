# Finscanner v0.87.0 — Global ETF Universe

Esta release muda o módulo Funds para uma arquitetura mais simples e explícita:

1. **Descobrir ETFs** — pesquisa num catálogo global rastreado, independente do portfolio do utilizador.
2. **Os meus ETFs** — analisa apenas a carteira para detetar overlap/redundância e sugerir um candidato a núcleo em cada grupo.
3. **Alternativas melhores** — procura no catálogo global alternativas comparáveis aos ETFs da carteira, privilegiando evidência de semelhança e menor TER quando observado.

## Universo global

O catálogo incluído nesta release tem mais de 250 ETFs/ETPs e inclui grandes fundos dos EUA, regionais/internacionais, temáticos e vários UCITS europeus. Não se afirma que represente literalmente todos os ETFs existentes no mundo. O objetivo é uma camada global extensível e independente da carteira.

O workflow enriquece diariamente um núcleo e uma fatia rotativa do catálogo com dados Yahoo. Os restantes continuam visíveis como `catalog_only`, sem inventar preço, TER, AUM ou holdings. Dados enriquecidos de dias anteriores são preservados para que a cobertura cresça progressivamente.

## UX

O ecrã Funds foi reorganizado para responder a três perguntas simples: “Que ETF procuro?”, “Onde os meus ETFs se sobrepõem?” e “Existe uma alternativa melhor?”. Rankings e análise técnica detalhada continuam disponíveis em áreas expansíveis.

## Instalação

Substituir os ficheiros indicados em `FILES-TO-REPLACE-v0.87.0.txt` e correr uma vez `Update stock data`. A release já inclui o catálogo metadata-only, pelo que a descoberta funciona mesmo antes desse run; o workflow apenas aumenta a cobertura de TER/AUM/holdings.
