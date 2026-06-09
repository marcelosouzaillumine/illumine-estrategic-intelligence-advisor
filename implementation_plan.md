# Type Safety Hardening v1.1 — Micro-sprint 2 Plan

## Resumo da Auditoria
- **Ocorrências Corrigíveis Imediatamente:** 75
- **Ocorrências que Exigem Investigação (Firebase/APIs):** 82

## User Review Required

> [!IMPORTANT]
> Abaixo está a proposta de separação das ocorrências. As marcadas como **Corrigível Imediatamente** terão `any` trocado por `unknown`, type guards, e tipos base.
> As que **Exigem Investigação** não serão alteradas nesta sprint para evitar quebras em payloads do Firestore e contratos legados. Você concorda com essa divisão ou deseja mover algum arquivo entre as listas?

### Corrigível Imediatamente (Serão refatoradas)
- `src/context/ConsolidatedExecutiveContext.tsx`: 1 ocorrências
- `src/context/institutional-memory/InstitutionalMemoryProvider.tsx`: 1 ocorrências
- `src/context/pilot-operations/PilotOperationsProvider.tsx`: 3 ocorrências
- `src/context/scenario-simulation/ScenarioSimulationProvider.tsx`: 3 ocorrências
- `src/hooks/useBoardCopilot.ts`: 4 ocorrências
- `src/hooks/useBoardMode.ts`: 4 ocorrências
- `src/hooks/useCurrencyRates.ts`: 4 ocorrências
- `src/hooks/useExecutiveAdvisory.ts`: 6 ocorrências
- `src/hooks/useFinancialMath.ts`: 5 ocorrências
- `src/hooks/useHistoricalDemonstracoes.ts`: 3 ocorrências
- `src/hooks/useInstitutionalRuntime.ts`: 3 ocorrências
- `src/hooks/useMethodologicalAnalysis.ts`: 6 ocorrências
- `src/hooks/useScenarioExecutionIntelligence.ts`: 4 ocorrências
- `src/hooks/useScenarioSimulation.ts`: 1 ocorrências
- `src/services/FiduciaryRuntimeAdapter.ts`: 4 ocorrências
- `src/services/aiBoardReportService.ts`: 4 ocorrências
- `src/services/aiService.ts`: 3 ocorrências
- `src/services/auditService.ts`: 1 ocorrências
- `src/services/governanceService.ts`: 5 ocorrências
- `src/services/intelligenceEngine.ts`: 4 ocorrências
- `src/services/notificationService.ts`: 2 ocorrências
- `src/services/supportService.ts`: 1 ocorrências
- `src/services/taxService.ts`: 3 ocorrências

### Exige Investigação (Serão documentadas/adiadas)
- `src/hooks/useDataTable.ts`: 2 ocorrências (Motivo provável: Dependência de Firebase, Dicionários Dinâmicos ou Contratos Externos)
- `src/hooks/useFinancialData.ts`: 19 ocorrências (Motivo provável: Dependência de Firebase, Dicionários Dinâmicos ou Contratos Externos)
- `src/hooks/useModuleData.ts`: 5 ocorrências (Motivo provável: Dependência de Firebase, Dicionários Dinâmicos ou Contratos Externos)
- `src/hooks/usePaginatedData.ts`: 4 ocorrências (Motivo provável: Dependência de Firebase, Dicionários Dinâmicos ou Contratos Externos)
- `src/hooks/useRealIndicatorData.ts`: 15 ocorrências (Motivo provável: Dependência de Firebase, Dicionários Dinâmicos ou Contratos Externos)
- `src/services/ClientExecutiveFinancialDataAdapter.ts`: 1 ocorrências (Motivo provável: Dependência de Firebase, Dicionários Dinâmicos ou Contratos Externos)
- `src/services/cashFlowService.ts`: 22 ocorrências (Motivo provável: Dependência de Firebase, Dicionários Dinâmicos ou Contratos Externos)
- `src/services/importService.ts`: 14 ocorrências (Motivo provável: Dependência de Firebase, Dicionários Dinâmicos ou Contratos Externos)

## Proposed Changes
1. **Criar tipos base:** `src/types/safety/index.ts` (SafeRecord, JsonObject, etc.)
2. **Refatorar Providers/Hooks Simples:** Trocar `any` por `unknown` e usar *type-guards* em `src/context/` e `src/hooks/` (aqueles do grupo Corrigível).
3. **Fortalecer Adapters de UI:** Ajustar retornos locais sem modificar a engine primária.

## Verification Plan
1. `npm run typecheck`
2. Execução da suíte de testes ELSF e TFIF.
3. Build verificado para confirmar ausência de quebras na UI.
