// src/core/runtime/war-gaming/StrategicResponseComparisonEngine.ts

import { StrategicResponseOption, ResponseComparisonResult } from './war-gaming-types';
import { TreasuryWarRoomEngine } from './TreasuryWarRoomEngine';
import { InstitutionalCollapseConstraintEngine } from './InstitutionalCollapseConstraintEngine';

export class StrategicResponseComparisonEngine {
  public static compare(
    scenarioId: string,
    initialCash: number,
    simulatedEbitda: number,
    simulatedCashFlow: number,
    options: StrategicResponseOption[],
    covenantThresholds: { minEbitda: number; minCash: number }
  ): ResponseComparisonResult {
    
    const responses = options.map(option => {
      // Apply interventions (e.g., intervention might reduce cash flow drain by delta)
      let adjustedCashFlow = simulatedCashFlow;
      let adjustedEbitda = simulatedEbitda;

      option.interventions.forEach(intervention => {
        if (intervention.variable === 'Caixa Operacional') {
          adjustedCashFlow += intervention.delta;
        } else if (intervention.variable === 'EBITDA') {
          adjustedEbitda += intervention.delta;
        } else if (intervention.variable === 'Custos Fixos') {
          // reduction in fixed costs improves EBITDA and CashFlow
          adjustedEbitda += Math.abs(intervention.delta);
          adjustedCashFlow += Math.abs(intervention.delta);
        }
      });

      const treasuryProfile = TreasuryWarRoomEngine.mapSurvival(
        initialCash,
        adjustedCashFlow,
        covenantThresholds,
        adjustedEbitda
      );

      return {
        responseId: option.responseId,
        resultingRunway: treasuryProfile.availableRunwayMonths,
        resultingLiquidity: initialCash + (adjustedCashFlow * Math.min(treasuryProfile.availableRunwayMonths, 24)),
        resultingSeverity: treasuryProfile.exhaustionPointReached ? 'CRÍTICA' : (treasuryProfile.criticalCovenantBreached ? 'ALTA' : 'MODERADA'),
        tradeOffNarrative: InstitutionalCollapseConstraintEngine.sanitizeNarrative(
          `Intervenção projetada estabiliza o caixa em ${treasuryProfile.availableRunwayMonths} meses. Dreno ajustado para ${adjustedCashFlow.toFixed(2)} ao mês.`
        )
      };
    });

    return {
      baselineScenarioId: scenarioId,
      responses
    };
  }
}
