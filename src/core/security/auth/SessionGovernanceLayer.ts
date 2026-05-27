import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { AuditEventBus } from '../audit/AuditEventBus';

export type SessionEventType = 
  | 'LOGIN'
  | 'LOGOUT'
  | 'SESSION_START'
  | 'SESSION_END'
  | 'TENANT_SELECTION'
  | 'TENANT_SWITCH'
  | 'DENIED_RESOLUTION'
  | 'CROSS_TENANT_ATTEMPT'
  | 'SESSION_TIMEOUT'
  | 'SESSION_INVALIDATED';

export class SessionGovernanceLayer {
  
  static generateSessionId(): string {
    return `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  static async emitTelemetry(
    eventType: SessionEventType, 
    sessionId: string, 
    actorId: string, 
    details: Record<string, any> = {}
  ): Promise<void> {
    try {
      // Roteia o evento de sessão para o barramento central AuditEventBus
      await AuditEventBus.emit({
        tenantId: details.selectedTenantId || details.attemptedTenantId || details.tenantId || 'GLOBAL',
        actorId,
        role: details.role || 'UNAUTHENTICATED',
        sessionId,
        eventType,
        resourceType: 'Session',
        resourceId: sessionId,
        auditSeverity: ['DENIED_RESOLUTION', 'CROSS_TENANT_ATTEMPT', 'SESSION_TIMEOUT', 'SESSION_INVALIDATED'].includes(eventType) ? 'CRITICAL' : 'INFO',
        requestSource: 'SessionGovernanceLayer',
        metadata: details
      });

      // Registro legado para compatibilidade operacional do Firebase
      await addDoc(collection(db, 'audit_session_telemetry'), {
        eventType,
        sessionId,
        actorId,
        details,
        timestamp: serverTimestamp(),
        requestSource: 'SessionGovernanceLayer'
      });
    } catch (error) {
      console.warn('[SessionGovernance] Failed to emit session telemetry:', error);
    }
  }

  static getAuthenticatedAt(): string {
    return new Date().toISOString();
  }
}
