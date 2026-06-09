import { InstitutionalOutcomeRecord, EvidenceAuditSummary, InstitutionalConversionMetrics, OutcomeEvidenceLevel } from './institutional-outcomes-types';

export function runEvidenceAudit(
  records: InstitutionalOutcomeRecord[],
  metrics: InstitutionalConversionMetrics
): EvidenceAuditSummary {

  let predominantLevel: OutcomeEvidenceLevel = 'E1';
  let maxCount = metrics.totalInsights;

  if (metrics.totalRecommendations > maxCount) { maxCount = metrics.totalRecommendations; predominantLevel = 'E2'; }
  if (metrics.totalDecisions > maxCount) { maxCount = metrics.totalDecisions; predominantLevel = 'E3'; }
  if (metrics.totalActions > maxCount) { maxCount = metrics.totalActions; predominantLevel = 'E4'; }
  if (metrics.totalOutcomes > maxCount) { maxCount = metrics.totalOutcomes; predominantLevel = 'E5'; }
  if (metrics.totalMeasured > maxCount) { maxCount = metrics.totalMeasured; predominantLevel = 'E6'; }

  let classification: 'SUPPORT_TOOL' | 'ANALYTICAL_TOOL' | 'DECISION_SUPPORT_SYSTEM' | 'GOVERNANCE_INTELLIGENCE_PLATFORM' | 'INSTITUTIONAL_INTELLIGENCE_PLATFORM' | 'INSTITUTIONAL_OPERATING_SYSTEM' = 'GOVERNANCE_INTELLIGENCE_PLATFORM';

  // Dynamic Rule: User specified
  // If E1/E2 predominate: Governance Intelligence Platform
  // If E3/E4 predominate: Institutional Intelligence Platform
  // If E5/E6 predominate: Institutional Operating System
  if (predominantLevel === 'E3' || predominantLevel === 'E4') {
    classification = 'INSTITUTIONAL_INTELLIGENCE_PLATFORM';
  } else if (predominantLevel === 'E5' || predominantLevel === 'E6') {
    classification = 'INSTITUTIONAL_OPERATING_SYSTEM';
  }

  let strength: 'WEAK' | 'MODERATE' | 'STRONG' | 'IRREFUTABLE' = 'WEAK';
  if (classification === 'GOVERNANCE_INTELLIGENCE_PLATFORM') strength = 'MODERATE';
  if (classification === 'INSTITUTIONAL_INTELLIGENCE_PLATFORM') strength = 'STRONG';
  if (classification === 'INSTITUTIONAL_OPERATING_SYSTEM') strength = 'IRREFUTABLE';

  return {
    evidenceStrengthClassification: strength,
    decisionInfluenceClassification: classification,
    predominantLevel,
    totalVerifiedEvidence: records.length
  };
}
