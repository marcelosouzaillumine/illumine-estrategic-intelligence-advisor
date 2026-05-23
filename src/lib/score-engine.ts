import { BPSummary } from './bpEngine';
import { FinancialMetrics } from './financial-engine';
import { getIndustryWeights } from './industry-engine';

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
  prevPl: number,
  industry?: string
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
    autonomiaFinanceira, ativosLiquidosReais, ebitda, lucroLiquido, liqSeca, liqImediata,
    dscrSimulado, resilienciaGiro, absorcaoPrejuizo, margemErroOperacional
  } = metrics;

  const { ativoCirculante: ac, passivoCirculante: pc, patrimonioLiquido: plValue, caixaEquivalentes: cx } = bpSummary;
  const weights = getIndustryWeights(industry);

  // -- 1. Liquidez (25%) --
  // Harmonização: Liquidez seca/real agora pesa mais, mas é amortecida se o giro do estoque for ágil (representado por cgl cobrindo ncg)
  let hsLiquidez = 0;
  if (liquidezReal >= 1.2) hsLiquidez = 100;
  else if (liquidezReal >= 0.8) hsLiquidez = 75 + ((liquidezReal - 0.8) / 0.4) * 25;
  else if (liquidezReal >= 0.5) hsLiquidez = 40 + ((liquidezReal - 0.5) / 0.3) * 35;
  else hsLiquidez = Math.max(0, liquidezReal * 80);

  // Regra Estrutural de Calibração: Se possui liquidez corrente e capital de giro saudáveis, preserva pontuação mínima
  if (liqCorrente > 1 && cgl > 0) {
    hsLiquidez = Math.max(hsLiquidez, 50);
  }

  // Buffer: Se tesouraria for extremamente positiva, empurra liquidez pra cima.
  if (saldoTesouraria > (ac * 0.2) && hsLiquidez < 80) {
    hsLiquidez = Math.min(100, hsLiquidez + 20);
  }

  // -- 2. Estrutura e Endividamento (20%) --
  let hsEstrutura = 0;
  // Menor dependência bancária e boa qualidade de dívida (mais longo prazo)
  let qualScore = 100 - (qualidadeEndividamento * 100);
  let depScore = 100 - (dependenciaBancaria * 100);
  hsEstrutura = (Math.max(0, qualScore) * 0.5) + (Math.max(0, depScore) * 0.5);

  // -- 3. Capital de Giro (15%) --
  let hsCapitalGiro = 0;
  if (ncg <= 0 && cgl > 0) {
    hsCapitalGiro = 100; // Giro plenamente autofinanciado
  } else {
    // Proporção do CGL frente a NCG (Resiliência de Giro)
    let cglCov = ncg > 0 ? (cgl / ncg) : 0;
    if (cglCov >= 1.2) hsCapitalGiro = 100;
    else if (cglCov >= 1) hsCapitalGiro = 85;
    else if (cglCov >= 0.5) hsCapitalGiro = 50 + (cglCov - 0.5) * 70;
    else hsCapitalGiro = Math.max(0, cglCov * 100);
  }
  
  // Refinamento Executivo: Se a margem de erro operacional (Tesouraria / PC) for criticamente baixa para o setor, limitamos a nota.
  if (margemErroOperacional > 0 && margemErroOperacional < weights.workingCapitalTolerance && hsCapitalGiro > 70) {
    hsCapitalGiro = 70; // Trava para empresas com tesouraria positiva, mas asfixiante
  }

  // -- 4. Patrimonial (Solidez) (20%) --
  let hsPatrimonial = 0;
  if (plValue > 0) {
    hsPatrimonial = autonomiaFinanceira * 100;
    // Bônus para absorção plena de prejuízos acumulados
    if (absorcaoPrejuizo === 1) hsPatrimonial = Math.min(100, hsPatrimonial + 20);
    else hsPatrimonial = Math.max(0, hsPatrimonial - (indiceDescapitalizacao * 50));
  } else {
    hsPatrimonial = 0; // Insolvência técnica zera a dimensão patrimonial
  }

  // -- 5. Evolução (10%) --
  let hsEvolucao = 50;
  if (prevPl > 0) {
    const growth = ((plValue / prevPl) - 1);
    if (growth > 0.1) hsEvolucao = 100;
    else if (growth > 0) hsEvolucao = 75;
    else if (growth > -0.1) hsEvolucao = 25;
    else hsEvolucao = 0;
  }

  // -- 6. Qualidade dos Ativos (Extra, peso indireto) --
  let hsQualidadeAtivos = 0;
  if (ac > 0) {
    const ratio = ativosLiquidosReais / ac;
    if (ratio > 0.7) hsQualidadeAtivos = 100;
    else if (ratio > 0.4) hsQualidadeAtivos = 50;
    else if (ratio > 0.2) hsQualidadeAtivos = 20;
  }

  // -- 7. Operacional (10%) --
  let hsOperacional = 50;
  if (dreDbDataLength > 0) {
    if (ebitda > 0 && lucroLiquido > 0) hsOperacional = 100;
    else if (ebitda > 0) hsOperacional = 70;
    else hsOperacional = 0;
  }

  // -- RESILIÊNCIA GLOBAL (SCORE PATRIMONIAL FINAL) --
  let resilienciaGlobal = (
    (hsLiquidez * 0.25) + 
    (hsEstrutura * 0.20) + 
    (hsCapitalGiro * 0.15) + 
    (hsPatrimonial * 0.20) + 
    (hsEvolucao * 0.10) +
    (hsOperacional * 0.10)
  );

  // --- HARMONIZAÇÃO: LIMITADORES CONTEXTUAIS ---
  // Ao invés de cortar pontos rigidamente, limitamos o teto baseado na gravidade do conjunto causal.
  
  if (plValue < 0) {
    // Insolvência Técnica: Não pode ter score de empresa estável, mas se tem geração de caixa (EBITDA), não morre em zero.
    const maxScore = ebitda > 0 ? 45 : 15;
    resilienciaGlobal = Math.min(resilienciaGlobal, maxScore);
  }

  // Falta de liquidez severa limitando a resiliência geral, MAS fortemente amortecido se EBITDA for forte
  if (liquidezReal < 0.5) {
    let teto = 45;
    if (plValue > 0 && ebitda > 0) {
      teto = (cgl > 0) ? 75 : 65; // Elasticidade provada pelo PL, Ebitda e giro
    }
    resilienciaGlobal = Math.min(resilienciaGlobal, teto);
  }

  // Passivo Circulante asfixiante
  if (pc > ac && plValue > 0) {
    const teto = (ebitda > 0) ? 75 : 55;
    resilienciaGlobal = Math.min(resilienciaGlobal, teto);
  }

  // -- ÍNDICE DE CONTINUIDADE EMPRESARIAL (ICE) --
  // Foca estritamente na capacidade de manter a operação rodando no curtíssimo/médio prazo
  let iceBase = 100;
  
  // Penalizações Causais Suaves
  if (plValue < 0) iceBase -= 20; 
  if (ebitda < 0) iceBase -= 15; 
  
  // Pressão de Tesouraria e Margem de Erro
  if (saldoTesouraria < 0) iceBase -= 15; // Voltou a ter mais peso se estiver queimando caixa
  else if (margemErroOperacional < weights.workingCapitalTolerance) iceBase -= 5; // Penaliza tesouraria apertada
  
  // Liquidez Crítica (mas sem dramatização se houver elasticidade)
  if (liquidezReal < weights.idealCurrentLiquidity * 0.5) {
    if (plValue > 0 && ebitda > 0 && cgl > 0 && margemErroOperacional > weights.workingCapitalTolerance) {
      iceBase -= 0; // Protegida pela estrutura elástica e folga de tesouraria
    } else if (ebitda > 0 && dscrSimulado > 1) {
      iceBase -= 5; // Amortecimento pelo fluxo operacional
    } else {
      iceBase -= 15;
    }
  }

  // Descapitalização Progressiva Corrosiva
  if (indiceDescapitalizacao > 0.5 && plValue > 0) iceBase -= 10;
  if (dependenciaBancaria > 0.5) iceBase -= 10;

  let scoreIce = Math.max(0, Math.min(100, iceBase));

  // Trava final estrutural: Ruptura requer colapso em múltiplas dimensões, não apenas liquidez.
  if (ebitda < 0 && liquidezReal < 0.2 && plValue < 0) {
    scoreIce = Math.min(scoreIce, 15);
  }

  // Piso de Elasticidade Financeira
  const isHighElasticity = plValue > 0 && cgl > 0 && dependenciaBancaria < 0.3 && ebitda > 0;
  if (isHighElasticity) {
    resilienciaGlobal = Math.max(resilienciaGlobal, 70); // Garante mínimo de "Sensível/Estável"
    scoreIce = Math.max(scoreIce, 75); // Garante continuidade livre de ruptura
  }

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
