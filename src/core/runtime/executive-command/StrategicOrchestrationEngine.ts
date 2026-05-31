// src/core/runtime/executive-command/StrategicOrchestrationEngine.ts

import { CommandEvaluationContext } from './command-adapter';
import { ExecutiveDirective, ExecutiveDriftEvent, InstitutionalAlignmentState, StrategicOrchestration } from './executive-command-types';

export class StrategicOrchestrationEngine {
  static evaluate(
    context: CommandEvaluationContext, 
    directives: ExecutiveDirective[], 
    driftEvents: ExecutiveDriftEvent[], 
    alignment: InstitutionalAlignmentState
  ): StrategicOrchestration {
    
    if (context.historicalCyclesCount < 3) {
      return {
        primaryFocus: 'ACQUIRING_INSTITUTIONAL_HISTORY',
        immediateActionsRetained: [],
        orchestrationNarrative: 'Orquestração retida aguardando robustez na linhagem de dados.'
      };
    }

    let primaryFocus = 'GROWTH_AND_EXPANSION';
    const immediateActionsRetained: string[] = [];

    if (context.activeSurvivalMode === 'SURVIVAL_MODE') {
      primaryFocus = 'INSTITUTIONAL_SURVIVAL_AND_CAPITAL_DEFENSE';
      immediateActionsRetained.push('Cessar toda alocação de capital em novas avenidas.');
      immediateActionsRetained.push('Acionar contingência de tesouraria de curto prazo.');
    } else if (context.operatingPressureSeverity === 'CRITICAL' || context.treasuryProtectionLevel.includes('WEAK')) {
      primaryFocus = 'LIQUIDITY_AND_OPERATIONAL_RECOVERY';
      immediateActionsRetained.push('Reestruturar ciclo operacional para liberar caixa.');
    } else if (alignment.overallAlignmentScore < 80) {
      primaryFocus = 'STRATEGIC_ALIGNMENT_RESTORATION';
      immediateActionsRetained.push('Corrigir divergências entre expansão e funding.');
    }

    let orchestrationNarrative = `O comitê deve concentrar esforços na pauta de ${primaryFocus.replace(/_/g, ' ')}.`;
    
    if (driftEvents.length > 0) {
      orchestrationNarrative += ` É mandatório endereçar os desalinhamentos estruturais observados.`;
    }

    return {
      primaryFocus,
      immediateActionsRetained,
      orchestrationNarrative
    };
  }
}
