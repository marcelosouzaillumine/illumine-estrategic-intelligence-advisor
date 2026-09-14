export interface NavigationAuditEntry {
  boardSessionId: string;
  tenantScope: string;
  actorScope: string;
  step: string;
  timestamp: string;
  evidenceReference?: string;
}

export type BoardDisclosureState = 'ACKNOWLEDGED' | 'PENDING' | 'BLOCKED';

export interface ExecutiveSessionContextState {
  boardSessionId: string;
  actorScope: string;
  tenantScope: string;
  navigationAudit: NavigationAuditEntry[];
  presentationMode: 'BOARD' | 'C_LEVEL' | 'STAKEHOLDER';
  disclosureState: BoardDisclosureState;
}

export class ExecutiveSessionContext {
  private static sessions = new Map<string, ExecutiveSessionContextState>();

  static createSession(tenantScope: string, actorScope: string, presentationMode: 'BOARD' | 'C_LEVEL' | 'STAKEHOLDER'): string {
    const sessionId = `BOARD-SESS-${Date.now()}`;
    this.sessions.set(sessionId, {
      boardSessionId: sessionId,
      actorScope,
      tenantScope,
      navigationAudit: [],
      presentationMode,
      disclosureState: 'PENDING'
    });
    return sessionId;
  }

  static getSession(sessionId: string): ExecutiveSessionContextState {
    const session = this.sessions.get(sessionId);
    if (!session) throw new Error('SESSION_NOT_FOUND');
    return session;
  }

  static appendAudit(sessionId: string, step: string, evidenceReference?: string) {
    const session = this.getSession(sessionId);
    session.navigationAudit.push({
      boardSessionId: sessionId,
      tenantScope: session.tenantScope,
      actorScope: session.actorScope,
      step,
      timestamp: new Date().toISOString(),
      evidenceReference
    });
  }

  static acknowledgeDisclosure(sessionId: string) {
    const session = this.getSession(sessionId);
    session.disclosureState = 'ACKNOWLEDGED';
  }
}
