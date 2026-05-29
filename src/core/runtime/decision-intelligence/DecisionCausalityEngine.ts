// src/core/runtime/decision-intelligence/DecisionCausalityEngine.ts
//
// Institutional Decision Causality Engine
// Ref: docs/implementation_plan.md

import { ExecutiveDecision } from './decision-types';

export class DecisionCausalityEngine {
  /**
   * Performs decision propagation analysis, mapping expected effects, second-order risks, and domain propagation paths.
   */
  public static analyze(decision: ExecutiveDecision): {
    expectedEffects: string[];
    secondOrderRisks: string[];
    propagationPath: string[];
  } {
    const expectedEffects: string[] = [];
    const secondOrderRisks: string[] = [];
    const propagationPath: string[] = [];

    const { domains } = decision;

    if (domains.includes('Dividend Distribution')) {
      expectedEffects.push('Redução de lucros acumulados e caixa disponível.');
      secondOrderRisks.push('Redução da liquidez imediata e enfraquecimento da proteção patrimonial contra volatilidades operacionais.');
      propagationPath.push('Política de Capital → Liquidez → Preservação Patrimonial');
    }

    if (domains.includes('Operational Expansion') || domains.includes('Workforce Expansion')) {
      expectedEffects.push('Elevação imediata das despesas operacionais fixas (OPEX).');
      secondOrderRisks.push('Aumento do ponto de equilíbrio (breakeven) e compressão de OCF se as receitas projetadas atrasarem.');
      propagationPath.push('Eficiência Operacional → Caixa Operacional → Liquidez');
    }

    if (domains.includes('CAPEX')) {
      expectedEffects.push('Saída de recursos líquidos para imobilização de ativos estruturais.');
      secondOrderRisks.push('Redução na flexibilidade financeira e possível estrangulamento de capital de giro.');
      propagationPath.push('CAPEX → Liquidez de Curto Prazo → Solvência');
    }

    if (domains.includes('Debt Expansion')) {
      expectedEffects.push('Aumento de captação de recursos de terceiros no passivo financeiro.');
      secondOrderRisks.push('Elevação do serviço da dívida (juros) e maior pressão sobre lucros futuros.');
      propagationPath.push('Financiamento → Endividamento → Preservação Patrimonial');
    }

    if (domains.includes('Cost Reduction')) {
      expectedEffects.push('Otimização de custos e despesas operacionais.');
      secondOrderRisks.push('Risco de estrangulamento operacional e perda de produtividade se cortes forem excessivos.');
      propagationPath.push('Eficiência Operacional → Margem Ebitda → Liquidez');
    }

    // Default propagation check if domains don't match standard rules
    if (expectedEffects.length === 0) {
      expectedEffects.push('Alteração na alocação de recursos institucionais.');
      secondOrderRisks.push('Mudança nas prioridades fiduciárias operacionais.');
      propagationPath.push('Gestão Geral → Alocação de Recursos → Solidez');
    }

    return {
      expectedEffects,
      secondOrderRisks,
      propagationPath
    };
  }
}
