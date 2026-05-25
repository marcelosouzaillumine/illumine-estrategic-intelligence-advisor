# Temporal Causality Engine - Golden Datasets (Phase 2)

Este documento define os conjuntos de dados de referência (Golden Datasets) institucionais para validação dos padrões evolutivos na *Temporal Causality Engine*. Eles garantem que a detecção de trajetórias e anomalias sistêmicas (como crescimento destrutivo ou recuperações artificiais) seja rigorosamente testável e livre de inferências na camada de UI.

## 1. Real Recovery (Turnaround Estrutural)
- **Perfil Operacional**: Reversão do prejuízo histórico e estancamento da queima de tesouraria.
- **Histórico**:
  - `Ano 1 (T-2)`: EBITDA negativo, Caixa caindo, Lucro negativo.
  - `Ano 2 (T-1)`: EBITDA levemente negativo, Caixa estável, Lucro negativo.
  - `Ano 3 (T-0)`: EBITDA positivo, Caixa crescendo, Lucro positivo.
- **Padrão Esperado**: `REC_TURNAROUND_EMERGING` (Structural Recovery).
- **Indicadores de Trajetória**: EBITDA Acelerando, Caixa Acelerando.

## 2. Destructive Growth (Crescimento Destrutivo)
- **Perfil Operacional**: Acúmulo severo de estoques gerando consumo de caixa e exigindo tomada agressiva de dívida, apesar de aumento no ativo circulante.
- **Histórico**:
  - `Ano 1 (T-2)`: Estoque normal, Dívida normal, Caixa normal, EBITDA positivo.
  - `Ano 2 (T-1)`: Estoque cresce 20%, Dívida sobe, Caixa em queda, EBITDA em leve queda.
  - `Ano 3 (T-0)`: Estoque cresce +30%, Dívida explode, Caixa negativo, EBITDA severamente deteriorado.
- **Padrão Esperado**: `RISK_DESTRUCTIVE_GROWTH` (Critical).
- **Indicadores de Trajetória**: EBITDA Desacelerando severamente.

## 3. Artificial Improvement by Debt (Melhora Artificial / Recurrent Dependency)
- **Perfil Operacional**: A empresa apresenta lucro impulsionado por eventos não-operacionais ou mantém saldo de caixa mascarado pela emissão recorrente de dívidas.
- **Histórico**:
  - `Ano 1 (T-2)`: EBITDA -100, Caixa 50, Dívida 100.
  - `Ano 2 (T-1)`: EBITDA -150, Caixa 60, Dívida 300 (dependência).
  - `Ano 3 (T-0)`: EBITDA -200, Caixa 70, Dívida 500, Lucro Líquido +50 (artificial).
- **Padrões Esperados**: `RISK_ARTIFICIAL_IMPROVEMENT` e `RISK_RECURRENT_DEPENDENCY`.
- **Indicadores de Trajetória**: Divergência acentuada entre caixa, dívida e geração orgânica.

## 4. Slow Deterioration (Deterioração Progressiva)
- **Perfil Operacional**: Sangria silenciosa do core business, com queda contínua do EBITDA e elevação sistêmica de passivos onerosos, embora sem colapso imediato.
- **Histórico**:
  - `Ano 1 (T-2)`: EBITDA 500, Dívida 100.
  - `Ano 2 (T-1)`: EBITDA 300, Dívida 250.
  - `Ano 3 (T-0)`: EBITDA 100, Dívida 400.
- **Padrão Esperado**: `RISK_PROGRESSIVE_DETERIORATION`.

## 5. Abrupt Collapse (Colapso Abrupto)
- **Perfil Operacional**: Queima fulminante de liquidez ou erosão crítica do patrimônio de um ano para o outro.
- **Histórico**:
  - `Ano 1 (T-1)`: Caixa 1000, Patrimônio 2000.
  - `Ano 2 (T-0)`: Caixa 150, Patrimônio 800.
- **Padrão Esperado**: `RISK_ABRUPT_COLLAPSE`.

## 6. Stable Company (Empresa Estável / Stabilizing)
- **Perfil Operacional**: Operação fundamentada sem solavancos nas estruturas de alavancagem ou destruição de margem.
- **Histórico**:
  - `Ano 1 (T-2)`: EBITDA 1000, Caixa 500, Dívida 200.
  - `Ano 2 (T-1)`: EBITDA 1100, Caixa 600, Dívida 180.
  - `Ano 3 (T-0)`: EBITDA 1050, Caixa 650, Dívida 150.
- **Padrão Esperado**: `REC_STABILIZATION` (Estabilização de Fundamentos).

## 7. Insufficient History (Histórico Insuficiente)
- **Perfil Operacional**: Plataforma não possui dados longitudinais adequados para inferência causal avançada.
- **Condição**: Menos de 3 anos de demonstrações contábeis integradas.
- **Comportamento Esperado**: `LIMITED_TEMPORAL_MODE`, bloqueio de inferência de tendências absolutas (`LOW_CONFIDENCE`).
