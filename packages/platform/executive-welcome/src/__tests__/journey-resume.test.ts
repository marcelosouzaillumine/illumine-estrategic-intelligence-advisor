/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveJourneyResumeEngine } from '../index';

describe('Quality Gate 5 — Executive Journey Resume Test', () => {
  it('should return last analyzed topic and recommended next action', () => {
    const resume = ExecutiveJourneyResumeEngine.getResumeState();

    expect(resume.lastAnalyzedTopic).toBeDefined();
    expect(resume.recommendedNextAction).toBeDefined();
  });
});
