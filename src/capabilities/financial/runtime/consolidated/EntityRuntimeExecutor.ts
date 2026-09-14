import { EntityInputPayload } from './consolidated-types';
import { ExecutiveIntelligenceRuntime, ExecutiveIntelligenceReport } from '../../../../core/runtime/executive-intelligence-runtime';

export class EntityRuntimeExecutor {
  private runtime: ExecutiveIntelligenceRuntime;

  constructor() {
    this.runtime = new ExecutiveIntelligenceRuntime();
  }

  /**
   * Isola a execução de uma entidade, garantindo que o runtime legado opere
   * sem vazar contexto entre as entidades.
   */
  public execute(entityInput: EntityInputPayload): ExecutiveIntelligenceReport {
    // Calling the single-entity engine
    const report = this.runtime.generateExecutiveReport(entityInput.rawData);
    
    // Injetando lineage provenance básico
    report.entityProvenance = {
      sourceEntityId: entityInput.entityId,
      metricOrigin: 'UNIT_EXECUTION',
      originalValue: 0,
      eliminatedValue: 0,
      consolidatedValue: 0
    };
    
    return report;
  }
}
