import { IResolverContext, OperationalProfile } from './types';

export class OperationalProfileResolver {
  static resolve(ctx: IResolverContext): OperationalProfile {
    const bp = ctx.bpSummary || {};
    const industry = (ctx.industry || '').toLowerCase();
    
    const totalAssets = bp.ativoTotal || 1;
    const inventory = bp.estoques || 0;
    const fixedAssets = bp.ativoNaoCirculante || 0;
    const cash = bp.caixaEquivalentes || 0;
    const pc = bp.passivoCirculante || 1;

    // 1. Inventory Dependency
    let inventoryDependency: 'HIGH' | 'MODERATE' | 'LOW' = 'LOW';
    const invRatio = inventory / totalAssets;
    if (invRatio > 0.2 || industry.includes('indústria') || industry.includes('varejo') || industry.includes('distribuição') || industry.includes('comércio')) {
      inventoryDependency = 'HIGH';
    } else if (invRatio > 0.05 || industry.includes('hospital') || industry.includes('saúde')) {
      inventoryDependency = 'MODERATE';
    }

    // 2. Cash Dependency
    let cashDependency: 'HIGH' | 'MODERATE' | 'LOW' = 'MODERATE';
    const cashRatio = cash / pc;
    if (cashRatio < 0.15 || industry.includes('tecnologia') || industry.includes('software') || industry.includes('saas')) {
      cashDependency = 'HIGH';
    } else if (cashRatio > 0.6) {
      cashDependency = 'LOW';
    }

    // 3. Capital Concentration
    let capitalConcentration: 'HIGH' | 'MODERATE' | 'LOW' = 'LOW';
    const fixedRatio = fixedAssets / totalAssets;
    if (fixedRatio > 0.4 || industry.includes('holding') || industry.includes('indústria') || industry.includes('infraestrutura')) {
      capitalConcentration = 'HIGH';
    } else if (fixedRatio > 0.15 || industry.includes('hospital')) {
      capitalConcentration = 'MODERATE';
    }

    // 4. Operational Elasticity
    let operationalElasticity: 'HIGH' | 'MODERATE' | 'LOW' = 'MODERATE';
    if (industry.includes('software') || industry.includes('saas') || industry.includes('tecnologia')) {
      operationalElasticity = 'HIGH';
    } else if (industry.includes('indústria') || industry.includes('manufatura') || industry.includes('hospital') || fixedRatio > 0.4) {
      operationalElasticity = 'LOW';
    }

    // 5. Financial Cycle
    let financialCycle: 'LONG' | 'MODERATE' | 'SHORT' | 'NEGATIVE' = 'MODERATE';
    if (industry.includes('software') || industry.includes('saas') || industry.includes('serviço')) {
      financialCycle = 'SHORT';
    } else if (industry.includes('indústria') || industry.includes('manufatura') || industry.includes('distribuição') || invRatio > 0.25) {
      financialCycle = 'LONG';
    } else if (cash > pc * 2) {
      financialCycle = 'NEGATIVE'; // Proxy for extremely liquid/short operational cycle
    }

    return {
      inventoryDependency,
      cashDependency,
      capitalConcentration,
      operationalElasticity,
      financialCycle
    };
  }
}
