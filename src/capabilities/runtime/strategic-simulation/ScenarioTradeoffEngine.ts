// src/core/runtime/strategic-simulation/ScenarioTradeoffEngine.ts
//
// Scenario Tradeoff Engine
// Analyzes positive and negative deltas for each simulated path against initial baselines.

import { SimulatedPath } from './simulation-types';
import { SurvivabilityScores } from '../decision-intelligence/decision-types';

export interface PathDeltas {
  liquidityDelta: number;
  operationalDelta: number;
  governanceDelta: number;
  debtDelta: number;
  capitalPreservationDelta: number;
  strategicDelta: number;
  compositeDelta: number;
  runwayDelta: number;
  fatigueDelta: number;
}

export class ScenarioTradeoffEngine {
  /**
   * Evaluates gains/losses by comparing a simulated path's final scores against initial conditions.
   */
  public static analyzeDeltas(
    path: SimulatedPath,
    initialScores: SurvivabilityScores,
    initialRunway: number,
    initialFatigue: number
  ): PathDeltas {
    return {
      liquidityDelta: path.finalSurvivabilityScores.liquidity - initialScores.liquidity,
      operationalDelta: path.finalSurvivabilityScores.operational - initialScores.operational,
      governanceDelta: path.finalSurvivabilityScores.governance - initialScores.governance,
      debtDelta: path.finalSurvivabilityScores.debt - initialScores.debt,
      capitalPreservationDelta: path.finalSurvivabilityScores.capitalPreservation - initialScores.capitalPreservation,
      strategicDelta: path.finalSurvivabilityScores.strategic - initialScores.strategic,
      compositeDelta: path.finalSurvivabilityScores.composite - initialScores.composite,
      runwayDelta: path.liquidityRunwayCycles - initialRunway,
      fatigueDelta: path.finalFatigue.compositeFatigue - initialFatigue
    };
  }
}
