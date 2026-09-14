import { runGovernanceCopilotAdapter } from '../../../runtime/governance-copilot/governance-copilot-adapter';
import { runGovernanceCopilotReasoningAdapter } from '../../../runtime/governance-copilot/governance-copilot-reasoning-adapter';
import { runExecutiveConversationAdapter } from '../../../runtime/governance-copilot/executive-conversation-adapter';

export const CopilotRuntimeAdapter = {
  runGovernanceCopilotAdapter,
  runGovernanceCopilotReasoningAdapter,
  runExecutiveConversationAdapter
};
