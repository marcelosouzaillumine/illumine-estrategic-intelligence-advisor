// src/core/runtime/operational-governance/OperationalGovernanceThesisEngine.ts

import { OperationalEvaluationContext } from './operational-governance-adapter';
import { 
  OperationalGovernanceThesis, 
  ExecutionIntegrityState, 
  OperationalContinuityState, 
  StrategicExecutionAlignment 
} from './operational-governance-types';

export class OperationalGovernanceThesisEngine {
  static evaluate(
    context: OperationalEvaluationContext,
    executionState: ExecutionIntegrityState,
    continuityState: OperationalContinuityState,
    alignment: StrategicExecutionAlignment
  ): OperationalGovernanceThesis {
    
    if (context.historicalCyclesCount < 2) {
      return {
        thesisStatement: 'Validação operacional retida por profundidade informacional insuficiente.',
        primaryStrain: null,
        institutionalPosture: 'ALIGNED_EXECUTION',
        lineageHash: context.lineageHash
      };
    }

    let posture: OperationalGovernanceThesis['institutionalPosture'] = 'ALIGNED_EXECUTION';
    let primaryStrain: string | null = null;

    if (!alignment.isAligned || executionState.status === 'EXECUTION_UNDER_STRAIN') {
      posture = 'RESTRICTED_EXECUTION';
      primaryStrain = 'Desalinhamento fiduciário crítico entre operações e salvaguardas.';
    } else if (executionState.status === 'EXECUTION_PRESSURED' || executionState.status === 'EXECUTION_UNDER_COORDINATION_STRAIN') {
      posture = 'STRAINED_EXECUTION';
      primaryStrain = executionState.strainFactors[0] || 'Atrito coordenativo generalizado.';
    } else if (continuityState.status === 'CONTINUITY_PRESSURED' || continuityState.status === 'CONTINUITY_RESTRICTED') {
      posture = 'STRAINED_EXECUTION';
      primaryStrain = 'Restrições estruturais de continuidade forçando redução operacional.';
    }

    let thesisStatement = posture === 'ALIGNED_EXECUTION'
      ? 'A execução operacional sustenta a continuidade sem atritos fiduciários significativos.'
      : 'As engrenagens institucionais detectam tração limitada ou desalinhada na frente operacional.';

    if (posture === 'RESTRICTED_EXECUTION') {
      thesisStatement = 'Execução restrita fiduciariamente. Capacidade operacional comprometida pelas diretrizes de estabilização.';
    }

    return {
      thesisStatement,
      primaryStrain,
      institutionalPosture: posture,
      lineageHash: context.lineageHash
    };
  }
}
