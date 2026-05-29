// src/core/runtime/behavioral-intelligence/GovernanceFatigueEngine.ts
//
// Governance Fatigue Engine

import { ExecutiveDecision } from '../decision-intelligence/decision-types';
import { FatigueMetrics } from './behavioral-types';

export class GovernanceFatigueEngine {
  /**
   * Evaluates the four sub-categories of institutional fatigue using the rolling history and current report context.
   */
  public static calculateFatigue(
    history: ExecutiveDecision[],
    report: any
  ): FatigueMetrics {
    const rollingHistory = history.slice(-15);
    const ocf = report?.cashFlowReport?.operational?.fco ?? report?.ocf ?? 0;
    const ebitda = report?.metrics?.ebitda ?? report?.ebitda ?? 0;

    // 1. Operational Fatigue (Operational score pressure, ebitda stress, workforce expansions)
    let operationalFatigue = 10;
    if (report?.scores?.operational < 50) {
      operationalFatigue += 35;
    }
    if (ebitda < 0) {
      operationalFatigue += 25;
    }
    const expansionCount = rollingHistory.filter(d => d.domains.includes('Operational Expansion') || d.domains.includes('Workforce Expansion')).length;
    operationalFatigue += expansionCount * 10;
    operationalFatigue = Math.min(100, operationalFatigue);

    // 2. Governance Fatigue (Compliance score pressure, repeated compliance warnings/violations)
    let governanceFatigue = 10;
    if (report?.scores?.governance < 50) {
      governanceFatigue += 40;
    }
    // Estimate recurring governance pressure by looking at decision frequency (high decision volume under low scores)
    if (report?.scores?.governance < 60 && rollingHistory.length >= 8) {
      governanceFatigue += 30;
    }
    governanceFatigue = Math.min(100, governanceFatigue);

    // 3. Strategic Fatigue (Constant shifts of direction / motivation)
    let strategicFatigue = 10;
    let shifts = 0;
    for (let i = 1; i < rollingHistory.length; i++) {
      const prevDomains = rollingHistory[i - 1].domains;
      const currDomains = rollingHistory[i].domains;
      // Contradictory shift: Cost reduction in cycle t-1 and Operational expansion in cycle t
      if (prevDomains.includes('Cost Reduction') && (currDomains.includes('Operational Expansion') || currDomains.includes('Dividend Distribution'))) {
        shifts++;
      } else if (currDomains.includes('Cost Reduction') && (prevDomains.includes('Operational Expansion') || prevDomains.includes('Dividend Distribution'))) {
        shifts++;
      }
    }
    strategicFatigue += shifts * 25;
    strategicFatigue = Math.min(100, strategicFatigue);

    // 4. Survivability Fatigue (Emergency decisions, repeated cost reductions, composite score pressure)
    let survivabilityFatigue = 10;
    if (report?.scores?.composite < 50) {
      survivabilityFatigue += 30;
    }
    if (ocf < 0) {
      survivabilityFatigue += 20;
    }
    const costReductionCount = rollingHistory.filter(d => d.domains.includes('Cost Reduction')).length;
    survivabilityFatigue += costReductionCount * 15;
    survivabilityFatigue = Math.min(100, survivabilityFatigue);

    // Composite Fatigue
    const compositeFatigue = Math.round(
      (operationalFatigue + governanceFatigue + strategicFatigue + survivabilityFatigue) / 4
    );

    return {
      operationalFatigue,
      governanceFatigue,
      strategicFatigue,
      survivabilityFatigue,
      compositeFatigue
    };
  }
}
