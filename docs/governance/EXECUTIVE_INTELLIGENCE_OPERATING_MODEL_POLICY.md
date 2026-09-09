# Executive Governance Operating Model Policy™

Este documento estabelece as diretrizes de governança para o Executive Governance Operating Model™, definindo claramente a fronteira de propriedade intelectual (IP) entre o que pode ser exposto à UI/Cliente e o que deve permanecer restrito aos motores internos da Illumine.

## Público (Permitido para Exibição / Interface do Usuário)

Estes elementos compõem a camada semântica e visual da plataforma e **podem** ser expostos:
* **Arquitetura dos domínios**: Nomes dos domínios (Financial, Governance, Operational, etc.) e seu status qualitativo (Established, Developing, Future).
* **Conceito de evolução**: O "Architecture Map" que demonstra como a base de dados sustenta os domínios e chega ao Advisory.
* **Narrativas executivas**: Os textos curados e estruturados do `ExecutiveNarrativeService` (ex: "Current Executive Reality" e "Strategic Conversation").
* **Recomendações gerais**: O nome da próxima jornada sugerida e o objetivo conversacional.

## Restrito (Protegido / Backend / Engine Interno)

Estes elementos contêm a lógica de alto valor da plataforma e **NUNCA devem ser expostos** ou retornados em endpoints não autenticados ou na UI final do usuário:
* **Matriz de decisão**: Tabelas exatas que determinam o estágio organizacional com base na combinação estrita de pontuações.
* **Algoritmos de progressão**: O motor exato (e.g., `DiagnosticEvolutionRoadmap`) que define os caminhos preferenciais.
* **Correlações entre domínios**: A lógica que define que uma vulnerabilidade financeira + maturidade governança gera uma deficiência operacional X.
* **Critérios de recomendação**: Regras if/else profundas, pesos decimais, ou pontuações puras que calibram o próximo passo no Portfolio Engine.
* **Modelos proprietários**: Quaisquer lógicas de predição, frameworks de avaliação e pontuação cruzada mantidas no `PortfolioSummaryService` ou similares.
