import { ConsolidatedFinancialInput } from '../consolidated/types';

export class PredictiveStressEngine {
  /**
   * Avalia a saúde crua dos BP e DREs estressados (pós-choques).
   * Retorna os danos diretos detectados, base para a propagação causal futura.
   */
  static evaluateStress(stressedInput: ConsolidatedFinancialInput) {
    const collapsedEntities: string[] = [];
    const survivingEntities: string[] = [];

    let totalGroupCash = 0;
    let totalGroupLiabilities = 0;
    
    // Analisa a solvência bruta entidade a entidade no cenário pós-choque
    for (const entity of stressedInput.entities) {
      const bp = stressedInput.bpByEntity[entity.id] || [];
      let cash = 0;
      let shortTermDebt = 0;

      for (const line of bp) {
        if (line.accountId.startsWith('1.1.1')) cash += line.value;
        if (line.accountId.startsWith('2.1')) shortTermDebt += line.value;
      }

      totalGroupCash += cash;
      totalGroupLiabilities += shortTermDebt;

      // Critério arbitrário matemático de insolvência imediata em cenários
      if (shortTermDebt > 0 && cash < (shortTermDebt * 0.05)) {
        collapsedEntities.push(entity.id);
      } else {
        survivingEntities.push(entity.id);
      }
    }

    const groupSolvencyStatus: 'SOLVENT' | 'AT_RISK' | 'INSOLVENT' = totalGroupCash >= (totalGroupLiabilities * 0.3) ? 'SOLVENT' 
                              : (totalGroupCash > 0 ? 'AT_RISK' : 'INSOLVENT');

    return {
      survivingEntities,
      collapsedEntities,
      groupSolvencyStatus,
      totalGroupCash,
      totalGroupLiabilities
    };
  }
}
