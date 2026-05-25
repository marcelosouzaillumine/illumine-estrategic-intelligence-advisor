# Architectural Integrity Audit Report

Este documento apresenta a auditoria arquitetural da plataforma Illumine, cobrindo o mapeamento atual de camadas, o fluxo de dados oficial, e detalhando as violações detectadas pelos scripts de auditoria ativos (`architecture:audit`, `imports:audit`, `mocks:audit`, `docs:audit`).

## Mapa de Arquitetura Atual
A plataforma está estruturada sobre o paradigma **Runtime First**, onde todo cálculo e inferência ocorre de forma consolidada e isolada, sendo a UI um mero renderizador passivo ("Dummy Renderer"). As camadas identificadas:
- **Core Runtime Layer**: Motor isolado de inteligência matemática e causal. Inclui o `ConsolidatedFinancialOrchestrator`, `ExecutiveOrchestrationEngine`, e `SystemicStressPropagationEngine`.
- **Temporal Causality Engine**: Motor de análise longitudinal e diagnóstico causal.
- **Scenario Intelligence Layer**: Camada de simulação contrafactual clonando instâncias isoladas (sandbox).
- **Observability Layer**: Tracing determinístico, telemetria forense, tracking de confidence e lineage.
- **Governance Engine**: `RegressionDetectionEngine` protegendo a integridade do runtime e a passividade da UI via self-audit constante.
- **Presentation Layer (UI/Pages/Components)**: Estritamente focada em renderizar dados. Exemplos: `Systemic Heatmap UI`.

## Fontes Únicas de Verdade
- Contratos de Dados (`dataTypes.ts`, `advisoryTypes.ts`, `stress-types.ts`).
- `ExecutiveIntelligenceRuntime` / `ObservedConsolidatedRuntimeService`.

## Achados e Riscos Encontrados

Após execução das suítes de auditoria em modo *report-only*, os seguintes achados foram documentados e classificados:

### CRITICAL
1. **Runtime Bypass (Architecture Audit)**: 
   - `src/components/pages/ScenarioLabPage.tsx` está importando `ScenarioSimulationEngine` ou lógicas correlatas diretamente na UI.
   - **Plano de Correção**: Isolar via Hooks e consumir inteligência do Consolidated Runtime. Não instanciar o engine no front.

### HIGH
1. **Legacy Engines Parallels Actives (Architecture/Imports Audit)**:
   - Diversos arquivos e componentes importam `src/lib/scenario-simulation-engine.ts`, `src/lib/financial-engine.ts`, e `src/lib/executive-causality-engine.ts`. Foram detectadas **27 infrações de imports**, abrangendo o `ExecutiveScenarioLabPage` e adaptadores de runtime (`capital-structure-adapter`, etc.).
   - **Plano de Correção**: Migrar as chamadas remanescentes para a nova estrutura de `ConsolidatedOrchestrator` ou deprecá-las progressivamente se a feature não estiver finalizada.
2. **Productive Mocks na UI (Mocks Audit)**:
   - Foram encontrados mocks estruturados (`const mockX`) ativamente hardcoded em páginas produtivas como `InstitutionalReportsPage.tsx`, `RuntimePerformancePage.tsx` e `ScenarioLabPage.tsx`, bem como em arquivos `TenantRegistry.ts` e scripts de load.
   - A nomenclatura de arquivo `runMocksAudit.ts` disparou o seu próprio alarme por possuir "mock" no nome. (Tratativa de script).
   - **Plano de Correção**: Remover estáticos. Utilizar as instâncias de Firebase/API e os Loaders consolidados.

### MEDIUM
1. **Documentação Master Ausente (Docs Audit)**:
   - Faltam ou possuem nomes alternativos os arquivos: `MASTER_FINANCIAL_INTELLIGENCE_ENGINE.md` (o existente possui espaços no nome) e `CONSOLIDATED_RUNTIME_GOLDEN_DATASETS.md`.
   - **Plano de Correção**: Renomear `Master Financial Intelligence Engine.md` para respeitar o snake_case oficial `MASTER_FINANCIAL_INTELLIGENCE_ENGINE.md`. Criar os arquivos faltantes.

### LOW
1. **Documentação Órfã/Despadronizada (Docs Audit)**:
   - Mais de 30 documentos em `docs/` possuem prefixos obsoletos ou não são cobertos pelo controle atual (ex: `architecture.md`, `design.md`, e os arquivos `.md` antigos da engine financeira).
   - **Plano de Correção**: Fazer o arquivamento técnico (pasta `legacy_docs`) para manter a raiz dos `docs/` padronizada e imaculada com as documentações consolidadas.

## Recomendação de Release
**NÃO APROVADO**. A plataforma atualmente necessita de saneamento cirúrgico dos imports legados listados acima e substituição dos mocks ativados no front-end para conquistar o selo *Release Candidate Ready*.
