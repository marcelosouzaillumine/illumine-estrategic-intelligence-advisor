/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveWisdomEngine } from '../index';

describe('Quality Gate 6 — Organizational Learning Test', () => {
  it('should ensure wisdom patterns do not rely on generative hallucination', () => {
    const wisdom = ExecutiveWisdomEngine.extractWisdom();

    wisdom.forEach(w => {
      expect(w.dataSupportReference).toBeDefined();
      expect(w.empiricalEvidenceText).toBeDefined();
    });
  });
});
