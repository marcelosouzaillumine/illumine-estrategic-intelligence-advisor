# MASTER REALITY VALIDATION ENGINE (Phase 23)

Este documento descreve a infraestrutura de **Reality Validation, Premium UX & Operational Scale Readiness** (Fase 23).

## Princípio Fundamental: Realidade Simulada, Riscos Reais

A Fase 23 valida a Illumine contra a realidade de clientes enterprise antes de o primeiro cliente pagar.
Para isso, utilizamos **Golden Datasets** — réplicas estruturais realistas de grupos econômicos — isolados em sandbox in-memory, sem qualquer ligação com o Runtime produtivo.

## Os 3 Golden Datasets

### 1. Grupo Meridional Industrial (Industrial Holding Complex)
Um grupo com holding, indústria/exportadora, distribuidora, imobiliária e shared services.
- **Stressors Chave:** Covenant DÍVIDA/EBITDA > 4.2x, hedge cambial com gap de 90 dias, CAPEX emergencial não planejado.
- **Early Warning Ativado:** Liquidez em zona crítica.
- **Orchestration:** Playbook de Contenção CAPEX recomendado.

### 2. Rede Saúde Integrada (Healthcare / Hospital Network)
Hospital principal, SADT, e centro cirúrgico com descasamento de prazo e glosas em 14.2% da receita.
- **Stressors Chave:** Passivo tributário em REFIS, repasse médico a 61% da folha operacional.
- **IOS Pulse:** Deterioração sistêmica detectada no Institutional Pulse.

### 3. Network Advisor Premium (Advisor Multi-Tenant Network)
Um advisor com 4 clientes simultâneos em crises paralelas.
- **Stressor Chave:** 22 tenant switches por sessão, com 3 de 4 clientes em estado crítico.
- **Validação:** Cross-tenant isolation atestado em cada switch.

## As 3 Trilhas de Validação

### Trilha 1: Reality Validation Infrastructure (`src/core/runtime/reality-validation/`)
Fornece o motor de carregamento e isolamento dos Golden Datasets. O `GoldenDatasetIsolationEngine` impede que qualquer dataset atravesse a barreira de tenant ou contamine a produção.

### Trilha 2: Premium Executive UX Refinement (`src/core/runtime/premium-ux/`)
Avalia a clareza cognitiva executiva. O `ExecutiveAttentionMapper` prioriza seções como *Early Warning Alerts* (peso 0.95) sobre *Knowledge Graph Links* (peso 0.30), orientando a interface ao que o CFO realmente precisa decidir.

### Trilha 3: Operational Scale Readiness (`src/core/runtime/operational-scale/`)
Valida estabilidade sob carga. Com o cenário Advisor (4 tenants simultâneos, 22 switches), o `CrossTenantStressValidator` atesta isolamento absoluto e a `InstitutionalSessionStabilityEngine` garante ausência de memory leak.

## Active Governance

O script `runRealityValidationGovernanceAudit.ts` acrescenta uma validação exclusiva da Fase 23:
- Bloqueia padrões de UX que **ocultam risco** (`hideRisk`, `suppressAlert`, `hideViolation`).
- Verifica obrigatoriamente a presença do `GoldenDatasetRegistry` (3 datasets) e do `GoldenDatasetIsolationEngine`.
- Impede armazenamento local de datasets (`localStorage.setItem`, `saveToProduction`).
