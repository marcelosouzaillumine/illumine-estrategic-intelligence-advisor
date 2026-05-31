// src/core/runtime/strategic-intelligence/strategic-intelligence-adapter.ts

import { ExecutiveIntelligenceReport } from '../executive-intelligence-runtime';
import { StrategicEvaluationContext } from './strategic-intelligence-types';

export class StrategicIntelligenceAdapter {
  static extractContext(report: ExecutiveIntelligenceReport): StrategicEvaluationContext {
    return {
      metadata: {
        lineageHash: (report as any).metadata?.lineageHash || 'UNVERIFIED',
        tenantId: (report as any).metadata?.tenantId || 'UNKNOWN',
        cycleReference: (report as any).metadata?.cycleReference || 'UNKNOWN',
        historicalCyclesCount: (report as any).metadata?.historicalCyclesCount || 0,
      },
      capitalStructure: {
        fundingDependenceLevel: (report.capitalGovernanceReport as any)?.metrics?.fundingDependenceLevel || 'UNKNOWN',
        rolloverRisk: report.capitalStructure?.rolloverRisk || 'UNKNOWN'
      },
      metrics: {
        financialMetrics: {
          ocf: report.metrics?.financialMetrics?.ocf || 0,
          revenue: report.metrics?.financialMetrics?.receitaLiquida || report.metrics?.financialMetrics?.revenue || 0,
        },
        scaleEfficiency: {
          recGrowth: report.metrics?.scaleEfficiency?.recGrowth || null,
          ebitdaGrowth: report.metrics?.scaleEfficiency?.ebitdaGrowth || null,
        }
      },
      survivalReport: report.survivalReport ? {
        activeSurvivalMode: report.survivalReport.activeSurvivalMode
      } : undefined,
      treasuryReport: report.treasuryIntelligenceReport ? {
        directives: (report.treasuryIntelligenceReport as any).directives || [],
        stressStatus: (report.treasuryIntelligenceReport as any).stressStatus || 'UNKNOWN'
      } : undefined,
      operatingPressureReport: report.operatingPressureReport ? {
        structuralPressureSeverity: (report.operatingPressureReport as any).structuralPressureSeverity || 'UNKNOWN'
      } : undefined,
      continuityReport: report.resilienceReport ? {
        status: (report.resilienceReport as any).status || 'UNKNOWN'
      } : undefined,
      executiveCommand: report.executiveCommand ? {
        activeDirectives: report.executiveCommand.activeDirectives?.map(d => ({ category: d.category })) || []
      } : undefined,
      operationalGovernance: report.operationalGovernance ? {
        executionIntegrity: report.operationalGovernance.executionIntegrity ? {
          status: report.operationalGovernance.executionIntegrity.status
        } : undefined,
        frictions: report.operationalGovernance.frictions?.map(f => ({ nature: f.nature })) || []
      } : undefined
    };
  }
}
