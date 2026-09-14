# CONSOLIDATED FINANCIAL RUNTIME (MULTI-ENTITY)
## Architectural Plan & Framework Definition

**OBJETIVO DA ENGINE:**
Integrar a *Entity Topology Layer* ao *Runtime Institucional*, permitindo a execução causal multi-entidade consolidada de grupos corporativos complexos, garantindo eliminações *intercompany*, propagação de estresse e rastreabilidade total, sem quebrar a compatibilidade *single-entity* atual.

---

## 1. COMPONENTES ARQUITETURAIS (CORE)

### 1.1. ConsolidatedRuntimeOrchestrator
O maestro da execução.
*   **Responsabilidade**: Identificar a presença de uma *Entity Topology* (múltiplos CNPJs/Entidades conectadas).
*   **Comportamento**: Se o payload contém múltiplas entidades, ele orquestra a chamada unitária ao `ExecutiveGovernanceRuntime` para cada uma delas e, em seguida, dispara a esteira de consolidação. Se o payload tiver apenas uma entidade, opera em modo *pass-through* mantendo a integridade atual.

### 1.2. ConsolidatedRuntimeContext
O estado global (memória) da execução multi-entidade.
*   **Responsabilidade**: Armazenar o grafo de relacionamentos corporativos (Holdings, Controladas, SPEs, Filiais) e o estado parcial das resoluções durante o processamento (ex: guardar quem deve para quem antes de aplicar a eliminação).

### 1.3. ConsolidatedRuntimeOutput
O contrato de saída expandido.
*   **Responsabilidade**: Estender o atual `ExecutiveGovernanceReport` para suportar as complexidades de grupo, incluindo `consolidationPath`, rastreio por entidade e métricas já expurgadas de dupla contagem.

### 1.4. MultiEntityFinancialAdapter
A camada de inteligência contábil de consolidação.
*   **Responsabilidade**: Mapear operações de mútuo, contas a receber intragrupo e despesas/receitas intercompany.
*   **Ação**: Executar a *Eliminação Intercompany* gerando o Balanço Patrimonial e DRE consolidados limpos, servindo como base para os cálculos de scores do grupo.

### 1.5. Adapters Complementares
*   **ConsolidatedStressAdapter**: Calcula como a asfixia de caixa de uma filial reverbera na Holding ou como um default compromete fianças cruzadas.
*   **ConsolidatedMemoryAdapter**: Avalia séries históricas consolidadas considerando aquisições/fusões passadas (evitando classificar como "crescimento orgânico" a simples entrada de um novo CNPJ na consolidação).
*   **ConsolidatedDecisionAdapter**: Separa as recomendações (Advisory) determinando o escopo correto: injetar capital (Sistêmico) vs renegociar fornecedor (Entidade).

### 1.6 Resolvers & Propagators
*   **EntityScopedConfidenceResolver**: Motor de calibração de confiança analítica do grupo.
*   **ConsolidatedViolationPropagator**: Analisa se o *default* de uma filial aciona cláusulas de vencimento antecipado do grupo (*Cross-Default*).
*   **CrossEntityLineageResolver**: Mantém o DNA de todo cálculo consolidado (a linhagem da formação dos números).

---

## 2. DEFINIÇÕES ESTRATÉGICAS

### 2.1. Fluxo de Execução Consolidado
1.  **Processamento Individual**: O runtime legado roda unitariamente para Entidade A, Entidade B, Entidade C.
2.  **Propagação Inicial**: Tensões locais (ex: B não tem caixa) são mapeadas.
3.  **Eliminação Intercompany**: O `MultiEntityFinancialAdapter` zera operações cruzadas (A vendendo para B; B devendo para A).
4.  **Consolidação Final**: Métricas e Causalidades do Grupo são geradas a partir da "Topologia Limpa".
5.  **Runtime Consolidado Final**: Emissão do `ConsolidatedRuntimeOutput` agrupando visões unitárias com a visão consolidada.

### 2.2. Confidence Propagation
*   **Confidence Individual**: Nível de confiança atrelado aos dados fornecidos por uma única entidade.
*   **Confidence Consolidada**: A média ponderada pelo peso do faturamento ou ativo total de cada entidade.
*   **Degradação Automática**: Se uma entidade "core" (com grande peso) estiver em modo *Limited View*, a confiança global decai exponencialmente.
*   **Confidence Mínima Herdada**: O grupo nunca poderá receber *High Confidence* se > 30% da sua estrutura operar com *Low Confidence*. A topologia é punida pela incerteza da pior fração relevante.

