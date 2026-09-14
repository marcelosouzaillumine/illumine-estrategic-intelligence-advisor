// src/core/runtime/governance-copilot/governance-copilot-adapter.ts

import { mapReportToGovernanceCopilotContextInput } from '../../../lib/governance-copilot-mapper';
import { GovernanceCopilotContextEngine } from '../../../lib/governance-copilot-context-engine';
import type { GovernanceCopilotReportLike } from '../../../lib/governance-copilot-types';

export function runGovernanceCopilotAdapter(
  reportWithInstitutionalOutcomes: GovernanceCopilotReportLike
): any {
  // 1. Extract and map context input safely
  const governanceCopilotInput = mapReportToGovernanceCopilotContextInput(reportWithInstitutionalOutcomes);

  // 2. Build normalized context
  const governanceCopilotContext = GovernanceCopilotContextEngine.buildContext(governanceCopilotInput);

  // 3. Return the report enriched strictly with context, no mutations
  return {
    ...reportWithInstitutionalOutcomes,
    ...(governanceCopilotContext && { governanceCopilotContext })
  };
}
