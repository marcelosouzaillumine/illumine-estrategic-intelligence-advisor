// src/lib/governance-copilot-memory-engine.ts

import type { GovernanceCopilotReasoningInput, GovernanceCopilotMemoryReference } from './governance-copilot-reasoning-types';
import type { GovernanceCopilotTopic } from './governance-copilot-types';

export class GovernanceCopilotMemoryEngine {
  /**
   * Identifies relevant institutional memories based on topics.
   */
  static resolveMemories(
    input: GovernanceCopilotReasoningInput,
    relevantTopics: GovernanceCopilotTopic[]
  ): GovernanceCopilotMemoryReference[] {
    if (!input) return [];

    const memories: GovernanceCopilotMemoryReference[] = [];

    // Extract from Governance Memory
    if (input.governanceMemory && input.governanceMemory.events) {
      for (const event of input.governanceMemory.events) {
        // Simple heuristic: if any related topic matches our relevant topics
        const hasTopicMatch = event.relatedTopics && event.relatedTopics.some(t => relevantTopics.includes(t as any));
        const isExecutionRelated = relevantTopics.includes('EXECUTION') && event.eventType === 'ACTION_PLAN_COMPLETED';
        const isRiskRelated = relevantTopics.includes('RISKS') && (event.eventType === 'RISK_ESCALATED' || event.eventType === 'RISK_CLOSED');

        if (hasTopicMatch || isExecutionRelated || isRiskRelated) {
          memories.push({
            memoryId: event.eventId,
            sourceLayer: 'GML',
            description: event.description
          });
        }
      }
    }

    // Extract from IOD Learning Patterns
    if (input.institutionalOutcomes && input.institutionalOutcomes.learningPatterns) {
      if (relevantTopics.includes('OUTCOMES') || relevantTopics.includes('EXECUTION')) {
        for (const pattern of input.institutionalOutcomes.learningPatterns) {
          memories.push({
            memoryId: pattern.patternId,
            sourceLayer: 'IOD_PATTERN',
            description: pattern.description
          });
        }
      }
    }

    return memories;
  }
}
