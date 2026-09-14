export type LifecycleStage = 'INITIAL_CAPITALIZATION' | 'EARLY_GROWTH' | 'SCALING' | 'MATURE' | 'DISTRESSED';

export interface LifecycleClassificationParams {
  historicalCycles: number;
  analysisYear: number;
  foundationYear?: number;
}

export class LifecycleClassificationEngine {
  public static classify(params: LifecycleClassificationParams): LifecycleStage {
    const { historicalCycles, analysisYear, foundationYear } = params;
    const foundation = foundationYear ?? (analysisYear - historicalCycles + 1);

    if (historicalCycles <= 1 || analysisYear <= foundation + 1) {
      return 'INITIAL_CAPITALIZATION';
    } else if (historicalCycles <= 3) {
      return 'EARLY_GROWTH';
    } else {
      return 'SCALING';
      // MATURE and DISTRESSED could be added later based on other metrics (e.g., revenue growth, profitability)
    }
  }
}
