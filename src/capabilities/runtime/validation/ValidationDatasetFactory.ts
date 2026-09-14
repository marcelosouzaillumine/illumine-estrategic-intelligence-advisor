// src/core/runtime/validation/ValidationDatasetFactory.ts

import { ConsolidatedRuntimeInputExt } from '../../financial/runtime/consolidated/consolidated-types';

export type RealWorldScenario = 
  | 'HEALTHY_COMPANY'
  | 'DISTRESS_COMPANY'
  | 'ARTIFICIAL_TURNAROUND'
  | 'REAL_RECOVERY'
  | 'SAAS_MODEL'
  | 'INDUSTRIAL_MODEL'
  | 'RETAIL_MODEL'
  | 'DISTRIBUTION_MODEL'
  | 'SERVICE_MODEL'
  | 'CAPITAL_INTENSIVE'
  | 'TOXIC_GROWTH'
  | 'CAPITALIZATION_DEPENDENCY';

export class ValidationDatasetFactory {
  
  /**
   * Builds the full mock payload necessary to run the Governance Runtime
   * for a specific real-world scenario.
   */
  public static buildScenarioPayload(scenario: RealWorldScenario): ConsolidatedRuntimeInputExt {
    // In a real implementation, this would return massive payloads simulating DFC, Balance Sheet, DRE, etc.
    // Here we provide the mocked structure that the InstitutionalRuntimeEndToEnd expects.
    
    // For now, we return a base structure. The test suite will configure the specific mock modules to return
    // the semantic indicators required for each scenario.
    return {
      groupId: `SCENARIO_${scenario}`,
      consolidationScope: 'FULL',
      reportingBoundary: 'IFRS',
      entityPath: [],
    } as unknown as ConsolidatedRuntimeInputExt;
  }

  public static getScenarioExpectedOutputs(scenario: RealWorldScenario): {
    trajectory: string;
    stability: string;
    earlyWarning: string;
    isRestricted: boolean;
  } {
    switch (scenario) {
      case 'HEALTHY_COMPANY':
        return { trajectory: 'STABLE_SUSTAINABILITY', stability: 'STRUCTURALLY_STABLE', earlyWarning: 'STABLE_MONITORING', isRestricted: false };
      case 'DISTRESS_COMPANY':
        return { trajectory: 'PROGRESSIVE_DETERIORATION', stability: 'COLLAPSE_RISK', earlyWarning: 'CRITICAL_CONTINUITY_THREAT', isRestricted: true };
      case 'ARTIFICIAL_TURNAROUND':
        return { trajectory: 'ARTIFICIAL_TURNAROUND', stability: 'APPARENT_STABILITY', earlyWarning: 'EMERGING_LIQUIDITY_DEPENDENCY', isRestricted: true };
      case 'REAL_RECOVERY':
        return { trajectory: 'SUSTAINABLE_RECOVERY', stability: 'FRAGILE_STABILITY', earlyWarning: 'EARLY_STRUCTURAL_STRESS', isRestricted: false };
      case 'SAAS_MODEL':
        return { trajectory: 'STABLE_SUSTAINABILITY', stability: 'STRUCTURALLY_STABLE', earlyWarning: 'STABLE_MONITORING', isRestricted: false };
      case 'TOXIC_GROWTH':
        return { trajectory: 'PROGRESSIVE_DETERIORATION', stability: 'PRE_DISTRESS_STATE', earlyWarning: 'EMERGING_WORKING_CAPITAL_PRESSURE', isRestricted: true };
      case 'CAPITALIZATION_DEPENDENCY':
        return { trajectory: 'CHRONIC_DEPENDENCY', stability: 'APPARENT_STABILITY', earlyWarning: 'STRUCTURAL_DETERIORATION_ACCELERATION', isRestricted: true };
      default:
        return { trajectory: 'STABLE_SUSTAINABILITY', stability: 'STRUCTURALLY_STABLE', earlyWarning: 'STABLE_MONITORING', isRestricted: false };
    }
  }
}
