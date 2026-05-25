import { MonitoringAlert, GovernanceEscalation } from './MonitoringTypes';
import { AlertPolicyResolver } from './AlertPolicyResolver';

export class GovernanceEscalationEngine {
  /**
   * Escala automaticamente um alerta se ele não for resolvido dentro da política.
   */
  static escalateAlert(alert: MonitoringAlert): GovernanceEscalation | null {
    if (alert.status !== 'ACTIVE') return null;

    const newSeverity = AlertPolicyResolver.shouldEscalate(alert.severity);
    if (newSeverity === alert.severity) return null;

    return {
      escalationId: `ESC-${Date.now()}`,
      alertId: alert.alertId,
      previousSeverity: alert.severity,
      newSeverity,
      reason: 'Tempo limite de resolução expirado (SLA Governance Breach).',
      timestamp: new Date().toISOString()
    };
  }
}
