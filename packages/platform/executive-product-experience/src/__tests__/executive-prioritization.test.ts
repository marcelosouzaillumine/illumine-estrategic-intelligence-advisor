/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveInsightPrioritizationEngine } from '../index';

describe('Quality Gate 2 — Executive Prioritization Test', () => {
  it('should categorize insights into Top 3, Quick Wins, Strategic Projects, and Critical Risks', () => {
    const prioritization = ExecutiveInsightPrioritizationEngine.prioritizeCompanyInsights('empresa-prio-check');

    expect(prioritization.top3Priorities.length).toBeGreaterThan(0);
    expect(prioritization.quickWins.length).toBeGreaterThan(0);
    expect(prioritization.strategicProjects.length).toBeGreaterThan(0);
    expect(prioritization.criticalRisks.length).toBeGreaterThan(0);
  });
});
