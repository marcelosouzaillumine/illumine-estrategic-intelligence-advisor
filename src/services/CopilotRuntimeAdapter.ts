import { runGovernanceCopilotAdapter } from '../core/runtime/governance-copilot/governance-copilot-adapter';
import { runGovernanceCopilotReasoningAdapter } from '../core/runtime/governance-copilot/governance-copilot-reasoning-adapter';
import { runExecutiveConversationAdapter } from '../core/runtime/governance-copilot/executive-conversation-adapter';

export const CopilotRuntimeAdapter = {
  runGovernanceCopilotAdapter,
  runGovernanceCopilotReasoningAdapter,
  runExecutiveConversationAdapter
};
