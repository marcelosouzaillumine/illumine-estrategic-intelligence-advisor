import { BPSummary } from './bpEngine';
type FinancialMetrics = any;
import { BusinessIdentity, inferBusinessIdentity } from './business-identity-engine';
import { ScoreMetrics } from './score-engine';
import { getIndustryWeights } from './industry-engine';
import { validateNarrativeOutput } from './narrative-governance';
import { evaluateExecutiveCausality } from './executive-causality-engine';
type ExecutiveCausalityOutput = any;
import { enforceInstitutionalRuntime } from '../core/enforcement/institutionalRuntimeEnforcer';
import { MasterCausalOutput } from './master-causal-engine';

export interface TrendMetrics {
  hasData: boolean;
  ebitdaTrend: number; // % var
  plTrend: number; // % var
  liquidityTrend: number; // % var
}

export interface ExecutiveAction {
  acao: string;
  impacto: 'Alto' | 'Médio' | 'Baixo';
  velocidade: 'Imediata' | 'Curto Prazo' | 'Médio Prazo' | 'Longo Prazo';
  complexidade: 'Alta' | 'Média' | 'Baixa';
  prioridade: 'Imediata' | 'Alta' | 'Moderada' | 'Estratégica';
}

export interface AdvisoryOutput {

  lifecycleStage?: string;
  businessIdentity: BusinessIdentity;
  institutionalThesis?: {
    teseCentral: string;
    restricaoInstitucional: string;
    vetorCrescimento: string;
    riscoDominante: string;
  };

  maturidade: string;
  diagnostico: string; // Focado na causalidade primária (CFO Commentary)
  fragilidades: string[]; // Problemas secundários
  estrategico: string[]; // Risco Principal
  tendencia: string; // Impacto Operacional
  prioridades: string[]; // Recomendação Estratégica
  predicao: {
    horizontePressao: string;
    riscoRuptura: string;
    dependenciaGeracao: string;
    riscoDescapitalizacaoProgressiva: string;
    sensibilidadeChoques: string;
  };
  elasticidadeFinanceira: {
    capacidadeAbsorcaoChoques: string;
    dependenciaOperacao: string;
    necessidadeCapitalizacao: string;
    resilienciaEstrutural: string;
    flexibilidadeFinanceira: string;
    velocidadeRecuperacao: string;
  };
  predictiveCausality: {
    primaryThreat: string;
    timeToImpact: string;
    mitigationFactor: string;
    fatorEstrutural?: string;
    sensibilidade?: string;
    movimentoRecomendado?: string;
  };
  estresse: {
    cenario: string;
    impacto: string;
    status: 'warning' | 'danger' | 'success';
  }[];
  governanceRisks: {
    taxonomia: 'Operacional' | 'Financeiro' | 'Estratégico' | 'Patrimonial' | 'Governança' | 'Continuidade';
    descricao: string;
  }[];
  trendIntelligence: {
    direcaoEstrutural: string;
    parecerEvolutivo: string;
    tendenciaInstitucional?: string;
  };
  boardIntelligence: {
    suportaCrescimento: string;
    resilienciaModelo: string;
    riscoDeterioracao: string;
    exposicaoEstrategica?: string;
    vetorCrescimento?: string;
    pressaoOperacional?: string;
  };
  managementDecisions: {
    melhoraCaixaRapido: string;
    ameacaContinuidade: string;
    reduzRiscoEstrutural: string;
    maiorImpactoVelocidade: string;
  };
  valueCreation: {
    tipoCrescimento: string;
    fatorDestruicao: string;
    alavancaValor: string;
  };
  treasuryIntelligence: {
    linhaAgua: string;
    velocidadeDeterioracao: string;
    pontoRuptura: string;
  };
  boardNarrative: {
    visaoSintetica: string;
    racionalidadeEconomica: string;
    visaoAcionista: string;
  };
  capitalAllocation: {
    preservar: string;
    desacelerar: string;
    monetizar: string;
    maiorRetorno: string;
    prioridadeFinanceira?: string;
    expansao?: string;
    preservacaoCaixa?: string;
    eficienciaOperacional?: string;
    monetizacaoAtivos?: string;
    pressaoEstrutural?: string;
  };
  executiveHistoricalIntelligence?: {
    parecerHistorico: string;
    recorrencia: string;
  };
  valueProtection: {
    fatorErosaoSilenciosa: string;
    reducaoResiliencia: string;
    riscoExpansao: string;
  };
  strategicValueInterpretation: string;
  prioridadesEstrategicas: { nome: string; status: string }[];
  strategicActionMatrix: ExecutiveAction[];
  impactosEsperados: { acao: string; impacto: string }[];
  liquidityQuality: {
    diagnostico: string;
    riscoEstrangulamento: string;
    qualidadeCapitalGiro: string;
    fatorEstrutural?: string;
    sensibilidade?: string;
    movimentoRecomendado?: string;
    metricas: {
      alta: number;
      media: number;
      baixa: number;
      restrita: number;
    };
  };
  indiceContinuidade: {
    status: string;
    color: string;
  };
  masterCausality?: MasterCausalOutput;
}

