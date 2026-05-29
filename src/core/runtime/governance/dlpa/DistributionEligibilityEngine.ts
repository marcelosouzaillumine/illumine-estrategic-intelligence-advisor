// src/core/runtime/governance/dlpa/DistributionEligibilityEngine.ts
//
// Ref: Governance Runtime Correction — DLPA Fiduciary Interpretation Refactor
// Validates if there is legitimate economic capacity for shareholder distributions.

export interface DistributionEligibilityResult {
  eligible: boolean;
  failedCriteria: string[];
  reason: string;
}

export class DistributionEligibilityEngine {
  private static NEAR_ZERO_THRESHOLD = 0.01;

  public static evaluate(params: {
    netIncome: number;
    lucrosAcumulados: number;
    reservasLucro: number;
    startingEquity: number;
    endingEquity: number;
    operatingCashFlow: number;
  }): DistributionEligibilityResult {
    const {
      netIncome,
      lucrosAcumulados,
      reservasLucro,
      startingEquity,
      endingEquity,
      operatingCashFlow,
    } = params;

    const failedCriteria: string[] = [];

    // 1. Profitability
    const profitabilityPositive = netIncome > 0;
    if (!profitabilityPositive) {
      failedCriteria.push('LUCRO_LÍQUIDO_INSUFICIENTE');
    }

    // 2. Distributable Base
    const distributableBaseExists = lucrosAcumulados > 0 || reservasLucro > 0;
    if (!distributableBaseExists) {
      failedCriteria.push('BASE_DISTRIBUÍVEL_AUSENTE');
    }

    // 3. Patrimonial Integrity
    // capitalPreservationIndex = plFinal / abs(plInicial)
    // preservation is pressured or worse if index < 0.50
    let patrimonialIntegrity = false;
    const absStarting = Math.abs(startingEquity);

    if (endingEquity > 0) {
      if (absStarting <= this.NEAR_ZERO_THRESHOLD) {
        // Denominator collapse / near-zero initial equity:
        // if ending equity is positive, we consider the base healthy enough
        patrimonialIntegrity = true;
      } else {
        const capitalPreservationIndex = endingEquity / absStarting;
        patrimonialIntegrity = capitalPreservationIndex >= 0.50;
      }
    }

    if (!patrimonialIntegrity) {
      failedCriteria.push('INTEGRIDADE_PATRIMONIAL_COMPROMETIDA');
    }

    // 4. Operational Cash Support
    const operationalCashSupport = operatingCashFlow > 0;
    if (!operationalCashSupport) {
      failedCriteria.push('CAIXA_OPERACIONAL_INSUFICIENTE');
    }

    const eligible = failedCriteria.length === 0;

    let reason = 'Capacidade econômica e fiduciária legítima de distribuição validada.';
    if (!eligible) {
      reason = `Distribuição bloqueada pelos seguintes fatores impeditivos: ${failedCriteria.join(', ')}.`;
    }

    return {
      eligible,
      failedCriteria,
      reason,
    };
  }
}
