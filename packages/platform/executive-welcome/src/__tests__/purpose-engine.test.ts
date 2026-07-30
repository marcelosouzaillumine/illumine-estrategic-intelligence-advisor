/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutivePurposeEngine } from '../index';

describe('Quality Gate 4 — Purpose Engine Test', () => {
  it('should generate contextual purpose statement describing why work matters', () => {
    const purpose = ExecutivePurposeEngine.buildPurposeStatement();

    expect(purpose).toContain('42 colaboradores');
    expect(purpose).toContain('R$ 28 milhões em receita anual');
  });
});
