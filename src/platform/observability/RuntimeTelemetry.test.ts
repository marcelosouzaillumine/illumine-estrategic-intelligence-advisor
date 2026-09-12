// src/core/runtime/observability/RuntimeTelemetry.test.ts

import { test, describe, it, beforeEach } from 'node:test';
import assert from 'node:assert';
import { InMemoryRuntimeTelemetrySink } from './sinks/InMemoryRuntimeTelemetrySink';
import { RuntimeExecutionLogger } from './RuntimeExecutionLogger';
import { ExecutionTraceBuilder } from './ExecutionTraceBuilder';
import { RuntimeComplianceEngine } from '../../core/runtime/compliance/RuntimeComplianceEngine';

describe('Runtime Telemetry Abstraction', () => {
  let sink: InMemoryRuntimeTelemetrySink;

  beforeEach(() => {
    sink = new InMemoryRuntimeTelemetrySink();
    RuntimeExecutionLogger.setSink(sink);
    ExecutionTraceBuilder.setSink(sink);
  });

  it('deve registrar eventos no InMemory sink', async () => {
    await RuntimeExecutionLogger.logEvent('exec_123', 'RUNTIME_STARTED');
    assert.strictEqual(sink.logEvents.length, 1);
    assert.strictEqual(sink.logEvents[0].eventName, 'RUNTIME_STARTED');
    assert.strictEqual(sink.logEvents[0].executionId, 'exec_123');
  });

  it('deve construir trace com lineageHash e replayToken (RuntimeReplayEnvelope)', async () => {
    const builder = new ExecutionTraceBuilder('trace_456');
    builder.setMetadata({
      lineageHash: 'hash_789',
      runtimeVersion: '1.4.0',
      inputFingerprint: 'fingerprint_abc'
    });
    
    builder.startStage('DataIngestion');
    builder.endStage('SUCCESS');
    
    const trace = await builder.flushAndSave();
    assert.strictEqual(sink.traces.length, 1);
    assert.strictEqual(sink.traces[0].executionId, 'trace_456');
    assert.strictEqual(sink.traces[0].lineageHash, 'hash_789');

    const replayEnvelope = builder.buildReplayEnvelope();
    assert.ok(replayEnvelope);
    assert.strictEqual(replayEnvelope?.lineageHash, 'hash_789');
    assert.strictEqual(replayEnvelope?.executionPath[0], 'DataIngestion');
  });

  it('deve registrar fail-closed event', async () => {
    sink.recordFailClosedEvent({
      executionId: 'exec_fc_1',
      trigger: 'MATHEMATICAL_CORRUPTION',
      timestamp: new Date().toISOString(),
      severity: 'CRITICAL',
      affectedRuntimes: ['BoardPack']
    });

    assert.strictEqual(sink.failClosedEvents.length, 1);
    assert.strictEqual(sink.failClosedEvents[0].trigger, 'MATHEMATICAL_CORRUPTION');
  });

  it('deve registrar payload integrity check', async () => {
    sink.recordPayloadIntegrityCheck({
      executionId: 'exec_payload_1',
      lineageHash: 'hash_abc',
      isValid: false,
      violations: ['Payload incompleto'],
      timestamp: new Date().toISOString()
    });

    assert.strictEqual(sink.payloadIntegrityChecks.length, 1);
    assert.strictEqual(sink.payloadIntegrityChecks[0].violations[0], 'Payload incompleto');
  });

  it('engine.checkPayloadIntegrity deve capturar metadata faltante', () => {
    const engine = RuntimeComplianceEngine.getInstance();
    const violations = engine.checkPayloadIntegrity({});
    assert.ok(violations.includes('Metadata faltante'));
  });
});
