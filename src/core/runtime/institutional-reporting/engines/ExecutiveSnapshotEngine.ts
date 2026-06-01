// src/core/runtime/institutional-reporting/engines/ExecutiveSnapshotEngine.ts

import { ExecutiveIntelligenceReport } from '../../executive-intelligence-runtime';
import { ExecutiveSnapshotSection, FiduciaryRestriction } from '../institutional-reporting-types';
import { ExecutiveReportNarrativeOrchestrator } from '../ExecutiveReportNarrativeOrchestrator';

export class ExecutiveSnapshotEngine {
  
  public static generate(report: ExecutiveIntelligenceReport): ExecutiveSnapshotSection {
    
    const strategic = report.strategicIntelligence!;
    const governance = report.operationalGovernance!;
    const treasury = report.treasuryIntelligenceReport;
    const hasSurvivalMode = report.survivalReport?.activeSurvivalMode === 'SURVIVAL_MODE';

    const constitutionalStatus = report.constitutionalEvaluation?.status;

    const executiveSummary = ExecutiveReportNarrativeOrchestrator.generateExecutiveSummary({
      strategic,
      governance,
      treasury,
      hasSurvivalMode,
      constitutionalStatus
    });

    const unifiedThesisStatement = strategic.thesis.unifiedThesisStatement;
    const structuralPressureLevel = report.operatingPressureReport?.overallPressureLevel || 'UNKNOWN';

    // Calcula restrições fiduciárias
    let restrictionsCount = 0;
    if (strategic.posture === 'UNVERIFIABLE_POSTURE') restrictionsCount++;
    if (hasSurvivalMode) restrictionsCount++;
    if (governance.executionIntegrity.status === 'EXECUTION_UNDER_STRAIN') restrictionsCount++;
    if (treasury?.severity === 'CRITICAL') restrictionsCount++;

    const fiduciaryRestrictions: FiduciaryRestriction[] = [];
    const quarantineMode = restrictionsCount > 0;

    let restrictionReason = '';
    let restrictionSeverity: 'INFO' | 'WARNING' | 'HIGH' | 'CRITICAL' | 'BLOCKED' = 'INFO';

    if (quarantineMode) {
      restrictionReason = 'Quarentena Fiduciária Ativa devido a restrições operacionais';
      restrictionSeverity = 'CRITICAL';
    }

    const longitudinalOut = report.cashSustainabilityReport?.longitudinalOut;
    
    const trajectoryClassification = longitudinalOut?.trajectoryClassification || 'UNVERIFIABLE_TRAJECTORY';
    const recoveryNarrativeBlocked = longitudinalOut?.recoveryNarrativeBlocked || strategic.posture === 'UNVERIFIABLE_POSTURE';
    const longitudinalScore = report.cashSustainabilityReport?.longitudinalScore || 'NOT_AVAILABLE';
    const trajectoryConfidence = report.strategicIntelligence?.vectors?.[0]?.vectorConfidence || 'UNVERIFIABLE';

    return {
      executiveSummary,
      unifiedThesisStatement,
      activeSurvivalMode: hasSurvivalMode,
      structuralPressureLevel,
      fiduciaryRestrictionsActive: restrictionsCount,
      periodScore: report.scores.composite,
      quarantineMode,
      isRestricted: quarantineMode,
      restrictionReason,
      restrictionSeverity,
      fiduciaryRestrictions,
      evidenceTrail: [],
      recoveryNarrativeBlocked,
      trajectoryClassification,
      longitudinalTrajectory: trajectoryClassification,
      trajectoryConfidence,
      longitudinalScore,
      accountingIntegrityStatus: report.compliance?.fiduciaryEnforcement?.complianceStatus || 'VALIDATED',
      timelineIntegrityStatus: report.strategicIntelligence?.posture === 'UNVERIFIABLE_POSTURE' ? 'INSUFFICIENT_HISTORY' : 'VALIDATED'
    };
  }
}
