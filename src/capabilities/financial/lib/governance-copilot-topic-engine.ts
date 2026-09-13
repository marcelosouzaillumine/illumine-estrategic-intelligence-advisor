// src/lib/governance-copilot-topic-engine.ts

import { GOVERNANCE_COPILOT_TOPIC_REGISTRY } from './governance-copilot-topic-registry';
import type { GovernanceCopilotTopic, GovernanceCopilotContextInput } from './governance-copilot-types';

export class GovernanceCopilotTopicEngine {
  /**
   * Deterministically evaluates available topics based on the presence
   * of the underlying intelligence engines.
   */
  static discoverAvailableTopics(input: GovernanceCopilotContextInput): GovernanceCopilotTopic[] {
    if (!input || Object.keys(input).length === 0) {
      return [];
    }

    const availableTopics: GovernanceCopilotTopic[] = [];

    for (const rule of GOVERNANCE_COPILOT_TOPIC_REGISTRY) {
      // A topic is available if ALL required engines have populated outputs in the input
      const isAvailable = rule.requiredEngines.every(engineKey => {
        const engineData = (input as any)[engineKey];
        return engineData !== undefined && engineData !== null;
      });

      if (isAvailable) {
        availableTopics.push(rule.topic);
      }
    }

    return availableTopics;
  }
}
