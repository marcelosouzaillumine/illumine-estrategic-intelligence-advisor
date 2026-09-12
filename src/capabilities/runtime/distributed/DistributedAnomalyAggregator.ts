import { db } from '../../../lib/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { AuditEvent } from '../../security/audit/AuditEventBus';
import { AnomalyDetector } from '../../security/audit/AnomalyDetector';

export class DistributedAnomalyAggregator {
  private static localAuditEvents: AuditEvent[] = [];
  private static isMockEnabled = false;

  private static isTestEnv(): boolean {
    return typeof process !== 'undefined' && (
      process.env.NODE_ENV === 'test' || 
      process.env.NODE_TEST_CONTEXT !== undefined || 
      process.argv.some(arg => arg.includes('test'))
    );
  }

  static setMockMode(enabled: boolean, initialEvents: AuditEvent[] = []) {
    this.isMockEnabled = enabled;
    if (enabled) {
      this.localAuditEvents = [...initialEvents];
    }
  }

  static getLocalAuditEvents(): AuditEvent[] {
    return this.localAuditEvents;
  }

  static async saveEventToLocalList(event: AuditEvent) {
    if (this.isMockEnabled || this.isTestEnv()) {
      this.localAuditEvents.push(event);
    }
  }

  static async getEventsInWindow(
    actorId: string,
    eventTypes: string[],
    sinceISO: string
  ): Promise<AuditEvent[]> {
    if (this.isMockEnabled || this.isTestEnv()) {
      return this.localAuditEvents.filter(e => 
        e.actorId === actorId && 
        eventTypes.includes(e.eventType) && 
        e.timestamp >= sinceISO
      );
    }
    
    const q = query(
      collection(db, 'audit_events'),
      where('actorId', '==', actorId),
      where('timestamp', '>=', sinceISO)
    );
    const snap = await getDocs(q);
    const events = snap.docs.map(d => d.data() as AuditEvent);
    return events.filter(e => eventTypes.includes(e.eventType));
  }

  static async getDeniedEventsInWindow(
    actorId: string,
    sinceISO: string
  ): Promise<AuditEvent[]> {
    if (this.isMockEnabled || this.isTestEnv()) {
      return this.localAuditEvents.filter(e => 
        e.actorId === actorId && 
        e.timestamp >= sinceISO &&
        (e.eventType === 'PERMISSION_DENIED' || e.eventType.startsWith('DENY_'))
      );
    }
    const q = query(
      collection(db, 'audit_events'),
      where('actorId', '==', actorId),
      where('timestamp', '>=', sinceISO)
    );
    const snap = await getDocs(q);
    const events = snap.docs.map(d => d.data() as AuditEvent);
    return events.filter(e => e.eventType === 'PERMISSION_DENIED' || e.eventType.startsWith('DENY_'));
  }

  static async analyzeEvent(event: AuditEvent): Promise<void> {
    if (this.isMockEnabled || this.isTestEnv()) {
      this.localAuditEvents.push(event);
    }

    const now = Date.now();
    const actorId = event.actorId;
    const tenantId = event.tenantId || 'GLOBAL';

    const triggerAnomaly = async (
      type: string,
      severity: 'MEDIUM' | 'HIGH' | 'CRITICAL',
      recommendedAction: string,
      details: Record<string, unknown>
    ) => {
      const anomaly = {
        anomalyType: type,
        severity,
        tenantId,
        actorId,
        sessionId: event.sessionId,
        correlationId: event.correlationId,
        detectedAt: new Date().toISOString(),
        recommendedAction,
        details
      };
      
      await AnomalyDetector.saveAnomaly(anomaly);
    };

    // 1. CROSS_TENANT_ATTEMPT
    if (event.eventType === 'CROSS_TENANT_ATTEMPT' || event.eventType === 'DENY_CROSS_TENANT') {
      await triggerAnomaly(
        'CROSS_TENANT_ATTEMPT',
        'CRITICAL',
        'Revogação imediata de privilégios de tenant e bloqueio temporário de acesso.',
        { attemptedEvent: event.eventType, targetTenant: event.metadata?.targetTenantId || event.metadata?.resourceTenantId }
      );
    }

    // 2. MASSIVE_EXPORTS (5 or more exports in last 2 minutes)
    const twoMinutesAgo = new Date(now - 120000).toISOString();
    const exportTypes = ['EXPORT_REPORT', 'EXPORT_SNAPSHOT', 'EXPORT_BOARD_PACK', 'EXPORT_SIMULATION'];
    const exportEvents = await this.getEventsInWindow(actorId, exportTypes, twoMinutesAgo);
    
    if (exportEvents.length >= 5) {
      await triggerAnomaly(
        'MASSIVE_EXPORTS',
        'HIGH',
        'Bloqueio temporário de ações de exportação e notificação ao time de compliance.',
        { count: exportEvents.length, windowMs: 120000 }
      );
    }

    // 3. SUSPICIOUS_DENIED_ACCESS (3 or more denies in last 1 minute)
    const oneMinuteAgo = new Date(now - 60000).toISOString();
    const deniedEvents = await this.getDeniedEventsInWindow(actorId, oneMinuteAgo);
    
    if (deniedEvents.length >= 3) {
      await triggerAnomaly(
        'SUSPICIOUS_DENIED_ACCESS',
        'HIGH',
        'Forçar reautenticação imediata (invalidar sessão) e notificar TI.',
        { count: deniedEvents.length, windowMs: 60000 }
      );
    }

    // 4. AGGRESSIVE_TENANT_SWITCHING (5 or more switches in last 1 minute)
    const switchTypes = ['TENANT_SELECTION', 'TENANT_SWITCH'];
    const switchEvents = await this.getEventsInWindow(actorId, switchTypes, oneMinuteAgo);
    
    if (switchEvents.length >= 5) {
      await triggerAnomaly(
        'AGGRESSIVE_TENANT_SWITCHING',
        'HIGH',
        'Impor limite de taxa de troca de inquilino e suspender sessão se persistir.',
        { count: switchEvents.length, windowMs: 60000 }
      );
    }

    // 5. REPLAY_ABUSE (3 or more replays in last 5 minutes)
    const fiveMinutesAgo = new Date(now - 300000).toISOString();
    const replayEvents = await this.getEventsInWindow(actorId, ['EXECUTE_REPLAY'], fiveMinutesAgo);
    if (replayEvents.length >= 3) {
      await triggerAnomaly(
        'REPLAY_ABUSE',
        'HIGH',
        'Bloquear execuções de replay para este usuário e auditar histórico de auditoria.',
        { count: replayEvents.length, windowMs: 300000 }
      );
    }

    // 6. ADVISORY_SCRAPING (10 or more views in last 1 minute)
    const advisoryEvents = await this.getEventsInWindow(actorId, ['VIEW_EXECUTIVE_ADVISORY'], oneMinuteAgo);
    if (advisoryEvents.length >= 10) {
      await triggerAnomaly(
        'ADVISORY_SCRAPING',
        'CRITICAL',
        'Bloquear consultas de advisory temporariamente por suspeita de raspagem automatizada.',
        { count: advisoryEvents.length, windowMs: 60000 }
      );
    }
  }
}
