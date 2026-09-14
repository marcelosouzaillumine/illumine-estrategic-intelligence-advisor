export interface OperationalInput {
  receitaLiquida: number;
  custosVariaveis: number;
  custosFixos: number;
  despesasOperacionais: number;
  ebitda: number;
  lucroLiquido: number;
  
  saldoTesouraria: number;
  necessidadeCapitalGiro: number;
  
  crescimentoReceita: number; 
  crescimentoDespesas: number;
  
  segmentoEmpresarial: string;
  historicoSazonal: boolean;
  diasRecebimento: number;
}

export interface OperationalSignal {
  score: number;
  classification: string;
  confidence: 'Alta' | 'Média' | 'Baixa';
  causalFlags: string[];
  advisoryNotes: string[];
  blockedFalsePositives: string[];
  riskPropagationSignals: string[];
}

export interface OperationalIntelligenceReport {
  ebitdaQuality: OperationalSignal;
  elasticity: OperationalSignal;
  cashConversion: OperationalSignal;
  growthDestroyingCash: OperationalSignal | null;
  revenueWithoutMargin: OperationalSignal | null;
  artificialEbitda: OperationalSignal | null;
  hospitalPressure: OperationalSignal | null;
  seasonality: OperationalSignal | null;
}

// Helper para lerp inverso
const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
const inverseLerp = (val: number, min: number, max: number) => clamp((val - min) / (max - min), 0, 1);

export function detectGrowthDestroyingCash(input: OperationalInput): OperationalSignal | null {
  const isGrowing = input.crescimentoReceita > 0.05;
  const isDestroyingCash = input.ebitda > 0 && input.saldoTesouraria < 0 && input.necessidadeCapitalGiro > (input.receitaLiquida * 0.2);
  
  if (!isGrowing || !isDestroyingCash) return null;

  return {
    score: 0.1, // Risco alto (score baixo = qualidade baixa)
    classification: 'Crescimento Destrutivo',
    confidence: 'Alta',
    causalFlags: ['Crescimento Tensionado', 'Pressão Estrutural Crescente', 'Deterioração Operacional Silenciosa'],
    advisoryNotes: [
      'Expansão destruindo caixa livre.',
      'A necessidade de giro está consumindo toda a geração do EBITDA.',
      'Disciplina de expansão e preservação de liquidez são imperativas.'
    ],
    blockedFalsePositives: ['Crescimento Saudável', 'Expansão Sustentável', 'Alta Resiliência Operacional'],
    riskPropagationSignals: ['Risco Sistêmico de Tesouraria', 'Dependência de Capital Externo']
  };
}

export function detectRevenueWithoutMargin(input: OperationalInput): OperationalSignal | null {
  const isGrowing = input.crescimentoReceita > 0;
  const losingMargin = input.crescimentoDespesas > input.crescimentoReceita;
  
  if (!isGrowing || !losingMargin) return null;

  return {
    score: 0.3,
    classification: 'Crescimento Improdutivo',
    confidence: 'Alta',
    causalFlags: ['Deterioração Operacional', 'Eficiência Reduzida', 'Destruição de Valor Operacional'],
    advisoryNotes: [
      'Despesas estão crescendo num ritmo superior ao da receita.',
      'Foco urgente em eficiência e proteção de margem antes de buscar volume.',
      'Revisão estrutural de custos necessária.'
    ],
    blockedFalsePositives: ['Crescimento de Receita como Sucesso Automático', 'Expansão Saudável'],
    riskPropagationSignals: ['Corrosão Progressiva da Rentabilidade']
  };
}

export function detectArtificialEbitda(input: OperationalInput): OperationalSignal | null {
  // Ebitda positivo, mas Lucro extremamente negativo e caixa sangrando
  const isEbitdaPositive = input.ebitda > 0;
  const isDeteriorating = input.lucroLiquido < 0 && input.saldoTesouraria < 0;
  // Ou despesas reduzidas artificialmente enquanto crescimento despenca
  const artificialCuts = input.crescimentoDespesas < -0.1 && input.crescimentoReceita < -0.1;
  
  if (!isEbitdaPositive || (!isDeteriorating && !artificialCuts)) return null;

  return {
    score: 0.4,
    classification: 'EBITDA Frágil',
    confidence: 'Média',
    causalFlags: ['Sustentabilidade Limitada', 'Qualidade Operacional Reduzida', 'Risco de Deterioração Futura'],
    advisoryNotes: [
      'O EBITDA positivo não reflete a capacidade real de geração de caixa sustentável.',
      'Margem artificialmente sustentada ou consumida por estrutura não-operacional pesada.',
      'Avaliar sustentabilidade real da margem a longo prazo.'
    ],
    blockedFalsePositives: ['Eficiência Operacional Automática', 'Operação Robusta', 'EBITDA Isolado Positivo'],
    riskPropagationSignals: ['Ilusão de Liquidez', 'Vulnerabilidade Estrutural']
  };
}

