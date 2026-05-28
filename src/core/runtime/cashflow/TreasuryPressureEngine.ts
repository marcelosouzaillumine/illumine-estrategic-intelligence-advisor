// src/core/runtime/cashflow/TreasuryPressureEngine.ts
import { TreasuryPressureMetrics } from './cashflow-types';

export function calculateTreasuryPressure(
  debtService: number,
  availableCash: number,
  operatingCashFlow: number
): TreasuryPressureMetrics {
  
  // Burn rate is calculated if OCF is negative, otherwise it's 0 (cash is being generated)
  const burnRate = operatingCashFlow < 0 ? Math.abs(operatingCashFlow) : 0;
  
  let runwayMonths = 999;
  if (burnRate > 0) {
    runwayMonths = availableCash / burnRate;
  }

  let pressureLevel: 'BAIXA' | 'MODERADA' | 'ALTA' | 'CRÍTICA' = 'BAIXA';

  if (availableCash < debtService) {
    pressureLevel = 'CRÍTICA';
  } else if (burnRate > 0 && runwayMonths < 3) {
    pressureLevel = 'CRÍTICA';
  } else if (burnRate > 0 && runwayMonths < 6) {
    pressureLevel = 'ALTA';
  } else if (debtService > operatingCashFlow && operatingCashFlow > 0) {
    pressureLevel = 'MODERADA';
  }

  return {
    debtService,
    availableCash,
    burnRate,
    runwayMonths,
    pressureLevel
  };
}
