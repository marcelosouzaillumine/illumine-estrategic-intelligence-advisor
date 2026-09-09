import { describe, it } from 'node:test';
import assert from 'node:assert';
import { runEvidenceAudit } from '../src/lib/institutional-evidence-audit-engine';
import { InstitutionalOutcomeRecord, InstitutionalConversionMetrics } from '../src/lib/institutional-outcomes-types';

describe('Institutional Evidence Audit Engine', () => {
  it('should classify as GOVERNANCE_GOVERNANCE_PLATFORM when E1/E2 predominate', () => {
    const records: InstitutionalOutcomeRecord[] = [];
    const metrics: InstitutionalConversionMetrics = {
      totalInsights: 10,
      totalRecommendations: 5,
      totalDecisions: 2,
      totalActions: 0,
      totalOutcomes: 0,
      totalMeasured: 0,
      insightToDecisionRate: 0.2,
      decisionToActionRate: 0,
      actionToOutcomeRate: 0,
      outcomeToMeasuredResultRate: 0
    };

    const audit = runEvidenceAudit(records, metrics);
    
    assert.strictEqual(audit.decisionInfluenceClassification, 'GOVERNANCE_GOVERNANCE_PLATFORM');
    assert.strictEqual(audit.evidenceStrengthClassification, 'MODERATE');
    assert.strictEqual(audit.predominantLevel, 'E1');
  });

  it('should classify as INSTITUTIONAL_OPERATING_SYSTEM when E5/E6 predominate', () => {
    const records: InstitutionalOutcomeRecord[] = [];
    const metrics: InstitutionalConversionMetrics = {
      totalInsights: 2,
      totalRecommendations: 2,
      totalDecisions: 2,
      totalActions: 5,
      totalOutcomes: 10,
      totalMeasured: 12,
      insightToDecisionRate: 1,
      decisionToActionRate: 2.5,
      actionToOutcomeRate: 2,
      outcomeToMeasuredResultRate: 1.2
    };

    const audit = runEvidenceAudit(records, metrics);
    
    assert.strictEqual(audit.decisionInfluenceClassification, 'INSTITUTIONAL_OPERATING_SYSTEM');
    assert.strictEqual(audit.evidenceStrengthClassification, 'IRREFUTABLE');
    assert.strictEqual(audit.predominantLevel, 'E6');
  });
});
