import { ProductAccessEvent } from './ProductGovernanceTypes';

export class ProductAccessAuditLogger {
  private static logs: ProductAccessEvent[] = [];

  static logEvent(
    tenantId: string,
    eventType: ProductAccessEvent['eventType'],
    resourceId: string,
    details: string
  ) {
    const record: ProductAccessEvent = {
      eventId: `PROD-AUDIT-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tenantId,
      eventType,
      resourceId,
      timestamp: new Date().toISOString(),
      details
    };
    
    this.logs.push(record);
    console.log(`[ProductGovernance Audit] [${tenantId}] ${eventType} na recurso ${resourceId}: ${details}`);
  }

  static getLogs(): ProductAccessEvent[] {
    return [...this.logs].reverse(); // Recentes primeiro
  }

  static getLogsByTenant(tenantId: string): ProductAccessEvent[] {
    return this.logs.filter(log => log.tenantId === tenantId).reverse();
  }
}
