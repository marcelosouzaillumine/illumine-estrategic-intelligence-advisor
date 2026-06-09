# Architectural Redundancy Consolidation v1.0 (Critical Duplicates First)

O objetivo desta sprint é resolver duplicidades críticas sem alterar regras de negócio, engines, cálculos ou contratos fiduciários. O processo é estritamente estrutural (movimentação, arquivamento e redirecionamento de imports).

## Tabela de Consolidação Proposta

| Abstração Duplicada | Oficial Proposto | Legado Proposto (a arquivar) | Motivo da Escolha | Imports Of. / Leg. | Risco |
|---------------------|------------------|------------------------------|-------------------|-------------------|-------|
| **BoardResolutionEngine** | `runtime/board-decision/BoardResolutionEngine.ts` | `runtime/prescriptive-governance/BoardResolutionEngine.ts` | Possui número considerável de dependentes na base de código. | 6 / 6 | **Alto** |
| **ExecutiveDecisionAdapter** | `workflows/ExecutiveDecisionAdapter.ts` | `runtime/executive/ExecutiveDecisionAdapter.ts<br>src/runtime/adapters/ExecutiveDecisionAdapter.ts` | Possui número considerável de dependentes na base de código. | 7 / 7/7 | **Alto** |
| **InstitutionalMemoryEngine** | `runtime/institutional-memory/InstitutionalMemoryEngine.ts` | `runtime/institutional-memory-legacy-backup/InstitutionalMemoryEngine.ts<br>runtime/knowledge-graph/InstitutionalMemoryEngine.ts` | Possui número considerável de dependentes na base de código. | 20 / 20/20 | **Alto** |
| **ExecutiveAttentionEngine** | `governance/executive-attention/ExecutiveAttentionEngine.ts` | `runtime/executive-orchestration/cognitive/ExecutiveAttentionEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 4 / 4 | **Alto** |
| **GovernanceRecommendationEngine** | `runtime/advisory-narrative/GovernanceRecommendationEngine.ts` | `runtime/governance-orchestration/GovernanceRecommendationEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 4 / 4 | **Alto** |
| **InstitutionalDisclosureEngine** | `runtime/advisory-narrative/InstitutionalDisclosureEngine.ts` | `runtime/institutional-reporting/engines/InstitutionalDisclosureEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 4 / 4 | **Alto** |
| **BenchmarkReferenceEngine** | `runtime/benchmark/BenchmarkReferenceEngine.ts` | `runtime/integrity/BenchmarkReferenceEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 4 / 4 | **Alto** |
| **EarningsQualityEngine** | `runtime/cash-intelligence/EarningsQualityEngine.ts` | `runtime/governance/dre/EarningsQualityEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 4 / 4 | **Alto** |
| **ExecutiveActionMatrixEngine** | `runtime/decision-intelligence/ExecutiveActionMatrixEngine.ts` | `runtime/integrity/ExecutiveActionMatrixEngine.ts` | Possui número considerável de dependentes na base de código. | 6 / 6 | **Alto** |
| **StrategicPostureEngine** | `runtime/decision-policy/StrategicPostureEngine.ts` | `runtime/strategic-intelligence/StrategicPostureEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 5 / 5 | **Alto** |
| **CapitalPreservationEngine** | `runtime/governance/bp/CapitalPreservationEngine.ts` | `runtime/treasury-intelligence/CapitalPreservationEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 4 / 4 | **Alto** |
| **InstitutionalRecoveryEngine** | `runtime/governance-orchestration/InstitutionalRecoveryEngine.ts` | `runtime/institutional-recovery/InstitutionalRecoveryEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 4 / 4 | **Alto** |
| **InstitutionalContextEngine** | `runtime/institutional-context/InstitutionalContextEngine.ts` | `runtime/ios/InstitutionalContextEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 5 / 5 | **Alto** |
| **AdvisoryContinuityEngine** | `runtime/institutional-memory/AdvisoryContinuityEngine.ts` | `runtime/institutional-memory-legacy-backup/AdvisoryContinuityEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 4 / 4 | **Alto** |
| **ExecutiveResponsivenessEngine** | `runtime/institutional-memory/ExecutiveResponsivenessEngine.ts` | `runtime/institutional-memory-legacy-backup/ExecutiveResponsivenessEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 4 / 4 | **Alto** |
| **GovernanceRecurrenceEngine** | `runtime/institutional-memory/GovernanceRecurrenceEngine.ts` | `runtime/institutional-memory-legacy-backup/GovernanceRecurrenceEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 4 / 4 | **Alto** |
| **GovernanceTimelineEngine** | `runtime/institutional-memory/GovernanceTimelineEngine.ts` | `runtime/institutional-memory-legacy-backup/GovernanceTimelineEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 3 / 3 | **Alto** |
| **InstitutionalLearningEngine** | `runtime/institutional-memory/InstitutionalLearningEngine.ts` | `runtime/institutional-memory-legacy-backup/InstitutionalLearningEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 2 / 2 | **Alto** |
| **InstitutionalPatternRecognitionEngine** | `runtime/institutional-memory/InstitutionalPatternRecognitionEngine.ts` | `runtime/institutional-memory-legacy-backup/InstitutionalPatternRecognitionEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 3 / 3 | **Alto** |
| **LongitudinalMaturityEngine** | `runtime/institutional-memory/LongitudinalMaturityEngine.ts` | `runtime/institutional-memory-legacy-backup/LongitudinalMaturityEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 4 / 4 | **Alto** |
| **PredictiveRecurrenceEngine** | `runtime/institutional-memory/PredictiveRecurrenceEngine.ts` | `runtime/institutional-memory-legacy-backup/PredictiveRecurrenceEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 4 / 4 | **Alto** |
| **PriorityDeteriorationEngine** | `runtime/institutional-memory/PriorityDeteriorationEngine.ts` | `runtime/institutional-memory-legacy-backup/PriorityDeteriorationEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 2 / 2 | **Alto** |
| **TemporalCausalityEngine** | `runtime/institutional-memory/TemporalCausalityEngine.ts` | `runtime/institutional-memory-legacy-backup/TemporalCausalityEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 4 / 4 | **Alto** |
| **TemporalEscalationEngine** | `runtime/institutional-memory/TemporalEscalationEngine.ts` | `runtime/institutional-memory-legacy-backup/TemporalEscalationEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 4 / 4 | **Alto** |
| **InstitutionalResilienceEngine** | `runtime/institutional-resilience/InstitutionalResilienceEngine.ts` | `runtime/predictive-intelligence/InstitutionalResilienceEngine.ts` | Possui número considerável de dependentes na base de código. | 7 / 7 | **Alto** |
| **LifecycleClassificationEngine** | `runtime/lifecycle/LifecycleClassificationEngine.ts` | `runtime/semantic/LifecycleClassificationEngine.ts` | Possui número considerável de dependentes na base de código. | 8 / 8 | **Alto** |
| **InstitutionalEarlyWarningEngine** | `runtime/predictive-governance/InstitutionalEarlyWarningEngine.ts` | `runtime/predictive-intelligence/InstitutionalEarlyWarningEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 4 / 4 | **Alto** |
| **InstitutionalScenarioEngine** | `runtime/predictive-governance/InstitutionalScenarioEngine.ts` | `runtime/scenario-intelligence/InstitutionalScenarioEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 5 / 5 | **Alto** |
| **NarrativeConsistencyEngine** | `runtime/publication-governance/NarrativeConsistencyEngine.ts` | `runtime/semantic-consistency/NarrativeConsistencyEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 5 / 5 | **Alto** |
| **ScenarioSimulationEngine** | `runtime/scenario/ScenarioSimulationEngine.ts` | `runtime/scenario-simulation/ScenarioSimulationEngine.ts` | Possui número considerável de dependentes na base de código. | 8 / 8 | **Alto** |
| **PropagationSimulationEngine** | `runtime/scenario-intelligence/PropagationSimulationEngine.ts` | `runtime/scenario-simulation/PropagationSimulationEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 5 / 5 | **Alto** |
| **ScenarioTradeoffEngine** | `runtime/scenario-intelligence/ScenarioTradeoffEngine.ts` | `runtime/strategic-simulation/ScenarioTradeoffEngine.ts` | Possui alguns imports, mas colide com outro de mesmo nome. | 4 / 4 | **Alto** |

