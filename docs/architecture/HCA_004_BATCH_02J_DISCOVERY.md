# HCA-004 Batch 2J: UI Boundary Reduction Discovery

## 1. Contexto e Diretriz
Em linha com a diretriz executiva, este Batch 2J atua exclusivamente no mapeamento de componentes da camada de View que ainda invocam diretamente as bibliotecas do Firebase (`firebase/firestore`, `firebase/auth`).
O objetivo deste Discovery é fornecer uma radiografia para "fechar a conta" da barreira das 200 violações sem adentrar, por ora, em refatorações complexas de Services ou ViewModels.

- **Threshold Atual:** 217 violações (Legacy: 297).
- **Proposta deste Documento:** Mapear e classificar os componentes da UI, isolando 3 alvos cirúrgicos e seguros.
- **Status:** **Discovery Mode** (Nenhum código foi alterado).

## 2. Radiografia Restante da Camada UI
Uma nova varredura de arquitetura apontou os últimos ofensores visuais de alto volume de imports diretos:

| Componente UI | Violações | Complexidade / Severidade | Justificativa |
|---|---|---|---|
| `AssetManagementPage.tsx` | 3 | **SAFE** | Apenas hooks `onSnapshot` básicos e queries de lista. Isolamento trivial. |
| `AvaliacaoOrganogramaPage.tsx` | 3 | **SAFE** | CRUD simples de nós hierárquicos, baixo impacto analítico. |
| `CashFlowPage.tsx` | 3 | **SAFE** | Leitura de lançamentos financeiros, padrão semelhante às outras páginas financeiras. |
| `AxisDashboardPage.tsx` | 3 | **MEDIUM** | Múltiplos hooks, consumo de Runtimes institucionais e queries compostas. Requer mais cuidado. |
| `ConsolidatedGroupAdminPage.tsx`| 3 | **MEDIUM** | Dashboard administrativo com múltiplos nós. |
| `CleanupTool.tsx` | 3 | **MEDIUM** | Ferramenta de dev/admin, queries destrutivas. |
| `DashboardPage.tsx` | 3 | **HIGH** | Dashboard central; altíssima volumetria de queries e sub-componentes. |

## 3. Sugestão de Intervenção (Top 3 Alvos)
Para garantir que a curva de risco permaneça baixa e alcancemos uma redução consistente de ~9 a 10 violações, sugerimos intervir nos 3 componentes classificados como **SAFE**:

1. **`AssetManagementPage.tsx`**
   - *Escopo:* Migrar o listener `onSnapshot` e operações para um novo `useAssetManagementPageAdapter`.
2. **`AvaliacaoOrganogramaPage.tsx`**
   - *Escopo:* Encapsular a leitura da estrutura hierárquica e submissões (`setDoc`, `onSnapshot`) num novo `useAvaliacaoOrganogramaPageAdapter`.
3. **`CashFlowPage.tsx`**
   - *Escopo:* Migrar a lógica de agregação e listagem de fluxos (`query`, `where`) para um novo `useCashFlowPageAdapter`.

**Impacto Projetado do Lote 2J:** 217 → ~208 violações.

## 4. Avaliação Rumo ao HCA-005
Ao executar este lote, a UI estará quase perfeitamente higienizada de acessos diretos. O próximo passo estrutural será desviar a atenção das Views (`.tsx`) e passar a inspecionar os Services e Runtimes (escopo planejado para o **HCA-005: Application Services Canonicalization**).

---
*Aguardando aprovação explícita para iniciar a execução e criação dos adapters do Batch 2J.*
