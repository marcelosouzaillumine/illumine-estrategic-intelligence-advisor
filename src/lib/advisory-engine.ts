import { BPSummary } from './bpEngine';
import { FinancialMetrics } from './financial-engine';
import { BusinessIdentity, inferBusinessIdentity } from './business-identity-engine';
import { ScoreMetrics } from './score-engine';
import { getIndustryWeights } from './industry-engine';
import { validateNarrativeOutput } from './narrative-governance';

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
    autonomiaFinanceira, liqSeca, dscrSimulado, resilienciaGiro, absorcaoPrejuizo,
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


  // BUSINESS MODEL INTELLIGENCE ENGINE (MVP)
  const bm = identity.setor || "indefinido";
  let bmRegraAplicada = "Benchmark Conservador Genérico";
  let bmThresholds = "Liquidez > 1.0 | Estoque < 0.35";
  let bmNarrativa = "Neutra (Modelo Não Parametrizado)";
  let isInventoryDependent = concentracaoEstoque > 0.35;
  let isCriticalLiquidity = liquidezReal < 0.5 || saldoTesouraria < 0;

  if (bm === "Comércio / Varejo") {
    bmRegraAplicada = "Tolerância a Estoque | Severidade em Liquidez Seca";
    bmThresholds = "Estoque < 0.50 | LiqSeca > 0.8";
    bmNarrativa = "Foco em Giro e Obsolescência";
    isInventoryDependent = concentracaoEstoque > 0.50; // Tolerância maior
    isCriticalLiquidity = liqSeca < 0.8 || saldoTesouraria < 0; // Maior punição na seca
  } else if (bm === "Asset Light") {
    bmRegraAplicada = "Foco em Caixa e Receita | Intolerância a Imobilização";
    bmThresholds = "Estoque < 0.10 | Caixa Forte";
    bmNarrativa = "Foco em Escalabilidade e Geração de Caixa";
    isInventoryDependent = concentracaoEstoque > 0.10;
    isCriticalLiquidity = saldoTesouraria < 0; // Mais focado na tesouraria real
  } else if (bm === "Asset Heavy") {
    bmRegraAplicada = "Tolerância a Endividamento/Imobilização | Previsibilidade Operacional";
    bmThresholds = "Dívida > 0.6 | Estoque < 0.35";
    bmNarrativa = "Foco em Produtividade de Ativos";
  } else if (bm === "Serviços Operacionais") {
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
  const acoes: ExecutiveAction[] = [];

  // Deduplicação Semântica: Caixa e Liquidez
  if (isCriticalLiquidity || resilienciaGiro < 0.8) {
    vulnerabilidades.push({
      nome: 'Estrangulamento de Solvência de Curto Prazo',
      peso: 10,
      tipo: 'Risco'
    });
    acoes.push({
      acao: 'Desmobilização tática de ativos não operacionais',
      impacto: 'Alto',
      velocidade: 'Imediata',
      complexidade: 'Alta',
      prioridade: 'Imediata'
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
    acoes.push({
      acao: 'Plano de capitalização ou turnaround financeiro',
      impacto: 'Alto',
      velocidade: 'Curto Prazo',
      complexidade: 'Alta',
      prioridade: 'Alta'
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
    acoes.push({
      acao: 'Desenvolver política de M&A ou expansão acelerada',
      impacto: 'Alto',
      velocidade: 'Médio Prazo',
      complexidade: 'Alta',
      prioridade: 'Estratégica'
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
  if (acoes.length === 0) {
    acoes.push({
      acao: 'Manter governança e monitoramento longitudinal',
      impacto: 'Baixo',
      velocidade: 'Longo Prazo',
      complexidade: 'Baixa',
      prioridade: 'Moderada'
    });
  }

  // 2. Institutional Priority Ranking
  vulnerabilidades.sort((a, b) => b.peso - a.peso);
  alavancas.sort((a, b) => b.peso - a.peso);
  acoes.sort((a, b) => {
    const prioridadeMap = { 'Imediata': 4, 'Alta': 3, 'Estratégica': 2, 'Moderada': 1, 'Baixa': 0 };
    return (prioridadeMap[b.prioridade as keyof typeof prioridadeMap] || 0) - (prioridadeMap[a.prioridade as keyof typeof prioridadeMap] || 0);
  });

  // 3. Executive Compression
  const finalFragilidades = vulnerabilidades.slice(0, 3).map(v => v.nome);
  const finalEstrategico = [...alavancas.map(a => a.nome), ...acoes.map(a => a.acao)].slice(0, 4);
  const strategicActionMatrix = acoes.slice(0, 2);

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

    // Executive Summary (Max 3 frases)
    const frase1 = resilienciaGlobal > 80 ? "A estrutura patrimonial demonstra robustez institucional." :
                   resilienciaGlobal > 50 ? "A composição de capital exibe resiliência intermediária sob pressão operacional." :
                   "A estrutura apresenta forte deterioração e risco sistêmico iminente.";
    const frase2 = `A principal alavanca identificada reside em ${vetorCrescimento.toLowerCase()}.`;
    const frase3 = `Entretanto, ${restricaoInstitucional.toLowerCase()} atua como restrição estrutural primária.`;
    diagnostico = `${frase1} ${frase2} ${frase3}`;
  }

  const institutionalThesis = {
    teseCentral,
    restricaoInstitucional,
    vetorCrescimento,
    riscoDominante: riscoMestre
  };

  // Build remaining required objects for AdvisoryOutput
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
    primaryThreat: vulnerabilidades[0].nome,
    timeToImpact: "Avaliação Cíclica",
    mitigationFactor: strategicActionMatrix[0].acao
  };

  const capitalAllocation = {
    preservar: "Tesouraria Tática",
    desacelerar: "Drenagem Operacional",
    monetizar: "Ativos e Inventário Moroso",
    maiorRetorno: "Custo Efetivo de Dívida vs ROIC"
  };

  const trendIntelligence = {
    direcaoEstrutural: trend?.hasData ? "Tração Monitorada" : "Base Estática",
    parecerEvolutivo: "Síntese consolidada via Institutional Engine."
  };

  const boardIntelligence = {
    suportaCrescimento: resilienciaGlobal > 60 ? "Sim, possui alavancagem operacional adequada." : "Não. Dependência passiva asfixia escalabilidade.",
    resilienciaModelo: resilienciaGlobal > 60 ? "Resiliente." : "Fragilizado.",
    riscoDeterioracao: vulnerabilidades[0].nome
  };
  
  const boardNarrative = {
    visaoSintetica: diagnostico,
    racionalidadeEconomica: teseCentral,
    visaoAcionista: "Alinhado à Diretriz de Equity"
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
    horizontePressao: "Curto Prazo",
    riscoRuptura: statusIceColor === 'rose' ? "Alto Risco" : "Baixo Risco",
    dependenciaGeracao: "Alta",
    riscoDescapitalizacaoProgressiva: "Moderado",
    sensibilidadeChoques: "Alta"
  };
  
  const elasticidadeFinanceira = {
    capacidadeAbsorcaoChoques: "Média",
    dependenciaOperacao: "Alta",
    necessidadeCapitalizacao: "Baseada na Dívida",
    resilienciaEstrutural: "Sensível",
    flexibilidadeFinanceira: "Restrita",
    velocidadeRecuperacao: "Moderada"
  };
  
  const impactosEsperados = strategicActionMatrix.map(a => ({ acao: a.acao, impacto: a.impacto }));
  
  const governanceRisks: any[] = [];

  const rawAdvisory: AdvisoryOutput = {
    businessIdentity: inferBusinessIdentity(undefined, 0),
    lifecycleStage,
    institutionalThesis,
    maturidade,
    diagnostico,
    fragilidades: finalFragilidades,
    estrategico: finalEstrategico,
    tendencia: (numCycles === 1) ? "Primeiro Ciclo Operacional (Histórico insuficiente para inferência longitudinal)" : "Tendência avaliada.",
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
    }
  };

  return validateNarrativeOutput(rawAdvisory, resilienciaGlobal);
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
    fragilidades: [], estrategico: [], tendencia: '', prioridades: [],
    predicao: { horizontePressao: '', riscoRuptura: '', dependenciaGeracao: '', riscoDescapitalizacaoProgressiva: '', sensibilidadeChoques: '' },
    elasticidadeFinanceira: { capacidadeAbsorcaoChoques: '', dependenciaOperacao: '', necessidadeCapitalizacao: '', resilienciaEstrutural: '', flexibilidadeFinanceira: '', velocidadeRecuperacao: '' },
    predictiveCausality: { primaryThreat: '', timeToImpact: '', mitigationFactor: '' },
    estresse: [], 
    governanceRisks: [],
    trendIntelligence: { direcaoEstrutural: '', parecerEvolutivo: '' },
    boardIntelligence: { suportaCrescimento: '', resilienciaModelo: '', riscoDeterioracao: '' },
    boardNarrative: { visaoSintetica: '', racionalidadeEconomica: '', visaoAcionista: '' },
    capitalAllocation: { preservar: '', desacelerar: '', monetizar: '', maiorRetorno: '' },
    executiveHistoricalIntelligence: {
      parecerHistorico: '',
      recorrencia: ''
    },
    valueProtection: { fatorErosaoSilenciosa: '', reducaoResiliencia: '', riscoExpansao: '' },
    managementDecisions: { melhoraCaixaRapido: '', ameacaContinuidade: '', reduzRiscoEstrutural: '', maiorImpactoVelocidade: '' },
    valueCreation: { tipoCrescimento: '', fatorDestruicao: '', alavancaValor: '' },
    treasuryIntelligence: { linhaAgua: '', velocidadeDeterioracao: '', pontoRuptura: '' },
    strategicValueInterpretation: '',
    prioridadesEstrategicas: [], strategicActionMatrix: [], impactosEsperados: [],
    liquidityQuality: { diagnostico: '', riscoEstrangulamento: '', qualidadeCapitalGiro: '', metricas: { alta: 0, media: 0, baixa: 0, restrita: 0 } },
    indiceContinuidade: { status: 'Pendente', color: 'slate' }
  };
}
