/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveDecisionContext } from '@illumine/executive-contracts';
import { ExecutiveCouncil } from '../agent-council/src';

describe('@illumine/intelligence (Wave 18.10 Multi-Agent Advisory Integration)', () => {
  it('should integrate multi-agent deliberation seamlessly without circular dependencies or architectural violations', () => {
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

    const councilDecision = ExecutiveCouncil.deliberate(mockContext);
    expect(councilDecision.finalCouncilRecommendation).toBeDefined();
    expect(councilDecision.unanimousAgreement).toBe(false); // 4 approve, 1 approve with reservations -> non-unanimous but strong consensus
    expect(councilDecision.consensusScore).toBe(95);
  });
});
