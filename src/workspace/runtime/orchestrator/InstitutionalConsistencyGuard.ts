import { InstitutionalContextProfile } from '../../../capabilities/runtime/institutional-context/types';

export class InstitutionalConsistencyGuard {
  /**
   * Deterministically blocks any institutional claim that violates fundamental laws of prudence.
   */
  public static enforce(
    rawInsight: string,
    ctx: InstitutionalContextProfile,
    isFailClosedActive: boolean
  ): string {
    if (isFailClosedActive) {
      return 'Diagnóstico não verificável (ausência de dados estruturais completos).';
    }

    const isSingleYear = ctx.legacy?.historicalDensity === 'LOW_HISTORICAL_DENSITY' || 
                         ctx.legacy?.historicalDensity === 'SINGLE_YEAR_ONLY';

    const isEarlyStage = ctx.legacy?.businessStage === 'STRUCTURING_OPERATION' || 
                         ctx.legacy?.businessStage === 'FIRST_OPERATIONAL_YEAR';

    let enforcedInsight = rawInsight;

    // 1. Maturidade sem histórico
    if (isSingleYear && /maturidade|estabilidade histórica|comprovada|longitudinal/i.test(enforcedInsight)) {
      enforcedInsight = enforcedInsight.replace(/maturidade|estabilidade histórica|comprovada|longitudinal/gi, 'indicação latente');
      enforcedInsight += ' [Nota: Atestado limitado por ausência de profundidade histórica]';
    }

    // 2. Crescimento sem operação madura
    if (isEarlyStage && /robusto|escalabilidade comprovada|consolidação/i.test(enforcedInsight)) {
      enforcedInsight = enforcedInsight.replace(/robusto|escalabilidade comprovada|consolidação/gi, 'tração inicial');
    }

    return enforcedInsight;
  }
}
