import { db } from '../../../lib/firebase';
import { collection, doc, addDoc, getDocs, updateDoc, query, where, limit, runTransaction } from 'firebase/firestore';
import { DataAccessContext } from '../../security/data-access-context';
import { AuditEventBus } from '../../security/audit/AuditEventBus';
import { RuntimePressureMonitor } from './RuntimePressureMonitor';

export type JobState =
  | 'QUEUED'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'RETRYING'
  | 'CANCELLED'
  | 'STALLED'
  | 'DEAD_LETTER';

export interface AsyncJob {
  jobId: string;
  tenantId: string;
  actorId: string;
  jobType: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  retryCount: number;
  maxRetries: number;
  failureReason?: string;
  correlationId: string;
  lineageReference?: string;
  processingNode: string;
  jobState: JobState;
  heartbeatAt?: string;
  visibilityPolicy?: string;
  entityScope?: any;
  auditRequired?: boolean;
  disposable?: boolean;
  payload?: any;
}

export class ThrottlingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ThrottlingError';
  }
}

export class AsyncJobQueue {
  private static localMockJobs: AsyncJob[] = [];
  private static isMockEnabled = false;

  // Set mock mode for unit testing without Firestore
  static setMockMode(enabled: boolean, initialJobs: AsyncJob[] = []) {
    this.isMockEnabled = enabled;
    if (enabled) {
      this.localMockJobs = [...initialJobs];
    }
  }

  static getLocalJobs(): AsyncJob[] {
    return this.localMockJobs;
  }

