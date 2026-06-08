export class BalanceSheetFiduciaryConsistencyEngine {
  /**
   * Validates coherence between classification, indicators, diagnosis, and recommendation.
   * Calculates a Consistency Score (0-100) and blocks incompatible classifications.
   */
  public static validateConsistency(
    indicators: Record<string, string | number>,
    classification: string,
    diagnosis: string,
    recommendation: string
  ): { score: number; findings: string[]; severity: 'OK' | 'WARNING' | 'BLOCKING' } {
    let score = 100;
    const findings: string[] = [];
    let severity: 'OK' | 'WARNING' | 'BLOCKING' = 'OK';

    const setSeverity = (level: 'WARNING' | 'BLOCKING') => {
      if (severity === 'OK' || level === 'BLOCKING') {
        severity = level;
      }
    };

    // Example coherence rule: Proibido coexistir Loss Absorption Crítico com Solvência Forte ou PL positivo e CEV = 0.
    const isLossAbsorptionCritical = classification.includes('Loss Absorption Crítico');
    const isSolvencyStrong = classification.includes('Solvência Forte') || (typeof indicators['Liquidez Geral'] === 'number' && indicators['Liquidez Geral'] >= 1.0);
    const isPLPositive = typeof indicators['PL'] === 'number' && indicators['PL'] > 0;
    
    if (isLossAbsorptionCritical && isSolvencyStrong) {
      findings.push('[FIDUCIARY_INCONSISTENCY] Classification claims "Loss Absorption Crítico" but Solvency is Strong.');
      score -= 50;
      setSeverity('BLOCKING');
    }

    if (isLossAbsorptionCritical && isPLPositive && indicators['CEV'] === 0) {
      findings.push('[FIDUCIARY_INCONSISTENCY] Classification claims "Loss Absorption Crítico" but PL is positive and CEV is 0.');
      score -= 50;
      setSeverity('BLOCKING');
    }

    // Recommendation checking
    if (classification.includes('Liquidez Forte') && recommendation.toLowerCase().includes('emergência de caixa')) {
      findings.push('[FIDUCIARY_INCONSISTENCY] Strong liquidity classification contradicts "cash emergency" recommendation.');
      score -= 40;
      setSeverity('BLOCKING');
    }

    return { score: Math.max(0, score), findings, severity };
  }
}
