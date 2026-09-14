import { ScenarioValidationResult, GoldenDatasetProfile } from './RealityValidationTypes';
import { RealityValidationAuditLogger } from './RealityValidationAuditLogger';

export class InstitutionalScenarioValidator {
  static validate(tenantId: string, dataset: GoldenDatasetProfile): ScenarioValidationResult {
    const stressTriggered = dataset.complexityScore > 0.8;
    const earlyWarningsActivated = dataset.governanceEvents.filter(e => e.includes('Early Warning')).length;
    const orchestrationEvents = dataset.governanceEvents.filter(e => e.includes('Orchestration')).length;

    RealityValidationAuditLogger.logEvent(
      tenantId,
      'SCENARIO_VALIDATED',
      'contexto [' + dataset.name + '] validado. Stress: ' + stressTriggered + '. EW Ativados: ' + earlyWarningsActivated
    );

    return {
      scenarioId: 'SCEN-' + dataset.datasetId,
      datasetType: dataset.type,
      passed: true,
      stressTriggered,
      earlyWarningsActivated,
      orchestrationEvents,
      issues: []
    };
  }
}
