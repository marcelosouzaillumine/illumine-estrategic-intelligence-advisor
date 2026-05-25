import { BPSummary } from './bpEngine';
import { getIndustryWeights } from './industry-engine';

export interface FinancialMetrics {
  hasData: boolean;
  
  // Operacional
  ebitda: number;
  lucroLiquido: number;

  // Capital de Giro
  cgl: number;
  ncg: number;
  saldoTesouraria: number;
  capitalGiroMatematico: number;
  capitalGiroOperacional: number;
  margemErroOperacional: number;
  treasuryStatus: string;

  // Liquidez
  liqCorrente: number; // Contábil
  liqSeca: number; // Operacional
  liqImediata: number; // Imediata
  liqGeral: number;
  liquidezReal: number; // De Conversão
  liquidezDependenteEstoque: number; // Dependente de Estoque
  liquidezRealStatus: string;

  // Estrutura / Endividamento
  qualidadeEndividamento: number;
  dependenciaBancaria: number;
  indiceCapitalizacao: number;
  indiceDescapitalizacao: number;
  protecaoPatrimonial: number;
  autonomiaFinanceira: number;
  alavancagemPatrimonial: number;

  // Qualidade de Ativos
  concentracaoEstoque: number;
  ativosLiquidosReais: number;

  // Contextual Harmonized Metrics
  resilienciaGiro: number;
  absorcaoPrejuizo: number;
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
      hasData: false, ebitda: 0, lucroLiquido: 0,
      cgl: 0, ncg: 0, saldoTesouraria: 0,
      capitalGiroMatematico: 0, capitalGiroOperacional: 0, margemErroOperacional: 0,
      treasuryStatus: 'Pendente',
      liqCorrente: 0, liqSeca: 0, liqImediata: 0, liqGeral: 0, liquidezReal: 0, liquidezDependenteEstoque: 0, liquidezRealStatus: 'Pendente',
      qualidadeEndividamento: 0, dependenciaBancaria: 0, indiceCapitalizacao: 0,
      indiceDescapitalizacao: 0, protecaoPatrimonial: 0, autonomiaFinanceira: 0,
      alavancagemPatrimonial: 0, concentracaoEstoque: 0, ativosLiquidosReais: 0,
      resilienciaGiro: 0, absorcaoPrejuizo: 0
    };
  }

  // -- Inteligência de Capital de Giro --
  const cgl = ac - pc;
  const ncg = (clientes + est) - fornecedores;
  const saldoTesouraria = cgl - ncg;
  
  const capitalGiroMatematico = cgl;
  const capitalGiroOperacional = ncg > 0 ? (cgl / ncg) : (cgl > 0 ? 2 : 0);
  const margemErroOperacional = pc > 0 ? (saldoTesouraria / pc) : 0;

  // -- Qualidade e Dependência --
  const qualidadeEndividamento = passivoTotal > 0 ? (pc / passivoTotal) : 0;
  const dependenciaBancaria = passivoTotal > 0 ? (passivosFinanceiros / passivoTotal) : 0;

  // -- Estrutura Patrimonial --
  const indiceCapitalizacao = ativoTotal > 0 ? (plValue / ativoTotal) : 0;
  const indiceDescapitalizacao = capitalSocial > 0 ? (valorPrejuizo / capitalSocial) : 0;
  const protecaoPatrimonial = pc > 0 ? (plValue / pc) : 0;
  const autonomiaFinanceira = passivoTotal > 0 ? (plValue / passivoTotal) : 0;
  const alavancagemPatrimonial = plValue > 0 ? (ativoTotal / plValue) : 0;

  // -- Qualidade dos Ativos (Conversibilidade Ponderada por Indústria) --
  const creditosBaixaLiquidez = valConversibilidadeRestrita || 0;
  const concentracaoEstoque = ac > 0 ? (est / ac) : 0;
  
  const weights = getIndustryWeights(industry);
  
  const cxPonderado = cx * 1.0;
  const clientesPonderados = clientes * weights.receivablesConvertibility;
  const estoquesPonderados = est * weights.inventoryConvertibility;
  const sociosPonderados = creditosSocios * 0.20; // Default universally low
  
  const ativosLiquidosReais = Math.max(0, cxPonderado + clientesPonderados + estoquesPonderados + sociosPonderados - creditosBaixaLiquidez);

  // -- Liquidez Contextual --
  const liqCorrente = pc > 0 ? ac / pc : (ac > 0 ? 99.9 : 0);
  const liqSeca     = pc > 0 ? Math.max(0, ac - est) / pc : ((ac - est) > 0 ? 99.9 : 0);
  const liqImediata = pc > 0 ? cx / pc : (cx > 0 ? 99.9 : 0);
  const liqGeral    = (pc + pnc) > 0 ? ativoTotal / (pc + pnc) : (ativoTotal > 0 ? 99.9 : 0);
  const liquidezReal = pc > 0 ? (ativosLiquidosReais / pc) : (ativosLiquidosReais > 0 ? 99.9 : 0);
  const liquidezDependenteEstoque = pc > 0 ? (estoquesPonderados / pc) : 0;

  // Removido dscrSimulado (Delegado para o StressTestAdapter com base em DFC validada)

  // Resiliência de Giro: O quão robustos são os ativos líquidos em relação à NCG
  const resilienciaGiro = ncg > 0 ? (ativosLiquidosReais / ncg) : (ativosLiquidosReais > 0 ? 99.9 : 0);

  // Absorção de Prejuízo: o quanto do capital social está protegido contra o prejuízo atual
  const absorcaoPrejuizo = capitalSocial > 0 ? Math.max(0, 1 - indiceDescapitalizacao) : 0;
  
  // -- Helpers para Weighted Causal Inference --
  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
  const inverseLerp = (val: number, min: number, max: number) => clamp((val - min) / (max - min), 0, 1);

  // -- Inteligência de Tesouraria (Treasury Engine) com Weighted Score --
  const treasuryCashWeight = saldoTesouraria >= 0 ? 1.0 : inverseLerp(saldoTesouraria / (pc || 1), -0.2, 0.0);
  const treasuryMarginWeight = inverseLerp(margemErroOperacional, -0.2, weights.workingCapitalTolerance * 1.5);
  const treasuryLiquidityWeight = inverseLerp(liqImediata, 0.05, 0.3);
  
  const treasuryHealthScore = (treasuryCashWeight * 0.5) + (treasuryMarginWeight * 0.3) + (treasuryLiquidityWeight * 0.2);

  let treasuryStatus = 'Estável';
  if (treasuryHealthScore > 0.8) treasuryStatus = 'Robusta';
  else if (treasuryHealthScore > 0.5) treasuryStatus = 'Estável';
  else if (treasuryHealthScore > 0.3) treasuryStatus = 'Sensível';
  else if (treasuryHealthScore > 0.15) treasuryStatus = 'Pressionada';
  else treasuryStatus = 'Crítica';

  // -- Taxonomia da Liquidez Real com Weighted Score e Penalização Estrutural --
  const baseLiquidityScore = inverseLerp(liquidezReal, 0, 1.0);
  const rupturePenalty = (plValue < 0 ? 0.3 : 0) + (ebitda < 0 ? 0.2 : 0);
  const liquidityHealthScore = clamp(baseLiquidityScore - rupturePenalty, 0, 1);

  let liquidezRealStatus = 'Estável';
  if (liquidityHealthScore >= 0.85) liquidezRealStatus = 'Robusta';
  else if (liquidityHealthScore >= 0.6) liquidezRealStatus = 'Estável';
  else if (liquidityHealthScore >= 0.35) liquidezRealStatus = 'Sensível';
  else if (liquidityHealthScore >= 0.15) liquidezRealStatus = 'Fragilizada';
  else liquidezRealStatus = 'Crítica';

  return {
    hasData: true,
    ebitda,
    lucroLiquido,
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
