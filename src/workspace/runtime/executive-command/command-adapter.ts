// src/core/runtime/executive-command/command-adapter.ts

import { ExecutiveIntelligenceReport } from '../../core/runtime/executive-intelligence-runtime';

/**
 * Extrates the necessary context from the consolidated EFOS report
 * so the Executive Command engines can evaluate directives, drift, and alignment.
 */
export interface CommandEvaluationContext {
  activeSurvivalMode: string;
  treasuryProtectionLevel: string;
  fundingFragility: string;
  operatingPressureSeverity: string;
  blockedInstitutionalActions: string[];
  historicalCyclesCount: number;
  tenantId: string;
  lineageHash: string;
  fcoGrowth: number;
  revenueGrowth: number;
}

export class CommandAdapter {
  static extractContext(report: ExecutiveIntelligenceReport): CommandEvaluationContext {
    
    // Continuity & Survival
    const survivalReport = (report as any).survivalReport || {};
    const activeSurvivalMode = survivalReport.activeSurvivalMode || 'NORMAL';
    const blockedInstitutionalActions = survivalReport.blockedActions || survivalReport.forbiddenInstitutionalPriorities || [];
    
    // Capital Governance & Treasury
    const capitalGov = report.capitalGovernanceReport?.fiduciaryOutput || (report as any).fiduciaryOutput || {};
    const treasuryProtectionLevel = capitalGov.treasuryProtectionLevel || 'STRONG_CAPITAL_PROTECTION';

    // Pressure & Funding
    const pressure = report.operatingPressureReport || {};
    const operatingPressureSeverity = (pressure as any).overallPressureLevel || 'STABLE';
    
    // Instead of financialReport, use capitalStructure for funding fragility
    const fundingFragility = report.capitalStructure?.rolloverRisk || 'LOW';

    // Extract rudimentary growth metrics to detect drift
    const fcoGrowth = report.metrics?.scaleEfficiency?.ebitdaGrowth || 0;
    const revenueGrowth = report.metrics?.scaleEfficiency?.recGrowth || 0;

    const metadata = (report as any).metadata || {};
    const historicalCyclesCount = metadata.historicalCyclesCount || 0;
    const lineageHash = metadata.lineageHash || 'any-hash';

    return {
      activeSurvivalMode,
      treasuryProtectionLevel,
      fundingFragility,
      operatingPressureSeverity,
      blockedInstitutionalActions,
      historicalCyclesCount,
      tenantId: 'tenant-placeholder', // In a real scenario, this comes from context
      lineageHash,
      fcoGrowth,
      revenueGrowth
    };
  }
}
