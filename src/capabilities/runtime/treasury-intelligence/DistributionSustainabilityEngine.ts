// src/core/runtime/treasury-intelligence/DistributionSustainabilityEngine.ts

import { DistributionSustainabilityOutput } from './types';

export interface DistributionEvaluationInput {
  netIncome: number;
  retainedEarnings: number;
  fco: number;
  liquidityClassification: string;
  runwayStability: string;
  hasRuptureRisk: boolean;
  isArtificial: boolean;
  hasPredictiveDeterioration: boolean;
  hasCapitalDependency: boolean;
  hasRefinancingDependency: boolean;
  historicalCyclesCount: number;
  startingEquity: number;
}

export class DistributionSustainabilityEngine {
  /**
   * Governs capital distributions (dividends, interest on equity, capital reduction)
   * under structural and fiduciary constraints.
   * 
   * Distinguishes between accounting distributability (legal rights) and 
   * fiduciary distributability (safeguards for institutional continuity).
   */
  public static evaluate(input: DistributionEvaluationInput): DistributionSustainabilityOutput {
    const {
      netIncome,
      retainedEarnings,
      fco,
      liquidityClassification,
      runwayStability,
      hasRuptureRisk,
      isArtificial,
      hasPredictiveDeterioration,
      hasCapitalDependency,
      hasRefinancingDependency,
      historicalCyclesCount,
      startingEquity
    } = input;

    const blockedReasons: string[] = [];
    let isBlocked = false;

    // 1. Accounting Distributability (Legal Profit Allocation)
    const accountingDistributable = Math.max(netIncome + retainedEarnings, 0);

    // 2. Patrimonial Erosion calculation
    let patrimonialErosionIndex = 0;
    if (netIncome < 0) {
      const denom = startingEquity > 0 ? startingEquity : 1;
      patrimonialErosionIndex = Math.min((Math.abs(netIncome) / denom) * 100, 100);
    }

    // 3. Fiduciary Hard-Blocks Check
    if (netIncome < 0) {
      isBlocked = true;
      blockedReasons.push('ACTIVE_PATRIMONIAL_EROSION: Distribuição bloqueada sob erosão patrimonial ativa (prejuízo contábil).');
    }

    if (fco <= 0) {
      isBlocked = true;
      blockedReasons.push('NEGATIVE_OPERATIONAL_CASH_GENERATION: Ausência de geração operacional líquida de caixa no período.');
    } else if (historicalCyclesCount < 2) {
      isBlocked = true;
      blockedReasons.push('UNSTABLE_OPERATIONAL_CASH_GENERATION: Histórico operacional insuficiente (< 2 ciclos) impede atestado de estabilidade.');
    }

    if (liquidityClassification === 'ARTIFICIAL_LIQUIDITY' || isArtificial) {
      isBlocked = true;
      blockedReasons.push('ARTIFICIAL_LIQUIDITY_DEPENDENCY: Liquidez mantida artificialmente por capital de terceiros ou sócios.');
    }

    if (liquidityClassification === 'FALSE_STABILITY' || runwayStability === 'FALSE_STABILITY') {
      isBlocked = true;
      blockedReasons.push('FALSE_STABILITY_LIQUIDITY: Estabilidade aparente vulnerável a choques de captação secundários.');
    }

    if (liquidityClassification === 'LIQUIDITY_DEPENDENT' || hasCapitalDependency) {
      isBlocked = true;
      blockedReasons.push('CAPITAL_DEPENDENCY: Dependência crônica de injeções de capital societário para adimplir obrigações.');
    }

    if (runwayStability === 'COLLAPSING' || hasRuptureRisk) {
      isBlocked = true;
      blockedReasons.push('TREASURY_RUPTURE_TRAJECTORY: Velocidade de consumo de caixa projeta exaustão iminente de reservas.');
    }

    if (hasPredictiveDeterioration) {
      isBlocked = true;
      blockedReasons.push('PREDICTIVE_SURVIVABILITY_DETERIORATION: Sinais de fadiga de governança ou tendência crítica de deterioração detectados.');
    }

    if (hasRefinancingDependency) {
      isBlocked = true;
      blockedReasons.push('REFINANCING_DEPENDENCY: Dependência de rolagem de dívidas bancárias ou captações de terceiros.');
    }

    // 4. Fiduciary Distributability calculation
    let fiduciaryDistributable = 0;
    if (!isBlocked && netIncome > 0) {
      // Even if not blocked, fiduciary governance limits distribution to 50% of the operational cash flow (FCO)
      // or net income, whichever is lower, to preserve capital.
      fiduciaryDistributable = Math.round(Math.min(netIncome * 0.4, fco * 0.3) * 100) / 100;
    }

    const eligible = !isBlocked && fiduciaryDistributable > 0;

    return {
      eligible,
      accountingDistributable,
      fiduciaryDistributable: eligible ? fiduciaryDistributable : 0,
      isBlocked,
      blockedReasons,
      patrimonialErosionIndex: Math.round(patrimonialErosionIndex * 10) / 10
    };
  }
}
