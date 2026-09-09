# Type Safety Domain Segmentation

**Objetivo:** Transição de uma correção massiva para um programa progressivo de tipagem por domínio, mitigando o risco de regressões em engines fiduciárias.

---

## Ranking por Criticidade (Foco Primário)

| Domínio | CRITICAL | HIGH | MEDIUM | LOW | Total | Observação |
|---|---|---|---|---|---|---|
| `runtime` | 200 | 0 | 0 | 0 | **200** |  |
| `core/runtime/executive-governance-runtime.ts` | 143 | 0 | 0 | 0 | **143** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/institutional-reporting` | 113 | 0 | 0 | 0 | **113** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/governance` | 42 | 0 | 0 | 0 | **42** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/capital-governance` | 41 | 0 | 0 | 0 | **41** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/decision-governance` | 34 | 0 | 0 | 0 | **34** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/compliance` | 28 | 0 | 0 | 0 | **28** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/consolidated` | 26 | 0 | 0 | 0 | **26** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/constitutional-governance` | 24 | 0 | 0 | 0 | **24** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/integrity` | 24 | 0 | 0 | 0 | **24** | 🔒 Isolado (Requer Micro-sprint própria) |
| `services/cashFlowService.ts` | 22 | 0 | 0 | 0 | **22** |  |
| `core/runtime/observability` | 20 | 0 | 0 | 0 | **20** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/advisory-narrative` | 19 | 0 | 0 | 0 | **19** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/institutional-context` | 17 | 0 | 0 | 0 | **17** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/cash-governance` | 16 | 0 | 0 | 0 | **16** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/executive-consolidation` | 14 | 0 | 0 | 0 | **14** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/operating-pressure` | 14 | 0 | 0 | 0 | **14** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/scenario-governance` | 14 | 0 | 0 | 0 | **14** | 🔒 Isolado (Requer Micro-sprint própria) |
| `services/importService.ts` | 14 | 0 | 0 | 0 | **14** |  |
| `core/runtime/institutional-resilience` | 13 | 0 | 0 | 0 | **13** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/recovery-regression` | 13 | 0 | 0 | 0 | **13** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/audit-assurance` | 12 | 0 | 0 | 0 | **12** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/institutional-survival` | 12 | 0 | 0 | 0 | **12** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/publication-governance` | 12 | 0 | 0 | 0 | **12** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/presentation-governance` | 11 | 0 | 0 | 0 | **11** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/institutional-recovery` | 10 | 0 | 0 | 0 | **10** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/predictive-governance` | 10 | 0 | 0 | 0 | **10** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/causal-governance` | 9 | 0 | 0 | 0 | **9** | 🔒 Isolado (Requer Micro-sprint própria) |
| `services/logging` | 9 | 0 | 0 | 0 | **9** | ✅ Fase 1 (Aprovado) |
| `core/runtime/institutional-memory` | 8 | 0 | 0 | 0 | **8** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/strategic-governance` | 8 | 0 | 0 | 0 | **8** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/strategic-simulation` | 8 | 0 | 0 | 0 | **8** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/ai-governance` | 7 | 0 | 0 | 0 | **7** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/behavioral-governance` | 7 | 0 | 0 | 0 | **7** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/cashflow` | 7 | 0 | 0 | 0 | **7** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/integrations` | 7 | 0 | 0 | 0 | **7** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/lifecycle` | 7 | 0 | 0 | 0 | **7** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/monitoring` | 7 | 0 | 0 | 0 | **7** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/war-gaming` | 7 | 0 | 0 | 0 | **7** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/benchmarking` | 6 | 0 | 0 | 0 | **6** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/executive-command` | 6 | 0 | 0 | 0 | **6** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/executive-prioritization` | 6 | 0 | 0 | 0 | **6** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/operational-governance` | 6 | 0 | 0 | 0 | **6** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/temporal-governance` | 6 | 0 | 0 | 0 | **6** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/decision-policy` | 5 | 0 | 0 | 0 | **5** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/deployment-readiness` | 5 | 0 | 0 | 0 | **5** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/distributed` | 5 | 0 | 0 | 0 | **5** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/prescriptive-governance` | 5 | 0 | 0 | 0 | **5** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/tenancy` | 5 | 0 | 0 | 0 | **5** | 🔒 Isolado (Requer Micro-sprint própria) |
| `services/governanceService.ts` | 5 | 0 | 0 | 0 | **5** |  |
| `core/runtime/CrossStatementCausalityEngine.ts` | 4 | 0 | 0 | 0 | **4** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/ExecutivePriorityConsolidationEngine.ts` | 4 | 0 | 0 | 0 | **4** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/InstitutionalFinancialThesisEngine.ts` | 4 | 0 | 0 | 0 | **4** | 🔒 Isolado (Requer Micro-sprint própria) |
| `services/FiduciaryRuntimeAdapter.ts` | 4 | 0 | 0 | 0 | **4** |  |
| `services/aiBoardReportService.ts` | 4 | 0 | 0 | 0 | **4** |  |
| `services/governanceEngine.ts` | 4 | 0 | 0 | 0 | **4** |  |
| `core/runtime/board-pack` | 3 | 0 | 0 | 0 | **3** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/cash-causal-governance` | 3 | 0 | 0 | 0 | **3** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/dre` | 3 | 0 | 0 | 0 | **3** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/executive-timeline` | 3 | 0 | 0 | 0 | **3** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/governance-copilot` | 3 | 0 | 0 | 0 | **3** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/ios` | 3 | 0 | 0 | 0 | **3** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/orchestrator` | 3 | 0 | 0 | 0 | **3** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/product-governance` | 3 | 0 | 0 | 0 | **3** | 🔒 Isolado (Requer Micro-sprint própria) |
| `services/aiService.ts` | 3 | 0 | 0 | 0 | **3** |  |
| `services/taxService.ts` | 3 | 0 | 0 | 0 | **3** |  |
| `core/runtime/KPISemanticGovernanceEngine.ts` | 2 | 0 | 0 | 0 | **2** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/calibration` | 2 | 0 | 0 | 0 | **2** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/institutional-causality` | 2 | 0 | 0 | 0 | **2** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/institutional-evidence` | 2 | 0 | 0 | 0 | **2** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/prudency` | 2 | 0 | 0 | 0 | **2** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/reporting` | 2 | 0 | 0 | 0 | **2** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/ux-hardening` | 2 | 0 | 0 | 0 | **2** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/validation` | 2 | 0 | 0 | 0 | **2** | 🔒 Isolado (Requer Micro-sprint própria) |
| `services/notificationService.ts` | 2 | 0 | 0 | 0 | **2** |  |
| `lib` | 1 | 0 | 70 | 0 | **71** |  |
| `core/governance` | 1 | 0 | 0 | 0 | **1** |  |
| `core/runtime/ExecutiveNarrativeOrchestrator.ts` | 1 | 0 | 0 | 0 | **1** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/adapters` | 1 | 0 | 0 | 0 | **1** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/board-decision` | 1 | 0 | 0 | 0 | **1** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/cache` | 1 | 0 | 0 | 0 | **1** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/config` | 1 | 0 | 0 | 0 | **1** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/enterprise-validation` | 1 | 0 | 0 | 0 | **1** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/evidence-ingestion` | 1 | 0 | 0 | 0 | **1** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/executive` | 1 | 0 | 0 | 0 | **1** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/financial-context` | 1 | 0 | 0 | 0 | **1** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/lineage` | 1 | 0 | 0 | 0 | **1** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/performance` | 1 | 0 | 0 | 0 | **1** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/pilot-operations` | 1 | 0 | 0 | 0 | **1** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/profiling` | 1 | 0 | 0 | 0 | **1** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/scenario` | 1 | 0 | 0 | 0 | **1** | 🔒 Isolado (Requer Micro-sprint própria) |
| `core/runtime/treasury-governance` | 1 | 0 | 0 | 0 | **1** | 🔒 Isolado (Requer Micro-sprint própria) |
| `services/ClientExecutiveFinancialDataAdapter.ts` | 1 | 0 | 0 | 0 | **1** |  |
| `services/auditService.ts` | 1 | 0 | 0 | 0 | **1** |  |
| `services/security` | 1 | 0 | 0 | 0 | **1** | ✅ Fase 1 (Aprovado) |
| `services/supportService.ts` | 1 | 0 | 0 | 0 | **1** |  |
| `ui/hooks` | 0 | 85 | 0 | 0 | **85** |  |
| `ui/context` | 0 | 8 | 0 | 0 | **8** |  |
| `outros` | 0 | 5 | 554 | 35 | **594** |  |
| `ui/components` | 0 | 0 | 866 | 0 | **866** |  |
| `scripts` | 0 | 0 | 0 | 103 | **103** |  |
| `core/orchestration` | 0 | 0 | 37 | 0 | **37** |  |
| `types` | 0 | 0 | 20 | 0 | **20** |  |
| `core/security` | 0 | 0 | 16 | 0 | **16** | ✅ Fase 1 (Aprovado) |
| `core/presentation` | 0 | 0 | 15 | 0 | **15** |  |
| `contexts` | 0 | 0 | 12 | 0 | **12** |  |
| `core/executive-experience` | 0 | 0 | 11 | 0 | **11** |  |
| `governance` | 0 | 0 | 10 | 0 | **10** |  |
| `App.tsx` | 0 | 0 | 9 | 0 | **9** |  |
| `constants.ts` | 0 | 0 | 9 | 0 | **9** |  |
| `core/executive-delivery` | 0 | 0 | 9 | 0 | **9** |  |
| `data.ts` | 0 | 0 | 8 | 0 | **8** |  |
| `core/exporting` | 0 | 0 | 6 | 0 | **6** |  |
| `testing` | 0 | 0 | 0 | 6 | **6** |  |
| `app` | 0 | 0 | 5 | 0 | **5** |  |
| `tests` | 0 | 0 | 4 | 0 | **4** |  |
| `core/commercial` | 0 | 0 | 3 | 0 | **3** |  |
| `import-governance` | 0 | 0 | 3 | 0 | **3** |  |
| `core/adapters` | 0 | 0 | 2 | 0 | **2** |  |
| `core/enforcement` | 0 | 0 | 2 | 0 | **2** |  |
| `main.tsx` | 0 | 0 | 2 | 0 | **2** |  |
| `topology` | 0 | 0 | 2 | 0 | **2** |  |
| `i18n` | 0 | 0 | 1 | 0 | **1** |  |


