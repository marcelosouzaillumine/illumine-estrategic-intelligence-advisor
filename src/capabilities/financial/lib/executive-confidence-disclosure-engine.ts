// src/lib/executive-confidence-disclosure-engine.ts

import type { GovernanceCopilotReasoningResult } from './governance-copilot-reasoning-types';
import type { ExecutiveConversationTraceability } from './executive-conversation-types';

export class ExecutiveConfidenceDisclosureEngine {
  /**
   * Generates the deterministic traceability signature required for constitutional transparency.
   */
  static generateTraceability(
    reasoning: GovernanceCopilotReasoningResult
  ): ExecutiveConversationTraceability {
    return {
      evidenceCount: reasoning.supportingEvidence.length,
      memoryCount: reasoning.supportingMemories.length,
      conflictCount: reasoning.identifiedConflicts.length,
      confidenceLevel: reasoning.confidence.level,
      sourceTopics: reasoning.relevantTopics
    };
  }
}
