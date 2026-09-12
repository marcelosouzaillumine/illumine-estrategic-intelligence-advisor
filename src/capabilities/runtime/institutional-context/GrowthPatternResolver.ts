import { IResolverContext, GrowthPattern } from './types';

export class GrowthPatternResolver {
  static resolve(ctx: IResolverContext): GrowthPattern {
    const bp = ctx.bpSummary || {};
    const pl = bp.patrimonioLiquido || 0;
    const previousPl = ctx.previousPl || 0;
    const previousEbitda = ctx.previousEbitda || 0;
    const previousCash = ctx.previousCash || 0;
    
    const ebitda = ctx.dreCascade?.find((d: any) => d.id === 'EBITDA' || d.category?.toLowerCase().includes('ebitda'))?.value 
      || ctx.rawData?.rawFinancialData?.ebitda || 0;

    const netIncome = ctx.dreCascade?.find((d: any) => d.id === 'LUCRO_LÍQUIDO_DO_EXERCÍCIO' || d.category?.toLowerCase().includes('lucro'))?.value 
      || ctx.rawData?.rawFinancialData?.lucroLiquido || 0;

    if (ctx.historicalCyclesCount <= 1 || previousPl === 0) {
      if (netIncome > 0 && ebitda > 0) {
        return 'SUSTAINABLE_OPERATIONAL_EXPANSION';
      }
      return 'STAGNATION';
    }

    const plGrowth = pl - previousPl;
    const plGrowthPct = plGrowth / Math.abs(previousPl);
    const isContraction = plGrowthPct < -0.05;
    const isStagnant = Math.abs(plGrowthPct) <= 0.05;

    if (isContraction) {
      return 'CONTRACTION';
    }

    if (isStagnant) {
      return 'STAGNATION';
    }

    // Se cresceu (plGrowthPct > 0.05)
    // 1. Financiado por Dívida
    const debt = bp.passivosFinanceiros || 0;
    const previousDebt = ctx.rawData?.previousDebt || 0;
    const debtGrowth = debt - previousDebt;

    if (debtGrowth > 0 && debtGrowth > plGrowth && debt / (bp.passivoTotal || 1) > 0.3) {
      return 'DEBT_FINANCED_GROWTH';
    }

    // 2. Financiado por Aporte de Acionistas
    const capitalSocial = bp.capitalSocial || 0;
    const previousCapitalSocial = ctx.rawData?.previousCapitalSocial || 0;
    const capSocialGrowth = capitalSocial - previousCapitalSocial;

    if (capSocialGrowth > 0 && capSocialGrowth > plGrowth * 0.7 && ebitda <= previousEbitda) {
      return 'SHAREHOLDER_FINANCED_GROWTH';
    }

    // 3. Crescimento Sem Caixa
    const currentCash = bp.caixaEquivalentes || 0;
    const cashGrowth = currentCash - previousCash;
    const receivables = bp.clientes || 0;
    const inventory = bp.estoques || 0;

    if (plGrowth > 0 && cashGrowth < 0 && (receivables > 0 || inventory > 0)) {
      return 'CASHLESS_GROWTH';
    }

    // 4. Crescimento Saudável / Expansão Saudável
    if (ebitda > previousEbitda && currentCash >= previousCash) {
      return 'HEALTHY_GROWTH';
    }

    return 'SUSTAINABLE_OPERATIONAL_EXPANSION';
  }
}
