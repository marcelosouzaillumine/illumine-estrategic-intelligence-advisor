import { db } from '../../../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { AuditEvent } from './AuditEventBus';

export interface AnomalyLog {
  anomalyId: string;
  anomalyType: string;
  severity: 'MEDIUM' | 'HIGH' | 'CRITICAL';
  tenantId: string;
  actorId: string;
  sessionId: string;
  correlationId?: string;
  detectedAt: string;
  recommendedAction: string;
  details?: Record<string, any>;
}

export class AnomalyDetector {
  private static recentEvents: AuditEvent[] = [];
  private static activeAnomalyKeys = new Set<string>();

  static async saveAnomaly(anomaly: any): Promise<void> {
    if (typeof process !== 'undefined' && (process.env.NODE_ENV === 'test' || process.env.NODE_TEST_CONTEXT !== undefined || process.argv.some(arg => arg.includes('test')))) {
      return;
    }
    const cleanAnomaly = JSON.parse(JSON.stringify(anomaly));
    await addDoc(collection(db, 'anomalies'), {
      ...cleanAnomaly,
      serverTimestamp: new Date()
    });
  }

  static async analyze(event: AuditEvent): Promise<void> {
    // Add event to history
    this.recentEvents.push(event);
    this.pruneOldEvents();

    const now = Date.now();
    const actorId = event.actorId;
    const tenantId = event.tenantId || 'GLOBAL';

    // Helper to generate and record anomaly
    const triggerAnomaly = async (
      type: string,
      severity: 'MEDIUM' | 'HIGH' | 'CRITICAL',
      recommendedAction: string,
      details: Record<string, any>
    ) => {
      // Deduplicate anomalies for the same actor and type within the same minute to avoid alert fatigue
      const minuteKey = `${actorId}_${type}_${Math.floor(now / 60000)}`;
      if (this.activeAnomalyKeys.has(minuteKey)) return;
      this.activeAnomalyKeys.add(minuteKey);

      const anomaly: AnomalyLog = {
        anomalyId: `anom_${now}_${Math.random().toString(36).substring(2, 11)}`,
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

      try {
        await AnomalyDetector.saveAnomaly(anomaly);
        console.warn(`[AnomalyDetector] Anomaly DETECTED: ${type} for actor ${actorId}`);
      } catch (err) {
        console.error('[AnomalyDetector] Failed to persist anomaly log:', err);
      }
    };

    // 1. Rule: CROSS_TENANT_ATTEMPT
    if (event.eventType === 'CROSS_TENANT_ATTEMPT' || event.eventType === 'DENY_CROSS_TENANT') {
      await triggerAnomaly(
        'CROSS_TENANT_ATTEMPT',
        'CRITICAL',
        'Revogação imediata de privilégios de tenant e bloqueio temporário de acesso.',
        { attemptedEvent: event.eventType, targetTenant: event.metadata?.targetTenantId || event.metadata?.resourceTenantId }
      );
    }

    // 2. Rule: MASSIVE_EXPORTS (5 or more exports in 2 minutes)
    const exportEvents = this.recentEvents.filter(e =>
      e.actorId === actorId &&
      ['EXPORT_REPORT', 'EXPORT_SNAPSHOT', 'EXPORT_BOARD_PACK', 'EXPORT_SIMULATION'].includes(e.eventType)
    );
    if (exportEvents.length >= 5) {
      await triggerAnomaly(
        'MASSIVE_EXPORTS',
        'HIGH',
        'Bloqueio temporário de ações de exportação e notificação ao time de compliance.',
        { count: exportEvents.length, windowMs: 120000 }
      );
    }

    // 3. Rule: SUSPICIOUS_DENIED_ACCESS (3 or more denies in 1 minute)
    const oneMinuteAgo = now - 60 * 1000;
    const deniedEvents = this.recentEvents.filter(e =>
      e.actorId === actorId &&
      new Date(e.timestamp).getTime() > oneMinuteAgo &&
      (e.eventType === 'PERMISSION_DENIED' || e.eventType.startsWith('DENY_'))
    );
    if (deniedEvents.length >= 3) {
      await triggerAnomaly(
        'SUSPICIOUS_DENIED_ACCESS',
        'HIGH',
        'Forçar reautenticação imediata (invalidar sessão) e notificar TI.',
        { count: deniedEvents.length, windowMs: 60000 }
      );
    }

    // 4. Rule: OUT_OF_HOURS_ACCESS (Between 22:00 and 06:00 local time for sensitive actions)
    const localHour = new Date().getHours();
    const sensitiveActions = [
      'EXPORT_REPORT', 'EXPORT_SNAPSHOT', 'EXPORT_BOARD_PACK', 'CREATE_SNAPSHOT',
      'CREATE_BOARD_PACK', 'EXECUTE_REPLAY', 'CONFIGURE_POLICIES', 'VIEW_OBSERVABILITY'
    ];
    if ((localHour >= 22 || localHour < 6) && sensitiveActions.includes(event.eventType)) {
      await triggerAnomaly(
        'OUT_OF_HOURS_ACCESS',
        'MEDIUM',
        'Verificação adicional de identidade e registro em log de auditoria pendente.',
        { hour: localHour, triggeredBy: event.eventType }
      );
    }

    // 5. Rule: AGGRESSIVE_TENANT_SWITCHING (5 or more switches in 1 minute)
    const switchEvents = this.recentEvents.filter(e =>
      e.actorId === actorId &&
      new Date(e.timestamp).getTime() > oneMinuteAgo &&
      ['TENANT_SELECTION', 'TENANT_SWITCH'].includes(e.eventType)
    );
    if (switchEvents.length >= 5) {
      await triggerAnomaly(
        'AGGRESSIVE_TENANT_SWITCHING',
        'HIGH',
        'Impor limite de taxa de troca de inquilino e suspender sessão se persistir.',
        { count: switchEvents.length, windowMs: 60000 }
      );
    }
  }

  private static pruneOldEvents() {
    // Keep events from the last 2 minutes (120,000 ms)
    const boundary = Date.now() - 120000;
    this.recentEvents = this.recentEvents.filter(e =>
      new Date(e.timestamp).getTime() > boundary
    );
    
    // Prune anomaly deduplication keys older than 1 minute to avoid memory bloat
    if (this.activeAnomalyKeys.size > 200) {
      this.activeAnomalyKeys.clear();
    }
  }
}
