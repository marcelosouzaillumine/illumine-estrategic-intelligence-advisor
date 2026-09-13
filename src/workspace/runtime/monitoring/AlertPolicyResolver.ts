import { MonitoringSeverity } from './MonitoringTypes';

export class AlertPolicyResolver {
  /**
   * Define regras de escalonamento e cooldown para evitar 'Alert Fatigue'.
   */
  static getEscalationPolicy(ruleId: string): { escalationDelayMs: number, suppressionWindowMs: number } {
    switch (ruleId) {
      case 'CONFIDENCE_DEGRADATION':
        return { escalationDelayMs: 24 * 60 * 60 * 1000, suppressionWindowMs: 12 * 60 * 60 * 1000 };
      case 'LIQUIDITY_DETERIORATION':
        return { escalationDelayMs: 0, suppressionWindowMs: 6 * 60 * 60 * 1000 };
      case 'SYSTEMIC_RISK_ACCELERATION':
        return { escalationDelayMs: 0, suppressionWindowMs: 1 * 60 * 60 * 1000 };
      default:
        return { escalationDelayMs: 0, suppressionWindowMs: 0 };
    }
  }

  static shouldEscalate(severity: MonitoringSeverity): MonitoringSeverity {
    if (severity === 'INFO') return 'WARNING';
    if (severity === 'WARNING') return 'HIGH';
    if (severity === 'HIGH') return 'CRITICAL';
    return 'CRITICAL';
  }
}
