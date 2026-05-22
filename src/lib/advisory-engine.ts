import { BPSummary } from './bpEngine';
import { FinancialMetrics } from './financial-engine';
import { ScoreMetrics } from './score-engine';

export interface AdvisoryOutput {
  maturidade: string;
  diagnostico: string;
  fragilidades: string[];
  estrategico: string[];
  tendencia: string;
  prioridades: string[];
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
  };
  estresse: {
    cenario: string;
    impacto: string;
    status: 'warning' | 'danger' | 'success';
  }[];
  prioridadesEstrategicas: { nome: string; status: string }[];
  recomendacoesExecutivas: string[];
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
  scores: ScoreMetrics
): AdvisoryOutput {
  if (!metrics.hasData) {
    return createEmptyAdvisory();
  }

  const {
    ebitda, liqCorrente, liquidezReal, saldoTesouraria, cgl, ncg, concentracaoEstoque,
    qualidadeEndividamento, dependenciaBancaria, indiceDescapitalizacao,
    autonomiaFinanceira, liqSeca
  } = metrics;

  const { 
    passivoCirculante: pc, patrimonioLiquido: plValue, 
    altaConversibilidade, mediaConversibilidade, baixaConversibilidade, restritaConversibilidade,
    ativoCirculante: ac, creditosSocios
  } = bpSummary;

  const { resilienciaGlobal, indiceContinuidade } = scores;

  // -- Maturidade (Aplicando restrições de governança) --
  let maturidade = "";
  if (plValue < 0) {
    maturidade = 'Insolvência Técnica';
  } else if (resilienciaGlobal <= 15) {
    maturidade = 'Estresse Financeiro Severo';
  } else if (resilienciaGlobal <= 30) {
    maturidade = 'Risco Crítico de Continuidade';
  } else if (resilienciaGlobal <= 45) {
    maturidade = 'Estrutura Pressionada';
  } else if (resilienciaGlobal <= 60) {
    maturidade = 'Atenção';
  } else if (resilienciaGlobal <= 75) {
    maturidade = 'Estável';
  } else if (resilienciaGlobal <= 90) {
    maturidade = 'Saudável';
  } else {
    maturidade = 'Alta Solidez Patrimonial';
  }

  // Travas de narrativa (Expressões proibidas)
  if (liqCorrente < 1 || plValue < 0 || saldoTesouraria < 0) {
    if (['Saudável', 'Alta Solidez Patrimonial', 'Estável'].includes(maturidade) && plValue > 0) {
       maturidade = 'Atenção (Pressão de Curto Prazo)';
    }
  }

  const isCriticalLiquidity = liqCorrente < 0.8 || saldoTesouraria < 0;
  const isEroding = plValue < 0 || indiceDescapitalizacao > 0.5;
  const isInventoryDependent = concentracaoEstoque > 0.35;
  const isDebtDependent = dependenciaBancaria > 0.5;

  let diagnostico = "";
  if (plValue < 0 && ebitda < 0 && saldoTesouraria < 0 && liqCorrente < 0.8) {
    diagnostico = "A organização opera em estado de insolvência técnica e estresse operacional. O patrimônio líquido é negativo, não há geração de caixa operacional (EBITDA negativo) e a liquidez é crítica, evidenciando ruptura operacional iminente.";
  } else if (plValue < 0 && ebitda > 0 && liqCorrente < 1) {
    // Regra 11.5.6 - Curadoria para Insolvência Técnica com Operação Ativa
    diagnostico = "A empresa apresenta insolvência técnica patrimonial e severa pressão de liquidez, porém ainda preserva capacidade operacional. O principal risco está no descasamento entre obrigações de curto prazo e ativos de baixa conversibilidade econômica, exigindo reestruturação financeira, alongamento de passivos, capitalização e disciplina rigorosa de capital de giro.";
  } else if (plValue < 0 && ebitda > 0) {
    // Regra 11.5.3
    diagnostico = "A operação ainda preserva capacidade de geração operacional, porém a estrutura financeira permanece pressionada e dependente de reestruturação.";
  } else if (plValue < 0) {
    diagnostico = "A organização opera com passivo a descoberto (insolvência técnica), porém ainda mantém base de ativos e atividade. Há urgência de capitalização para reverter a deterioração estrutural antes que contamine a operação.";
  } else if (plValue > 0 && liqCorrente < 1 && cgl < 0 && saldoTesouraria < 0) {
    // Regra 12 oficial do Master_Financial_Intelligence_Engine.md
    diagnostico = "A empresa apresenta estrutura patrimonial positiva, porém financeiramente pressionada. O principal risco está no descasamento entre obrigações de curto prazo e ativos líquidos disponíveis. A prioridade estratégica deve ser a recomposição do capital de giro, alongamento de passivos, melhoria do ciclo financeiro e preservação da geração operacional.";
  } else if (plValue > 0 && ebitda < 0 && saldoTesouraria < 0) {
    diagnostico = "Estrutura financeiramente pressionada. Apesar do patrimônio líquido positivo e da base de ativos realizáveis, a operação queima caixa (EBITDA negativo) e o giro sufocado exige dependência de capital de terceiros. Necessidade urgente de turnaround da operação.";
  } else if (ebitda > 0 && saldoTesouraria < 0) {
    // Regra 11.5.3 (Complemento para tesouraria negativa com ebitda positivo)
    diagnostico = "A operação ainda preserva capacidade de geração operacional, porém a estrutura financeira permanece pressionada e dependente de reestruturação.";
  } else if (isEroding) {
    diagnostico = "A estrutura patrimonial permanece positiva, porém altamente pressionada pelo elevado nível de endividamento de curto prazo e pela baixa participação de capital próprio na sustentação operacional.";
  } else if (isCriticalLiquidity) {
    diagnostico = "A empresa possui um patrimônio estrutural, porém sua estrutura de capital de giro e liquidez estão comprimidas, indicando pressão de caixa e necessidade de otimização de tesouraria e rolagens estratégicas.";
  } else if (autonomiaFinanceira > 0.5 && liqCorrente >= 1.2 && ebitda > 0) {
    diagnostico = "A companhia apresenta uma estrutura patrimonial e operacional saudável, com geração de caixa (EBITDA positivo), adequada folga de liquidez e capitalização compatível com sua escala.";
  } else {
    diagnostico = "A estrutura patrimonial encontra-se estável, porém requer atenção. Há dependência da eficiência comercial e do capital de giro contínuo para manter a operação sem necessitar de novas dívidas caras.";
  }

  // Regra 11.5.4 Liquidez Real vs Liquidez Contábil
  if (liquidezReal < liqCorrente * 0.6) {
    diagnostico += " Existe distorção relevante entre liquidez contábil e liquidez econômica real (excesso de ativos de baixa conversibilidade), conferindo uma falsa percepção de solvência de curto prazo.";
  }

  const fragilidades = [];
  if (saldoTesouraria < 0) fragilidades.push("Tesouraria Estruturalmente Negativa: A necessidade de giro supera o capital de giro próprio.");
  if (isInventoryDependent) fragilidades.push("Alta imobilização de capital em estoques, reduzindo a liquidez real da operação.");
  if (qualidadeEndividamento > 0.7) fragilidades.push("Passivos excessivamente concentrados no curto prazo (exigibilidade imediata altíssima).");
  if (creditosSocios > (ac * 0.15)) fragilidades.push("Volume expressivo de capital travado em mútuos ou créditos com partes relacionadas.");
  if (isDebtDependent) fragilidades.push("Alta dependência de capital oneroso (dívida bancária), pressionando as margens operacionais.");
  if (fragilidades.length === 0) fragilidades.push("Não foram detectadas fragilidades estruturais críticas no fechamento do período.");

  const estrategico = [];
  if (isInventoryDependent && isCriticalLiquidity) estrategico.push("O nível elevado de estoques associado à baixa liquidez sugere imobilização de caixa. Uma desaceleração nas vendas forçará a captação de dívida para gerar liquidez de emergência.");
  if (saldoTesouraria < 0 && plValue > 0) estrategico.push("Apesar da viabilidade patrimonial, o descompasso na tesouraria exige que parte do lucro gerado seja retido apenas para sustentar o giro diário, anulando a capacidade de distribuição de dividendos consistentes.");
  if (autonomiaFinanceira < 0.3) estrategico.push("A baixa participação de capital próprio amplia o risco da alavancagem financeira, transferindo a maior parte da geração de valor para o pagamento do serviço da dívida (bancos).");
  if (estrategico.length === 0) estrategico.push("O balanço não aponta para vulnerabilidades extremas no curtíssimo prazo; no entanto, a margem de elasticidade financeira deve ser monitorada de perto.");

  let tendencia = "";
  if (plValue < 0 && ebitda < 0) tendencia = "Cenário de deterioração contínua rumo a uma ruptura operacional iminente se não houver reestruturação profunda da dívida e capitalização externa urgente.";
  else if (isEroding && ebitda < 0) tendencia = "Risco elevado de deterioração financeira. A operação queima o patrimônio gradualmente sem conseguir originar caixa orgânico suficiente para a virada.";
  else if (isCriticalLiquidity && ebitda > 0) tendencia = "Pressão de liquidez operacional. O EBITDA é positivo, o que permite que a repactuação de dívidas de curto prazo alivie o estrangulamento de tesouraria.";
  else if (autonomiaFinanceira > 0.5 && liqSeca > 1 && indiceDescapitalizacao === 0) tendencia = "Trajetória de expansão sustentável com ampla capacidade de absorção de choques de mercado e preservação estrutural da base de capital.";
  else if (autonomiaFinanceira > 0.5 && indiceDescapitalizacao > 0) tendencia = "A composição primária do capital se mantém aparentemente estável, porém a erosão operacional (prejuízos) drena silenciosamente a robustez da companhia.";
  else tendencia = "Manutenção do status quo, condicionada à eficiência rigorosa do EBITDA para não agravar a restrita margem de segurança financeira e de giro.";

  const prioridades = [];
  if (plValue < 0) prioridades.push("Aprovar plano de injeção de equity (chamada de capital) ou conversão de dívidas estratégicas em capital.");
  if (isDebtDependent || qualidadeEndividamento > 0.7) prioridades.push("Reestruturar o perfil da dívida de curto prazo para reduzir a pressão de tesouraria e restaurar a capacidade operacional de capital de giro.");
  if (isInventoryDependent) prioridades.push("Estabelecer metas de eficiência de giro de estoque e renegociar agressivamente prazos com fornecedores essenciais.");
  if (saldoTesouraria < 0) prioridades.push("Blindar o caixa revisando a política de crédito concedido e exigindo maior alinhamento de prazos operacionais.");
  if (prioridades.length === 0) prioridades.push("Manter as políticas de governança e focar em projetos que maximizem o Retorno sobre Capital Empregado (ROCE).");

  const predicao = {
    horizontePressao: saldoTesouraria < 0 || plValue < 0 ? "Curto Prazo (Imediato)" : (liqCorrente < 1 || liquidezReal < 0.5 || dependenciaBancaria > 0.5 ? "Médio Prazo (Monitoramento)" : "Longo Prazo Estável"),
    riscoRuptura: plValue < 0 || saldoTesouraria < 0 ? "Alto/Crítico" : (liqSeca < 0.8 ? "Moderado" : "Baixo"),
    dependenciaGeracao: (cgl < 0 || liqSeca < 1 || liquidezReal < 0.5 || saldoTesouraria < 0) ? "Alta (Dependente da Eficiência Operacional)" : "Estável com Baixa Folga",
    riscoDescapitalizacaoProgressiva: indiceDescapitalizacao > 0.5 ? "Elevado (Erosão letal)" : (indiceDescapitalizacao > 0 ? "Moderado (Erosão em andamento)" : "Baixo (Capital preservado)"),
    sensibilidadeChoques: resilienciaGlobal < 40 ? "Alta (Vulnerável)" : (resilienciaGlobal < 70 ? "Moderada (Atenção)" : "Baixa (Resiliente)")
  };

  let capacidadeAbsorcao = (plValue > 0 && saldoTesouraria > 0 && liquidezReal > 0.8 && liqSeca > 0.8 && cgl > 0) ? "Alta (Resiliente)" : (plValue > 0 && saldoTesouraria >= 0 ? "Moderada (Sensível a Choques Operacionais)" : "Nula (Vulnerável e Dependente)");
  if (capacidadeAbsorcao.includes("Alta") && (baixaConversibilidade + restritaConversibilidade) > (altaConversibilidade * 2)) {
    capacidadeAbsorcao = "Moderada (Imobilização em Giro Reduz Flexibilidade)";
  }

  const elasticidadeFinanceira = {
    capacidadeAbsorcaoChoques: capacidadeAbsorcao,
    dependenciaOperacao: (cgl < 0 || saldoTesouraria < 0) ? "Giro sufocado (Altamente dependente)" : (liqCorrente < 1.2 ? "Estável com Baixa Folga" : "Equilibrada (Giro cobre operações)"),
    necessidadeCapitalizacao: plValue < 0 ? "Emergencial (Equity necessário)" : (indiceDescapitalizacao > 0.3 ? "Recomendada (Recompor margem)" : "Desnecessária no momento"),
    resilienciaEstrutural: resilienciaGlobal < 40 ? "Frágil" : (resilienciaGlobal < 70 ? "Adequada" : "Forte")
  };

  const isElastic = capacidadeAbsorcao.includes("Alta") && ebitda > 0;
  const estresse: { cenario: string; impacto: string; status: 'warning' | 'danger' | 'success' }[] = [
    {
      cenario: "Queda de Receita (-20%)",
      impacto: ebitda > 0 ? "O EBITDA sofrerá compressão imediata, exigindo cortes drásticos em SG&A." : "Risco de ruptura. Sem margem operacional prévia, a quebra de receita forçará captação imediata de dívida para cobrir folha e fornecedores.",
      status: isElastic ? "warning" : "danger" as const
    },
    {
      cenario: "Inadimplência (+15%)",
      impacto: (cgl < 0) ? "Ruptura iminente no ciclo financeiro. Com a tesouraria já pressionada, falhas no recebimento geram descasamento diário de obrigações de curto prazo." : "Redução do fluxo de caixa livre. A estrutura de capital absorve o tranco, mas obriga a repactuação tática de prazos com o passivo circulante.",
      status: cgl < 0 ? "danger" : "warning" as const
    },
    {
      cenario: "Aumento de Juros (+200 bps)",
      impacto: dependenciaBancaria > 0.3 ? "O custo financeiro maior comprimirá severamente o Fluxo de Caixa Livre e a Última Linha (Lucro Líquido), elevando o risco de liquidez." : "Impacto orgânico absorvível no Fluxo de Caixa Livre, devido à baixa exposição a capital de terceiros oneroso.",
      status: dependenciaBancaria > 0.3 ? "danger" : "success" as const
    },
    {
      cenario: "Pressão sobre Estoques",
      impacto: concentracaoEstoque > 0.35 ? "Imobilização grave de capital. O encalhe trava a capacidade de conversão de caixa, sufocando o EBITDA indiretamente por falta de giro." : "Baixo impacto sistêmico; a composição atual do capital de giro detém independência da velocidade de giro do estoque.",
      status: concentracaoEstoque > 0.35 ? "danger" : "success" as const
    }
  ];

  const prioridadesEstrategicas = [
    { nome: "Liquidez Imediata/Curta", status: liqCorrente < 1 || saldoTesouraria < 0 ? "Crítico" : (liqCorrente < 1.2 ? "Atenção" : "Monitorar (Baixa Folga)") },
    { nome: "Giro de Estoques", status: concentracaoEstoque > 0.4 ? "Crítico" : (concentracaoEstoque > 0.25 ? "Atenção" : "Monitorar") },
    { nome: "Pressão Operacional", status: cgl < 0 || saldoTesouraria < 0 ? "Crítico" : (liqSeca < 0.8 ? "Atenção" : "Monitorar (Baixa Folga)") },
    { nome: "Capitalização (PL)", status: plValue < 0 ? "Crítico" : (indiceDescapitalizacao > 0.3 ? "Atenção" : "Estável") },
    { nome: "Margem de Proteção", status: capacidadeAbsorcao.includes("Nula") ? "Crítico" : (capacidadeAbsorcao.includes("Moderada") ? "Monitorar" : "Controlado") }
  ];

  const recomendacoesExecutivas = [];
  if (liqCorrente < 1 || qualidadeEndividamento > 0.7) recomendacoesExecutivas.push("Alongamento urgente de passivos (troca de dívidas curtas por prazos mais longos).");
  if (concentracaoEstoque > 0.4) recomendacoesExecutivas.push("Redução agressiva de estoques; renegociação de compras e desmobilização de capital travado.");
  if (plValue < 0 || (isEroding && indiceDescapitalizacao > 0.5)) recomendacoesExecutivas.push("Capitalização imediata: Necessidade de injeção de equity via chamada de capital ou novo sócio.");
  if (cgl < 0 && saldoTesouraria < 0) recomendacoesExecutivas.push("Otimização do ciclo financeiro: alongar prazo médio de pagamento a fornecedores e antecipar recebimentos.");
  if (indiceDescapitalizacao > 0 && plValue > 0) recomendacoesExecutivas.push("Revisão de pricing e corte de SG&A: Operação não está gerando margem para bancar despesas, corroendo reservas.");
  if (recomendacoesExecutivas.length === 0) {
     recomendacoesExecutivas.push("Aceleração de projetos de Retorno sobre Capital Empregado (ROCE) utilizando o caixa livre.");
     recomendacoesExecutivas.push("Estudos de M&A ou distribuição segura de dividendos baseado na atual estabilidade.");
  }

  const impactosEsperados = [];
  recomendacoesExecutivas.forEach(rec => {
    if (rec.includes("Alongamento")) impactosEsperados.push({ acao: "Alongamento de Passivos", impacto: "Alívio agudo na pressão de tesouraria de curto prazo." });
    if (rec.includes("Redução agressiva")) impactosEsperados.push({ acao: "Redução de Estoques", impacto: "Injeção imediata de caixa e melhoria na Liquidez Real." });
    if (rec.includes("Capitalização imediata")) impactosEsperados.push({ acao: "Capitalização", impacto: "Restauração da resiliência estrutural e redução de risco sistêmico." });
    if (rec.includes("Otimização do ciclo")) impactosEsperados.push({ acao: "Otimização Financeira", impacto: "Sincronização de caixa e alívio da necessidade de dívidas de curtíssimo prazo." });
    if (rec.includes("Revisão de pricing")) impactosEsperados.push({ acao: "Corte SG&A / Pricing", impacto: "Estancamento da corrosão de margem e proteção do Capital de Giro Próprio." });
  });
  if (impactosEsperados.length === 0) {
     impactosEsperados.push({ acao: "Manutenção de Governança", impacto: "Proteção da elasticidade financeira e perpetuação do crescimento sustentável." });
  }

  let lqDiagnostico = "";
  if (altaConversibilidade === 0) {
    lqDiagnostico = "Ausência crítica de liquidez imediata. A operação depende inteiramente da conversão de ativos operacionais ou injeção externa.";
  } else if (baixaConversibilidade > mediaConversibilidade && altaConversibilidade < baixaConversibilidade) {
    lqDiagnostico = "Liquidez fortemente comprometida pelo alto volume de ativos de baixa conversibilidade (estoques e créditos lentos). A resiliência financeira demanda aceleração do ciclo de giro e destravamento de contas retidas.";
  } else if (restritaConversibilidade > altaConversibilidade * 2) {
    lqDiagnostico = "Distorção estrutural: volume expressivo de capital retido em ativos de difícil realização (ex: mútuos), reduzindo drasticamente a liquidez econômica real.";
  } else if (altaConversibilidade > (pc * 0.5)) {
    lqDiagnostico = "Liquidez econômica robusta. A disponibilidade imediata confere ampla elasticidade e independência em relação ao ciclo operacional de recebíveis.";
  } else {
    lqDiagnostico = "Liquidez condicionada à regularidade do ciclo operacional. O fluxo de caixa depende fortemente do recebimento tempestivo de clientes e da gestão rigorosa do capital de giro.";
  }

  let statusIce = "Expansão Protegida";
  let statusIceColor = "emerald";
  if (indiceContinuidade < 30) { statusIce = "Alta Fricção (Sobrevivência em Risco)"; statusIceColor = "rose"; }
  else if (indiceContinuidade < 50) { statusIce = "Dependência de Capitalização/Rolagem"; statusIceColor = "amber"; }
  else if (indiceContinuidade < 75) { statusIce = "Sustentabilidade Condicionada"; statusIceColor = "amber"; }
  else if (indiceContinuidade < 90) { statusIce = "Estabilidade com Baixa Folga"; statusIceColor = "blue"; }
  else { 
    statusIce = "Operação Contínua Assegurada"; 
    statusIceColor = "emerald"; 
  }

  return {
    maturidade,
    diagnostico,
    fragilidades,
    estrategico,
    tendencia,
    prioridades,
    predicao,
    elasticidadeFinanceira,
    estresse,
    prioridadesEstrategicas,
    recomendacoesExecutivas,
    impactosEsperados,
    liquidityQuality: {
      diagnostico: lqDiagnostico,
      riscoEstrangulamento: (saldoTesouraria < 0 || altaConversibilidade === 0) ? "Imediato/Severo" : (baixaConversibilidade > (mediaConversibilidade + altaConversibilidade) ? "Latente (Baixa Conversão)" : "Controlado"),
      qualidadeCapitalGiro: (saldoTesouraria < 0 || cgl < 0) ? "Severa Pressão de Caixa (Necessidade de Giro Descoberta)" : ((mediaConversibilidade + altaConversibilidade) > baixaConversibilidade ? "Estável (Giro Sustenta a Operação)" : "Baixa (Giro Imobilizado em Baixa Conversibilidade)"),
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
}

function createEmptyAdvisory(): AdvisoryOutput {
  return {
    maturidade: 'Pendente',
    diagnostico: 'Dados insuficientes para diagnóstico.',
    fragilidades: [], estrategico: [], tendencia: '', prioridades: [],
    predicao: { horizontePressao: '', riscoRuptura: '', dependenciaGeracao: '', riscoDescapitalizacaoProgressiva: '', sensibilidadeChoques: '' },
    elasticidadeFinanceira: { capacidadeAbsorcaoChoques: '', dependenciaOperacao: '', necessidadeCapitalizacao: '', resilienciaEstrutural: '' },
    estresse: [], prioridadesEstrategicas: [], recomendacoesExecutivas: [], impactosEsperados: [],
    liquidityQuality: { diagnostico: '', riscoEstrangulamento: '', qualidadeCapitalGiro: '', metricas: { alta: 0, media: 0, baixa: 0, restrita: 0 } },
    indiceContinuidade: { status: 'Pendente', color: 'slate' }
  };
}
