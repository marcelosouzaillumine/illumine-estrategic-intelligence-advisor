# Runtime Domain Review Program v1.0 — Consolidated Runtime
## Relatório de Auditoria Local

Este relatório foca exclusivamente nas ocorrências dentro de `src/core/runtime/consolidated/`.

### Resumo Executivo
- **DO_NOT_TOUCH:** 3 ocorrências
- **REVIEW_REQUIRED:** 7 ocorrências
- **SAFE_NOW:** 0 ocorrências

---

## DO_NOT_TOUCH (3 itens)
| Arquivo | Linha | Código | Justificativa |
|---|---|---|---|
| `IntercompanyEliminationEngine.ts` | 8 | `eliminatedEntries: any[];` | Estrutura financeira central (BP/DRE/Intercompany). Alteração proibida nesta fase. |
| `data/dataTypes.ts` | 10 | `intercompanyRelations: any[];` | Estrutura financeira central (BP/DRE/Intercompany). Alteração proibida nesta fase. |
| `data/dataTypes.ts` | 11 | `ownershipStructure: any[];` | Estrutura financeira central (BP/DRE/Intercompany). Alteração proibida nesta fase. |

## REVIEW_REQUIRED (7 itens)
| Arquivo | Linha | Código | Justificativa |
|---|---|---|---|
| `ConsolidatedRuntimeOrchestrator.ts` | 38 | `public runConsolidatedAnalysis(input: any): ExecutiveIntelli` | Contrato de entrada público. Requer mapeamento do payload antes da alteração. |
| `IntercompanyEliminationEngine.ts` | 9 | `unreconciledIntercompany: any[];` | Análise manual pendente. |
| `IntercompanyEliminationEngine.ts` | 10 | `eliminationWarnings: any[];` | Análise manual pendente. |
| `IntercompanyEliminationEngine.ts` | 11 | `consolidationAdjustments: any[];` | Análise manual pendente. |
| `consolidated-types.ts` | 83 | `rawData: any;` | Contrato base de dados crus. Exige tipagem de DFC/DRE/BP. |
| `data/ConsolidatedGroupRepository.ts` | 21 | `const entities: ConsolidationEntity[] = (data.entities || []` | Mapeamento de array dinâmico. Risco de quebra ao alterar para unknown sem cast. |
| `types.ts` | 87 | `auditTrail: { timestamp: string; action: string; [key: strin` | Metadados dinâmicos de auditoria. Exige Record<string, unknown>. |

## SAFE_NOW (0 itens)
_Nenhuma ocorrência encontrada._

