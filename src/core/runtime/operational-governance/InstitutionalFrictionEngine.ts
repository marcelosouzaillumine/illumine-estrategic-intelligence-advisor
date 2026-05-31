// src/core/runtime/operational-governance/InstitutionalFrictionEngine.ts

import { OperationalEvaluationContext } from './operational-governance-adapter';
import { OperationalFrictionEvent, FrictionNature } from './operational-governance-types';

export class InstitutionalFrictionEngine {
  static evaluate(context: OperationalEvaluationContext): OperationalFrictionEvent[] {
    const frictions: OperationalFrictionEvent[] = [];

    if (context.historicalCyclesCount < 2) {
      return frictions;
    }

    // 1. Friction between growth and cash generation
    if (context.revenueGrowth > 0.10 && context.fcoGrowth < -0.10) {
      const nature: FrictionNature = context.activeSurvivalMode === 'SURVIVAL_MODE' ? 'STRUCTURAL' : 'EXPANSION_RELATED';
      frictions.push({
        id: `FRIC-GRW-CASH-${context.lineageHash.substring(0,8)}`,
        description: 'Observed operational friction: expansão de receita não acompanhada por geração de caixa.',
        nature,
        causalMetrics: ['revenueGrowth', 'fcoGrowth']
      });
    }

    // 2. Friction between execution and treasury limits
    if (context.activeExecutiveDirectives.includes('CAPITAL_PRESERVATION') && context.fcoGrowth < 0) {
      frictions.push({
        id: `FRIC-TREASURY-${context.lineageHash.substring(0,8)}`,
        description: 'Structural coordination pressure: degradação operacional ampliando restrições fiduciárias de tesouraria.',
        nature: 'STRUCTURAL',
        causalMetrics: ['fcoGrowth', 'activeExecutiveDirectives']
      });
    }

    // 3. Friction with continuity overrides
    if (context.activeSurvivalMode === 'SURVIVAL_MODE' && context.operatingPressureSeverity !== 'CRITICAL') {
      frictions.push({
        id: `FRIC-SURVIVAL-${context.lineageHash.substring(0,8)}`,
        description: 'Recurring operational tension: descompasso entre modo de sobrevivência fiduciária e leitura de pressão operacional local.',
        nature: 'CONTINUITY_RELATED',
        causalMetrics: ['activeSurvivalMode', 'operatingPressureSeverity']
      });
    }

    return frictions;
  }
}
