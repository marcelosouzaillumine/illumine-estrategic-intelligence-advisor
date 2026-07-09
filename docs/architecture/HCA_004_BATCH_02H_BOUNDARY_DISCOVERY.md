# HCA-004 Batch 2H: UI Boundary Reduction Discovery

## 1. Contexto e Meta
Este Discovery marca a oitava onda do programa HCA-004. Continuamos com o escopo de abstrair dependências diretas de banco de dados e autenticação (`firebase/firestore`, `firebase/auth`) da camada visual.
Seguimos com a regra de atuar apenas em `.tsx` (sem mexer em Services ou ViewModels) e sem tocar nos módulos Core/Runtime.

- **Baseline Atual:** 240 violações.
- **Meta do Batch 2H:** ~230 violações.

## 2. Recálculo e Próximos Ofensores (Top Ranking - UI Only)
O novo mapeamento (`scripts/validate_architecture_boundaries.cjs`) encontrou os seguintes arquivos puramente visuais como maiores detentores de acoplamento direto:

1. `AssetModal.tsx` (3 violações)
2. `BankAccountModal.tsx` (3 violações)
3. `BankTransactionsModal.tsx` (3 violações)
4. `DocumentCurationModal.tsx` (3 violações)
5. `ManualFinancialModal.tsx` (3 violações)
6. `MappingWizard.tsx` (3 violações)
7. `AnaliseFinanceiraPage.tsx` (3 violações)
8. `AnaliseMercadoPage.tsx` (3 violações)
9. `AssetManagementPage.tsx` (3 violações)
10. `AvaliacaoOrganogramaPage.tsx` (3 violações)

## 3. Seleção de Alvos SAFE (Batch 2H)
Para este Batch, optamos por focar estrategicamente na camada de **Modais**. Os modais formam pequenos componentes atômicos que frequentemente abrigam requisições pontuais de escrita ou leitura rápidas. Ao limpá-los, consolidamos uma governança forte sobre formulários paralelos.

**Alvos Escolhidos:**
1. **`AssetModal.tsx`**
   - *Violações estimadas removidas:* 3
   - *Proposta:* Migrar inserção e edição de ativos para um `useAssetModalAdapter.ts`.

2. **`BankAccountModal.tsx`**
   - *Violações estimadas removidas:* 3
   - *Proposta:* Abstrair lógica de manipulação de contas bancárias em `useBankAccountModalAdapter.ts`.

3. **`BankTransactionsModal.tsx`**
   - *Violações estimadas removidas:* 3
   - *Proposta:* Migrar a listagem/exclusão/criação das movimentações para um `useBankTransactionsModalAdapter.ts`.

4. **`ManualFinancialModal.tsx`**
   - *Violações estimadas removidas:* 3
   - *Proposta:* Migrar lançamento financeiro manual no Firestore para um `useManualFinancialModalAdapter.ts`.

**Redução Esperada:** ~12 violações.
**Estimativa Final:** 240 → 228.

## 4. Regras e Restrições de Execução
- Somente a camada UI `.tsx` de Modais será manipulada.
- Adição dos *Thin Adapters* em `src/adapters/ui/`.
- Foco em remover as referências diretas de Firestore/Firebase.
- Zero Visual Impact (não modificar JSX/comportamento da View).
- ViewModels e Runtime intocáveis.

*Aguardando aprovação para iniciar a certificação deste Batch.*