export function generateAdvisory(
  metrics: FinancialMetrics,
  bpSummary: {
    passivoCirculante: number;
    patrimonioLiquido: number;
    altaConversibilidade: number;
    mediaConversibilidade: number;
    baixaConversibilidade: number;
    restritaConversibilidade: number;
    ativoCirculante: number;
    creditosSocios: number;
    capitalSocial: number;
  },
  scores: { resilienciaGlobal: number, indiceContinuidade: number },
  identity: Readonly<BusinessIdentity>,
  trend?: {
    ebitdaTrend: number;
    cglTrend: number;
    plTrend: number;
    historicalCycles: number;
    persistentInventory: boolean;
    persistentTreasuryPressure: boolean;
    hasData: boolean;
  }
): AdvisoryOutput {
  if (!metrics.hasData) {
    return createEmptyAdvisory();
  }

  const {
    ebitda, liqCorrente, liquidezReal, saldoTesouraria, cgl, ncg, concentracaoEstoque,
    qualidadeEndividamento, dependenciaBancaria, indiceDescapitalizacao,
    autonomiaFinanceira, liqSeca, resilienciaGiro, absorcaoPrejuizo,
    margemErroOperacional
  } = metrics;

  const { 
    passivoCirculante: pc, patrimonioLiquido: plValue, 
    altaConversibilidade, mediaConversibilidade, baixaConversibilidade, restritaConversibilidade,
    ativoCirculante: ac, creditosSocios, capitalSocial
  } = bpSummary;

  const { resilienciaGlobal, indiceContinuidade } = scores;

  // -- Maturidade (Taxonomia Harmonizada) --
  let maturidade = "";
  if (plValue < 0) {
    maturidade = 'Insolvência Técnica';
  } else if (resilienciaGlobal <= 20) {
    maturidade = 'Fragilizado Profundo';
  } else if (resilienciaGlobal <= 40) {
    maturidade = 'Atenção Requerida';
  } else if (resilienciaGlobal <= 60) {
    maturidade = 'Pressão Estrutural';
  } else if (resilienciaGlobal <= 80) {
    maturidade = 'Sensível';
  } else if (resilienciaGlobal < 95) {
    maturidade = 'Estável';
  } else {
    maturidade = 'Saudável';
  }


  // BUSINESS MODEL INTELLIGENCE ENGINE
  const bm = identity.modeloDeNegocio || identity.setor || "indefinido";
  let bmRegraAplicada = "Benchmark Conservador Genérico";
  let bmThresholds = "Liquidez > 1.0 | Estoque < 0.35";
  let bmNarrativa = "Neutra (Modelo Não Parametrizado)";
  let isInventoryDependent = concentracaoEstoque > 0.35;
  let isCriticalLiquidity = liquidezReal < 0.5 || saldoTesouraria < 0;

  if (bm.includes("Comércio") || bm.includes("Varejo") || bm.includes("Distribuição")) {
    bmRegraAplicada = "Tolerância a Estoque | Severidade em Liquidez Seca";
    bmThresholds = "Estoque < 0.50 | LiqSeca > 0.8";
    bmNarrativa = "Foco em Giro e Obsolescência";
    isInventoryDependent = concentracaoEstoque > 0.50; // Tolerância maior
    isCriticalLiquidity = liqSeca < 0.8 || saldoTesouraria < 0; // Maior punição na seca
  } else if (bm.includes("Asset Light") || bm.includes("SaaS") || bm.includes("Tecnologia")) {
    bmRegraAplicada = "Foco em Caixa e Receita | Intolerância a Imobilização";
    bmThresholds = "Estoque < 0.10 | Caixa Forte";
    bmNarrativa = "Foco em Escalabilidade e Geração de Caixa";
    isInventoryDependent = concentracaoEstoque > 0.10;
    isCriticalLiquidity = saldoTesouraria < 0; // Mais focado na tesouraria real
  } else if (bm.includes("Asset Heavy") || bm.includes("Infraestrutura") || bm.includes("Indústria") || bm.includes("Saúde")) {
    bmRegraAplicada = "Tolerância a Endividamento/Imobilização | Previsibilidade Operacional";
    bmThresholds = "Dívida > 0.6 | Estoque < 0.35";
    bmNarrativa = "Foco em Produtividade de Ativos";
  } else if (bm.includes("Serviços Operacionais")) {
    bmRegraAplicada = "Foco em Fluxo | Sensibilidade a Inadimplência";
    bmThresholds = "Estoque < 0.15 | Caixa de Curto Prazo";
    bmNarrativa = "Foco em Fluxo Transacional";
    isInventoryDependent = concentracaoEstoque > 0.15;
  }

  const isEroding = plValue < 0 || (indiceDescapitalizacao > 0.5 && plValue > 0);
  const isDebtDependent = dependenciaBancaria > 0.5;


  // ==========================================
  // BOARD SYNTHESIS ENGINE (Institutional Layer)
  // ==========================================

  // 1. Ranking & Semantic Deduplication
  const vulnerabilidades: { nome: string; peso: number; tipo: 'Risco' | 'Restricao' | 'Gargalo' }[] = [];
  const alavancas: { nome: string; peso: number; tipo: 'Expansao' | 'Otimizacao' }[] = [];
  const acoes: ExecutiveAction[] = [
    {
      acao: 'Recomendação Bloqueada por Validação Institucional (Falta de Causalidade/DFC)',
      impacto: 'Baixo',
      velocidade: 'Longo Prazo',
      complexidade: 'Alta',
      prioridade: 'Moderada'
    }
  ];

  // Deduplicação Semântica: Caixa e Liquidez
  if (isCriticalLiquidity || resilienciaGiro < 0.8) {
    vulnerabilidades.push({
      nome: 'Estrangulamento de Solvência de Curto Prazo',
      peso: 10,
      tipo: 'Risco'
    });
  } else if (liqSeca < 0.9 && isInventoryDependent) {
    vulnerabilidades.push({
      nome: 'Imobilização Excessiva de Capital em Inventário',
      peso: 8,
      tipo: 'Restricao'
    });
    alavancas.push({
      nome: 'Otimização de Conversão de Estoque',
      peso: 7,
      tipo: 'Otimizacao'
    });
  } else if (liqCorrente < 1.0) {
    vulnerabilidades.push({
      nome: 'Pressão de Capital de Giro Mínimo',
      peso: 6,
      tipo: 'Gargalo'
    });
  }

  // Deduplicação Semântica: Estrutura Patrimonial
  if (isEroding) {
    vulnerabilidades.push({
      nome: 'Corrosão Patrimonial Estrutural',
      peso: 9,
      tipo: 'Risco'
    });
  } else if (isDebtDependent) {
    vulnerabilidades.push({
      nome: 'Risco de Exposição Bancária Elevada',
      peso: 7,
      tipo: 'Restricao'
    });
    alavancas.push({
      nome: 'Desalavancagem e Proteção de Covenant',
      peso: 8,
      tipo: 'Otimizacao'
    });
  }

  // Deduplicação Semântica: Eficiência
  if (saldoTesouraria > 0 && resilienciaGlobal > 70) {
    alavancas.push({
      nome: 'Aceleração de Crescimento por Tesouraria Forte',
      peso: 9,
      tipo: 'Expansao'
    });
  } else if (resilienciaGlobal > 50) {
    alavancas.push({
      nome: 'Preservação de Margem e Melhoria Operacional',
      peso: 5,
      tipo: 'Otimizacao'
    });
  }

  // Fallback garantido
  if (vulnerabilidades.length === 0) {
    vulnerabilidades.push({ nome: 'Manutenção da Estabilidade Patrimonial Atual', peso: 1, tipo: 'Risco' });
  }
  if (alavancas.length === 0) {
    alavancas.push({ nome: 'Reestruturação de Base Operacional', peso: 1, tipo: 'Otimizacao' });
  }

  // 2. Institutional Priority Ranking
  vulnerabilidades.sort((a, b) => b.peso - a.peso);
  alavancas.sort((a, b) => b.peso - a.peso);

  // 3. Executive Compression
  const finalFragilidades = vulnerabilidades.slice(0, 3).map(v => v.nome);
  const finalEstrategico = [...alavancas.map(a => a.nome)].slice(0, 4);
  const strategicActionMatrix = acoes;

  // 4. Institutional Thesis Generator
  const riscoMestre = vulnerabilidades[0].nome;
  const vetorCrescimento = alavancas[0].nome;
  let teseCentral = "";
  let restricaoInstitucional = "";

  if (vulnerabilidades[0].peso >= 8) {
    teseCentral = `Trajetória comprometida por ${riscoMestre.toLowerCase()}.`;
    restricaoInstitucional = vulnerabilidades[0].nome;
  } else if (alavancas[0].peso >= 8) {
    teseCentral = `Crescimento viabilizado por ${vetorCrescimento.toLowerCase()}.`;
    restricaoInstitucional = vulnerabilidades.length > 1 ? vulnerabilidades[1].nome : "Baixa elasticidade tática";
  } else {
    teseCentral = "Estabilidade moderada com restrições operacionais latentes.";
    restricaoInstitucional = riscoMestre;
  }

  // Enforce first cycle narrative
  const numCycles = trend?.historicalCycles || 1;
  let lifecycleStage = "Consolidação Operacional";
  let diagnostico = "";
  if (numCycles === 1) {
    lifecycleStage = "Formação Operacional";
    teseCentral = "Estrutura em primeiro ciclo de maturação.";
    restricaoInstitucional = "Histórico insuficiente para inferência estrutural.";
    diagnostico = "Composição patrimonial em fase de consolidação inicial. A arquitetura de capital ainda requer validação longitudinal para confirmação de resiliência. Recomendável monitoramento de tração de curto prazo.";
  } else {
    if (ebitda < 0 && saldoTesouraria < 0 && liquidezReal < 0.3 && plValue < 0) lifecycleStage = "Reestruturação / Turnaround";
    else if (trend?.ebitdaTrend && trend.ebitdaTrend > 15 && (cgl < 0 || saldoTesouraria < 0)) lifecycleStage = "Expansão Acelerada";
    else if (numCycles >= 5 && trend?.ebitdaTrend && trend.ebitdaTrend >= 0 && trend.ebitdaTrend <= 5 && autonomiaFinanceira > 0.4) lifecycleStage = "Maturidade Corporativa";
  }

  // Build remaining required objects for AdvisoryOutput
  
  // ==========================================
  // EXECUTIVE CAUSALITY ENGINE (Mandatory Layer)
  // ==========================================
  const causalityOutput: ExecutiveCausalityOutput = evaluateExecutiveCausality(
    metrics, bpSummary, scores, identity
  );

  const { narrativeChain, financialElasticity, liquidityPressure, inferredTensions, vulnerabilities, masterCausality } = causalityOutput;
  
  diagnostico = `${narrativeChain.causa} ${narrativeChain.pressao} ${narrativeChain.consequencia} ${narrativeChain.decisao}`;
  let tendencia = (numCycles === 1) ? "Primeiro Ciclo Operacional (Histórico insuficiente para inferência longitudinal)" : "Tendência avaliada.";

  if (masterCausality && masterCausality.temporalIntelligence) {
    const temporal = masterCausality.temporalIntelligence;
    if (temporal.temporalMode === 'FULL_TEMPORAL_MODE') {
      tendencia = `Direção: ${temporal.temporalScore}. Impacto: ${temporal.trajectoryImpact}. Confiança: ${temporal.trendConfidence.level}.`;
      diagnostico += ` A análise longitudinal aponta: ${temporal.insights.continuidade}`;
    } else {
      tendencia = temporal.reasonForLimitedConfidence || "Histórico insuficiente para inferência temporal robusta.";
    }
  }

  const institutionalThesis = {
    teseCentral: narrativeChain.causa,
    restricaoInstitucional: narrativeChain.pressao,
    vetorCrescimento: financialElasticity.status === 'Alta' ? 'Expansão Acelerada Autofinanciada' : 'Recuperação e Otimização de Liquidez',
    riscoDominante: narrativeChain.consequencia
  };
  const liquidityQuality = {
    diagnostico: isCriticalLiquidity ? "Estrangulamento agudo de tesouraria requerendo capital de giro urgente." : "Base de conversão operacional aderente ao ciclo.",
    riscoEstrangulamento: isCriticalLiquidity ? "Crítico" : "Baixo",
    qualidadeCapitalGiro: cgl < 0 ? "Exposição Negativa" : "Estável",
    metricas: {
      alta: altaConversibilidade,
      media: mediaConversibilidade,
      baixa: baixaConversibilidade,
      restrita: restritaConversibilidade
    }
  };

  const predictiveCausality = {
    primaryThreat: vulnerabilities[0] || vulnerabilidades[0].nome,
    timeToImpact: liquidityPressure.status === 'Severa' ? 'Curto Prazo Imediato (0-90 dias)' : 'Ciclo Operacional Vigente',
    mitigationFactor: narrativeChain.decisao
  };

  const capitalAllocation = {
    preservar: "Tesouraria Tática",
    desacelerar: "Drenagem Operacional",
    monetizar: "Ativos e Inventário Moroso",
    maiorRetorno: "Custo Efetivo de Dívida vs ROIC"
  };

  const trendIntelligence = {
    direcaoEstrutural: masterCausality?.temporalIntelligence?.temporalScore || (trend?.hasData ? (trend.plTrend > 0 ? "Expansão Patrimonial" : "Contração Patrimonial") : "Avaliação Indisponível"),
    parecerEvolutivo: masterCausality?.temporalIntelligence?.insights?.continuidade || narrativeChain.consequencia
  };

  const boardIntelligence = {
    suportaCrescimento: financialElasticity.status === 'Alta' || financialElasticity.status === 'Média' ? "Sim. Estrutura suporta expansão alavancada ou orgânica sem ruptura." : "Não. A asfixia da tesouraria impede tração.",
    resilienciaModelo: resilienciaGlobal > 60 ? "Modelo comprovadamente resiliente." : "A resiliência arquitetural foi corroída.",
    riscoDeterioracao: inferredTensions[0] || vulnerabilidades[0].nome
  };
  
  const boardNarrative = {
    visaoSintetica: diagnostico,
    racionalidadeEconomica: narrativeChain.causa,
    visaoAcionista: narrativeChain.decisao
  };
  
  const valueProtection = {
    fatorErosaoSilenciosa: "Ciclo de Conversão Inadequado",
    reducaoResiliencia: "Endividamento Desbalanceado",
    riscoExpansao: "Consumo Exagerado de Tesouraria"
  };
  
  const managementDecisions = {
    melhoraCaixaRapido: "Alongamento Passivo",
    ameacaContinuidade: "Risco Mestre",
    reduzRiscoEstrutural: "Capitalização",
    maiorImpactoVelocidade: "Precificação e Giro"
  };
  
  const valueCreation = {
    tipoCrescimento: "Orgânico",
    fatorDestruicao: "Imobilização",
    alavancaValor: "EBITDA Múltiplo"
  };
  
  const treasuryIntelligence = {
    linhaAgua: "Linha Base",
    velocidadeDeterioracao: "Proporcional ao Giro",
    pontoRuptura: "Limite de Rolagem"
  };

  const estresse: { cenario: string; impacto: string; status: 'warning' | 'danger' | 'success' }[] = [
    {
      cenario: "Retração de Demanda (-20%)",
      impacto: ebitda > 0 ? "Absorve via margem." : "Acelera consumo de caixa.",
      status: ebitda > 0 ? 'warning' : 'danger'
    }
  ];

  const prioridadesEstrategicas = [
    { nome: vulnerabilidades[0].nome, status: "Crítico" },
    { nome: alavancas[0].nome, status: "Alavanca" }
  ];

  let statusIce = "Operação Funcional Resiliente";
  let statusIceColor = "emerald";
  
  if (indiceContinuidade < 45) { 
    statusIce = "Restrição Relevante de Liquidez"; 
    statusIceColor = "rose"; 
  } else if (indiceContinuidade < 65) { 
    statusIce = "Vulnerabilidade Moderada"; 
    statusIceColor = "amber"; 
  } else if (indiceContinuidade < 85) { 
    statusIce = "Estabilidade Institucional"; 
    statusIceColor = "blue"; 
  }

  const predicao = {
    horizontePressao: liquidityPressure.status === 'Severa' ? "Curtíssimo Prazo (Déficit de Tesouraria)" : "Ciclo Operacional Vigente",
    riscoRuptura: statusIceColor === 'rose' || liquidityPressure.status === 'Severa' ? "Risco Agudo de Falha Tática" : "Baixo Risco Sistêmico",
    dependenciaGeracao: ebitda < 0 ? "Aceleração Progressiva da Erosão" : "Geração de Caixa Suporta Operação",
    riscoDescapitalizacaoProgressiva: indiceDescapitalizacao > 0.5 ? "Crítico (Passivo Oneroso Drenando PL)" : "Controlado",
    sensibilidadeChoques: financialElasticity.status === 'Crítica' ? "Máxima Vulnerabilidade a Choques de Demanda" : "Operação Ancorada e Protegida"
  };
  
  const elasticidadeFinanceira = {
    capacidadeAbsorcaoChoques: financialElasticity.status,
    dependenciaOperacao: cgl < ncg ? "Dependência Vital de Linhas Onerosas" : "Ciclo Autofinanciado",
    necessidadeCapitalizacao: plValue < 0 ? "Mandatória (Insolvência)" : "Não Imediata",
    resilienciaEstrutural: resilienciaGlobal > 70 ? "Preservada" : "Comprometida",
    flexibilidadeFinanceira: financialElasticity.narrative,
    velocidadeRecuperacao: ebitda > 0 ? "Margem permite recuperação acelerada" : "Estática (Sem Geração Livre)"
  };
  
  const impactosEsperados = strategicActionMatrix.map(a => ({ acao: a.acao, impacto: a.impacto }));
  
  const governanceRisks: any[] = [];

  const rawAdvisory: AdvisoryOutput = {
    businessIdentity: identity,
    lifecycleStage,
    institutionalThesis,
    maturidade,
    diagnostico,
    fragilidades: finalFragilidades,
    estrategico: finalEstrategico,
    tendencia,
    prioridades: finalEstrategico,
    predicao,
    elasticidadeFinanceira,
    predictiveCausality,
    estresse,
    governanceRisks,
    trendIntelligence,
    boardIntelligence,
    boardNarrative,
    capitalAllocation,
    valueProtection,
    managementDecisions,
    valueCreation,
    treasuryIntelligence,
    strategicValueInterpretation: "Síntese Institucional e Deduplicação Causal Ativa.",
    prioridadesEstrategicas,
    strategicActionMatrix,
    impactosEsperados,
    liquidityQuality,
    indiceContinuidade: {
      status: statusIce,
      color: statusIceColor
    },
    masterCausality
  };

  const validated = validateNarrativeOutput(rawAdvisory, resilienciaGlobal);
  const { sanitizedOutput } = enforceInstitutionalRuntime(validated, {
    enginesExecuted: ['ExecutiveCausalityEngine', 'StrategicRiskEngine', 'BoardSynthesisEngine'],
    businessModel: identity.modeloDeNegocio,
    score: resilienciaGlobal
  });

  return sanitizedOutput;
}


