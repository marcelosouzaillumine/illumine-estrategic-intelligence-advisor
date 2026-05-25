import { BPSummary } from './bpEngine';
import { FinancialMetrics } from './financial-engine';
import { getIndustryWeights } from './industry-engine';
import { BusinessIdentity } from './business-identity-engine';
import { MasterCausalOutput } from './master-causal-engine';

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
  identity: Readonly<BusinessIdentity>,
  causality?: MasterCausalOutput
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
    resilienciaGiro, absorcaoPrejuizo, margemErroOperacional
  } = metrics;

  const { ativoCirculante: ac, passivoCirculante: pc, patrimonioLiquido: plValue, caixaEquivalentes: cx } = bpSummary;
  const weights = getIndustryWeights(identity.setor);

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
  // Integrado à Institutional Memory: Não premiar evolução se histórico < 3
  let hsEvolucao = 50;
  if (dreDbDataLength >= 3 && prevPl > 0) {
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

  let resilienciaGlobal = (
    (hsLiquidez * 0.25) + 
    (hsEstrutura * 0.20) + 
    (hsCapitalGiro * 0.15) + 
    (hsPatrimonial * 0.20) + 
    (hsEvolucao * 0.10) +
    (hsOperacional * 0.10)
  );

  // O Indice de Continuidade Base sem os limitadores
  let scoreIce = resilienciaGlobal; // Simplificado temporariamente, o Causal é que vai travar

  // --- HARMONIZAÇÃO: LIMITADORES CAUSAIS (MASTER CAUSAL ENGINE) ---
  if (causality && causality.scenarios) {
    const corrosao = causality.scenarios.find(s => s.id === 'CORROSAO_PATRIMONIAL');
    const pressao = causality.scenarios.find(s => s.id === 'PRESSAO_ESTRUTURAL');
    const dependente = causality.scenarios.find(s => s.id === 'OP_DEPENDENTE_GIRO');
    const resiliencia = causality.scenarios.find(s => s.id === 'RESILIENCIA_LIMITADA');

    if (corrosao) {
      const limit = corrosao.severity === 'Crítica' ? 15 : (corrosao.severity === 'Alta' ? 30 : 50);
      resilienciaGlobal = Math.min(resilienciaGlobal, limit);
      scoreIce = Math.min(scoreIce, limit);
    } else if (pressao) {
      const limit = pressao.severity === 'Crítica' ? 30 : (pressao.severity === 'Alta' ? 45 : 65);
      resilienciaGlobal = Math.min(resilienciaGlobal, limit);
      scoreIce = Math.min(scoreIce, limit - 5);
    } else if (dependente) {
      const limit = dependente.severity === 'Crítica' ? 45 : (dependente.severity === 'Alta' ? 55 : 80);
      resilienciaGlobal = Math.min(resilienciaGlobal, limit);
      scoreIce = Math.min(scoreIce, limit - 5);
    } else if (resiliencia) {
      const limit = resiliencia.severity === 'Crítica' ? 55 : (resiliencia.severity === 'Alta' ? 65 : 80);
      resilienciaGlobal = Math.min(resilienciaGlobal, limit);
      scoreIce = Math.min(scoreIce, limit - 5);
    }
  }

  // Trava matemática de fallback (caso causality não seja provido)
  if (!causality && plValue < 0) {
    const maxScore = ebitda > 0 ? 45 : 15;
    resilienciaGlobal = Math.min(resilienciaGlobal, maxScore);
  }

  // --- TRAJECTORY INTELLIGENCE (TEMPORAL CAUSALITY) ---
  if (causality && causality.temporalIntelligence) {
    resilienciaGlobal += causality.temporalIntelligence.scoreAdjustment;
    resilienciaGlobal = Math.max(0, Math.min(100, resilienciaGlobal));
    // Se o crescimento for destrutivo, pune severamente o ICE
    if (causality.temporalIntelligence.isDestructiveGrowth) {
      scoreIce = Math.min(scoreIce, 15);
    }
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
