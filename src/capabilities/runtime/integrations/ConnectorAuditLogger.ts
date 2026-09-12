import { ConnectorAuditRecord } from './IntegrationGovernanceTypes';

export class ConnectorAuditLogger {
  private static logs: ConnectorAuditRecord[] = [];

  static logEvent(
    tenantId: string,
    event: ConnectorAuditRecord['event'],
    actorId: string,
    importId?: string,
    connectorId?: string,
    details?: string
  ) {
    const record: ConnectorAuditRecord = {
      auditId: `INGESTAUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tenantId,
      event,
      actorId,
      importId,
      connectorId,
      timestamp: new Date().toISOString(),
      details
    };
    
    this.logs.push(record);
    console.log(`[ConnectorAuditLogger] ${event} - Tenant: ${tenantId}`);
  }

  static getLogsForTenant(tenantId: string): ConnectorAuditRecord[] {
    return this.logs.filter(l => l.tenantId === tenantId);
  }

  static clearMockDataForTenant(tenantId: string) {
    this.logs = this.logs.filter(l => l.tenantId !== tenantId);
  }
}
