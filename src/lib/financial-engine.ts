import { BPSummary } from './bpEngine';
import { getIndustryWeights } from './industry-engine';

export interface FinancialMetrics {
  hasData: boolean;
  
  // Operacional
  ebitda: number | null;
  lucroLiquido: number | null;

  // Capital de Giro
  cgl: number | null;
  ncg: number | null;
  saldoTesouraria: number | null;
  capitalGiroMatematico: number | null;
  capitalGiroOperacional: number | null;
  margemErroOperacional: number | null;
  treasuryStatus: string;

  // Liquidez
  liqCorrente: number | null; // Contábil
  liqSeca: number | null; // Operacional
  liqImediata: number | null; // Imediata
  liqGeral: number | null;
  liquidezReal: number | null; // De Conversão
  liquidezDependenteEstoque: number | null; // Dependente de Estoque
  liquidezRealStatus: string;

  // Estrutura / Endividamento
  qualidadeEndividamento: number | null;
  dependenciaBancaria: number | null;
  indiceCapitalizacao: number | null;
  indiceDescapitalizacao: number | null;
  protecaoPatrimonial: number | null;
  autonomiaFinanceira: number | null;
  alavancagemPatrimonial: number | null;

  // Qualidade de Ativos
  concentracaoEstoque: number | null;
  ativosLiquidosReais: number | null;

  // Contextual Harmonized Metrics
  resilienciaGiro: number | null;
  absorcaoPrejuizo: number | null;
}

