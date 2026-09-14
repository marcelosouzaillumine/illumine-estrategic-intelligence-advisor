// src/core/runtime/decision-intelligence/GovernanceTrajectoryEngine.ts
//
// Institutional Governance Trajectory Engine
// Ref: docs/implementation_plan.md

import { ExecutiveDecision } from './decision-types';

export class GovernanceTrajectoryEngine {
  /**
   * Evaluates the historical decision quality and flags recurring patterns of stress.
   */
  public static analyzeTrajectory(
    historicalDecisions: ExecutiveDecision[],
    currentGovernanceScore: number
  ): {
    trajectoryStatus: 'STABLE' | 'DEGRADING' | 'IMPROVING' | 'INSUFFICIENT_HISTORY';
    trajectoryNarrative: string;
    recurringStressDetected: boolean;
  } {
    if (!historicalDecisions || historicalDecisions.length < 2) {
      return {
        trajectoryStatus: 'INSUFFICIENT_HISTORY',
        trajectoryNarrative: 'Histórico de decisões registradas em ledger é insuficiente para estabelecer trajetórias fiduciárias consistentes.',
        recurringStressDetected: false
      };
    }

    // Check count of structural expansion or dividend decisions
    const dividendDecisions = historicalDecisions.filter(d => d.domains.includes('Dividend Distribution'));
    const debtDecisions = historicalDecisions.filter(d => d.domains.includes('Debt Expansion'));

    let recurringStressDetected = false;
    let trajectoryStatus: 'STABLE' | 'DEGRADING' | 'IMPROVING' = 'STABLE';
    let trajectoryNarrative = 'A trajetória de governança se mostra estável, com decisões sequenciadas sob prudência fiduciária.';

    // Rule: More than 2 dividend payouts or 2 debt expansions in short history suggests recurring structural pressure
    if (dividendDecisions.length >= 2 || debtDecisions.length >= 2) {
      recurringStressDetected = true;
      trajectoryStatus = 'DEGRADING';
      trajectoryNarrative = 'Deterioração de trajetória detectada: Recorrência de decisões de alta exposição de capital (Distribuições/Dívidas) sem consolidação prévia.';
    }

    if (currentGovernanceScore < 40) {
      trajectoryStatus = 'DEGRADING';
      trajectoryNarrative = 'Trajetória sob severo risco fiduciário. Nível crítico de governança detectado nos runtimes correntes.';
    }

    return {
      trajectoryStatus,
      trajectoryNarrative,
      recurringStressDetected
    };
  }
}
