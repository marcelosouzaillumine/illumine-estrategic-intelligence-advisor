# HCA-004 Batch 2I: UI Boundary Reduction Discovery

## 1. Contexto e Meta
Este Discovery inicia a nona onda do programa HCA-004, dando continuidade imediata ao **RC-005** (Checkpoint de 229 violações). 
O foco permanece estritamente na remoção de dependências diretas de banco de dados (`firebase/firestore`, `firebase/auth`) da camada visual `.tsx`. 
A meta deste lote é empurrar a contagem de violações para mais perto de 200, momento em que poderemos migrar o foco para o HCA-005.

- **Baseline Atual:** 229 violações.
- **Meta Prática (Pré-HCA-005):** ~200 violações.

## 2. Recálculo e Próximos Ofensores (Top Ranking - UI Only)
Rodamos novamente o script extrator para listar os arquivos `.tsx` remanescentes com maior número de acessos diretos. As Views mais ofensoras identificadas foram:

1. `DocumentCurationModal.tsx` (3 violações)
2. `MappingWizard.tsx` (3 violações)
3. `AnaliseFinanceiraPage.tsx` (3 violações)
4. `AnaliseMercadoPage.tsx` (3 violações)
5. `AssetManagementPage.tsx` (3 violações)
6. `AvaliacaoOrganogramaPage.tsx` (3 violações)
7. `AxisDashboardPage.tsx` (3 violações)
8. `CashFlowPage.tsx` (3 violações)
9. `CleanupTool.tsx` (3 violações)
10. `ConsolidatedGroupAdminPage.tsx` (3 violações)

## 3. Seleção de Alvos SAFE (Batch 2I)
Para este Batch, optamos por focar nos dois últimos modais e em duas páginas periféricas, garantindo 4 alvos bastante seguros, sem impacto nos *workflows* fiduciários ou painéis principais.

**Alvos Escolhidos:**
1. **`DocumentCurationModal.tsx`**
   - *Violações estimadas removidas:* 3
   - *Proposta:* Migrar inserção e deleção de curadorias para um `useDocumentCurationModalAdapter.ts`.

2. **`MappingWizard.tsx`**
   - *Violações estimadas removidas:* 3
   - *Proposta:* Abstrair lógica do wizard de mapeamento para `useMappingWizardAdapter.ts`.

3. **`AnaliseFinanceiraPage.tsx`**
   - *Violações estimadas removidas:* 3
   - *Proposta:* Mover a leitura de análises para um `useAnaliseFinanceiraPageAdapter.ts`.

4. **`AnaliseMercadoPage.tsx`**
   - *Violações estimadas removidas:* 3
   - *Proposta:* Migrar a leitura de cenários macro e de mercado para um `useAnaliseMercadoPageAdapter.ts`.

**Redução Esperada do Lote:** ~12 violações.
**Estimativa Final:** 229 → 217.

## 4. Regras e Restrições de Execução
- Somente a camada UI `.tsx` listada será manipulada.
- Adição dos *Thin Adapters* em `src/adapters/ui/`.
- Foco em remover as referências diretas de Firestore/Firebase.
- Zero Visual Impact (não modificar JSX/comportamento da View).
- ViewModels e Runtime intocáveis.

*Aguardando aprovação para iniciar a certificação deste Batch.*