function createEmptyAdvisory(): AdvisoryOutput {
  return {

    lifecycleStage: 'Pendente',
    businessIdentity: inferBusinessIdentity(undefined, 0),
    institutionalThesis: {
      teseCentral: 'Ausência de dados contábeis consolidados.',
      restricaoInstitucional: 'Incapacidade de leitura arquitetural estruturada.',
      vetorCrescimento: 'Pendente de importação financeira.',
      riscoDominante: 'Risco de interpretação fragmentada.'
    },
    maturidade: 'Pendente',
    diagnostico: 'Amostragem insuficiente para emitir parecer executivo de Causalidade Financeira e Governança.',
    fragilidades: [],
    estrategico: [],
    tendencia: 'Sem dados',
    prioridades: [],
    predicao: { horizontePressao: 'Inexistente', riscoRuptura: 'Não Calculado', dependenciaGeracao: 'Não Calculado', riscoDescapitalizacaoProgressiva: 'Não Calculado', sensibilidadeChoques: 'Não Calculado' },
    elasticidadeFinanceira: { capacidadeAbsorcaoChoques: 'Indefinida', dependenciaOperacao: 'Sem Dados', necessidadeCapitalizacao: 'Sem Dados', resilienciaEstrutural: 'Sem Dados', flexibilidadeFinanceira: 'Sem Dados', velocidadeRecuperacao: 'Sem Dados' },
    predictiveCausality: { primaryThreat: 'Informação insuficiente para inferência institucional.', timeToImpact: 'Informação insuficiente para inferência institucional.', mitigationFactor: 'Informação insuficiente para inferência institucional.' },
    estresse: [], 
    governanceRisks: [],
    trendIntelligence: { direcaoEstrutural: 'Falta de Matriz Histórica', parecerEvolutivo: 'Requer base de dados completa.' },
    boardIntelligence: { suportaCrescimento: 'Dados Faltantes', resilienciaModelo: 'Impossível Averiguar', riscoDeterioracao: 'Visibilidade Obscurecida' },
    boardNarrative: { visaoSintetica: 'Nenhuma predição gerada pela Causality Engine.', racionalidadeEconomica: 'Sem base econômica.', visaoAcionista: 'Status Cego' },
    capitalAllocation: { preservar: 'Tudo', desacelerar: 'Gastos Marginais', monetizar: 'Nenhum', maiorRetorno: 'Caixa' },
    executiveHistoricalIntelligence: {
      parecerHistorico: 'Série temporal fragmentada.',
      recorrencia: 'Pendente'
    },
    valueProtection: { fatorErosaoSilenciosa: 'Falta de Controle Integrado', reducaoResiliencia: 'Não Analisado', riscoExpansao: 'Operar no Escuro' },
    managementDecisions: { melhoraCaixaRapido: 'Subir Dados', ameacaContinuidade: 'Desconhecida', reduzRiscoEstrutural: 'Transparência Financeira', maiorImpactoVelocidade: 'Fechamento Contábil' },
    valueCreation: { tipoCrescimento: 'Invisível', fatorDestruicao: 'Ausência de Dados', alavancaValor: 'Implementação de Controladoria' },
    treasuryIntelligence: { linhaAgua: 'Desconhecida', velocidadeDeterioracao: 'Indefinida', pontoRuptura: 'Indetectável' },
    strategicValueInterpretation: 'Sem interpretação causal por falta de materialidade de dados.',
    prioridadesEstrategicas: [], strategicActionMatrix: [], impactosEsperados: [],
    liquidityQuality: { diagnostico: 'Sem visibilidade.', riscoEstrangulamento: 'Indefinido', qualidadeCapitalGiro: 'Indefinida', metricas: { alta: 0, media: 0, baixa: 0, restrita: 0 } },
    indiceContinuidade: { status: 'Aguardando Avaliação', color: 'slate' }
  };
}
