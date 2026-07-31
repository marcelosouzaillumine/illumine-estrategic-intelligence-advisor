# Migration Decision Record (MDR) - Balance Sheet

**Status:** ✅ APPROVED (Sprint BI-003.4)

## Decision Context
A `FinancialPositionPage` atual é o modelo monolítico de React onde a visão (UI), o controle (fetch de DB) e o modelo de negócio (cálculos) coabitam. Para certificar a plataforma sob a *Executive Analytics Foundation*, precisamos dissociar as lógicas.

## Decisions
1. **Capabilities Migration:** Uma nova Capability (`BalanceSheetCapability`) será escrita na pasta do `executive-analytics-engine` contendo puramente os cálculos de saldos e variações baseados no `BalanceSheetContext`.
2. **Semântica Isolada:** O componente React passará a consumir um hook `useExecutiveAnalytics(tenantId, 'BalanceSheetCapability')` em vez de hooks dedicados do Firestore/Math.
3. **Muted UI:** As `ExecutiveSummarySection` na página React não conterão mais descrições hardcoded ("Como monitorar a evolução patrimonial e disponibilidades?"). O componente receberá dados do `ExecutiveNarrativeRenderer` e sua *Evidence Chain*.

## Expected Consequences
- A UI será reduzida a um *dumb component* que mapeia JSON para componentes estruturais (`ExecutiveMetricCard`, `ExecutiveAccordion`).
- O back-end/engine passa a ser testável puramente via Jest, sem depender de montagem de React components (certificação).
- A rastreabilidade ganha a tag `BalanceSheetCapability` via `evidence.capabilityName`.
