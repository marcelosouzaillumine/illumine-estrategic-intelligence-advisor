# HCA-002 Wave 00 — Governance Discovery

**Date**: July 7, 2026
**Objective**: Mapear o débito técnico residual do módulo de Governança para embasar a priorização dos lotes da iniciativa HCA-002 (Canonicalization & Runtime Purification).

## 1. Escopo e Métricas
Foram analisados todos os arquivos `.tsx` contidos em `src/components/pages/governance/`.

- **Total de Arquivos Analisados**: 47
- **Total de Arquivos Certificados (Dumb Renderers com ViewModel)**: 2
- **Total de Arquivos Pendentes**: 45

### 1.1. Arquivos Certificados (Golden Standard)
Estes arquivos já atuam via ViewModels rígidos, sem imports diretos proibidos e sem hooks reativos (`useState`, `useEffect`).
- `InstitutionalBenchmarkingPage.tsx`
- `InstitutionalMonitoringPage.tsx`

### 1.2. Arquivos Parcialmente Migrados
- *Nenhum arquivo encontrado neste estado.* Todos os arquivos que possuem drift/imports ainda operam sem o uso de ViewModels padronizados.

### 1.3. Arquivos Pendentes (Top 10 Ofensores por Reatividade)
Arquivos operando sem ViewModel e com uso intensivo de Reactivity local ou vazamento de imports diretos de Runtime (`FiduciaryRuntimeAdapter`, `useInstitutionalRuntime`).

1. `LeadershipDNACenter.tsx` (22 hooks)
2. `BoardMeetingMode.tsx` (17 hooks, 2 direct imports)
3. `ESGIMAssessmentPage.tsx` (16 hooks, 1 direct import)
4. `ObservabilityConsolePage.tsx` (16 hooks, 4 direct imports)
5. `GovernanceExecutionPanel.tsx` (15 hooks, 1 direct import)
6. `GovernanceMaturityCenter.tsx` (14 hooks)
7. `CreditCommitteeCenter.tsx` (11 hooks, 1 direct import)
8. `DecisionLifecycleCenter.tsx` (8 hooks, 1 direct import)
9. `SovereignBoardPackPage.tsx` (8 hooks, 1 direct import)
10. `SovereignDecisionCenter.tsx` (7 hooks, 1 direct import)

### 1.4. Arquivos Alvo (Mencionados na Abertura)
- `CapitalGovernanceCenter.tsx` (6 hooks, 1 direct import `useInstitutionalRuntime`)
- `CreditCommitteeCenter.tsx` (11 hooks, 1 direct import `useInstitutionalRuntime`)
- `GovernanceRiskHeatmap.tsx` (4 hooks, 2 direct imports `FiduciaryRuntimeAdapter`)
- `ComplianceIntegrityCenter.tsx` (2 hooks, 0 direct imports vazados)

## 2. Análise e Proposta do Batch 1

Dado que `CapitalGovernanceCenter` e `CreditCommitteeCenter` já possuem certa complexidade (6 e 11 hooks respectivamente, consumindo `useInstitutionalRuntime`), recomenda-se focar o **Batch 1** em painéis de risco e compliance que tenham uma relação de dependência mais simples e que já representam componentes centrais do painel de Governança corporativa, atuando como laboratório para a estabilização do padrão de ViewModels independentes.

**Escopo Proposto para HCA-002 Batch 1 (Max 3 arquivos):**

1. **`ComplianceIntegrityCenter.tsx`**
   - **Status atual**: 2 hooks, 0 imports diretos externos.
   - **Justificativa**: Componente limpo de integrações sujas, ideal para criar a fundação estrutural do `useComplianceIntegrityViewModel`.

2. **`GovernanceRiskHeatmap.tsx`**
   - **Status atual**: 4 hooks, 2 imports diretos (`FiduciaryRuntimeAdapter`).
   - **Justificativa**: Risco de acoplamento identificado. O componente visual deve apenas consumir a matriz pré-calculada, e não contatar o `FiduciaryRuntimeAdapter` localmente. Criaremos o `useGovernanceRiskHeatmapViewModel`.

3. **`CrisisResponseCenter.tsx`**
   - **Status atual**: 2 hooks, 0 imports vazados.
   - **Justificativa**: Outro painel focado, complementar à matriz de Risco. Criaremos o `useCrisisResponseViewModel`.

Ao isolar estes 3 painéis de risco e compliance em ViewModels puros sob as regras da Diretriz 1 e 2, garantimos um ciclo de entrega seguro e estabelecemos a governança dos próximos batches (que incluirão os ofensores pesados).
