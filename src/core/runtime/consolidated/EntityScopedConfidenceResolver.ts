import { ConsolidatedConfidence } from './consolidated-types';

export function resolveConsolidatedConfidence(
  entityConfidences: Record<string, 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE'>
): ConsolidatedConfidence {
  
  const levels = Object.values(entityConfidences);
  
  if (levels.length === 0) {
    return {
      overallLevel: 'LOW_CONFIDENCE',
      confidenceByEntity: {},
      degradationReason: 'No entities to resolve confidence'
    };
  }

  let overallLevel: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE' = 'HIGH_CONFIDENCE';
  let hasLow = false;
  let hasMedium = false;

  for (const level of levels) {
    if (level === 'LOW_CONFIDENCE') hasLow = true;
    if (level === 'MEDIUM_CONFIDENCE') hasMedium = true;
  }

  // A confidence consolidada nunca pode ser maior que a menor confidence das entidades.
  if (hasLow) {
    overallLevel = 'LOW_CONFIDENCE';
  } else if (hasMedium) {
    overallLevel = 'MEDIUM_CONFIDENCE';
  }

  return {
    overallLevel,
    confidenceByEntity: entityConfidences,
    degradationReason: hasLow ? 'Degraded to LOW due to minimum threshold inheritance' 
                    : (hasMedium ? 'Degraded to MEDIUM due to minimum threshold inheritance' : undefined)
  };
}
