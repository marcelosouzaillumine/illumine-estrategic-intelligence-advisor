// src/lib/executive-conversation-engine.ts

import type { ExecutiveConversationInput, ExecutiveConversationResult } from './executive-conversation-types';
import { ExecutiveAudienceAdaptationEngine } from './executive-audience-adaptation-engine';
import { ExecutiveConfidenceDisclosureEngine } from './executive-confidence-disclosure-engine';

export class ExecutiveConversationEngine {
  /**
   * Deterministically builds the final structured communication payload for the Executive Copilot.
   */
  static buildExecutiveConversation(
    input: ExecutiveConversationInput
  ): ExecutiveConversationResult {
    if (!input.governanceCopilotReasoning) {
      throw new Error("ECL Error: Governance Copilot Reasoning must be present before conversation generation.");
    }

    const reasoning = input.governanceCopilotReasoning;
    const mode = input.mode;
    
    // 1. Audience Adaptation (Language Translation)
    const keyFindings = ExecutiveAudienceAdaptationEngine.adaptFindings(reasoning, mode);
    
    // 2. Traceability (Transparency)
    const traceability = ExecutiveConfidenceDisclosureEngine.generateTraceability(reasoning);

    // 3. Construct Deterministic Summary
    const summaryHeader = `Executive Response structured for ${mode} audience.`;
    const summaryBody = traceability.confidenceLevel === 'LOW' 
      ? `Due to LOW institutional confidence, definitive strategic recommendations cannot be generated.`
      : `Based on deterministic institutional reasoning, ${traceability.evidenceCount} evidence points support the following findings.`;
      
    const executiveSummary = `${summaryHeader} ${summaryBody}`;

    // 4. Next Suggested Topics (based on reasoning context)
    const nextSuggestedTopics: string[] = [];
    if (reasoning.identifiedConflicts.length > 0) {
      nextSuggestedTopics.push("Review Institutional Conflicts");
    }
    if (reasoning.supportingMemories.length > 0) {
      nextSuggestedTopics.push("Review Historical Precedents");
    }
    
    return {
      mode,
      questionId: input.question.questionId,
      response: {
        executiveSummary,
        keyFindings,
        nextSuggestedTopics
      },
      traceability
    };
  }
}
