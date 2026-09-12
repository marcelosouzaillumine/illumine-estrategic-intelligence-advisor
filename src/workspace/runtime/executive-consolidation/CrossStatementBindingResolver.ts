import { CrossStatementTension } from './CrossStatementPropagationEngine';
import { BoardDecision } from '../executive-prioritization/BoardTop3DecisionEngine';

export interface CrossStatementBindingResult {
  hasTension: boolean;
  tensions: CrossStatementTension[];
  isFallback: boolean;
}

export class CrossStatementBindingResolver {
  /**
   * Ponto único de verdade para consolidação executiva de tensões.
   * Resolve e blinda o presentation layer contra vazamentos.
   */
  public static resolve(
    tensions: CrossStatementTension[], 
    badiScore: number, 
    boardTop3: BoardDecision[],
    isMockData: boolean = false
  ): CrossStatementBindingResult {
    const hasTension = tensions.length > 0;
    const hasCriticalDecision = boardTop3.some(d => d.urgencyLabel === 'Crítica' || d.impactLabel === 'Muito Alto');

    // Se não há dados reais (mock/incompleto), não devemos lançar erro fiduciário pois a falta de tensões é esperada
    if (isMockData) {
      return {
        hasTension,
        tensions,
        isFallback: false
      };
    }

    // In production, any causal rupture throws CROSS_STATEMENT_FALLBACK_PROHIBITED / CROSS_STATEMENT_BINDING_FAILURE
    if (process.env.NODE_ENV === 'production' && !hasTension && (badiScore >= 70 || hasCriticalDecision)) {
      throw new Error('CROSS_STATEMENT_FALLBACK_PROHIBITED (CROSS_STATEMENT_BINDING_FAILURE): A geração de fallbacks causais sintéticos é proibida em produção.');
    }

    // In development/test, if BADI is extremely high (>= 85) or there is a critical decision, we prohibit fallback and throw CROSS_STATEMENT_BINDING_FAILURE
    if (!hasTension && (badiScore >= 85 || hasCriticalDecision)) {
      throw new Error(JSON.stringify({
        error: 'CROSS_STATEMENT_BINDING_FAILURE',
        badiScore,
        boardTop3Count: boardTop3.length,
        tensionsCount: tensions.length,
        expectedChains: ['DRE_DFC_DLPA', 'DFC_CONTINUITY_PRESSURE'],
        debugHint: "Se os valores fiduciários deveriam gerar tensões, verifique se a DFC e a DLPA foram injetadas corretamente no motor."
      }));
    }

    // Otherwise, in development, if BADI >= 70, we can return the synthetic fallback
    if (!hasTension && badiScore >= 70) {
      const fallbackTension: CrossStatementTension = {
        chain: 'DRE_DFC_DLPA',
        category: 'VALUE_DESTRUCTION_CHAIN',
        severity: 'CRITICAL',
        narrative: 'Tensão cross-statement simulada (Fallback Causal) devido a inconsistência estrutural entre o BADI elevado e a ausência de propagação canônica.',
        evidence: {
          netIncome: 0,
          fco: 0,
          capitalConsumed: 0
        },
        source: 'SYNTHETIC_GUARD'
      };
      return {
        hasTension: true,
        tensions: [fallbackTension],
        isFallback: true
      };
    }

    return {
      hasTension,
      tensions,
      isFallback: false
    };
  }
}
