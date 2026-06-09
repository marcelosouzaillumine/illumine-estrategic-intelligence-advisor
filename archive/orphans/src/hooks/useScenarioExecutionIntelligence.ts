import { useMemo } from 'react';
import { EFOSRuntimeAdapter } from '../services/EFOSRuntimeAdapter';

export function useScenarioExecutionIntelligence(
  valuationOutput: any,
  scenarioValuationInput: any,
  efosSnapshot: any,
  hasData: boolean,
  scenarioImpacts: any[]
) {
  return useMemo(() => {
    if (!valuationOutput || 'error' in valuationOutput || !scenarioValuationInput) return null;
    if (!efosSnapshot || !efosSnapshot.score) return { status: 'NOT_AVAILABLE' };

    // Baseline calculation context to extract growth
    const baseRevenue = hasData ? 50000000 : 0;
    const baseCapex = hasData ? 2000000 : 0;
    
    // Aggregates for incremental
    let aggregatedRevenueImpact = 0;
    let aggregatedCapexImpact = 0;
    scenarioImpacts.forEach(impact => {
      aggregatedRevenueImpact += (impact.revenueImpact || 0);
      aggregatedCapexImpact += (impact.capexImpact || 0);
    });

    const efosInput = EFOSRuntimeAdapter.adaptScenarioToEFOSInput(
      scenarioValuationInput.scenarioId,
      "Cenário Draft",
      baseRevenue,
      aggregatedRevenueImpact,
      baseCapex,
      aggregatedCapexImpact,
      valuationOutput.enterpriseValue,
      valuationOutput.valueDeltaVsBaseline
    );

    const assessment = EFOSRuntimeAdapter.calculateInstitutionalExecution({
      efosScore: efosSnapshot.score,
      projectedRevenueGrowth: efosInput.projectedRevenueGrowth,
      projectedCapexGrowth: efosInput.projectedCapexGrowth,
      projectedOperationalComplexity: efosInput.projectedOperationalComplexity
    });

    const readiness = EFOSRuntimeAdapter.calculateInstitutionalReadiness({
      efosScore: efosSnapshot.score,
      ieiScore: assessment.institutionalExecutionIndex,
      governancePressureIndex: assessment.governancePressureIndex,
      enterpriseValueDelta: valuationOutput.valueDeltaVsBaseline,
      projectedOperationalComplexity: efosInput.projectedOperationalComplexity
    });

    const roadmap = EFOSRuntimeAdapter.generateInstitutionalRoadmap({
      irg: readiness.readinessGap,
      gpi: assessment.governancePressureIndex
    });

    return { status: 'CERTIFIED', assessment, readiness, roadmap, efosScore: efosSnapshot.score };
  }, [valuationOutput, scenarioValuationInput, efosSnapshot, hasData, scenarioImpacts]);
}
