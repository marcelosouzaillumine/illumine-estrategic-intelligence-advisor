import { FinancialInsight } from './FinancialInsightRegistry';

export class ExecutiveQuestionGenerator {
  public generate(findings: FinancialInsight[]): string[] {
    const questions: string[] = [];

    const hasLiquidityRisk = findings.some(f => f.finding.includes('CASH_DEPENDENCY') || f.finding.includes('PROFIT_WITHOUT_CASH'));
    const hasMarginRisk = findings.some(f => f.finding.includes('VALUE_DESTRUCTION'));
    const hasWorkingCapitalRisk = findings.some(f => f.finding.includes('WORKING_CAPITAL_PRESSURE'));

    if (hasLiquidityRisk && hasMarginRisk) {
      questions.push("A estrutura atual de caixa e margem permite acelerar crescimento sem comprometer a continuidade operacional?");
    } else if (hasWorkingCapitalRisk) {
      questions.push("A expansão atual está sacrificando o capital de giro e exigindo aportes crescentes?");
    }

    if (findings.length === 0) {
      questions.push("A estabilidade atual do negócio suporta alavancagem para um novo ciclo de expansão?");
    }

    // Default fallback question if no specific intersection triggers
    if (questions.length === 0) {
      questions.push("Como os fatores atuais de risco impactam o planejamento estratégico para o próximo trimestre?");
    }

    return questions;
  }
}
