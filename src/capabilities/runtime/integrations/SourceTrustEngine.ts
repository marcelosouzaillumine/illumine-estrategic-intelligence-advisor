import { SourceTrustLevel, ConnectorType } from './IntegrationGovernanceTypes';

export class SourceTrustEngine {
  /**
   * Avalia o risco fiduciário da fonte de dados baseada no tipo de conector.
   */
  static evaluateTrust(connectorType: ConnectorType): SourceTrustLevel {
    switch (connectorType) {
      case 'MANUAL_CSV':
      case 'MANUAL_XLSX':
        // Uploads manuais são inerentemente perigosos no nível fiduciário
        return 'LOW';
      case 'MOCK_CONNECTOR':
      case 'API_ERP':
      case 'API_BANKING':
        // APIs M2M (Machine-to-Machine) carregam menos risco humano de formatação
        return 'HIGH';
      default:
        return 'UNVERIFIED';
    }
  }
}
