import { ScenarioConfidence, ScenarioParameter, ScenarioType } from './scenario-types';

/**
 * Motor matemático de cálculo de confiança para predições contrafactuais.
 */
export function calculateScenarioConfidence(
  scenarioType: ScenarioType,
  parameters: ScenarioParameter,
  projectionMonths: number,
  baseHistoricalLength: number
): ScenarioConfidence {
  // Base Confidence is derived from the amount of history we have to predict from
  let baseConfidenceScore = 50;
  if (baseHistoricalLength >= 3) baseConfidenceScore = 75;
  if (baseHistoricalLength >= 5) baseConfidenceScore = 90;

  // Time decay factor: -5% per month projected
  const timeDecayFactor = Math.max(0, 100 - (projectionMonths * 5)) / 100;

  // Uncertainty margin derived from shock magnitude
  let shockMagnitude = 0;
  if (parameters.revenueShock) shockMagnitude += Math.abs(1 - parameters.revenueShock);
  if (parameters.marginShock) shockMagnitude += Math.abs(1 - parameters.marginShock);
  if (parameters.opexExpansion) shockMagnitude += Math.abs(1 - parameters.opexExpansion);
  
  // High shocks (> 30% aggregate) severely increase uncertainty (reduce confidence)
  const uncertaintyPenalty = Math.min(60, shockMagnitude * 100); 
  const uncertaintyMargin = 100 - uncertaintyPenalty;

  // Volatility Weight (Mocked to neutral for now, could be dynamic per sector)
  const volatilityWeight = 1.0;

  // Historical Consistency Score (Mocked to neutral for now)
  const historicalConsistencyScore = 1.0;

  // Final Confidence Calculation
  let finalConfidence = baseConfidenceScore * timeDecayFactor * (uncertaintyMargin / 100) * volatilityWeight * historicalConsistencyScore;
  
  // Cap between 0 and 100
  finalConfidence = Math.max(0, Math.min(100, finalConfidence));

  return {
    baseConfidenceScore,
    timeDecayFactor,
    uncertaintyMargin,
    volatilityWeight,
    historicalConsistencyScore,
    finalConfidence
  };
}
