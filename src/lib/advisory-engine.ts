import { BPSummary } from './bpEngine';
import { FinancialMetrics } from './financial-engine';
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
  };
  boardIntelligence: {
    suportaCrescimento: string;
    resilienciaModelo: string;
    riscoDeterioracao: string;
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
  bpSummary: BPSummary,
  metrics: FinancialMetrics,
  scores: ScoreMetrics,
  industry?: string,
  trend?: TrendMetrics
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

  const isCriticalLiquidity = liquidezReal < 0.5 || saldoTesouraria < 0;
  const isEroding = plValue < 0 || (indiceDescapitalizacao > 0.5 && plValue > 0);
  const isInventoryDependent = concentracaoEstoque > 0.35;
  const isDebtDependent = dependenciaBancaria > 0.5;

  // -- CFO Commentary Engine (Diagnóstico) --
  let diagnostico = "";
  if (ebitda < 0 && saldoTesouraria < 0 && liquidezReal < 0.3) {
    diagnostico = "Ruptura Estrutural Sistêmica. A arquitetura de capital encontra-se exaurida com passivo a descoberto, severamente agravada pela destruição de caixa operacional na margem (EBITDA negativo). O esgotamento da liquidez e a asfixia da tesouraria inviabilizam a continuidade orgânica do negócio. O cenário exige intervenção de governança corporativa emergencial, incluindo estruturação imediata de reperfilamento passivo, paralisação de Capex e captação primária de equity.";
  } else if (plValue < 0 && ebitda > 0 && dscrSimulado > 1.2) {
    diagnostico = "Insolvência Técnica com Absorção Operacional. A companhia opera alavancada com passivo a descoberto, sinalizando corrosão histórica de capital. No entanto, o core business preserva viabilidade econômica, gerando caixa através de um EBITDA positivo capaz de financiar o giro. A sustentabilidade e recuperação do valuation dependem mandatòriamente do alongamento tático da dívida e blindagem da liquidez para permitir a reconstrução orgânica da base de capital ao longo dos próximos exercícios.";
  } else if (plValue > 0 && ebitda < 0 && saldoTesouraria < 0) {
    diagnostico = "Deterioração Operacional e Estrangulamento de Tesouraria. Apesar de o balanço apresentar suporte patrimonial, o modelo de negócios atual está consumindo caixa devido à margem EBITDA negativa. Combinado a um capital de giro passivo, a operação impõe uma necessidade contínua de rolagem de dívida de curto prazo, erodindo o patrimônio. É mandatória a imediata revisão de precificação, corte de OPEX e readequação da capacidade instalada.";
  } else if (plValue > 0 && saldoTesouraria < 0 && ebitda > 0) {
    diagnostico = "Fricção Severa no Ciclo de Conversão de Caixa. A empresa possui tração comercial e margem econômica, porém o capital de giro encontra-se mal estruturado. O descompasso crônico entre os prazos médios de recebimento e pagamento está drenando a tesouraria e asfixiando o caixa gerado. Requer refinanciamento das linhas de giro de curto prazo e adoção rigorosa de recebíveis como colateral para recomposição da margem de erro operacional.";
  } else if (autonomiaFinanceira > 0.5 && liquidezReal > 1 && ebitda > 0 && metrics.treasuryStatus === 'Robusta') {
    diagnostico = "Arquitetura Financeira Funcional e Resiliente. A estrutura de capital próprio da companhia é suficiente para absorver volatilidades e flutuações de demanda. O balanço exibe níveis confortáveis de liquidez real e uma margem de tesouraria que protege a operação comercial contra choques de inadimplência de curto prazo. Posição habilitada para aceleração tática de mercado e preservação consolidada de valuation.";
  } else {
    diagnostico = "Estrutura Funcional com Margem de Erro Restrita. A operação roda de forma equilibrada no aspecto de solvência, contudo a atual elasticidade da tesouraria não suportaria choques abruptos na demanda ou alongamento inesperado no ciclo de clientes. Recomenda-se acompanhamento disciplinado do CGL e otimização da estrutura de recebíveis para prevenir o encurtamento prematuro de passivos e assegurar flexibilidade em cenários adversos.";
  }

  // Treasury Intelligence Insight
  let linhaAguaStr = "";
  if (saldoTesouraria > 0) {
    linhaAguaStr = (liqSeca < 0.5 || isInventoryDependent) ? "Sensível à deterioração do giro (Falsa folga de tesouraria)" : "Acima da linha d'água (Autofinanciamento tático garantido)";
  } else {
    linhaAguaStr = "Abaixo da linha d'água (Dependência externa de rolagem)";
  }
  const treasuryIntelligence = {
    linhaAgua: linhaAguaStr,
    velocidadeDeterioracao: ebitda < 0 ? "Acelerada (Queima dupla: operacional e financeira)" : (ncg > cgl ? "Moderada (O giro drena capital passivamente)" : "Estável"),
    pontoRuptura: metrics.treasuryStatus === 'Crítica' ? "Iminente (Rolagem passiva insustentável no curto prazo)" : ((liqSeca < 0.5 || saldoTesouraria < 0) ? "Linha d'água próxima do limite operacional" : "Margem de absorção confortável")
  };

  const fragilidades = [];
  if (saldoTesouraria < 0) fragilidades.push("A necessidade de capital de giro (NCG) supera a margem do capital próprio alocado no giro (CGL).");
  if (isInventoryDependent) fragilidades.push("Excesso de capital retido em estoques, comprometendo a capacidade de conversão ágil em caixa.");
  if (qualidadeEndividamento > 0.7) fragilidades.push("Concentração severa de passivos no curtíssimo prazo, gerando pressão constante de rolagem.");
  if (creditosSocios > (ac * 0.15)) fragilidades.push("Ativos circulantes poluídos com mútuos ou adiantamentos, distorcendo a percepção de liquidez real disponível.");
  if (isDebtDependent && dscrSimulado < 1.2) fragilidades.push("Dependência de dívidas onerosas com baixa margem de cobertura pelo fluxo de caixa (EBITDA).");
  if (fragilidades.length === 0) fragilidades.push("A matriz estrutural não aponta vulnerabilidades imediatas fora da normalidade do segmento.");

  const estrategico = [];
  if (isInventoryDependent && isCriticalLiquidity) estrategico.push("Risco Primário: Choques na demanda podem asfixiar a tesouraria, pois o caixa está imobilizado e a liquidez imediata é restrita.");
  if (saldoTesouraria < 0 && plValue > 0) estrategico.push("Risco de Crescimento: Expandir a operação na configuração atual queimará mais caixa, acelerando a dependência de bancos e deteriorando margens.");
  if (autonomiaFinanceira < 0.3) estrategico.push("Alergagem Crítica: Estrutura excessivamente financiada por terceiros. A resiliência contra oscilações de juros ou compressão de margens é mínima.");
  if (estrategico.length === 0) estrategico.push("A estratégia deve focar em otimizar a conversão operacional, pois a estrutura básica suporta os ciclos normais.");

  let tendencia = "";
  if (plValue < 0 && ebitda < 0) tendencia = "Deterioração Acelerada. A queima simultânea de patrimônio e caixa aponta para insolvência iminente sem injeção de equity.";
  else if (isEroding && ebitda < 0) tendencia = "Descapitalização Progressiva. O modelo operacional drena a sustentação do negócio.";
  else if (isCriticalLiquidity && ebitda > 0) tendencia = "Restrição de Caixa. Os ganhos operacionais estão sendo consumidos apenas para rolar o passivo sufocado.";
  else if (autonomiaFinanceira > 0.4 && liquidezReal > 1) tendencia = "Evolução Saudável. O crescimento atual não estressa a arquitetura de capital da empresa.";
  else tendencia = "Crescimento Condicionado. A expansão só será sustentável se pareada a uma gestão defensiva do capital de giro.";

  // -- Trend Intelligence (Erosão vs Recuperação) --
  let direcaoEstrutural = "Estabilidade Detectada";
  let parecerEvolutivo = "As métricas refletem um quadro pontual equilibrado, sem variações abruptas em relação aos ciclos passados.";
  if (trend && trend.hasData) {
    if (trend.plTrend < -10 && trend.ebitdaTrend < -10) {
      direcaoEstrutural = "Erosão Acelerada";
      parecerEvolutivo = `Observa-se perda progressiva de valor, com corrosão patrimonial (${trend.plTrend.toFixed(1)}%) acompanhada de queima de margem operacional (${trend.ebitdaTrend.toFixed(1)}%). O modelo demanda revisão extrema.`;
    } else if (trend.plTrend > 10 && trend.ebitdaTrend > 10) {
      direcaoEstrutural = "Recuperação/Crescimento Estrutural";
      parecerEvolutivo = `Tração operacional validada. A evolução simultânea de geração de caixa e base patrimonial fortalece a elasticidade da companhia.`;
    } else if (trend.plTrend > 0 && trend.ebitdaTrend < 0) {
      direcaoEstrutural = "Erosão Silenciosa (Operacional)";
      parecerEvolutivo = `O patrimônio cresceu pontualmente, mas a deterioração do EBITDA aponta ineficiência recente que começará a drenar o caixa no próximo ciclo.`;
    } else if (trend.plTrend < 0 && trend.ebitdaTrend > 0) {
      direcaoEstrutural = "Transição Positiva (Tração)";
      parecerEvolutivo = `Embora o patrimônio apresente queda herdada de períodos passados, a reversão positiva no EBITDA sinaliza forte potencial de reequilíbrio estrutural se a dívida for adequadamente perfilada.`;
    }
  }

  const trendIntelligence = { direcaoEstrutural, parecerEvolutivo };

  const prioridades = [];
  if (plValue < 0 || (indiceDescapitalizacao > 0.6 && plValue > 0)) prioridades.push("Executar plano estruturado de Injeção de Equity ou renegociação de dívidas conversíveis.");
  if (isDebtDependent || qualidadeEndividamento > 0.7) prioridades.push("Alongar o passivo (reperfilamento tático) para aliviar imediatamente o serviço da dívida e proteger a tesouraria.");
  if (isInventoryDependent) prioridades.push("Acelerar o giro de estoque, adotando descontos táticos se necessário para destrancar a liquidez retida.");
  if (saldoTesouraria < 0) prioridades.push("Renegociar prazos com fornecedores essenciais e estruturar linha de crédito voltada especificamente a capital de giro longo.");
  if (prioridades.length === 0) prioridades.push("Focar na otimização de Return on Invested Capital (ROIC) e na consolidação das reservas de contingência.");

  const predicao = {
    horizontePressao: saldoTesouraria < 0 || (plValue < 0 && ebitda < 0) ? "Curto Prazo (Fricção de Tesouraria)" : (liquidezReal < 0.6 || dependenciaBancaria > 0.5 ? "Médio Prazo (Monitoramento Executivo)" : "Estável e Projetável"),
    riscoRuptura: plValue < 0 && ebitda < 0 && liquidezReal < 0.3 ? "Elevado Risco Sistêmico" : (saldoTesouraria < 0 ? "Atenção (Giro Pressionado)" : "Baixa Probabilidade"),
    dependenciaGeracao: (cgl < 0 || liquidezReal < 0.5) ? "Sensível (Obrigação contínua de Conversão)" : "Moderada (Margem Adequada)",
    riscoDescapitalizacaoProgressiva: indiceDescapitalizacao > 0.5 ? "Atenção (Corrosão de Base de Capital em andamento)" : "Baixo (Geração retida)",
    sensibilidadeChoques: resilienciaGlobal < 30 ? "Fragilizado (Menor Margem de Absorção Econômica)" : (resilienciaGlobal < 65 ? "Atenção Tática" : "Resiliente a Choques")
  };

  const weights = getIndustryWeights(industry);
  let capacidadeAbsorcao = (plValue > 0 && liquidezReal > 1 && cgl > 0 && margemErroOperacional > weights.workingCapitalTolerance) ? "Altamente Robusta" : (plValue > 0 && ebitda > 0 ? "Sensível (Dependente da velocidade do giro)" : "Baixa Margem de Erro Estrutural");
  if (capacidadeAbsorcao === "Altamente Robusta" && (baixaConversibilidade + restritaConversibilidade) > (altaConversibilidade * 2)) {
    capacidadeAbsorcao = "Adequada, porém com Imobilização excessiva travando a folga";
  }

  // Strategic Resilience Model
  const elasticidadeFinanceira = {
    capacidadeAbsorcaoChoques: capacidadeAbsorcao,
    dependenciaOperacao: (cgl < 0 || saldoTesouraria < 0) ? "Pressionada (Exige rolagem constante e perfeita)" : "Equilibrada (Absorve atrasos moderados)",
    necessidadeCapitalizacao: plValue < 0 ? "Forte/Recomendada para preservar valuation" : (indiceDescapitalizacao > 0.4 ? "Atenção (Consumo de patrimônio)" : "Base de capital protegida"),
    resilienciaEstrutural: maturidade,
    flexibilidadeFinanceira: metrics.treasuryStatus === 'Robusta' ? "Ampla (Acesso fácil a crédito)" : (metrics.treasuryStatus === 'Sensível' || metrics.treasuryStatus === 'Pressionada' ? "Restrita (Custo de capital elevado)" : "Adequada"),
    velocidadeRecuperacao: ebitda > 0 && dscrSimulado > 1.2 ? "Ágil (Geração de caixa destrava passivos)" : "Lenta (Exige desmobilização ou aporte)"
  };

  // Board Intelligence Layer
  const boardIntelligence = {
    suportaCrescimento: (cgl > 0 && metrics.treasuryStatus === 'Robusta') ? "Sim. Estrutura blindada para aceleração de vendas." : (saldoTesouraria < 0 ? "Não. Expansão acelerada irá esgotar o caixa atual." : "Condicionado ao alongamento prévio de passivos."),
    resilienciaModelo: resilienciaGlobal > 60 ? "Resiliente. Modelo não depende de alavancagem excessiva." : "Frágil. Alta vulnerabilidade a choques de mercado ou inadimplência.",
    riscoDeterioracao: (plValue < 0 || (ebitda < 0 && saldoTesouraria < 0)) ? "Alto/Iminente sem intervenção executiva." : "Controlado sob premissas atuais."
  };

  const boardNarrative = {
    visaoSintetica: (plValue > 0 && ebitda > 0) ? "Balanço equilibrado com geração orgânica de caixa. O modelo sustenta o tamanho da operação." : "Disfunção estrutural detectada. Requer freio de arrumação operacional antes de novas expansões.",
    racionalidadeEconomica: ebitda > 0 ? "O Core Business tem lógica econômica validada pela margem EBITDA." : "O modelo de negócio atual é financeiramente inviável e requer restruturação de base.",
    visaoAcionista: (metrics.treasuryStatus === 'Robusta' && plValue > 0) ? "Valor preservado e pronto para dividendos ou expansão." : "Risco de diluição ou necessidade de aporte de capital primário."
  };

  const capitalAllocation = {
    preservar: saldoTesouraria < 0 ? "Caixa tático para folha de pagamento e impostos." : "Investimentos em projetos de alto ROIC.",
    desacelerar: "Capex expansionista e despesas discricionárias operacionais (SG&A).",
    monetizar: isInventoryDependent ? "Estoques de baixo giro (Curva C)." : "Ativos não operacionais ou recebíveis.",
    maiorRetorno: ebitda > 0 ? "Otimização do ciclo financeiro (esticar prazos, reduzir estoques)." : "Revisão de pricing e margem bruta."
  };

  const valueProtection = {
    fatorErosaoSilenciosa: (saldoTesouraria < 0 && ebitda > 0) ? "Despesas financeiras oriundas da rolagem de capital de giro." : "Ociosidade e excesso de OPEX.",
    reducaoResiliencia: dependenciaBancaria > 0.5 ? "Aumento progressivo da alavancagem de terceiros." : "Concentração de capital em ativos fixos ou estoques.",
    riscoExpansao: (cgl < 0) ? "O crescimento consumirá caixa em velocidade superior à geração do negócio." : "Expansão orgânica protegida."
  };

  // Enterprise Risk Map (Governance Risks)
  const governanceRisks: { taxonomia: any, descricao: string }[] = [
    { taxonomia: 'Operacional', descricao: ebitda < 0 ? 'A matriz de custos destrói caixa na margem, exigindo turnaround focado em eficiência e OPEX.' : 'Margem operacional positiva; risco concentrado em flutuações de ciclo.' },
    { taxonomia: 'Financeiro', descricao: saldoTesouraria < 0 ? 'Descasamento grave de prazos resultando em dependência sistêmica de capital de curto prazo.' : 'Liquidez adequada para o ciclo atual de obrigações.' },
    { taxonomia: 'Estratégico', descricao: concentracaoEstoque > 0.4 ? 'Alto capital imobilizado no estoque reduz a flexibilidade e expõe a empresa a choques de demanda.' : 'Alocação de capital equilibrada sem concentrações críticas.' },
    { taxonomia: 'Governança', descricao: creditosSocios > (ac * 0.2) ? 'Falta de segregação patrimonial evidente através de alto volume de mútuos.' : 'Práticas contábeis refletem separação patrimonial adequada.' },
    { taxonomia: 'Continuidade', descricao: (liquidezReal < 0.2 && dscrSimulado < 0.5) ? 'Incapacidade latente de honrar compromissos no curto prazo pode gerar ruptura sistêmica.' : 'Operação sustentável dentro do horizonte previsível.' },
    { taxonomia: 'Patrimonial', descricao: plValue < 0 ? 'Passivo a descoberto (insolvência técnica) consome todo o patrimônio e impõe risco extremo de litígio.' : 'Base de capital próprio protege o valuation.' }
  ];

  // Value Creation Engine & Strategic Interpretation
  const valueCreation = {
    tipoCrescimento: (cgl > 0 && ebitda > 0) ? "Crescimento Saudável (Geração financia NCG)" : (ebitda > 0 ? "Crescimento Consumidor de Caixa (Asfixia tesouraria)" : "Expansão sem Sustentação (Queima de Equity)"),
    fatorDestruicao: plValue < 0 ? "Insolvência (Passivo descoberto)" : (saldoTesouraria < 0 ? "Custo Financeiro da Tesouraria" : "Nenhum fator crítico imediato"),
    alavancaValor: isInventoryDependent ? "Monetização de Estoque" : (qualidadeEndividamento > 0.6 ? "Alongamento de Dívida" : "Geração de Caixa Operacional (EBITDA)")
  };

  const strategicValueInterpretation = (ebitda > 0 && plValue > 0 && metrics.treasuryStatus === 'Robusta')
    ? "A estrutura atual cria valor econômico, protege o caixa contra fricções de curto prazo e suporta expansão alavancada orgânica."
    : (ebitda > 0 && saldoTesouraria < 0)
      ? "O modelo operacional gera valor econômico, mas a arquitetura financeira o destrói através da oneração da tesouraria e antecipações."
      : "A estrutura atual destrói valor e acelera o risco de ruptura, exigindo turnaround patrimonial imediato.";

  // Management Decision Intelligence
  const managementDecisions = {
    melhoraCaixaRapido: isInventoryDependent ? "Liquidação com desconto de estoques lentos." : (qualidadeEndividamento > 0.6 ? "Carência e reperfilamento de dívida bancária." : "Antecipação tática de recebíveis."),
    ameacaContinuidade: plValue < 0 ? "Insolvência técnica e falência de creditos societários." : (saldoTesouraria < 0 ? "Estrangulamento do fluxo de pagamento a fornecedores." : "Baixa elasticidade a choques de mercado."),
    reduzRiscoEstrutural: "Capitalização via Equity ou M&A para converter dívida em capital próprio.",
    maiorImpactoVelocidade: saldoTesouraria < 0 ? "Negociação de moratória/alongamento de fornecedores e impostos." : "Aumento de Markup/Pricing imediato."
  };

  // Predictive Causality Engine
  let primaryThreat = "Variabilidade Macroeconômica";
  let timeToImpact = "Longo Prazo";
  let mitigationFactor = "Manter governança e controle atual.";

  if (plValue < 0 && ebitda < 0) {
    primaryThreat = "Insolvência sistêmica e queima operacional simultânea.";
    timeToImpact = "Imediato (< 3 meses)";
    mitigationFactor = "Injeção de capital (Equity) mandatória.";
  } else if (saldoTesouraria < 0 && cgl < 0) {
    primaryThreat = "Inadimplência de curto prazo no contas a pagar (Fornecedores/Impostos) devido à insuficiência do CGL.";
    timeToImpact = "Curto Prazo (1 a 4 meses)";
    mitigationFactor = "Alongamento do passivo de fornecedores ou desconto comercial de recebíveis.";
  } else if (dependenciaBancaria > 0.5 && dscrSimulado < 1) {
    primaryThreat = "Oneração excessiva pelo serviço da dívida estrangulando o fluxo de caixa livre.";
    timeToImpact = "Curto a Médio Prazo";
    mitigationFactor = "Reperfilamento da dívida para o longo prazo (diminuição da parcela mensal).";
  } else if (margemErroOperacional > 0 && margemErroOperacional < weights.workingCapitalTolerance) {
    primaryThreat = "Choque abrupto na demanda ou inadimplência de grandes clientes.";
    timeToImpact = "Médio Prazo";
    mitigationFactor = "Acúmulo de reservas táticas em Caixa e Equivalentes.";
  }

  const predictiveCausality = {
    primaryThreat,
    timeToImpact,
    mitigationFactor
  };

  // -- Strategic Scenario Simulation --
  const estresse: { cenario: string; impacto: string; status: 'warning' | 'danger' | 'success' }[] = [
    {
      cenario: "Retração de Demanda (-20% na Receita)",
      impacto: ebitda > 0 && metrics.treasuryStatus === 'Robusta' 
        ? "Caixa suporta retração sem necessidade imediata de desmobilização ou novas dívidas." 
        : "Romperá a linha d'água da tesouraria, exigindo demissões estruturais e rolagem forçada.",
      status: ebitda > 0 && metrics.treasuryStatus === 'Robusta' ? 'success' : 'danger'
    },
    {
      cenario: "Aumento Inadimplência (+30% no DSO)",
      impacto: liquidezReal > 1.2 
        ? "Balanço absorve o impacto sem travar a operação devido a folga de CGL." 
        : "O asfixiamento da liquidez gerará interrupção de pagamentos a fornecedores no ciclo subsequente.",
      status: liquidezReal > 1.2 ? 'warning' : 'danger'
    },
    {
      cenario: "Expansão Acelerada (Dobro de Vendas)",
      impacto: cgl > 0 && metrics.treasuryStatus === 'Robusta' 
        ? "A estrutura financia o crescimento de forma orgânica, suportando a NCG adicional." 
        : "O crescimento exigirá aportes maciços pois a margem atual drena o caixa ao acelerar vendas.",
      status: cgl > 0 && metrics.treasuryStatus === 'Robusta' ? 'success' : 'warning'
    },
    {
      cenario: "Ruptura no Giro (Queda nos Prazos de Fornecedores)",
      impacto: saldoTesouraria > 0 
        ? "A tesouraria positiva cobre o gap gerado por aperto de fornecedores." 
        : "Cenário fatal no curto prazo, necessitará antecipação maciça de recebíveis com altas taxas.",
      status: saldoTesouraria > 0 ? 'success' : 'danger'
    },
    {
      cenario: "Choque de Custos / Taxa de Juros (+2% a.m)",
      impacto: dependenciaBancaria < 0.2 
        ? "Baixa exposição estrutural. O impacto na DRE será periférico." 
        : "Corrosão acelerada da margem líquida e deterioração do DSCR (capacidade de serviço da dívida).",
      status: dependenciaBancaria < 0.2 ? 'success' : 'danger'
    }
  ];

  const prioridadesEstrategicas = [
    { nome: "Proteção da Liquidez Real", status: liquidezReal < 0.6 || saldoTesouraria < 0 ? "Atenção" : (liquidezReal < 1.0 ? "Sensível" : "Saudável") },
    { nome: "Eficiência de Estoques", status: concentracaoEstoque > 0.4 ? "Atenção" : (concentracaoEstoque > 0.25 ? "Monitoramento" : "Saudável") },
    { nome: "Capitalização Estrutural", status: plValue < 0 ? "Atenção" : (indiceDescapitalizacao > 0.3 ? "Fragilizado" : "Saudável") },
    { nome: "Cobertura de Dívida (DSCR)", status: dscrSimulado < 1 ? "Atenção" : (dscrSimulado < 1.5 ? "Sensível" : "Saudável") }
  ];

  // Executive Action Matrix
  const strategicActionMatrix: ExecutiveAction[] = [];
  if (liquidezReal < 0.8 || qualidadeEndividamento > 0.7) {
    strategicActionMatrix.push({ acao: "Reperfilamento Passivo Bancário", impacto: "Alto", velocidade: "Curto Prazo", complexidade: "Alta", prioridade: "Imediata" });
  }
  if (concentracaoEstoque > 0.4) {
    strategicActionMatrix.push({ acao: "Desmobilização de Estoque (Promoção Tática)", impacto: "Médio", velocidade: "Imediata", complexidade: "Baixa", prioridade: "Alta" });
  }
  if (plValue < 0 && ebitda <= 0) {
    strategicActionMatrix.push({ acao: "M&A Distressed / Injeção de Equity", impacto: "Alto", velocidade: "Longo Prazo", complexidade: "Alta", prioridade: "Imediata" });
  } else if (plValue < 0 && ebitda > 0) {
    strategicActionMatrix.push({ acao: "Recuperação Orgânica (Reinvestimento de Margem e Alongamento Passivo)", impacto: "Alto", velocidade: "Médio Prazo", complexidade: "Alta", prioridade: "Alta" });
  }
  if (cgl < 0 && saldoTesouraria < 0) {
    strategicActionMatrix.push({ acao: "Alongamento do Prazo Médio de Fornecedores", impacto: "Alto", velocidade: "Imediata", complexidade: "Média", prioridade: "Imediata" });
  }
  if (ebitda < 0) {
    strategicActionMatrix.push({ acao: "Corte de SG&A e Revisão de Pricing", impacto: "Alto", velocidade: "Curto Prazo", complexidade: "Média", prioridade: "Imediata" });
  }
  if (strategicActionMatrix.length === 0) {
    strategicActionMatrix.push({ acao: "Reinvestimento em Expansão de ROIC", impacto: "Médio", velocidade: "Longo Prazo", complexidade: "Média", prioridade: "Estratégica" });
  }

  // Ordenação da matriz: Imediata -> Alta -> Moderada -> Estratégica
  const orderMap = { "Imediata": 1, "Alta": 2, "Moderada": 3, "Estratégica": 4 };
  strategicActionMatrix.sort((a, b) => orderMap[a.prioridade] - orderMap[b.prioridade]);

  const impactosEsperados = strategicActionMatrix.map(rec => ({
    acao: rec.acao,
    impacto: `Impacto ${rec.impacto} com velocidade ${rec.velocidade}`
  }));

  let lqDiagnostico = "";
  if (altaConversibilidade === 0) {
    lqDiagnostico = "Reserva imediata restrita. A arquitetura financeira está exposta à volatilidade e dependente da realização ininterrupta do giro (contas a receber).";
  } else if (baixaConversibilidade > (mediaConversibilidade + altaConversibilidade)) {
    lqDiagnostico = `A liquidez teórica está ancorada primariamente em ativos lentos, o que em cenários de stress do setor ${(industry || 'Geral').toUpperCase()} pode gerar ágio elevado na conversão para caixa.`;
  } else {
    lqDiagnostico = "A estrutura de conversibilidade de ativos é de alta qualidade, permitindo absorção ágil de obrigações sem fricção desnecessária ou desconto comercial punitivo.";
  }

  let statusIce = "Operação Saudável e Resiliente";
  let statusIceColor = "emerald";
  if (indiceContinuidade < 20 && plValue < 0 && ebitda < 0) { statusIce = "Ruptura Estrutural Comprovada"; statusIceColor = "rose"; }
  else if (indiceContinuidade < 45) { statusIce = "Fricção Operacional Elevada / Iliquidez"; statusIceColor = "rose"; }
  else if (indiceContinuidade < 65) { statusIce = "Sensível (Necessita Preservação de Giro)"; statusIceColor = "amber"; }
  else if (indiceContinuidade < 85) { statusIce = "Estável (Acompanhamento Executivo)"; statusIceColor = "blue"; }

  const rawAdvisory = {
    maturidade,
    diagnostico,
    fragilidades,
    estrategico,
    tendencia,
    prioridades,
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
    strategicValueInterpretation,
    treasuryIntelligence,
    prioridadesEstrategicas,
    strategicActionMatrix,
    impactosEsperados,
    liquidityQuality: {
      diagnostico: lqDiagnostico,
      riscoEstrangulamento: (saldoTesouraria < 0 || liquidezReal < 0.4) ? "Atenção (Giro Pressionado)" : (liquidezReal < 0.8 ? "Sensível" : "Baixo"),
      qualidadeCapitalGiro: cgl < 0 ? "Consumo de Terceiros" : "Sustentável",
      metricas: {
        alta: altaConversibilidade,
        media: mediaConversibilidade,
        baixa: baixaConversibilidade,
        restrita: restritaConversibilidade
      }
    },
    indiceContinuidade: {
      status: statusIce,
      color: statusIceColor
    }
  };

  // -- Causal Validation Layer (Trava de Segurança Institucional) --
  if (saldoTesouraria > 0 && cgl > ncg) {
    rawAdvisory.liquidityQuality.riscoEstrangulamento = "Baixo";
    rawAdvisory.predicao.riscoRuptura = "Baixa Probabilidade";
  }
  if (ebitda < 0 && plValue < 0) {
    rawAdvisory.indiceContinuidade.status = "Ruptura Estrutural Comprovada";
    rawAdvisory.indiceContinuidade.color = "rose";
  }

  return validateNarrativeOutput(rawAdvisory, resilienciaGlobal);
}

function createEmptyAdvisory(): AdvisoryOutput {
  return {
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
