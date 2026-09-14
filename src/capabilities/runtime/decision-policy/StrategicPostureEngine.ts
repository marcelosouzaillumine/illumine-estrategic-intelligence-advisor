// src/core/runtime/decision-policy/StrategicPostureEngine.ts
//
// Strategic Posture Engine

import { DecisionPolicyProfile } from './policy-types';

export class StrategicPostureEngine {
  /**
   * Evaluates report runway, growth, and cash flow to determine suggested policy profile adjustments.
   */
  public static analyzePosture(report: any): {
    burnRate: number;
    runwayMonths: number;
    suggestedProfile?: DecisionPolicyProfile;
  } {
    const ocf = report?.cashFlowReport?.operational?.fco ?? report?.ocf ?? 0;
    const cash = report?.metrics?.cash ?? report?.cash ?? 10000;
    
    // Estimate runway if cash burn is active
    let burnRate = 0;
    let runwayMonths = 999;
    
    if (ocf < 0) {
      burnRate = Math.abs(ocf) / 12; // monthly burn approximation
      if (burnRate > 0) {
        runwayMonths = cash / burnRate;
      }
    }

    let suggestedProfile: DecisionPolicyProfile | undefined;

    const overallSeverity = report?.severity?.level ?? 'ESTÁVEL';
    const isErosaoActive = report?.capitalGovernanceReport?.preservation?.preservationStatus === 'EROSÃO_RELEVANTE' ||
      report?.capitalGovernanceReport?.preservation?.preservationStatus === 'FRAGILIDADE_PATRIMONIAL';

    // Turnaround indicators: critical operational status, low runway (< 12 months), or active patrimonial erosion
    if (overallSeverity === 'CRÍTICA' || runwayMonths < 12 || isErosaoActive) {
      suggestedProfile = 'TURNAROUND';
    } 
    // Hyper growth: high growth markers and sufficient runway
    else if (report?.metrics?.revenueGrowthPercentage > 30 && runwayMonths > 24) {
      suggestedProfile = 'HYPER_GROWTH';
    }

    return {
      burnRate,
      runwayMonths,
      suggestedProfile
    };
  }
}
