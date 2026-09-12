import { InstitutionalState } from './IOSTypes';
import { IOSAuditLogger } from './IOSAuditLogger';
import { IOSGovernanceEngine } from './IOSGovernanceEngine';
import { InstitutionalStateManager } from './InstitutionalStateManager';

export class InstitutionalOperatingSystem {
  private static states: Map<string, InstitutionalState> = new Map();

  static synchronize(tenantId: string): InstitutionalState | null {
    if (!IOSGovernanceEngine.validateSynchronizationRequest(tenantId, ['EARLY_WARNING', 'STRATEGIC_SIMULATION', 'GOVERNANCE_ORCHESTRATION'])) {
      return null;
    }

    IOSAuditLogger.logEvent(tenantId, 'CROSS_DOMAIN_SYNCHRONIZATION_EXECUTED', 'Iniciando sincronização da malha institucional IOS.');

    const state = InstitutionalStateManager.buildUnifiedState(tenantId);
    
    this.states.set(tenantId, state);
    
    IOSAuditLogger.logEvent(tenantId, 'IOS_STATE_UPDATED', 'Snapshot institucional sincronizado. Trace: ' + state.synchronizationTrace);
    
    return state;
  }

  static getState(tenantId: string): InstitutionalState | null {
    return this.states.get(tenantId) || null;
  }

  static clearSandbox(tenantId: string): void {
    this.states.delete(tenantId);
    IOSAuditLogger.clear(tenantId);
  }
}
