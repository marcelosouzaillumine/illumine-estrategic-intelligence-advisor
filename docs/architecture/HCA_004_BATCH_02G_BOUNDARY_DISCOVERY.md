# HCA-004 Batch 2G: UI Boundary Reduction Discovery

## 1. Contexto e Status Atual
Dando continuidade ao HCA-004 (Boundary Reduction Program), o Batch 2G visa estritamente componentes visuais puros (`.tsx`) que ainda importam e executam lógica de Firebase, Auth ou Storage diretamente. Serviços de Aplicação e ViewModels foram isolados para o HCA-005.

- **Baseline Atual:** 252 violações.
- **Meta do Batch 2G:** Reduzir o número para **~240 violações**.

## 2. Recálculo e Próximos Ofensores (Top Ranking - UI Only)
Após recalcular o ranking, focando apenas em arquivos da camada de interface (`.tsx`) e filtrando infraestrutura de Core e Runtime, os top 10 maiores ofensores visuais do Firebase atualmente são:

1. `EmployeeManager.tsx` (3 violações)
2. `PayrollDashboard.tsx` (3 violações)
3. `SalesPipelineManager.tsx` (3 violações)
4. `AssetModal.tsx` (3 violações)
5. `BankAccountModal.tsx` (3 violações)
6. `BankTransactionsModal.tsx` (3 violações)
7. `DocumentCurationModal.tsx` (3 violações)
8. `ManualFinancialModal.tsx` (3 violações)
9. `MappingWizard.tsx` (3 violações)
10. `AdministrativaPage.tsx` (3 violações)

## 3. Seleção de Alvos SAFE (Batch 2G)
Para este lote, selecionamos 4 componentes principais de escopo delimitado, que operam de forma isolada, não apresentando riscos para o fluxo fiduciário ou integrações temporais:

1. **`EmployeeManager.tsx`**
   - *Violações estimadas removidas:* 3
   - *Proposta:* Criar o `src/adapters/ui/useEmployeeManagerAdapter.ts` para abstrair operações de leitura/escrita na coleção de funcionários no Firestore.

2. **`PayrollDashboard.tsx`**
   - *Violações estimadas removidas:* 3
   - *Proposta:* Criar o `src/adapters/ui/usePayrollDashboardAdapter.ts` abstraindo as consultas (queries) da base de dados e simplificando a renderização visual do dashboard.

3. **`SalesPipelineManager.tsx`**
   - *Violações estimadas removidas:* 3
   - *Proposta:* Extrair toda as interações de Funil de Vendas do Firebase e instanciar em um `useSalesPipelineAdapter.ts`.

4. **`AdministrativaPage.tsx`**
   - *Violações estimadas removidas:* 3
   - *Proposta:* Refatorar os listeners e operações na página administrativa genérica direcionando-os a um `useAdministrativaPageAdapter.ts`.

**Redução Esperada:** ~12 violações.
**Estimativa Final:** 252 → ~240.

## 4. Regras e Restrições de Execução (Próximo Passo)
- Trabalhar exclusivamente na UI (`.tsx`).
- Criar adaptadores em `src/adapters/ui/` respeitando o design pattern thin-adapter.
- Sem refatorações de design, componentes UI ou lógica de negócio (Zero Visual Impact).
- Manter ViewModels, Core Engines e Serviços completamente intocados.

*Aguardando autorização para iniciar a execução de certificação do Batch 2G.*
