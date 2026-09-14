import { describe, it, expect } from 'vitest';
import { ExecutiveInsightEngine } from '../index';

describe('@illumine/executive-insight-engine (Wave 16 Phase 4 Insight Engine)', () => {
  it('should create ExecutiveInsight across canonical categories', () => {
    const insight = ExecutiveInsightEngine.createInsight(
      'Opportunity',
      'Oportunidade de expansão no mercado B2B regional',
      ['strategy-agent', 'commercial-agent'],
      'Autorizar estudo de viabilidade para nova unidade'
    );

    expect(insight.category).toBe('Opportunity');
    expect(insight.contributingAgents.length).toBe(2);
    expect(insight.confidence.value).toBe(92);
  });
});
