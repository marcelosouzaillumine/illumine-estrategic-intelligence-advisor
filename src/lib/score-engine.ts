import { BPSummary } from './bpEngine';
import { FinancialMetrics } from './financial-engine';

export interface ScoreMetrics {
  hsLiquidez: number;
  hsEstrutura: number;
  hsCapitalGiro: number;
  hsPatrimonial: number;
  hsEvolucao: number;
  hsQualidadeAtivos: number;
  hsOperacional: number;
  resilienciaGlobal: number; // The final 0-100 score
  indiceContinuidade: number; // Another score used for continuity
}

export function calculateScores(
  bpSummary: BPSummary,
  metrics: FinancialMetrics,
  dreDbDataLength: number,
  prevPl: number
): ScoreMetrics {
  if (!metrics.hasData) {
    return {
      hsLiquidez: 0, hsEstrutura: 0, hsCapitalGiro: 0, hsPatrimonial: 0,
      hsEvolucao: 0, hsQualidadeAtivos: 0, hsOperacional: 0,
      resilienciaGlobal: 0, indiceContinuidade: 0
    };
  }

  const {
    liqCorrente, liquidezReal, saldoTesouraria, cgl, ncg, concentracaoEstoque,
    qualidadeEndividamento, dependenciaBancaria, indiceDescapitalizacao,
    autonomiaFinanceira, ativosLiquidosReais, ebitda, lucroLiquido, liqSeca, liqImediata
  } = metrics;

  const { ativoCirculante: ac, passivoCirculante: pc, patrimonioLiquido: plValue, ativoTotal, caixaEquivalentes: cx } = bpSummary;

  // -- 1. Liquidez (25%) --
  let hsLiquidez = 0;
  if (liqCorrente > 1.2) hsLiquidez += 40; else if (liqCorrente > 1) hsLiquidez += 20;
  if (liquidezReal > 1) hsLiquidez += 30; else if (liquidezReal > 0.8) hsLiquidez += 15;
  if (saldoTesouraria > 0) hsLiquidez += 30; else if (cgl > 0) hsLiquidez += 15;

  // TRAVA: Regra 3 (Liquidez Real Severamente Comprometida)
  if (liquidezReal < 0.5) {
    hsLiquidez = Math.min(hsLiquidez, 30);
  }

  // -- 2. Estrutura (25%) --
  let hsEstrutura = 0;
  if (qualidadeEndividamento < 0.4) hsEstrutura += 50; else if (qualidadeEndividamento < 0.7) hsEstrutura += 25;
  if (dependenciaBancaria < 0.3) hsEstrutura += 50; else if (dependenciaBancaria < 0.6) hsEstrutura += 25;

  // -- 3. Capital de Giro (20%) --
  let hsCapitalGiro = 0;
  if (ncg < ac * 0.5) hsCapitalGiro += 50; else if (ncg < ac * 0.8) hsCapitalGiro += 25;
  if (concentracaoEstoque < 0.2) hsCapitalGiro += 50; else if (concentracaoEstoque < 0.4) hsCapitalGiro += 25;

  // TRAVA: Regra 2 (Tesouraria Estruturalmente Negativa)
  if (cgl < 0 && saldoTesouraria < 0) {
    hsCapitalGiro = Math.min(hsCapitalGiro, 20);
  }

  // -- 4. Patrimonial (Solidez) (20%) --
  let hsPatrimonial = 0;
  if (indiceDescapitalizacao === 0) hsPatrimonial += 40; else if (indiceDescapitalizacao < 0.2) hsPatrimonial += 20;
  if (autonomiaFinanceira > 0.5) hsPatrimonial += 60; else if (autonomiaFinanceira > 0.2) hsPatrimonial += 30;

  // -- 5. Evolução (10%) --
  let hsEvolucao = 50;
  if (prevPl > 0) {
    const growth = ((plValue / prevPl) - 1);
    if (growth > 0.1) hsEvolucao = 100;
    else if (growth > 0) hsEvolucao = 75;
    else if (growth > -0.1) hsEvolucao = 25;
    else hsEvolucao = 0;
  }

  // -- 6. Qualidade dos Ativos (Extra, pode não compor o resilienciaGlobal oficial, mas mantido por legado) --
  let hsQualidadeAtivos = 0;
  if (ac > 0) {
    const ratio = ativosLiquidosReais / ac;
    if (ratio > 0.7) hsQualidadeAtivos += 100;
    else if (ratio > 0.4) hsQualidadeAtivos += 50;
    else if (ratio > 0.2) hsQualidadeAtivos += 20;
  }

  // -- 7. Operacional --
  let hsOperacional = 50;
  if (dreDbDataLength > 0) {
    hsOperacional = 0;
    if (ebitda > 0) hsOperacional += 60;
    if (lucroLiquido > 0) hsOperacional += 40;
  }

  // -- RESILIÊNCIA GLOBAL (SCORE PATRIMONIAL FINAL) --
  let resilienciaGlobal = (
    (hsLiquidez * 0.25) + 
    (hsEstrutura * 0.25) + 
    (hsCapitalGiro * 0.20) + 
    (hsPatrimonial * 0.20) + 
    (hsEvolucao * 0.10)
  );

  // --- APLICAÇÃO DE TRAVAS ESTRUTURAIS MANDATÓRIAS ---

  // Regra 1 e 1.1: Patrimônio Líquido Negativo e EBITDA
  if (plValue < 0) {
    if (ebitda > 0) {
      // Regra 1.1: Score sugerido entre 10 e 24, salvo exceções críticas
      resilienciaGlobal = Math.max(10, Math.min(resilienciaGlobal, 24));
      // Se houver fator agravante crítico (Tesouraria negativa ou Liquidez real severa), quebra o piso de 10
      if (liquidezReal < 0.5 || saldoTesouraria < 0) {
        resilienciaGlobal = Math.max(0, resilienciaGlobal - 15);
      }
    } else {
      // Regra 1 pura: Max 35
      resilienciaGlobal = Math.min(resilienciaGlobal, 35);
    }
  } 
  
  // Regra 3 (Adicional de penalidade)
  if (liquidezReal < 0.5) {
    resilienciaGlobal = Math.max(0, resilienciaGlobal - 15);
  }

  // Regra 4: Passivo Circulante Excessivo (PC > AC ou seja LiqCorrente < 1)
  if (pc > ac) {
    resilienciaGlobal = Math.min(resilienciaGlobal, 60);
  }

  // Outras penalizações estruturais (Herdadas)
  if (indiceDescapitalizacao > 0.5) {
    resilienciaGlobal = Math.max(0, resilienciaGlobal - 20);
  }
  
  // Trava de Solidez (Não pode ter score alto se a tesouraria está muito negativa ou ebitda negativo e margem zerada)
  if (ebitda < 0 && saldoTesouraria < 0 && plValue > 0) {
      resilienciaGlobal = Math.min(resilienciaGlobal, 45); // Força para estrutura fragilizada
  }
  
  // Piso de score para empresa com continuidade viável (PL e EBITDA positivos)
  if (plValue > 0 && ebitda > 0 && resilienciaGlobal < 15) {
      resilienciaGlobal = 15;
  }

  // -- ÍNDICE DE CONTINUIDADE EMPRESARIAL (ICE) --
  let scoreIce = 100;
  if (plValue < 0) scoreIce -= 30; 
  else if (autonomiaFinanceira < 0.15) scoreIce -= 10;
  
  if (ebitda < 0) scoreIce -= 25; 
  if (saldoTesouraria < 0) scoreIce -= 10; 
  if (liquidezReal < 0) scoreIce -= 10;
  if (cgl < 0) scoreIce -= 10;
  if (liqSeca < 0.8) scoreIce -= 5;
  if (plValue < 0 || indiceDescapitalizacao > 0.5) scoreIce -= 5; // isEroding
  if (dependenciaBancaria > 0.4) scoreIce -= 10;
  if (pc > 0 && cx < pc * 0.1) scoreIce -= 5;
  
  if (liquidezReal < 0.5) scoreIce -= 15; // Regra 3 ICE penalty

  scoreIce = Math.max(0, scoreIce);

  return {
    hsLiquidez,
    hsEstrutura,
    hsCapitalGiro,
    hsPatrimonial,
    hsEvolucao,
    hsQualidadeAtivos,
    hsOperacional,
    resilienciaGlobal,
    indiceContinuidade: scoreIce
  };
}
