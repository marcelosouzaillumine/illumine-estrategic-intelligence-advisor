// src/core/runtime/strategic-simulation/ScenarioStressEngine.ts
//
// Scenario Stress Engine
// Applies external financial stress based on the selected StressProfile at simulation cycle 3.

import { StressProfile } from './simulation-types';

export class ScenarioStressEngine {
  /**
   * Applies the selected stress profile to a simulated report context.
   * Returns a copy of the report with applied stress and details the assumptions.
   */
  public static applyStress(
    report: any,
    profile: StressProfile
  ): { stressedReport: any; assumptions: string[]; traceHash: string } {
    // Deep clone report to avoid mutations
    const stressedReport = JSON.parse(JSON.stringify(report));
    const assumptions: string[] = [];

    let ocfFactor = 1.0;
    let marginFactor = 1.0;
    let financialScoreReduction = 0;
    let operationalScoreReduction = 0;

    switch (profile) {
      case 'MODERATE':
        ocfFactor = 0.85; // -15%
        marginFactor = 0.90; // -10% margin compression
        financialScoreReduction = 10;
        operationalScoreReduction = 5;
        assumptions.push('MODERATE STRESS: Operating Cash Flow reduced by 15%, margin compressed by 10%.');
        break;
      case 'SEVERE':
        ocfFactor = 0.75; // -25%
        marginFactor = 0.80; // -20% margin compression
        financialScoreReduction = 20;
        operationalScoreReduction = 10;
        assumptions.push('SEVERE STRESS (Default): Operating Cash Flow reduced by 25%, margin compressed by 20%.');
        break;
      case 'EXTREME':
        ocfFactor = 0.60; // -40%
        marginFactor = 0.70; // -30% margin compression
        financialScoreReduction = 35;
        operationalScoreReduction = 20;
        assumptions.push('EXTREME STRESS: Operating Cash Flow reduced by 40%, margin compressed by 30%.');
        break;
    }

    // Apply OCF reduction
    if (stressedReport.cashFlowReport?.operational) {
      if (typeof stressedReport.cashFlowReport.operational.fco === 'number') {
        stressedReport.cashFlowReport.operational.fco = Math.round(
          stressedReport.cashFlowReport.operational.fco * ocfFactor
        );
      }
    }
    if (typeof stressedReport.ocf === 'number') {
      stressedReport.ocf = Math.round(stressedReport.ocf * ocfFactor);
    }

    // Apply Net Margin compression
    if (stressedReport.metrics) {
      if (typeof stressedReport.metrics.netMargin === 'number') {
        stressedReport.metrics.netMargin = Math.round(
          stressedReport.metrics.netMargin * marginFactor * 100
        ) / 100;
      }
      if (typeof stressedReport.metrics.margin === 'number') {
        stressedReport.metrics.margin = Math.round(
          stressedReport.metrics.margin * marginFactor * 100
        ) / 100;
      }
    }
    if (typeof stressedReport.margin === 'number') {
      stressedReport.margin = Math.round(stressedReport.margin * marginFactor * 100) / 100;
    }

    // Apply score reductions
    if (stressedReport.scores) {
      if (typeof stressedReport.scores.financial === 'number') {
        stressedReport.scores.financial = Math.max(0, stressedReport.scores.financial - financialScoreReduction);
      }
      if (typeof stressedReport.scores.operational === 'number') {
        stressedReport.scores.operational = Math.max(0, stressedReport.scores.operational - operationalScoreReduction);
      }
    }

    // Generate unique trace hash based on parameters and state
    const traceString = `${profile}_${ocfFactor}_${marginFactor}_${financialScoreReduction}_${operationalScoreReduction}_${JSON.stringify(assumptions)}`;
    const traceHash = this.generateHash(traceString);

    return {
      stressedReport,
      assumptions,
      traceHash
    };
  }

  /**
   * Generates a deterministic hash string for traceability.
   */
  public static generateHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const chr = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return 'stress_trace_' + Math.abs(hash).toString(16).padStart(8, '0');
  }
}
