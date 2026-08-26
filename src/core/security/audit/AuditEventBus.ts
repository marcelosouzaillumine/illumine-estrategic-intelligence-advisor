import { getSupabaseClient } from '../../../infrastructure/supabase/SupabaseClient';
import { OfficialRole, VisibilityPolicy } from '../types';
import { ImmutableLedger } from './ImmutableLedger';
import { AnomalyDetector } from './AnomalyDetector';
import { DistributedAnomalyAggregator } from '../../runtime/distributed/DistributedAnomalyAggregator';

export interface AuditEvent {
  eventId: string;
  tenantId: string;
  actorId: string;
  role: OfficialRole | 'SYSTEM' | 'UNAUTHENTICATED';
  sessionId: string;
  eventType: string;
  resourceType: string;
  resourceId?: string;
  entityScope?: any;
  visibilityPolicy?: VisibilityPolicy;
  correlationId?: string;
  timestamp: string;
  requestSource: string;
  lineageReference?: string;
  auditSeverity: 'INFO' | 'WARNING' | 'CRITICAL';
  metadata?: Record<string, any>;
}

export const CRITICAL_EVENTS = [
  'EXPORT_REPORT',
  'EXPORT_SNAPSHOT',
  'EXPORT_BOARD_PACK',
  'CREATE_SNAPSHOT',
  'CREATE_BOARD_PACK',
  'CROSS_TENANT_ATTEMPT',
  'PERMISSION_DENIED',
  'SESSION_INVALIDATED',
  'EXECUTE_REPLAY'
];

export class AuditEventBus {
  private static maxRetries = 5;

  static async emit(eventInput: Omit<AuditEvent, 'eventId' | 'timestamp'>): Promise<void> {
    const event: AuditEvent = {
      ...eventInput,
      eventId: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
      timestamp: new Date().toISOString()
    };

    // 1. Analyze for anomalies (non-blocking)
    try {
      DistributedAnomalyAggregator.analyzeEvent(event);
      AnomalyDetector.analyze(event);
    } catch (e) {
      console.warn('[AuditEventBus] Anomaly aggregator failed:', e);
    }

    // 2. Record to Immutable Ledger if critical (non-blocking)
    if (CRITICAL_EVENTS.includes(event.eventType)) {
      try {
        await ImmutableLedger.record(event);
      } catch (e) {
        console.warn('[AuditEventBus] ImmutableLedger failed:', e);
      }
    }

    // 3. Persist asynchronously to Firestore
    this.persistWithRetry(event);
  }

  static async saveEvent(event: AuditEvent): Promise<void> {
    if (typeof process !== 'undefined' && (process.env.NODE_ENV === 'test' || process.env.NODE_TEST_CONTEXT !== undefined || process.argv.some(arg => arg.includes('test')))) {
      return;
    }
    const cleanEvent = JSON.parse(JSON.stringify(event));
    
    // Convert to RPC format
    const rpcParams = {
      p_tenant_id: cleanEvent.tenantId,
      p_company_id: cleanEvent.metadata?.company_id || null,
      p_actor_id: cleanEvent.actorId,
      p_event_type: cleanEvent.eventType,
      p_resource_type: cleanEvent.resourceType,
      p_resource_id: cleanEvent.resourceId || null,
      p_severity: cleanEvent.auditSeverity,
      p_metadata: cleanEvent.metadata || {},
      p_correlation_id: cleanEvent.correlationId || null
    };

    try {
      const supabase = getSupabaseClient();
      const { error } = await supabase.rpc('emit_application_event', rpcParams);
      if (error) {
        throw error;
      }
    } catch (e) {
      console.error('[AuditEventBus] Supabase audit write failed, storing telemetry failure', e);
      throw e;
    }
  }

  static async saveFailure(failureLog: any): Promise<void> {
    if (typeof process !== 'undefined' && (process.env.NODE_ENV === 'test' || process.env.NODE_TEST_CONTEXT !== undefined || process.argv.some(arg => arg.includes('test')))) {
      return;
    }
    const cleanLog = JSON.parse(JSON.stringify(failureLog));
    try {
      const supabase = getSupabaseClient();
      // We assume audit.telemetry_failures exists, or we write it to a generic failures log
      await supabase.from('audit.telemetry_failures').insert(cleanLog);
    } catch (e) {
      console.error('[AuditEventBus] Supabase telemetry failure write failed', e);
    }
  }

  private static async persistWithRetry(event: AuditEvent, attempt: number = 0) {
    try {
      await this.saveEvent(event);
    } catch (error) {
      console.warn(`[AuditEventBus] Failed to persist event ${event.eventType} (Attempt ${attempt + 1}/${this.maxRetries}):`, error);
      
      const isCritical = CRITICAL_EVENTS.includes(event.eventType);
      
      if (isCritical && attempt + 1 < this.maxRetries) {
        // Schedule retry with exponential backoff
        setTimeout(() => {
          this.persistWithRetry(event, attempt + 1);
        }, 1000 * (attempt + 1));
      } else if (isCritical) {
        console.error(`[AuditEventBus] CRITICAL TELEMETRY FAILURE: Discarding critical event ${event.eventType} after ${this.maxRetries} failures.`, event);
        // Attempt to record telemetry failure
        try {
          await this.saveFailure({
            failedEventId: event.eventId,
            eventType: event.eventType,
            actorId: event.actorId,
            tenantId: event.tenantId,
            discardedAt: new Date().toISOString()
          });
        } catch (e) {
          console.error('[AuditEventBus] Failed to log telemetry failure:', e);
        }
      }
    }
  }
}
