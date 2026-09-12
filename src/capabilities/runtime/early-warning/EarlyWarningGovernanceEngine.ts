import { WarningSeverity, PredictiveConfidence } from './EarlyWarningTypes';
import { EarlyWarningAuditLogger } from './EarlyWarningAuditLogger';

export class EarlyWarningGovernanceEngine {
  static getSeverityThresholds(): Record<WarningSeverity, number> {
    return {
      LOW: 0.2,
      MEDIUM: 0.5,
      HIGH: 0.75,
      CRITICAL: 0.9
    };
  }

  static validateSignalCreation(tenantId: string, evidenceId?: string): boolean {
    if (!tenantId) {
      EarlyWarningAuditLogger.logEvent('UNKNOWN', 'BLOCKED_DETECTION', 'Tenant ID ausente (Cross-tenant prevention).');
      return false;
    }
    
    if (!evidenceId) {
      EarlyWarningAuditLogger.logEvent(tenantId, 'BLOCKED_DETECTION', 'Tentativa de criar Early Warning sem evidência.');
      return false;
    }

    return true;
  }

  static determinePredictiveConfidence(evidenceCount: number): PredictiveConfidence {
    if (evidenceCount >= 5) return 'HIGH';
    if (evidenceCount >= 2) return 'MEDIUM';
    return 'LOW';
  }
}
