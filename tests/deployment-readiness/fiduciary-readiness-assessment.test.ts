// tests/deployment-readiness/fiduciary-readiness-assessment.test.ts

import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { FiduciaryReadinessAssessmentEngine } from '../../src/core/runtime/deployment-readiness/FiduciaryReadinessAssessmentEngine';
import { DeploymentReadinessInput } from '../../src/core/runtime/deployment-readiness/DeploymentReadinessTypes';

describe('Fiduciary Readiness Assessment Engine Validation', () => {

  const createBaseInput = (): DeploymentReadinessInput => ({
    executiveReport: {
      metadata: { lineageHash: 'FID_SECURE_HASH' },
      failClosedTriggered: false,
      resilienceReport: { confidenceLevel: 'HIGH' },
      operatingPressureReport: { explainability: { reasons: ['stable margin'] } },
      causalIntelligenceReport: { lineageHash: 'CAUSAL_HASH' },
      orchestratedNarrative: { leadParagraph: 'Stable narrative.' }
    } as any,
    environmentConfiguration: {
      environmentType: 'PRODUCTION',
      mockFactoriesEnabled: false,
      debugModeEnabled: false,
      tenantIsolationEnabled: true,
      activeSimulations: false,
    },
    tenantIsolationRuntime: {
      tenantId: 'prod-tenant',
      isPilotTenant: false,
      isProductionTenant: true,
      hasCrossTenantAccess: false,
    },
    runtimeHealthMetrics: {
      testsPassed: true,
      typecheckPassed: true,
      buildPassed: true,
      unresolvedAnomalies: 0,
    },
    currentUserRole: 'MASTER_SUPERVISOR',
    lineageHash: 'FID_SECURE_HASH',
    auditTrail: ['Initial audit entry'],
  });

  it('1. Valid baseline should return VALIDATED status', () => {
    const input = createBaseInput();
    const output = FiduciaryReadinessAssessmentEngine.evaluate(input);
    assert.equal(output.fiduciaryReadinessStatus, 'VALIDATED');
    assert.equal(output.issues.length, 0);
  });

  it('2. Missing lineage fails validation', () => {
    const input = createBaseInput();
    (input.executiveReport as any).metadata.lineageHash = '';
    const output = FiduciaryReadinessAssessmentEngine.evaluate(input);
    assert.equal(output.fiduciaryReadinessStatus, 'NOT_READY');
    assert.ok(output.issues.some(i => i.includes('lineage signature')));
  });

  it('3. Inconsistent fail-closed status fails validation', () => {
    const input = createBaseInput();
    input.executiveReport.resilienceReport!.confidenceLevel = 'LOW';
    (input.executiveReport as any).failClosedTriggered = false;
    const output = FiduciaryReadinessAssessmentEngine.evaluate(input);
    assert.equal(output.fiduciaryReadinessStatus, 'NOT_READY');
    assert.ok(output.issues.some(i => i.includes('Fail-closed safety triggers')));
  });

  it('4. Cross-tenant access fails validation', () => {
    const input = createBaseInput();
    input.tenantIsolationRuntime.hasCrossTenantAccess = true;
    const output = FiduciaryReadinessAssessmentEngine.evaluate(input);
    assert.equal(output.fiduciaryReadinessStatus, 'NOT_READY');
    assert.ok(output.issues.some(i => i.includes('Cross-tenant data isolation')));
  });

  it('5. Static audits failing fails validation', () => {
    const input = createBaseInput();
    input.runtimeHealthMetrics.typecheckPassed = false;
    const output = FiduciaryReadinessAssessmentEngine.evaluate(input);
    assert.equal(output.fiduciaryReadinessStatus, 'NOT_READY');
    assert.ok(output.issues.some(i => i.includes('governance audits')));
  });

  it('6. Incomplete explainability fails validation', () => {
    const input = createBaseInput();
    delete input.executiveReport.operatingPressureReport;
    const output = FiduciaryReadinessAssessmentEngine.evaluate(input);
    assert.equal(output.fiduciaryReadinessStatus, 'NOT_READY');
    assert.ok(output.issues.some(i => i.includes('Explainability')));
  });

  it('7. Simulations in production fails validation', () => {
    const input = createBaseInput();
    input.environmentConfiguration.activeSimulations = true;
    const output = FiduciaryReadinessAssessmentEngine.evaluate(input);
    assert.equal(output.fiduciaryReadinessStatus, 'NOT_READY');
    assert.ok(output.issues.some(i => i.includes('scenario simulations')));
  });

});
