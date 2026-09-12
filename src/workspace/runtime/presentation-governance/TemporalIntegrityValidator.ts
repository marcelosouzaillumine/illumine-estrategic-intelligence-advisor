import { TemporalFiduciaryIntegrityEngine } from '../../core/runtime/temporal-governance/TemporalFiduciaryIntegrityEngine';

export class TemporalIntegrityValidator {
  /**
   * Valida um único ano de dados contra o ano de análise ativa consumindo o TFIF.
   */
  public static validate(analysisYear: number, dataCycleYear: number): void {
    const result = TemporalFiduciaryIntegrityEngine.validate(analysisYear, [dataCycleYear], 'EXECUTIVE');
    if (result.temporalIntegrity === 'FILTERED_WITH_BLOCKED_YEARS' || result.temporalIntegrity === 'INVALID') {
      throw new Error(`TEMPORAL_CONTAMINATION_DETECTED: Analysis year ${analysisYear} cannot consume future data from year ${dataCycleYear}.`);
    }
  }

  /**
   * Valida uma coleção de ciclos históricos contra o ano de análise ativa.
   */
  public static validateCollection(analysisYear: number, cycles: Array<{ year: number }>): void {
    const years = (cycles || []).map(c => c.year);
    const result = TemporalFiduciaryIntegrityEngine.validate(analysisYear, years, 'EXECUTIVE');
    if (result.temporalIntegrity === 'FILTERED_WITH_BLOCKED_YEARS' || result.temporalIntegrity === 'INVALID') {
      throw new Error(`TEMPORAL_CONTAMINATION_DETECTED: Analysis year ${analysisYear} cannot consume future data from year(s): ${result.blockedYears.join(', ')}.`);
    }
  }
}
