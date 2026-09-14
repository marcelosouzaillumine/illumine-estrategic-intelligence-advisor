# Wave 18B.3.3 — Executive Narrative & Investment Experience Architecture

## 1. Narrative Principles
A proposta não é um catálogo de preços ou funcionalidades. É uma experiência consultiva executiva projetada para guiar o C-Level desde o alinhamento de contexto até o compromisso estratégico. 
A progressão é intencional: **Contexto ➔ Tensão (Realidade) ➔ Solução (Inteligência) ➔ Jornada ➔ Investimento**.

## 2. Information Hierarchy (A Espinha Dorsal da Narrativa)
- **ExecutiveWelcome:** Quem somos, por que estamos aqui (sem preço).
- **StrategicContext:** O racional estratégico por trás do Assessment.
- **CurrentReality:** Os riscos observados posicionados como oportunidades latentes de evolução.
- **GovernanceSolution:** A ponte entre a Capability Illumine e a redução da fricção.
- **TransformationJourney:** O cronograma da parceria.
- **InvestmentPerspective:** O compromisso financeiro atrelado ao valor estratégico.
- **ExecutiveNextStep:** O "Decision Center Placeholder" (preparação para próxima wave).

## 3. Component Mapping & Design System Usage
| Domínio Narrativo | Componente React | Design System Associado |
| :--- | :--- | :--- |
| **Welcome** | `ExecutiveWelcome.tsx` | `ExecutiveHeader`, `StatusBadge` |
| **Context** | `StrategicContext.tsx` | `ExecutiveSummaryCard`, `ExecutiveStrategicTensions` |
| **Reality** | `CurrentReality.tsx` | `ExecutiveExposureCard`, `ExecutiveEvidenceGrid` |
| **Solution** | `ExecutiveSolution.tsx` | `ExecutiveAccordion`, `CapabilityBadge` |
| **Journey** | `TransformationJourney.tsx` | `ExecutiveLineageTimeline` |
| **Investment** | `InvestmentPerspective.tsx` | `ExecutiveMetricCard`, `ExecutiveTable` |
| **Next Step** | `ExecutiveNextStep.tsx` | `ExecutiveActionSurface` |

## 4. Data Binding
Absolutamente **nenhum dado** será chumbado (hardcoded). Toda a topologia visual consome a interface `ClientWorkspaceViewModel` (via `useClientProposal`), que representa uma foto auditável do *Revenue Domain*.

## 5. i18n Strategy
A experiência visual extrai seus metadados estruturais de namespaces em JSON:
- `proposal_workspace.json`: Termos de interface geral (ex: "Jornada de Transformação").
- `proposal_narrative.json`: Frases de impacto e strings narrativas de transição.
- `proposal_investment.json`: Termos comerciais e condições padrão.

## 6. Responsive Experience (Mobile Executive)
Toda a leitura deve funcionar fluidamente no eixo vertical (Y) para celulares, já que C-Levels tendem a abrir links executivos primariamente em trânsito.
- Timelines colapsam de horizontal para vertical.
- Grids de evidência adotam scroll horizontal.
