import { NormalizedBalanceSheet } from '../../domain/models/NormalizedBalanceSheet';
import { HistoricalMovement } from '../../contracts/HistoricalIntelligence';
import { BalanceSheetCalculations } from '../../domain/balance-sheet/calculations/BalanceSheetCalculations';

export class HistoricalEvolutionEngine {
  static extractMovements(history: NormalizedBalanceSheet[]): HistoricalMovement[] {
    const movements: HistoricalMovement[] = [];
    
    if (!history || history.length < 2) {
      return movements;
    }

    const oldest = history[0];
    const newest = history[history.length - 1];
    
    // Gate 23 & 24: Absolute Temporal Rule
    // The string format should strictly be earliest -> newest without hardcoded formats
    const period = `${oldest.year} a ${newest.year}`; 

    const addMovement = (metricName: string, oldValue: number | undefined | null, newValue: number | undefined | null, trendDir: string) => {
        let percentage: number | 'NOT_APPLICABLE' | 'SIGN_INVERSION' | 'ZERO_CHANGE' | 'UNAVAILABLE' = 'NOT_APPLICABLE';
        let direction = 'stable';
        let absolute: number | undefined = undefined;
        let inflectionPoint = undefined;

        if (oldValue === undefined || oldValue === null || newValue === undefined || newValue === null) {
            percentage = 'UNAVAILABLE';
            direction = 'UNAVAILABLE';
        } else {
            absolute = newValue - oldValue;
            if (oldValue === 0 && newValue === 0) {
                percentage = 'ZERO_CHANGE';
                direction = 'stable';
            } else if (oldValue === 0 && newValue !== 0) {
                percentage = 'NOT_APPLICABLE';
                direction = absolute > 0 ? 'increasing' : 'decreasing';
            } else if ((oldValue > 0 && newValue < 0) || (oldValue < 0 && newValue > 0)) {
                percentage = 'SIGN_INVERSION';
                direction = absolute > 0 ? 'increasing' : 'decreasing';
            } else {
                percentage = (absolute / Math.abs(oldValue)) * 100;
                if (percentage > 5) direction = 'increasing';
                if (percentage < -5) direction = 'decreasing';

                if (trendDir === 'positive' && percentage < -10) inflectionPoint = 'TREND_DETERIORATING';
                if (trendDir === 'negative' && percentage > 10) inflectionPoint = 'TREND_IMPROVING';
            }
        }

        movements.push({
            metric: metricName,
            period,
            variation: { absolute: absolute as any, percentage: percentage as any },
            interpretation: '', // Populated by NarrativeEngine
            direction,
            inflectionPoint,
            evidence: { source: 'Balanço Patrimonial Normalizado' }
        });
    };

    // Patrimonio Liquido
    addMovement('Patrimônio Líquido', oldest.equity.total, newest.equity.total, 'positive');
    
    // Ativo Total
    addMovement('Ativo Total', oldest.assets.total, newest.assets.total, 'positive');

    // Passivo Total
    addMovement('Passivo Total', oldest.liabilities.total, newest.liabilities.total, 'negative');

    // NCG (Working Capital)
    const oldestMetrics = BalanceSheetCalculations.calculateMetrics(oldest);
    const newestMetrics = BalanceSheetCalculations.calculateMetrics(newest);
    
    addMovement('Necessidade de Capital de Giro', oldestMetrics.ncg, newestMetrics.ncg, 'negative');
    
    // Tesouraria (ST)
    addMovement('Saldo de Tesouraria', oldestMetrics.treasury, newestMetrics.treasury, 'positive');

    return movements;
  }
}
