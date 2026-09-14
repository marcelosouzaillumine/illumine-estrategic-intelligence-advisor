// tests/governance-copilot-routing-engine.test.ts

import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { GovernanceCopilotRoutingEngine } from '../src/lib/governance-copilot-routing-engine';

describe('GovernanceCopilotRoutingEngine', () => {
  it('must route "risk" to RISKS, GOVERNANCE, EXECUTION', () => {
    const topics = GovernanceCopilotRoutingEngine.routeQuestionToTopics({ questionId: '1', text: 'what is our main risk?' });
    assert.ok(topics.includes('RISKS'));
    assert.ok(topics.includes('GOVERNANCE'));
    assert.ok(topics.includes('EXECUTION'));
  });

  it('must route unknown text to default SOVEREIGNTY and GOVERNANCE', () => {
    const topics = GovernanceCopilotRoutingEngine.routeQuestionToTopics({ questionId: '2', text: 'hello world' });
    assert.ok(topics.includes('GOVERNANCE'));
    assert.ok(topics.includes('SOVEREIGNTY'));
  });

  it('must aggregate required sources correctly', () => {
    const sources = GovernanceCopilotRoutingEngine.getRequiredSourcesForTopics(['VALUATION', 'OUTCOMES']);
    assert.ok(sources.includes('valuationGovernance'));
    assert.ok(sources.includes('institutionalOutcomes'));
    assert.ok(sources.includes('governanceCopilotContext'));
  });
});
