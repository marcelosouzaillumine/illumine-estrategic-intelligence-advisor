// src/core/runtime/decision-intelligence/StrategicStressEngine.ts
//
// Institutional Strategic Stress Engine
// Ref: docs/implementation_plan.md

import { ExecutiveDecision } from './decision-types';

export class StrategicStressEngine {
  /**
   * Models the systemic fragility impact delta under a proposed decision.
   */
  public static evaluateStress(
    decision: ExecutiveDecision,
    report: any
  ): {
    systemicFragilityImpact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    stressScoreDelta: number;
    stressFactors: string[];
  } {
    let systemicFragilityImpact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    let stressScoreDelta = 0;
    const stressFactors: string[] = [];

    const { domains } = decision;

    // Retrieve context metrics
    const overallSeverity = report.severity?.level ?? 'ESTÁVEL';
    const isEbitdaNegative = (report.metrics?.ebitda ?? report.ebitda ?? 0) <= 0;
    const ocf = report.cashFlowReport?.operational?.fco ?? report.ocf ?? 0;

    // 1. Debt expansion or distributions under critical status
    if (domains.includes('Dividend Distribution') || domains.includes('Debt Expansion')) {
      if (overallSeverity === 'CRÍTICA' || overallSeverity === 'ALTA' || isEbitdaNegative) {
        systemicFragilityImpact = 'CRITICAL';
        stressScoreDelta = -30;
        stressFactors.push('Exposição crítica de passivos/capital em contexto corporativo deteriorado.');
      } else {
        systemicFragilityImpact = 'HIGH';
        stressScoreDelta = -15;
        stressFactors.push('Aumento na alavancagem estrutural ou redução programada de lucros retidos.');
      }
    }

    // 2. Operational expansion under negative cash flow
    if (domains.includes('Operational Expansion') || domains.includes('Workforce Expansion')) {
      if (ocf < 0) {
        systemicFragilityImpact = 'CRITICAL';
        stressScoreDelta = -25;
        stressFactors.push('Pressão de custos fixos adicionais sob fluxo de caixa operacional negativo.');
      } else if (overallSeverity === 'ALERTA') {
        systemicFragilityImpact = 'HIGH';
        stressScoreDelta = -10;
        stressFactors.push('Expansão de custos em estágio de instabilidade financeira.');
      }
    }

    // 3. CAPEX in cash sustainability crisis
    if (domains.includes('CAPEX') && ocf < 0) {
      systemicFragilityImpact = 'CRITICAL';
      stressScoreDelta = -20;
      stressFactors.push('Investimento estrutural (CAPEX) sem suporte operacional de tesouraria.');
    }

    if (stressFactors.length === 0) {
      systemicFragilityImpact = 'LOW';
      stressScoreDelta = 0;
      stressFactors.push('Decisão com impacto de fragilidade mapeado como sob controle.');
    }

    return {
      systemicFragilityImpact,
      stressScoreDelta,
      stressFactors
    };
  }
}
