export interface TemporalValidationResult {
  analysisYear: number;
  eligibleYears: number[];
  blockedYears: number[];
  temporalIntegrity: 'VALID' | 'FILTERED_WITH_BLOCKED_YEARS' | 'INVALID';
  perspective: 'EXECUTIVE' | 'RETROSPECTIVE';
  violationCode?: 'TEMPORAL_FIDUCIARY_VIOLATION';
}

export class TemporalFiduciaryIntegrityEngine {
  public static validate(
    analysisYear: number,
    historicalYears: number[],
    perspective: 'EXECUTIVE' | 'RETROSPECTIVE' = 'EXECUTIVE',
    integrityOverride: boolean = false
  ): TemporalValidationResult {
    const uniqueYears = [...new Set(historicalYears)].filter(y => !isNaN(y) && y > 0).sort((a, b) => a - b);
    const eligibleYears = uniqueYears.filter(y => y <= analysisYear);
    const blockedYears = uniqueYears.filter(y => y > analysisYear);

    let temporalIntegrity: 'VALID' | 'FILTERED_WITH_BLOCKED_YEARS' | 'INVALID' = 'VALID';
    let violationCode: 'TEMPORAL_FIDUCIARY_VIOLATION' | undefined = undefined;

    if (blockedYears.length > 0) {
      if (perspective === 'RETROSPECTIVE') {
        temporalIntegrity = 'VALID';
      } else {
        temporalIntegrity = 'FILTERED_WITH_BLOCKED_YEARS';
        violationCode = 'TEMPORAL_FIDUCIARY_VIOLATION';
      }
    }

    if (integrityOverride) {
      temporalIntegrity = 'INVALID';
      violationCode = 'TEMPORAL_FIDUCIARY_VIOLATION';
    }

    return {
      analysisYear,
      eligibleYears,
      blockedYears,
      temporalIntegrity,
      perspective,
      violationCode
    };
  }
}
