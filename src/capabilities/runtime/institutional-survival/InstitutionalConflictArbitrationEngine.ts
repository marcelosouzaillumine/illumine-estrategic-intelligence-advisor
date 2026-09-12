// src/core/runtime/institutional-survival/InstitutionalConflictArbitrationEngine.ts

import { SurvivalEvaluationInput } from './SurvivalTypes';

export class InstitutionalConflictArbitrationEngine {
  public static arbitrate(input: SurvivalEvaluationInput): {
    decisions: string[];
    constraints: string[];
    allowedPriorities: string[];
    forbiddenPriorities: string[];
  } {
    const decisions: string[] = [];
    const constraints: string[] = [];
    const allowedPriorities: string[] = [];
    const forbiddenPriorities: string[] = [];

    const fidOut = input.fiduciaryOutput || {};
    const cashInt = input.cashIntelligenceRuntime || {};
    const treasury = input.treasuryRuntime || {};

    const runway = cashInt.continuityRisk?.projectedRunwayMonths ?? 999;
    const isEroded = fidOut.patrimonialIntegrityStatus === 'SEVERELY_ERODED' || fidOut.patrimonialIntegrityStatus === 'CAPITAL_COLLAPSE_RISK';
    const fco = input.fco ?? 0;
    const availableCash = input.availableCash ?? 0;

    // Conflict 1: Crescimento vs Caixa
    if (fco < 0 || availableCash <= 0) {
      decisions.push('Crescimento x Caixa: Geração operacional negativa ou caixa exaurido impede investimentos em crescimento comercial.');
      constraints.push('Crescimento bloqueado devido a déficit de caixa.');
      forbiddenPriorities.push('EXPANSION', 'AGGRESSIVE_GROWTH', 'AGGRESSIVE_HIRING');
    } else {
      allowedPriorities.push('Crescimento moderado e prudente.');
    }

    // Conflict 2: Expansão vs Runway
    if (runway < 6) {
      decisions.push('Expansão x Runway: Runway inferior a 6 meses exige estabilização de tesouraria antes de qualquer expansão.');
      constraints.push('Expansão proibida para preservar runway operacional.');
      forbiddenPriorities.push('EXPANSION', 'AGGRESSIVE_CAPEX');
    }

    // Conflict 3: Dividendos vs Erosão Patrimonial
    const isDistributionIneligible = fidOut.distributionEligibility?.eligible === false;
    if (isEroded || isDistributionIneligible) {
      decisions.push('Dividendos x Erosão Patrimonial: Erosão patrimonial ou inelegibilidade distributiva impede pagamentos societários.');
      constraints.push('Dividendos e retiradas societárias totalmente bloqueados.');
      forbiddenPriorities.push('SHAREHOLDER_RETURN', 'DIVIDEND', 'OWNER_WITHDRAWAL');
    }

    // Conflict 4: Capex vs Liquidez
    const isTreasuryStressed = treasury.severity === 'TREASURY_RUPTURE_RISK' || treasury.severity === 'UNSUSTAINABLE';
    if (isTreasuryStressed || fco < 0 || availableCash <= 0) {
      decisions.push('Capex x Liquidez: Caixa operacional sob estresse proíbe Capex sem funding externo dedicado.');
      constraints.push('Capex discricionário bloqueado preventivamente.');
      forbiddenPriorities.push('AGGRESSIVE_CAPEX');
    }

    // Conflict 5: Retorno societário vs Continuidade
    const isSurvivalState = runway < 3 || cashInt.liquidityClassification?.classification === 'CONTINUITY_RISK';
    if (isSurvivalState || isTreasuryStressed) {
      decisions.push('Retorno Societário x Continuidade: Risco iminente de descontinuidade exige congelamento compulsório de retiradas.');
      constraints.push('Retorno societário congelado para proteção da continuidade.');
      forbiddenPriorities.push('SHAREHOLDER_RETURN', 'OWNER_WITHDRAWAL', 'DIVIDEND');
    }

    // Compile Allowed Priorities based on active rules
    if (runway < 3 || fco < 0 || isEroded) {
      allowedPriorities.push('CASH_PRESERVATION', 'COST_CONTAINMENT', 'TREASURY_STABILIZATION', 'OPERATIONAL_RECOVERY', 'LIABILITY_PROTECTION');
    } else if (runway < 6) {
      allowedPriorities.push('RECOVERY_PLANNING', 'WORKING_CAPITAL_OPTIMIZATION', 'PORTFOLIO_RATIONALIZATION');
    } else if (runway < 12) {
      allowedPriorities.push('RESERVE_ACCUMULATION', 'CAPITAL_REINFORCEMENT', 'RUNWAY_EXPANSION');
    } else {
      allowedPriorities.push('PRUDENT_EXPANSION', 'CONTROLLED_CAPEX', 'TACTICAL_INVESTMENT', 'SHAREHOLDER_RETURN');
    }

    return {
      decisions,
      constraints,
      allowedPriorities: [...new Set(allowedPriorities)],
      forbiddenPriorities: [...new Set(forbiddenPriorities)]
    };
  }
}
