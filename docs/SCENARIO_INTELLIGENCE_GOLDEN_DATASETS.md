# SCENARIO GOVERNANCE GOLDEN DATASETS

A inteligência preditiva e as simulações contrafactuais operam com rigor absoluto. Nenhuma métrica gerada deve ser considerada "aproximada", e toda simulação precisa respeitar rigorosamente a conservação de valor contábil (Ativo = Passivo + PL) e a propagação causal natural que seria inferida no passado.

Este documento define os **Datasets Dourados** institucionais usados para calibrar o motor em `src/core/runtime/scenario-governance/`.

## 1. Regras Fundamentais de Mutação
Toda mutação obedece a um fluxo em 3 etapas:
1. **Clonagem do Historical Series Data**: Clone profundo do período original mais recente.
2. **Choque Paramétrico**: Aplicação restrita de deltas nas rubricas fundamentais (ex: Multiplicador de Receita = 1.2).
3. **Equilíbrio Obrigatório**:
   - Se os custos fixos sobem e não há caixa suficiente, a Dívida (Passivos Financeiros) deve subir.
   - O Lucro Líquido projetado deve alterar o Patrimônio Líquido.
   - Todo Fluxo de Caixa livre positivo remanescente entra em Caixa/Equivalentes (Ativo Circulante).

## 2. Modelos Preditivos Oficiais

### [SCENARIO-01] Sustainable Growth (Crescimento Sustentável)
**Hipótese**: O que acontece se a empresa expandir vendas mantendo margem e ciclo de caixa?
- **Mutação Base**: `revenueShock = 1.2` (+20%), `marginShock = 1.0` (Neutro).
- **Efeito Esperado (DRE)**: EBITDA cresce nominalmente acompanhando a receita. Margem EBITDA preservada.
- **Efeito Esperado (Caixa)**: Geração operacional de caixa (OCF) positiva, absorvendo aumento natural da Necessidade de Capital de Giro.
- **Causalidade Propagada Esperada**: Geração limpa, sem degradação de risco sistêmico.

### [SCENARIO-02] Destructive Growth (Crescimento Destrutivo)
**Hipótese**: O que acontece se forçar crescimento dando desconto ou aumentando custo de aquisição massivamente?
- **Mutação Base**: `revenueShock = 1.3` (+30%), `marginShock = 0.7` (-30% na margem bruta), `opexExpansion = 1.5` (+50% em despesas).
- **Efeito Esperado (DRE)**: O Lucro Líquido derrete, tornando-se Prejuízo, consumindo PL.
- **Efeito Esperado (Caixa)**: O Burn Rate aumenta violentamente, causando colapso imediato no Runway se não houver reserva substancial.
- **Causalidade Propagada Esperada**: `CAIXA_DESTRUTIVO` na análise de Caixa; advisory exige estancamento rápido.

### [SCENARIO-03] Treasury Stress (Stress de Tesouraria / Ciclo)
**Hipótese**: Vendas constantes, mas fornecedores reduzem prazo e clientes atrasam o pagamento.
- **Mutação Base**: `receivablesDaysExtension = +30`, `payablesDaysExtension = -15`.
- **Efeito Esperado (DRE)**: EBITDA inalterado.
- **Efeito Esperado (BP)**: O Capital de Giro Operacional explode (Necessidade de Capital de Giro dispara).
- **Causalidade Propagada Esperada**: Saldo de tesouraria negativo, forte alerta de ruptura operacional devido a descasamento de ciclo financeiro.

### [SCENARIO-04] Runway Collapse
**Hipótese**: Aumento fixo de custo sem ganho de receita num caixa já limítrofe.
- **Mutação Base**: Caixa inicial baixo, `headcountAddition = 200000` mensal.
- **Efeito Esperado (Caixa)**: O Runway despenca de (ex: 8 meses) para < 2 meses.
- **Causalidade Propagada Esperada**: Alerta `RUNWAY_CRITICO` e "Necessidade Urgente de Capitalização" no executive summary.

### [SCENARIO-05] Capital Injection Dependency
**Hipótese**: Empresa queima caixa operacionalmente (EBITDA negativo ou OCF fortemente negativo) e sobrevive apenas injetando dívida/capital recorrentemente.
- **Mutação Base**: `debtInjection = 10000000`.
- **Efeito Esperado (Caixa)**: Caixa bruto e Runway matemático ficam confortáveis.
- **Causalidade Propagada Esperada**: `CAIXA_ARTIFICIAL` com dependência classificada como severa. A inteligência preditiva reconhece que a "sobrevivência" não vem da operação.

## 3. Matriz de Confiança e Incerteza Preditiva
A validação em testes do `confidence decay` deve provar que:
1. Simulações conservadoras (e.g., choques < 10% em ambientes com baixo desvio padrão histórico) mantém `confidenceLevel` alto.
2. Simulações disruptivas (e.g., `revenueShock = 2.5`) reduzem matematicamente a margem de incerteza e derrubam o `finalConfidence`.
3. Todo `ScenarioOutput` retorna os metadados de incerteza atrelados ao choque, invalidando análises de "fé cega" em simulações na UI.
