// tests/governance-copilot-topic-engine.test.ts

import { describe, it } from 'node:test';
import * as assert from 'node:assert';
import { GovernanceCopilotTopicEngine } from '../src/lib/governance-copilot-topic-engine';
import type { GovernanceCopilotContextInput } from '../src/lib/governance-copilot-types';

describe('GovernanceCopilotTopicEngine', () => {
  it('must return empty topics when input is undefined or empty', () => {
    assert.deepStrictEqual(GovernanceCopilotTopicEngine.discoverAvailableTopics(undefined as any), []);
    assert.deepStrictEqual(GovernanceCopilotTopicEngine.discoverAvailableTopics({}), []);
  });

  it('must correctly identify available topics when engines are present', () => {
    const input: GovernanceCopilotContextInput = {
      executiveSovereignty: {} as any,
      governanceIntelligenceNetwork: {} as any,
      esgIntelligence: {} as any
    };

    const topics = GovernanceCopilotTopicEngine.discoverAvailableTopics(input);
    
    // RISKS requires executiveSovereignty and governanceIntelligenceNetwork
    assert.ok(topics.includes('RISKS'));
    
    // PRIORITIES requires executiveSovereignty
    assert.ok(topics.includes('PRIORITIES'));
    
    // ESG requires esgIntelligence
    assert.ok(topics.includes('ESG'));
    
    // VALUATION requires valuationIntelligence, which is absent
    assert.ok(!topics.includes('VALUATION'));
  });

  it('must not expose OUTCOMES if IOD is absent', () => {
    const input: GovernanceCopilotContextInput = {
      executiveSovereignty: {} as any
    };
    const topics = GovernanceCopilotTopicEngine.discoverAvailableTopics(input);
    assert.ok(!topics.includes('OUTCOMES'));
  });

  it('must expose OUTCOMES if IOD is present', () => {
    const input: GovernanceCopilotContextInput = {
      institutionalOutcomes: { records: [] }
    };
    const topics = GovernanceCopilotTopicEngine.discoverAvailableTopics(input);
    assert.ok(topics.includes('OUTCOMES'));
  });
});
