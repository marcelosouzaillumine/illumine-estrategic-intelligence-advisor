import { FinancialIndicatorsFact, Indicator } from '../../domain/types/FinancialIndicatorsFact';

export interface DimensionScore {
    dimension: string;
    score: number; // 0 to 100
    weight: number; // 0 to 1
    description: string;
}

export interface FinancialPositionScore {
    totalScore: number;
    version: string;
    dimensions: DimensionScore[];
}

export interface ScoringModel {
    version: string;
    evaluate(facts: FinancialIndicatorsFact): FinancialPositionScore;
}
