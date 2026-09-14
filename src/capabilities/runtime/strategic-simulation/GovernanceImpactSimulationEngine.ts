// src/core/runtime/strategic-simulation/GovernanceImpactSimulationEngine.ts
//
// Governance Impact Simulation Engine
// Projects the impact of decisions on governance consistency, drift, and strategic coherence.

export class GovernanceImpactSimulationEngine {
  /**
   * Updates governance metrics in the simulated report based on the scenario category.
   */
  public static stepGovernance(
    report: any,
    category: string,
    cycleIndex: number
  ): void {
    if (!report.scores) {
      report.scores = { financial: 70, operational: 70, governance: 70, structural: 70, composite: 70 };
    }

    let govScore = report.scores.governance ?? 70;
    let structuralScore = report.scores.structural ?? 70;

    switch (category) {
      case 'Conservative Preservation':
        // High governance stability, capital preservation discipline increases
        govScore = Math.min(100, govScore + 3);
        structuralScore = Math.min(100, structuralScore + 4);
        if (report.capitalGovernanceReport?.behavior) {
          report.capitalGovernanceReport.behavior.governanceMaturity = 'MATURA';
        }
        break;

      case 'Controlled Growth':
        // Disciplined, structured growth
        govScore = Math.min(100, govScore + 1);
        structuralScore = Math.min(100, structuralScore + 1);
        break;

      case 'Survival Stabilization':
        // Emergency stabilization, risk reduction, governance stability above all
        govScore = Math.min(100, govScore + 4);
        structuralScore = Math.min(100, structuralScore + 3);
        if (report.capitalGovernanceReport?.behavior) {
          report.capitalGovernanceReport.behavior.governanceMaturity = 'ESTÁVEL';
        }
        break;

      case 'Aggressive Expansion':
        // Cost/governance pressure
        govScore = Math.max(0, govScore - 5);
        structuralScore = Math.max(0, structuralScore - 5);
        if (report.capitalGovernanceReport?.behavior) {
          report.capitalGovernanceReport.behavior.governanceMaturity = 'FRÁGIL';
        }
        break;

      case 'Debt-Financed Growth':
        // Leverage pressures structural score
        govScore = Math.max(0, govScore - 3);
        structuralScore = Math.max(0, structuralScore - 8);
        if (report.capitalGovernanceReport?.behavior) {
          report.capitalGovernanceReport.behavior.governanceMaturity = 'FRAGILIZADA';
        }
        break;

      default:
        // No change or minor drift
        govScore = Math.max(0, govScore - 1);
        break;
    }

    report.scores.governance = govScore;
    report.scores.structural = structuralScore;
  }
}
