import { test } from 'node:test';
import * as assert from 'node:assert';
import { InstitutionalEvidenceOrchestrator } from '../../src/core/runtime/evidence-ingestion/InstitutionalEvidenceOrchestrator';
import { InstitutionalEvidenceInput, EvidenceDocument } from '../../src/core/runtime/evidence-ingestion/InstitutionalEvidenceTypes';

function getValidDoc(type: any, id: string): EvidenceDocument {
  return {
    id,
    type,
    hash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6',
    isSyntheticMock: false,
    timestamp: new Date().toISOString(),
    metadata: {
      period: '2023',
      currency: 'BRL',
      confidence: 1.0,
      tenantId: 'tenant-1'
    }
  };
}

function getBaseInput(): InstitutionalEvidenceInput {
  return {
    environmentConfiguration: {
      environmentType: 'PRODUCTION',
      mockFactoriesEnabled: false
    },
    tenantIsolationRuntime: {
      tenantId: 'tenant-1',
      isPilotTenant: false,
      isProductionTenant: true,
      hasCrossTenantAccess: false
    },
    organizationalMetadata: {} as any,
    onboardingStatus: {} as any,
    deploymentReadiness: {} as any,
    uploadedDocuments: [
      getValidDoc('BP', 'bp-1'),
      getValidDoc('DRE', 'dre-1'),
      getValidDoc('DFC', 'dfc-1'),
      getValidDoc('DLPA', 'dlpa-1')
    ],
    uploadAuditContext: {
      uploaderId: 'user-1',
      timestamp: new Date().toISOString(),
      ipHash: 'hash'
    },
    historicalEvidenceRegistry: [
      getValidDoc('BP', 'bp-history')
    ]
  };
}

test('Institutional Evidence Ingestion Layer', async (t) => {
  await t.test('1. Invalid hash blocks validation', () => {
    const input = getBaseInput();
    input.uploadedDocuments[0].hash = 'short';
    const output = InstitutionalEvidenceOrchestrator.evaluate(input);
    assert.strictEqual(output.fiduciaryInterpretationBlocked, true);
    assert.strictEqual(output.evidenceStatus, 'UNVALIDATED');
  });

  await t.test('2. Duplicate evidence detected correctly', () => {
    const input = getBaseInput();
    input.uploadedDocuments.push(getValidDoc('BP', 'bp-duplicate')); // same hash
    const output = InstitutionalEvidenceOrchestrator.evaluate(input);
    assert.strictEqual(output.duplicateEvidenceDetected, true);
    assert.strictEqual(output.fiduciaryInterpretationBlocked, true);
  });

  await t.test('3. Conflicting BP/DRE blocks reconciliation', () => {
    const input = getBaseInput();
    const newBp = getValidDoc('BP', 'bp-conflict');
    newBp.hash = 'b1e2c3a4d5f6g7h8i9j0k1l2m3n4o5p6'; // different hash
    input.uploadedDocuments.push(newBp);
    const output = InstitutionalEvidenceOrchestrator.evaluate(input);
    assert.strictEqual(output.conflictingEvidenceDetected, true);
    assert.strictEqual(output.fiduciaryInterpretationBlocked, true);
  });

  await t.test('4. Missing metadata downgrades evidence', () => {
    const input = getBaseInput();
    input.uploadedDocuments[0].metadata.period = '';
    const output = InstitutionalEvidenceOrchestrator.evaluate(input);
    assert.strictEqual(output.fiduciaryInterpretationBlocked, true);
  });

  await t.test('5. Tenant contamination blocked', () => {
    const input = getBaseInput();
    input.uploadedDocuments[0].metadata.tenantId = 'tenant-evil';
    const output = InstitutionalEvidenceOrchestrator.evaluate(input);
    assert.strictEqual(output.fiduciaryInterpretationBlocked, true);
    assert.strictEqual(output.tenantIsolationStatus, 'UNSAFE');
  });

  await t.test('6. Partial evidence blocks fiduciary trust', () => {
    const input = getBaseInput();
    input.uploadedDocuments = input.uploadedDocuments.filter(d => d.type !== 'DFC' && d.type !== 'DLPA');
    const output = InstitutionalEvidenceOrchestrator.evaluate(input);
    assert.strictEqual(output.fiduciaryInterpretationBlocked, false);
    assert.strictEqual(output.evidenceStatus, 'PARTIALLY_VALIDATED');
  });

  await t.test('7. Reconciliation failure activates fail-closed', () => {
    const input = getBaseInput();
    // Simulate missing core docs which forces failed reconciliation
    input.uploadedDocuments = input.uploadedDocuments.filter(d => d.type !== 'BP');
    const output = InstitutionalEvidenceOrchestrator.evaluate(input);
    assert.strictEqual(output.fiduciaryInterpretationBlocked, true);
    assert.strictEqual(output.reconciliationStatus, 'FAILED');
  });

  await t.test('8. Upload lineage recorded correctly', () => {
    const input = getBaseInput();
    const output = InstitutionalEvidenceOrchestrator.evaluate(input);
    assert.ok(output.uploadAuditTrail.length >= 3);
    assert.ok(output.uploadAuditTrail[0].includes('user-1'));
  });

  await t.test('9. Temporal inconsistency detected', () => {
    const input = getBaseInput();
    input.uploadedDocuments[0].metadata.period = '2022';
    input.uploadedDocuments[1].metadata.period = '2023';
    const output = InstitutionalEvidenceOrchestrator.evaluate(input);
    assert.strictEqual(output.temporalConsistencyStatus, 'PARTIAL');
  });

  await t.test('10. Fail-closed onboarding protection enforced on mocks in production', () => {
    const input = getBaseInput();
    input.uploadedDocuments[0].isSyntheticMock = true;
    const output = InstitutionalEvidenceOrchestrator.evaluate(input);
    assert.strictEqual(output.fiduciaryInterpretationBlocked, true);
    assert.ok(output.uploadAuditTrail.some(log => log.includes('Synthetic mock evidence')));
  });

  await t.test('11. FIDUCIARY_TRUSTED requires all mandatory conditions', () => {
    const input = getBaseInput();
    const output = InstitutionalEvidenceOrchestrator.evaluate(input);
    assert.strictEqual(output.fiduciaryInterpretationBlocked, false);
    assert.strictEqual(output.evidenceStatus, 'FIDUCIARY_TRUSTED');
    assert.strictEqual(output.confidenceLevel, 'HIGH');
  });
});
