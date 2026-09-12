// src/core/runtime/strategic-simulation/LiquidityTrajectoryEngine.ts
//
// Liquidity Trajectory Engine
// Projects cash survivability runways and cash flow trajectories step-by-step.

export class LiquidityTrajectoryEngine {
  /**
   * Projects the cash runway in cycles/months for a simulated report.
   */
  public static calculateRunway(report: any): number {
    const ocf = report.cashFlowReport?.operational?.fco ?? report.ocf ?? 0;
    const fci = report.cashFlowReport?.investment?.fci ?? report.fci ?? 0;
    
    // Check if availableCash is directly in report or nested
    let availableCash = 100000;
    if (typeof report.availableCash === 'number') {
      availableCash = report.availableCash;
    } else if (typeof report.cashFlowReport?.availableCash === 'number') {
      availableCash = report.cashFlowReport.availableCash;
    } else if (typeof report.metrics?.availableCash === 'number') {
      availableCash = report.metrics.availableCash;
    }

    const burn = (ocf < 0 ? Math.abs(ocf) : 0) + (fci < 0 ? Math.abs(fci) : 0);
    const normalizedMonthlyCashBurn = burn / 12;

    if (normalizedMonthlyCashBurn <= 0) {
      return 99.0; // Padrão estável / sem queima orgânica
    }

    if (availableCash <= 0) {
      return 0.0;
    }

    return Math.round((availableCash / normalizedMonthlyCashBurn) * 10) / 10;
  }

  /**
   * Steps the liquidity and cash balance for one cycle in the simulation.
   * Modifies the report in-place for liquidity and cash balance based on category.
   */
  public static stepLiquidity(
    report: any,
    category: string,
    cycleIndex: number
  ): void {
    // Determine the base available cash
    let availableCash = 100000;
    if (typeof report.availableCash === 'number') {
      availableCash = report.availableCash;
    } else if (typeof report.cashFlowReport?.availableCash === 'number') {
      availableCash = report.cashFlowReport.availableCash;
    } else if (typeof report.metrics?.availableCash === 'number') {
      availableCash = report.metrics.availableCash;
    }

    let ocf = report.cashFlowReport?.operational?.fco ?? report.ocf ?? 10000;

    // Apply category effects on Cash Flow & Cash Balance
    switch (category) {
      case 'Conservative Preservation':
        // Positive boost or stabilization
        if (ocf < 0) {
          ocf = Math.round(ocf * 0.85); // reduce burn rate by 15%
        } else {
          ocf = Math.round(ocf * 1.05); // grow positive cash flow by 5%
        }
        availableCash += Math.round(ocf / 12);
        break;

      case 'Controlled Growth':
        // Stable or modest growth
        ocf = Math.round(ocf * 1.03); // modest growth
        availableCash += Math.round(ocf / 12);
        break;

      case 'Survival Stabilization':
        // Drastic recovery of liquidity (cut burn rate, no growth but preserve cash)
        if (ocf < 0) {
          ocf = Math.round(ocf * 0.50); // cut burn rate in half
        } else {
          ocf = Math.round(ocf * 1.10); // improve positive cash flow by 10%
        }
        availableCash += Math.round(ocf / 12);
        break;

      case 'Aggressive Expansion':
        // High cash burn
        if (ocf > 0) {
          ocf = Math.round(ocf - 15000); // subtract a flat burn rate
        } else {
          ocf = Math.round(ocf * 1.30); // increase negative cash burn by 30%
        }
        availableCash += Math.round(ocf / 12);
        break;

      case 'Debt-Financed Growth':
        // Debt injection in cycle 1, then ocf impact
        if (cycleIndex === 1) {
          availableCash += 50000; // debt funding injection
        }
        ocf = Math.round(ocf - 5000);
        availableCash += Math.round(ocf / 12);
        break;

      default:
        // Default minor adjustments
        availableCash += Math.round(ocf / 12);
        break;
    }

    // Set updated values back
    if (typeof report.availableCash === 'number') {
      report.availableCash = availableCash;
    }
    if (typeof report.cashFlowReport?.availableCash === 'number') {
      report.cashFlowReport.availableCash = availableCash;
    }
    if (typeof report.metrics?.availableCash === 'number') {
      report.metrics.availableCash = availableCash;
    }

    if (report.cashFlowReport?.operational) {
      if (typeof report.cashFlowReport.operational.fco === 'number') {
        report.cashFlowReport.operational.fco = ocf;
      }
    }
    if (typeof report.ocf === 'number') {
      report.ocf = ocf;
    }
  }
}
