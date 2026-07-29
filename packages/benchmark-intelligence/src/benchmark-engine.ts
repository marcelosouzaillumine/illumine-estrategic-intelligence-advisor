export interface IndustryBenchmark {
  industry: string;
  p25EbitdaMarginPercentage: number;
  p50EbitdaMarginPercentage: number;
  p75EbitdaMarginPercentage: number; // Quartil Superior
  averageWorkingCapitalDays: number;
}

export class BenchmarkEngine {
  public static getIndustryBenchmark(industry: string): IndustryBenchmark {
    return {
      industry,
      p25EbitdaMarginPercentage: 12.0,
      p50EbitdaMarginPercentage: 18.5,
      p75EbitdaMarginPercentage: 26.4,
      averageWorkingCapitalDays: 45
    };
  }
}
