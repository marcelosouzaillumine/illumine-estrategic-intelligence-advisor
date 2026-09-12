import { InstitutionalContextProfile } from '../../capabilities/runtime/institutional-context/types';

export class InstitutionalInterpretationBoundary {
  /**
   * Block claims that contradict the historical density or maturity.
   */
  public static evaluateNarrativeSafety(
    rawClaim: string,
    ctx: InstitutionalContextProfile
  ): string {
    const isSingleYear = ctx.legacy?.historicalDensity === 'LOW_HISTORICAL_DENSITY' || 
                         ctx.legacy?.historicalDensity === 'SINGLE_YEAR_ONLY';

    const isDistressed = ctx.legacy?.businessStage === 'TURNAROUND_DISTRESS';

    let safeClaim = rawClaim;

    if (isSingleYear) {
      safeClaim = safeClaim.replace(/crescimento sustentável/gi, 'expansão de ciclo imediato (histórico insuficiente)');
      safeClaim = safeClaim.replace(/estabilidade consolidada/gi, 'equilíbrio momentâneo');
      safeClaim = safeClaim.replace(/forte tendência/gi, 'indicação estática');
    }

    if (isDistressed) {
      safeClaim = safeClaim.replace(/conforto de liquidez/gi, 'alívio pontual de caixa');
      safeClaim = safeClaim.replace(/sobra de caixa/gi, 'retenção forçada de capital');
    }

    return safeClaim;
  }

  /**
   * Prevents optimism leakage from a single domain.
   */
  public static mitigateOptimismLeakage(
    localInsight: string,
    crossDomainValidation: 'VALIDATED' | 'CONTRADICTED' | 'UNVERIFIABLE'
  ): string {
    if (crossDomainValidation === 'CONTRADICTED') {
      return `[BLOQUEADO: ${localInsight} foi isolado devido à contradição entre domínios operacionais]`;
    }
    if (crossDomainValidation === 'UNVERIFIABLE') {
      return `${localInsight} (Indicação isolada não passível de validação estrutural)`;
    }
    return localInsight;
  }
}
