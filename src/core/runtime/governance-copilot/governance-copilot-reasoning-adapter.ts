// src/core/runtime/governance-copilot/governance-copilot-reasoning-adapter.ts

import type { GovernanceCopilotReasoningReportLike, GovernanceCopilotReasoningInput, GovernanceCopilotQuestion } from '../../../lib/governance-copilot-reasoning-types';
import { GovernanceCopilotReasoningEngine } from '../../../lib/governance-copilot-reasoning-engine';

export function runGovernanceCopilotReasoningAdapter(
  reportWithGovernanceCopilotContext: GovernanceCopilotReasoningReportLike,
  question: GovernanceCopilotQuestion
): any {
  // We extract all intelligence layers and the copilot context as the Reasoning Input.
  const input: GovernanceCopilotReasoningInput = {
    governanceCopilotContext: reportWithGovernanceCopilotContext.governanceCopilotContext,
    governanceMemory: reportWithGovernanceCopilotContext.governanceMemory,
    governanceIntelligenceNetwork: reportWithGovernanceCopilotContext.governanceIntelligence,
    governanceDigitalTwin: reportWithGovernanceCopilotContext.governanceDigitalTwin,
    esgIntelligence: reportWithGovernanceCopilotContext.esgIntelligence,
    valuationIntelligence: reportWithGovernanceCopilotContext.valuationIntelligence,
    benchmarkIntelligence: reportWithGovernanceCopilotContext.benchmarkIntelligence,
    sectorIntelligence: reportWithGovernanceCopilotContext.sectorIntelligence,
    capitalAllocationIntelligence: reportWithGovernanceCopilotContext.capitalAllocationIntelligence,
    executiveSovereignty: reportWithGovernanceCopilotContext.executiveSovereignty,
    institutionalOutcomes: reportWithGovernanceCopilotContext.institutionalOutcomes
  };

  const governanceCopilotReasoning = GovernanceCopilotReasoningEngine.buildGovernanceCopilotReasoning(
    question,
    input
  );

  return {
    ...reportWithGovernanceCopilotContext,
    ...(governanceCopilotReasoning && { governanceCopilotReasoning })
  };
}
