/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveDecisionContext } from '@illumine/executive-contracts';
import { DecisionExplainabilityEngine } from '../decision-trust-governance/src';

describe('@illumine/intelligence (Wave 18.10.5 Decision Explainability Engine)', () => {
  it('should generate a complete trust contract explaining confidence, risks and hypotheses (TEDG v1.0)', () => {
    const mockContext: ExecutiveDecisionContext = {
      companyId: 'company-granatum',
      period: '2026',
      industrySector: 'TECNOLOGIA',
      hasDfcData: true,
      hasDreData: true,
      hasBpData: true,
      dataQualityScore: 98,
      dataFreshnessDays: 1
    };

    const trustContract = DecisionExplainabilityEngine.generateTrustContract(mockContext, 'dec-101');
    expect(trustContract.decisionId).toBe('dec-101');
    expect(trustContract.overallConfidenceScore).toBe(94.0);
    expect(trustContract.dominantKPIs).toContain('EBITDA_MARGIN');
  });
});
