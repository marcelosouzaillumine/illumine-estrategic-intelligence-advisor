// src/lib/governance-copilot-reasoning-engine.ts

import type { GovernanceCopilotQuestion, GovernanceCopilotReasoningInput, GovernanceCopilotReasoningResult } from './governance-copilot-reasoning-types';
import { GovernanceCopilotRoutingEngine } from './governance-copilot-routing-engine';
import { GovernanceCopilotEvidenceEngine } from './governance-copilot-evidence-engine';
import { GovernanceCopilotMemoryEngine } from './governance-copilot-memory-engine';
import { GovernanceCopilotConflictEngine } from './governance-copilot-conflict-engine';
import { GovernanceCopilotConfidenceEngine } from './governance-copilot-confidence-engine';

export class GovernanceCopilotReasoningEngine {
  /**
   * Orchestrates the semantic reasoning evaluation required to answer a question.
   */
  static buildGovernanceCopilotReasoning(
    question: GovernanceCopilotQuestion,
    input: GovernanceCopilotReasoningInput
  ): GovernanceCopilotReasoningResult {
    
    // 1. Routing
    const relevantTopics = GovernanceCopilotRoutingEngine.routeQuestionToTopics(question);
    const requiredSources = GovernanceCopilotRoutingEngine.getRequiredSourcesForTopics(relevantTopics);

    // 2. Resolution
    const supportingEvidence = GovernanceCopilotEvidenceEngine.resolveEvidence(input, relevantTopics);
    const supportingMemories = GovernanceCopilotMemoryEngine.resolveMemories(input, relevantTopics);

    // 3. Conflict Detection
    const identifiedConflicts = GovernanceCopilotConflictEngine.detectConflicts(input);

    // 4. Confidence
    const confidence = GovernanceCopilotConfidenceEngine.evaluateConfidence(
      input,
      supportingEvidence.length,
      supportingMemories.length,
      requiredSources,
      identifiedConflicts.length
    );

    // 5. Reasoning Classification
    let reasoningClassification: GovernanceCopilotReasoningResult['reasoningClassification'] = 'FULL_CONTEXT';
    
    if (identifiedConflicts.length > 0) {
      reasoningClassification = 'CONFLICTING_CONTEXT';
    } else if (confidence.level === 'LOW') {
      reasoningClassification = 'INSUFFICIENT_CONTEXT';
    } else if (confidence.level === 'MODERATE') {
      reasoningClassification = 'PARTIAL_CONTEXT';
    }

    return {
      questionId: question.questionId,
      relevantTopics,
      requiredSources,
      supportingEvidence,
      supportingMemories,
      identifiedConflicts,
      confidence,
      reasoningClassification
    };
  }
}
