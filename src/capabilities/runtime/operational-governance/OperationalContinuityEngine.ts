// src/core/runtime/operational-governance/OperationalContinuityEngine.ts

import { OperationalEvaluationContext } from './operational-governance-adapter';
import { OperationalContinuityState, ExecutionIntegrityState } from './operational-governance-types';

export class OperationalContinuityEngine {
  static evaluate(context: OperationalEvaluationContext, executionState: ExecutionIntegrityState): OperationalContinuityState {
    
    if (context.historicalCyclesCount < 2) {
      return {
        status: 'CONTINUITY_STABLE',
        resilienceScore: 100,
        stabilityFactors: ['Base longitudinal insuficiente para degradação de continuidade.']
      };
    }

    let status: OperationalContinuityState['status'] = 'CONTINUITY_STABLE';
    let resilienceScore = 100;
    const stabilityFactors: string[] = [];

    if (context.activeSurvivalMode === 'SURVIVAL_MODE') {
      status = 'CONTINUITY_RESTRICTED';
      resilienceScore -= 40;
      stabilityFactors.push('Sobrevivência fiduciária limita a continuidade de novas frentes operacionais.');
    } else if (context.operatingPressureSeverity === 'CRITICAL' || context.operatingPressureSeverity === 'ACUTE') {
      status = 'CONTINUITY_PRESSURED';
      resilienceScore -= 30;
      stabilityFactors.push('Pressão operacional aguda afeta margens de resiliência.');
    } else if (executionState.status.includes('STRAIN') || executionState.status.includes('PRESSURED')) {
      status = 'CONTINUITY_SENSITIVE';
      resilienceScore -= 15;
      stabilityFactors.push('Sensibilidade aumentada devido ao atrito de execução.');
    }

    if (context.fundingFragility === 'CRITICAL' || context.fundingFragility === 'HIGH') {
      resilienceScore -= 20;
      stabilityFactors.push('Fragilidade de funding eleva o risco de descontinuidade estrutural.');
    }

    resilienceScore = Math.max(0, resilienceScore);

    if (resilienceScore === 100) {
      stabilityFactors.push('Margens amplas para absorção de choques de execução.');
    }

    return {
      status,
      resilienceScore,
      stabilityFactors
    };
  }
}
