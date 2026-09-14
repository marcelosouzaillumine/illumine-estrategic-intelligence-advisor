
/**
 * Financial Intelligence Engine
 * Specialized in pattern detection and scoring for strategic advisory.
 */

export interface HealthScoreDimensions {
  liquidity: number;       // 20%
  profitability: number;   // 25%
  capitalStructure: number; // 20%
  efficiency: number;      // 20%
  valueCreation: number;   // 15%
}

export interface FinancialPattern {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'warning' | 'positive';
  impact: string;
  recommendation: string;
}

export const calculateIllumineScore = (dimensions: HealthScoreDimensions): number => {
  const safeNum = (val: number | undefined | null) => isNaN(Number(val)) ? 0 : Number(val);
  const score = (
    (safeNum(dimensions.liquidity) * 0.20) +
    (safeNum(dimensions.profitability) * 0.25) +
    (safeNum(dimensions.capitalStructure) * 0.20) +
    (safeNum(dimensions.efficiency) * 0.20) +
    (safeNum(dimensions.valueCreation) * 0.15)
  );
  return Math.min(100, Math.max(0, score));
};

/**
 * Detects strategic patterns crossing DRE, BP, and Cash Flow
 */
export const detectPatterns = (data: {
  receita: number,
  ebitda: number,
  lucro: number,
  fluxoOperacional: number,
  ncg: number,
  prazoMedioRecebimento: number,
  prazoMedioPagamento: number,
  caixa: number,
  endividamentoTotal: number
}): FinancialPattern[] => {
  const patterns: FinancialPattern[] = [];

  // 1. Efeito Tesoura (Scissors Effect)
  // Scenarios: Profit exists, but NCG grows faster than capacity, draining cash
  if (data.lucro > 0 && data.ncg > data.caixa && data.fluxoOperacional < 0) {
    patterns.push({
      id: 'scissor_effect',
      name: 'Efeito Tesoura Detectado',
      severity: 'critical',
      description: 'A empresa apresenta lucro contábil, mas o crescimento da Necessidade de Capital de Giro (NCG) está drenando o caixa operacional.',
      impact: 'Risco de insolvência técnica mesmo com operações lucrativas.',
      recommendation: 'Revisar política de prazos (PMR vs PMP) e considerar aporte de capital ou linhas de longo prazo para recompor capital de giro.'
    });
  }

  // 2. Overtrading
  if (data.receita > 0 && data.prazoMedioRecebimento > 90 && data.ncg > (data.receita * 0.4)) {
    patterns.push({
      id: 'overtrading',
      name: 'Risco de Overtrading',
      severity: 'warning',
      description: 'O volume de vendas está crescendo em um ritmo que a estrutura de capital atual não suporta financiar.',
      impact: 'Pressão extrema sobre o fluxo de caixa e dependência de antecipações caras.',
      recommendation: 'Desacelerar o crescimento das vendas a prazo ou aumentar o capital próprio para sustentar o giro.'
    });
  }

  // 3. Lucro Sem Caixa
  if (data.lucro > 0 && data.fluxoOperacional < (data.lucro * 0.3)) {
    patterns.push({
      id: 'profit_no_cash',
      name: 'Lucro de Baixa Qualidade',
      severity: 'warning',
      description: 'O lucro líquido não está se convertendo em caixa. Menos de 30% do lucro é transformado em disponibilidade imediata.',
      impact: 'Dificuldade em distribuir dividendos e investir com recursos próprios.',
      recommendation: 'Analisar itens não-caixa na DRE e variações no circulante ativo.'
    });
  }

  // 4. Estrutura Abusiva
  if (data.ebitda > 0 && data.endividamentoTotal > (data.ebitda * 4)) {
    patterns.push({
      id: 'high_leverage',
      name: 'Alavancagem Crítica',
      severity: 'critical',
      description: 'A relação Dívida Total / EBITDA está acima de 4.0x, indicando que a geração operacional mal cobre o serviço da dívida.',
      impact: 'Restrição de crédito bancário e risco de covenants.',
      recommendation: 'Priorizar o reperfilamento da dívida para prazos mais longos e redução de spreads.'
    });
  }

  return patterns;
};
