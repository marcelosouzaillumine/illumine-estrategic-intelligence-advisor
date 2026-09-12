import { IOSAuditLogger } from './IOSAuditLogger';

export class IOSGovernanceEngine {
  static validateSynchronizationRequest(tenantId: string, sourceDomains: string[]): boolean {
    if (!tenantId) {
      IOSAuditLogger.logEvent('UNKNOWN', 'CROSS_DOMAIN_SYNCHRONIZATION_EXECUTED', 'Tenant ID ausente. Cross-tenant isolamento ativado.');
      return false;
    }
    
    if (sourceDomains.length === 0) {
      IOSAuditLogger.logEvent(tenantId, 'CROSS_DOMAIN_SYNCHRONIZATION_EXECUTED', 'Tentativa de sincronização sem domínios de origem.');
      return false;
    }

    return true;
  }

  static generateLineageHash(tenantId: string, sourceDomains: string[], executionId: string): string {
    const raw = tenantId + '|' + executionId + '|' + sourceDomains.join(',') + '|' + Date.now();
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      hash = ((hash << 5) - hash) + raw.charCodeAt(i);
      hash = hash & hash;
    }
    return 'IOS-LIN-' + Math.abs(hash).toString(16);
  }
}
