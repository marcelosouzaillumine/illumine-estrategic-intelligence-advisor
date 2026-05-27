export interface AttentionLog {
  tenantId: string;
  sessionId: string;
  sectionId: string;
  timeSpentSeconds: number;
  clickCount: number;
  flowAbandoned: boolean;
}

export class ExecutiveAttentionTracking {
  private static logs: AttentionLog[] = [];

  /**
   * Clears tracking logs for tests.
   */
  public static clearForTest(): void {
    this.logs = [];
  }

  /**
   * Logs attention metrics for a specific screen/section.
   * Privacy-safe: No keylog, screen recordings, biometrics, or behavioral profiling is collected.
   */
  public static logAttention(log: AttentionLog): void {
    if (!log.tenantId || log.tenantId.trim() === '') {
      throw new Error('[Attention Tracking] tenantId obrigatório.');
    }
    if (!log.sessionId || log.sessionId.trim() === '') {
      throw new Error('[Attention Tracking] sessionId obrigatório.');
    }
    if (!log.sectionId || log.sectionId.trim() === '') {
      throw new Error('[Attention Tracking] sectionId obrigatório.');
    }

    this.logs.push(log);
  }

  /**
   * Returns attention tracking data for a specific tenant.
   */
  public static getLogsForTenant(tenantId: string): AttentionLog[] {
    if (!tenantId) return [];
    return this.logs.filter(l => l.tenantId === tenantId);
  }
}
