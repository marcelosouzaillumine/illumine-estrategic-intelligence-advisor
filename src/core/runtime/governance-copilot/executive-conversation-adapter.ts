// src/core/runtime/governance-copilot/executive-conversation-adapter.ts

import type { ExecutiveConversationInput, ExecutiveConversationMode, ExecutiveConversationReportLike } from '../../../lib/executive-conversation-types';
import type { GovernanceCopilotQuestion } from '../../../lib/governance-copilot-reasoning-types';
import { ExecutiveConversationMapper } from '../../../lib/executive-conversation-mapper';
import { ExecutiveConversationEngine } from '../../../lib/executive-conversation-engine';

export function runExecutiveConversationAdapter(
  reportWithGovernanceCopilotReasoning: ExecutiveConversationReportLike,
  question: GovernanceCopilotQuestion,
  mode: ExecutiveConversationMode
): any {
  // Map dependencies strictly read-only
  const extracted = ExecutiveConversationMapper.extractIntelligence(reportWithGovernanceCopilotReasoning);

  // Failsafe execution if reasoning hasn't passed
  if (!extracted.reasoning) {
    return {
      ...reportWithGovernanceCopilotReasoning
    };
  }

  const input: ExecutiveConversationInput = {
    question,
    mode,
    governanceCopilotContext: extracted.context,
    governanceCopilotReasoning: extracted.reasoning
  };

  const executiveConversation = ExecutiveConversationEngine.buildExecutiveConversation(input);

  // Spread strictly without mutating previous intelligence layers
  return {
    ...reportWithGovernanceCopilotReasoning,
    ...(executiveConversation && { executiveConversation })
  };
}
