// src/core/runtime/strategic-intelligence/strategic-intelligence-adapter.ts

import { ExecutiveIntelligenceReport } from '../../core/runtime/executive-intelligence-runtime';
import { StrategicEvaluationContext } from './strategic-intelligence-types';

export class StrategicIntelligenceAdapter {
  static extractContext(report: ExecutiveIntelligenceReport): StrategicEvaluationContext {
    const financialMetrics = report.metrics?.financialMetrics as Record<string, number> | undefined;

    return {
      metadata: {
        lineageHash: report.runtimeMetadata?.lineageHash || (report as any).metadata?.lineageHash || 'UNVERIFIED',
        tenantId: report.institutionalContext?.tenantId || (report as any).metadata?.tenantId || 'UNKNOWN',
        cycleReference: report.institutionalContext?.currentCycle || (report as any).metadata?.cycleReference || 'UNKNOWN',
        historicalCyclesCount: report.runtimeMetadata?.historicalCyclesAvailable || (report as any).metadata?.historicalCyclesCount || 0,
      },
      capitalStructure: {
        fundingDependenceLevel: (report.capitalGovernanceReport as unknown as { metrics?: { fundingDependenceLevel?: string } })?.metrics?.fundingDependenceLevel || 'UNKNOWN',
        rolloverRisk: report.capitalStructure?.rolloverRisk || 'UNKNOWN'
      },
      metrics: {
        financialMetrics: {
          ocf: Number(financialMetrics?.fco || financialMetrics?.ocf || 0),
          revenue: Number(financialMetrics?.receitaLiquida || financialMetrics?.revenue || 0),
        },
        scaleEfficiency: {
          recGrowth: report.metrics?.scaleEfficiency?.recGrowth ?? null,
          ebitdaGrowth: report.metrics?.scaleEfficiency?.ebitdaGrowth ?? null,
        }
      },
      survivalReport: report.survivalReport ? {
        activeSurvivalMode: report.survivalReport.activeSurvivalMode
      } : undefined,
      treasuryReport: report.treasuryIntelligenceReport ? {
        directives: (report.treasuryIntelligenceReport as unknown as { directives?: string[] }).directives || 
                    report.treasuryIntelligenceReport.priorityMatrix?.priorities?.map(p => p.category) || [],
        stressStatus: (report.treasuryIntelligenceReport as unknown as { stressStatus?: string }).stressStatus || 
                      report.treasuryIntelligenceReport.severity || 'UNKNOWN'
      } : undefined,
      operatingPressureReport: report.operatingPressureReport ? {
        structuralPressureSeverity: (report.operatingPressureReport as unknown as { structuralPressureSeverity?: string }).structuralPressureSeverity || 
                                    report.operatingPressureReport.overallPressureLevel || 'UNKNOWN'
      } : undefined,
      continuityReport: report.resilienceReport ? {
        status: report.resilienceReport.continuityResilienceStatus || 'UNKNOWN'
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
