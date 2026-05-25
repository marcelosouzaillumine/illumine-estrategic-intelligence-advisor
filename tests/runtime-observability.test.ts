import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { RuntimeTraceEngine } from '../src/core/runtime/observability/RuntimeTraceEngine';

describe('Phase 4: Institutional Runtime Stabilization & Observability Layer', () => {

  it('1. Deve registrar performance limits e gerar warns (Performance Degraded Mode)', async () => {
    const traceEngine = new RuntimeTraceEngine('SINGLE_ENTITY');
    traceEngine.Profiler.startEngine('SlowEngine');
    
    // Simulate slow engine execution manually by faking the end time
    await new Promise(res => setTimeout(res, 510));
    
    traceEngine.Profiler.endEngine('SlowEngine');
    const trace = traceEngine.finalizeTrace();

    assert.ok(trace.performance.warnings.some(w => w.includes('excessive execution time')));
    assert.strictEqual(trace.excessiveExecutionTime, true);
  });

  it('2. Deve detectar recursão/excessiva profundidade (Recursive Engine Loop)', () => {
    const traceEngine = new RuntimeTraceEngine('PASS_THROUGH');
    
    // Inject 8 depths (limit is 7)
    for (let i = 0; i < 8; i++) {
      traceEngine.Lineage.startNode(`EngineLevel_${i}`, []);
    }
    
    // close them
    for (let i = 0; i < 8; i++) {
      traceEngine.Lineage.endNode('Output');
    }

    const trace = traceEngine.finalizeTrace();
    assert.strictEqual(trace.executionLoopsDetected, true);
  });

  it('3. Deve emitir colapso na telemetria de confiança (Confidence Collapse)', () => {
    const traceEngine = new RuntimeTraceEngine('MULTI_ENTITY');
    
    traceEngine.Telemetry.setBaseConfidence(100);
    traceEngine.Telemetry.applyPenalty(40, 'Missing Data A');
    traceEngine.Telemetry.applyPenalty(20, 'Missing Data B'); // Current is 40% < 45%

    const trace = traceEngine.finalizeTrace();
    assert.strictEqual(trace.confidenceTelemetry.confidenceCollapse, true);
    assert.strictEqual(trace.confidenceTelemetry.collapseReasons.length, 2);
  });

  it('4. Deve gerar lineage executivo transparente', () => {
    const traceEngine = new RuntimeTraceEngine('SCENARIO_SIMULATION');
    traceEngine.AdvisoryTrace.recordDecision('REDUZIR_CUSTOS', ['DRE_MARGIN'], ['Root: OPEX High']);
    
    const trace = traceEngine.finalizeTrace();
    assert.strictEqual(trace.advisoryLineage.length, 1);
    assert.strictEqual(trace.advisoryLineage[0].decision, 'REDUZIR_CUSTOS');
  });

});
