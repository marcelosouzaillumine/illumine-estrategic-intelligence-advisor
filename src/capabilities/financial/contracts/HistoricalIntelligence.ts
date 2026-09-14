import { AnalyticalAvailability } from '../../../core/contracts/AnalyticalAvailability';

export type HistoricalTrajectoryClassification = 
  | "strengthening"
  | "stable"
  | "attention"
  | "deteriorating"
  | "volatile"
  | "insufficient";

export interface HistoricalMovement {
    metric: string;
    period: string;
    variation: {
        absolute: number | undefined;
        percentage: number | 'NOT_APPLICABLE' | 'SIGN_INVERSION' | 'ZERO_CHANGE' | 'UNAVAILABLE';
    };
    interpretation: string;
    direction?: string;
    inflectionPoint?: string;
    evidence: {
        source: string;
    };
}

export interface HistoricalIntelligence extends AnalyticalAvailability {
    periodCoverage: {
        firstYear: number;
        lastYear: number;
        periodsAnalyzed: number;
    };
    trajectory: {
        classification: HistoricalTrajectoryClassification;
        confidence: string;
        explanation: string;
    };
    movements: HistoricalMovement[];
    executiveContext: {
        observation: string;
        implication: string;
    };
}
