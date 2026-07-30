/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveRecommendationEngine } from '../index';

describe('Quality Gate 1 — Advisory Boundary Guard Test', () => {
  it('should enforce that advisory engines only generate recommendations and cannot trigger execution adapters', () => {
    const rec = ExecutiveRecommendationEngine.generateRecommendation('empresa-boundary', 'Conselho', 'Texto');

    expect(rec.recommendationId).toBeDefined();
    expect(rec.humanReviewStatus).toBe('PENDING_REVIEW');
    // Ensure direct execution methods do not exist on advisory output
    expect((rec as any).executeAction).toBeUndefined();
    expect((rec as any).triggerWorkflowDirectly).toBeUndefined();
  });
});
