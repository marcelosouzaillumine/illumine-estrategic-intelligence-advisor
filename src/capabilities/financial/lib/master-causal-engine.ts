type FinancialMetrics = any;
import { BusinessIdentity } from './business-identity-engine';
import { BPSummary } from './bpEngine';
import { evaluateInventoryQuality } from '../../../core/intelligence/inventory-quality-engine';
import { evaluateMaturityContext } from '../../../core/intelligence/industry-maturity-context-engine';
import { modulateSeverity } from '../../../core/intelligence/severity-modulation-engine';
import { calculateInferenceConfidence } from '../../../core/intelligence/inference-confidence-engine';
import { evaluateTemporalCausality, HistoricalPeriodData, TemporalCausalityOutput } from '../../../core/intelligence/temporal-causality-engine';

export interface CausalScenario {
  id: string;
  name: string;
  isActive: boolean;
  severity: 'Crítica' | 'Alta' | 'Média' | 'Baixa';
  description: string;
  modulationLog?: {
    originalSeverity: 'Crítica' | 'Alta' | 'Média' | 'Baixa';
    contextualSeverity: 'Crítica' | 'Alta' | 'Média' | 'Baixa';
    mathematicalEvidence: string[];
    contextualEvidence: string[];
    confidenceLevel: string;
    residualRisk: string;
    modulationAllowed: boolean;
    reasonForModulation: string;
    reasonForBlocking?: string;
  };
}

export interface MasterCausalOutput {
  scenarios: CausalScenario[];
  blockedNarratives: string[]; // Lista de termos/classificações que não podem ser usados (e.g., "baixa sensibilidade", "resiliência alta")
  behavioralInsights: {
    liquidezQualitativa: string;
    dinamicaDeCaixa: string;
    sustentabilidadeOperacional: string;
  };
  explicabilityBlock?: {
    realidadeMatematica: string;
    contextoOperacional: string;
    impactoSistemico: string;
    riscoResidual: string;
    tendenciaEstrutural: string;
    confiancaInferencia: string;
  };
  temporalIntelligence?: TemporalCausalityOutput;
}

export function getLiquidityIndicators(
  metrics: FinancialMetrics,
  causality: MasterCausalOutput | undefined
): { name: string; val: number; desc: string; status: 'Verde' | 'Amarelo' | 'Vermelho' }[] {
  const { liqCorrente = 0, liqSeca = 0, liqImediata = 0, liqGeral = 0, liquidezReal = 0 } = metrics;
  
  const getStatus = (baseStatus: 'Verde' | 'Amarelo' | 'Vermelho') => {
    if (!causality || !causality.scenarios) return baseStatus;
    const hasCritical = causality.scenarios.some(s => s.severity === 'Crítica');
    const hasHigh = causality.scenarios.some(s => s.severity === 'Alta');
    
    if (hasCritical && baseStatus === 'Verde') return 'Vermelho';
    if (hasHigh && baseStatus === 'Verde') return 'Amarelo';
    return baseStatus;
  };

  return [
    { name: 'Liquidez Corrente',  val: liqCorrente,  desc: 'Capacidade de pagamento no curto prazo',              status: getStatus(liqCorrente >= 1.2 ? 'Verde' : liqCorrente >= 0.8 ? 'Amarelo' : 'Vermelho') },
    { name: 'Liquidez Seca',      val: liqSeca,      desc: 'Capacidade de pagamento sem depender do estoque',     status: getStatus(liqSeca >= 1.0 ? 'Verde' : liqSeca >= 0.8 ? 'Amarelo' : 'Vermelho') },
    { name: 'Liquidez Imediata',  val: liqImediata,  desc: 'Disponibilidade imediata para quitar obrigações',     status: getStatus(liqImediata >= 0.5 ? 'Verde' : liqImediata >= 0.1 ? 'Amarelo' : 'Vermelho') },
    { name: 'Liquidez Geral',     val: liqGeral,     desc: 'Solvência de curto e longo prazo',                    status: getStatus(liqGeral >= 1.2 ? 'Verde' : liqGeral >= 1.0 ? 'Amarelo' : 'Vermelho') },
    { name: 'Liquidez Real',      val: liquidezReal, desc: 'Liquidez purgada de ativos de difícil realização',    status: getStatus(liquidezReal >= 1.0 ? 'Verde' : liquidezReal >= 0.5 ? 'Amarelo' : 'Vermelho') }
  ];
}

