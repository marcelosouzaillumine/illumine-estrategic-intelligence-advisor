// src/lib/governance-copilot-context-engine.ts

import type { 
  GovernanceCopilotContextInput, 
  GovernanceCopilotContext,
  GovernanceCopilotEvidence
} from './governance-copilot-types';
import { GovernanceCopilotTopicEngine } from './governance-copilot-topic-engine';

export class GovernanceCopilotContextEngine {
  /**
   * Builds the read-only, normalized context package from the available institutional intelligence.
   * It strictly aggregates existing values without generating new conclusions.
   */
  static buildContext(input: GovernanceCopilotContextInput): GovernanceCopilotContext {
    if (!input || Object.keys(input).length === 0) {
      return {
        availableTopics: [],
        availableEvidence: [],
        availableMemories: [],
        institutionalStrengths: [],
        institutionalConstraints: [],
        institutionalDependencies: [],
        institutionalRisks: [],
        institutionalOpportunities: []
      };
    }

    const availableTopics = GovernanceCopilotTopicEngine.discoverAvailableTopics(input);

    const institutionalStrengths: string[] = [];
    const institutionalConstraints: string[] = [];
    const institutionalDependencies: string[] = [];
    const institutionalRisks: string[] = [];
    const institutionalOpportunities: string[] = [];

    // Extract from Executive Sovereignty if available
    if (input.executiveSovereignty) {
      if (input.executiveSovereignty.sovereigntyStrengths) institutionalStrengths.push(...input.executiveSovereignty.sovereigntyStrengths);
      if (input.executiveSovereignty.sovereigntyConstraints) institutionalConstraints.push(...input.executiveSovereignty.sovereigntyConstraints);
      if (input.executiveSovereignty.sovereigntyDependencies) institutionalDependencies.push(...input.executiveSovereignty.sovereigntyDependencies);
      if (input.executiveSovereignty.sovereigntyRisks) institutionalRisks.push(...input.executiveSovereignty.sovereigntyRisks);
      if (input.executiveSovereignty.sovereigntyOpportunities) institutionalOpportunities.push(...input.executiveSovereignty.sovereigntyOpportunities);
    }

    // Extract from Governance Digital Twin if available (Execution capacity/constraints)
    if (input.governanceDigitalTwin && input.governanceDigitalTwin.executionCapacity) {
      const state = input.governanceDigitalTwin.executionCapacity;
      if (state.classification === 'LOW') {
        institutionalConstraints.push('Digital Twin identifies restricted execution capacity');
      }
    }

    // Extract Evidence from IOD if available
    const availableEvidence: GovernanceCopilotEvidence[] = [];
    if (input.institutionalOutcomes && input.institutionalOutcomes.records) {
      for (const record of input.institutionalOutcomes.records) {
        availableEvidence.push({
          insightId: record.linkedInsightId || record.id,
          evidenceType: record.level,
          description: record.description
        });
      }
    }

    // Extract Memories from GML
    const availableMemories: any[] = [];
    if (input.governanceMemory && input.governanceMemory.events) {
      availableMemories.push(...input.governanceMemory.events);
    }

    return {
      availableTopics,
      availableEvidence,
      availableMemories,
      institutionalStrengths: [...new Set(institutionalStrengths)],
      institutionalConstraints: [...new Set(institutionalConstraints)],
      institutionalDependencies: [...new Set(institutionalDependencies)],
      institutionalRisks: [...new Set(institutionalRisks)],
      institutionalOpportunities: [...new Set(institutionalOpportunities)]
    };
  }
}
