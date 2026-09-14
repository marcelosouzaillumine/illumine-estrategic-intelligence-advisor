export interface ClassificationParams {
  capitalSocial: number;
  endingEquity: number;
  netIncome: number;
  distributionRatio: number;
  retentionRatio: number;
  cashPosition: number;
  [key: string]: any; // To allow checking for forbidden legacy parameters
}

export interface ClassificationReport {
  governanceStatus: string;
  capitalPreservationStatus: 'Capital Expansion' | 'Capital Strengthening' | 'Preserved Capital' | 'Capital Erosion' | 'Severe Erosion' | 'Critical Erosion' | 'Capital Collapse';
  capitalErosionStatus: 'Low Erosion' | 'Moderate Erosion' | 'Severe Erosion' | 'Capital Collapse';
  capitalIntegrityStatus: 'Healthy' | 'Pressured' | 'Severely Eroded' | 'Collapse Risk';
  capitalResilienceStatus: 'Healthy' | 'Moderate' | 'Fragile' | 'Critical';
}

export class CapitalClassificationEngine {
  public static classify(params: ClassificationParams): ClassificationReport {
    // Check for forbidden inputs
    const forbiddenKeys = ['saldoInicialLucros', 'lucrosAcumulados', 'lucrosRetidos', 'uiCalculatedValues'];
    forbiddenKeys.forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        throw new Error(`LEGACY_CAPITAL_CLASSIFICATION_DETECTED: Forbidden legacy parameter '${key}' was used in classification.`);
      }
    });

    const {
      capitalSocial,
      endingEquity,
      netIncome,
      distributionRatio,
      retentionRatio,
      cashPosition
    } = params;

    // 1. Capital Preservation Status
    let capitalPreservationStatus: ClassificationReport['capitalPreservationStatus'] = 'Preserved Capital';
    const preservationRatio = capitalSocial > 0 ? endingEquity / capitalSocial : 1.0;

    if (preservationRatio > 1.0) {
      capitalPreservationStatus = 'Capital Expansion';
    } else if (preservationRatio >= 0.85) {
      capitalPreservationStatus = 'Preserved Capital';
    } else if (preservationRatio >= 0.50) {
      capitalPreservationStatus = 'Capital Erosion';
    } else if (endingEquity > 0) {
      capitalPreservationStatus = 'Severe Erosion'; // PL > 0 blocks Collapse
    } else if (preservationRatio >= 0.25) {
      capitalPreservationStatus = 'Severe Erosion';
    } else if (preservationRatio > 0) {
      capitalPreservationStatus = 'Critical Erosion';
    } else {
      capitalPreservationStatus = 'Capital Collapse';
    }

    // 2. Capital Erosion Status
    let capitalErosionStatus: ClassificationReport['capitalErosionStatus'] = 'Low Erosion';
    const erosionRatio = 1 - preservationRatio;
    if (erosionRatio <= 0.15) {
      capitalErosionStatus = 'Low Erosion';
    } else if (erosionRatio <= 0.50) {
      capitalErosionStatus = 'Moderate Erosion';
    } else if (endingEquity > 0) {
      capitalErosionStatus = 'Severe Erosion';
    } else {
      capitalErosionStatus = 'Capital Collapse';
    }

    // 3. Capital Integrity Status
    let capitalIntegrityStatus: ClassificationReport['capitalIntegrityStatus'] = 'Healthy';
    if (preservationRatio >= 0.80) {
      capitalIntegrityStatus = 'Healthy';
    } else if (preservationRatio >= 0.50) {
      capitalIntegrityStatus = 'Pressured';
    } else if (endingEquity > 0) {
      capitalIntegrityStatus = 'Severely Eroded';
    } else {
      capitalIntegrityStatus = 'Collapse Risk';
    }

    // 4. Capital Resilience Status
    let capitalResilienceStatus: ClassificationReport['capitalResilienceStatus'] = 'Healthy';
    let erir = capitalSocial > 0 ? endingEquity / capitalSocial : 1.0;
    if (netIncome < 0) {
      const lossImpact = Math.abs(netIncome) / (endingEquity > 0 ? endingEquity : 1.0);
      erir = erir - 0.2 * lossImpact;
    }
    if (erir >= 0.8) {
      capitalResilienceStatus = 'Healthy';
    } else if (erir >= 0.5) {
      capitalResilienceStatus = 'Moderate';
    } else if (erir >= 0.2) {
      capitalResilienceStatus = 'Fragile';
    } else {
      capitalResilienceStatus = 'Critical';
    }

    return {
      governanceStatus: '', // Resolved by SemanticEngine based on score and context
      capitalPreservationStatus,
      capitalErosionStatus,
      capitalIntegrityStatus,
      capitalResilienceStatus
    };
  }
}
