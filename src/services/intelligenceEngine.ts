export const CURRENT_METHODOLOGY_VERSION = "Illumine Intelligence Engine v1.0";

const getVal = (data: any[], name: string) => data.find(d => d.category === name || d.conta === name)?.value || data.find(d => d.category === name || d.conta === name)?.valor || 0;

export const IntelligenceEngine = {
  processFinancialData: (currentDre: any[], currentBp: any[], version: string = CURRENT_METHODOLOGY_VERSION) => {
    // Extração de Dados
    const receita = getVal(currentDre, 'Receita Líquida');
    const ebitda = getVal(currentDre, 'EBITDA');
    const lucro = getVal(currentDre, 'Lucro Líquido');
    
    const ativoTotal = getVal(currentBp, 'Ativo Total');
    const pl = getVal(currentBp, 'Patrimônio Líquido');
    const ac = getVal(currentBp, 'Ativo Circulante');
    const pc = getVal(currentBp, 'Passivo Circulante');
    const pnc = getVal(currentBp, 'Passivo Não Circulante');
    const est = getVal(currentBp, 'Estoques');

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
