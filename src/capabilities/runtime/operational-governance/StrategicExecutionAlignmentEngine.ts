// src/core/runtime/operational-governance/StrategicExecutionAlignmentEngine.ts

import { OperationalEvaluationContext } from './operational-governance-adapter';
import { StrategicExecutionAlignment, ExecutionIntegrityState } from './operational-governance-types';

export class StrategicExecutionAlignmentEngine {
  static evaluate(context: OperationalEvaluationContext, executionState: ExecutionIntegrityState): StrategicExecutionAlignment {
    
    if (context.historicalCyclesCount < 2) {
      return {
        isAligned: true,
        alignmentNarrative: 'Alinhamento indeterminado (dados longitudinais insuficientes).',
        tensions: []
      };
    }

    const tensions: string[] = [];
    let isAligned = true;

    // Check misalignment between strategy/execution and treasury directives
    if (context.activeExecutiveDirectives.includes('EXPANSION_SUSPENSION') && (context.revenueGrowth > 0.10 || context.fcoGrowth > 0.10)) {
      isAligned = false;
      tensions.push('Expansão persistente contrária à diretiva fiduciária de suspensão de crescimento.');
    }

    if (context.activeExecutiveDirectives.includes('LIQUIDITY_STABILIZATION') && context.ocf < 0) {
      isAligned = false;
      tensions.push('Queima de caixa divergente da estabilização de liquidez exigida.');
    }

    if (executionState.status === 'EXECUTION_UNDER_STRAIN') {
      isAligned = false;
      tensions.push('Desalinhamento forçado por strain de execução crônico.');
    }

    let alignmentNarrative = isAligned 
      ? 'Execução e estratégia estão operando dentro dos parâmetros de continuidade.' 
      : 'Desalinhamento fiduciário severo entre a capacidade de execução e as restrições institucionais.';

    return {
      isAligned,
      alignmentNarrative,
      tensions
    };
  }
}
