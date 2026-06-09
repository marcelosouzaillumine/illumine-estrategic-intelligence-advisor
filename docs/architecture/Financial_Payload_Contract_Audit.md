# Auditoria de Contratos Financeiros e Payloads (Micro-sprint 3)

## Objetivos e Abordagem
A finalidade desta auditoria foi isolar e modelar os formatos de dados das origens dinâmicas (Firestore, Mocks, Importações), gerando os `src/types/contracts` para evitar o uso de `any` em `useFinancialData`, `useRealIndicatorData`, `cashFlowService`, e `importService`.

## Contratos Mapeados

### 1. Firestore Document Model
Todo documento resgatado via `onSnapshot` ou `getDocs` que represente um dado contábil agora estende `FirestoreDocument`, que traz as proteções mínimas de ambiente e status, com propriedades flexíveis sob `UnknownRecord`.

### 2. Formatos de Entry Financeira (`FinancialEntryLike`)
Foram identificados 4 tipos de achatamento legado que são unificados no front-end:
- **`category` / `value`**: Padrão do DFC e de importações CSV.
- **`conta` / `valor`**: Padrão das sublinhas do BP manual.
- **`type` / `tipo`**: Diferenciação de Ativo/Passivo.
- **Estruturas Hierárquicas (`data` array)**: Mapeadas via `FinancialStatementLike` que contém recursivamente as `FinancialEntryLike`.

### 3. Casos Dinâmicos e Ambíguos Retidos (Não Resolvidos)
De acordo com as regras fiduciárias ("não alterar comportamento" e "documentar"), foram documentados os seguintes itens que dependem de Mocks legados sem tipagem exata e permanecem tratados com contratos frouxos (`UnknownRecord` ou Casts documentados):
1. **`DATA` Mock em `cashFlowService`**: O mock é inteiramente injetado via JSON externo, então usamos um cast para `PreComputedData` que blinda o compilador mas adverte que as propriedades (`premissas.economicas`) são dinâmicas.
2. **Dynamic UI Tables**: O hook `useDataTable.ts` não foi tipado estruturalmente, porque ele serve para n-contextos que constroem tabelas no painel de executivos.

## Conclusão
A tipagem fiduciária básica do Firestore e das Importações de Excel foi firmada, reduzindo substancialmente as brechas e vazamentos passados da camada adaptadora para a UI.
