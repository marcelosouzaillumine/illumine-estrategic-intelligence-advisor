// src/core/runtime/institutional-reporting/engines/ExecutiveSnapshotEngine.ts

import { ExecutiveIntelligenceReport } from '../../executive-intelligence-runtime';
import { ExecutiveSnapshotSection } from '../institutional-reporting-types';
import { ExecutiveReportNarrativeOrchestrator } from '../ExecutiveReportNarrativeOrchestrator';

export class ExecutiveSnapshotEngine {
  
  public static generate(report: ExecutiveIntelligenceReport): ExecutiveSnapshotSection {
    
    const strategic = report.strategicIntelligence!;
    const governance = report.operationalGovernance!;
    const treasury = report.treasuryIntelligenceReport;
    const hasSurvivalMode = report.survivalReport?.activeSurvivalMode === 'SURVIVAL_MODE';

    const executiveSummary = ExecutiveReportNarrativeOrchestrator.generateExecutiveSummary({
      strategic,
      governance,
      treasury,
      hasSurvivalMode
    });

    const unifiedThesisStatement = strategic.thesis.unifiedThesisStatement;
    const structuralPressureLevel = report.operatingPressureReport?.overallPressureLevel || 'UNKNOWN';

    // Calcula restrições fiduciárias
    let restrictionsCount = 0;
    if (strategic.posture === 'UNVERIFIABLE_POSTURE') restrictionsCount++;
    if (hasSurvivalMode) restrictionsCount++;
    if (governance.executionIntegrity.status === 'EXECUTION_UNDER_STRAIN') restrictionsCount++;
    if (treasury?.severity === 'CRITICAL') restrictionsCount++;

    return {
      executiveSummary,
      unifiedThesisStatement,
      activeSurvivalMode: hasSurvivalMode,
      structuralPressureLevel,
      fiduciaryRestrictionsActive: restrictionsCount
    };
  }

}
