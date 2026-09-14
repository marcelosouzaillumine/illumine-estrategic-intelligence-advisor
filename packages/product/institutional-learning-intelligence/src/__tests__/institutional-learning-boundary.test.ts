/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { InstitutionalWisdomEngine, WisdomGraphEvolutionEngine } from '../index';

describe('Quality Gate 1 — Learning Integrity Boundary Test', () => {
  it('should enforce that learning outputs produce governed signals for the Wisdom Graph, without directly altering AI agent code', () => {
    const wisdom = InstitutionalWisdomEngine.synthesizeWisdom('dec-boundary', 'SEMANTIC', 5.0, 'Validação fiduciária');
    const signal = WisdomGraphEvolutionEngine.generateCausalEvolutionSignal(wisdom);

    expect(signal.signalId).toBeDefined();
    expect(signal.evolutionPayload).toBe('Validação fiduciária');
    // Ensure no direct Agent code modification property exists
    expect((signal as any).directAgentMutator).toBeUndefined();
  });
});
