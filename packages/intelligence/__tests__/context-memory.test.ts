/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ContextMemoryEngine } from '../enterprise-knowledge-foundation/src';

describe('@illumine/governance (Wave 19.2.5 Context Memory Engine)', () => {
  it('should index decision context memory with causal impact tracking', () => {
    const mem = ContextMemoryEngine.indexMemory('comp-granatum', 'ctx-101', ['EBITDA', 'Pricing']);
    expect(mem.indexedConcepts).toHaveLength(2);
    expect(mem.causalImpactObserved).toBeDefined();
  });
});
