// tests/executive-conversation-engine.test.ts

import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { runExecutiveConversationAdapter } from '../src/capabilities/runtime/governance-copilot/executive-conversation-adapter';

describe('ExecutiveConversationEngine & Adapter', () => {
  it('must fail safely if governanceCopilotReasoning is absent (Deep Non-Interference)', () => {
    const originalReport = {
      esgIntelligence: { overallScore: 85 }
    };
    const clonedReport = JSON.parse(JSON.stringify(originalReport));

    const finalReport = runExecutiveConversationAdapter(
      originalReport as any,
      { questionId: 'Q1', text: 'help' },
      'BOARD'
    );

    // No ECL attached, but payload is completely preserved
    assert.deepStrictEqual(finalReport, clonedReport);
    assert.strictEqual(finalReport.executiveConversation, undefined);
  });

  it('must successfully attach executiveConversation without mutating prior governance', () => {
    const originalReport = {
      esgIntelligence: { overallScore: 85 },
      governanceCopilotContext: { availableTopics: ['ESG'] },
      governanceCopilotReasoning: {
        reasoningClassification: 'FULL_CONTEXT',
        relevantTopics: ['ESG'],
        identifiedConflicts: [],
        supportingEvidence: [{ evidenceId: 'E1', evidenceType: 'DOC', description: 'desc' }],
        supportingMemories: [],
        confidence: { level: 'HIGH' }
      }
    };
    const clonedReport = JSON.parse(JSON.stringify(originalReport));

    const finalReport = runExecutiveConversationAdapter(
      originalReport as any,
      { questionId: 'Q1', text: 'what is our esg status?' },
      'CEO'
    );

    assert.ok(finalReport.executiveConversation);
    assert.strictEqual(finalReport.executiveConversation.mode, 'CEO');
    assert.strictEqual(finalReport.executiveConversation.questionId, 'Q1');
    assert.strictEqual(finalReport.executiveConversation.traceability.evidenceCount, 1);
    
    // Deep non-interference validation
    assert.deepStrictEqual(finalReport.esgIntelligence, clonedReport.esgIntelligence);
    assert.deepStrictEqual(finalReport.governanceCopilotReasoning, clonedReport.governanceCopilotReasoning);
  });
});
