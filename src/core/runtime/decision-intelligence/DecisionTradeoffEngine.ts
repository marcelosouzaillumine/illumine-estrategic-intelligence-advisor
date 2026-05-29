// src/core/runtime/decision-intelligence/DecisionTradeoffEngine.ts
//
// Institutional Decision Tradeoff Engine
// Ref: docs/implementation_plan.md

import { ExecutiveDecision, SurvivabilityScores } from './decision-types';

export interface DecisionTradeoff {
  dimension: string;
  sacrifice: string;
  benefit: string;
}

export class DecisionTradeoffEngine {
  /**
   * Computes the strategic tradeoff profile for an executive decision.
   */
  public static analyzeTradeoffs(
    decision: ExecutiveDecision,
    scores: SurvivabilityScores
  ): DecisionTradeoff[] {
    const tradeoffs: DecisionTradeoff[] = [];
    const { domains } = decision;

    if (domains.includes('Dividend Distribution')) {
      tradeoffs.push({
        dimension: 'Política de Capital vs Liquidez',
        sacrifice: 'Redução de liquidez imediata e enfraquecimento do patrimônio líquido acumulado.',
        benefit: 'Retorno de dividendos e atendimento às obrigações fiduciárias com acionistas.'
      });
    }

    if (domains.includes('CAPEX')) {
      tradeoffs.push({
        dimension: 'Investimento Estrutural vs Caixa de Curto Prazo',
        sacrifice: 'Imobilização imediata de caixa, aumentando a vulnerabilidade a choques operacionais.',
        benefit: 'Modernização de ativos fixos e expectativa de ganhos de escala no longo prazo.'
      });
    }

    if (domains.includes('Debt Expansion')) {
      tradeoffs.push({
        dimension: 'Alavancagem vs Custos Financeiros',
        sacrifice: 'Aumento de passivos exigíveis e do serviço da dívida (juros) no curto prazo.',
        benefit: 'Entrada rápida de recursos de terceiros sem diluição de participação dos sócios.'
      });
    }

    if (domains.includes('Cost Reduction')) {
      tradeoffs.push({
        dimension: 'Eficiência Operacional vs Capacidade Operacional',
        sacrifice: 'Risco de gargalos operacionais e perda de talentos críticos.',
        benefit: 'Proteção das margens operacionais (EBITDA) e interrupção rápida da queima de caixa.'
      });
    }

    if (domains.includes('Operational Expansion') || domains.includes('Workforce Expansion')) {
      tradeoffs.push({
        dimension: 'Expansão vs Rentabilidade Imediata',
        sacrifice: 'Aumento das despesas operacionais fixas e elevação temporária do ponto de equilíbrio.',
        benefit: 'Ampliação da capacidade de mercado e velocidade de escala no médio prazo.'
      });
    }

    if (tradeoffs.length === 0) {
      tradeoffs.push({
        dimension: 'Flexibilidade Estratégica vs Foco Fiduciário',
        sacrifice: 'Consumo de atenção do board e realocação de recursos.',
        benefit: 'Adequação da estrutura corporativa ao modelo de negócio.'
      });
    }

    return tradeoffs;
  }
}
