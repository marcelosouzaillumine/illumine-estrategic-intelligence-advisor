// src/lib/governance-copilot-topic-registry.ts

import type { GovernanceCopilotTopic } from './governance-copilot-types';

export interface TopicRoutingRules {
  topic: GovernanceCopilotTopic;
  requiredEngines: string[]; // List of engine output keys required to unlock this topic
}

export const GOVERNANCE_COPILOT_TOPIC_REGISTRY: TopicRoutingRules[] = [
  {
    topic: 'RISKS',
    requiredEngines: ['executiveSovereignty', 'governanceGovernanceNetwork']
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
    requiredEngines: ['governanceGovernanceNetwork']
  },
  {
    topic: 'VALUATION',
    requiredEngines: ['valuationGovernance']
  },
  {
    topic: 'ESG',
    requiredEngines: ['esgGovernance']
  },
  {
    topic: 'CAPITAL_ALLOCATION',
    requiredEngines: ['capitalAllocationGovernance']
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
