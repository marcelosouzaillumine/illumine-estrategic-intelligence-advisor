
import { formatCurrency } from './utils';

// Constants for the Tax Reform (based on current 2024 legislation/projections)
export const TAX_REFORM_CONSTANTS = {
  TRANSITION_START_YEAR: 2026,
  CBS_FULL_IMPLEMENTATION_YEAR: 2027,
  IBS_TRANSITION_START_YEAR: 2029,
  FULL_IMPLEMENTATION_YEAR: 2033,
  
  ESTIMATED_CBS_RATE: 0.088,
  ESTIMATED_IBS_RATE: 0.177,
  ESTIMATED_IVA_DUAL: 0.265,
  
  // Transition rates for 2026 test phase
  TEST_CBS_RATE: 0.009,
  TEST_IBS_RATE: 0.001,
};

export interface ProductInfo {
  id: string;
  descricao: string;
  ncm: string;
  valorMensal: number;
  tipo: 'Produto' | 'Serviço';
  aliquotaIPI?: number;
  aliquotaICMS?: number;
  aliquotaISS?: number;
}

export interface NCMInsight {
  ncmOriginal: string;
  descricao: string;
  ncmSugerida: string;
  motivo: string;
  potencialEconomia: string;
}

export interface TaxReformDiagnosis {
  regimeTributario: 'Simples' | 'Lucro Presumido' | 'Lucro Real';
  faturamentoMensal: number;
  faturamentoAnual: number;
  margemLiquida: number;
  margemEBITDA: number;
  folhaPercentual: number;
  percentualServicos: number;
  percentualProdutos: number;
  percentualIndustria: number;
  percentualComercio: number;
  percentualExportacao: number;
  percentualInterestadual: number;
  creditosAtuais: number;
  beneficiosFiscais: boolean;
  aliquotaEfetivaAtual: number;
  cargaTributariaEfetiva: number;
  dependenciaCreditoFiscal: 'Alta' | 'Média' | 'Baixa';
  setorEconomico: string;
  produtos?: ProductInfo[];
}

export interface TaxReformScenario {
  year: number;
  name: string;
  cbsRate: number;
  ibsRate: number;
  pisCofinsReduction: number; // 0 to 1
  icmsIssReduction: number; // 0 to 1
  isRate: number;
}

export interface TaxImpactMetrics {
  currentTaxTotal: number;
  futureTaxTotal: number;
  delta: number;
  deltaPercentage: number;
  impactOnEBITDA: number;
  impactOnCashFlow: number;
  impactOnPricing: number;
  creditGain: number;
  splitPaymentImpact: number;
}

export const getNCMInsights = (products: ProductInfo[]): NCMInsight[] => {
  const insights: NCMInsight[] = [];
  
  products.forEach(p => {
    // Simple heuristic-based insights for demonstration
    if (p.ncm.startsWith('8517')) { // Smartphones/Equipamentos
      insights.push({
        ncmOriginal: p.ncm,
        descricao: p.descricao,
        ncmSugerida: '8517.62.77',
        motivo: 'Enquadramento em ex-tarifário para componentes de rede.',
        potencialEconomia: 'Redução de 2% no IPI'
      });
    } else if (p.ncm.startsWith('3004')) { // Medicamentos
      insights.push({
        ncmOriginal: p.ncm,
        descricao: p.descricao,
        ncmSugerida: '3004.90.99',
        motivo: 'Verificar alíquota zero para itens da cesta básica de saúde.',
        potencialEconomia: 'Isenção de CBS'
      });
    } else if (p.tipo === 'Produto' && p.ncm === '') {
      insights.push({
        ncmOriginal: 'N/A',
        descricao: p.descricao,
        ncmSugerida: 'Consultar',
        motivo: 'Produto sem NCM cadastrada. Risco de autuação e erro no cálculo do IBS.',
        potencialEconomia: 'Mitigação de Risco'
      });
    }
  });

  return insights;
};

/**
 * ENGINE: Rules & Calculation
 */