## Ranking por Volume Bruto (Todas as Classificações)

| Posição | Domínio | Total de Ocorrências (Qualquer Risco) |
|---|---|---|
| 1 | `ui/components` | 866 |
| 2 | `outros` | 594 |
| 3 | `runtime` | 200 |
| 4 | `core/runtime/executive-governance-runtime.ts` | 143 |
| 5 | `core/runtime/institutional-reporting` | 113 |
| 6 | `scripts` | 103 |
| 7 | `ui/hooks` | 85 |
| 8 | `lib` | 71 |
| 9 | `core/runtime/governance` | 42 |
| 10 | `core/runtime/capital-governance` | 41 |
| 11 | `core/orchestration` | 37 |
| 12 | `core/runtime/decision-governance` | 34 |
| 13 | `core/runtime/compliance` | 28 |
| 14 | `core/runtime/consolidated` | 26 |
| 15 | `core/runtime/constitutional-governance` | 24 |
| 16 | `core/runtime/integrity` | 24 |
| 17 | `services/cashFlowService.ts` | 22 |
| 18 | `core/runtime/observability` | 20 |
| 19 | `types` | 20 |
| 20 | `core/runtime/advisory-narrative` | 19 |
| 21 | `core/runtime/institutional-context` | 17 |
| 22 | `core/runtime/cash-governance` | 16 |
| 23 | `core/security` | 16 |
| 24 | `core/presentation` | 15 |
| 25 | `core/runtime/executive-consolidation` | 14 |
| 26 | `core/runtime/operating-pressure` | 14 |
| 27 | `core/runtime/scenario-governance` | 14 |
| 28 | `services/importService.ts` | 14 |
| 29 | `core/runtime/institutional-resilience` | 13 |
| 30 | `core/runtime/recovery-regression` | 13 |
| 31 | `contexts` | 12 |
| 32 | `core/runtime/audit-assurance` | 12 |
| 33 | `core/runtime/institutional-survival` | 12 |
| 34 | `core/runtime/publication-governance` | 12 |
| 35 | `core/executive-experience` | 11 |
| 36 | `core/runtime/presentation-governance` | 11 |
| 37 | `core/runtime/institutional-recovery` | 10 |
| 38 | `core/runtime/predictive-governance` | 10 |
| 39 | `governance` | 10 |
| 40 | `App.tsx` | 9 |
| 41 | `constants.ts` | 9 |
| 42 | `core/executive-delivery` | 9 |
| 43 | `core/runtime/causal-governance` | 9 |
| 44 | `services/logging` | 9 |
| 45 | `ui/context` | 8 |
| 46 | `core/runtime/institutional-memory` | 8 |
| 47 | `core/runtime/strategic-governance` | 8 |
| 48 | `core/runtime/strategic-simulation` | 8 |
| 49 | `data.ts` | 8 |
| 50 | `core/runtime/ai-governance` | 7 |
| 51 | `core/runtime/behavioral-governance` | 7 |
| 52 | `core/runtime/cashflow` | 7 |
| 53 | `core/runtime/integrations` | 7 |
| 54 | `core/runtime/lifecycle` | 7 |
| 55 | `core/runtime/monitoring` | 7 |
| 56 | `core/runtime/war-gaming` | 7 |
| 57 | `core/exporting` | 6 |
| 58 | `core/runtime/benchmarking` | 6 |
| 59 | `core/runtime/executive-command` | 6 |
| 60 | `core/runtime/executive-prioritization` | 6 |
| 61 | `core/runtime/operational-governance` | 6 |
| 62 | `core/runtime/temporal-governance` | 6 |
| 63 | `testing` | 6 |
| 64 | `app` | 5 |
| 65 | `core/runtime/decision-policy` | 5 |
| 66 | `core/runtime/deployment-readiness` | 5 |
| 67 | `core/runtime/distributed` | 5 |
| 68 | `core/runtime/prescriptive-governance` | 5 |
| 69 | `core/runtime/tenancy` | 5 |
| 70 | `services/governanceService.ts` | 5 |
| 71 | `core/runtime/CrossStatementCausalityEngine.ts` | 4 |
| 72 | `core/runtime/ExecutivePriorityConsolidationEngine.ts` | 4 |
| 73 | `core/runtime/InstitutionalFinancialThesisEngine.ts` | 4 |
| 74 | `services/FiduciaryRuntimeAdapter.ts` | 4 |
| 75 | `services/aiBoardReportService.ts` | 4 |
| 76 | `services/governanceEngine.ts` | 4 |
| 77 | `tests` | 4 |
| 78 | `core/commercial` | 3 |
| 79 | `core/runtime/board-pack` | 3 |
| 80 | `core/runtime/cash-causal-governance` | 3 |
| 81 | `core/runtime/dre` | 3 |
| 82 | `core/runtime/executive-timeline` | 3 |
| 83 | `core/runtime/governance-copilot` | 3 |
| 84 | `core/runtime/ios` | 3 |
| 85 | `core/runtime/orchestrator` | 3 |
| 86 | `core/runtime/product-governance` | 3 |
| 87 | `import-governance` | 3 |
| 88 | `services/aiService.ts` | 3 |
| 89 | `services/taxService.ts` | 3 |
| 90 | `core/adapters` | 2 |
| 91 | `core/enforcement` | 2 |
| 92 | `core/runtime/KPISemanticGovernanceEngine.ts` | 2 |
| 93 | `core/runtime/calibration` | 2 |
| 94 | `core/runtime/institutional-causality` | 2 |
| 95 | `core/runtime/institutional-evidence` | 2 |
| 96 | `core/runtime/prudency` | 2 |
| 97 | `core/runtime/reporting` | 2 |
| 98 | `core/runtime/ux-hardening` | 2 |
| 99 | `core/runtime/validation` | 2 |
| 100 | `main.tsx` | 2 |
| 101 | `services/notificationService.ts` | 2 |
| 102 | `topology` | 2 |
| 103 | `core/governance` | 1 |
| 104 | `core/runtime/ExecutiveNarrativeOrchestrator.ts` | 1 |
| 105 | `core/runtime/adapters` | 1 |
| 106 | `core/runtime/board-decision` | 1 |
| 107 | `core/runtime/cache` | 1 |
| 108 | `core/runtime/config` | 1 |
| 109 | `core/runtime/enterprise-validation` | 1 |
| 110 | `core/runtime/evidence-ingestion` | 1 |
| 111 | `core/runtime/executive` | 1 |
| 112 | `core/runtime/financial-context` | 1 |
| 113 | `core/runtime/lineage` | 1 |
| 114 | `core/runtime/performance` | 1 |
| 115 | `core/runtime/pilot-operations` | 1 |
| 116 | `core/runtime/profiling` | 1 |
| 117 | `core/runtime/scenario` | 1 |
| 118 | `core/runtime/treasury-governance` | 1 |
| 119 | `i18n` | 1 |
| 120 | `services/ClientExecutiveFinancialDataAdapter.ts` | 1 |
| 121 | `services/auditService.ts` | 1 |
| 122 | `services/security` | 1 |
| 123 | `services/supportService.ts` | 1 |