  // Wrapper for Firestore collection save
  static async saveJobDocument(job: AsyncJob): Promise<void> {
    if (this.isMockEnabled) {
      this.localMockJobs.push(job);
      return;
    }
    const cleanJob = JSON.parse(JSON.stringify(job));
    (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // addDoc(collection(db, 'institutional_jobs'), cleanJob);
  }

  // Wrapper for Firestore document update
  static async updateJobDocument(jobId: string, updates: Partial<AsyncJob>): Promise<void> {
    if (this.isMockEnabled) {
      const idx = this.localMockJobs.findIndex(j => j.jobId === jobId);
      if (idx !== -1) {
        this.localMockJobs[idx] = { ...this.localMockJobs[idx], ...updates };
      }
      return;
    }
    const cleanUpdates = JSON.parse(JSON.stringify(updates));
    // Query document by jobId field
    const q = query(collection(db, 'institutional_jobs'), where('jobId', '==', jobId), limit(1));
    const snap = await getDocs(q);
    if (!snap.empty) {
      (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // updateDoc(snap.docs[0].ref, cleanUpdates);
    }
  }

  // Wrapper for querying jobs
  static async getJobDocuments(tenantId: string, state?: JobState): Promise<AsyncJob[]> {
    if (this.isMockEnabled) {
      return this.localMockJobs.filter(j => 
        (tenantId === 'GLOBAL' || j.tenantId === tenantId) && 
        (!state || j.jobState === state)
      );
    }
    let q = query(collection(db, 'institutional_jobs'));
    if (tenantId !== 'GLOBAL') {
      q = query(q, where('tenantId', '==', tenantId));
    }
    if (state) {
      q = query(q, where('jobState', '==', state));
    }
    const snap = await getDocs(q);
    return snap.docs.map(d => d.data() as AsyncJob);
  }

  // Wrapper for counting tenant activity in the last 60 seconds
  static async getRecentJobsCount(tenantId: string, jobType: string): Promise<number> {
    const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
    if (this.isMockEnabled) {
      return this.localMockJobs.filter(j => 
        j.tenantId === tenantId && 
        j.jobType === jobType && 
        j.createdAt >= oneMinuteAgo
      ).length;
    }
    const q = query(
      collection(db, 'institutional_jobs'),
      where('tenantId', '==', tenantId),
      where('jobType', '==', jobType),
      where('createdAt', '>=', oneMinuteAgo)
    );
    const snap = await getDocs(q);
    return snap.size;
  }

  // Submissão de novos jobs
  static async submitJob(
    context: DataAccessContext,
    jobType: string,
    payload: any,
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'MEDIUM'
  ): Promise<string> {
    // 1. Validar Contexto Obrigatório
    if (!context || !context.tenantId || !context.actorId || !context.role) {
      throw new Error('Acesso negado: Contexto de governança ausente para submissão de job (DENY_MISSING_CONTEXT)');
    }

    // 2. Bloquear Cross-Tenant no ato de submissão
    if (context.resourceTenantId && context.tenantId !== context.resourceTenantId && context.role !== 'SUPER_ADMIN') {
      throw new Error('Acesso negado: Tentativa de submissão cross-tenant não autorizada (DENY_CROSS_TENANT)');
    }

    const tenantId = context.tenantId;

    // 3. Tenant-Aware Throttling Enforcement
    const count = await this.getRecentJobsCount(tenantId, jobType);
    let limitExceeded = false;
    let threshold = 100;

    if (jobType === 'Simulation') {
      threshold = 10;
      if (count >= 10) limitExceeded = true;
    } else if (jobType === 'Export') {
      threshold = 5;
      if (count >= 5) limitExceeded = true;
    } else if (jobType === 'Telemetry') {
      threshold = 100;
      if (count >= 100) limitExceeded = true;
    }

    const isFiduciary = 
      priority === 'CRITICAL' ||
      ['EXPORT_BOARD_PACK', 'EXPORT_SNAPSHOT', 'EXPORT_REPORT', 'CREATE_SNAPSHOT', 'CREATE_BOARD_PACK'].includes(jobType) ||
      (jobType === 'Simulation' && context.approvalState === 'BOARD_APPROVED');

    const isDisposable = !!payload?.disposable || priority === 'LOW';

    if (limitExceeded) {
      // Registrar pressão no monitor
      RuntimePressureMonitor.registerPressureIncident({
        runtimeType: jobType === 'Simulation' ? 'Simulation Runtime' : jobType === 'Export' ? 'Export Runtime' : 'Telemetry Runtime',
        severity: isFiduciary ? 'HIGH' : 'MEDIUM',
        tenantId,
        recommendedAction: isFiduciary 
          ? 'Adiar processamento do job fiduciário crítico na fila' 
          : 'Aplicar descarte automático (shedding) para liberar largura de banda'
      });

      if (!isFiduciary && isDisposable) {
        // Shedding: descarta e lança erro
        throw new ThrottlingError(`THROTTLING_LIMIT_EXCEEDED: Tenant ${tenantId} limit exceeded for ${jobType} (${count}/${threshold} jobs/min). Disposable job dropped.`);
      }
      
      // Se for fiduciário ou não-disposable, prossegue para enfileiramento passivo (adiamento)
    }

    const jobId = `job_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    const correlationId = context.correlationId || `corr_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    const job: AsyncJob = {
      jobId,
      tenantId,
      actorId: context.actorId,
      jobType,
      priority,
      createdAt: new Date().toISOString(),
      retryCount: 0,
      maxRetries: 3,
      correlationId,
      lineageReference: context.lineageHash,
      processingNode: 'N/A',
      jobState: 'QUEUED',
      visibilityPolicy: context.visibilityPolicy,
      entityScope: context.entityScope,
      auditRequired: context.auditRequirement,
      disposable: isDisposable,
      payload
    };

    await this.saveJobDocument(job);

    // Emitir telemetria de submissão se necessário
    if (context.auditRequirement || isFiduciary) {
      AuditEventBus.emit({
        tenantId,
        actorId: context.actorId,
        role: context.role,
        sessionId: context.sessionId || 'N/A',
        eventType: `SUBMIT_JOB_${jobType.toUpperCase()}`,
        resourceType: 'JobQueue',
        resourceId: jobId,
        correlationId,
        lineageReference: context.lineageHash,
        auditSeverity: 'INFO',
        requestSource: 'AsyncJobQueue',
        metadata: { jobId, priority, isDelayed: limitExceeded }
      });
    }

    return jobId;
  }

  // Claimer de jobs especializado por nó/worker
  static async claimNextJob(
    context: DataAccessContext,
    jobType: string,
    nodeId: string
  ): Promise<AsyncJob | null> {
    if (!context || !context.tenantId || !context.actorId || !context.role) {
      throw new Error('Acesso negado: Contexto de governança ausente para claimar job');
    }

    const tenantId = context.tenantId;

    // Worker comum não pode puxar tarefas de outro inquilino
    if (tenantId !== 'MASTER' && context.role !== 'SUPER_ADMIN') {
      // Forçar isolamento de tenant no claim
    }

    // Se for SUPER_ADMIN e solicitar cross-tenant, gera auditoria explicativa
    if (context.role === 'SUPER_ADMIN' && tenantId === 'MASTER' && context.resourceTenantId && context.resourceTenantId !== 'MASTER') {
      AuditEventBus.emit({
        tenantId: 'MASTER',
        actorId: context.actorId,
        role: 'SUPER_ADMIN',
        sessionId: context.sessionId || 'N/A',
        eventType: 'CROSS_TENANT_ATTEMPT',
        resourceType: 'JobQueue',
        auditSeverity: 'CRITICAL',
        requestSource: 'AsyncJobQueue',
        metadata: { action: 'claimNextJob', targetTenantId: context.resourceTenantId }
      });
    }

    // Lógica para puxar o próximo da fila
    if (this.isMockEnabled) {
      const targetTenant = (context.role === 'SUPER_ADMIN' && context.resourceTenantId) ? context.resourceTenantId : tenantId;
      const next = this.localMockJobs.find(j => 
        j.jobState === 'QUEUED' && 
        j.jobType === jobType && 
        (targetTenant === 'MASTER' || j.tenantId === targetTenant)
      );
      if (next) {
        next.jobState = 'RUNNING';
        next.startedAt = new Date().toISOString();
        next.heartbeatAt = new Date().toISOString();
        next.processingNode = nodeId;
        return { ...next };
      }
      return null;
    }

    // Em produção, usa transação para evitar claim concorrente duplo
    // Buscamos o primeiro job QUEUED ordenado por prioridade e timestamp
    return (()=>{throw new Error("Phase 7.2 Architecture Violation: Firestore Writes are BLOCKED. Migrated to PostgreSQL.");})(); // runTransaction(db, async (transaction) => {
      // Puxa o job mais antigo na fila
      const targetTenant = (context.role === 'SUPER_ADMIN' && context.resourceTenantId) ? context.resourceTenantId : tenantId;
      
      let q = query(
        collection(db, 'institutional_jobs'),
        where('jobState', '==', 'QUEUED'),
        where('jobType', '==', jobType)
      );
      
      if (targetTenant !== 'MASTER') {
        q = query(q, where('tenantId', '==', targetTenant));
      }

      const snap = await getDocs(q);
      const candidates = snap.docs.map(d => ({ ref: d.ref, data: d.data() as AsyncJob }));
      
      // Ordenação secundária na memória por prioridade (CRITICAL > HIGH > MEDIUM > LOW) e createdAt
      const priorityWeights = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 };
      candidates.sort((a, b) => {
        const wA = priorityWeights[a.data.priority] || 2;
        const wB = priorityWeights[b.data.priority] || 2;
        if (wA !== wB) return wB - wA;
        return a.data.createdAt.localeCompare(b.data.createdAt);
      });

      if (candidates.length > 0) {
        const best = candidates[0];
        transaction.update(best.ref, {
          jobState: 'RUNNING',
          startedAt: new Date().toISOString(),
          heartbeatAt: new Date().toISOString(),
          processingNode: nodeId
        });
        return {
          ...best.data,
          jobState: 'RUNNING',
          startedAt: new Date().toISOString(),
          heartbeatAt: new Date().toISOString(),
          processingNode: nodeId
        } as AsyncJob;
      }
      return null;
    });
  }

  static async completeJob(jobId: string): Promise<void> {
    await this.updateJobDocument(jobId, {
      jobState: 'COMPLETED',
      completedAt: new Date().toISOString()
    });
  }

  static async failJob(jobId: string, reason: string): Promise<void> {
    const jobs = await this.getJobDocuments('GLOBAL');
    const job = jobs.find(j => j.jobId === jobId);
    
    if (job) {
      const nextRetry = job.retryCount + 1;
      if (nextRetry < job.maxRetries) {
        await this.updateJobDocument(jobId, {
          jobState: 'RETRYING',
          retryCount: nextRetry,
          failureReason: reason
        });
        
        // Coloca de volta na fila como QUEUED após marcar a retentativa
        setTimeout(async () => {
          await this.updateJobDocument(jobId, {
            jobState: 'QUEUED'
          });
        }, 500);
      } else {
        await this.updateJobDocument(jobId, {
          jobState: 'FAILED',
          failureReason: reason,
          completedAt: new Date().toISOString()
        });
        // Tenta mover para a Dead-Letter Queue
        await this.moveToDeadLetter(jobId);
      }
    }
  }

  static async cancelJob(jobId: string): Promise<void> {
    await this.updateJobDocument(jobId, {
      jobState: 'CANCELLED',
      completedAt: new Date().toISOString()
    });
  }

  // Move jobs falhos persistentes para DEAD_LETTER
  static async moveToDeadLetter(jobId: string): Promise<void> {
    const jobs = await this.getJobDocuments('GLOBAL');
    const job = jobs.find(j => j.jobId === jobId);

    if (job) {
      await this.updateJobDocument(jobId, {
        jobState: 'DEAD_LETTER'
      });

      // Emite incidentes de pressão
      RuntimePressureMonitor.registerPressureIncident({
        runtimeType: 'Governance Runtime',
        severity: 'HIGH',
        tenantId: job.tenantId,
        recommendedAction: `Inspecionar Dead-Letter Queue para jobId ${jobId} (CorrelationId: ${job.correlationId})`
      });

      // Registra evento de auditoria fiduciária
      AuditEventBus.emit({
        tenantId: job.tenantId,
        actorId: job.actorId,
        role: 'SYSTEM',
        sessionId: 'SYSTEM_DAEMON',
        eventType: 'JOB_DEAD_LETTER',
        resourceType: 'JobQueue',
        resourceId: jobId,
        correlationId: job.correlationId,
        lineageReference: job.lineageReference,
        auditSeverity: 'CRITICAL',
        requestSource: 'AsyncJobQueue',
        metadata: { failureReason: job.failureReason, originalType: job.jobType }
      });
    }
  }

  // Daemon de verificação de heartbeats (recuperar jobs STALLED)
  static async recoverStalledJobs(): Promise<void> {
    const timeoutThreshold = 60 * 1000; // 60 segundos
    const now = Date.now();
    
    const allJobs = await this.getJobDocuments('GLOBAL');
    const runningJobs = allJobs.filter(j => j.jobState === 'RUNNING');

    for (const job of runningJobs) {
      const lastUpdate = job.heartbeatAt ? new Date(job.heartbeatAt).getTime() : new Date(job.startedAt || job.createdAt).getTime();
      
      if (now - lastUpdate > timeoutThreshold) {
        console.warn(`[AsyncJobQueue] Stalled job detected: ${job.jobId} (Last heartbeat: ${new Date(lastUpdate).toISOString()})`);
        
        await this.updateJobDocument(job.jobId, {
          jobState: 'STALLED',
          failureReason: 'STALLED: Execution timeout exceeded (60s without heartbeat).'
        });

        // Tenta re-enfileirar se limite de retries permitir
        const nextRetry = job.retryCount + 1;
        if (nextRetry < job.maxRetries) {
          await this.updateJobDocument(job.jobId, {
            jobState: 'RETRYING',
            retryCount: nextRetry
          });
          // Re-enfileira
          await this.updateJobDocument(job.jobId, {
            jobState: 'QUEUED',
            processingNode: 'N/A'
          });
          
          AuditEventBus.emit({
            tenantId: job.tenantId,
            actorId: 'SYSTEM',
            role: 'SYSTEM',
            sessionId: 'SYSTEM_DAEMON',
            eventType: 'JOB_RECOVERY',
            resourceType: 'JobQueue',
            resourceId: job.jobId,
            correlationId: job.correlationId,
            lineageReference: job.lineageReference,
            auditSeverity: 'WARNING',
            requestSource: 'AsyncJobQueue',
            metadata: { retryCount: nextRetry }
          });
        } else {
          // Excedeu retries -> Mover para DEAD_LETTER
          await this.moveToDeadLetter(job.jobId);
        }
      }
    }
  }

  // Worker node heartbeat
  static async updateHeartbeat(jobId: string): Promise<void> {
    await this.updateJobDocument(jobId, {
      heartbeatAt: new Date().toISOString()
    });
  }
}
