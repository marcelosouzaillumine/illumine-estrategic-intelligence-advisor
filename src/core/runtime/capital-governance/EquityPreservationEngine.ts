// src/core/runtime/capital-governance/EquityPreservationEngine.ts
import { EquityPreservationMetrics } from './capital-governance-types';

export function calculateEquityPreservation(
  startingEquity: number,
  endingEquity: number
): EquityPreservationMetrics {
  
  let equityPreservationRatio = 1;
  if (startingEquity !== 0) {
    equityPreservationRatio = endingEquity / startingEquity;
  } else if (endingEquity > 0) {
    equityPreservationRatio = 2; // Arbitrary > 1
  } else {
    equityPreservationRatio = 0;
  }

  let preservationStatus: 'PRESERVADO' | 'DRENADO' | 'NEUTRO' = 'NEUTRO';

  if (endingEquity > startingEquity) {
    preservationStatus = 'PRESERVADO';
  } else if (endingEquity < startingEquity) {
    preservationStatus = 'DRENADO';
  } else {
    preservationStatus = 'NEUTRO';
  }

  return {
    startingEquity,
    endingEquity,
    equityPreservationRatio,
    preservationStatus
  };
}
