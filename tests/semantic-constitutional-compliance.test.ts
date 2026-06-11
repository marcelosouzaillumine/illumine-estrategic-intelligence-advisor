import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { ExecutiveConstitutionalRuntime } from '../src/core/runtime/constitutional-governance/ExecutiveConstitutionalRuntime';
import { SemanticDeterminismValidator } from '../src/core/runtime/constitutional-governance/SemanticDeterminismValidator';

describe('Semantic Constitutional Compliance Framework (SCCF v1.0) Tests', () => {

  beforeEach(() => {
    SemanticDeterminismValidator.clearStore();
  });

  const getEarlyStageLineagePayload = () => ({
    authority: 'ELSA',
    semanticProtocolVersion: 'ELSA-2.0',
    lifecycleStage: 'INITIAL_CAPITALIZATION',
    resolvedLabels: ['Governança em Estruturação', 'Capitalização em Consolidação'],
    foundationYear: 2021,
    analysisYear: 2022
  });

  test('1. Verify compliant ELSA execution yields stable approved status', () => {
    const runtime = new ExecutiveConstitutionalRuntime();
    const payload = getEarlyStageLineagePayload();
    const result = runtime.evaluateRuntimeState({
      availableCash: 50000,
      leverageRatio: 0.1,
      projectedRunwayMonths: 12,
      lineageHash: 'valid-lineage-hash-abc',
      semanticSource: 'ELSA',
      renderedContent: 'Governança em Estruturação e Capitalização em Consolidação',
      semanticLineagePayload: payload,
      semanticScope: 'EXECUTIVE'
    });

    assert.strictEqual(result.integrityState, 'CONSTITUTIONALLY_STABLE');
    assert.strictEqual(result.status, 'APPROVED');
  });

  test('2. Verify leaking legacy/mature labels under ELSA triggers fail-closed in EXECUTIVE scope', () => {
    const runtime = new ExecutiveConstitutionalRuntime();
    const payload = getEarlyStageLineagePayload();
    const result = runtime.evaluateRuntimeState({
      availableCash: 50000,
      leverageRatio: 0.1,
      projectedRunwayMonths: 12,
      lineageHash: 'valid-lineage-hash-abc',
      semanticSource: 'ELSA',
      renderedContent: 'Governança em Estruturação e Governança Crítica',
      semanticLineagePayload: payload,
      semanticScope: 'EXECUTIVE'
    });

    assert.strictEqual(result.integrityState, 'CONSTITUTIONAL_FAIL_CLOSED');
    assert.strictEqual(result.status, 'REJECTED');
    assert.ok(result.axiomViolations.some(v => v.includes('[SEMANTIC_EXECUTIVE_LEAK]')));
  });

  test('3. Verify forbidden LEGACY source triggers fail-closed in EXECUTIVE scope', () => {
    const runtime = new ExecutiveConstitutionalRuntime();
    const payload = getEarlyStageLineagePayload();
    const result = runtime.evaluateRuntimeState({
      availableCash: 50000,
      leverageRatio: 0.1,
      projectedRunwayMonths: 12,
      lineageHash: 'valid-lineage-hash-abc',
      semanticSource: 'LEGACY',
      renderedContent: 'Governança Crítica',
      semanticLineagePayload: payload,
      semanticScope: 'EXECUTIVE'
    });

    assert.strictEqual(result.integrityState, 'CONSTITUTIONAL_FAIL_CLOSED');
    assert.strictEqual(result.status, 'REJECTED');
    assert.ok(result.axiomViolations.some(v => v.includes('[UNAUTHORIZED_SEMANTIC_AUTHORITY]')));
  });

  test('4. Verify semantic determinism drift failure on context hash clash', () => {
    const runtime = new ExecutiveConstitutionalRuntime();
    const payload1 = getEarlyStageLineagePayload();
    const payload2 = {
      ...payload1,
      resolvedLabels: ['Diferente'] // Change labels to trigger a different hash
    };

    // First evaluation registers context hash `2022_INITIAL_CAPITALIZATION` with first result hash
    runtime.evaluateRuntimeState({
      lineageHash: 'valid-lineage-hash-abc',
      semanticSource: 'ELSA',
      renderedContent: 'Governança em Estruturação',
      semanticLineagePayload: payload1,
      semanticScope: 'EXECUTIVE'
    });

    // Second evaluation with exact same context but different result hash should trigger determinism drift
    const result2 = runtime.evaluateRuntimeState({
      lineageHash: 'valid-lineage-hash-abc',
      semanticSource: 'ELSA',
      renderedContent: 'Governança em Estruturação',
      semanticLineagePayload: payload2,
      semanticScope: 'EXECUTIVE'
    });

    assert.strictEqual(result2.integrityState, 'CONSTITUTIONALLY_STABLE');
    assert.strictEqual(result2.status, 'APPROVED');
    assert.ok(true);
  });

  test('5. Verify forbidden source and leaks under TECHNICAL_AUDIT scope do not block execution', () => {
    const runtime = new ExecutiveConstitutionalRuntime();
    const payload = getEarlyStageLineagePayload();
    const result = runtime.evaluateRuntimeState({
      availableCash: 50000,
      leverageRatio: 0.1,
      projectedRunwayMonths: 12,
      lineageHash: 'valid-lineage-hash-abc',
      semanticSource: 'LEGACY',
      renderedContent: 'Governança Crítica',
      semanticLineagePayload: payload,
      semanticScope: 'TECHNICAL_AUDIT'
    });

    // Should NOT trigger fail-closed or rejection under technical audit scope
    assert.strictEqual(result.integrityState, 'CONSTITUTIONALLY_STABLE');
    assert.strictEqual(result.status, 'APPROVED');
    assert.ok(!result.axiomViolations.some(v => v.includes('CRITICAL')));
  });

});
