import { IResolverContext, BusinessStage } from './types';

export class BusinessStageResolver {
  static resolve(ctx: IResolverContext): BusinessStage {
    // Se a flag explícita existir nos dados brutos
    if (ctx.rawData && ctx.rawData.isFirstOperationalYear === true) {
      return 'INITIAL_OPERATION';
    }

    // Regra Determinística Obrigatória 1: Menos de 2 exercícios válidos
    if (ctx.historicalCyclesCount <= 1) {
      const isLoss = (ctx.dreCascade?.find(d => {
        const catName = (d.category || d.conta || d.id || '').toLowerCase();
        return catName.includes('lucro');
      })?.value ?? ctx.dreCascade?.find(d => {
        const catName = (d.category || d.conta || d.id || '').toLowerCase();
        return catName.includes('lucro');
      })?.val ?? 0) < 0 || (ctx.bpSummary.lucrosPrejuizos || 0) > 0;
      const hasInventoryFormation = (ctx.bpSummary.estoques || 0) > 0;
      const hasSupplierDebt = (ctx.bpSummary.fornecedores || 0) > 0;
      const hasPartnerCapital = (ctx.bpSummary.capitalSocial || 0) > 0 || (ctx.bpSummary.creditosSocios || 0) > 0;
      const hasACGrowth = (ctx.bpSummary.ativoCirculante || 0) > 0; // Aproximação de expansão de AC
      
      // Regra 2: Primeiro Ciclo Operacional - se prejuízo coexistir com estoques, aumento de capital etc.
      if (isLoss && (hasInventoryFormation || hasPartnerCapital || hasACGrowth || hasSupplierDebt)) {
        return 'STRUCTURING_OPERATION';
      }

      return 'INITIAL_OPERATION';
    }

    if (ctx.historicalCyclesCount === 2) {
      return 'STRUCTURING_OPERATION';
    }
    
    const isStruggling = (ctx.bpSummary.patrimonioLiquido || 0) < 0 || (ctx.dreCascade?.find(d => {
      const catName = (d.category || d.conta || d.id || '').toLowerCase();
      return catName.includes('lucro');
    })?.value ?? ctx.dreCascade?.find(d => {
      const catName = (d.category || d.conta || d.id || '').toLowerCase();
      return catName.includes('lucro');
    })?.val ?? 0) < 0;
    const hasHeavyDebt = (ctx.bpSummary.passivoCirculante || 0) > (ctx.bpSummary.ativoCirculante || 0) * 1.5;

    if (isStruggling && hasHeavyDebt) {
      return 'RESTRUCTURING_OPERATION';
    }

    if (isStruggling && !hasHeavyDebt) {
      return 'DECLINE_OPERATION';
    }

    if (ctx.historicalCyclesCount >= 6) {
      return 'CONSOLIDATED_OPERATION';
    }

    if (ctx.historicalCyclesCount >= 4) {
      return 'MATURE_OPERATION';
    }

    return 'EXPANDING_OPERATION';
  }
}
