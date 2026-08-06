import { IResolverContext, LiabilityNature } from './types';

export class LiabilityNatureResolver {
  static resolve(ctx: IResolverContext): LiabilityNature[] {
    const profiles: LiabilityNature[] = [];
    const bp = ctx.bpSummary || {};
    const pc = bp.passivoCirculante || 0;
    const pnc = bp.passivoNaoCirculante || 0;
    const pt = bp.passivoTotal || 0;
    const pl = bp.patrimonioLiquido || 0;
    const fornecedores = bp.fornecedores || 0;
    const passivosFinanceiros = bp.passivosFinanceiros || 0;
    const ac = bp.ativoCirculante || 0;

    // 1. FINANCIAL_DEBT: se dívida financeira representa mais de 20% do passivo total
    if (passivosFinanceiros > 0 && pt > 0 && (passivosFinanceiros / pt) >= 0.2) {
      profiles.push('FINANCIAL_DEBT');
    }

    // 2. OPERATIONAL_SUPPLIER_FINANCING: se fornecedores representam mais de 25% do passivo total
    if (fornecedores > 0 && pt > 0 && (fornecedores / pt) >= 0.25) {
      profiles.push('OPERATIONAL_SUPPLIER_FINANCING');
    }

    // 3. SHAREHOLDER_FUNDING: se PL é muito alto em relação ao passivo total (autonomia financeira >= 70%)
    if (pl > 0 && pt === 0) {
      profiles.push('SHAREHOLDER_FUNDING');
    } else if (pl > 0 && pt > 0 && (pl / (pl + pt)) >= 0.7) {
      profiles.push('SHAREHOLDER_FUNDING');
    }

    // 4. WORKING_CAPITAL_PRESSURE: se passivo circulante supera o ativo circulante
    if (pc > ac) {
      profiles.push('WORKING_CAPITAL_PRESSURE');
    }

    // 5. STRUCTURED_DEBT: passivo não circulante relevante (longo horizonte) representa mais de 40% do passivo total
    if (pnc > 0 && pt > 0 && (pnc / pt) > 0.4) {
      profiles.push('STRUCTURED_DEBT');
    }

    // 6. Rastreamento em strings brutas para exposições específicas (tributária, judicial, folha)
    const rawString = JSON.stringify(ctx.rawData || {}).toLowerCase();
    if (rawString.includes('judicial') || rawString.includes('processo') || rawString.includes('provisão judicial')) {
      profiles.push('JUDICIAL_EXPOSURE');
    }
    if (rawString.includes('imposto') || rawString.includes('tribut') || rawString.includes('fiscal') || rawString.includes('taxa')) {
      profiles.push('TAX_EXPOSURE');
    }
    if (rawString.includes('folha') || rawString.includes('salário') || rawString.includes('trabalhista') || rawString.includes('fgts')) {
      profiles.push('PAYROLL_PRESSURE');
    }

    // Se nenhum perfil foi adicionado, ou se temos PL forte e sem Working Capital/Financial Debt
    if (profiles.length === 0 || (pl > pt && !profiles.includes('WORKING_CAPITAL_PRESSURE') && !profiles.includes('FINANCIAL_DEBT'))) {
      profiles.push('BALANCED_LIABILITY');
    }

    return Array.from(new Set(profiles));
  }
}
