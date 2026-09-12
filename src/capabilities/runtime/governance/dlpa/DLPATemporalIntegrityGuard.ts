import { TemporalFiduciaryIntegrityEngine } from '../../temporal-governance/TemporalFiduciaryIntegrityEngine';

export class DLPATemporalIntegrityGuard {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  /**
   * Garante que análises do DLPA nunca utilizem ciclos/históricos futuros.
   */
  public static filterHistoricalCycles(historicalCycles: any[], analysisYear: number): any[] {
    if (!historicalCycles || historicalCycles.length === 0) {
      return [];
    }

    const years = historicalCycles.map(c => Number(c.year)).filter(y => !isNaN(y) && y > 0);
    const result = TemporalFiduciaryIntegrityEngine.validate(analysisYear, years, 'EXECUTIVE');

    if (result.temporalIntegrity === 'INVALID' || result.blockedYears.length > 0) {
      throw new Error('TEMPORAL_CONTAMINATION_DETECTED');
    }

    // Retorna apenas os ciclos permitidos
    return historicalCycles.filter(cycle => Number(cycle.year) <= analysisYear);
  }
}
