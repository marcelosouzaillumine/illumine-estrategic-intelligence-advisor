import { IResolverContext, HistoricalDensity } from './types';

export class HistoricalDensityResolver {
  static resolve(ctx: IResolverContext): HistoricalDensity {
    if (ctx.historicalCyclesCount === 0) {
      return 'NO_VALID_HISTORY' as unknown as import("./types").HistoricalDensity; // Type needs to be adjusted in types.ts
    }
    if (ctx.historicalCyclesCount === 1) {
      return 'SINGLE_YEAR_ONLY';
    }
    if (ctx.historicalCyclesCount === 2) {
      return 'LOW_HISTORICAL_DENSITY';
    }
    if (ctx.historicalCyclesCount === 3) {
      return 'MODERATE_HISTORY';
    }
    return 'STRONG_HISTORICAL_BASE';
  }
}