export const calculateTaxImpact = (diagnosis: TaxReformDiagnosis, scenario: TaxReformScenario): TaxImpactMetrics => {
  // Current Taxes (Simplified for the model)
  const currentPisCofins = diagnosis.faturamentoMensal * (diagnosis.regimeTributario === 'Lucro Real' ? 0.0925 : 0.0365);
  const currentIcmsIss = diagnosis.faturamentoMensal * (diagnosis.percentualServicos > 0.5 ? 0.05 : 0.18);
  const currentTotal = currentPisCofins + currentIcmsIss;

  // New Taxes
  let futureBase = diagnosis.faturamentoMensal;
  let scenarioIS = scenario.isRate;

  // Precision logic for products
  if (diagnosis.produtos && diagnosis.produtos.length > 0) {
    const isProducts = diagnosis.produtos.filter(p => p.ncm.startsWith('22') || p.ncm.startsWith('24'));
    if (isProducts.length > 0) {
      scenarioIS = 0.10; // High IS for specific NCMs
    }
  }

  const cbsValue = futureBase * scenario.cbsRate;
  const ibsValue = futureBase * scenario.ibsRate;
  const isValue = futureBase * scenarioIS;
  
  // Credits (Non-cumulativity)
  const safeEbitdaMargin = isNaN(Number(diagnosis.margemEBITDA)) ? 0.2 : Number(diagnosis.margemEBITDA);
  const operatingCosts = diagnosis.faturamentoMensal * (1 - safeEbitdaMargin);
  const creditBasis = operatingCosts * 0.7; // Estimated credit-eligible costs
  const newCredits = creditBasis * (scenario.cbsRate + scenario.ibsRate);
  
  const futureTotal = (cbsValue + ibsValue + isValue) - newCredits;
  
  // Residual current taxes during transition
  const residualPisCofins = currentPisCofins * (1 - scenario.pisCofinsReduction);
  const residualIcmsIss = currentIcmsIss * (1 - scenario.icmsIssReduction);
  
  const totalInScenario = futureTotal + residualPisCofins + residualIcmsIss;
  const delta = totalInScenario - currentTotal;
  
  return {
    currentTaxTotal: currentTotal,
    futureTaxTotal: totalInScenario,
    delta,
    deltaPercentage: (delta / diagnosis.faturamentoMensal) * 100,
    impactOnEBITDA: -delta,
    impactOnCashFlow: -delta * 1.1, // Split payment impact + cash lock
    impactOnPricing: (delta / diagnosis.faturamentoMensal) * 100,
    creditGain: Math.max(0, newCredits - diagnosis.creditosAtuais),
    splitPaymentImpact: diagnosis.faturamentoMensal * 0.02, // Estimated 2% cash flow impact due to split payment
  };
};

/**
 * ENGINE: Transition Timeline
 */
export const getTransitionScenarios = (): TaxReformScenario[] => [
  { year: 2024, name: 'Cenário Atual', cbsRate: 0, ibsRate: 0, pisCofinsReduction: 0, icmsIssReduction: 0, isRate: 0 },
  { year: 2026, name: 'Início (Teste)', cbsRate: 0.009, ibsRate: 0.001, pisCofinsReduction: 0, icmsIssReduction: 0, isRate: 0 },
  { year: 2027, name: 'Vigência CBS', cbsRate: 0.088, ibsRate: 0.001, pisCofinsReduction: 1, icmsIssReduction: 0, isRate: 0.01 },
  { year: 2029, name: 'Início IBS', cbsRate: 0.088, ibsRate: 0.02, pisCofinsReduction: 1, icmsIssReduction: 0.1, isRate: 0.01 },
  { year: 2033, name: 'Reforma Plena', cbsRate: 0.088, ibsRate: 0.177, pisCofinsReduction: 1, icmsIssReduction: 1, isRate: 0.01 },
];

/**
 * ENGINE: Strategic Interpretation
 */
export const getStrategicRecommendations = (diagnosis: TaxReformDiagnosis, metrics: TaxImpactMetrics) => {
  const recommendations = [];
  
  if (metrics.deltaPercentage > 2) {
    recommendations.push({
      title: 'Revisão de Precificação Necessária',
      desc: `O impacto de ${metrics.deltaPercentage.toFixed(2)}% na carga tributária exige uma revisão imediata do pricing para preservar o EBITDA.`,
      urgency: 'Alta'
    });
  }
  
  if (diagnosis.percentualServicos > 0.6) {
    recommendations.push({
      title: 'Atenção ao Setor de Serviços',
      desc: 'O fim da cumulatividade pode aumentar significativamente a carga. Avalie a contratação de fornecedores que gerem créditos plenos.',
      urgency: 'Crítica'
    });
  }
  
  if (diagnosis.regimeTributario === 'Lucro Presumido') {
    recommendations.push({
      title: 'Estudo de Migração para Lucro Real',
      desc: 'Com a não cumulatividade ampla do IBS/CBS, o Lucro Real pode se tornar mais vantajoso devido ao aproveitamento de créditos.',
      urgency: 'Média'
    });
  }
  
  return recommendations;
};

/**
 * ENGINE: Scores
 */
export const calculateReformScores = (diagnosis: TaxReformDiagnosis, metrics: TaxImpactMetrics) => {
  const impactScore = Math.min(100, Math.max(0, (metrics.deltaPercentage + 5) * 10));
  const vulnerabilityScore = diagnosis.percentualServicos * 100;
  const maturityScore = diagnosis.beneficiosFiscais ? 40 : 75; // If depends on incentives that might end, lower maturity
  
  return {
    impact: impactScore,
    vulnerability: vulnerabilityScore,
    maturity: maturityScore
  };
};
