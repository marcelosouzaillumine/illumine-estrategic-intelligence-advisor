import { MonitoringAlert, MonitoringRule } from './MonitoringTypes';
import { ConfidenceDriftDetector } from './ConfidenceDriftDetector';

export class MonitoringRuleEngine {
  private static rules: MonitoringRule[] = [
    {
      ruleId: 'CONFIDENCE_DEGRADATION',
      name: 'Confidence Degradation',
      description: 'Detects if the group confidence drops below historical baseline.',
      defaultSeverity: 'HIGH',
      evaluate: (context: any) => {
        if (!context.historicalConfidences || !context.groupId) return null;
        
        const trend = ConfidenceDriftDetector.analyzeDrift(context.historicalConfidences, context.groupId);
        if (trend && trend.driftDetected) {
          return {
            alertId: `ALERT-${Date.now()}`,
            tenantId: context.tenantId,
            workspaceId: context.workspaceId,
            groupId: context.groupId,
            ruleId: 'CONFIDENCE_DEGRADATION',
            severity: 'HIGH',
            message: `Queda de Fiduciary Confidence detectada: ${trend.previousConfidence} -> ${trend.currentConfidence}.`,
            lineage: {
              sourceContext: 'ConfidenceTimelineEngine',
              snapshotHash: context.lineageHash || 'UNKNOWN'
            },
            timestamp: new Date().toISOString(),
            status: 'ACTIVE'
          };
        }
        return null;
      }
    }
  ];

  static runRules(context: any): MonitoringAlert[] {
    const alerts: MonitoringAlert[] = [];
    for (const rule of this.rules) {
      try {
        const result = rule.evaluate(context);
        if (result) alerts.push(result);
      } catch (e) {
        console.error(`[MonitoringRuleEngine] Falha ao executar regra ${rule.ruleId}`);
      }
    }
    return alerts;
  }
}
