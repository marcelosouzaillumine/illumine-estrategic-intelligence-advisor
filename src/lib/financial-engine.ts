import { BPSummary } from './bpEngine';

export interface FinancialMetrics {
  hasData: boolean;
  
  // Operacional
  ebitda: number;
  lucroLiquido: number;

  // Capital de Giro
  cgl: number;
  ncg: number;
  saldoTesouraria: number;

  // Liquidez
  liqCorrente: number;
  liqSeca: number;
  liqImediata: number;
  liqGeral: number;
  liquidezReal: number;

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
}

export function calculateFinancialMetrics(
  bpSummary: BPSummary,
  ebitda: number,
  lucroLiquido: number
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
      liqCorrente: 0, liqSeca: 0, liqImediata: 0, liqGeral: 0, liquidezReal: 0,
      qualidadeEndividamento: 0, dependenciaBancaria: 0, indiceCapitalizacao: 0,
      indiceDescapitalizacao: 0, protecaoPatrimonial: 0, autonomiaFinanceira: 0,
      alavancagemPatrimonial: 0, concentracaoEstoque: 0, ativosLiquidosReais: 0
    };
  }

  // -- Inteligência de Capital de Giro --
  const cgl = ac - pc;
  const ncg = (clientes + est) - fornecedores;
  const saldoTesouraria = cgl - ncg;

  // -- Qualidade e Dependência --
  const qualidadeEndividamento = passivoTotal > 0 ? (pc / passivoTotal) : 0;
  const dependenciaBancaria = passivoTotal > 0 ? (passivosFinanceiros / passivoTotal) : 0;

  // -- Estrutura Patrimonial --
  const indiceCapitalizacao = ativoTotal > 0 ? (plValue / ativoTotal) : 0;
  const indiceDescapitalizacao = capitalSocial > 0 ? (valorPrejuizo / capitalSocial) : 0;
  const protecaoPatrimonial = pc > 0 ? (plValue / pc) : 0;
  const autonomiaFinanceira = passivoTotal > 0 ? (plValue / passivoTotal) : 0;
  const alavancagemPatrimonial = plValue > 0 ? (ativoTotal / plValue) : 0;

  // -- Qualidade dos Ativos --
  const creditosBaixaLiquidez = valConversibilidadeRestrita || 0;
  const concentracaoEstoque = ac > 0 ? (est / ac) : 0;
  const ativosLiquidosReais = ac - est - creditosSocios - creditosBaixaLiquidez;

  // -- Liquidez --
  const liqCorrente = pc > 0 ? ac / pc : (ac > 0 ? 99.9 : 0);
  const liqSeca     = pc > 0 ? (ac - est) / pc : ((ac - est) > 0 ? 99.9 : 0);
  const liqImediata = pc > 0 ? cx / pc : (cx > 0 ? 99.9 : 0);
  const liqGeral    = (pc + pnc) > 0 ? ativoTotal / (pc + pnc) : (ativoTotal > 0 ? 99.9 : 0);
  const liquidezReal = pc > 0 ? (ativosLiquidosReais / pc) : (ativosLiquidosReais > 0 ? 99.9 : 0);

  return {
    hasData: true,
    ebitda,
    lucroLiquido,
    cgl,
    ncg,
    saldoTesouraria,
    liqCorrente,
    liqSeca,
    liqImediata,
    liqGeral,
    liquidezReal,
    qualidadeEndividamento,
    dependenciaBancaria,
    indiceCapitalizacao,
    indiceDescapitalizacao,
    protecaoPatrimonial,
    autonomiaFinanceira,
    alavancagemPatrimonial,
    concentracaoEstoque,
    ativosLiquidosReais
  };
}
