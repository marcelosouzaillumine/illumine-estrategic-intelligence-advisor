/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveGreetingEngine } from '../index';

describe('Quality Gate 1 — Executive Greeting Test', () => {
  it('should generate time-aware greeting C-Level', () => {
    const morning = ExecutiveGreetingEngine.generateGreeting('Marcelo', 9);
    expect(morning).toContain('Bom dia, Marcelo');

    const afternoon = ExecutiveGreetingEngine.generateGreeting('Marcelo', 14);
    expect(afternoon).toContain('Boa tarde, Marcelo');

    const evening = ExecutiveGreetingEngine.generateGreeting('Marcelo', 20);
    expect(evening).toContain('Boa noite, Marcelo');
  });
});
