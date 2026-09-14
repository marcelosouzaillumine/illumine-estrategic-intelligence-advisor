import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { AuditEventBus, AuditEvent } from '../src/core/security/audit/AuditEventBus';
import { ImmutableLedger, ImmutableLedgerError } from '../src/core/security/audit/ImmutableLedger';
import { AnomalyDetector } from '../src/core/security/audit/AnomalyDetector';
import { DistributedAnomalyAggregator } from '../src/capabilities/runtime/distributed/DistributedAnomalyAggregator';
import { PermissionEngine } from '../src/core/security/permission-engine';
import { GovernedRepositoryWrapper } from '../src/core/security/governed-repository';
import { SessionGovernanceLayer } from '../src/core/security/auth/SessionGovernanceLayer';
import { PermissionEvaluationInput } from '../src/core/security/types';
import { DataAccessContext } from '../src/core/security/data-access-context';
import { governanceService } from '../src/services/governanceService';
import { FirestoreGovernanceAdapter } from '../src/adapters/persistence/FirestoreGovernanceAdapter';

describe('Institutional Audit & Telemetry Layer Tests', () => {
  let savedEvents: any[] = [];
  let savedFailures: any[] = [];
  let ledgerEntries: any[] = [];
  let detectedAnomalies: any[] = [];

  let shouldEventSaveFail = false;
  let shouldFailureSaveFail = false;
  let eventSaveFailCount = 0;

  const originalSaveEvent = AuditEventBus.saveEvent;
  const originalSaveFailure = AuditEventBus.saveFailure;
  const originalSaveLedger = ImmutableLedger.saveLedger;
  const originalSaveAnomaly = AnomalyDetector.saveAnomaly;
  const originalGetAuditEvents = FirestoreGovernanceAdapter.getAuditEvents;
  (FirestoreGovernanceAdapter as any)._originalGetAuditEvents = originalGetAuditEvents;

  // Helper to wait for event bus fire-and-forget loops to settle
  const flush = (customTimeout?: any) => new Promise((resolve) => (customTimeout || setTimeout)(resolve, 15));

  beforeEach(() => {
    savedEvents = [];
    savedFailures = [];
    ledgerEntries = [];
    detectedAnomalies = [];
    shouldEventSaveFail = false;
    shouldFailureSaveFail = false;
    eventSaveFailCount = 0;
    (AnomalyDetector as any).activeAnomalyKeys.clear();
    (AnomalyDetector as any).recentEvents = [];

    AuditEventBus.saveEvent = async (event: any) => {
      if (shouldEventSaveFail) {
        eventSaveFailCount++;
        return Promise.reject(new Error('Network failure simulated'));
      }
      savedEvents.push(event);
    };

    AuditEventBus.saveFailure = async (fail: any) => {
      if (shouldFailureSaveFail) {
        throw new Error('Network failure simulated for failure log');
      }
      savedFailures.push(fail);
    };

    ImmutableLedger.saveLedger = async (entry: any) => {
      ledgerEntries.push(entry);
    };

    AnomalyDetector.saveAnomaly = async (anomaly: any) => {
      detectedAnomalies.push(anomaly);
    };

    // Clean AnomalyDetector states
    (AnomalyDetector as any).recentEvents = [];
    (AnomalyDetector as any).activeAnomalyKeys.clear();

    // Enable mock mode for anomaly aggregator
    DistributedAnomalyAggregator.setMockMode(true);
  });

  afterEach(() => {
    AuditEventBus.saveEvent = originalSaveEvent;
    AuditEventBus.saveFailure = originalSaveFailure;
    ImmutableLedger.saveLedger = originalSaveLedger;
    AnomalyDetector.saveAnomaly = originalSaveAnomaly;
    FirestoreGovernanceAdapter.getAuditEvents = originalGetAuditEvents;
    DistributedAnomalyAggregator.setMockMode(false);
  });

  it('1. AuditEventBus estrutura evento corretamente.', async () => {
    await AuditEventBus.emit({
      tenantId: 'tenant-abc',
      actorId: 'user-001',
      role: 'CFO',
      sessionId: 'sess-123',
      eventType: 'VIEW_DASHBOARD',
      resourceType: 'Dashboard',
      auditSeverity: 'INFO',
      requestSource: 'TestRunner'
    });

    await flush();

    assert.strictEqual(savedEvents.length, 1);
    const event = savedEvents[0];
    assert.ok(event.eventId.startsWith('evt_'));
    assert.strictEqual(event.tenantId, 'tenant-abc');
    assert.strictEqual(event.actorId, 'user-001');
    assert.strictEqual(event.role, 'CFO');
    assert.strictEqual(event.sessionId, 'sess-123');
    assert.strictEqual(event.eventType, 'VIEW_DASHBOARD');
    assert.strictEqual(event.resourceType, 'Dashboard');
    assert.strictEqual(event.auditSeverity, 'INFO');
    assert.ok(event.timestamp);
  });

  it('2. AuditEventBus persiste evento normalizado.', async () => {
    await AuditEventBus.emit({
      tenantId: 'tenant-abc',
      actorId: 'user-002',
      role: 'BOARD_MEMBER',
      sessionId: 'sess-456',
      eventType: 'VIEW_BOARD_PACK',
      resourceType: 'BoardPack',
      auditSeverity: 'INFO',
      requestSource: 'TestRunner'
    });

    await flush();

    assert.strictEqual(savedEvents.length, 1);
    assert.strictEqual(savedEvents[0].actorId, 'user-002');
  });

  it('3. Eventos críticos vão para ImmutableLedger.', async () => {
    // 3.1 Critical event
    await AuditEventBus.emit({
      tenantId: 'tenant-abc',
      actorId: 'user-001',
      role: 'CFO',
      sessionId: 'sess-123',
      eventType: 'EXPORT_REPORT',
      resourceType: 'Report',
      auditSeverity: 'CRITICAL',
      requestSource: 'TestRunner'
    });

    await flush();

    assert.strictEqual(savedEvents.length, 1);
    assert.strictEqual(ledgerEntries.length, 1);
    assert.strictEqual(ledgerEntries[0].eventType, 'EXPORT_REPORT');
    assert.ok(ledgerEntries[0].ledgerHash);

    // Reset list
    ledgerEntries = [];

    // 3.2 Non-critical event
    await AuditEventBus.emit({
      tenantId: 'tenant-abc',
      actorId: 'user-001',
      role: 'CFO',
      sessionId: 'sess-123',
      eventType: 'VIEW_DASHBOARD',
      resourceType: 'Dashboard',
      auditSeverity: 'INFO',
      requestSource: 'TestRunner'
    });

    await flush();

    assert.strictEqual(ledgerEntries.length, 0); // Not written to immutable ledger
  });

  it('4. ImmutableLedger bloqueia update/delete lógico.', () => {
    assert.throws(() => {
      ImmutableLedger.update();
    }, (err: any) => {
      return err instanceof ImmutableLedgerError && err.message.includes('MUTATION_PROHIBITED');
    });

    assert.throws(() => {
      ImmutableLedger.delete();
    }, (err: any) => {
      return err instanceof ImmutableLedgerError && err.message.includes('MUTATION_PROHIBITED');
    });
  });

  it('5. MASSIVE_EXPORTS dispara após 5 exportações em 2 minutos.', async () => {
    for (let i = 0; i < 5; i++) {
      await AuditEventBus.emit({
        tenantId: 'tenant-abc',
        actorId: 'cfo-user',
        role: 'CFO',
        sessionId: 'sess-789',
        eventType: 'EXPORT_SNAPSHOT',
        resourceType: 'Snapshot',
        auditSeverity: 'CRITICAL',
        requestSource: 'TestRunner'
      });
    }

    await flush();

    const massiveAnomaly = detectedAnomalies.find(a => a.anomalyType === 'MASSIVE_EXPORTS');
    assert.ok(massiveAnomaly);
    assert.strictEqual(massiveAnomaly.severity, 'HIGH');
    assert.strictEqual(massiveAnomaly.actorId, 'cfo-user');
    assert.strictEqual(massiveAnomaly.tenantId, 'tenant-abc');
  });

  it('6. SUSPICIOUS_DENIED_ACCESS dispara após 3 negações em 1 minuto.', async () => {
    for (let i = 0; i < 3; i++) {
      await AuditEventBus.emit({
        tenantId: 'tenant-abc',
        actorId: 'suspicious-user',
        role: 'OPERATIONAL_USER',
        sessionId: 'sess-999',
        eventType: 'DENY_ROLE_NOT_ALLOWED',
        resourceType: 'Causality',
        auditSeverity: 'WARNING',
        requestSource: 'TestRunner'
      });
    }

    await flush();

    const deniedAnomaly = detectedAnomalies.find(a => a.anomalyType === 'SUSPICIOUS_DENIED_ACCESS');
    assert.ok(deniedAnomaly);
    assert.strictEqual(deniedAnomaly.severity, 'HIGH');
    assert.strictEqual(deniedAnomaly.actorId, 'suspicious-user');
  });

  it('7. OUT_OF_HOURS_ACCESS dispara entre 22h e 06h.', async () => {
    const originalGetHours = Date.prototype.getHours;

    try {
      // 7.1 Out of hours (23h)
      Date.prototype.getHours = () => 23;

      await AuditEventBus.emit({
        tenantId: 'tenant-abc',
        actorId: 'night-owl',
        role: 'CFO',
        sessionId: 'sess-night',
        eventType: 'EXPORT_SNAPSHOT',
        resourceType: 'Snapshot',
        auditSeverity: 'CRITICAL',
        requestSource: 'TestRunner'
      });

      await flush();

      const outOfHoursAnomaly = detectedAnomalies.find(a => a.anomalyType === 'OUT_OF_HOURS_ACCESS');
      assert.ok(outOfHoursAnomaly);
      assert.strictEqual(outOfHoursAnomaly.severity, 'MEDIUM');

      // Clear list
      detectedAnomalies = [];
      (AnomalyDetector as any).activeAnomalyKeys.clear();

      // 7.2 Working hours (14h)
      Date.prototype.getHours = () => 14;

      await AuditEventBus.emit({
        tenantId: 'tenant-abc',
        actorId: 'night-owl',
        role: 'CFO',
        sessionId: 'sess-night',
        eventType: 'EXPORT_SNAPSHOT',
        resourceType: 'Snapshot',
        auditSeverity: 'CRITICAL',
        requestSource: 'TestRunner'
      });

      await flush();

      const noAnomaly = detectedAnomalies.find(a => a.anomalyType === 'OUT_OF_HOURS_ACCESS');
      assert.ok(!noAnomaly);

    } finally {
      Date.prototype.getHours = originalGetHours;
    }
  });

  it('8. AGGRESSIVE_TENANT_SWITCHING dispara após 5 switches em 1 minuto.', async () => {
    for (let i = 0; i < 5; i++) {
      await AuditEventBus.emit({
        tenantId: 'tenant-abc',
        actorId: 'swapping-user',
        role: 'CFO',
        sessionId: 'sess-swaps',
        eventType: 'TENANT_SWITCH',
        resourceType: 'Session',
        auditSeverity: 'INFO',
        requestSource: 'TestRunner'
      });
    }

    await flush();

    const switchAnomaly = detectedAnomalies.find(a => a.anomalyType === 'AGGRESSIVE_TENANT_SWITCHING');
    assert.ok(switchAnomaly);
    assert.strictEqual(switchAnomaly.severity, 'HIGH');
    assert.strictEqual(switchAnomaly.actorId, 'swapping-user');
  });

  it('9. CROSS_TENANT_ATTEMPT gera anomaly.', async () => {
    await AuditEventBus.emit({
      tenantId: 'tenant-abc',
      actorId: 'attacker',
      role: 'CFO',
      sessionId: 'sess-attack',
      eventType: 'CROSS_TENANT_ATTEMPT',
      resourceType: 'Snapshot',
      auditSeverity: 'CRITICAL',
      requestSource: 'TestRunner',
      metadata: { targetTenantId: 'tenant-xyz' }
    });

    await flush();

    const crossAnomaly = detectedAnomalies.find(a => a.anomalyType === 'CROSS_TENANT_ATTEMPT');
    assert.ok(crossAnomaly);
    assert.strictEqual(crossAnomaly.severity, 'CRITICAL');
  });

  it('10. PermissionEngine emite evento para DENY_CROSS_TENANT.', async () => {
    const input: PermissionEvaluationInput = {
      tenantId: 'tenant-abc',
      actorId: 'user-001',
      userRole: 'CFO',
      permissions: ['VIEW_SNAPSHOT'],
      requestedAction: 'VIEW_SNAPSHOT',
      resourceType: 'Snapshot',
      resourceTenantId: 'tenant-xyz', // Cross-tenant
      visibilityPolicy: 'INTERNAL',
      entityScope: {
        tenantId: 'tenant-abc',
        requestedEntityScope: 'ENTITY',
        entityId: 'ent-1',
        allowedEntityIds: ['ent-1'],
        allowedGroupIds: [],
        consolidatedScope: false
      }
    };

    const decision = PermissionEngine.evaluatePermission(input);
    assert.strictEqual(decision.allowed, false);
    assert.strictEqual(decision.decisionCode, 'DENY_CROSS_TENANT');

    await flush();

    // Check emitted events
    const crossAttempt = savedEvents.find(e => e.eventType === 'CROSS_TENANT_ATTEMPT');
    assert.ok(crossAttempt);
    assert.strictEqual(crossAttempt.actorId, 'user-001');

    const crossDeny = savedEvents.find(e => e.eventType === 'DENY_CROSS_TENANT');
    assert.ok(crossDeny);
    assert.strictEqual(crossDeny.auditSeverity, 'CRITICAL');
  });

  it('11. GovernedRepository emite evento para EXPORT_SNAPSHOT.', async () => {
    const context: DataAccessContext = {
      tenantId: 'tenant-abc',
      actorId: 'cfo-user',
      role: 'CFO',
      permissions: ['EXPORT_SNAPSHOT'],
      requestedAction: 'EXPORT_SNAPSHOT',
      resourceType: 'Snapshot',
      resourceTenantId: 'tenant-abc',
      entityScope: {
        tenantId: 'tenant-abc',
        requestedEntityScope: 'ENTITY',
        entityId: 'ent-1',
        allowedEntityIds: ['ent-1'],
        allowedGroupIds: [],
        consolidatedScope: false
      },
      visibilityPolicy: 'INTERNAL',
      lineageHash: 'lineage-hash-xyz',
      inputHash: 'input-hash-abc',
      sessionId: 'sess-repo-test'
    };

    const result = await GovernedRepositoryWrapper.execute(context, async () => {
      return 'data-exported';
    });

    assert.strictEqual(result, 'data-exported');

    await flush();

    const exportEvent = savedEvents.find(e => e.eventType === 'EXPORT_SNAPSHOT' && e.requestSource === 'GovernedRepositoryWrapper');
    assert.ok(exportEvent);
    assert.strictEqual(exportEvent.sessionId, 'sess-repo-test');
    assert.strictEqual(exportEvent.lineageReference, 'lineage-hash-xyz');
    assert.strictEqual(exportEvent.auditSeverity, 'CRITICAL');
  });

  it('12. SessionGovernanceLayer emite LOGIN/TENANT_SELECTION/LOGOUT.', async () => {
    await SessionGovernanceLayer.emitTelemetry('LOGIN', 'sess-001', 'user-001', { role: 'CFO', tenantId: 'tenant-abc' });
    await SessionGovernanceLayer.emitTelemetry('TENANT_SELECTION', 'sess-001', 'user-001', { role: 'CFO', selectedTenantId: 'tenant-abc' });
    await SessionGovernanceLayer.emitTelemetry('LOGOUT', 'sess-001', 'user-001', { role: 'CFO', tenantId: 'tenant-abc' });

    await flush();

    const loginEvent = savedEvents.find(e => e.eventType === 'LOGIN');
    assert.ok(loginEvent);
    assert.strictEqual(loginEvent.sessionId, 'sess-001');

    const selectEvent = savedEvents.find(e => e.eventType === 'TENANT_SELECTION');
    assert.ok(selectEvent);

    const logoutEvent = savedEvents.find(e => e.eventType === 'LOGOUT');
    assert.ok(logoutEvent);
  });

  it('13. CFO não visualiza telemetry de outro tenant.', async () => {
    const context: DataAccessContext = {
      tenantId: 'tenant-cfo',
      actorId: 'cfo-user',
      role: 'CFO',
      permissions: ['VIEW_OBSERVABILITY'],
      requestedAction: 'VIEW_OBSERVABILITY',
      resourceType: 'AuditTelemetry',
      resourceTenantId: 'tenant-cfo',
      entityScope: {
        tenantId: 'tenant-cfo',
        requestedEntityScope: 'ENTITY',
        entityId: 'ent-1',
        allowedEntityIds: ['ent-1'],
        allowedGroupIds: [],
        consolidatedScope: false
      },
      visibilityPolicy: 'INTERNAL',
      sessionId: 'sess-cfo-obs'
    };

    // Stub FirestoreGovernanceAdapter
    FirestoreGovernanceAdapter.getAuditEvents = async (tenantId: string, isGlobal: boolean) => {
      if (!isGlobal && tenantId !== 'tenant-cfo') {
        return [];
      }
      return [
        { id: 'evt-1', eventId: 'evt-1', tenantId: 'tenant-cfo', eventType: 'VIEW_DASHBOARD' } as any
      ];
    };

    // 13.1 Querying own tenant should succeed
    const ownLogs = await governanceService.getAuditEvents(context, { tenantId: 'tenant-cfo' });
    assert.strictEqual(ownLogs.length, 1);
    assert.strictEqual(ownLogs[0].tenantId, 'tenant-cfo');

    // 13.2 CFO querying another tenant is prohibited by PermissionEngine cross-tenant check
    const foreignContext = {
      ...context,
      resourceTenantId: 'tenant-compromised'
    };

    await assert.rejects(async () => {
      await governanceService.getAuditEvents(foreignContext, { tenantId: 'tenant-compromised' });
    }, (err: any) => {
      return err.message.includes('DENY_CROSS_TENANT');
    });
  });

  it('14. SUPER_ADMIN visualiza cross-tenant, mas gera audit event.', async () => {
    const context: DataAccessContext = {
      tenantId: 'MASTER',
      actorId: 'super-admin-user',
      role: 'SUPER_ADMIN',
      permissions: ['VIEW_OBSERVABILITY', 'VIEW_AUDIT_LOGS'],
      requestedAction: 'VIEW_OBSERVABILITY',
      resourceType: 'AuditTelemetry',
      resourceTenantId: 'tenant-xyz', // Cross-tenant
      entityScope: {
        tenantId: 'MASTER',
        requestedEntityScope: 'GLOBAL',
        allowedEntityIds: [],
        allowedGroupIds: [],
        consolidatedScope: true
      },
      visibilityPolicy: 'INTERNAL',
      sessionId: 'sess-super-obs'
    };

    // Stub FirestoreGovernanceAdapter
    FirestoreGovernanceAdapter.getAuditEvents = async (tenantId: string, isGlobal: boolean) => {
      return [
        { id: 'evt-xyz-1', eventId: 'evt-xyz-1', tenantId: 'tenant-xyz', eventType: 'EXPORT_REPORT' } as any
      ];
    };
    const logs = await governanceService.getAuditEvents(context, { tenantId: 'tenant-xyz' });
    assert.strictEqual(logs.length, 1);
    assert.strictEqual(logs[0].tenantId, 'tenant-xyz');

    await flush();

    // Check that CROSS_TENANT_ATTEMPT audit event was generated for the SUPER_ADMIN action
    const crossAttempt = savedEvents.find(e => e.eventType === 'CROSS_TENANT_ATTEMPT');
    assert.ok(crossAttempt);
    assert.strictEqual(crossAttempt.actorId, 'super-admin-user');
    assert.strictEqual(crossAttempt.metadata?.targetTenantId, 'tenant-xyz');
  });

  it('15. OPERATIONAL_USER sem VIEW_OBSERVABILITY não acessa console.', async () => {
    const context: DataAccessContext = {
      tenantId: 'tenant-abc',
      actorId: 'op-user',
      role: 'OPERATIONAL_USER',
      permissions: ['VIEW_DASHBOARD'], // Doesn't have VIEW_OBSERVABILITY
      requestedAction: 'VIEW_OBSERVABILITY',
      resourceType: 'AuditTelemetry',
      resourceTenantId: 'tenant-abc',
      entityScope: {
        tenantId: 'tenant-abc',
        requestedEntityScope: 'ENTITY',
        entityId: 'ent-1',
        allowedEntityIds: ['ent-1'],
        allowedGroupIds: [],
        consolidatedScope: false
      },
      visibilityPolicy: 'INTERNAL',
      sessionId: 'sess-op-obs'
    };

    await assert.rejects(async () => {
      await governanceService.getAuditEvents(context);
    }, (err: any) => {
      return err.message.includes('DENY_PERMISSION_NOT_GRANTED');
    });
  });

  it('16. Fail-Safe: Fila com retry e registro de telemetryFailure ao esgotar.', async () => {
    const originalSetTimeout = global.setTimeout;
    
    // Override setTimeout to trigger in the next microtask inside retry loops
    (global as any).setTimeout = (cb: any, ms?: number) => {
      Promise.resolve().then(cb);
      return {} as any;
    };

    try {
      shouldEventSaveFail = true;

      // Emit critical event that triggers retries and eventual failure log
      await AuditEventBus.emit({
        tenantId: 'tenant-abc',
        actorId: 'retry-user',
        role: 'CFO',
        sessionId: 'sess-retry',
        eventType: 'EXPORT_BOARD_PACK',
        resourceType: 'BoardPack',
        auditSeverity: 'CRITICAL',
        requestSource: 'TestRunner'
      });

      for (let i = 0; i < 15; i++) {
        await flush();
      }

      // Check retried maxRetries times (5)
      assert.strictEqual(eventSaveFailCount, 5);
      
      // Saved failure log should be generated
      assert.strictEqual(savedFailures.length, 1);
      assert.strictEqual(savedFailures[0].eventType, 'EXPORT_BOARD_PACK');
      assert.strictEqual(savedFailures[0].actorId, 'retry-user');
      assert.ok(savedFailures[0].failedEventId);
    } finally {
      global.setTimeout = originalSetTimeout;
    }
  });
});