export function detectHospitalOperationalPressure(input: OperationalInput): OperationalSignal | null {
  if (input.segmentoEmpresarial !== 'saude' && input.segmentoEmpresarial !== 'hospitalar') return null;
  
  const longCycle = input.diasRecebimento > 90;
  const heavyFixedCost = input.custosFixos > (input.receitaLiquida * 0.4);
  const pressure = input.saldoTesouraria < 0;

  if (!longCycle || !heavyFixedCost || !pressure) return null;

  return {
    score: 0.2,
    classification: 'Dependência Operacional Hospitalar',
    confidence: 'Alta',
    causalFlags: ['Pressão Estrutural Recorrente', 'Elasticidade Limitada', 'Stress Operacional Contínuo'],
    advisoryNotes: [
      'A longa maturação dos recebíveis somada ao custo fixo pesado asfixia a tesouraria.',
      'Gestão de recebíveis (combate a glosas) e previsibilidade operacional são mandatórias.',
      'Estrutura altamente dependente do ciclo de convênios.'
    ],
    blockedFalsePositives: ['Faturamento = Caixa'],
    riskPropagationSignals: ['Stress Permanente de Caixa']
  };
}

export function detectSeasonalityBehavior(input: OperationalInput): OperationalSignal | null {
  if (!input.historicoSazonal) return null;

  return {
    score: 0.8,
    classification: 'Sazonalidade Operacional',
    confidence: 'Média',
    causalFlags: ['Pressão Sazonal Previsível', 'Oscilação Temporária'],
    advisoryNotes: [
      'O negócio opera sob forte sazonalidade. Oscilações de margem devem ser vistas sob contexto longitudinal.',
      'Priorizar estabilidade histórica sobre quedas temporárias.'
    ],
    blockedFalsePositives: ['Deterioração Estrutural Automática', 'Colapso Prematuro'],
    riskPropagationSignals: ['Mitigação do Risco Sazonal']
  };
}

export function assessOperationalElasticity(input: OperationalInput): OperationalSignal {
  // Elasticidade: proporção de custo variável vs fixo. Se fixo é alto, operação é rígida.
  const isRigid = input.custosFixos > (input.receitaLiquida * 0.35);
  
  if (isRigid) {
    return {
      score: 0.3,
      classification: 'Operação Rígida',
      confidence: 'Alta',
      causalFlags: ['Forte Dependência de Escala', 'Custos Fixos Excessivos', 'Baixa Flexibilidade Operacional'],
      advisoryNotes: [
        'A estrutura engessada exige escala contínua para diluir os custos fixos.',
        'Qualquer retração da receita gerará danos profundos à margem.'
      ],
      blockedFalsePositives: ['Forte Absorção Operacional'],
      riskPropagationSignals: ['Sensibilidade Extrema a Retração']
    };
  }

  return {
    score: 0.9,
    classification: 'Operação Elástica',
    confidence: 'Alta',
    causalFlags: ['Suporta Crescimento', 'Baixa Deterioração Marginal', 'Forte Absorção Operacional'],
    advisoryNotes: [
      'A estrutura enxuta permite absorver expansão com alavancagem operacional saudável.',
      'Capaz de acomodar retração moderada de receita sem destruição violenta de caixa.'
    ],
    blockedFalsePositives: ['Risco de Escala'],
    riskPropagationSignals: []
  };
}

