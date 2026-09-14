/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { InstitutionalWisdomEngine } from '../index';

describe('Quality Gate 2 — Wisdom Hashing Contract Test', () => {
  it('should enforce SHA-256 wisdom hash and applicability scope for any InstitutionalWisdomObject', () => {
    const wisdom = InstitutionalWisdomEngine.synthesizeWisdom('dec-hash-check', 'EPISODIC', 1.5, 'Teste de hashing imutável');

    expect(wisdom.wisdomHash).toContain('wisdom-hash-dec-hash-check-');
    expect(wisdom.applicabilityScope).toContain('FINANCIAL');
  });
});
