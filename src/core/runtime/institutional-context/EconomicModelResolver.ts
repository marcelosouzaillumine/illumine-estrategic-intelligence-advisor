import { IResolverContext, EconomicModel } from './types';

export class EconomicModelResolver {
  static resolve(ctx: IResolverContext): EconomicModel {
    const industry = (ctx.industry || '').toLowerCase();
    
    if (industry.includes('indústria') || industry.includes('industria') || industry.includes('manufatura') || industry.includes('agro') || industry.includes('agronegócio') || industry.includes('cosmético') || industry.includes('cosmetico')) return 'INDUSTRIAL';
    if (industry.includes('saúde') || industry.includes('hospital') || industry.includes('clínica')) return 'HEALTHCARE';
    if (industry.includes('distribuição') || industry.includes('comércio') || industry.includes('varejo') || industry.includes('logística')) return 'DISTRIBUTION';
    if (industry.includes('software') || industry.includes('saas') || industry.includes('tecnologia')) return 'SAAS';
    if (industry.includes('holding') || industry.includes('participações')) return 'HOLDING_STRUCTURE';
    if (industry.includes('serviço') || industry.includes('construção') || industry.includes('engenharia')) return 'SERVICE_BASED';

    const fixedAssets = ctx.bpSummary.ativoNaoCirculante || 0;
    const totalAssets = ctx.bpSummary.ativoTotal || 1;
    
    if (fixedAssets / totalAssets > 0.4) {
      return 'ASSET_HEAVY';
    }
    
    const inventory = ctx.bpSummary.estoques || 0;
    if (inventory / totalAssets > 0.3) {
      return 'INVENTORY_DEPENDENT';
    }
    
    return 'ASSET_LIGHT';
  }
}