## User Review Required

> [!IMPORTANT]
> **Validação da Tabela de Consolidação**
> A tabela acima contém a minha proposta de "Quem vive e quem é arquivado" para os itens Críticos e Altos, com especial atenção às prioridades máximas (`ExecutiveDecisionAdapter`, `InstitutionalMemoryEngine`, etc).
> Por favor, revise a coluna **Oficial Proposto**. Se alguma abstração oficial foi inferida incorretamente pela heurística, indique qual caminho deve ser o correto.

## Proposed Changes

1. **Arquivamento Seguro**: Mover todos os arquivos marcados como "Legado Proposto" para a pasta `src/archive/` (ou `archive/` na raiz, de acordo com o padrão do repositório).
2. **Redirecionamento**: Em toda a base de código (através de `grep_search` / `multi_replace_file_content`), substituir os caminhos de importação que apontavam para os arquivos legados para apontar para a versão "Oficial Proposto".
3. **Auditoria Pós-Consolidação**: Rodar `typecheck` e testes para garantir que as assinaturas batem e nenhuma regressão ocorreu.

## Verification Plan

- Execução completa de `npm run typecheck`, `npm run test` e `npm run build`.
- Garantir que nenhum arquivo de engine/cálculo teve seu conteúdo/lógica modificado (apenas imports alterados).
