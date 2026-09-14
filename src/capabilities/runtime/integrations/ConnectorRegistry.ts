import { ExternalConnector, ConnectorType, SourceTrustLevel } from './IntegrationGovernanceTypes';

export class ConnectorRegistry {
  private static connectors: ExternalConnector[] = [
    {
      connectorId: 'CONN-MANUAL-CSV',
      name: 'Upload CSV Manual',
      type: 'MANUAL_CSV',
      tenantScope: ['*'], // Disponível para todos os tenants no MVP
      baseTrustLevel: 'LOW',
      isActive: true
    },
    {
      connectorId: 'CONN-MOCK-ERP',
      name: 'Integração ERP Mock',
      type: 'API_ERP',
      tenantScope: ['TENANT-HQ'],
      baseTrustLevel: 'HIGH',
      isActive: true
    }
  ];

  static getConnector(connectorId: string): ExternalConnector | undefined {
    return this.connectors.find(c => c.connectorId === connectorId);
  }

  static getActiveConnectorsForTenant(tenantId: string): ExternalConnector[] {
    return this.connectors.filter(c => c.isActive && (c.tenantScope.includes('*') || c.tenantScope.includes(tenantId)));
  }
}