export function assessCashConversion(input: OperationalInput): OperationalSignal {
  // EBITDA = 0 ? evitamos divisões por zero
  const ebitda = input.ebitda > 0 ? input.ebitda : 1;
  const needCapital = input.necessidadeCapitalGiro;
  // Conversao fragil se NCG consome o EBITDA ou Tesouraria tá afundada
  const fragile = input.saldoTesouraria < 0 && (needCapital > ebitda);

  if (fragile) {
    return {
      score: 0.2,
      classification: 'Conversão Frágil',
      confidence: 'Alta',
      causalFlags: ['EBITDA Positivo com Caixa Pressionado', 'Crescimento Dependente de Capital'],
      advisoryNotes: [
        'O lucro apurado não se reflete em caixa livre.',
        'A operação demanda alto reinvestimento no giro financeiro.'
      ],
      blockedFalsePositives: ['Caixa Forte Automático'],
      riskPropagationSignals: ['Estresse de Liquidez']
    };
  }

  return {
    score: 0.9,
    classification: 'Conversão Saudável',
    confidence: 'Alta',
    causalFlags: ['Lucro Operacional Consistente', 'Baixa Deterioração de Caixa'],
    advisoryNotes: [
      'A operação consegue transmutar a performance da DRE em saldo livre no caixa.',
      'Sustenta crescimento sem asfixia de tesouraria.'
    ],
    blockedFalsePositives: ['Pressão Operacional Fantasma'],
    riskPropagationSignals: []
  };
}

export function classifyEbitdaQuality(
  input: OperationalInput, 
  cashConversion: OperationalSignal, 
  elasticity: OperationalSignal,
  artificial: OperationalSignal | null,
  destructive: OperationalSignal | null
): OperationalSignal {

  if (destructive) {
    return {
      score: 0.1,
      classification: 'EBITDA Destrutivo',
      confidence: 'Alta',
      causalFlags: ['Expansão Consumindo Liquidez', 'Deterioração Estrutural Progressiva'],
      advisoryNotes: ['Apesar de positivo, a formação do EBITDA cobra um pedágio insustentável de caixa.'],
      blockedFalsePositives: ['Operação Robusta'],
      riskPropagationSignals: ['Risco Severo de Continuidade']
    };
  }

  if (artificial) {
    return {
      score: 0.3,
      classification: 'EBITDA Artificial',
      confidence: 'Alta',
      causalFlags: ['Baixa Conversão em Caixa', 'Expansão sem Sustentabilidade'],
      advisoryNotes: ['A formação da margem é conjuntural ou dependente de cortes insustentáveis.'],
      blockedFalsePositives: ['Eficiência Estrutural'],
      riskPropagationSignals: ['Estresse Oculto']
    };
  }

  if (cashConversion.classification === 'Conversão Frágil' || elasticity.classification === 'Operação Rígida') {
    return {
      score: 0.5,
      classification: 'EBITDA Frágil',
      confidence: 'Média',
      causalFlags: ['Forte Sensibilidade a Retração', 'Margem Comprimida'],
      advisoryNotes: ['EBITDA gerado em um ambiente de alta fricção. Muito suscetível a variações de escala.'],
      blockedFalsePositives: ['Resiliência Operacional'],
      riskPropagationSignals: ['Propagação de Risco para Liquidez']
    };
  }

  return {
    score: 0.95,
    classification: 'EBITDA Saudável',
    confidence: 'Alta',
    causalFlags: ['Margem Consistente', 'Crescimento Sustentável', 'Baixa Pressão Estrutural'],
    advisoryNotes: ['Geração operacional de excelente qualidade e conversibilidade.'],
    blockedFalsePositives: ['Alerta de Risco Incorreto'],
    riskPropagationSignals: []
  };
}

export function analyzeOperationalIntelligence(input: OperationalInput): OperationalIntelligenceReport {
  const elasticity = assessOperationalElasticity(input);
  const cashConversion = assessCashConversion(input);
  
  const destructive = detectGrowthDestroyingCash(input);
  const revenueWithoutMargin = detectRevenueWithoutMargin(input);
  const artificial = detectArtificialEbitda(input);
  const hospital = detectHospitalOperationalPressure(input);
  const seasonality = detectSeasonalityBehavior(input);

  const ebitdaQuality = classifyEbitdaQuality(input, cashConversion, elasticity, artificial, destructive);

  return {
    ebitdaQuality,
    elasticity,
    cashConversion,
    growthDestroyingCash: destructive,
    revenueWithoutMargin,
    artificialEbitda: artificial,
    hospitalPressure: hospital,
    seasonality
  };
}