export function evaluateMasterCausality(
  bpSummary: BPSummary,
  metrics: FinancialMetrics,
  identity: BusinessIdentity,
  dreDataLength: number = 3,
  salesGrowthRate: number = 0,
  historicalData: HistoricalPeriodData[] = []
): MasterCausalOutput {
  if (!metrics || !metrics.hasData) {
    return {
      scenarios: [],
      blockedNarratives: ['Estabilidade Elevada', 'Resiliência Alta', 'Baixa Sensibilidade', 'Monitoramento Passivo'],
      behavioralInsights: {
        liquidezQualitativa: 'Dados insuficientes para análise.',
        dinamicaDeCaixa: 'Dados insuficientes para análise.',
        sustentabilidadeOperacional: 'Dados insuficientes para análise.'
      }
    };
  }

  const {
    liqCorrente, liquidezReal, saldoTesouraria, cgl, ncg,
    ebitda, indiceDescapitalizacao,
    concentracaoEstoque, liqImediata, dependenciaBancaria,
    margemErroOperacional, autonomiaFinanceira
  } = metrics;

  const { passivoCirculante: pc, patrimonioLiquido: plValue, ativoCirculante: ac, clientes, estoques } = bpSummary;

  const scenarios: CausalScenario[] = [];
  const blockedNarratives = new Set<string>();

  // Helper function for gradual soft thresholds
  const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
  const inverseLerp = (val: number, min: number, max: number) => clamp((val - min) / (max - min), 0, 1);
  const lerp = (a: number, b: number, t: number) => a + (b - a) * clamp(t, 0, 1);

  // 1. OPERAÇÃO DEPENDENTE DE GIRO
  // Em vez de só "concentracaoEstoque > 0.4", usamos o peso do "Capital Retido" (Estoque + Recebíveis).
  const capitalRetido = ac > 0 ? (clientes + estoques) / ac : 0;
  const capitalRetidoWeight = inverseLerp(capitalRetido, 0.4, 0.8); // 0 at 40%, 1 at 80%

  // Falta de liquidez imediata (menos de 20% do caixa em relação ao PC já liga o alerta progressivo)
  const caixaAsfixiaWeight = 1.0 - inverseLerp(liqImediata, 0.05, 0.25); // 1 at 5%, 0 at 25%

  // O risco existe se a operação exige giro E o caixa não reflete o lucro (dominância estrutural)
  const dependenteGiroScore = capitalRetidoWeight * 0.6 + caixaAsfixiaWeight * 0.4;
  
  if (dependenteGiroScore > 0.5) {
    scenarios.push({
      id: 'OP_DEPENDENTE_GIRO',
      name: 'OPERAÇÃO DEPENDENTE DE GIRO',
      isActive: true,
      severity: dependenteGiroScore > 0.8 ? 'Crítica' : 'Alta',
      description: `Capital de giro amplamente retido na operação (${Math.round(capitalRetido * 100)}% do Ativo Circulante). A conversão de caixa é lenta e gera asfixia tática constante, indicando que eventuais superávits não se traduzem em liquidez real.`
    });
    blockedNarratives.add('Baixa Sensibilidade');
    blockedNarratives.add('Estrutura Protegida');
    blockedNarratives.add('Monitoramento Passivo');
  }

  // 2. PRESSÃO ESTRUTURAL
  // Substituímos os "&&" absolutos por propensão. 
  // Risco = Falta de Tesouraria + Falta de Folga + Dependência de Dívida / Liquidez Fraca
  const tesourariaNegativaWeight = saldoTesouraria < 0 ? 1.0 : (saldoTesouraria === 0 ? 0.5 : inverseLerp(saldoTesouraria / (pc || 1), 0.2, 0.0)); // 1 when < 0, scales down to 0 at 20% PC
  const faltaDeFolgaWeight = 1.0 - inverseLerp(margemErroOperacional, 0.0, 0.2); // 1 at 0% error margin, 0 at 20%
  const endividamentoCurtoProntoWeight = inverseLerp(dependenciaBancaria, 0.1, 0.5); // 0 at 10%, 1 at 50%
  const liquidezAsfixiaWeight = 1.0 - inverseLerp(liqCorrente, 0.8, 1.5); // 1 at 0.8, 0 at 1.5

  const pressaoEstruturalScore = (tesourariaNegativaWeight * 0.4) + (faltaDeFolgaWeight * 0.3) + (Math.max(endividamentoCurtoProntoWeight, liquidezAsfixiaWeight) * 0.3);

  if (pressaoEstruturalScore > 0.6) {
    scenarios.push({
      id: 'PRESSAO_ESTRUTURAL',
      name: 'PRESSÃO ESTRUTURAL',
      isActive: true,
      severity: pressaoEstruturalScore > 0.85 ? 'Crítica' : 'Alta',
      description: 'Caixa insuficiente e estrutura operacional com margem de erro extremamente reduzida. Exigibilidade imediata pressiona brutalmente o balanço e impõe risco contínuo de refinanciamento ou colapso.'
    });
    blockedNarratives.add('Baixa Sensibilidade');
    blockedNarratives.add('Estrutura Protegida');
    blockedNarratives.add('Estabilidade Elevada');
    blockedNarratives.add('Resiliência Alta');
  }

  // 3. CORROSÃO PATRIMONIAL
  // Avaliação baseada no estrago (descapitalização acumulada) sobrepujando "aportes" artificiais.
  const corroendo = plValue <= 0 ? 1.0 : inverseLerp(Math.abs(indiceDescapitalizacao), 0.2, 0.6); // 1 at >60% descapitalização
  const baixaAutonomiaWeight = 1.0 - inverseLerp(autonomiaFinanceira, 0.1, 0.4); // 1 at <10%, 0 at >40%

  // Dominância Causal: Se o PL está corroendo agressivamente (>0.8), pouco importa a autonomia; o risco impera.
  const corrosaoScore = corroendo > 0.8 ? corroendo : (corroendo * 0.6 + baixaAutonomiaWeight * 0.4);

  if (corrosaoScore > 0.6) {
    scenarios.push({
      id: 'CORROSAO_PATRIMONIAL',
      name: 'CORROSÃO PATRIMONIAL',
      isActive: true,
      severity: corrosaoScore > 0.8 ? 'Crítica' : 'Alta',
      description: 'Consumo crônico do patrimônio por prejuízos ou alavancagem corrosiva. Mesmo eventuais aportes de capital têm sua capacidade de geração de valor diluída pelo ralo estrutural, limitando o crescimento sustentável.'
    });
    blockedNarratives.add('Estabilidade Elevada');
    blockedNarratives.add('Estrutura Protegida');
    blockedNarratives.add('Resiliência Alta');
  }

  // 4. RESILIÊNCIA LIMITADA
  // Estrutura atual aguenta, mas capacidade de expansão é pífia.
  // Propagação causal: Risco de Resiliência já nasce com base nos riscos anteriores (se houver, a resiliência não é apena limitada, já é rompida).
  const maxRiscoAcumulado = Math.max(dependenteGiroScore, pressaoEstruturalScore, corrosaoScore);
  
  if (maxRiscoAcumulado <= 0.6) {
    const folgaEstrutural = inverseLerp(margemErroOperacional, 0.1, 0.4); // 0 at 10%, 1 at 40%
    const cglConforto = inverseLerp(cgl / (ncg || 1), 0.8, 1.2); // 0 at 0.8, 1 at 1.2
    const resilienciaScore = 1.0 - (folgaEstrutural * 0.5 + cglConforto * 0.5);

    if (resilienciaScore > 0.4) {
      scenarios.push({
        id: 'RESILIENCIA_LIMITADA',
        name: 'RESILIÊNCIA LIMITADA',
        isActive: true,
        severity: resilienciaScore > 0.7 ? 'Alta' : 'Média',
        description: 'Balanço equacionado estritamente para o volume atual. Ausência de buffers adequados para absorver choques de inadimplência, expansão abrupta ou quebras na cadeia de suprimentos.'
      });
      blockedNarratives.add('Resiliência Alta');
      blockedNarratives.add('Estabilidade Elevada');
    }
  }

  // Inferência Causal de Comportamento e Dinâmica
  let liquidezQualitativa = '';
  if (pressaoEstruturalScore > 0.7) {
    liquidezQualitativa = 'Liquidez artificial dependente de terceiros. A capacidade de honrar compromissos está asfixiada e engessada no curto prazo.';
  } else if (dependenteGiroScore > 0.6) {
    liquidezQualitativa = 'Ilusão de liquidez. O caixa livre é escasso devido à altíssima retenção na operação (contas a receber longo ou estoque obsoleto/pesado).';
  } else if (liquidezReal > 1 && saldoTesouraria > 0 && pressaoEstruturalScore < 0.3) {
    liquidezQualitativa = 'Liquidez orgânica robusta, sustentada por ativos altamente conversíveis em caixa na mesma magnitude das obrigações.';
  } else {
    liquidezQualitativa = 'Liquidez operacionalmente ajustada. Exige sintonia estrita de prazos entre pagamentos e recebimentos para evitar rompimentos esporádicos.';
  }

  let dinamicaDeCaixa = '';
  if (ebitda < 0) {
    dinamicaDeCaixa = 'Consumo crônico de caixa via operação deficitaria (EBITDA destrutivo), obrigando constantes injeções externas de recursos.';
  } else if (saldoTesouraria < 0 || dependenteGiroScore > 0.6) {
    dinamicaDeCaixa = 'O esforço operacional (EBITDA positivo) não vinga em caixa livre, sendo inteiramente engolido pelo capital de giro ou pelo brutal serviço da dívida.';
  } else {
    dinamicaDeCaixa = 'Geração de caixa eficiente que retroalimenta o capital de giro sustentando excedentes orgânicos na tesouraria.';
  }

  let sustentabilidadeOperacional = '';
  if (corrosaoScore > 0.6 || pressaoEstruturalScore > 0.8) {
    sustentabilidadeOperacional = 'Vulnerabilidade Severa. O modelo estrutural atua como dreno contínuo de valor, gerando altíssimo risco de descontinuidade no médio prazo.';
  } else if (maxRiscoAcumulado > 0.5) {
    sustentabilidadeOperacional = 'Sustentabilidade Condicional. O negócio sobrevive sob métricas extremamente alinhadas e dependentes do cenário favorável; friável a perturbações táticas.';
  } else {
    sustentabilidadeOperacional = 'Alta capacidade estrutural de acomodar variações operacionais. A base de capital protege a elasticidade necessária para o crescimento.';
  }

  // --- CONTEXTUAL INTELLIGENCE OVERLAY ---
  const inventoryQuality = evaluateInventoryQuality(bpSummary, metrics, identity.setor, salesGrowthRate);
  const maturityContext = evaluateMaturityContext(bpSummary, metrics, identity.setor, dreDataLength, inventoryQuality);
  const confidence = calculateInferenceConfidence(dreDataLength, dreDataLength, Math.abs(indiceDescapitalizacao));

  const modulated = modulateSeverity(scenarios, maturityContext, inventoryQuality, confidence, bpSummary, metrics);

  // --- TEMPORAL CAUSALITY LAYER ---
  const temporalIntelligence = evaluateTemporalCausality(historicalData);

  // Fallback Rule for Turnaround
  if (temporalIntelligence.isTurnaroundEmerging && temporalIntelligence.trendConfidence.level === 'HIGH_CONFIDENCE') {
    modulated.scenarios = modulated.scenarios.map(s => {
      if (s.id === 'CORROSAO_PATRIMONIAL' && s.severity === 'Crítica') s.severity = 'Alta';
      return s;
    });
  }

  // Fallback Rule for Destructive Growth
  if (temporalIntelligence.isDestructiveGrowth) {
    // If it was artificially lowered by context, push it back to Critical
    modulated.scenarios = modulated.scenarios.map(s => {
      if (s.id === 'OP_DEPENDENTE_GIRO' || s.id === 'PRESSAO_ESTRUTURAL') s.severity = 'Crítica';
      return s;
    });
  }

  return {
    scenarios: modulated.scenarios,
    blockedNarratives: Array.from(blockedNarratives),
    behavioralInsights: {
      liquidezQualitativa,
      dinamicaDeCaixa,
      sustentabilidadeOperacional
    },
    explicabilityBlock: modulated.explicabilityBlock,
    temporalIntelligence
  };
}
