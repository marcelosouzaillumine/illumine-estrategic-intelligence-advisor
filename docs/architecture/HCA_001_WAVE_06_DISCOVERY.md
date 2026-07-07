# HCA-001 Wave 06 — Financial Capability Discovery

**Objetivo:** Mapear o *Reactivity Drift* (uso de hooks) e o *Runtime Coupling* (imports diretos de engines) na Financial Capability, preparando o terreno para a refatoração HCA.

## 1. Resumo Executivo
* **Total de Arquivos Analisados:** 37
* **Arquivos com Drift (Ofensores):** 12
* **Arquivos já Dumb Renderers:** 25

## 2. Análise por Sub-Capability

### BALANCE-SHEET
| Arquivo | Tipo | Drift Score | Hooks (Total) | useState | useEffect | useMemo | useCallback | Runtime Imports |
|---------|------|-------------|---------------|----------|-----------|---------|-------------|-----------------|
| `BalanceSheetPage.tsx` | Page | **48** | 34 | 7 | 3 | 15 | 0 | 7 |
| `BalanceSheetExecutiveSynthesisSection.tsx` | Component | **5** | 1 | 0 | 0 | 1 | 0 | 2 |
| `BalanceSheetEvolutionAnalysisSection.tsx` | Component | **4** | 0 | 0 | 0 | 0 | 0 | 2 |
| `BPStrategicDiagnosisAdapter.ts` | Component | **4** | 0 | 0 | 0 | 0 | 0 | 2 |
| `BalanceSheetExecutivePlan.tsx` | Component | **2** | 0 | 0 | 0 | 0 | 0 | 1 |
| `BalanceSheetActionToolbar.tsx` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |
| `BalanceSheetAssetQualitySection.tsx` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |
| `BalanceSheetAuditLayerSection.tsx` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |
| `BalanceSheetBoardAdvisory.tsx` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |
| `BalanceSheetCapitalEfficiencySection.tsx` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |
| `BalanceSheetCapitalPreservationSection.tsx` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |
| `BalanceSheetCapitalStructureSection.tsx` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |
| `BalanceSheetCompositionChartsSection.tsx` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |
| `BalanceSheetDataSourceStatus.tsx` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |
| `BalanceSheetInstitutionalContextSection.tsx` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |
| `BalanceSheetLiquiditySection.tsx` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |
| `BalanceSheetStructuralTablesSection.tsx` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |
| `BalanceSheetTechnicalLayerSection.tsx` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |
| `BalanceSheetWaterfallChartSection.tsx` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |
| `BalanceSheetWorkingCapitalSection.tsx` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |
| `BalanceSheetYearFilter.tsx` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |
| `types.ts` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |
| `view-models.ts` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |

### DLPA
| Arquivo | Tipo | Drift Score | Hooks (Total) | useState | useEffect | useMemo | useCallback | Runtime Imports |
|---------|------|-------------|---------------|----------|-----------|---------|-------------|-----------------|
| `DLPAPage.tsx` | Page | **42** | 20 | 5 | 4 | 9 | 0 | 11 |
| `DLPAActionToolbar.tsx` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |
| `DLPADataSourceStatus.tsx` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |
| `DLPAYearFilter.tsx` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |

### DFC
| Arquivo | Tipo | Drift Score | Hooks (Total) | useState | useEffect | useMemo | useCallback | Runtime Imports |
|---------|------|-------------|---------------|----------|-----------|---------|-------------|-----------------|
| `DFCPage.tsx` | Page | **35** | 21 | 6 | 4 | 6 | 0 | 7 |

### DRE
| Arquivo | Tipo | Drift Score | Hooks (Total) | useState | useEffect | useMemo | useCallback | Runtime Imports |
|---------|------|-------------|---------------|----------|-----------|---------|-------------|-----------------|
| `DREPage.tsx` | Page | **27** | 19 | 5 | 5 | 2 | 0 | 4 |
| `DREEconomicBreakdownSection.tsx` | Component | **4** | 0 | 0 | 0 | 0 | 0 | 2 |
| `DREExecutiveAdvisorySection.tsx` | Component | **4** | 2 | 0 | 0 | 1 | 0 | 1 |
| `DREHealthScoreSection.tsx` | Component | **1** | 1 | 0 | 0 | 0 | 0 | 0 |
| `DRETechnicalLayerSection.tsx` | Component | **1** | 1 | 0 | 0 | 0 | 0 | 0 |
| `DREBoardDecisionSupportSection.tsx` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |
| `DREExecutivePlanSection.tsx` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |
| `types.ts` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |
| `view-models.ts` | Component | **0** | 0 | 0 | 0 | 0 | 0 | 0 |

## 3. Top Ofensores (Ranking Geral)

| Rank | Arquivo | Sub-Capability | Drift Score | Detalhe Principal |
|------|---------|----------------|-------------|-------------------|
| 1 | `src/components/pages/BalanceSheetPage.tsx` | BALANCE-SHEET | **48** | 7 Runtime Imports |
| 2 | `src/components/pages/DLPAPage.tsx` | DLPA | **42** | 11 Runtime Imports |
| 3 | `src/components/pages/DFCPage.tsx` | DFC | **35** | 7 Runtime Imports |
| 4 | `src/components/pages/DREPage.tsx` | DRE | **27** | 4 Runtime Imports |
| 5 | `src/components/pages/balance-sheet/BalanceSheetExecutiveSynthesisSection.tsx` | BALANCE-SHEET | **5** | 2 Runtime Imports |
| 6 | `src/components/pages/balance-sheet/BalanceSheetEvolutionAnalysisSection.tsx` | BALANCE-SHEET | **4** | 2 Runtime Imports |
| 7 | `src/components/pages/balance-sheet/adapters/BPStrategicDiagnosisAdapter.ts` | BALANCE-SHEET | **4** | 2 Runtime Imports |
| 8 | `src/components/pages/dre/DREEconomicBreakdownSection.tsx` | DRE | **4** | 2 Runtime Imports |
| 9 | `src/components/pages/dre/DREExecutiveAdvisorySection.tsx` | DRE | **4** | 1 Runtime Imports |
| 10 | `src/components/pages/balance-sheet/BalanceSheetExecutivePlan.tsx` | BALANCE-SHEET | **2** | 1 Runtime Imports |
| 11 | `src/components/pages/dre/DREHealthScoreSection.tsx` | DRE | **1** | 1 Hooks |
| 12 | `src/components/pages/dre/DRETechnicalLayerSection.tsx` | DRE | **1** | 1 Hooks |

## 4. Proposta: HCA-001 Wave 06A

Com base no ranking de Drift Score, sugerimos iniciar a extração pelos componentes mais críticos. A Wave 06A abordará o topo da lista para remover os maiores nós de acoplamento.

**Escopo Sugerido (Máx 3 Arquivos):**
- `src/components/pages/BalanceSheetPage.tsx` (Score: 48)
- `src/components/pages/DLPAPage.tsx` (Score: 42)
- `src/components/pages/DFCPage.tsx` (Score: 35)

**Aguardando autorização para iniciar o planejamento e execução da Wave 06A.**
