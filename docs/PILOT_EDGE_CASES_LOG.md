# Diário de Casos Extremos da Operação Piloto (Phase 8.3)

Este documento registra incidentes reais, inconsistências contábeis e anomalias de dados capturadas durante a execução do piloto estratégico.

## 1. Classificação das Ocorrências

Toda ocorrência identificada no pipeline governado deve ser registrada abaixo seguindo esta tipificação:

| ID Evento | Data | Tipo | Gravidade | Descrição do Caso | Ação Corretiva Executada |
|---|---|---|---|---|---|
| PILOT-001 | 2026-05-26 | Conflito Contábil | CRITICAL | Desbalanço material no BP (Ativo - Passivo - PL > 1.2%). | Aplicado `PilotRollbackProtocol` para status REVERTED, solicitada nova exportação do ERP. |
| PILOT-002 | 2026-05-26 | Falha Humana | WARNING | Operador importou DFC como se fosse DRE (mismatch de tipo). | Sistema barrou no parser inicial de tipo de dados. |
| PILOT-003 | 2026-05-26 | Inconsistência Transacional | WARNING | Ausência de data de vencimento (`MISSING_DUE_DATE`) em contas a pagar. | Registrado no StagingValidationEngine, bloqueado no dashboard fiduciário. |

## 2. Padrões de Confidence Collapse Detectados

- **Diferenças cambiais intercompany**: Casos em que a holding declara um mútuo em reais e a subsidiária em dólares com discrepância de arredondamento.
- **Mistura de Competência e Caixa**: Transações avulsas sem correspondência contábil no mesmo período gerando `CASHFLOW_MISMATCH` temporário.

## 3. Diretrizes de Auditoria Fiduciária

Em caso de colapso de confiança ou degradação do runtime (`PARTIAL_FINANCIAL_VIEW`):
1. **Não tentar inferir localmente na UI**.
2. **Não recalcular valores**.
3. **Disparar o Alerta de Degradação** no painel de observabilidade piloto.
