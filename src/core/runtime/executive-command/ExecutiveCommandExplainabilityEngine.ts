// src/core/runtime/executive-command/ExecutiveCommandExplainabilityEngine.ts

import { CommandEvaluationContext } from './command-adapter';
import { ExecutiveCommandExplainability, ExecutiveDirective, ExecutiveDriftEvent } from './executive-command-types';

export class ExecutiveCommandExplainabilityEngine {
  static evaluate(
    context: CommandEvaluationContext,
    directives: ExecutiveDirective[],
    driftEvents: ExecutiveDriftEvent[]
  ): ExecutiveCommandExplainability {
    
    if (context.historicalCyclesCount < 3) {
      return {
        rationale: 'Fiduciariamente restrito por ausência de linhagem institucional.',
        dominantEngine: 'Fail-Closed Constraint Engine',
        supportingLineageHashes: [context.lineageHash],
        governanceConstraintsApplied: ['INSUFFICIENT_HISTORY']
      };
    }

    const rationale = directives.length > 0 
      ? `As diretivas ativas foram moldadas primariamente pelas restrições de ${directives[0].category.replace(/_/g, ' ')}.` 
      : 'As engrenagens fiduciárias autorizam a continuidade sem intervenção emergencial.';

    const governanceConstraintsApplied = [...context.blockedInstitutionalActions];
    if (context.activeSurvivalMode === 'SURVIVAL_MODE') {
      governanceConstraintsApplied.push('SURVIVAL_RESTRICTIONS_ACTIVE');
    }

    return {
      rationale,
      dominantEngine: directives.length > 0 ? 'InstitutionalDirectiveEngine' : 'StrategicOrchestrationEngine',
      supportingLineageHashes: [context.lineageHash],
      governanceConstraintsApplied
    };
  }
}
