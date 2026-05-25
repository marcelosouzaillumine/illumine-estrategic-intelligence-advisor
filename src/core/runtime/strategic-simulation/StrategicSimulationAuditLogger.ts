export type StrategicSimulationAuditEvent = 
  | 'STRATEGIC_SIMULATION_STARTED'
  | 'DECISION_IMPACT_PROJECTED'
  | 'SYSTEMIC_PROPAGATION_DETECTED'
  | 'TRADEOFF_ANALYZED'
  | 'STRATEGIC_STRESS_CASCADE_TRIGGERED'
  | 'MULTI_SCENARIO_COMPARISON_EXECUTED'
  | 'SIMULATION_BLOCKED';

export interface StrategicSimulationAuditRecord {
  auditId: string;
  tenantId: string;
  eventType: StrategicSimulationAuditEvent;
  details: string;
  timestamp: string;
}

export class StrategicSimulationAuditLogger {
  private static logs: StrategicSimulationAuditRecord[] = [];

  static logEvent(
    tenantId: string,
    eventType: StrategicSimulationAuditEvent,
    details: string
  ): void {
    const record: StrategicSimulationAuditRecord = {
      auditId: 'STRAT-AUDIT-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      tenantId,
      eventType,
      details,
      timestamp: new Date().toISOString()
    };

    this.logs.push(record);
    console.log('[Strategic Simulation Audit] [' + tenantId + '] ' + eventType + ': ' + details);
  }

  static getLogs(tenantId: string): StrategicSimulationAuditRecord[] {
    return this.logs.filter(l => l.tenantId === tenantId).reverse();
  }

  static clear(tenantId: string): void {
    this.logs = this.logs.filter(l => l.tenantId !== tenantId);
  }
}
