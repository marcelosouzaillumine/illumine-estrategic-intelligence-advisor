# CONSOLIDATED STRESS PROPAGATION ENGINE (FASE 4)
## Architectural Blueprint & Systemic Causal Mechanics

**OBJETIVO DA ENGINE:**
Implementar a propagação causal de estresse financeiro e operacional entre entidades conectadas do ecossistema corporativo. Esta engine transforma um grupo de entidades isoladas em uma verdadeira topologia de risco, mapeando como a falência, asfixia de caixa ou default de uma entidade impacta sistemicamente as demais, sem recorrer à Inteligência Artificial probabilística (garantindo explicabilidade matemática e rastreabilidade total).

---

## 1. RESTRIÇÕES EPISTEMOLÓGICAS (GOVERNANÇA)
Para manter a plataforma estritamente analítica e auditável, as seguintes vedações estão ativas:
*   **PROIBIDO** inferência de contágio via IA subjetiva.
*   **PROIBIDO** propagação de risco sem um *Dependency Edge* (elo contábil ou operacional comprovado).
*   **PROIBIDO** modelagem macroeconômica probabilística nesta camada.
*   **PROIBIDO** inferência de reputação textual ou *social sentiment*.

---

## 2. EVENTOS DE ESTRESSE SUPORTADOS
A engine monitora as seguintes anomalias na origem (`sourceEntity`) para engatilhar o contágio:
1.  **Ruptura de Caixa**: Runway negativo ou saldo insuficiente.
2.  **Fluxo Operacional Negativo**: Queima contínua de margem (Destructive Growth).
3.  **Default Financeiro**: Incapacidade de cobrir passivos de curtíssimo prazo.
4.  **Dependência de Funding**: Subsídio contínuo via mútuos.
5.  **Shared Liabilities / Cross Guarantees**: Dívidas onde múltiplas entidades são garantidoras/avalistas.
6.  **Dependência Operacional**: Uma filial como compradora/fornecedora exclusiva de outra.

---

## 3. MECÂNICA CAUSAL E GRAFO DE RISCO (`CrossEntityRiskGraph`)
Toda propagação gera uma aresta (`ContagionEdge`) contendo o modelo causal do contágio:
*   **`sourceEntity`**: A entidade onde o estresse nasceu.
*   **`targetEntity`**: A entidade exposta ao contágio.
*   **`propagationType`**: Categoria do contágio (FINANCIAL, OPERATIONAL, LIQUIDITY, REPUTATIONAL_FLAG, SUPPLY_CHAIN, CAPITAL_ALLOCATION).
*   **`causalReason`**: A justificativa estritamente baseada em dados reais (ex: "Target detém 5MM em mútuos não pagáveis emitidos por Source").
*   **`confidence`**: Certeza do contágio.
*   **`propagationWeight`**: O impacto do estresse (0.0 a 1.0).
*   **`affectedMetrics`**: Quais chaves de balanço da Target sofrerão estresse (ex: Liquidez Corrente, Runway).
*   **`lineage`**: A trilha de dependência sistêmica.

---

## 4. CONFIDENCE E VIOLATIONS
O nível de confiança atua como selo de validade do contágio:
*   `DIRECT_EXPOSURE`: Estresse transmitido via dependência primária visível nos balanços cruzados.
*   `INDIRECT_EXPOSURE`: Cascata (A quebra B, B asfixia C).
*   `LOW_CONFIDENCE_PROPAGATION`: *Warning* obrigatório. Suspeita de contágio devido à natureza do grupo, mas *mismatches* temporais atrapalham a precisão.
*   `UNVERIFIED_DEPENDENCY`: *Violation*. Risco sistêmico inferido sem evidência de ligação estrutural; o contágio é bloqueado.

---

## 5. INTEGRAÇÃO COM O CONSOLIDATED RUNTIME
O fluxo de consolidação estendida segue a ordem:
1.  `EntityRuntimeExecutor`: Execução individual.
2.  `IntercompanyEliminationEngine` (FASE 3): Expurga dupla contagem de resultados e mútuos.
3.  **`ConsolidatedStressPropagationEngine` (FASE 4)**: Consome a topologia depurada e propaga os choques de caixa/operacionais de subsidiárias debilitadas para as controladoras/vizinhas.
4.  `ConsolidatedOutputAssembler`: Unifica e emite a foto consolidada de risco.

---

## 6. OUTPUT DA FASE 4
A `ConsolidatedRuntimeOutputExt` ganhará o novo bloco `SystemicRiskProfile`:
*   `systemicStressMap`: O grafo direcional das contaminações.
*   `propagatedRisks`: Lista de choques transferidos entre CNPJs.
*   `contagionLineage`: O registro de quem infectou quem e como.
*   `systemicConfidence`: A calibragem de precisão de todo o mapa sistêmico.
*   `stressPropagationWarnings`: Alertas (ex: "Ruptura iminente na Holding devido ao socorro contínuo da Sub-A").
*   `affectedEntities`: Índice rápido dos CNPJs expostos ao contágio.
*   `criticalDependencyChains`: Trilhas onde a quebra de um nó isolado afunda três ou mais CNPJs conectados.

---

## 7. CONCLUSÃO
A Fase 4 dota o *Consolidated Runtime* da habilidade de entender uma empresa como um sistema vivo. Em vez de simplesmente somar os balanços, a plataforma agora percebe quando um membro da topologia está extraindo energia vital (caixa, margem) de seus pares, gerando alertas analíticos incontestáveis antes mesmo de a ruína se materializar no passivo consolidado.
