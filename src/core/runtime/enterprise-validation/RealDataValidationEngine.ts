import { EnterpriseValidationAuditLogger } from './EnterpriseValidationAuditLogger';
import { ProductionReadinessEvaluator } from './ProductionReadinessEvaluator';
import { RealWorldScenarioValidator } from './RealWorldScenarioValidator';
import { InstitutionalDataHealthEngine } from './InstitutionalDataHealthEngine';
import { RuntimeIntegrityValidator } from './RuntimeIntegrityValidator';

export class RealDataValidationEngine {
  private static validationStates: Map<string, any> = new Map();

  static initializeValidation(tenantId: string) {
    EnterpriseValidationAuditLogger.logEvent(tenantId, 'VALIDATION_STARTED', 'Iniciando validação Enterprise com Golden Datasets.');

    const integrity = RuntimeIntegrityValidator.validate(tenantId);
    EnterpriseValidationAuditLogger.logEvent(tenantId, 'RUNTIME_INTEGRITY_CHECKED', `Integridade: \${integrity.status}`);

    const health = InstitutionalDataHealthEngine.measureHealth(tenantId);
    const scenarios = RealWorldScenarioValidator.validateScenarios(tenantId);
    const readiness = ProductionReadinessEvaluator.evaluate(tenantId);

    const state = {
      tenantId,
      integrity,
      health,
      scenarios,
      readiness,
      timestamp: new Date().toISOString()
    };

    this.validationStates.set(tenantId, state);
    return state;
  }

  static getValidationState(tenantId: string) {
    return this.validationStates.get(tenantId) || null;
  }

  static clearSandbox(tenantId: string) {
    this.validationStates.delete(tenantId);
    EnterpriseValidationAuditLogger.clear(tenantId);
  }
}
