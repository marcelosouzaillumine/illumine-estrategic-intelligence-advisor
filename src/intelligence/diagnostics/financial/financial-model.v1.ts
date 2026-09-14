import { DiagnosticDimension } from '../core/diagnostic-contracts';
import { DiagnosticDomain, MaturityLevel } from '../core/diagnostic-types';

export const FINANCIAL_DOMAIN: DiagnosticDomain = "financial";

export const FINANCIAL_DIMENSIONS: DiagnosticDimension[] = [
  {
    id: 'dim_liquidity',
    name: 'Liquidity Governance™',
    description: 'Avalia a previsibilidade de caixa, controle de liquidez e capacidade de antecipação.',
    weight: 1.0,
    indicators: []
  },
  {
    id: 'dim_profitability',
    name: 'Profitability Governance™',
    description: 'Avalia a geração de margem, rentabilidade por operação e criação de valor.',
    weight: 1.0,
    indicators: []
  },
  {
    id: 'dim_working_capital',
    name: 'Working Capital Governance™',
    description: 'Avalia o ciclo financeiro, necessidade de capital e eficiência de recursos.',
    weight: 1.0,
    indicators: []
  },
  {
    id: 'dim_governance',
    name: 'Financial Governance Governance™',
    description: 'Avalia a qualidade das informações, frequência de análise e processo decisório.',
    weight: 1.0,
    indicators: []
  },
  {
    id: 'dim_planning',
    name: 'Financial Planning Governance™',
    description: 'Avalia o orçamento, cenários, projeções e planejamento financeiro estratégico.',
    weight: 1.0,
    indicators: []
  }
];
