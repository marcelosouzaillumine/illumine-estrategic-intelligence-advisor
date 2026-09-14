// src/core/runtime/lifecycle/LifecycleContextBuilder.ts

import { LifecycleClassificationEngine, LifecycleClassificationResult } from './LifecycleClassificationEngine';

export interface LifecycleContext {
  foundationYear?: number;
  analysisYear: number;
  historicalCycles: number;
  capitalSocial: number;
  revenue: number;
  netIncome: number;
  classification: LifecycleClassificationResult;
}

export class LifecycleContextBuilder {
  public static build(params: {
    foundationYear?: number;
    analysisYear: number;
    historicalCycles: number;
    capitalSocial: number;
    revenue: number;
    netIncome: number;
  }): LifecycleContext {
    const classification = LifecycleClassificationEngine.classify(params);
    return {
      ...params,
      classification
    };
  }
}
