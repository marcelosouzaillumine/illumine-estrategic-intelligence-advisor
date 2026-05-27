import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { DataAccessContext } from '../../src/core/security/data-access-context';
import { TenantResolutionEngine } from '../../src/core/security/auth/TenantResolutionEngine';
import { executiveRuntime } from '../../src/core/runtime/executive-intelligence-runtime';
import { BoardPackExportEngine } from '../../src/core/exporting/BoardPackExportEngine';
import { InstitutionalMemoryRegistry } from '../../src/core/runtime/institutional-memory/InstitutionalMemoryRegistry';
import { SeveritySemanticEngine } from '../../src/components/executive-interaction/SeveritySemanticEngine';
import { AuditEventBus } from '../../src/core/security/audit/AuditEventBus';
import { ImmutableLedger } from '../../src/core/security/audit/ImmutableLedger';
import { DistributedAnomalyAggregator } from '../../src/core/runtime/distributed/DistributedAnomalyAggregator';
import { governanceService } from '../../src/services/governanceService';

describe('E2E Staging Governance Workflow Test', () => {
  let savedEvents: any[] = [];
  const originalSaveEvent = AuditEventBus.saveEvent;
  const originalSaveLedger = ImmutableLedger.saveLedger;

  beforeEach(() => {
    savedEvents = [];
    AuditEventBus.saveEvent = async (event: any) => {
      savedEvents.push(event);
    };
    ImmutableLedger.saveLedger = async () => {};
    DistributedAnomalyAggregator.setMockMode(true);
  });

  afterEach(() => {
    AuditEventBus.saveEvent = originalSaveEvent;
    ImmutableLedger.saveLedger = originalSaveLedger;
    DistributedAnomalyAggregator.setMockMode(false);
  });

  it('Executes the complete CFO fiduciary governance workflow in staging mode', async () => {
    const cfoUid = 'cfo-user-staging';
    const tenantId = 'tenant-a';
    const email = 'cfo@company.com';

    // 1. Simulate authentication and tenant resolution
    // Resolve should yield available tenants
    const mockUser = {
      uid: cfoUid,
      email: email
    } as any;

    // Stub resolve docs query
    const originalGetFirestoreDocs = TenantResolutionEngine.getFirestoreDocs;
    TenantResolutionEngine.getFirestoreDocs = async (q: any) => {
      const path = q?._query?.path?.segments?.join('/') || '';
      if (path.includes('clients')) {
        return {
          docs: [{ id: tenantId, data: () => ({ fantasia: 'Staging Company A', ownerId: cfoUid }) }]
        };
      }
      return { docs: [] };
    };

    const session = await TenantResolutionEngine.resolve(mockUser);
    TenantResolutionEngine.getFirestoreDocs = originalGetFirestoreDocs;

    assert.strictEqual(session.actorId, cfoUid);
    assert.strictEqual(session.sessionState, 'READY'); // Auto resolves single tenant
    assert.strictEqual(session.tenantId, tenantId);
    assert.ok(session.permissions.includes('CREATE_SIMULATION'));

    // 2. Load Executive Runtime
    const mockInput = {
      company: {
        segment: 'Industrial',
        businessModel: 'CAPITAL_INTENSE',
        capitalIntensity: 'High',
        stage: 'STABLE',
        operationalProfile: 'Ciclo longo'
      },
      indicators: [
        { id: '1', type: 'DRE', category: 'Receita Operacional Bruta', value: 120000, competence: '2026-05', createdBy: cfoUid, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), clientId: tenantId },
        { id: '2', type: 'DRE', category: 'EBITDA', value: 25000, competence: '2026-05', createdBy: cfoUid, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), clientId: tenantId },
        { id: '3', type: 'BP', category: 'Caixa e Equivalentes', value: 45000, competence: '2026-05', createdBy: cfoUid, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), clientId: tenantId }
      ],
      compliance: {
        runtimeMode: 'FULL_FINANCIAL_VIEW',
        confidenceLevel: 'HIGH_CONFIDENCE',
        dataCompleteness: 1.0,
        causalDepth: 'DEEP',
        narrativeRestrictions: [],
        auditFlags: []
      },
      runtimeMetadata: {
        importId: 'IMPORT-999',
        connectorId: 'MANUAL',
        executionTimeMs: 45,
        executionLoopsDetected: false,
        lineage: {
          tenantId: tenantId,
          workspaceId: 'WS-1',
          connectorId: 'MANUAL',
          importId: 'IMPORT-999',
          datasetHash: 'hash-dataset-1',
          sourceHash: 'hash-source-1',
          mappingVersion: '1.0',
          timestamp: new Date().toISOString(),
          depth: 2
        }
      }
    };

    const report = executiveRuntime.generateExecutiveReport(mockInput as any);
    assert.ok(report);
    assert.strictEqual(report.scores.financial, 82.5); // Derived from mock input calculations
    assert.strictEqual(report.severity.level, 'SAUDÁVEL');

    // 3. View Dashboard & Severity Semantic Warnings
    const severityVisuals = SeveritySemanticEngine.getSeverityStyle('INFO');
    assert.ok(severityVisuals.bgColor.includes('blue') || severityVisuals.textColor.includes('blue'));
    assert.ok(severityVisuals.accessibilityLabel.includes('Informação'));

    // 4. Generate Board Deck
    const exportOutput = BoardPackExportEngine.exportBoardPack(report, cfoUid);
    assert.ok(exportOutput);
    assert.strictEqual(exportOutput.metadata.generatedBy, cfoUid);
    assert.strictEqual(exportOutput.metadata.lineageHash, 'hash-dataset-1');

    // 5. Open and append to Institutional Memory Timeline
    const memoryRecord = InstitutionalMemoryRegistry.append({
      tenantId: tenantId,
      entityId: 'ENT-1',
      timestamp: new Date().toISOString(),
      runtimeReferenceId: 'IMPORT-999',
      lineageHash: 'hash-dataset-1',
      governanceCategory: 'Liquidez',
      severityLevel: 'SAUDÁVEL',
      executiveUrgency: 'STABLE',
      narrativeSnapshot: 'Staging timeline test narrative.',
      causalSummary: 'Test causal context.',
      recommendationSnapshot: [],
      confidenceSnapshot: 'HIGH',
      memorySource: 'RUNTIME',
      integrityStatus: 'VERIFIED'
    });
    assert.ok(memoryRecord.memoryId.startsWith('mem-'));

    const timeline = InstitutionalMemoryRegistry.getRecords(tenantId);
    assert.ok(timeline.length > 0);
    assert.strictEqual(timeline[0].runtimeReferenceId, 'IMPORT-999');

    // 6. Attempt Blocked Cross-Tenant Access (CFO b attempts to query CFO a's audit logs)
    const contextCfoB: DataAccessContext = {
      actorId: 'cfo-b',
      tenantId: 'tenant-b',
      role: 'CFO',
      permissions: ['VIEW_OBSERVABILITY'],
      requestedAction: 'VIEW_OBSERVABILITY',
      resourceType: 'AuditTelemetry',
      resourceTenantId: 'tenant-a', // Attempting access on tenant-a
      entityScope: { tenantId: 'tenant-b', requestedEntityScope: 'ENTITY', allowedEntityIds: ['tenant-b'], allowedGroupIds: [], consolidatedScope: false },
      visibilityPolicy: 'INTERNAL'
    };

    await assert.rejects(async () => {
      await governanceService.getAuditEvents(contextCfoB, { tenantId: 'tenant-a' });
    }, (err: any) => {
      return err.message.includes('DENY_CROSS_TENANT') || err.message.includes('Acesso negado');
    });

    // 7. Verify cross-tenant denial is audited correctly
    const crossDenyEvent = savedEvents.find(e => e.eventType === 'CROSS_TENANT_ATTEMPT');
    assert.ok(crossDenyEvent);
    assert.strictEqual(crossDenyEvent.actorId, 'cfo-b');
    assert.strictEqual(crossDenyEvent.metadata?.targetTenantId, 'tenant-a');
  });
});
