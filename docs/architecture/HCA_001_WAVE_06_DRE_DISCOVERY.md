# HCA-001 Wave 06D — DREPage Discovery

## 1. Escopo e Propósito
Este documento detalha o discovery e a análise de drift da `DREPage.tsx` preparatório para sua extração para o modelo *Golden Standard* (Dumb Renderer + ApplicationService + ViewModel) adotado no Executive Capability.

- **Alvo:** `src/components/pages/DREPage.tsx`
- **Métrica de Avaliação:** Drift Score (Estados, Efeitos e Imports diretos de Runtime/Engine/Services).

## 2. Métricas de Drift Extraídas

O rastreamento da estrutura atual da página de DRE apontou a concentração de responsabilidade de orquestração na UI:

| Métrica | Contagem | Peso | Drift Parcial |
|---------|----------|------|---------------|
| `useState` | 10 | 2 | 20 |
| `useEffect` | 5 | 5 | 25 |
| `useMemo` | 2 | - | 0 |
| `useCallback` | 0 | - | 0 |
| **Engine Imports** | 1 | 5 | 5 |
| **Service Imports** | 3 | 3 | 9 |
| **TOTAL DRIFT SCORE** | - | - | **59** |

### Status do Componente
- **É um Dumb Renderer?** `Não` (Score > 0)
- **Complexidade de Acoplamento:** Moderada/Alta (Score = 59). O componente não atinge o score de 70+ comum no BP e Balance Sheet, mas ainda fere a regra de segregação arquitetônica do Institutional Reporting.

## 3. Principais Desvios Arquitetônicos

### 3.1. Estado Local Indevido (`useState`)
A página concentra os seguintes estados:
- Filtros (`filterYear`, `viewMode`)
- Controle de IU/Modais (`showImportModal`, `showManualModal`, `toast`, `deleting`, `showDeleteConfirm`, `technicalTableOpen`)
- Densidade Executiva (`densityLevel`)

### 3.2. Efeitos Colaterais (`useEffect`)
A orquestração do ciclo de vida está dispersa em `useEffect`s:
- Reset de `densityLevel` quando o `userRole`/`profile` muda.
- Sincronização de `filterYear` a partir das props da rota.

### 3.3. Imports Fiduciários/Core
A `DREPage.tsx` possui ligação forte com:
- `DreExecutiveViewModelBuilder` (Lógica de montagem)
- `DreContractGuard` (Verificação estrita fiduciária)
- `useInstitutionalAuth` (Contexto de Board/Executive)

## 4. Estratégia de Remediação (Wave 06D)

A extração seguirá o rigor metodológico da `DFCPage` e da `DLPAPage`.
Para que o `npm run build && npm run test` preserve as validações fiduciárias, criaremos:

1. **`src/components/pages/dre/useDREPageViewModel.ts`**
   - Agrupará os estados `filterYear`, `viewMode`, modais, `densityLevel`.
   - Injetará a configuração de densidade executiva via `InstitutionalAuthProvider`.
   - Gerenciará o loading e ações de exclusão.
2. **`src/components/pages/dre/DREApplicationService.ts`**
   - Coletará dados contábeis.
   - Chamará `DreContractGuard` e `DreExecutiveViewModelBuilder`.
   - Abstrairá todo contato com Firebase (exclusão).
3. **`src/components/pages/DREPage.tsx` (Dumb Renderer)**
   - Extrairá propriedades expostas pelo `useDREPageViewModel`.
   - Renderizará componentes visuais puros, delegando lógica de interação para os `actions` do ViewModel.

## 5. Próximo Passo
- **Desenvolvimento:** Implementar e verificar a reestruturação arquitetônica descrita no item 4 sem alteração visual nem falha nos gates de Fiduciary Integrity (testes).
