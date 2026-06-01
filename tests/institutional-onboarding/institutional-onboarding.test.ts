// @ts-nocheck
import { test } from 'node:test';
import * as assert from 'node:assert';
import { InstitutionalOnboardingOrchestrator } from '../../src/core/runtime/institutional-onboarding/InstitutionalOnboardingOrchestrator';
import { InstitutionalOnboardingInput } from '../../src/core/runtime/institutional-onboarding/InstitutionalOnboardingTypes';

function getBaseInput(): InstitutionalOnboardingInput {
  return {
    environmentConfiguration: {
      environmentType: 'PRODUCTION',
      mockFactoriesEnabled: false,
      debugModeEnabled: false,
    },
    deploymentReadinessReport: {
      overallStatus: 'DEPLOYMENT_READY',
      productionReadiness: { status: 'VALIDATED' }
    } as any,
    executiveAccessGovernance: {
      currentUserRole: 'MASTER_SUPERVISOR',
    },
    tenantIsolationRuntime: {
      tenantId: 'test-tenant-123',
      isPilotTenant: false,
      isProductionTenant: true,
      hasCrossTenantAccess: false,
    },
    organizationalMetadata: {
      organizationName: 'Valid Organization',
      industry: 'Technology',
      jurisdiction: 'Brazil',
      fiduciaryLevelRequired: 'STRICT',
    },
    onboardingDocumentation: {
      masterServiceAgreementSigned: true,
      dataProcessingAgreementSigned: true,
      fiduciaryCharterAccepted: true,
      operationalPlaybookGenerated: true,
    },
    institutionalConfiguration: {
      allowedEnvironments: ['PRODUCTION'],
      maxAuthorizedUsers: 5,
      featuresEnabled: ['ALL'],
    },
    operationalChecklist: {
      dataIngestionConfigured: true,
      userRolesMapped: true,
      baselineMetricsEstablished: true,
    },
    pilotGovernanceStatus: {
      pilotApproved: false,
      pilotDurationDays: 0,
      pilotSupervisors: [],
    },
    executiveReport: {
      metadata: { lineageHash: 'abc-123' },
    } as any,
    auditTrail: ['Test started'],
    lineageHash: 'abc-123'
  };
}

test('Institutional Onboarding Engine Validation', async (t) => {
  await t.test('1. Missing tenant isolation blocks activation', () => {
    const input = getBaseInput();
    input.tenantIsolationRuntime = null as any;
    const output = InstitutionalOnboardingOrchestrator.evaluate(input);
    assert.strictEqual(output.onboardingBlocked, true);
    assert.strictEqual(output.tenantIsolationStatus, 'UNSAFE');
  });

  await t.test('2. Missing onboarding documents blocks onboarding', () => {
    const input = getBaseInput();
    input.onboardingDocumentation.masterServiceAgreementSigned = false;
    const output = InstitutionalOnboardingOrchestrator.evaluate(input);
    assert.strictEqual(output.onboardingBlocked, true);
    assert.strictEqual(output.fiduciaryValidationStatus, 'PARTIAL');
  });

  await t.test('3. Pilot tenants remain restricted', () => {
    const input = getBaseInput();
    input.environmentConfiguration.environmentType = 'PILOT';
    input.tenantIsolationRuntime.isPilotTenant = true;
    input.tenantIsolationRuntime.isProductionTenant = false;
    input.pilotGovernanceStatus.pilotApproved = true;
    const output = InstitutionalOnboardingOrchestrator.evaluate(input);
    assert.strictEqual(output.onboardingBlocked, false);
    assert.strictEqual(output.onboardingStage, 'PILOT_ACTIVATION');
  });

  await t.test('4. Cross-tenant contamination blocked', () => {
    const input = getBaseInput();
    input.tenantIsolationRuntime.hasCrossTenantAccess = true;
    const output = InstitutionalOnboardingOrchestrator.evaluate(input);
    assert.strictEqual(output.onboardingBlocked, true);
    assert.strictEqual(output.tenantIsolationStatus, 'UNSAFE');
    assert.ok(output.blockedActivationReasons.some(r => r.includes('Cross-tenant data contamination')));
  });

  await t.test('5. Invalid deployment readiness blocks FULL_OPERATION', () => {
    const input = getBaseInput();
    input.deploymentReadinessReport.overallStatus = 'DEPLOYMENT_BLOCKED';
    const output = InstitutionalOnboardingOrchestrator.evaluate(input);
    assert.strictEqual(output.onboardingBlocked, true);
    assert.ok(output.blockedActivationReasons.some(r => r.includes('Deployment readiness')));
  });

  await t.test('6. Invalid executive governance blocks activation', () => {
    const input = getBaseInput();
    input.executiveAccessGovernance.currentUserRole = 'PILOT_OPERATOR';
    const output = InstitutionalOnboardingOrchestrator.evaluate(input);
    assert.strictEqual(output.onboardingBlocked, true);
    assert.strictEqual(output.activationGovernanceStatus, 'BLOCKED');
  });

  await t.test('7. FULL_INSTITUTIONAL_OPERATION requires all mandatory conditions', () => {
    const input = getBaseInput();
    const output = InstitutionalOnboardingOrchestrator.evaluate(input);
    assert.strictEqual(output.onboardingBlocked, false);
    assert.strictEqual(output.onboardingStage, 'FULL_INSTITUTIONAL_OPERATION');
  });

  await t.test('8. Audit trail generated correctly', () => {
    const input = getBaseInput();
    const output = InstitutionalOnboardingOrchestrator.evaluate(input);
    assert.strictEqual(output.setupAuditTrail.length, 2);
    assert.ok(output.setupAuditTrail[1].includes('Onboarding evaluated by MASTER_SUPERVISOR'));
  });

  await t.test('9. UI does not allow activation overrides (simulated by fail-closed enforcement)', () => {
    const input = getBaseInput();
    // Simulate a missing checklist
    input.operationalChecklist.baselineMetricsEstablished = false;
    const output = InstitutionalOnboardingOrchestrator.evaluate(input);
    assert.strictEqual(output.onboardingBlocked, true);
    assert.strictEqual(output.organizationalReadinessStatus, 'PARTIAL');
  });

  await t.test('10. Tenant lineage isolation validated', () => {
    const input = getBaseInput();
    input.lineageHash = '';
    const output = InstitutionalOnboardingOrchestrator.evaluate(input);
    assert.strictEqual(output.onboardingBlocked, true);
    assert.strictEqual(output.deploymentInheritanceStatus, 'INVALID');
  });

  await t.test('11. Pilot activation restricted correctly', () => {
    const input = getBaseInput();
    input.environmentConfiguration.environmentType = 'PILOT';
    input.pilotGovernanceStatus.pilotApproved = false; // Pilot requested but not approved
    const output = InstitutionalOnboardingOrchestrator.evaluate(input);
    assert.strictEqual(output.onboardingBlocked, true);
    assert.strictEqual(output.activationGovernanceStatus, 'BLOCKED');
  });

  await t.test('12. Fail-closed onboarding protection enforced on mocks in production', () => {
    const input = getBaseInput();
    input.environmentConfiguration.mockFactoriesEnabled = true;
    input.environmentConfiguration.environmentType = 'PRODUCTION';
    const output = InstitutionalOnboardingOrchestrator.evaluate(input);
    assert.strictEqual(output.onboardingBlocked, true);
    assert.strictEqual(output.onboardingStage, 'PRE_ONBOARDING');
    assert.strictEqual(output.confidenceLevel, 'LOW');
    assert.ok(output.blockedActivationReasons.some(r => r.includes('Mocks active')));
  });
});
