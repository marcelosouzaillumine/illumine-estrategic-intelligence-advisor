# Executive UI Migration Plan

Este documento estabelece o roadmap para a migração das superfícies executivas da Illumine Governance™ para o novo padrão canônico (Fase 1: Fundação Visual e Fase 2: Executive Narrative System).

## 1. Escopo e Diretrizes
A migração visa eliminar dívida técnica visual, substituindo construções manuais (divs, spans, classes arbitrárias de Tailwind) por componentes semânticos (`ExecutivePageTemplate`, `MetricGrid`, `SemanticCard`, `ExecutiveNarrative`, `NarrativeStack`).

**Regra inegociável**: Arquitetura Read-Only. Não haverá nenhuma alteração em engines fiduciárias, recálculo de métricas ou geração de IA. A migração afeta exclusivamente a camada de renderização.

## 2. Roadmap de Migração

### Superfície 1: Páginas Financeiras
- **Alvos:** `BalanceSheetPage.tsx`, `CashFlowPage.tsx`, `FinancialAdminDashboard.tsx`.
- **Ações:**
  - Substituir containers por `ExecutivePageTemplate`.
  - Migrar KPIs financeiros superiores para `MetricGrid` + `MetricTile`.
  - Padronizar blocos de análise (ex: "Análise de Liquidez") com `ExecutiveNarrative`.

### Superfície 2: ESGIM
- **Alvos:** `EsgimPage.tsx` ou equivalentes.
- **Ações:**
  - Migrar os cards de métricas ESG.
  - Utilizar `SemanticCard` com variante `insight` ou `info` para narrativas contextuais de sustentabilidade e governança.
  - Aplicar `ExecutiveNarrative` (variant: `summary`) para descrições de indicadores.

### Superfície 3: Advisor Workspace
- **Alvos:** Telas de relatório e acompanhamento de tarefas.
- **Ações:**
  - Utilizar `ExecutiveNarrative` (variant: `recommendation`) para tarefas de mentoria.
  - Incorporar `ExecutiveCallout` para alertas de pendências.

### Superfície 4: Institutional Governance
- **Ações:**
  - Aplicar `ExecutiveNarrative` (variant: `insight` e `board-note`) nos painéis de IA.
  - Substituir qualquer layout ad-hoc.

### Superfície 5: Digital Twin
- **Ações:**
  - Consolidar as análises preditivas do gêmeo digital através do `NarrativeStack` e `ExecutiveNarrative` (variants: `risk` e `summary`).

### Superfície 6: Governance Time Machine
- **Ações:**
  - Padronizar a linha do tempo e as narrativas de snapshot utilizando a fundação visual.

### Superfície 7: War Room
- **Ações:**
  - Aplicar `SemanticCard` e `MetricGrid` rigorosamente. As narrativas críticas devem utilizar `ExecutiveNarrative` (variant: `critical` ou `risk`).

## 3. Critérios de Aceite para Cada Migração
- `npm run typecheck` passa sem erros.
- Os Quality Gates (Lint, Testes) são mantidos verdes.
- Navegação por teclado continua operando.
- O *AntiGravity™* não aponta violações das "regras de ouro visuais" nas páginas atualizadas.
