import { describe, it, expect } from 'vitest';
import { AdvisoryRecommendationContract } from '../index';
import { Score } from '@illumine/core-primitives';

describe('@illumine/advisory-governance (Wave 15D Phase 2 Contract Governance)', () => {
  it('should instantiate a valid AdvisoryRecommendationContract across corporate decision categories', () => {
    const contract: AdvisoryRecommendationContract = {
      recommendationId: 'rec-gov-01',
      originatingAgent: 'cfo-governance-agent',
      decisionCategory: 'Financial',
      businessContext: 'Reestruturação de capital de giro',
      evidenceBundle: { bundleId: 'b-01', metricCodes: ['EBITDA'], factSummaries: ['DRE Q3'], lineageHash: 'sha-01' },
      confidenceScore: Score.create(94),
      riskClassification: 'HIGH',
      approvalRequirement: 'HUMAN_APPROVAL_COMPULSORY',
      executionStatus: 'READY_FOR_REVIEW'
    };

    expect(contract.decisionCategory).toBe('Financial');
    expect(contract.approvalRequirement).toBe('HUMAN_APPROVAL_COMPULSORY');
  });
});
