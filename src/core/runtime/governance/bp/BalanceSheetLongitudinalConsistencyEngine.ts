export interface LongitudinalMaterialityThresholds {
  monetaryVariation: number;
  ratioVariation: number;
  percentagePointVariation: number;
}

export const DEFAULT_LONGITUDINAL_MATERIALITY: LongitudinalMaterialityThresholds = {
  monetaryVariation: 0.05, // 5%
  ratioVariation: 0.10, // 0.10x
  percentagePointVariation: 1.0 // 1 p.p.
};

export class BalanceSheetLongitudinalConsistencyEngine {
  /**
   * Compares Current Year with Previous Year.
   * Generates a Longitudinal Consistency Score (0-100).
   */
  public static evaluate(
    historicalAvailability: 'AVAILABLE' | 'INSUFFICIENT' | 'UNRELIABLE',
    prevYearIndicators: Record<string, number>,
    currYearIndicators: Record<string, number>,
    materiality: LongitudinalMaterialityThresholds = DEFAULT_LONGITUDINAL_MATERIALITY
  ): { 
    consistencyScore: number; 
    improvedMetrics: string[]; 
    deterioratedMetrics: string[]; 
    unchangedMetrics: string[]; 
    unavailableMetrics: string[]; 
  } {
    if (historicalAvailability !== 'AVAILABLE') {
      return {
        consistencyScore: 0,
        improvedMetrics: [],
        deterioratedMetrics: [],
        unchangedMetrics: [],
        unavailableMetrics: Object.keys(currYearIndicators)
      };
    }

    let consistencyScore = 100;
    const improvedMetrics: string[] = [];
    const deterioratedMetrics: string[] = [];
    const unchangedMetrics: string[] = [];
    const unavailableMetrics: string[] = [];

    // Simple rule mapping for demonstration: 
    // Positive metrics: higher is better (e.g. Liquidity, Equity Buffer)
    // Negative metrics: lower is better (e.g. Debt-to-Equity, Endividamento Geral)
    const positiveMetrics = ['Liquidez Corrente', 'Liquidez Seca', 'Liquidez Imediata', 'Liquidez Geral', 'Equity Buffer', 'Capital de Giro Líquido'];
    const negativeMetrics = ['Endividamento Geral', 'Dependência de Capital de Terceiros', 'Financial Debt-to-Equity'];

    for (const [metric, currValue] of Object.entries(currYearIndicators)) {
      if (prevYearIndicators[metric] === undefined) {
        unavailableMetrics.push(metric);
        continue;
      }

      const prevValue = prevYearIndicators[metric];
      let isMaterial = false;
      let variation = 0;

      // Determine variation and materiality
      if (metric === 'Endividamento Geral' || metric === 'Equity Buffer') {
        // Percentage point
        variation = (currValue - prevValue) * 100;
        isMaterial = Math.abs(variation) >= materiality.percentagePointVariation;
      } else if (positiveMetrics.includes(metric) || negativeMetrics.includes(metric)) {
        // Ratio or multiplier
        variation = currValue - prevValue;
        isMaterial = Math.abs(variation) >= materiality.ratioVariation;
      } else {
        // Assume monetary for unknown metrics
        variation = (currValue - prevValue) / (prevValue || 1);
        isMaterial = Math.abs(variation) >= materiality.monetaryVariation;
      }

      if (!isMaterial) {
        unchangedMetrics.push(metric);
        continue;
      }

      const isPositiveMetric = positiveMetrics.includes(metric);
      const isNegativeMetric = negativeMetrics.includes(metric);

      if (isPositiveMetric) {
        if (variation > 0) improvedMetrics.push(metric);
        else deterioratedMetrics.push(metric);
      } else if (isNegativeMetric) {
        if (variation < 0) improvedMetrics.push(metric);
        else deterioratedMetrics.push(metric);
      } else {
        // Fallback: assume higher is better
        if (variation > 0) improvedMetrics.push(metric);
        else deterioratedMetrics.push(metric);
      }
    }

    return {
      consistencyScore,
      improvedMetrics,
      deterioratedMetrics,
      unchangedMetrics,
      unavailableMetrics
    };
  }
}
