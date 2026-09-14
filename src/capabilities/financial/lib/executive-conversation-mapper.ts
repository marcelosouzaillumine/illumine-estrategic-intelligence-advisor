// src/lib/executive-conversation-mapper.ts

import type { ExecutiveConversationReportLike } from './executive-conversation-types';
import type { GovernanceCopilotReasoningResult } from './governance-copilot-reasoning-types';
import type { GovernanceCopilotContext } from './governance-copilot-types';

export class ExecutiveConversationMapper {
  /**
   * Deterministically extracts the context and reasoning required for conversation.
   * Ensures read-only preservation of upstream intelligence.
   */
  static extractIntelligence(
    report: ExecutiveConversationReportLike
  ): {
    context?: GovernanceCopilotContext;
    reasoning?: GovernanceCopilotReasoningResult;
  } {
    return {
      context: report.governanceCopilotContext,
      reasoning: report.governanceCopilotReasoning
    };
  }
}
