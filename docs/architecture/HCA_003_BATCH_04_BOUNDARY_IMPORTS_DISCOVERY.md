# HCA-003 Batch 4: Boundary Imports Cleanup Discovery

Este documento mapeia as violações de fronteira arquitetural onde componentes visuais (React) nas pastas `pages/`, `governance/` e `executive/` estão bypassando os ViewModels e importando dependências diretamente do `src/core/` ou `src/runtime/`. 

Isso fere o princípio de **Architecture Dumb Renderer** e acopla a UI à infraestrutura de domínio.

## 1. Topologia de Violações
Foram escaneados **222 componentes** e identificadas **57 violações** de importação direta cruzando as fronteiras proibidas.

### Violações por Domínio Fiduciário / Executivo
1. **Páginas de Setup / Onboarding:**
   - `AdvisorWorkspacePage.tsx` e `ClientExecutiveWorkspace.tsx` estão importando diretamente `OnboardingEngine`, `TenantLicensingEngine`, e `InstitutionalReportFormatter`.
2. **Páginas Temporais e de Twin:**
   - `GovernanceTimeMachinePage.tsx` importa `GovernanceTimeMachineRuntime`, `TimelineQueryEngine`, e `InstitutionalDriftEngine`.
   - `InstitutionalDigitalTwinPage.tsx` importa `InstitutionalDigitalTwinRuntime` e `TwinAssemblyEngine`.
3. **Páginas Financeiras (Math & Engines):**
   - `AnaliseFinanceiraPage.tsx` e `EFOSPage.tsx` estão importando `getComputedBPSummary`, `getComputedDreMetrics`, e `orchestrateExecutiveConsolidation`.
4. **Páginas de Identidade e Acesso:**
   - Dezenas de páginas importam diretamente o `DataAccessContext` e `useInstitutionalAuth` do `core/security/` em vez de consumirem propriedades mapeadas por um ViewModel.

---

## 2. Classificação de Risco

### 🔴 Risco: HIGH
*Componentes que importam Engines e Runtimes instanciando lógica de negócio pesada, violando a regra de Dumb Renderer de forma sistêmica.*
- Importação do `TimelineQueryEngine` no TimeMachine.
- Importação do `orchestrateExecutiveConsolidation` no EFOSPage.
- Importação de `BoardPackExportEngine` no Workspace.
*(Solução: Exige criação de ViewModels completos com Injeção de Runtimes via Hook Provider).*

### 🟡 Risco: MEDIUM
*Componentes importando Contextos e Adapters locais que contém lógica leve ou acoplamento a React Contextos internos do Core.*
- `DataAccessContext`, `useRuntimeContext`, `useInstitutionalAuth`.
*(Solução: Criar um hook de fachada padronizado ou passar a autenticação via props dos ViewModels principais).*

### 🟢 Risco: SAFE
*Componentes importando Constantes, Temas Visuais ou Serviços sem estado que podem ser facilmente re-roteados via adaptadores seguros.*
- `ExecutiveChartSemanticPalette` importado em `DFCPage.tsx` e `DLPAPage.tsx`.
- `InstitutionalNavigationService` importado em `ExecutiveQuickActions.tsx`.
- `sanitizeExecutivePayload` importado em `BoardExperienceShell.tsx`.

---

## 3. Proposta: Batch 4B (Max 3 Correções Seguras)

Para avançarmos limpando as fronteiras sem explodir a arquitetura atual (evitando Risco HIGH agora), proponho o isolamento dessas 3 dependências **SAFE/MEDIUM**, criando Barrels/Adapters limpos e roteando os componentes visuais para eles:

1. **Intervenção 1: Isolamento Temático (`ExecutiveChartSemanticPalette`)**
   - **Alvo:** `DFCPage.tsx` e `DLPAPage.tsx`
   - **Ação:** Criar um adaptador de tema em `src/viewmodels/adapters/ThemeAdapter.ts` que exporta a paleta, desconectando a UI do pacote `core/theme`.
2. **Intervenção 2: Isolamento de Navegação (`InstitutionalNavigationService`)**
   - **Alvo:** `ExecutiveQuickActions.tsx` e `GuidedInvestigationCard.tsx`
   - **Ação:** Emcapsular a chamada num hook `useNavigationAdapter()` dentro da camada ViewModels, cortando a importação do `core/navigation`.
3. **Intervenção 3: Isolamento de Sanitização (`sanitizeExecutivePayload`)**
   - **Alvo:** `BoardExperienceShell.tsx`
   - **Ação:** Transferir a chamada da função para dentro do respectivo ViewModel do BoardExperience, fazendo com que a UI receba os dados já limpos (via `computed`).
