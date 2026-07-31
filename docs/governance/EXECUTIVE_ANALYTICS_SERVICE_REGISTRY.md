# Executive Analytics Service Registry

Este documento registra oficialmente todos os motores de inteligência e *Capabilities* sob a arquitetura do **Canonical Analytics Engine**.

## 1. Motores Core (Core Engines)

### Executive Analytics Engine
* **Responsabilidade:** Agrupar capabilities e produzir interpretações numéricas/estruturais sobre o negócio sem acoplamento textual.
* **Contrato de Saída:** `ExecutiveAnalyticsResult` (JSON estruturado).
* **Dependências:** `Indicator Engine`, `Financial Calculation Engine`.

### Executive Narrative Engine
* **Responsabilidade:** Traduzir os resultados puramente analíticos do *Executive Analytics Engine* em narrativas idiomáticas e contextuais para a interface (UI/Copilot).
* **Contrato de Saída:** `NarrativeBlock`, `ExecutiveSummary` (Tipos estruturados para renderização).
* **Dependências:** `Executive Analytics Engine`.

---

## 2. Analytics Capabilities Registradas

O **Executive Analytics Engine** é composto pelas seguintes *Capabilities* isoladas:

### LiquidityCapability
* **Owner:** Squad de Risco Fiduciário
* **Entradas:** Índices de Liquidez (Corrente, Seca, Imediata)
* **Responsabilidade:** Interpretar a capacidade de pagamento de curtíssimo e curto prazo, gerando alertas de ruptura de caixa.

### LeverageCapability
* **Owner:** Squad de Risco Fiduciário
* **Entradas:** Grau de Endividamento, Composição do Endividamento
* **Responsabilidade:** Avaliar a dependência de capital de terceiros e o perfil de risco do passivo exigível.

### ProfitabilityCapability
* **Owner:** Squad Operacional
* **Entradas:** Margem Bruta, Margem EBITDA, Margem Líquida, ROE, ROA
* **Responsabilidade:** Diagnosticar a eficiência na geração de valor e retorno sobre o capital empregado.

### CashFlowCapability
* **Owner:** Squad Operacional
* **Entradas:** FCO, FCI, FCF
* **Responsabilidade:** Interpretar o ciclo financeiro, necessidade de capital de giro e qualidade do lucro gerado vs. caixa gerado.

### WorkingCapitalCapability
* **Owner:** Squad Operacional
* **Entradas:** NCG, Saldo em Tesouraria, Ciclos de Prazo
* **Responsabilidade:** Avaliar a sincronia entre a necessidade de dinheiro para a operação e as fontes financeiras de curto prazo disponíveis.
