import { ExecutiveCaseAggregate } from '../aggregates/executive-case-aggregate';
import { Score } from '@illumine/core-primitives';

export class ExecutiveDecisionScoringService {
  public static evaluateCaseIntegrity(caseAggregate: ExecutiveCaseAggregate): Score {
    const index = caseAggregate.calculateIntegrityIndex();
    return index.compositeIntegrityScore;
  }
}

export class DecisionConfidenceService {
  public static calculateConfidence(caseAggregate: ExecutiveCaseAggregate): number {
    if (caseAggregate.evidences.length === 0) return 0;
    const totalConfidence = caseAggregate.evidences.reduce((sum, e) => sum + e.confidence.value, 0);
    return Math.round((totalConfidence / caseAggregate.evidences.length) * 100) / 100;
  }
}

export class RiskAggregationService {
  public static aggregateRiskSeverity(riskCodes: string[]): 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' {
    if (riskCodes.length === 0) return 'LOW';
    if (riskCodes.length > 5) return 'CRITICAL';
    if (riskCodes.length > 2) return 'HIGH';
    return 'MEDIUM';
  }
}
