// src/core/runtime/lifecycle/LifecycleClassificationEngine.ts

export type LifecycleStage =
  | 'INITIAL_CAPITALIZATION'
  | 'EARLY_GROWTH'
  | 'EXPANSION'
  | 'SCALING'
  | 'MATURE'
  | 'RESTRUCTURING'
  | 'DECLINING'
  | 'UNKNOWN_LIFECYCLE';

export interface LifecycleClassificationParams {
  foundationYear?: number;
  analysisYear: number;
  historicalCycles: number;
  capitalSocial: number;
  revenue: number;
  netIncome: number;
}

export interface LifecycleClassificationResult {
  stage: LifecycleStage;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
}

export class LifecycleClassificationEngine {
  public static classify(params: LifecycleClassificationParams): LifecycleClassificationResult {
    const { foundationYear, analysisYear, historicalCycles, capitalSocial, revenue, netIncome } = params;

    // Fallback: If foundationYear is missing, return UNKNOWN_LIFECYCLE / LOW confidence
    if (foundationYear === undefined || foundationYear === null || foundationYear === 0) {
      return {
        stage: 'UNKNOWN_LIFECYCLE',
        confidence: 'LOW'
      };
    }

    const age = Math.max(0, analysisYear - foundationYear);

    // 1. Check special stages first (RESTRUCTURING and DECLINING overrides)
    if (age >= 5 && historicalCycles >= 3 && netIncome < -10000 && revenue < 500000) {
      return { stage: 'RESTRUCTURING', confidence: 'HIGH' };
    }
    if (age > 7 && historicalCycles >= 5 && netIncome < 0) {
      return { stage: 'DECLINING', confidence: 'HIGH' };
    }

    // 2. Multi-criteria maturity scoring
    // Criteria 1: Age (Idade) - 40% weight
    let ageScore = 10;
    if (age > 7) ageScore = 100;
    else if (age > 5) ageScore = 90;
    else if (age > 3) ageScore = 70;
    else if (age > 1) ageScore = 40;

    // Criteria 2: Cycles (Ciclos Auditáveis) - 25% weight
    let cyclesScore = 10;
    if (historicalCycles > 5) cyclesScore = 100;
    else if (historicalCycles > 3) cyclesScore = 90;
    else if (historicalCycles > 2) cyclesScore = 75;
    else if (historicalCycles > 1) cyclesScore = 45;

    // Criteria 3: Revenue (Receita Líquida) - 15% weight
    let revenueScore = 10;
    if (revenue > 30000000) revenueScore = 100;
    else if (revenue > 10000000) revenueScore = 90;
    else if (revenue > 2000000) revenueScore = 70;
    else if (revenue > 100000) revenueScore = 40;

    // Criteria 4: Capital Social (Base Fiduciária) - 10% weight
    let capitalScore = 15;
    if (capitalSocial > 5000000) capitalScore = 100;
    else if (capitalSocial > 500000) capitalScore = 80;
    else if (capitalSocial > 50000) capitalScore = 50;

    // Criteria 5: Net Income (Resultado Líquido) - 10% weight
    let incomeScore = 20;
    if (netIncome >= 500000) incomeScore = 100;
    else if (netIncome >= 50000) incomeScore = 80;
    else if (netIncome >= 0) incomeScore = 50;

    // Weighted Score Compilation (40%, 25%, 15%, 10%, 10%)
    const totalScore = 
      (ageScore * 0.40) + 
      (cyclesScore * 0.25) + 
      (revenueScore * 0.15) + 
      (capitalScore * 0.10) + 
      (incomeScore * 0.10);

    // Map score to stage
    let stage: LifecycleStage = 'INITIAL_CAPITALIZATION';
    if (totalScore < 30) stage = 'INITIAL_CAPITALIZATION';
    else if (totalScore < 50) stage = 'EARLY_GROWTH';
    else if (totalScore < 70) stage = 'EXPANSION';
    else if (totalScore < 85) stage = 'SCALING';
    else stage = 'MATURE';

    return {
      stage,
      confidence: 'HIGH'
    };
  }
}
