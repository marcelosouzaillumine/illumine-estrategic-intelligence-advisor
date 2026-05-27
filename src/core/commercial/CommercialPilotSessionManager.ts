export type PilotSessionType = 'BOARD_SESSION' | 'ADVISOR_SESSION' | 'ONBOARDING_SESSION';

export interface PilotSession {
  sessionId: string;
  tenantId: string;
  sessionType: PilotSessionType;
  actorId: string;
  startedAt: string;
  endedAt?: string;
  status: 'ACTIVE' | 'COMPLETED';
}

export interface SessionAuditTrailEntry {
  auditId: string;
  tenantId: string;
  sessionId: string;
  action: 'SESSION_START' | 'SESSION_END';
  timestamp: string;
  actorId: string;
}

export class CommercialPilotSessionManager {
  private static sessions: PilotSession[] = [];
  private static auditTrail: SessionAuditTrailEntry[] = [];

  /**
   * Clears sessions and audit trail for testing purposes.
   */
  public static clearForTest(): void {
    this.sessions = [];
    this.auditTrail = [];
  }

  /**
   * Starts a new pilot session.
   */
  public static startSession(
    tenantId: string,
    sessionType: PilotSessionType,
    actorId: string
  ): PilotSession {
    if (!tenantId || tenantId.trim() === '') {
      throw new Error('[Session Manager] tenantId obrigatório.');
    }
    if (!actorId || actorId.trim() === '') {
      throw new Error('[Session Manager] actorId obrigatório.');
    }
    if (!sessionType) {
      throw new Error('[Session Manager] sessionType obrigatório.');
    }

    const sessionId = `SESS-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const session: PilotSession = {
      sessionId,
      tenantId,
      sessionType,
      actorId,
      startedAt: new Date().toISOString(),
      status: 'ACTIVE'
    };

    this.sessions.push(session);

    // Write to audit trail
    this.auditTrail.push({
      auditId: `AUD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      tenantId,
      sessionId,
      action: 'SESSION_START',
      timestamp: new Date().toISOString(),
      actorId
    });

    return session;
  }

  /**
   * Ends an active session.
   */
  public static endSession(sessionId: string, tenantId: string): PilotSession {
    if (!sessionId) {
      throw new Error('[Session Manager] sessionId obrigatório para encerrar.');
    }
    if (!tenantId) {
      throw new Error('[Session Manager] tenantId obrigatório para encerrar.');
    }

    const session = this.sessions.find(s => s.sessionId === sessionId && s.tenantId === tenantId);
    if (!session) {
      throw new Error('[Session Manager] Sessão não encontrada ou não pertence ao tenant informado.');
    }

    if (session.status === 'COMPLETED') {
      return session;
    }

    session.status = 'COMPLETED';
    session.endedAt = new Date().toISOString();

    // Write to audit trail
    this.auditTrail.push({
      auditId: `AUD-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      tenantId,
      sessionId,
      action: 'SESSION_END',
      timestamp: new Date().toISOString(),
      actorId: session.actorId
    });

    return session;
  }

  /**
   * Retrieves active sessions for a specific tenant.
   */
  public static getActiveSessions(tenantId: string): PilotSession[] {
    if (!tenantId) return [];
    return this.sessions.filter(s => s.tenantId === tenantId && s.status === 'ACTIVE');
  }

  /**
   * Retrieves completed sessions for a specific tenant.
   */
  public static getCompletedSessions(tenantId: string): PilotSession[] {
    if (!tenantId) return [];
    return this.sessions.filter(s => s.tenantId === tenantId && s.status === 'COMPLETED');
  }

  /**
   * Retrieves all sessions for a specific tenant.
   */
  public static getAllSessions(tenantId: string): PilotSession[] {
    if (!tenantId) return [];
    return this.sessions.filter(s => s.tenantId === tenantId);
  }

  /**
   * Retrieves the immutable audit trail for a specific tenant.
   */
  public static getAuditTrail(tenantId: string): SessionAuditTrailEntry[] {
    if (!tenantId) return [];
    return this.auditTrail.filter(a => a.tenantId === tenantId);
  }
}
