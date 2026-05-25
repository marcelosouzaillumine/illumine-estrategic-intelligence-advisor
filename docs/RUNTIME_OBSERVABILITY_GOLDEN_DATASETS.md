# RUNTIME OBSERVABILITY GOLDEN DATASETS

Este documento cataloga os datasets padrão utilizados para testes das engines de observabilidade (`RuntimeTraceEngine`, `RuntimeProfiler`, `ExecutionLineageTracker`, etc.). Os testes devem garantir a conformidade institucional em cenários de pressão extrema sobre o próprio sistema de execução (loops, time-outs, colisões analíticas).

## Dataset 01: The "Recursive Engine Loop"
**Objetivo:** Disparar o limitador de profundidade causal (maxCausalDepth = 7) ou detectar recursão.
**Mocks Inject:**
- `ExecutionLineageTracker` injetado com 10 nodes de recursão paralela.
**Expected Audit Result:**
- `executionLoopsDetected: true`
- Status do Trace: `FAILED` ou `BLOCKED`

## Dataset 02: The "Performance Degraded Mode"
**Objetivo:** Disparar os timers de `RuntimeProfiler` (excedendo 1000ms críticos e 500ms excessivos).
**Mocks Inject:**
- Mockar timeouts em uma das engines simuladas.
**Expected Audit Result:**
- `performance.warnings` inclui os tempos estourados.
- `excessiveExecutionTime: true`
- `performance.isDegradedMode: true` se mais de 3 motores passarem do limiar excessivo.

## Dataset 03: The "Confidence Collapse Event"
**Objetivo:** Simular perdas sistemáticas de confiança na telemetria.
**Mocks Inject:**
- Penalidades empilhadas na ConfidenceTelemetry (Total drop abaixo de 45%).
**Expected Audit Result:**
- `confidenceTelemetry.confidenceCollapse: true`
- A lista de `collapseReasons` não deve estar vazia.

## Dataset 04: The "Safe Single-Entity Passthrough"
**Objetivo:** Garantir que o tracing base opera em O(1) de forma não intrusiva.
**Mocks Inject:**
- Topologia pura com 1 entidade.
**Expected Audit Result:**
- `performance.totalExecutionTimeMs < 100`
- `executionLoopsDetected: false`
- `status: COMPLETED`
