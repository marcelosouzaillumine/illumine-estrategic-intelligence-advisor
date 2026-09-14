import { ConsolidatedFinancialInput } from '../../../capabilities/financial/runtime/consolidated/types';
import { CalibrationEngine } from '../calibration/CalibrationEngine';

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
    
    const sensitivity = CalibrationEngine.getCalibration().stressPropagationSensitivity;

    // Analisa a solvência bruta entidade a entidade no contexto pós-choque
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

      // Critério arbitrário matemático de insolvência imediata escalado por sensibilidade
      const insolvenceLimit = 0.05 * sensitivity;
      if (shortTermDebt > 0 && cash < (shortTermDebt * insolvenceLimit)) {
        collapsedEntities.push(entity.id);
      } else {
        survivingEntities.push(entity.id);
      }
    }

    const solvencyLimit = 0.3 * sensitivity;
    const groupSolvencyStatus: 'SOLVENT' | 'AT_RISK' | 'INSOLVENT' = totalGroupCash >= (totalGroupLiabilities * solvencyLimit) ? 'SOLVENT' 
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
