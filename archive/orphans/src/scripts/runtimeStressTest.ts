import { RuntimeProfiler } from '../core/runtime/profiling/RuntimeProfiler';
import { ExecutionLatencyAnalyzer } from '../core/runtime/profiling/ExecutionLatencyAnalyzer';

function runStressTest() {
  console.log('Iniciando Runtime Stress Test...');
  const executionId = `STRESS-${Date.now()}`;

  RuntimeProfiler.startStage(executionId, 'DATA_FETCH');
  // mock delay
  const startFetch = Date.now();
  while (Date.now() - startFetch < 500) {} 
  RuntimeProfiler.endStage(executionId, 'DATA_FETCH');

  RuntimeProfiler.startStage(executionId, 'CONSOLIDATION');
  const startConsolidation = Date.now();
  while (Date.now() - startConsolidation < 800) {} 
  RuntimeProfiler.endStage(executionId, 'CONSOLIDATION');

  const snapshot = RuntimeProfiler.getSnapshot(executionId);
  if (snapshot) {
    ExecutionLatencyAnalyzer.analyze(snapshot);
    console.log(`Stress Test concluído: Tempo Total ${snapshot.totalDurationMs}ms`);
  }
}

try {
  runStressTest();
} catch (error) {
  console.error(error);
  process.exit(1);
}
