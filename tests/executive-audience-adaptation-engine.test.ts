// tests/executive-audience-adaptation-engine.test.ts

import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { ExecutiveAudienceAdaptationEngine } from '../src/lib/executive-audience-adaptation-engine';

describe('ExecutiveAudienceAdaptationEngine', () => {
  it('must preserve meaning but adapt tone for BOARD vs CEO', () => {
    const mockReasoning: any = {
      reasoningClassification: 'CONFLICTING_CONTEXT',
      identifiedConflicts: [{ description: 'High ESG risks vs low execution.' }],
      relevantTopics: ['GENERAL'],
      supportingEvidence: []
    };

    const boardFindings = ExecutiveAudienceAdaptationEngine.adaptFindings(mockReasoning, 'BOARD');
    const ceoFindings = ExecutiveAudienceAdaptationEngine.adaptFindings(mockReasoning, 'CEO');

    // Both should contain the core evidence/description
    assert.ok(boardFindings.some(f => f.includes('High ESG risks vs low execution.')));
    assert.ok(ceoFindings.some(f => f.includes('High ESG risks vs low execution.')));

    // But styles must differ
    assert.ok(boardFindings.some(f => f.includes('Oversight Flag:')));
    assert.ok(ceoFindings.some(f => f.includes('Execution Constraint:')));
  });

  it('must gracefully handle INSUFFICIENT_CONTEXT', () => {
    const mockReasoning: any = {
      reasoningClassification: 'INSUFFICIENT_CONTEXT',
      identifiedConflicts: [],
      relevantTopics: [],
      supportingEvidence: []
    };

    const advisorFindings = ExecutiveAudienceAdaptationEngine.adaptFindings(mockReasoning, 'ADVISOR');
    assert.ok(advisorFindings[0].includes('Diagnostic data unavailable'));
  });
});
