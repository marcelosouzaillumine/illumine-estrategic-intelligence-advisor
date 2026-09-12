/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveRecommendationEngine, HumanExecutiveReviewEngine } from '../index';

describe('Quality Gate 3 — Human Authority Gate Test', () => {
  it('should prevent conversion to DecisionCommandEnvelope if human review status is PENDING_REVIEW or REJECTED', () => {
    const rec = ExecutiveRecommendationEngine.generateRecommendation('empresa-authority-check', 'Autoridade Humana', 'Texto');

    const pendingResult = HumanExecutiveReviewEngine.reviewAndApproveRecommendation(rec, 'PENDING_REVIEW', 'user-01');
    expect(pendingResult.commandEnvelope).toBeUndefined();

    const rejectedResult = HumanExecutiveReviewEngine.reviewAndApproveRecommendation(rec, 'REJECTED', 'user-01');
    expect(rejectedResult.commandEnvelope).toBeUndefined();
  });
});
