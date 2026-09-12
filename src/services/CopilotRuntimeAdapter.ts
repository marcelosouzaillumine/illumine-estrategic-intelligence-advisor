import { runGovernanceCopilotAdapter } from '../capabilities/runtime/governance-copilot/governance-copilot-adapter';
import { runGovernanceCopilotReasoningAdapter } from '../capabilities/runtime/governance-copilot/governance-copilot-reasoning-adapter';
import { runExecutiveConversationAdapter } from '../capabilities/runtime/governance-copilot/executive-conversation-adapter';

export const CopilotRuntimeAdapter = {
  runGovernanceCopilotAdapter,
  runGovernanceCopilotReasoningAdapter,
  runExecutiveConversationAdapter
};
