import { logger } from "../../services/logging/InstitutionalLogger";
export interface AccessSwitch {
  traceId: string;
  timestamp: string;
  actorId: string;
  previousTenantId: string;
  newTenantId: string;
  isAuthorized: boolean;
  securityEventTriggered: boolean;
}

export class TenantAccessTrace {
  private static switches: AccessSwitch[] = [];

  public static traceSwitch(access: Omit<AccessSwitch, 'traceId' | 'timestamp'>): AccessSwitch {
    const fullAccess: AccessSwitch = {
      ...access,
      traceId: `switch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString()
    };
    this.switches.push(fullAccess);

    if (this.switches.length > 200) {
      this.switches.shift();
    }

    if (access.securityEventTriggered) {
      logger.warn('SECURITY WARNING: Unauthorized tenant switch attempt detected', { actorId: access.actorId, newTenantId: access.newTenantId });
    } else {
      console.log(`[TenantAccessTrace] Tenant Switch by actor ${access.actorId}: ${access.previousTenantId || 'NONE'} -> ${access.newTenantId}`);
    }

    return fullAccess;
  }

  public static getHistory(): AccessSwitch[] {
    return this.switches;
  }
}
