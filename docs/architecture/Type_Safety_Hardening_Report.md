# Type Safety Hardening v1.2 - Report (Micro-sprint 3)

**Data:** 2026-06-09
**Estratégia Adotada:** Programa Progressivo de Tipagem por Domínio

## Resumo do Escopo Geral (Micro-sprint 3: Financial Adapters & Firestore Payload Contracts)

**Objetivo:** Substituição de `any` e `Record<string, any>` por contratos estruturais mínimos nos hooks e serviços que fazem intersecção com o banco de dados e arquivos de importação, sem alterar as *Engines Fiduciárias* ou a *Lógica de Cálculos*.

**Arquivos Foco:**
- `src/hooks/useFinancialData.ts`
- `src/hooks/useRealIndicatorData.ts`
- `src/services/cashFlowService.ts`
- `src/services/importService.ts`
- `src/services/ClientExecutiveFinancialDataAdapter.ts`

## Contratos Estruturais Adotados

Uma biblioteca local foi inicializada em `src/types/contracts/index.ts` contendo as divisões exatas da estrutura:
1. **FirestoreContracts:** 
   - Base com `createdAt?: unknown` e `updatedAt?: unknown` (para respeitar a ambiguidade temporal de Mocks x Firebase Timestamp).
   - `FirestoreDocument` e `TenantDocument` definidos.
2. **FinancialContracts:**
   - `FinancialStatementLike` (Representa o invólucro Firestore que contém arrays aninhados `data`).
   - `FinancialEntryLike` (Contém flexibilização dos nomes legados como `category`/`conta`, `value`/`valor`).
   - `PayableEntry`, `ReceivableEntry`, `PositionEntry`.
3. **IndicatorContracts:**
   - `EconomicAssumption` e `IndicatorValue`
4. **ImportContracts:**
   - `ImportedSpreadsheetRow` (substituindo `any[][]`) e `ImportedPdfTextItem` (substituindo iteradores genéricos de texto PDF).

## Ações de Refatoração e Contenção

As camadas foram refatoradas substituindo o typecast vazio `as any` ou o inferido `any` pelos novos contratos. 
**Exceções Acatadas (Casos Não Resolvidos):**
- A mock data injetada via constante em `cashFlowService` foi convertida de `(DATA as any)` para `(DATA as unknown as PreComputedData)` - garantindo a eliminação da keyword `any` mas documentando a natureza frouxa do JSON importado.
- Os *DataTables* flexíveis da UI em `useDataTable.ts` permanecem adiados para refatoração visual paralela (preservando o layout genérico atual).

## Validação e Conformidade
A injeção de `[key: string]: unknown` (via `UnknownRecord`) blindou a camada de importação contra invasões sintáticas e quebras de parsing, obrigando os consumidores a ler chaves literais estruturadas, mantendo a regra de compatibilidade com *Fallbacks* (`docData.type || docData.tipo`).

- **Typecheck:** Executado e Aprovado
- **Testes (ELSF/TFIF):** Executados e Aprovados (Assegura as *Engines Fiduciárias*)
- **Build:** Executado e Aprovado

## Próximos Passos
O núcleo fiduciário da plataforma (as `Engines` financeiras de DFC, DLPA, BP) está estruturalmente pronto para iniciar o fechamento de vazamentos de variáveis puramente computacionais e de Scoring. Ou, como sugerido, iniciar a frente de *Console Migration Program*.
