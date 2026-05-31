// src/core/runtime/strategic-intelligence/StrategicContradictionEngine.ts

import { StrategicEvaluationContext, StrategicContradiction, StrategicPosture } from './strategic-intelligence-types';

export class StrategicContradictionEngine {
  static evaluate(context: StrategicEvaluationContext, posture: StrategicPosture): StrategicContradiction[] {
    
    const contradictions: StrategicContradiction[] = [];

    if (context.metadata.historicalCyclesCount < 2) {
      return contradictions;
    }

    const hasSurvivalMode = context.survivalReport?.activeSurvivalMode === 'SURVIVAL_MODE';
    const isExpanding = (context.metrics.scaleEfficiency.recGrowth && context.metrics.scaleEfficiency.recGrowth > 0.05) || false;
    const hasHighFundingDependence = context.capitalStructure.fundingDependenceLevel === 'HIGH' || context.capitalStructure.fundingDependenceLevel === 'CRITICAL';
    const treasuryStress = context.treasuryReport?.stressStatus === 'STRESSED' || context.treasuryReport?.stressStatus === 'CRITICAL';

    // 1. Expansão sob Survival Mode
    if (isExpanding && hasSurvivalMode) {
      contradictions.push({
        id: `SC-SURVIVAL-EXP-${context.metadata.cycleReference}`,
        type: 'CONTINUITY_STRATEGY_TENSION',
        description: 'Observed expansion vector while Continuity / Survival constraints are active.',
        severity: 'CRITICAL',
        involvedEngines: ['StrategicPostureEngine', 'InstitutionalSurvivalHierarchyEngine']
      });
    }

    // 2. Crescimento sem Funding Sustentável
    if (isExpanding && hasHighFundingDependence && context.metrics.financialMetrics.ocf < 0) {
      contradictions.push({
        id: `SC-FUNDING-EXP-${context.metadata.cycleReference}`,
        type: 'STRUCTURAL_DIRECTIONAL_INCONSISTENCY',
        description: 'Directional divergence: expanding scale with negative operating cash flow and high funding dependence.',
        severity: 'WARNING',
        involvedEngines: ['InstitutionalVectorEngine', 'CapitalGovernanceEngine']
      });
    }

    // 3. Distribuição / Desembolso sob Treasury Stress
    // (Pode ser estendido observando os directives do executiveCommand)
    const hasDistributionDirective = context.executiveCommand?.activeDirectives?.some(d => d.category.includes('DISTRIBUTION'));
    if (hasDistributionDirective && treasuryStress) {
      contradictions.push({
        id: `SC-TREASURY-DIST-${context.metadata.cycleReference}`,
        type: 'DIRECTIONAL_DIVERGENCE',
        description: 'Observed strategic contradiction: capital distribution signals during active treasury stress.',
        severity: 'CRITICAL',
        involvedEngines: ['TreasuryIntelligenceRuntime', 'ExecutiveCommandRuntime']
      });
    }

    return contradictions;
  }
}
