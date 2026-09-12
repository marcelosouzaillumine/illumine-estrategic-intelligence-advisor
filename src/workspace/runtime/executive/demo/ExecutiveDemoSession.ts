export type DemoDisclosureState = 'PENDING' | 'ACKNOWLEDGED' | 'BLOCKED';

export interface DemoSessionState {
  sessionId: string;
  actorScope: 'CFO' | 'CONSELHO' | 'FAMILY_OFFICE' | 'ADVISOR';
  boardMode: boolean;
  presentationFlow: string[];
  disclosureState: DemoDisclosureState;
  scenarioId: string | null;
  runtimeSnapshotReference: string | null;
  evidenceIntegrityState: 'VALID' | 'INVALID' | 'UNCHECKED';
}

const sessions: Record<string, DemoSessionState> = {};

/**
 * @deprecated This class is part of the legacy Demo suite.
 * Do not use in production runtime. Scheduled for removal in HCA-003.
 */
export class ExecutiveDemoSession {
  public static createSession(
    sessionId: string,
    actorScope: 'CFO' | 'CONSELHO' | 'FAMILY_OFFICE' | 'ADVISOR',
    boardMode: boolean = true
  ): DemoSessionState {
    const session: DemoSessionState = {
      sessionId,
      actorScope,
      boardMode,
      presentationFlow: [],
      disclosureState: 'PENDING',
      scenarioId: null,
      runtimeSnapshotReference: null,
      evidenceIntegrityState: 'UNCHECKED'
    };
    sessions[sessionId] = session;
    return session;
  }

  public static getSession(sessionId: string): DemoSessionState {
    const session = sessions[sessionId];
    if (!session) {
      throw new Error(`DEMO_SESSION_NOT_FOUND: Session ID '${sessionId}' does not exist.`);
    }
    return session;
  }

  public static acknowledgeDisclosure(sessionId: string): void {
    const session = this.getSession(sessionId);
    if (session.disclosureState === 'BLOCKED') {
      throw new Error(`DEMO_SESSION_BLOCKED: Cannot acknowledge a blocked session.`);
    }
    session.disclosureState = 'ACKNOWLEDGED';
  }

  public static setBlocked(sessionId: string): void {
    const session = this.getSession(sessionId);
    session.disclosureState = 'BLOCKED';
  }

  public static loadScenario(sessionId: string, scenarioId: string, snapshotRef: string): void {
    const session = this.getSession(sessionId);
    session.scenarioId = scenarioId;
    session.runtimeSnapshotReference = snapshotRef;
    session.evidenceIntegrityState = 'VALID';
  }

  public static invalidateEvidence(sessionId: string): void {
    const session = this.getSession(sessionId);
    session.evidenceIntegrityState = 'INVALID';
  }
}
