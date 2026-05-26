import { db } from '../../../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export type SessionEventType = 
  | 'SESSION_START'
  | 'SESSION_END'
  | 'TENANT_SELECTION'
  | 'DENIED_RESOLUTION'
  | 'CROSS_TENANT_ATTEMPT';

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
      // Usando modelo híbrido: grava no Firestore para auditoria/telemetria,
      // mas não bloqueia a execução da sessão atual se falhar.
      await addDoc(collection(db, 'audit_session_telemetry'), {
        eventType,
        sessionId,
        actorId,
        details,
        timestamp: serverTimestamp(),
        requestSource: 'InstitutionalSession'
      });
    } catch (error) {
      console.warn('[SessionGovernance] Failed to emit session telemetry:', error);
      // Fail-safe: não quebrar runtime institucional se telemetry falhar (offline mode, etc)
    }
  }

  static getAuthenticatedAt(): string {
    return new Date().toISOString();
  }
}
