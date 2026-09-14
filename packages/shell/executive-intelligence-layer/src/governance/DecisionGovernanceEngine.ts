import { DecisionAssessmentContract } from '../contracts/DecisionAssessmentContract';

/**
 * Motor fiduciário que avalia uma decisão executiva contra a realidade do contexto atual.
 */
export class DecisionGovernanceEngine {
  
  /**
   * Avalia a viabilidade de uma decisão com base no contexto financeiro da empresa.
   * @param decision Decisão proposta (Ex: 'DISTRIBUTE_DIVIDENDS', 'EXPAND_OPERATIONS')
   * @param businessState O estado financeiro calculado (Ex: 'RISCO DE CONTINUIDADE')
   * @param financialData Payload financeiro (para checagens finas, se necessário)
   */
  public static assess(decision: string, businessState: string, financialData?: any): DecisionAssessmentContract {
    const reasons: string[] = [];
    
    // Regras Duras baseadas em Risco
    if (businessState === 'RISCO DE CONTINUIDADE') {
      if (decision === 'DISTRIBUTE_DIVIDENDS' || decision === 'EXPAND_OPERATIONS') {
        reasons.push('Patrimônio líquido negativo.');
        reasons.push('Liquidez crítica.');
        reasons.push('Capital próprio insuficiente.');
        return {
          proposedDecision: decision,
          status: 'BLOCKED',
          reasons,
          recommendedAlternative: 'Suspender distribuição. Priorizar recomposição patrimonial.'
        };
      }
    }

    if (businessState === 'RECUPERAÇÃO PATRIMONIAL') {
      if (decision === 'EXPAND_OPERATIONS') {
        reasons.push('A empresa possui PL positivo, mas liquidez insuficiente para suportar a expansão com recursos próprios.');
        return {
          proposedDecision: decision,
          status: 'APPROVED_WITH_CONDITIONS',
          reasons,
          conditions: [
            'Assegurar linha de crédito de longo prazo pré-aprovada',
            'Não utilizar caixa operacional para CapEx'
          ],
          recommendedAlternative: 'Adiar expansão até liquidez atingir mínimo de 1.2.'
        };
      }
    }

    // Default Fallback
    return {
      proposedDecision: decision,
      status: 'APPROVED',
      reasons: ['O estado financeiro atual suporta a operação.'],
    };
  }
}
