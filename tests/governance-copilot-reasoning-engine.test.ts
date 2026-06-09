// tests/governance-copilot-reasoning-engine.test.ts

import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { runGovernanceCopilotReasoningAdapter } from '../src/core/runtime/governance-copilot/governance-copilot-reasoning-adapter';

describe('GovernanceCopilotReasoningEngine & Adapter', () => {
  it('must enforce Deep Non-Interference', () => {
    const originalReport = {
      esgIntelligence: { overallScore: 85 },
      institutionalOutcomes: { conversionMetrics: { totalOutcomes: 5 } },
      executiveSovereignty: { sovereigntyClassification: 'SOVEREIGN' },
      governanceCopilotContext: { availableTopics: ['ESG'] }
    };

    const originalClone = JSON.parse(JSON.stringify(originalReport));

    const finalReport = runGovernanceCopilotReasoningAdapter(
      originalReport as any,
      { questionId: 'Q-1', text: 'what are the priorities?' }
    );

    // Ensure reasoning package was attached
    assert.ok(finalReport.governanceCopilotReasoning);
    assert.strictEqual(finalReport.governanceCopilotReasoning.questionId, 'Q-1');

    // Deep Equality Check for non-interference
    assert.deepStrictEqual(finalReport.esgIntelligence, originalClone.esgIntelligence);
    assert.deepStrictEqual(finalReport.institutionalOutcomes, originalClone.institutionalOutcomes);
    assert.deepStrictEqual(finalReport.executiveSovereignty, originalClone.executiveSovereignty);
    assert.deepStrictEqual(finalReport.governanceCopilotContext, originalClone.governanceCopilotContext);

    // No generative AI strings
    assert.strictEqual(typeof finalReport.governanceCopilotReasoning.confidence.level, 'string');
  });
});
