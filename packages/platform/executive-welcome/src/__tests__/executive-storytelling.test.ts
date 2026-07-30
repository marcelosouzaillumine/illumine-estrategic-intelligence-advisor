/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { ExecutiveWelcomeOrchestrator } from '../index';

describe('Quality Gate 10 — Executive Storytelling Test', () => {
  it('should deliver storytelling narrative strengthening identity, purpose and trust', () => {
    const welcome = ExecutiveWelcomeOrchestrator.buildWelcomeExperience('usr-story', 'Marcelo', 'CLIENT');

    expect(welcome.identity?.legacyNarrativeText).toContain('Hoje existe uma nova oportunidade para continuar esse trabalho');
    expect(welcome.purposeStatementText).toContain('R$ 28 milhões em receita anual');
    expect(welcome.closingActionQuestion).toBeDefined();
  });
});
