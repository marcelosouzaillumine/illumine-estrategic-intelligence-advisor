// src/core/runtime/governance/dlpa/PatrimonialIntegrityEngine.ts
//
// Ref: Governance Runtime Correction — DLPA Fiduciary Interpretation Refactor
// Evaluates equity erosion, capital social consumption, and structural protection status.

export type CapitalPreservationStatus =
  | 'PRESERVED'
  | 'PRESSURED'
  | 'SEVERELY_ERODED'
  | 'CAPITAL_COLLAPSE_RISK';

export type PreservationRatioReliability =
  | 'RELIABLE'
  | 'PRESERVATION_RATIO_NOT_RELIABLE'
  | 'INSUFFICIENT_PATRIMONIAL_BASE';

export interface PatrimonialIntegrityReport {
  capitalPreservationIndex: number | null;
  preservationStatus: CapitalPreservationStatus;
  preservationRatioReliability: PreservationRatioReliability;
  capitalSocialConsumptionRatio: number | null;
  equityLossResilienceCycles: number | null;
  capitalProtectionStatus: 'STRONG_CAPITAL_PROTECTION' | 'MEDIUM_CAPITAL_PROTECTION' | 'WEAK_CAPITAL_PROTECTION' | 'CAPITAL_UNDER_COLLAPSE';
  warnings: string[];
}

export class PatrimonialIntegrityEngine {
  private static NEAR_ZERO_THRESHOLD = 1.0; // Block ratios if denominator is <= 1.0

  public static evaluate(params: {
    startingEquity: number;
    endingEquity: number;
    capitalSocial: number;
    netIncome: number;
    lucrosPrejuizos: number; // Accumulated profits/losses from balance sheet
  }): PatrimonialIntegrityReport {
    const {
      startingEquity,
      endingEquity,
      capitalSocial,
      netIncome,
      lucrosPrejuizos,
    } = params;

    const warnings: string[] = [];
    const absStarting = Math.abs(startingEquity);

    let capitalPreservationIndex: number | null = null;
    let preservationStatus: CapitalPreservationStatus = 'CAPITAL_COLLAPSE_RISK';
    let preservationRatioReliability: PreservationRatioReliability = 'RELIABLE';

    // 1. Preservation Ratio Protection
    if (absStarting <= this.NEAR_ZERO_THRESHOLD) {
      preservationRatioReliability = 'INSUFFICIENT_PATRIMONIAL_BASE';
      warnings.push('Base patrimonial inicial insuficiente ou próxima a zero. Cálculo do índice de preservação bloqueado.');
      
      // Classify based on absolute ending equity
      if (endingEquity <= 0) {
        preservationStatus = 'CAPITAL_COLLAPSE_RISK';
      } else if (endingEquity < 10000) {
        preservationStatus = 'SEVERELY_ERODED';
      } else {
        preservationStatus = 'PRESSURED';
      }
    } else {
      // capitalPreservationIndex = plFinal / abs(plInicial)
      capitalPreservationIndex = endingEquity / absStarting;
      
      // Clamp output to reasonable bounds to prevent explosive distortions
      capitalPreservationIndex = Math.max(-10.0, Math.min(10.0, capitalPreservationIndex));

      if (capitalPreservationIndex >= 0.80) {
        preservationStatus = 'PRESERVED';
      } else if (capitalPreservationIndex >= 0.50) {
        preservationStatus = 'PRESSURED';
      } else if (capitalPreservationIndex >= 0.20) {
        preservationStatus = 'SEVERELY_ERODED';
      } else {
        preservationStatus = 'CAPITAL_COLLAPSE_RISK';
      }
    }

    // 2. Capital Social Consumption
    // If endingEquity < capitalSocial, the capital social is being eaten by losses
    let capitalSocialConsumptionRatio: number | null = null;
    if (capitalSocial > this.NEAR_ZERO_THRESHOLD) {
      capitalSocialConsumptionRatio = Math.max(0, (capitalSocial - endingEquity) / capitalSocial);
    } else {
      warnings.push('Capital Social ausente ou inválido no Balanço Patrimonial.');
    }

    // 3. Equity Loss Resilience Cycles
    // How many periods of the current loss the PL can sustain before depletion
    let equityLossResilienceCycles: number | null = null;
    if (netIncome < 0) {
      const absLoss = Math.abs(netIncome);
      equityLossResilienceCycles = endingEquity > 0 ? endingEquity / absLoss : 0;
      // Clamp to prevent infinite values
      equityLossResilienceCycles = Math.min(99, Math.max(0, equityLossResilienceCycles));
    }

    // 4. Capital Protection Status
    let capitalProtectionStatus: PatrimonialIntegrityReport['capitalProtectionStatus'] = 'STRONG_CAPITAL_PROTECTION';

    if (endingEquity <= 0 || preservationStatus === 'CAPITAL_COLLAPSE_RISK') {
      capitalProtectionStatus = 'CAPITAL_UNDER_COLLAPSE';
    } else if (preservationStatus === 'SEVERELY_ERODED' || (capitalSocialConsumptionRatio !== null && capitalSocialConsumptionRatio > 0.5)) {
      capitalProtectionStatus = 'WEAK_CAPITAL_PROTECTION';
    } else if (preservationStatus === 'PRESSURED' || (capitalSocialConsumptionRatio !== null && capitalSocialConsumptionRatio > 0.1)) {
      capitalProtectionStatus = 'MEDIUM_CAPITAL_PROTECTION';
    } else {
      capitalProtectionStatus = 'STRONG_CAPITAL_PROTECTION';
    }

    return {
      capitalPreservationIndex,
      preservationStatus,
      preservationRatioReliability,
      capitalSocialConsumptionRatio,
      equityLossResilienceCycles,
      capitalProtectionStatus,
      warnings,
    };
  }
}