export function calculateFinancialMetrics(
  bpSummary: BPSummary,
  ebitda: number,
  lucroLiquido: number,
  industry?: string
): FinancialMetrics {
  const {
    ativoTotal,
    ativoCirculante: ac,
    ativoNaoCirculante: anc,
    passivoTotal,
    passivoCirculante: pc,
    passivoNaoCirculante: pnc,
    patrimonioLiquido: plValue,
    caixaEquivalentes: cx,
    estoques: est,
    clientes,
    fornecedores,
    passivosFinanceiros,
    capitalSocial,
    lucrosPrejuizos: valorPrejuizo,
    restritaConversibilidade: valConversibilidadeRestrita,
    creditosSocios
  } = bpSummary || {} as any;

  const hasData = (ativoTotal || 0) > 0 || (passivoTotal || 0) > 0 || (plValue || 0) > 0;
  
  if (!hasData) {
    return {
      hasData: false, ebitda: null, lucroLiquido: null,
      cgl: null, ncg: null, saldoTesouraria: null,
      capitalGiroMatematico: null, capitalGiroOperacional: null, margemErroOperacional: null,
      treasuryStatus: 'Pendente',
      liqCorrente: null, liqSeca: null, liqImediata: null, liqGeral: null, liquidezReal: null, liquidezDependenteEstoque: null, liquidezRealStatus: 'Pendente',
      qualidadeEndividamento: null, dependenciaBancaria: null, indiceCapitalizacao: null,
      indiceDescapitalizacao: null, protecaoPatrimonial: null, autonomiaFinanceira: null,
      alavancagemPatrimonial: null, concentracaoEstoque: null, ativosLiquidosReais: null,
      resilienciaGiro: null, absorcaoPrejuizo: null
    };
  }

  // Helper check for missing variables
  const isMissing = (v: any) => v === undefined || v === null;

  // -- Inteligência de Capital de Giro --
  const cgl = (isMissing(ac) || isMissing(pc)) ? null : ac - pc;
  const ncg = (isMissing(clientes) || isMissing(est) || isMissing(fornecedores)) ? null : (clientes + est) - fornecedores;
  const saldoTesouraria = (cgl === null || ncg === null) ? null : cgl - ncg;
  
  const capitalGiroMatematico = cgl;
  const capitalGiroOperacional = (cgl === null || ncg === null || ncg === 0) ? null : cgl / ncg;
  const margemErroOperacional = (saldoTesouraria === null || isMissing(pc) || pc === 0) ? null : saldoTesouraria / pc;

  // -- Qualidade e Dependência --
  const qualidadeEndividamento = (isMissing(pc) || isMissing(passivoTotal) || passivoTotal === 0) ? null : pc / passivoTotal;
  const dependenciaBancaria = (isMissing(passivosFinanceiros) || isMissing(passivoTotal) || passivoTotal === 0) ? null : passivosFinanceiros / passivoTotal;

  // -- Estrutura Patrimonial --
  const indiceCapitalizacao = (isMissing(plValue) || isMissing(ativoTotal) || ativoTotal === 0) ? null : plValue / ativoTotal;
  const indiceDescapitalizacao = (isMissing(valorPrejuizo) || isMissing(capitalSocial) || capitalSocial === 0) ? null : valorPrejuizo / capitalSocial;
  const protecaoPatrimonial = (isMissing(plValue) || isMissing(pc) || pc === 0) ? null : plValue / pc;
  const autonomiaFinanceira = (isMissing(plValue) || isMissing(passivoTotal) || passivoTotal === 0) ? null : plValue / passivoTotal;
  const alavancagemPatrimonial = (isMissing(ativoTotal) || isMissing(plValue) || plValue === 0) ? null : ativoTotal / plValue;

  // -- Qualidade dos Ativos (Conversibilidade Ponderada por Indústria) --
  const creditosBaixaLiquidez = valConversibilidadeRestrita || 0;
  const concentracaoEstoque = (isMissing(est) || isMissing(ac) || ac === 0) ? null : est / ac;
  
  const weights = getIndustryWeights(industry);
  
  const isAtivosLiquidosReaisMissing = isMissing(cx) || isMissing(clientes) || isMissing(est);
  const ativosLiquidosReais = isAtivosLiquidosReaisMissing 
    ? null 
    : Math.max(0, cx * 1.0 + clientes * weights.receivablesConvertibility + est * weights.inventoryConvertibility + (creditosSocios || 0) * 0.20 - creditosBaixaLiquidez);

  // -- Liquidez Contextual --
  const liqCorrente = (isMissing(ac) || isMissing(pc) || pc === 0) ? null : ac / pc;
  const liqSeca     = (isMissing(ac) || isMissing(est) || isMissing(pc) || pc === 0) ? null : Math.max(0, ac - est) / pc;
  const liqImediata = (isMissing(cx) || isMissing(pc) || pc === 0) ? null : cx / pc;
  const liqGeral    = (isMissing(ativoTotal) || isMissing(pc) || isMissing(pnc) || (pc + pnc) === 0) ? null : ativoTotal / (pc + pnc);
  const liquidezReal = (ativosLiquidosReais === null || isMissing(pc) || pc === 0) ? null : ativosLiquidosReais / pc;
  const liquidezDependenteEstoque = (isMissing(est) || isMissing(pc) || pc === 0) ? null : (est * weights.inventoryConvertibility) / pc;

  // Resiliência de Giro: O quão robustos são os ativos líquidos em relação à NCG
  const resilienciaGiro = (ativosLiquidosReais === null || ncg === null || ncg === 0) ? null : ativosLiquidosReais / ncg;

  // Absorção de Prejuízo: o quanto do capital social está protegido contra o prejuízo atual
  const absorcaoPrejuizo = (isMissing(capitalSocial) || indiceDescapitalizacao === null || capitalSocial === 0) ? null : Math.max(0, 1 - indiceDescapitalizacao);
  
  // -- Helpers para Weighted Causal Inference --
  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
  const inverseLerp = (val: number, min: number, max: number) => clamp((val - min) / (max - min), 0, 1);

  // -- Inteligência de Tesouraria (Treasury Engine) com Weighted Score --
  let treasuryStatus = 'Estável';
  if (saldoTesouraria !== null && margemErroOperacional !== null && liqImediata !== null) {
    const treasuryCashWeight = saldoTesouraria >= 0 ? 1.0 : inverseLerp(saldoTesouraria / (pc || 1), -0.2, 0.0);
    const treasuryMarginWeight = inverseLerp(margemErroOperacional, -0.2, weights.workingCapitalTolerance * 1.5);
    const treasuryLiquidityWeight = inverseLerp(liqImediata, 0.05, 0.3);
    
    const treasuryHealthScore = (treasuryCashWeight * 0.5) + (treasuryMarginWeight * 0.3) + (treasuryLiquidityWeight * 0.2);

    if (treasuryHealthScore > 0.8) treasuryStatus = 'Robusta';
    else if (treasuryHealthScore > 0.5) treasuryStatus = 'Estável';
    else if (treasuryHealthScore > 0.3) treasuryStatus = 'Sensível';
    else if (treasuryHealthScore > 0.15) treasuryStatus = 'Pressionada';
    else treasuryStatus = 'Crítica';
  } else {
    treasuryStatus = 'Dados Insuficientes';
  }

  // -- Taxonomia da Liquidez Real com Weighted Score e Penalização Estrutural --
  let liquidezRealStatus = 'Estável';
  if (liquidezReal !== null && plValue !== undefined && plValue !== null && ebitda !== undefined && ebitda !== null) {
    const baseLiquidityScore = inverseLerp(liquidezReal, 0, 1.0);
    const rupturePenalty = (plValue < 0 ? 0.3 : 0) + (ebitda < 0 ? 0.2 : 0);
    const liquidityHealthScore = clamp(baseLiquidityScore - rupturePenalty, 0, 1);

    if (liquidityHealthScore >= 0.85) liquidezRealStatus = 'Robusta';
    else if (liquidityHealthScore >= 0.6) liquidezRealStatus = 'Estável';
    else if (liquidityHealthScore >= 0.35) liquidezRealStatus = 'Sensível';
    else if (liquidityHealthScore >= 0.15) liquidezRealStatus = 'Fragilizada';
    else liquidezRealStatus = 'Crítica';
  } else {
    liquidezRealStatus = 'Dados Insuficientes';
  }

  return {
    hasData: true,
    ebitda: isMissing(ebitda) ? null : ebitda,
    lucroLiquido: isMissing(lucroLiquido) ? null : lucroLiquido,
    cgl,
    ncg,
    saldoTesouraria,
    capitalGiroMatematico,
    capitalGiroOperacional,
    margemErroOperacional,
    treasuryStatus,
    liqCorrente,
    liqSeca,
    liqImediata,
    liqGeral,
    liquidezReal,
    liquidezDependenteEstoque,
    liquidezRealStatus,
    qualidadeEndividamento,
    dependenciaBancaria,
    indiceCapitalizacao,
    indiceDescapitalizacao,
    protecaoPatrimonial,
    autonomiaFinanceira,
    alavancagemPatrimonial,
    concentracaoEstoque,
    ativosLiquidosReais,
    resilienciaGiro,
    absorcaoPrejuizo
  };
}
