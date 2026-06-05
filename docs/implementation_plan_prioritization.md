# Implementation Plan - Executive Decision Prioritization & Economic Value Framework (EDPEVF) v1.1

This revised plan incorporates the constitutional refinements (EDPEVF v1.1) to ensure long-term structural integrity and prevent operational leakage in governance reporting.

## Proposed Changes

We will introduce the new modules in the core runtime without altering any existing formulas or engine behaviors, strictly adhering to the "Regra 1" and "Regra 2" principles.

---

### Component: Executive Decision Prioritization Layer (EDPL)
Path: `src/core/runtime/executive-prioritization/`

#### [NEW] [FiduciaryPriorityEscalationEngine.ts](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/core/runtime/executive-prioritization/FiduciaryPriorityEscalationEngine.ts)
Defines a strict priority category hierarchy:
1. Sobrevivência (Survival)
2. Liquidez (Liquidity)
3. Solvência (Solvency)
4. Capital
5. Rentabilidade (Profitability)
6. Governança (Governance)
7. Crescimento (Growth)
8. Otimização (Optimization)

#### [NEW] [BoardDecisionGovernanceValidator.ts](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/core/runtime/executive-prioritization/BoardDecisionGovernanceValidator.ts)
Ensures clear division between Board and Directory domains.
- **Board Domains**: Capital, Estratégia, Governança, Risco.
- **Directory Domains**: Receita, Custos, Caixa, Processos, Operação.
Prevents any operational/directory actions from leaking into the Board decisions.

#### [NEW] [BoardAttentionDemandIndexEngine.ts](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/core/runtime/executive-prioritization/BoardAttentionDemandIndexEngine.ts)
Calculates the **Board Attention Demand Index (BADI)** (0–100) where higher scores indicate greater attention demand (not better performance) for:
- Liquidez
- Rentabilidade
- Capital
- Governança
- Compliance

#### [NEW] [ExecutivePriorityRankingEngine.ts](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/core/runtime/executive-prioritization/ExecutivePriorityRankingEngine.ts)
Evaluates and ranks all candidates for recommendations, calculating:
- **Impact Score** (0–100) -> Mapped to: *Muito Alto*, *Alto*, *Moderado*, *Baixo*
- **Urgency Score** (0–100) -> Mapped to: *Imediata*, *Curto Prazo*, *Médio Prazo*, *Longo Prazo*
- **Effort Score** (0–100)
- **EPS**: $EPS = (Impact \times 0.50) + (Urgency \times 0.35) + ((100 - Effort) \times 0.15)$
- Classifications:
  - $\ge 90$: Prioridade Crítica
  - $75\text{--}89$: Prioridade Alta
  - $50\text{--}74$: Prioridade Moderada
  - $< 50$: Prioridade Secundária

Applies the Category Hierarchy first as a **Constitutional Override Layer**, then EPS.
Includes **Decision Traceability**:
- **Origin**: DRE, DFC, DLPA, BP, Cross-Statement.
- **Evidence**: Specific metrics proving the recommendation (e.g. `["Runway = 2.2 meses", "Liquidez Imediata = 0.17x"]`).

#### [NEW] [BoardTop3DecisionEngine.ts](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/core/runtime/executive-prioritization/BoardTop3DecisionEngine.ts)
Produces structured Top 3 Decisions for the Board (validated by `BoardDecisionGovernanceValidator.ts`):
- Problema
- Impacto esperado (Muito Alto / Alto / Moderado / Baixo)
- Prazo recomendado (Imediata / Curto Prazo / Médio Prazo / Longo Prazo)
- Consequência da inação
- Traceability (Origin and Evidence)

#### [NEW] [ExecutiveActionPlanEngine.ts](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/core/runtime/executive-prioritization/ExecutiveActionPlanEngine.ts)
Produces Top 5 concrete, actionable items for the Executive Directory:
- Ação
- Responsável (e.g., CFO, CEO, Diretor Comercial, Financeiro)
- Prazo (e.g., Imediato, 15 dias, 30 dias)
- Impacto esperado
- Traceability (Origin and Evidence)

#### [NEW] [InstitutionalPriorityMatrixEngine.ts](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/core/runtime/executive-prioritization/InstitutionalPriorityMatrixEngine.ts)
Generates the expanded Priority Matrix:
- Liquidez
- Rentabilidade
- Capital
- Governança
- Crescimento
- Operações

---

### Component: Economic Value Layer (EVL)
Path: `src/core/runtime/economic-value/`

