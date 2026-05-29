// src/core/runtime/behavioral-intelligence/GovernanceDriftEngine.ts
//
// Governance Drift Engine

import { ExecutiveDecision } from '../decision-intelligence/decision-types';
import { DriftSeverity } from './behavioral-types';

export class GovernanceDriftEngine {
  /**
   * Evaluates governance drift by comparing the candidate decision against a rolling window of the last 15 decisions.
   */
  public static detectDrift(
    decision: ExecutiveDecision,
    history: ExecutiveDecision[],
    report: any
  ): {
    overallSeverity: DriftSeverity;
    categories: {
      governanceDrift: DriftSeverity;
      riskAppetiteDrift: DriftSeverity;
      liquidityDisciplineDrift: DriftSeverity;
      strategicAggressivenessDrift: DriftSeverity;
      survivabilityDrift: DriftSeverity;
      executiveCoherenceDrift: DriftSeverity;
      capitalPreservationDrift: DriftSeverity;
    };
  } {
    // 1. Dual memory architecture: Operational rolling window is last 15 decisions
    const rollingHistory = history.slice(-15);

    // Initial state: all stable
    const categories = {
      governanceDrift: 'STABLE' as DriftSeverity,
      riskAppetiteDrift: 'STABLE' as DriftSeverity,
      liquidityDisciplineDrift: 'STABLE' as DriftSeverity,
      strategicAggressivenessDrift: 'STABLE' as DriftSeverity,
      survivabilityDrift: 'STABLE' as DriftSeverity,
      executiveCoherenceDrift: 'STABLE' as DriftSeverity,
      capitalPreservationDrift: 'STABLE' as DriftSeverity
    };

    if (rollingHistory.length < 3) {
      return { overallSeverity: 'STABLE', categories };
    }

    const { domains } = decision;
    const ocf = report?.cashFlowReport?.operational?.fco ?? report?.ocf ?? 0;
    const netIncome = report?.metrics?.netIncome ?? report?.netIncome ?? 0;
    const isErosionActive = report?.capitalGovernanceReport?.preservation?.preservationStatus === 'EROSÃO_RELEVANTE' ||
      report?.capitalGovernanceReport?.preservation?.preservationStatus === 'FRAGILIDADE_PATRIMONIAL';

    // Helper counts in rolling window
    const dividendCount = rollingHistory.filter(d => d.domains.includes('Dividend Distribution')).length;
    const capexCount = rollingHistory.filter(d => d.domains.includes('CAPEX')).length;
    const debtCount = rollingHistory.filter(d => d.domains.includes('Debt Expansion')).length;
    const expansionCount = rollingHistory.filter(d => d.domains.includes('Operational Expansion') || d.domains.includes('Workforce Expansion')).length;
    const costReductionCount = rollingHistory.filter(d => d.domains.includes('Cost Reduction')).length;

    // A. Governance Drift (switching between extreme cost-cutting and heavy spending)
    if ((domains.includes('Dividend Distribution') || domains.includes('Operational Expansion')) && costReductionCount >= 3) {
      categories.governanceDrift = 'MODERATE_DRIFT';
      if (dividendCount >= 2) {
        categories.governanceDrift = 'CRITICAL_DRIFT';
      }
    }

    // B. Risk Appetite Drift (increasing leverage or CAPEX when history was conservative)
    if ((domains.includes('Debt Expansion') || domains.includes('CAPEX')) && costReductionCount >= 2) {
      categories.riskAppetiteDrift = 'MINOR_DRIFT';
      if (debtCount >= 3) {
        categories.riskAppetiteDrift = 'MODERATE_DRIFT';
      }
    }

    // C. Liquidity Discipline Drift (distributing or spending cash under negative FCO)
    if ((domains.includes('Dividend Distribution') || domains.includes('CAPEX')) && ocf < 0) {
      categories.liquidityDisciplineDrift = 'MODERATE_DRIFT';
      if (dividendCount >= 2 || capexCount >= 3) {
        categories.liquidityDisciplineDrift = 'CRITICAL_DRIFT';
      }
    }

    // D. Strategic Aggressiveness Drift (repeated expansions under deteriorating trends)
    if (domains.includes('Operational Expansion') && (ocf < 0 || netIncome < 0)) {
      categories.strategicAggressivenessDrift = 'MINOR_DRIFT';
      if (expansionCount >= 3) {
        categories.strategicAggressivenessDrift = 'MODERATE_DRIFT';
      }
    }

    // E. Survivability Drift (overall deterioration of decision scores)
    if (report?.scores?.composite < 50) {
      categories.survivabilityDrift = 'MINOR_DRIFT';
      const repeatedAggressiveUnderStress = (dividendCount + capexCount + expansionCount) >= 4;
      if (repeatedAggressiveUnderStress) {
        categories.survivabilityDrift = 'CRITICAL_DRIFT';
      }
    }

    // F. Executive Coherence Drift (contradictory decisions in the same period)
    const hasOpposingDecisions = domains.includes('Cost Reduction') && (domains.includes('Dividend Distribution') || domains.includes('Operational Expansion'));
    if (hasOpposingDecisions) {
      categories.executiveCoherenceDrift = 'MODERATE_DRIFT';
    }

    // G. Capital Preservation Drift (distributing dividends under erosion/net loss)
    if (domains.includes('Dividend Distribution') && (isErosionActive || netIncome <= 0)) {
      categories.capitalPreservationDrift = 'CRITICAL_DRIFT';
      // Persistent rupture: multiple distributions under net loss or erosion
      const repeatedUnderLoss = rollingHistory.some(d => d.domains.includes('Dividend Distribution') && (isErosionActive || netIncome <= 0));
      if (repeatedUnderLoss) {
        categories.capitalPreservationDrift = 'CONSTITUTIONAL_DRIFT';
      }
    }

    // Calculate maximum drift severity across all categories
    const severityValues: Record<DriftSeverity, number> = {
      STABLE: 0,
      MINOR_DRIFT: 1,
      MODERATE_DRIFT: 2,
      CRITICAL_DRIFT: 3,
      CONSTITUTIONAL_DRIFT: 4
    };

    let overallSeverity: DriftSeverity = 'STABLE';
    let maxVal = 0;

    for (const key of Object.keys(categories) as Array<keyof typeof categories>) {
      const sev = categories[key];
      if (severityValues[sev] > maxVal) {
        maxVal = severityValues[sev];
        overallSeverity = sev;
      }
    }

    return {
      overallSeverity,
      categories
    };
  }
}
