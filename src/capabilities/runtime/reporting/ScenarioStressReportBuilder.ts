import { ScenarioStressReport, ReportLineageMetadata } from './ReportingTypes';
import { ScenarioSimulationResult } from '../../../core/runtime/scenario/ScenarioTypes';

export class ScenarioStressReportBuilder {
  static build(
    lineage: ReportLineageMetadata,
    scenarioResult: ScenarioSimulationResult
  ): ScenarioStressReport {
    
    return {
      reportId: `STR-${crypto.randomUUID().slice(0,8).toUpperCase()}`,
      groupId: scenarioResult.groupId,
      timestamp: lineage.timestamp,
      shocksApplied: scenarioResult.shocksApplied,
      projectedConfidence: scenarioResult.projectedConfidence,
      institutionalStress: scenarioResult.institutionalStress,
      narrative: scenarioResult.narrative,
      lineage
    };
  }
}
