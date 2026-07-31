# Canonical Analytics Implementation Pattern

Este documento define a arquitetura canônica e a matriz de responsabilidades para a implementação de novas camadas de inteligência executiva na plataforma Illumine.

## Architectural Pipeline
Qualquer novo domínio analítico deve seguir estritamente o fluxo governado abaixo:

**Domain Capability** → **Executive Analytics Engine** → **Evidence Chain** → **Narrative Engine** → **Executive Renderer** → **Experience Layer**

## Matriz de Responsabilidades

| Camada | Pode fazer | Não pode fazer |
| :--- | :--- | :--- |
| **Data Layer** | fornecer dados | interpretar |
| **Calculation Engine** | calcular | recomendar |
| **Analytics Capability** | gerar indicadores certificados | escrever narrativa |
| **Narrative Engine** | interpretar contexto | alterar números |
| **UI Renderer** | apresentar | calcular |

## Architectural Boundaries Enforcement

O Architecture Review Board (ARB) estabelece limites rigorosos sobre o que é permitido transitar pela Experience Layer (Views/Pages).

### Forbidden in Experience Layer (NUNCA permitido)
A camada de apresentação em `src/components/pages/**` ou componentes de interface visual são proibidos de realizar ou conter:
- Cálculo financeiro (ex: somatórios de fluxo de caixa, margens).
- Classificação de risco (ex: definir se um indicador é Crítico ou Saudável).
- Geração de recomendação estratégica.
- Interpretação executiva (textos hardcoded inferindo conclusões do negócio).
- Regras de negócio.

### Permitted in Experience Layer
A camada de apresentação deve se restringir exclusivamente a:
- Composição visual.
- Filtros e ordenações.
- Seleção de período.
- Interação do usuário.
- Formatação de dados (moeda, data).
- Navegação e roteamento.

> [!WARNING]
> Qualquer PR que introduza lógicas proibidas na camada de Experiência será bloqueado pelo Global Regression Gate (nível 2 de enforcing).
