# HCA-003 Systemic Architecture Discovery

Este documento reflete o mapeamento estático da base para a **HCA-003**, identificando anomalias estruturais, duplicações sistêmicas e dívida técnica transversal.

## 1. Mapeamento de ViewModels
Foram identificados 13 ViewModels. 

**Duplicações Clandestinas Identificadas (Risco: LOW / SAFE):**
- `src/viewmodels/memory/InstitutionalMemoryViewModel.ts` vs `src/viewmodels/governance/useInstitutionalMemoryViewModel.ts`
*(Recomendação: Consolidar em uma única fonte de verdade)*

## 2. Mapeamento da Camada de Serviços (src/services)
Foram identificados 31 arquivos `flat` na raiz de serviços.

**Serviços Concorrentes (IA & Governança) (Risco: MEDIUM):**
- `aiService.ts`
- `governanceAiService.ts`
- `advisoryAiService.ts`
- `aiBoardReportService.ts`
*(Recomendação: Classificar domínios e mover para `src/services/intelligence/` com taxonomia padronizada).*

**Adapters sem Taxonomia Canônica (Risco: LOW / SAFE):**
- `BoardRuntimeAdapter.ts`
- `CopilotRuntimeAdapter.ts`
- `ExecutionGovernanceAdapter.ts`
- `ExecutiveRuntimeAdapter.ts`
- `FiduciaryRuntimeAdapter.ts`
*(Recomendação: Consolidar ou renomear para refletir o padrão Application/Intelligence Service).*

## 3. Mapeamento de Runtime Engines
Existem mais de 600 motores (engines) na pasta `src/core/runtime/`. O alto volume indica segmentação extrema e potencial duplicação de responsabilidades (cálculo de DFC, DRE e Patrimônio repetidos).

**Áreas Críticas de Sobreposição (Risco: HIGH):**
- Inúmeras engines de `executive-consolidation` e `causal-intelligence` que recalcularão métricas se não forem orquestradas por um Dispatcher único.
- `InstitutionalDecisionEngine` vs `ExecutiveDecisionEngine`.

## 4. DTOs e Types Duplicados
Foram mapeados arquivos de tipagem que não seguem uma centralização lógica. DTOs frequentemente estão espalhados pelas Views em vez de estarem no Core ou nas pastas de Domínio. (Risco: MEDIUM)

## 5. Boundary Imports (Core → Pages)
Foram detectados 3 arquivos no Core importando lógicas ou tipagens diretamente das `components/pages/`. Isso viola a arquitetura de cebola (inversão de dependência), onde o Core deve desconhecer a View. (Risco: HIGH)

---

## Proposta: Batch 1 (Mudanças Seguras)

**Risco:** SAFE
O Batch 1 deve focar exclusivamente nas áreas onde não há risco matemático ou fiduciário (sem alteração de engines do Runtime).

**Escopo Proposto:**
1. **ViewModel Consolidation:** Excluir `InstitutionalMemoryViewModel.ts` obsoleto e manter a versão `useInstitutionalMemoryViewModel.ts` (ajustando os imports).
2. **Services Taxonomy - Fase 1:** Criar a pasta `src/services/intelligence/` e organizar os serviços de IA (ex: `aiBoardReportService.ts`, `advisoryAiService.ts`, etc), analisando seus conteúdos para renomeá-los canonicamente (ex: `AdvisoryIntelligenceService.ts`).

