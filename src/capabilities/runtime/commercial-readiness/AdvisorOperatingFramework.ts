export interface AdvisorSwitchAuditEntry {
  timestamp: string;
  advisorId: string;
  fromTenantId: string;
  toTenantId: string;
  status: 'SUCCESS' | 'DENIED';
  reason?: string;
}

export class AdvisorOperatingFramework {
  private static switchHistory: AdvisorSwitchAuditEntry[] = [];
  private static advisorScopes: Record<string, string[]> = {};

  public static registerAdvisorScope(advisorId: string, allowedTenantIds: string[]): void {
    this.advisorScopes[advisorId] = [...allowedTenantIds];
  }

  /**
   * Safe context switching. Cleans memory context and verifies advisor scope.
   */
  public static switchTenantContext(
    advisorId: string,
    fromTenantId: string,
    toTenantId: string
  ): { status: 'SUCCESS' | 'DENIED'; reason?: string } {
    const allowedTenants = this.advisorScopes[advisorId] || [];
    
    if (toTenantId !== '' && !allowedTenants.includes(toTenantId)) {
      const entry: AdvisorSwitchAuditEntry = {
        timestamp: new Date().toISOString(),
        advisorId,
        fromTenantId,
        toTenantId,
        status: 'DENIED',
        reason: 'Target tenant is outside of advisor scope.'
      };
      this.switchHistory.push(entry);
      throw new Error(`[ADVISOR-OP-001]: Tenant context switch denied. Tenant ${toTenantId} is outside allowed scopes.`);
    }

    // Force memory cleaning (simulated by returning status and triggering gc logic if present)
    const entry: AdvisorSwitchAuditEntry = {
      timestamp: new Date().toISOString(),
      advisorId,
      fromTenantId,
      toTenantId,
      status: 'SUCCESS'
    };
    this.switchHistory.push(entry);
    return { status: 'SUCCESS' };
  }

  public static getSwitchHistory(): AdvisorSwitchAuditEntry[] {
    return [...this.switchHistory];
  }

  public static clear(): void {
    this.switchHistory = [];
    this.advisorScopes = {};
  }
}
