import { IResolverContext, BusinessStage } from './types';

export class BusinessStageResolver {
  static resolve(ctx: IResolverContext): BusinessStage {
    // Se a flag explícita existir nos dados brutos (ex: importação manual/override)
    if (ctx.rawData && ctx.rawData.isFirstOperationalYear === true) {
      return 'FIRST_OPERATIONAL_YEAR';
    }

    // Se o histórico for 1 e tem prejuízo acumulado logo de cara, ou não há histórico anterior
    if (ctx.historicalCyclesCount <= 1) {
      return 'FIRST_OPERATIONAL_YEAR';
    }

    if (ctx.historicalCyclesCount === 2) {
      return 'EARLY_STAGE_CONSOLIDATION';
    }
    
    const isStruggling = (ctx.bpSummary.patrimonioLiquido || 0) < 0 || (ctx.dreCascade?.find(d => d.category.toLowerCase().includes('lucro'))?.value || 0) < 0;
    const hasHeavyDebt = (ctx.bpSummary.passivoCirculante || 0) > (ctx.bpSummary.ativoCirculante || 0) * 1.5;

    if (isStruggling && hasHeavyDebt) {
      return 'TURNAROUND_DISTRESS';
    }

    if (ctx.historicalCyclesCount >= 5) {
      return 'MATURE_OPERATION';
    }

    if (ctx.historicalCyclesCount >= 4) {
      return 'SCALE_STAGE';
    }

    return 'GROWTH_STAGE';
  }
}
