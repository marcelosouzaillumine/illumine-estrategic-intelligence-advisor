import { ExecutiveCaseAggregate } from '../aggregates/executive-case-aggregate';

export class DomainRules {
  public static validateCognitivePipeline(caseAggregate: ExecutiveCaseAggregate): boolean {
    // Invariante 2: Recommendation exige Findings prévios
    if (caseAggregate.recommendations.length > 0 && caseAggregate.findings.length === 0) {
      return false;
    }
    return true;
  }
}
