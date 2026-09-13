import { MonitoringAlert, MonitoringExecutionRecord } from './MonitoringTypes';

export class MonitoringAlertRegistry {
  private static alerts: MonitoringAlert[] = [];
  private static executions: MonitoringExecutionRecord[] = [];

  static persistAlert(alert: MonitoringAlert) {
    this.alerts.push(alert);
    console.log(`[MonitoringAlertRegistry] Alerta persistido: ${alert.alertId} [${alert.severity}]`);
  }

  static persistExecution(record: MonitoringExecutionRecord) {
    this.executions.push(record);
  }

  static getActiveAlerts(tenantId: string, workspaceId: string): MonitoringAlert[] {
    return this.alerts.filter(a => a.tenantId === tenantId && a.workspaceId === workspaceId && a.status === 'ACTIVE');
  }

  static getAllAlerts(): MonitoringAlert[] {
    return [...this.alerts];
  }

  static getExecutions(): MonitoringExecutionRecord[] {
    return [...this.executions];
  }

  static clearMockDataForTenant(tenantId: string) {
    this.alerts = this.alerts.filter(a => a.tenantId !== tenantId);
  }
}
