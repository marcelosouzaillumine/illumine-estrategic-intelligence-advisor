# Executive Explainability Audit

## Fases de Integração Mapeadas (Fase 5, 6, 7)
Nenhuma engine foi funcionalmente alterada nesta Sprint, preservando os cálculos. O mapa abaixo descreve o plano arquitetural de acoplamento do `ExplainabilityBuilder`.

### 1. Constitutional Explainability (Fase 5)
- **Target:** `src/core/runtime/constitutional-governance/ExecutiveConstitutionalRuntime.ts`
- **Explainability Nodes Esperados:** `CONSTITUTIONAL_AXIOM` (impactDirection: `BLOCKING`).
- **Motivo:** Todo bloqueio executivo constitucional deverá explicar explicitamente qual axioma (regras de board) foi ferido e por quê, utilizando as evidências mapeadas.

### 2. Scenario Explainability (Fase 6)
- **Target:** `src/core/runtime/scenario/ScenarioRuntime.ts`
- **Explainability Nodes Esperados:** `PRIMARY_DRIVER`, `AGGRAVATING_FACTOR`.
- **Motivo:** Ao rodar um cenário de stress que derruba o valuation em 15%, a engine precisará listar os choques exatos (ex: *Selic subiu 200bps*) que produziram o resultado, tirando a "caixa preta" do teste de stress.

### 3. Board Explainability (Fase 7)
- **Target:** `src/core/governance/board-decision/BoardDecisionEngine.ts`
- **Explainability Nodes Esperados:** Múltiplos `PRIMARY_DRIVER` e `MITIGATING_FACTOR`.
- **Motivo:** O conselho só aprova decisões auditáveis. A recomendação deverá explicar quais motores (ex: *Capital Preservation Engine*, *ESGIM*) compuseram a tese de aprovação ou rejeição.

## Status Global
- Classificação de Risco de Integração: **COMPLIANT** (A modelagem em cadeia permite injeção sem alterar o código de cálculo core).
