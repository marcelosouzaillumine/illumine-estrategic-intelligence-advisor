import { ContradictionDetection, ContradictionType } from './contracts/CalibrationContracts';
import { ValidationInput } from './FinancialDiagnosticValidator';

export class FinancialContradictionDetector {
  
  public detect(input: ValidationInput): ContradictionDetection[] {
    const contradictions: ContradictionDetection[] = [];
    const diagnosisUpper = input.diagnosis.toUpperCase();

    // 1. FALSE_LIQUIDITY_ALARM: Alta liquidez + Narrativa de crise
    if (input.liquidityImmediate !== undefined && input.liquidityImmediate > 1.5) {
      if (diagnosisUpper.includes("CRISE") || diagnosisUpper.includes("STRESS") || diagnosisUpper.includes("RISK")) {
        contradictions.push({
          type: "FALSE_LIQUIDITY_ALARM",
          description: "Excesso de liquidez ou baixa eficiência de capital, não uma crise estrutural de liquidez.",
          involvedMetrics: [`liquidityImmediate: ${input.liquidityImmediate}`, `diagnosis: ${input.diagnosis}`],
          severity: "CRITICAL"
        });
      }
    }

    // 2. UNHEALTHY_GROWTH: Receita crescendo + Margem EBITDA caindo + Caixa operacional negativo
    if (
      input.revenueGrowth !== undefined && input.revenueGrowth > 0.1 &&
      input.ebitdaMarginGrowth !== undefined && input.ebitdaMarginGrowth < 0 &&
      input.operatingCashFlow !== undefined && input.operatingCashFlow < 0
    ) {
      contradictions.push({
        type: "UNHEALTHY_GROWTH",
        description: "Crescimento sem qualidade econômica (queima de caixa por crescimento).",
        involvedMetrics: [
          `revenueGrowth: ${input.revenueGrowth}`,
          `ebitdaMarginGrowth: ${input.ebitdaMarginGrowth}`,
          `operatingCashFlow: ${input.operatingCashFlow}`
        ],
        severity: "CRITICAL"
      });
    }

    // 3. CAPITAL_UNDERUTILIZATION: PL elevado + ROE baixo
    if (input.equityRatio !== undefined && input.equityRatio > 0.6 && input.roe !== undefined && input.roe < 0.05) {
      contradictions.push({
        type: "CAPITAL_UNDERUTILIZATION",
        description: "Capital próprio não convertido em retorno adequado.",
        involvedMetrics: [`equityRatio: ${input.equityRatio}`, `roe: ${input.roe}`],
        severity: "HIGH"
      });
    }

    // 4. ACCOUNTING_PROFIT_QUALITY_RISK: Lucro líquido positivo + Fluxo operacional negativo + Contas a receber crescendo
    if (
      input.netIncome !== undefined && input.netIncome > 0 &&
      input.operatingCashFlow !== undefined && input.operatingCashFlow < 0 &&
      input.receivablesGrowth !== undefined && input.receivablesGrowth > 0.1
    ) {
      contradictions.push({
        type: "ACCOUNTING_PROFIT_QUALITY_RISK",
        description: "Lucro contábil sem geração de valor econômico real de caixa.",
        involvedMetrics: [
          `netIncome: ${input.netIncome}`,
          `operatingCashFlow: ${input.operatingCashFlow}`,
          `receivablesGrowth: ${input.receivablesGrowth}`
        ],
        severity: "CRITICAL"
      });
    }

    // 5. IDLE_CAPITAL_RISK: Caixa elevado + Baixo crescimento + Baixo ROIC
    if (
      input.cashBalance !== undefined && input.cashBalance > 1000000 && // Simulando threshold alto
      input.revenueGrowth !== undefined && input.revenueGrowth < 0.05 &&
      input.roic !== undefined && input.roic < 0.08
    ) {
      contradictions.push({
        type: "IDLE_CAPITAL_RISK",
        description: "Alto volume de caixa ocioso sem plano de alocação estratégica de retorno.",
        involvedMetrics: [
          `cashBalance: ${input.cashBalance}`,
          `revenueGrowth: ${input.revenueGrowth}`,
          `roic: ${input.roic}`
        ],
        severity: "MEDIUM"
      });
    }

    return contradictions;
  }
}
