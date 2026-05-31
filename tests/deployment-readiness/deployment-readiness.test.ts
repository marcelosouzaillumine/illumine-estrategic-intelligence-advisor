import test, { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { InstitutionalDeploymentReadinessEngine } from '../../src/core/runtime/deployment-readiness/InstitutionalDeploymentReadinessEngine';
import { DeploymentReadinessInput } from '../../src/core/runtime/deployment-readiness/DeploymentReadinessTypes';

describe('Institutional Deployment Readiness Engine Validation', () => {

  const createBaseInput = (): DeploymentReadinessInput => ({
    executiveReport: {
      metadata: { lineageHash: '12345' },
      failClosedTriggered: false,
      resilienceReport: { confidenceLevel: 'HIGH' },
      regressionReport: { regressionDetected: false }
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
    lineageHash: '12345',
    auditTrail: ['Initial execution'],
  });

  it('1. Missing lineage blocks production readiness', () => {
    const input = createBaseInput();
    input.lineageHash = '';
    const output = InstitutionalDeploymentReadinessEngine.evaluate(input);
    assert.equal(output.deploymentReadiness, 'NOT_READY');
    assert.equal(output.deploymentBlocked, true);
    assert.equal(output.lineageValidationStatus, 'INVALID');
  });

  it('2. Fail-closed inconsistency blocks deployment', () => {
    const input = createBaseInput();
    input.executiveReport.resilienceReport.confidenceLevel = 'LOW';
    // BUT failClosedTriggered is false!
    (input.executiveReport as any).failClosedTriggered = false;
    const output = InstitutionalDeploymentReadinessEngine.evaluate(input);
    assert.equal(output.deploymentReadiness, 'NOT_READY');
    assert.equal(output.deploymentBlocked, true);
    assert.equal(output.failClosedIntegrityStatus, 'BROKEN');
  });

  it('3. Tenant isolation failure blocks deployment', () => {
    const input = createBaseInput();
    input.tenantIsolationRuntime.tenantId = '';
    const output = InstitutionalDeploymentReadinessEngine.evaluate(input);
    assert.equal(output.deploymentReadiness, 'NOT_READY');
    assert.equal(output.deploymentBlocked, true);
  });

  it('4. Pilot environments remain isolated', () => {
    const input = createBaseInput();
    input.tenantIsolationRuntime.isPilotTenant = true;
    input.tenantIsolationRuntime.hasCrossTenantAccess = true;
    const output = InstitutionalDeploymentReadinessEngine.evaluate(input);
    assert.equal(output.pilotGovernanceStatus, 'INACTIVE'); // because it has isolation failure
    assert.equal(output.deploymentBlocked, true);
  });

  it('5. Mock factories unavailable in production', () => {
    const input = createBaseInput();
    input.environmentConfiguration.mockFactoriesEnabled = true;
    const output = InstitutionalDeploymentReadinessEngine.evaluate(input);
    assert.equal(output.deploymentReadiness, 'NOT_READY');
    assert.equal(output.deploymentBlocked, true);
    assert.ok(output.blockedDeploymentReasons.includes('CRITICAL: Mock factories or debug mode active in production.'));
  });

  it('6. Runtime anomalies downgrade readiness', () => {
    const input = createBaseInput();
    input.runtimeHealthMetrics.unresolvedAnomalies = 5;
    const output = InstitutionalDeploymentReadinessEngine.evaluate(input);
    // Warning but not block completely unless it was originally FULL_PRODUCTION_READY? 
    // Wait, FULL_PRODUCTION_READY requires HIGH assurance. With anomalies, assurance becomes MODERATE.
    assert.equal(output.operationalAssuranceStatus, 'MODERATE');
    assert.equal(output.deploymentReadiness, 'LIMITED_PRODUCTION_READY');
  });

  it('7. Executive access roles enforced correctly', () => {
    const input = createBaseInput();
    input.currentUserRole = 'PILOT_OPERATOR';
    const output = InstitutionalDeploymentReadinessEngine.evaluate(input);
    assert.equal(output.executiveAccessGovernanceStatus, 'WEAK');
    assert.equal(output.deploymentBlocked, true);
  });

  it('8. Deployment blockers render correctly (logic level)', () => {
    const input = createBaseInput();
    input.environmentConfiguration.debugModeEnabled = true;
    input.runtimeHealthMetrics.testsPassed = false;
    const output = InstitutionalDeploymentReadinessEngine.evaluate(input);
    assert.ok(output.blockedDeploymentReasons.length >= 2);
  });

  it('9. Production override impossible from UI (engine level)', () => {
    // Engine only evaluates state; it does not accept manual "force_deploy" flags.
    const input = createBaseInput();
    input.environmentConfiguration.debugModeEnabled = true; // explicitly unsafe
    const output = InstitutionalDeploymentReadinessEngine.evaluate(input);
    assert.equal(output.deploymentBlocked, true);
  });

  it('10. Readiness classification follows deterministic rules', () => {
    const input = createBaseInput();
    const output = InstitutionalDeploymentReadinessEngine.evaluate(input);
    assert.equal(output.deploymentReadiness, 'FULL_PRODUCTION_READY');
    assert.equal(output.deploymentBlocked, false);
  });

  it('11. Runtime regression risk escalates correctly', () => {
    const input = createBaseInput();
    input.executiveReport.regressionReport = { regressionDetected: true, activeRecoveryStage: 'COLLAPSE' } as any;
    const output = InstitutionalDeploymentReadinessEngine.evaluate(input);
    assert.equal(output.runtimeRegressionRisk, 'CRITICAL');
    assert.equal(output.deploymentBlocked, true);
  });

  it('12. FULL_PRODUCTION_READY requires all mandatory conditions (tests, typecheck, build)', () => {
    const input = createBaseInput();
    input.runtimeHealthMetrics.testsPassed = false;
    const output = InstitutionalDeploymentReadinessEngine.evaluate(input);
    assert.equal(output.deploymentReadiness, 'NOT_READY');
    assert.equal(output.deploymentBlocked, true);
    assert.equal(output.operationalAssuranceStatus, 'LOW');
  });

});
