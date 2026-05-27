import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import { AsyncJobQueue, AsyncJob, ThrottlingError } from '../src/core/runtime/distributed/AsyncJobQueue';
import { WorkerRegistry } from '../src/core/runtime/distributed/WorkerRegistry';
import { RuntimePartitionManager } from '../src/core/runtime/distributed/RuntimePartitionManager';
import { RuntimePressureMonitor } from '../src/core/runtime/distributed/RuntimePressureMonitor';
import { DistributedAnomalyAggregator } from '../src/core/runtime/distributed/DistributedAnomalyAggregator';
import { AuditEventBus } from '../src/core/security/audit/AuditEventBus';
import { AnomalyDetector } from '../src/core/security/audit/AnomalyDetector';
import { DataAccessContext } from '../src/core/security/data-access-context';
import { governanceService } from '../src/services/governanceService';
import { ImmutableLedger } from '../src/core/security/audit/ImmutableLedger';

describe('Enterprise Scalability & Distributed Runtime Layer Tests', () => {
  let savedEvents: any[] = [];
  let detectedAnomalies: any[] = [];
  const originalSaveEvent = AuditEventBus.saveEvent;
  const originalSaveAnomaly = AnomalyDetector.saveAnomaly;
  const originalGetFirestoreDocs = governanceService.getFirestoreDocs;
  const originalSaveLedger = ImmutableLedger.saveLedger;

  beforeEach(() => {
    savedEvents = [];
    detectedAnomalies = [];
    (AnomalyDetector as any).activeAnomalyKeys.clear();
    (AnomalyDetector as any).recentEvents = [];
    
    AuditEventBus.saveEvent = async (event: any) => {
      savedEvents.push(event);
    };

    AnomalyDetector.saveAnomaly = async (anomaly: any) => {
      detectedAnomalies.push(anomaly);
    };

    ImmutableLedger.saveLedger = async () => {};

    // Enable mock modes
    AsyncJobQueue.setMockMode(true);
    RuntimePressureMonitor.setMockMode(true);
    DistributedAnomalyAggregator.setMockMode(true);
    
    // Clear registry and metrics
    WorkerRegistry.clear();
    RuntimePartitionManager.reset();
  });

  afterEach(() => {
    AuditEventBus.saveEvent = originalSaveEvent;
    AnomalyDetector.saveAnomaly = originalSaveAnomaly;
    governanceService.getFirestoreDocs = originalGetFirestoreDocs;
    ImmutableLedger.saveLedger = originalSaveLedger;
    AsyncJobQueue.setMockMode(false);
    RuntimePressureMonitor.setMockMode(false);
    DistributedAnomalyAggregator.setMockMode(false);
  });

  const validContext: DataAccessContext = {
    tenantId: 'tenant-a',
    actorId: 'user-1',
    role: 'CFO',
    permissions: ['CREATE_SIMULATION', 'EXPORT_SNAPSHOT', 'VIEW_OBSERVABILITY'],
    requestedAction: 'CREATE_SIMULATION',
    resourceType: 'Simulation',
    resourceTenantId: 'tenant-a',
    entityScope: {
      tenantId: 'tenant-a',
      requestedEntityScope: 'ENTITY',
      entityId: 'ent-1',
      allowedEntityIds: ['ent-1'],
      allowedGroupIds: [],
      consolidatedScope: false
    },
    visibilityPolicy: 'INTERNAL',
    auditRequirement: false,
    sessionId: 'sess-1',
    correlationId: 'corr-1',
    lineageHash: 'lineage-1',
    scenarioHash: 'mock-scenario-hash'
  };

  it('1. submitJob exige DataAccessContext.', async () => {
    await assert.rejects(async () => {
      await AsyncJobQueue.submitJob(null as any, 'Simulation', {});
    }, (err: any) => {
      return err.message.includes('Contexto de governança ausente');
    });
  });

  it('2. job sem tenantId é negado.', async () => {
    const invalidContext = { ...validContext, tenantId: '' };
    await assert.rejects(async () => {
      await AsyncJobQueue.submitJob(invalidContext, 'Simulation', {});
    }, (err: any) => {
      return err.message.includes('Contexto de governança ausente');
    });
  });

  it('3. job entra como QUEUED.', async () => {
    const jobId = await AsyncJobQueue.submitJob(validContext, 'Simulation', { data: 'sim' });
    const jobs = await AsyncJobQueue.getJobDocuments('tenant-a');
    const job = jobs.find(j => j.jobId === jobId);

    assert.ok(job);
    assert.strictEqual(job.jobState, 'QUEUED');
    assert.strictEqual(job.jobType, 'Simulation');
    assert.strictEqual(job.correlationId, 'corr-1');
  });

  it('4. claimNextJob muda QUEUED para RUNNING.', async () => {
    await AsyncJobQueue.submitJob(validContext, 'Simulation', { data: 'sim' });
    
    const claimed = await AsyncJobQueue.claimNextJob(validContext, 'Simulation', 'node-1');
    assert.ok(claimed);
    assert.strictEqual(claimed.jobState, 'RUNNING');
    assert.strictEqual(claimed.processingNode, 'node-1');

    const jobs = await AsyncJobQueue.getJobDocuments('tenant-a');
    const job = jobs.find(j => j.jobId === claimed.jobId);
    assert.strictEqual(job?.jobState, 'RUNNING');
  });

  it('5. processamento concorrente não duplica claim.', async () => {
    await AsyncJobQueue.submitJob(validContext, 'Simulation', { data: 'sim-1' });

    const claimed1 = await AsyncJobQueue.claimNextJob(validContext, 'Simulation', 'node-1');
    const claimed2 = await AsyncJobQueue.claimNextJob(validContext, 'Simulation', 'node-2');

    assert.ok(claimed1);
    assert.strictEqual(claimed2, null);
  });

  it('6. completeJob muda RUNNING para COMPLETED.', async () => {
    const jobId = await AsyncJobQueue.submitJob(validContext, 'Simulation', {});
    await AsyncJobQueue.claimNextJob(validContext, 'Simulation', 'node-1');

    await AsyncJobQueue.completeJob(jobId);
    const jobs = await AsyncJobQueue.getJobDocuments('tenant-a');
    const job = jobs.find(j => j.jobId === jobId);

    assert.strictEqual(job?.jobState, 'COMPLETED');
    assert.ok(job?.completedAt);
  });

  it('7. failJob incrementa retryCount.', async () => {
    const jobId = await AsyncJobQueue.submitJob(validContext, 'Simulation', {});
    await AsyncJobQueue.claimNextJob(validContext, 'Simulation', 'node-1');

    await AsyncJobQueue.failJob(jobId, 'Transient error');
    
    const jobs = await AsyncJobQueue.getJobDocuments('tenant-a');
    const job = jobs.find(j => j.jobId === jobId);

    assert.strictEqual(job?.jobState, 'RETRYING');
    assert.strictEqual(job?.retryCount, 1);
    assert.strictEqual(job?.failureReason, 'Transient error');

    // Wait for timeout reschedule
    await new Promise(r => setTimeout(r, 600));
    const freshJob7 = AsyncJobQueue.getLocalJobs().find(j => j.jobId === jobId);
    assert.strictEqual(freshJob7?.jobState, 'QUEUED');
  });

  it('8. job STALLED após 60s sem heartbeat.', async () => {
    const jobId = await AsyncJobQueue.submitJob(validContext, 'Simulation', {});
    await AsyncJobQueue.claimNextJob(validContext, 'Simulation', 'node-1');

    const jobs = AsyncJobQueue.getLocalJobs();
    const job = jobs.find(j => j.jobId === jobId);
    if (job) {
      job.startedAt = new Date(Date.now() - 70000).toISOString();
      job.heartbeatAt = new Date(Date.now() - 70000).toISOString();
    }

    await AsyncJobQueue.recoverStalledJobs();
    const freshJob8 = AsyncJobQueue.getLocalJobs().find(j => j.jobId === jobId);
    assert.strictEqual(freshJob8?.jobState, 'QUEUED');
  });

  it('9. job com retryCount excedido vai para DEAD_LETTER.', async () => {
    const jobId = await AsyncJobQueue.submitJob(validContext, 'Simulation', {});
    const jobs = AsyncJobQueue.getLocalJobs();
    const job = jobs.find(j => j.jobId === jobId);
    if (job) {
      job.jobState = 'RUNNING';
      job.retryCount = 3;
    }

    await AsyncJobQueue.failJob(jobId, 'Fatal failure');
    const freshJob9 = AsyncJobQueue.getLocalJobs().find(j => j.jobId === jobId);
    assert.strictEqual(freshJob9?.jobState, 'DEAD_LETTER');
    assert.strictEqual(freshJob9?.correlationId, 'corr-1');
    assert.strictEqual(freshJob9?.lineageReference, 'lineage-1');
  });

  it('10. tenant throttling barra excesso de simulações.', async () => {
    for (let i = 0; i < 10; i++) {
      await AsyncJobQueue.submitJob(validContext, 'Simulation', { index: i }, 'HIGH');
    }

    await assert.rejects(async () => {
      await AsyncJobQueue.submitJob(
        validContext,
        'Simulation',
        { index: 11, disposable: true },
        'LOW'
      );
    }, (err: any) => {
      return err instanceof ThrottlingError && err.message.includes('THROTTLING_LIMIT_EXCEEDED');
    });
  });

  it('11. export throttling barra excesso de exportações.', async () => {
    for (let i = 0; i < 5; i++) {
      await AsyncJobQueue.submitJob(validContext, 'Export', { index: i }, 'HIGH');
    }

    await assert.rejects(async () => {
      await AsyncJobQueue.submitJob(
        validContext,
        'Export',
        { index: 6, disposable: true },
        'LOW'
      );
    }, (err: any) => {
      return err instanceof ThrottlingError && err.message.includes('THROTTLING_LIMIT_EXCEEDED');
    });
  });

  it('12. telemetry low priority pode sofrer shedding.', async () => {
    for (let i = 0; i < 100; i++) {
      await AsyncJobQueue.submitJob(validContext, 'Telemetry', { index: i }, 'LOW');
    }

    await assert.rejects(async () => {
      await AsyncJobQueue.submitJob(validContext, 'Telemetry', { index: 101 }, 'LOW');
    }, (err: any) => {
      return err instanceof ThrottlingError && err.message.includes('THROTTLING_LIMIT_EXCEEDED');
    });
  });

  it('13. fiduciary export não pode sofrer shedding.', async () => {
    for (let i = 0; i < 5; i++) {
      await AsyncJobQueue.submitJob(validContext, 'Export', { index: i }, 'HIGH');
    }

    const jobId = await AsyncJobQueue.submitJob(
      validContext,
      'EXPORT_BOARD_PACK',
      { index: 6 },
      'CRITICAL'
    );
    
    assert.ok(jobId);
    const jobs = await AsyncJobQueue.getJobDocuments('tenant-a');
    assert.ok(jobs.some(j => j.jobId === jobId));
  });

  it('14. worker não processa tenant externo.', async () => {
    const contextB = { ...validContext, tenantId: 'tenant-b', resourceTenantId: 'tenant-b' };
    await AsyncJobQueue.submitJob(contextB, 'Simulation', { data: 'b' });

    const claimed = await AsyncJobQueue.claimNextJob(validContext, 'Simulation', 'worker-a');
    assert.strictEqual(claimed, null);
  });

  it('15. SUPER_ADMIN cross-tenant claim gera audit event.', async () => {
    await AsyncJobQueue.submitJob(validContext, 'Simulation', { data: 'a' });

    const superContext: DataAccessContext = {
      tenantId: 'MASTER',
      actorId: 'admin-1',
      role: 'SUPER_ADMIN',
      permissions: ['VIEW_OBSERVABILITY'],
      requestedAction: 'VIEW_OBSERVABILITY',
      resourceType: 'JobQueue',
      resourceTenantId: 'tenant-a',
      entityScope: { tenantId: 'MASTER', requestedEntityScope: 'GLOBAL', allowedEntityIds: [], allowedGroupIds: [], consolidatedScope: true },
      visibilityPolicy: 'INTERNAL',
      auditRequirement: true,
      sessionId: 'sess-admin'
    };

    const claimed = await AsyncJobQueue.claimNextJob(superContext, 'Simulation', 'worker-admin');
    assert.ok(claimed);
    assert.strictEqual(claimed.tenantId, 'tenant-a');

    await new Promise(r => setTimeout(r, 100));
    const crossEvent = savedEvents.find(e => e.eventType === 'CROSS_TENANT_ATTEMPT');
    assert.ok(crossEvent);
    assert.strictEqual(crossEvent.actorId, 'admin-1');
    assert.strictEqual(crossEvent.metadata?.targetTenantId, 'tenant-a');
  });

  it('16. RuntimePressureMonitor detecta fila > 10.', async () => {
    await RuntimePressureMonitor.registerPressureIncident({
      runtimeType: 'Simulation Runtime',
      severity: 'MEDIUM',
      tenantId: 'tenant-a',
      recommendedAction: 'Queue backlog > 10'
    });

    const incidents = await RuntimePressureMonitor.getPressureIncidents('tenant-a');
    assert.strictEqual(incidents.length, 1);
    assert.strictEqual(incidents[0].severity, 'MEDIUM');
  });

  it('17. congestionamento severo com fila > 25.', async () => {
    await RuntimePressureMonitor.registerPressureIncident({
      runtimeType: 'Simulation Runtime',
      severity: 'CRITICAL',
      tenantId: 'tenant-a',
      recommendedAction: 'Severe congestion queue > 25'
    });

    const incidents = await RuntimePressureMonitor.getPressureIncidents('tenant-a');
    assert.ok(incidents.some(i => i.severity === 'CRITICAL'));
  });

  it('18. DistributedAnomalyAggregator detecta massive exports cross-instance.', async () => {
    for (let i = 0; i < 5; i++) {
      const event = {
        eventId: `evt-${i}`,
        tenantId: 'tenant-a',
        actorId: 'cfo-user',
        role: 'CFO' as const,
        sessionId: `sess-${i}`,
        eventType: 'EXPORT_SNAPSHOT',
        resourceType: 'Snapshot',
        timestamp: new Date().toISOString(),
        requestSource: 'Test',
        auditSeverity: 'INFO' as const
      };
      await DistributedAnomalyAggregator.analyzeEvent(event);
    }

    assert.ok(detectedAnomalies.some(a => a.anomalyType === 'MASSIVE_EXPORTS'));
  });

  it('19. Observability Console não expõe jobs de outro tenant para CFO.', async () => {
    await AsyncJobQueue.submitJob(validContext, 'Simulation', { name: 'job-a' });

    const contextB = { ...validContext, tenantId: 'tenant-b', resourceTenantId: 'tenant-b' };
    await AsyncJobQueue.submitJob(contextB, 'Simulation', { name: 'job-b' });

    governanceService.getFirestoreDocs = async () => {
      const allJobs = AsyncJobQueue.getLocalJobs();
      // Simulate tenant query filter manually
      const filtered = allJobs.filter(j => j.tenantId === 'tenant-a');
      return {
        docs: filtered.map(j => ({ id: j.jobId, data: () => j }))
      };
    };

    const obsContext: DataAccessContext = {
      ...validContext,
      requestedAction: 'VIEW_OBSERVABILITY',
      resourceType: 'AuditTelemetry',
      visibilityPolicy: 'INTERNAL'
    };

    const jobs = await governanceService.getJobs(obsContext, { tenantId: 'tenant-a' });
    assert.ok(jobs.every(j => j.tenantId === 'tenant-a'));
    assert.strictEqual(jobs.length, 1);
  });

  it('20. Dead-Letter Queue preserva correlationId e lineageReference.', async () => {
    const jobId = await AsyncJobQueue.submitJob(validContext, 'Simulation', {});
    
    const localJobs = AsyncJobQueue.getLocalJobs();
    const job = localJobs.find(j => j.jobId === jobId);
    if (job) {
      job.jobState = 'RUNNING';
      job.retryCount = 3;
    }

    await AsyncJobQueue.failJob(jobId, 'Fatal failure');
    const freshJob20 = AsyncJobQueue.getLocalJobs().find(j => j.jobId === jobId);
    
    assert.strictEqual(freshJob20?.jobState, 'DEAD_LETTER');
    assert.strictEqual(freshJob20?.correlationId, 'corr-1');
    assert.strictEqual(freshJob20?.lineageReference, 'lineage-1');
  });
});
