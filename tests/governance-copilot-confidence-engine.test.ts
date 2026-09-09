// tests/governance-copilot-confidence-engine.test.ts

import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { GovernanceCopilotConfidenceEngine } from '../src/lib/governance-copilot-confidence-engine';

describe('GovernanceCopilotConfidenceEngine', () => {
  it('must cap confidence at LOW if conflicts >= 2', () => {
    const confidence = GovernanceCopilotConfidenceEngine.evaluateConfidence(
      { esgIntelligence: {} } as any,
      10, // lots of evidence
      10, // lots of memory
      ['esgGovernance'],
      3   // high conflicts
    );
    assert.strictEqual(confidence.level, 'LOW');
  });

  it('must evaluate to VERY_HIGH with strong evidence, zero conflicts, and zero missing sources', () => {
    const confidence = GovernanceCopilotConfidenceEngine.evaluateConfidence(
      { 
        esgIntelligence: {},
        valuationIntelligence: {},
        governanceDigitalTwin: {}
      } as any,
      10, // 5.0
      10, // 3.0
      ['esgGovernance', 'valuationGovernance', 'governanceDigitalTwin'], // 3.0 -> Total 11.0 (> 8)
      0  // zero conflicts
    );
    assert.strictEqual(confidence.level, 'VERY_HIGH');
  });

  it('must prevent VERY_HIGH if evidence/memory is LOW despite HIGH governance', () => {
    const confidence = GovernanceCopilotConfidenceEngine.evaluateConfidence(
      { 
        esgIntelligence: {},
        valuationIntelligence: {},
        governanceDigitalTwin: {}
      } as any,
      0, // zero evidence
      0, // zero memory
      ['esgGovernance', 'valuationGovernance', 'governanceDigitalTwin'], // 3.0
      0
    );
    // Based on rules: if evidence == 0 && memory == 0, max is MODERATE. Score is 3.0 > 2, so MODERATE.
    assert.strictEqual(confidence.level, 'MODERATE');
  });
});
