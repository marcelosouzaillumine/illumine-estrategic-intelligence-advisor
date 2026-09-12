import { StrategicSimulationAuditLogger } from './StrategicSimulationAuditLogger';
import { StrategicSimulationInput } from './StrategicSimulationTypes';

export class StrategicSimulationGovernanceEngine {
  static validateSimulationRequest(input: StrategicSimulationInput): boolean {
    if (!input.tenantId) {
      StrategicSimulationAuditLogger.logEvent('UNKNOWN', 'SIMULATION_BLOCKED', 'Tenant ID ausente. Cross-tenant isolamento preservado.');
      return false;
    }
    
    if (!input.decision || !input.decision.evidence) {
      StrategicSimulationAuditLogger.logEvent(input.tenantId, 'SIMULATION_BLOCKED', 'Tentativa de simulação sem Evidência Fiduciária. Lineage obrigatório.');
      return false;
    }

    if (input.timeframeMonths > 120) {
      StrategicSimulationAuditLogger.logEvent(input.tenantId, 'SIMULATION_BLOCKED', 'Projeção excede limite governado de 120 meses.');
      return false;
    }

    return true;
  }
}
