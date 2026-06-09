// src/lib/governance-copilot-topic-registry.ts

import type { GovernanceCopilotTopic } from './governance-copilot-types';

export interface TopicRoutingRules {
  topic: GovernanceCopilotTopic;
  requiredEngines: string[]; // List of engine output keys required to unlock this topic
}

export const GOVERNANCE_COPILOT_TOPIC_REGISTRY: TopicRoutingRules[] = [
  {
    topic: 'RISKS',
    requiredEngines: ['executiveSovereignty', 'governanceIntelligenceNetwork']
  },
  {
    topic: 'PRIORITIES',
    requiredEngines: ['executiveSovereignty']
  },
  {
    topic: 'EXECUTION',
    requiredEngines: ['governanceDigitalTwin']
  },
  {
    topic: 'GOVERNANCE',
    requiredEngines: ['governanceIntelligenceNetwork']
  },
  {
    topic: 'VALUATION',
    requiredEngines: ['valuationIntelligence']
  },
  {
    topic: 'ESG',
    requiredEngines: ['esgIntelligence']
  },
  {
    topic: 'CAPITAL_ALLOCATION',
    requiredEngines: ['capitalAllocationIntelligence']
  },
  {
    topic: 'SOVEREIGNTY',
    requiredEngines: ['executiveSovereignty']
  },
  {
    topic: 'OUTCOMES',
    requiredEngines: ['institutionalOutcomes']
  }
];
