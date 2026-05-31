// src/core/runtime/operational-governance/operational-governance-adapter.ts

import { ExecutiveIntelligenceReport } from '../executive-intelligence-runtime';

/**
 * Extrates the necessary context from the consolidated EFOS report
 * so the Operational Governance engines can evaluate execution integrity.
 */
export interface OperationalEvaluationContext {
  activeSurvivalMode: string;
  treasuryProtectionLevel: string;
  fundingFragility: string;
  operatingPressureSeverity: string;
  historicalCyclesCount: number;
  tenantId: string;
  lineageHash: string;
  fcoGrowth: number;
  revenueGrowth: number;
  activeExecutiveDirectives: string[]; // List of categories active
  ocf: number; // Operating Cash Flow
  revenue: number;
}

export class OperationalGovernanceAdapter {
  static extractContext(report: ExecutiveIntelligenceReport): OperationalEvaluationContext {
    
    // Continuity & Survival
    const survivalReport = (report as any).survivalReport || {};
    const activeSurvivalMode = survivalReport.activeSurvivalMode || 'NORMAL';
    
    // Capital Governance & Treasury
    const capitalGov = report.capitalGovernanceReport?.fiduciaryOutput || (report as any).fiduciaryOutput || {};
    const treasuryProtectionLevel = capitalGov.treasuryProtectionLevel || 'STRONG_CAPITAL_PROTECTION';

    // Pressure & Funding
    const pressure = report.operatingPressureReport || {};
    const operatingPressureSeverity = (pressure as any).overallPressureLevel || 'STABLE';
    
    const fundingFragility = report.capitalStructure?.rolloverRisk || 'LOW';

    // Growth
    const fcoGrowth = report.metrics?.scaleEfficiency?.ebitdaGrowth || 0;
    const revenueGrowth = report.metrics?.scaleEfficiency?.recGrowth || 0;

    // Base values
    const ocf = report.metrics?.financialMetrics?.ocf || 0;
    const revenue = report.metrics?.financialMetrics?.revenue || 0;

    // Executive Command Directives
    const activeExecutiveDirectives = report.executiveCommand?.activeDirectives?.map(d => d.category) || [];

    const metadata = (report as any).metadata || {};
    const historicalCyclesCount = metadata.historicalCyclesCount || 0;
    const lineageHash = metadata.lineageHash || 'unknown-hash';

    return {
      activeSurvivalMode,
      treasuryProtectionLevel,
      fundingFragility,
      operatingPressureSeverity,
      historicalCyclesCount,
      tenantId: 'tenant-placeholder', // In a real scenario, this comes from context
      lineageHash,
      fcoGrowth,
      revenueGrowth,
      activeExecutiveDirectives,
      ocf,
      revenue
    };
  }
}
