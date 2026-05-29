// src/core/runtime/institutional-survival/SurvivalPriorityClassificationEngine.ts

import { ActiveSurvivalMode, SurvivalEvaluationInput } from './SurvivalTypes';

export class SurvivalPriorityClassificationEngine {
  public static classify(
    input: SurvivalEvaluationInput,
    isSurvivalTriggered: boolean
  ): {
    mode: ActiveSurvivalMode;
    level: number;
    blockedLevels: string[];
  } {
    if (isSurvivalTriggered) {
      return {
        mode: 'SURVIVAL_MODE',
        level: 1,
        blockedLevels: [
          'LEVEL_2_STRUCTURAL_STABILIZATION',
          'LEVEL_3_RESILIENCE_REINFORCEMENT',
          'LEVEL_4_SUSTAINABLE_EXPANSION',
          'LEVEL_5_SHAREHOLDER_OPTIMIZATION'
        ]
      };
    }

    const fidOut = input.fiduciaryOutput || {};
    const cashInt = input.cashIntelligenceRuntime || {};
    const runway = cashInt.continuityRisk?.projectedRunwayMonths ?? 999;
    
    // Check if Nível 2 (Estabilização Estrutural) está ativo/degradado
    const isStab =
      runway < 6 ||
      fidOut.patrimonialIntegrityStatus === 'PRESSURE' ||
      fidOut.patrimonialIntegrityStatus === 'PRESSURED' ||
      (input.fco !== undefined && input.fco > 0 && input.fco < (input.availableCash || 0) * 0.05) ||
      fidOut.retentionClassification === 'EMERGENCY_RETENTION';

    if (isStab) {
      return {
        mode: 'STABILIZATION_MODE',
        level: 2,
        blockedLevels: [
          'LEVEL_3_RESILIENCE_REINFORCEMENT',
          'LEVEL_4_SUSTAINABLE_EXPANSION',
          'LEVEL_5_SHAREHOLDER_OPTIMIZATION'
        ]
      };
    }

    // Check if Nível 3 (Reforço de Resiliência) está ativo/degradado
    const isResilience =
      runway < 12 ||
      fidOut.capitalProtectionStatus === 'MEDIUM_CAPITAL_PROTECTION' ||
      (input.netIncome !== undefined && input.netIncome < 0);

    if (isResilience) {
      return {
        mode: 'RESILIENCE_MODE',
        level: 3,
        blockedLevels: [
          'LEVEL_4_SUSTAINABLE_EXPANSION',
          'LEVEL_5_SHAREHOLDER_OPTIMIZATION'
        ]
      };
    }

    // Check if Nível 4 (Crescimento Controlado) ou Nível 5 (Otimização de Retorno)
    const isHighlyPreserved = fidOut.patrimonialIntegrityStatus === 'PRESERVED';
    const isStrongCash = (input.fco || 0) > 0 && runway >= 12;

    if (isHighlyPreserved && isStrongCash) {
      return {
        mode: 'SHAREHOLDER_OPTIMIZATION_MODE',
        level: 5,
        blockedLevels: []
      };
    }

    return {
      mode: 'CONTROLLED_GROWTH_MODE',
      level: 4,
      blockedLevels: ['LEVEL_5_SHAREHOLDER_OPTIMIZATION']
    };
  }
}