#### [NEW] [ExecutiveMaturityLayer.ts](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/core/runtime/economic-value/ExecutiveMaturityLayer.ts)
Classifies the company stage transversal layer:
- **Emergente** (1 year or low revenue)
- **Estruturando** (2 years)
- **Consolidando** (3 years or transition)
- **Escalando** (accelerated growth/traction)
- **Maturidade Institucional** (mature operation)

If the maturity is Emergente/Estruturando, severity thresholds are softened dynamically across other engines to avoid overly severe interpretations.

#### [NEW] [EconomicReturnEngine.ts](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/core/runtime/economic-value/EconomicReturnEngine.ts)
Unified framework answering: **"O retorno produzido pela operação justifica o capital empregado?"**
Computes:
- **Economic Return Classification**: Criação Consistente de Valor, Criação Moderada de Valor, Retorno Insuficiente, Destruição de Valor, Destruição Acelerada de Valor.
- **Economic Return Confidence**: HIGH (3+ years), MEDIUM (2 years), LOW (1 year).

#### [NEW] [EconomicValueCreationEngine.ts](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/core/runtime/economic-value/EconomicValueCreationEngine.ts)
Produces the narrative explaining value creation/destruction based on the output of `EconomicReturnEngine` and maturity stage.

#### [NEW] [InstitutionalExecutiveThesisEngine.ts](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/core/runtime/economic-value/InstitutionalExecutiveThesisEngine.ts)
Produces a single consolidated executive narrative:
- Contexto
- Tensão Principal
- Risco Dominante
- Oportunidade Dominante
- Direção Recomendada
- **Constraint**: Max 700 characters.

---

### Component: Board Layer Support Engines

#### [MODIFY] [DREBoardDecisionSupportEngine.ts](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/core/runtime/dre/DREBoardDecisionSupportEngine.ts)
Add:
- **P8**: Estamos criando valor econômico?
- **P9**: Qual iniciativa possui maior potencial de retorno?

#### [MODIFY] [CashBoardDecisionSupportEngine.ts](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/core/runtime/cash-intelligence/CashBoardDecisionSupportEngine.ts)
Add:
- **P8** (as `acaoMelhoraLiquidez`): Qual ação melhora mais rapidamente a liquidez?

#### [MODIFY] [DLPABoardDecisionSupportEngine.ts](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/core/runtime/governance/dlpa/DLPABoardDecisionSupportEngine.ts)
Add:
- **P8**: Qual ação acelera a recomposição patrimonial?

---

### Component: Board Pack Orchestration & UI

#### [MODIFY] [institutional-reporting-types.ts](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/core/runtime/institutional-reporting/institutional-reporting-types.ts)
Add types/interfaces for BADI, temporal return confidence, traceability, page zero (strategic snapshot), and executive thesis.

#### [MODIFY] [InstitutionalBoardPackRuntime.ts](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/core/runtime/institutional-reporting/InstitutionalBoardPackRuntime.ts)
Integrate all new engines to compile the new section metrics in the board pack.

#### [MODIFY] [SovereignBoardPackPage.tsx](file:///Users/marcelosouza/Documents/illumine-strategic-intelligence-advisor/src/components/pages/governance/SovereignBoardPackPage.tsx)
Build a visually stunning set of premium widgets inside `SovereignBoardPackPage.tsx`.
- **Página Zero: Executive Strategic Snapshot**:
  Rendered at the very top of the normal flow, answering:
  1. Estamos sobrevivendo?
  2. Estamos criando valor? (with Return Confidence)
  3. O capital está preservado?
  4. Qual é o maior risco?
  5. Qual é a decisão mais importante?
- **Bloco 1**: Top 3 Decisões do Conselho & Top 5 Ações da Diretoria (segmented clearly).
- **Bloco 2**: Criação de Valor Econômico (incorporating the 4 questions and the Economic Return classification).
- **Bloco 3**: Matriz de Prioridades & Board Attention Demand Index (BADI) (with animated bar visualizers).

---

## Verification Plan

### Automated Tests
- Run `npm run typecheck` to verify codebase typing.
- Run `npm run test` or Specific board pack checks.

### Manual Verification
- Test using the `Granatum 2022` mock dataset.
- Assert that:
  - BADI displays Liquidez demanding the highest attention demand (~92%).
  - Top 3 Decisions are strictly within Strategy, Capital, Risk, Governance.
  - Top 5 actions are strictly within Revenue, Costs, Cash, Operations.
  - Page Zero answers the 5 strategic questions deterministically.
