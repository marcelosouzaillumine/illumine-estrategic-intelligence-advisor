// src/core/runtime/operational-governance/OperationalStabilityGuard.ts

import { ExecutionIntegrityState } from './operational-governance-types';

export class OperationalStabilityGuard {
  /**
   * Atua como um buffer (low-pass filter fiduciário) para evitar 
   * "strain inflation" devido a flutuações operacionais isoladas de curto prazo.
   * Se o status for Strain, mas a flutuação não justificar a quebra estrutural real,
   * ele amortece para Pressured ou Stable, dependendo da recorrência.
   */
  static applyGuard(rawState: ExecutionIntegrityState, previousStatusHistory: string[]): ExecutionIntegrityState {
    
    // Se a capacidade de avaliação for baixa, não permitimos status agressivos, 
    // mas o Engine já faz isso. O Guard previne a transição RÁPIDA.
    if (rawState.status === 'EXECUTION_UNDER_STRAIN' || rawState.status === 'EXECUTION_UNDER_COORDINATION_STRAIN') {
      
      const lastStatus = previousStatusHistory[previousStatusHistory.length - 1] || 'EXECUTION_STABLE';
      
      // Regra de inércia: Se o último estado era STABLE, não podemos ir direto para STRAIN crônico 
      // numa única medição, a menos que seja um choque de mercado (que seria tratado em Resiliência, não aqui).
      // Reduzimos para PRESSURED.
      if (lastStatus === 'EXECUTION_STABLE') {
        return {
          ...rawState,
          status: 'EXECUTION_PRESSURED',
          strainFactors: [...rawState.strainFactors, 'Atrito amortecido pelo Guardião de Estabilidade (Transição Moderada).']
        };
      }
    }

    // Se estiver STABLE, mas o histórico é todo STRAIN, amortecemos a volta ao STABLE imediato
    if (rawState.status === 'EXECUTION_STABLE') {
      const recentHistory = previousStatusHistory.slice(-2);
      if (recentHistory.length === 2 && recentHistory.every(s => s.includes('STRAIN'))) {
        return {
          ...rawState,
          status: 'EXECUTION_PRESSURED',
          strainFactors: [...rawState.strainFactors, 'Estabilidade amortecida (Fase de Recuperação Técnica).']
        };
      }
    }

    return rawState;
  }
}
