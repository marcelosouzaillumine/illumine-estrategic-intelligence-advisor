// src/lib/governance-copilot-evidence-engine.ts

import type { GovernanceCopilotReasoningInput, GovernanceCopilotEvidenceReference } from './governance-copilot-reasoning-types';
import type { GovernanceCopilotTopic } from './governance-copilot-types';

export class GovernanceCopilotEvidenceEngine {
  /**
   * Resolves supporting evidence based on the required topics and available institutional data.
   */
  static resolveEvidence(
    input: GovernanceCopilotReasoningInput,
    relevantTopics: GovernanceCopilotTopic[]
  ): GovernanceCopilotEvidenceReference[] {
    if (!input) return [];

    const evidence: GovernanceCopilotEvidenceReference[] = [];

    // Extract from IOD
    if (input.institutionalOutcomes && input.institutionalOutcomes.records) {
      for (const record of input.institutionalOutcomes.records) {
        // If question relates to OUTCOMES, EXECUTION or GOVERNANCE, pull E3-E6 levels
        if (relevantTopics.includes('OUTCOMES') || relevantTopics.includes('EXECUTION')) {
          if (['E3', 'E4', 'E5', 'E6'].includes(record.level)) {
            evidence.push({
              evidenceId: record.id,
              evidenceType: record.level,
              sourceLayer: 'IOD',
              description: record.description
            });
          }
        }
      }
    }

    // Extract from Governance Intelligence Network (GIN)
    if (input.governanceIntelligenceNetwork && input.governanceIntelligenceNetwork.governanceFrictions) {
      if (relevantTopics.includes('GOVERNANCE') || relevantTopics.includes('RISKS')) {
        for (const friction of input.governanceIntelligenceNetwork.governanceFrictions) {
          evidence.push({
            evidenceId: `GIN-FRICTION-${Math.random().toString(36).substr(2, 9)}`,
            evidenceType: 'FRICTION_POINT',
            sourceLayer: 'GIN',
            description: friction.topic
          });
        }
      }
    }

    return evidence;
  }
}
