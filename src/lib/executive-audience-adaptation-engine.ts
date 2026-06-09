// src/lib/executive-audience-adaptation-engine.ts

import type { ExecutiveConversationMode } from './executive-conversation-types';
import { ExecutiveConversationTemplateRegistry } from './executive-conversation-template-registry';
import type { GovernanceCopilotReasoningResult } from './governance-copilot-reasoning-types';

export class ExecutiveAudienceAdaptationEngine {
  /**
   * Adapts finding terminology to the target audience without mutating the underlying meaning or evidence.
   */
  static adaptFindings(
    reasoning: GovernanceCopilotReasoningResult,
    mode: ExecutiveConversationMode
  ): string[] {
    const findings: string[] = [];

    // Adapt based on reasoning classification
    if (reasoning.reasoningClassification === 'INSUFFICIENT_CONTEXT') {
      const fallback = ExecutiveConversationTemplateRegistry.getFallbackTemplate(mode);
      findings.push(fallback.templateStrings.insufficientContext);
      return findings;
    }

    if (reasoning.reasoningClassification === 'CONFLICTING_CONTEXT' && reasoning.identifiedConflicts.length > 0) {
      const topic = reasoning.relevantTopics[0] || 'GENERAL';
      const template = ExecutiveConversationTemplateRegistry.getTemplate(mode, topic) || ExecutiveConversationTemplateRegistry.getFallbackTemplate(mode);
      findings.push(template.templateStrings.conflictObserved);

      // Append specific deterministic conflicts mapped to the audience
      for (const conflict of reasoning.identifiedConflicts) {
        if (mode === 'BOARD') {
          findings.push(`Oversight Flag: ${conflict.description}`);
        } else if (mode === 'CEO') {
          findings.push(`Execution Constraint: ${conflict.description}`);
        } else {
          findings.push(`Diagnostic Finding: ${conflict.description}`);
        }
      }
    } else {
      // FULL_CONTEXT or PARTIAL_CONTEXT without strict conflicts
      const topic = reasoning.relevantTopics[0] || 'GENERAL';
      const template = ExecutiveConversationTemplateRegistry.getTemplate(mode, topic) || ExecutiveConversationTemplateRegistry.getFallbackTemplate(mode);
      findings.push(template.templateStrings.standardFinding);

      // Add deterministic evidence traces
      for (const evidence of reasoning.supportingEvidence) {
        if (mode === 'BOARD') {
          findings.push(`Institutional Evidence (${evidence.evidenceType}): ${evidence.description}`);
        } else if (mode === 'CEO') {
          findings.push(`Operational Evidence (${evidence.evidenceType}): ${evidence.description}`);
        } else {
          findings.push(`Validated Evidence (${evidence.evidenceType}): ${evidence.description}`);
        }
      }
    }

    return findings;
  }
}
