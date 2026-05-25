import { buildBPHierarchy } from '../lib/bpEngine';

export const CURRENT_METHODOLOGY_VERSION = "Illumine Intelligence Engine v1.1";

const getVal = (data: any[], names: string[]) => {
  const lowerNames = names.map(n => n.toLowerCase());
  const found = data.find(d => {
    const cat = (d.category || d.conta || '').toLowerCase();
    return lowerNames.includes(cat);
  });
  return found?.value || found?.valor || 0;
};

export const IntelligenceEngine = {
  processFinancialData: (currentDre: any[], currentBp: any[], version: string = CURRENT_METHODOLOGY_VERSION) => {
    // Extração de Dados DRE
    const receita = getVal(currentDre, ['Receita Líquida', 'Receita Operacional Bruta', 'Receitas']);
    const ebitda = getVal(currentDre, ['EBITDA', 'LAJIDA']);
    const lucro = getVal(currentDre, ['Lucro Líquido', 'Resultado Líquido']);
    
    // Extração de Dados BP (Robusta com bpEngine)
    const bpSummary = currentBp.length > 0 ? buildBPHierarchy(currentBp).summary : null;
    
    const ativoTotal = bpSummary?.ativoTotal || getVal(currentBp, ['Ativo Total', 'Ativo']);
    const pl = bpSummary?.patrimonioLiquido || getVal(currentBp, ['Patrimônio Líquido', 'PL']);
    const ac = bpSummary?.ativoCirculante || getVal(currentBp, ['Ativo Circulante']);
    const pc = bpSummary?.passivoCirculante || getVal(currentBp, ['Passivo Circulante']);
    const pnc = bpSummary?.passivoNaoCirculante || getVal(currentBp, ['Passivo Não Circulante']);
    const est = bpSummary?.estoques || getVal(currentBp, ['Estoques', 'Estoque']);

    // Cálculos Lógicos (Padrão v1.0)
    let roe = pl > 0 ? (lucro / pl) * 100 : 0;
    let investedCapital = pl + pnc;
    let noplat = ebitda * 0.66; 
    let roic = investedCapital > 0 ? (noplat / investedCapital) * 100 : 0;
    
    let costOfEquity = 0.15;
    let costOfDebt = 0.12;

    // Se no futuro houver v2.0, podemos ajustar pesos e fórmulas aqui
    if (version === "Illumine Intelligence Engine v2.0") {
      // Exemplo fictício de mudança metodológica
      costOfEquity = 0.16;
      costOfDebt = 0.11;
      noplat = ebitda * 0.70; // Nova alíquota presumida
      roic = investedCapital > 0 ? (noplat / investedCapital) * 100 : 0;
    }

    let wacc = investedCapital > 0 ? ((pl / investedCapital) * costOfEquity + (pnc / investedCapital) * costOfDebt) * 100 : 0;
    let eva = investedCapital > 0 ? (investedCapital * (roic - wacc) / 100) : 0;
    let dscr = (pnc > 0) ? (ebitda / (pnc / 12)) : 0;

    let totalThirdParty = pc + pnc;
    let ct = totalThirdParty > 0 ? (pc / totalThirdParty) * 100 : 0;
    let ce = totalThirdParty > 0 ? (pnc / totalThirdParty) * 100 : 0;
    let impl = pl > 0 ? (totalThirdParty / pl) * 100 : 0;
    let irpc = totalThirdParty > 0 ? (pc / totalThirdParty) * 100 : 0;
    let gaf = (pl > 0 && lucro > 0) ? ((ebitda) / (lucro)) : 0;

    return {
      methodologyVersion: version,
      processedAt: new Date().toISOString(),
      metrics: {
        receita, ebitda, lucro, ativoTotal, pl, ac, pc, pnc, est,
        roe, investedCapital, noplat, roic, wacc, eva, dscr,
        totalThirdParty, ct, ce, impl, irpc, gaf
      }
    };
  }
};
