# HCA-005 BATCH 01B - DISCOVERY (SAFE Adapters)

## Objetivo
Mapear de 8 a 12 arquivos SAFE da camada de adaptadores de UI (`src/adapters/ui/`) e ApplicationServices secundários que ainda dependem de `firebase/firestore` ou `auth` diretamente. O objetivo da execução posterior será substituir esses imports pelos novos Persistence Adapters (`FirestoreFinancialAdapter`, `FirestoreClientsAdapter`, `FirestoreAuthAdapter` ou novos se necessário).

## Categoria A (SAFE Targets)
Os seguintes componentes foram mapeados e possuem baixo risco, por operarem apenas leituras simples, exclusões unitárias e não interferirem no Runtime fiduciário:

1. **`src/adapters/ui/useAnaliseFinanceiraPageAdapter.ts`**
   - Risco: SAFE
   - Violações: 2 (`collection`, `getDocs`)
   - Resolução sugerida: Requer criar `FirestoreCashFlowAdapter` ou adicionar suporte a `cash_flows` no FinancialAdapter.
2. **`src/adapters/ui/useAnaliseMercadoPageAdapter.ts`**
   - Risco: SAFE
   - Violações: 2 (`collection`, `getDocs`)
   - Resolução sugerida: Criar `FirestoreMarketAnalysisAdapter`.
3. **`src/adapters/ui/useAssetManagementPageAdapter.ts`**
   - Risco: SAFE
   - Violações: 5 (`collection`, `onSnapshot`, `addDoc`, `updateDoc`, `deleteDoc`)
   - Resolução sugerida: Criar `FirestoreAssetsAdapter`.
4. **`src/adapters/ui/useAvaliacaoOrganogramaPageAdapter.ts`**
   - Risco: SAFE
   - Violações: 3 (`collection`, `onSnapshot`, `doc`)
   - Resolução sugerida: Requer `FirestoreOrganizationalAdapter`.
5. **`src/adapters/ui/useCashFlowPageAdapter.ts`**
   - Risco: SAFE
   - Violações: 4 (`collection`, `getDocs`, `query`, `where`)
   - Resolução sugerida: Integrar em `FirestoreFinancialAdapter`.
6. **`src/adapters/ui/useGestaoUsuariosAdapter.ts`**
   - Risco: SAFE
   - Violações: 4 (`collection`, `onSnapshot`, `updateDoc`, `deleteDoc`)
   - Resolução sugerida: Usar/Expandir `FirestoreAuthAdapter` ou criar `FirestoreUsersAdapter`.
7. **`src/adapters/ui/usePlanoDeContasAdapter.ts`**
   - Risco: SAFE
   - Violações: 5 (`collection`, `onSnapshot`, `addDoc`, `updateDoc`, `deleteDoc`)
   - Resolução sugerida: Integrar em `FirestoreClientsAdapter` (já que faz parte das configurações de cliente) ou novo adapter.
8. **`src/adapters/ui/usePremissasClienteAdapter.ts`**
   - Risco: SAFE
   - Violações: 3 (`collection`, `getDocs`, `setDoc`)
   - Resolução sugerida: Criar `FirestoreAssumptionsAdapter`.
9. **`src/adapters/ui/usePremissasEconomicasAdapter.ts`**
   - Risco: SAFE
   - Violações: 3 (`collection`, `getDocs`, `setDoc`)
   - Resolução sugerida: Criar `FirestoreAssumptionsAdapter`.
10. **`src/adapters/ui/useSalesPipelineAdapter.ts`**
    - Risco: SAFE
    - Violações: 5 (`collection`, `onSnapshot`, `addDoc`, `updateDoc`, `deleteDoc`)
    - Resolução sugerida: Criar `FirestoreSalesAdapter`.
11. **`src/adapters/ui/useQuadroPessoalAdapter.ts`**
    - Risco: SAFE
    - Violações: 4 (`collection`, `getDocs`, `deleteDoc`, `doc`)
    - Resolução sugerida: Criar `FirestoreHRAdapter`.
12. **`src/adapters/ui/useDFCPageAdapter.ts`**
    - Risco: SAFE
    - Violações: 3 (`collection`, `getDocs`, `deleteDoc`)
    - Resolução sugerida: Integrar em `FirestoreFinancialAdapter` (ou já integrado no serviço).

## Ações Recomendadas para Execução
- Criar a base de novos adaptadores (`FirestoreSalesAdapter`, `FirestoreHRAdapter`, `FirestoreAssetsAdapter`).
- Refatorar `useCashFlowPageAdapter` e `useDFCPageAdapter` para utilizar o `FirestoreFinancialAdapter` atual.
- Proceder com typecheck a cada 3-5 arquivos alterados.
