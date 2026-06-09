# Runtime Domain Review Program v1.4 — Core Governance
## Relatório de Auditoria Local

Este relatório foca exclusivamente nas ocorrências dentro de `src/core/governance/`.

### Resumo Executivo
- **DO_NOT_TOUCH:** 0 ocorrências
- **REVIEW_REQUIRED:** 1 ocorrência
- **SAFE_NOW:** 0 ocorrências

---

## DO_NOT_TOUCH (0 itens)
_Nenhuma ocorrência encontrada._

## REVIEW_REQUIRED (1 item)
| Arquivo | Linha | Código | Justificativa |
|---|---|---|---|
| `signal-hierarchy/types.ts` | 43 | `metadata?: Record<string, any>;` | Metadados na hierarquia de sinais (Signal). Tipar como `unknown` requer validação nos consumos do sinal. |

## SAFE_NOW (0 itens)
_Nenhuma ocorrência encontrada._
