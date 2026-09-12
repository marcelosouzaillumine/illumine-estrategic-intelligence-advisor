import { IntegrityBlocker } from '../FinancialIntegrityResult';

export class TrendIntegrityAnalyzer {
  /**
   * Rule Group 5 — Coerência Temporal
   * Identifica deterioração histórica (Ex: PL caindo progressivamente) para 
   * impedir narrativas pontuais otimistas (Ex: "Estabilidade") sobre 
   * dados que estruturalmente mostram queda no longo prazo.
   */
  public static validate(historicalData: any[]): IntegrityBlocker | null {
    if (!historicalData || historicalData.length < 2) return null;

    // Sort historical data by year/period ascending
    const sorted = [...historicalData].sort((a, b) => a.year - b.year);
    
    // Check PL (Equity) trend
    let decreasingYears = 0;
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i].equity !== undefined && sorted[i - 1].equity !== undefined) {
        if (sorted[i].equity < sorted[i - 1].equity) {
          decreasingYears++;
        }
      }
    }

    if (decreasingYears >= 2) {
      return {
        severity: 'WARNING',
        category: 'TEMPORAL',
        rule: 'PROGRESSIVE_EQUITY_DETERIORATION',
        message: 'Foi detectada deterioração patrimonial progressiva nos últimos períodos. Narrativas de "estabilidade" devem ser suprimidas.'
      };
    }

    return null;
  }
}
