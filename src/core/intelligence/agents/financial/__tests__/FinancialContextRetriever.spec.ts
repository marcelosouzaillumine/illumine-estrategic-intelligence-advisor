import { describe, it, expect, beforeEach } from 'vitest';
import { FinancialContextRetriever } from '../FinancialContextRetriever';
import { FinancialExecutiveIntent } from '../FinancialExecutiveIntent';

describe('FinancialContextRetriever', () => {
  let retriever: FinancialContextRetriever;

  beforeEach(() => {
    retriever = new FinancialContextRetriever();
  });

  it('should retrieve targeted context for HEALTH_ASSESSMENT', () => {
    const unified = {
      financialHealthProfile: 'STABLE',
      criticalFindings: [{ finding: 'X', severity: 'HIGH' }],
      history: [],
      executiveQuestions: [],
      strategicThemes: [],
      intelligenceTrace: []
    };

    const context = retriever.retrieve(FinancialExecutiveIntent.HEALTH_ASSESSMENT, unified as any);
    expect(context.profile).toBe('STABLE');
    expect(context.criticalFindings).toBeDefined();
    expect(context.history).toBeUndefined(); // Shouldn't load history
  });

  it('should retrieve targeted context for TREND_ANALYSIS', () => {
    const unified = {
      financialHealthProfile: 'STABLE',
      history: [{ period: '2024' }]
    };

    const context = retriever.retrieve(FinancialExecutiveIntent.TREND_ANALYSIS, unified as any);
    expect(context.history).toBeDefined();
    expect(context.profile).toBeUndefined(); // Shouldn't load profile
  });
});
