export interface BalanceSheetExecutiveFacts {
  year: number;
  totalAssets: number;
  currentAssets: number;
  nonCurrentAssets: number;
  totalLiabilities: number;
  currentLiabilities: number;
  equity: number;
  liquidityCurrent: number;
  liquidityImmediate: number;
  liquidityDry: number;
  liquidityGeneral: number;
  workingCapital: number;
  workingCapitalNeed: number;
  treasuryBalance: number;
  estimatedCashCycle: number;
  debtRatio: number;
  thirdPartyCapitalDependence: number;
  debtToEquity: number;
  financialAutonomy: number;
  debtComposition: number;
  assetConcentrationRisk: number;
  immobilizationOfEquity: number;
  patrimonialIndex: number;
  growthTotalAssets: number;
  growthWorkingCapitalNeed: number;
  growthEquity: number;
  growthRevenue: number;
  growthCurrentLiabilities: number;
  liquidezReal?: number;
  qualidadePatrimonioLiquido?: number | 'LIMITED_EVIDENCE' | 'INSUFFICIENT_DATA';
}

export class BalanceSheetExecutiveFactsBuilder {
  public static build(executiveReport: any, indicators: any[] = [], directBpSummary?: any): BalanceSheetExecutiveFacts {
    const bp = directBpSummary || executiveReport?.rawFinancialData?.bpSummary || executiveReport?.patrimonialIntelligenceReport?.bpSummary || executiveReport?.context?.bpSummary || {};
    const metrics = executiveReport?.rawFinancialData?.financialMetrics || {};
    const context = executiveReport?.context || {};

    const parseValue = (val: any): number => {
      if (val === undefined || val === null) return NaN;
      if (typeof val === 'number') return val;
      let cleanStr = String(val)
        .replace(/R\$\s*/gi, '')
        .replace(/%/g, '')
        .replace(/x/gi, '')
        .trim();

      if (cleanStr.includes(',')) {
        // formato BR com vírgula decimal
        cleanStr = cleanStr.replace(/\./g, '').replace(/,/g, '.');
      } else {
        // formato sem vírgula
        const parts = cleanStr.split('.');
        if (parts.length > 2) {
          // ex: 1.830.998
          cleanStr = cleanStr.replace(/\./g, '');
        } else if (parts.length === 2 && parts[1].length === 3) {
          // ex: 1.830 -> 1830
          cleanStr = cleanStr.replace(/\./g, '');
        }
        // caso contrário, mantém o ponto (ex: 11.97 -> 11.97)
      }
      
      return Number(cleanStr);
    };

    const getInd = (name: string, alts: string[] = []) => {
      const names = [name, ...alts].map(n => n.toLowerCase().trim());
      
      // 1. Check indicators array explicitly
      const ind = indicators.find((i: any) => {
        if (!i) return false;
        const n = (i.metricName || i.name || i.label || i.id || i.key || '').toLowerCase().trim();
        return names.includes(n);
      });
      if (ind) {
        const p = parseValue(ind.value !== undefined ? ind.value : ind.valor);
        if (!isNaN(p)) return p;
      }
      
      // 2. Check metrics object
      for (const k of names) {
        // try direct match
        const directKeys = Object.keys(metrics);
        const match = directKeys.find(dk => dk.toLowerCase().trim() === k);
        if (match && metrics[match] !== undefined) {
          const p = parseValue(metrics[match]);
          if (!isNaN(p)) return p;
        }
      }
      
      // 3. Deep search in the entire executiveReport for anything matching the names
      let foundVal = NaN;
      const searchDeep = (obj: any) => {
        if (!obj || typeof obj !== 'object' || !isNaN(foundVal)) return;
        for (const key of Object.keys(obj)) {
          const lowerKey = key.toLowerCase().trim();
          if (names.includes(lowerKey)) {
            let target = obj[key];
            if (target && typeof target === 'object') {
              if (target.value !== undefined) target = target.value;
              else if (target.valor !== undefined) target = target.valor;
            }
            const val = parseValue(target);
            if (!isNaN(val)) {
              foundVal = val;
              return;
            }
          }
          if (typeof obj[key] === 'object') {
            searchDeep(obj[key]);
          }
        }
      };
      
      searchDeep(executiveReport);
      
      if (!isNaN(foundVal)) return foundVal;
      return 0;
    };

    return {
      year: context.analysisYear || 0,
      totalAssets: bp.ativoTotal || 0,
      currentAssets: bp.ativoCirculante || 0,
      nonCurrentAssets: bp.ativoNaoCirculante || 0,
      totalLiabilities: bp.passivoTotal || 0,
      currentLiabilities: bp.passivoCirculante || 0,
      equity: bp.patrimonioLiquido || 0,

      liquidityCurrent: getInd('Liquidez Corrente', ['currentRatio', 'liquidezCorrente']) || (bp.passivoCirculante > 0 ? bp.ativoCirculante / bp.passivoCirculante : 0),
      liquidityImmediate: getInd('Liquidez Imediata', ['cashRatio', 'liquidezImediata']) || (bp.passivoCirculante > 0 ? (bp.caixaEquivalentes || 0) / bp.passivoCirculante : 0),
      liquidityDry: getInd('Liquidez Seca', ['quickRatio', 'liquidezSeca']) || (bp.passivoCirculante > 0 ? (bp.ativoCirculante - (bp.estoques || 0)) / bp.passivoCirculante : 0),
      liquidityGeneral: getInd('Liquidez Geral', ['liquidezGeral']) || ((bp.passivoCirculante + (bp.passivoNaoCirculante || 0)) > 0 ? (bp.ativoCirculante + (bp.realizavelLongoPrazo || 0)) / (bp.passivoCirculante + (bp.passivoNaoCirculante || 0)) : 0),

      workingCapital: bp.capitalGiroLiquido || getInd('Capital de Giro Líquido', ['workingCapital', 'CGL']),
      workingCapitalNeed: bp.necessidadeCapitalGiro || getInd('Necessidade de Capital de Giro', ['NCG']),
      treasuryBalance: bp.saldoTesouraria || getInd('Saldo de Tesouraria'),
      estimatedCashCycle: getInd('Ciclo Financeiro', ['cicloDeCaixa', 'cashCycle']),

      debtRatio: getInd('Endividamento Geral', ['debtRatio', 'Dependência de Capital de Terceiros', 'Dependência de Capital']) || (bp.ativoTotal > 0 ? bp.passivoTotal / bp.ativoTotal : 0),
      thirdPartyCapitalDependence: getInd('Dependência de Capital de Terceiros'),
      debtToEquity: getInd('Relação Dívida / Patrimônio Líquido', ['debtToEquity']),
      financialAutonomy: getInd('Autonomia Financeira', ['Índice de Autonomia Financeira', 'Autonomia', 'financialAutonomy']) || (bp.ativoTotal > 0 ? bp.patrimonioLiquido / bp.ativoTotal : 0),
      debtComposition: getInd('Composição do Endividamento', ['Composição do Exigível', 'debtComposition']) || (bp.passivoTotal > 0 ? bp.passivoCirculante / bp.passivoTotal : 0),

      assetConcentrationRisk: getInd('Concentração do Ativo', ['Concentração de Risco']),
      immobilizationOfEquity: getInd('Imobilização do Capital Próprio', ['Imobilização do Patrimônio Líquido', 'immobilizationOfEquity']),
      patrimonialIndex: getInd('Índice de Proteção Patrimonial'),

      growthTotalAssets: getInd('Crescimento do Ativo', ['Variação do Ativo Total', 'Asset Growth']),
      growthWorkingCapitalNeed: getInd('Variação da NCG', ['Crescimento da NCG']),
      growthEquity: getInd('Crescimento do PL', ['Variação do Patrimônio Líquido']),
      growthRevenue: getInd('Crescimento da Receita', ['Variação da Receita', 'Revenue Growth']),
      growthCurrentLiabilities: getInd('Variação do Passivo Circulante', ['Crescimento do Passivo Circulante']),

      liquidezReal: getInd('Liquidez Real') || 
        ((getInd('Passivo Circulante') || bp.passivoCirculante || 0) > 0 
          ? ((getInd('Ativo Circulante') || bp.ativoCirculante || 0) - (getInd('Estoques') || bp.estoques || 0)) / (getInd('Passivo Circulante') || bp.passivoCirculante || 1)
          : undefined),

      qualidadePatrimonioLiquido: (() => {
        const primary = getInd('Qualidade do Patrimônio Líquido');
        if (primary && primary !== 0) return primary;

        const pl = getInd('Patrimônio Líquido') || bp.patrimonioLiquido || 0;
        const lucros = getInd('Lucros Acumulados', ['lucrosPrejuizosAcumulados', 'retainedEarnings', 'lucrosPrejuizos', 'lucrosprejuizos']) || bp.lucrosPrejuizosAcumulados || bp.lucrosPrejuizos;
        const capital = getInd('Capital Social', ['capitalSocial', 'shareCapital', 'capitalsocial']) || bp.capitalSocial;

        if (pl > 0 && lucros !== undefined && lucros !== null && capital !== undefined && capital !== null) {
          if (capital < 1000 || capital < pl * 0.05) return 'LIMITED_EVIDENCE';
          return lucros / pl;
        }
        return undefined;
      })()
    };
  }
}
