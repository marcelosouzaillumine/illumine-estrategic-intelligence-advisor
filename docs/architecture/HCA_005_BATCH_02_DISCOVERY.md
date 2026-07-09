# HCA-005 BATCH 02 DISCOVERY
## Application Services & ViewModels Canonicalization

### 1. Escopo e Objetivo
Mapear `ApplicationServices` e `ViewModels` (Hooks) que ainda importam `firebase/firestore`, `firebase/auth` ou `../../lib/firebase` diretamente. 
A meta é selecionar entre 8 e 12 alvos **SAFE**, excluindo Runtime/Engines e Domain Services de alto risco, substituindo-os pelos `Persistence Adapters` padronizados.

### 2. Resultados do Discovery
Identificamos um total de 71 arquivos no `src/` (excluindo adaptadores e motores) com chamadas diretas à infraestrutura Firebase.
Dentre eles, filtramos os Hooks (`ViewModels`) e `Services` (`ApplicationServices`).

#### Alvos SAFE Selecionados (12 arquivos)

**ViewModels (Hooks):**
1. `src/hooks/useAcademyData.ts` - *SAFE*
2. `src/hooks/useAccountPlan.ts` - *SAFE*
3. `src/hooks/useFinancialData.ts` - *SAFE*
4. `src/hooks/useHistoricalDemonstracoes.ts` - *SAFE*
5. `src/hooks/useMethodologicalAnalysis.ts` - *SAFE*
6. `src/hooks/useModuleData.ts` - *SAFE*
7. `src/hooks/usePaginatedData.ts` - *SAFE*
8. `src/hooks/useRealIndicatorData.ts` - *SAFE*

**Application Services:**
9. `src/services/cashFlowService.ts` - *SAFE*
10. `src/services/governanceService.ts` - *SAFE*
11. `src/services/platform/auditService.ts` - *SAFE*
12. `src/services/platform/notificationService.ts` - *SAFE*

### 3. Estratégia de Execução (Próximos Blocos)
**Bloco 1:**
- `useAcademyData.ts`
- `useModuleData.ts`
- `useMethodologicalAnalysis.ts`
- `useRealIndicatorData.ts`

**Bloco 2:**
- `useFinancialData.ts`
- `useAccountPlan.ts`
- `useHistoricalDemonstracoes.ts`
- `usePaginatedData.ts`

**Bloco 3:**
- `cashFlowService.ts`
- `governanceService.ts`
- `auditService.ts`
- `notificationService.ts`

### 4. Meta de Redução
As violações Boundary devem cair de **189** para a faixa de **165–170** (considerando que os Hooks e Services selecionados são importados de `src/components/` e representam um volume significativo de infrações diretas na contagem).
