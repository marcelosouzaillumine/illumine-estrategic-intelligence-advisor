/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveCompanionEngine } from '../index';

describe('Quality Gate 14 — Storytelling Regression Test', () => {
  it('should deliver clear non-invasive storytelling context text', () => {
    const profile = ExecutiveCompanionEngine.resolveCompanionProfile('Marcelo');

    expect(profile.relationshipContextText).toContain('Acompanhando ativamente');
  });
});
