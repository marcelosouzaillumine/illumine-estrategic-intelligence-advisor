// src/core/runtime/war-gaming/TreasuryWarRoomEngine.ts

import { TreasurySurvivalProfile, CrisisPropagationNode } from './war-gaming-types';

export class TreasuryWarRoomEngine {
  public static mapSurvival(
    initialCash: number,
    simulatedMonthlyCashFlow: number,
    covenantThresholds: { minEbitda: number; minCash: number },
    ebitdaSimulated: number,
    maxHorizonMonths: number = 24
  ): TreasurySurvivalProfile {
    
    let runway = maxHorizonMonths;
    let exhaustion = false;

    if (simulatedMonthlyCashFlow < 0) {
      const monthsToZero = initialCash / Math.abs(simulatedMonthlyCashFlow);
      if (monthsToZero < maxHorizonMonths) {
        runway = parseFloat(monthsToZero.toFixed(1));
        exhaustion = true;
      }
    }

    const projectedCashAtHorizon = initialCash + (simulatedMonthlyCashFlow * Math.min(runway, maxHorizonMonths));
    const covenantBreached = ebitdaSimulated < covenantThresholds.minEbitda || projectedCashAtHorizon < covenantThresholds.minCash;

    return {
      availableRunwayMonths: runway,
      exhaustionPointReached: exhaustion,
      criticalCovenantBreached: covenantBreached,
      liquidityDrainVelocity: simulatedMonthlyCashFlow,
      survivalNarrative: '' // Will be composed by WarGameNarrativeComposer
    };
  }
}