## Recomendação de Ordem de Ataque (Programa Progressivo)

Devido ao risco sistêmico das engines fiduciárias, a estratégia de refatoração deve começar pela base de serviços e orquestração lateral, avançando camada por camada até o núcleo.

### Fase 1: Serviços de Borda (Aprovada e em andamento)
- **Escopo:** `services/security` e `services/logging`
- **Motivo:** Escopo controlado, impacto direto na confiabilidade das auditorias, baixo risco funcional e financeiro.

### Fase 2: Serviços Compartilhados e Adapters
- **Escopo:** Outros módulos em `services/` e `adapters/`
- **Motivo:** Preparam o terreno para fornecer payloads fortemente tipados para os motores principais.

### Fase 3: Camada Fiduciária Primária (Engines Determinísticas)
- **Escopo:** `core/runtime/bp`, `core/runtime/dre`, `core/runtime/treasury-governance`
- **Motivo:** Motores de cálculo estático. Exigem validação matemática rigorosa após qualquer alteração de tipo.

### Fase 4: Camada Estratégica e Orquestração
- **Escopo:** `core/runtime/executive`, `core/runtime/governance-orchestration`
- **Motivo:** Consomem dados das camadas anteriores; se a base já for estrita, a orquestração será naturalmente estrita.

### Fase 5: Cenários e Simulação (Alta Complexidade)
- **Escopo:** `core/runtime/scenario`, `core/runtime/scenario-simulation`
- **Motivo:** Altíssimo acoplamento e criticidade. É a camada final.

---
