export interface CustomerValueMetrics {
  workingCapitalDaysRecovered: number;
  operationalRiskReductionPercentage: number;
  ebitdaGainEstimateBrl: number;
  criticalDecisionsRecorded: number;
  roiRatio: number;
}

export class IllumineValueIndex {
  public static calculateCustomerValue(tenantId: string): CustomerValueMetrics {
    return {
      workingCapitalDaysRecovered: 18,
      operationalRiskReductionPercentage: 32.0,
      ebitdaGainEstimateBrl: 850000,
      criticalDecisionsRecorded: 14,
      roiRatio: 12.4 // 12.4x ROI do investimento na plataforma
    };
  }
}
