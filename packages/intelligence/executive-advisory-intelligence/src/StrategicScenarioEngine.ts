import { StrategicScenarioContract } from '@illumine/executive-contracts';

export class StrategicScenarioEngine {
  public static simulateScenario(
    companyId: string,
    currentEbitdaMarginPercent: number,
    targetEbitdaMarginPercent: number
  ): StrategicScenarioContract {
    const deltaPercent = parseFloat((targetEbitdaMarginPercent - currentEbitdaMarginPercent).toFixed(1));

    return {
      scenarioId: `scen-${companyId}-${Date.now()}`,
      title: 'Otimização de Estrutura de Custos e Margem Líquida',
      currentBaselineMetrics: { ebitdaMargin: currentEbitdaMarginPercent, debtRatio: 65 },
      projectedMetrics: { ebitdaMargin: targetEbitdaMarginPercent, debtRatio: 43 },
      projectedEbitdaDeltaPercent: deltaPercent,
      projectedRiskReductionPercent: 22.0
    };
  }
}
