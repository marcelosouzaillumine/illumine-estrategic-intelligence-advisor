export interface VerticalROIMetrics {
  industry: 'HEALTHCARE' | 'FAMILY_BUSINESS' | 'INDUSTRIAL' | 'SERVICES';
  ebitdaGainEstimateBrl: number;
  riskReductionPercentage: number;
  paybackMonths: number;
}

export class VerticalROIEngine {
  public static calculateVerticalROI(industry: VerticalROIMetrics['industry']): VerticalROIMetrics {
    const estimates = {
      HEALTHCARE: { ebitdaGainEstimateBrl: 1200000, riskReductionPercentage: 35.0, paybackMonths: 3.5 },
      FAMILY_BUSINESS: { ebitdaGainEstimateBrl: 950000, riskReductionPercentage: 42.0, paybackMonths: 4.0 },
      INDUSTRIAL: { ebitdaGainEstimateBrl: 1500000, riskReductionPercentage: 28.0, paybackMonths: 3.0 },
      SERVICES: { ebitdaGainEstimateBrl: 750000, riskReductionPercentage: 30.0, paybackMonths: 4.2 }
    };
    return { industry, ...estimates[industry] };
  }
}