### 2.3. Violation Propagation
*   **Violation Individual**: Restrita à própria operação (Ex: NCG da Filial A deteriorou).
*   **Violation Herdada**: Uma vulnerabilidade de filial que compromete o patrimônio consolidado.
*   **Violation Sistêmica**: Uma violação que afeta todas as entidades atreladas (Ex: quebra de *covenant* da Holding que financia a operação).
*   **Violation de Grupo**: Problemas que só existem na visão consolidada (Ex: Nenhuma entidade individual está muito alavancada, mas no consolidado a dívida vs Ebitda quebra os limites).

### 2.4. Consolidated RuntimeOutput
O contrato final emitido pela topologia:
*   `lineage multinível`: O histórico de cálculo (ex: *Ebitda Grupo = Ebitda A + Ebitda B - Mútuo*).
*   `entity provenance`: De qual CNPJ nasceu um insight.
*   `consolidationPath`: Registra a árvore percorrida para consolidar.
*   `eliminatedValues`: Tabela transparente de tudo que foi eliminado na consolidação.
*   `confidenceByEntity`: Matriz de confiança para auditoria visual.
*   `violationsByEntity`: Matriz de alertas distribuídos por nó corporativo.

### 2.5. Stress Consolidado
*   **Contágio**: Propagação bottom-up de falência técnica ou iliquidez.
*   **Default em Cascata**: Quebra estrutural induzida (*cross-default*).
*   **Dependência de Caixa**: Quando empresas operacionais sugam a liquidez do caixa centralizador.
*   **Shared Liabilities / Cross Guarantees**: Aferição rigorosa de fianças, avais bancários compartilhados e endividamento solidário.

### 2.6. Memory Consolidada
*   **Longitudinal Individual vs Consolidada**: Capacidade de exibir os gráficos do grupo x gráficos de cada CNPJ paralelamente.
*   **Aquisição/Fusão**: Capacidade de injetar marcadores temporais na memória (M&A).
*   **Reset Estrutural**: Se 40% dos ativos foram vendidos (*Spin-Off*), o motor invalida a causalidade regressiva e aplica um "reset" analítico a partir do novo cenário.

### 2.7. Decision Engine Consolidado
*   **Recommendation Scope**: Tags `GLOBAL` ou `LOCAL` para ações sugeridas.
*   **Decisões por Entidade vs Sistêmicas**: Sugerir turnaround local na filial deficitária, contrapondo à blindagem jurídica da holding.
*   **Capital Allocation**: Planejamento intra-empresarial (qual caixa deve socorrer qual passivo de forma eficiente e fiscalmente menos onerosa).
*   **Suporte Intragrupo**: Atestar matematicamente se o grupo tem musculatura para salvar as frentes sensíveis sem recurso bancário.

### 2.8. Governance
*   **Audit Trail Consolidado**: Assinatura criptográfica ou selo de auditoria por rodada (*run*).
*   **Runtime Audit Multinível**: Rastreamento profundo contra manipulação.
*   **Traceability Completa & Lineage Financeiro**: Obrigatoriedade de "explicabilidade cega". Cada linha do consolidado tem que apresentar sua fórmula matricial.

### 2.9. Compatibilidade
*   **Backward Compatibility Total**: Se a propriedade `topology` ou `entities` estiver ausente do *payload* de entrada, a *pipeline* delega tudo para o `ExecutiveGovernanceRuntime` original e sai em `O(1)`.
*   **Single-Entity Mode Intacto**: Zero regressões ao escopo dos usuários de PME (CNPJ único).
*   **Feature Flags**: A nova *layer* operará por flag de instância.
*   **Rollout Incremental**: Implantação faseada (Fase 1: Múltiplas DREs, Fase 2: Consolidação Balanço, Fase 3: Stress Propagation).

### 2.10. Verification (QA)
*   `topology financial fixtures`: Casos de teste complexos.
*   `consolidated golden datasets`: Padrões ouro de saída consolidada para teste de regressão.
*   `intercompany elimination tests`: Testes unitários do `MultiEntityFinancialAdapter`.
*   `stress propagation tests`: Testes de contágio financeiro simulado.
*   `confidence degradation tests`: Cobertura da governança narrativa de múltiplas entidades.

---

## 3. RESULTADO ESPERADO
O Runtime Institucional migrará oficialmente de um **Processador Unitário de CNPJ** para um **Consolidated Multi-Entity Enterprise-Grade Causal Runtime**, assumindo a governança técnica de arquiteturas de Holdings, Grupos Econômicos e Portfólios de Private Equity.
