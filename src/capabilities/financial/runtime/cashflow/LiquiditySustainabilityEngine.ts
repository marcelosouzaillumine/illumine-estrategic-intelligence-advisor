// src/core/runtime/cashflow/LiquiditySustainabilityEngine.ts
import { LiquiditySustainabilityMetrics } from './cashflow-types';

export function calculateLiquiditySustainability(
  operatingCashFlow: number,
  capex: number
): LiquiditySustainabilityMetrics {
  
  // Free Cash Flow = OCF - CAPEX (simplified for runtime interpretation)
  const freeCashFlow = operatingCashFlow - capex;
  
  let sustainabilityScore = 0;
  let status: 'SUSTENTÁVEL' | 'VULNERÁVEL' | 'INSUSTENTÁVEL' = 'INSUSTENTÁVEL';

  if (operatingCashFlow <= 0) {
    sustainabilityScore = 0;
    status = 'INSUSTENTÁVEL';
  } else if (freeCashFlow > 0) {
    sustainabilityScore = 100;
    status = 'SUSTENTÁVEL';
  } else {
    // OCF is positive but CAPEX is higher (Free Cash Flow is negative)
    // Means the company relies on financing/equity to fund its growth/maintenance
    const capexCoverage = operatingCashFlow / capex; // e.g. 0.5 means OCF covers 50% of CAPEX
    sustainabilityScore = Math.round(capexCoverage * 100);
    status = 'VULNERÁVEL';
  }

  return {
    freeCashFlow,
    sustainabilityScore,
    status
  };
}
