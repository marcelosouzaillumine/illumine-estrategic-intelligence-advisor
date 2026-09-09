// src/lib/governance-copilot-routing-engine.ts

import type { GovernanceCopilotQuestion } from './governance-copilot-reasoning-types';
import type { GovernanceCopilotTopic } from './governance-copilot-types';

export class GovernanceCopilotRoutingEngine {
  /**
   * Deterministic lexical mapping of questions to relevant institutional topics.
   * This is a read-only router without LLM interference.
   */
  static routeQuestionToTopics(question: GovernanceCopilotQuestion): GovernanceCopilotTopic[] {
    const text = question.text.toLowerCase();
    const topics = new Set<GovernanceCopilotTopic>();

    if (text.includes('risk') || text.includes('risco') || text.includes('threat') || text.includes('ameaça')) {
      topics.add('RISKS');
      topics.add('GOVERNANCE');
      topics.add('EXECUTION');
    }

    if (text.includes('valuation') || text.includes('valoração') || text.includes('value') || text.includes('valor')) {
      topics.add('VALUATION');
      topics.add('CAPITAL_ALLOCATION');
      topics.add('GOVERNANCE');
    }

    if (text.includes('pattern') || text.includes('padrão') || text.includes('repet') || text.includes('históric')) {
      topics.add('OUTCOMES');
      topics.add('EXECUTION');
    }

    if (text.includes('esg') || text.includes('sustainability') || text.includes('sustentabilidade')) {
      topics.add('ESG');
      topics.add('GOVERNANCE');
    }

    if (text.includes('priorit') || text.includes('prioridade') || text.includes('foco')) {
      topics.add('PRIORITIES');
      topics.add('SOVEREIGNTY');
    }

    // Default topics if no specific heuristic matches
    if (topics.size === 0) {
      topics.add('GOVERNANCE');
      topics.add('SOVEREIGNTY');
    }

    return Array.from(topics);
  }

  static getRequiredSourcesForTopics(topics: GovernanceCopilotTopic[]): string[] {
    const sources = new Set<string>();

    if (topics.includes('RISKS')) {
      sources.add('executiveSovereignty');
      sources.add('governanceGovernanceNetwork');
    }
    if (topics.includes('VALUATION')) {
      sources.add('valuationGovernance');
    }
    if (topics.includes('CAPITAL_ALLOCATION')) {
      sources.add('capitalAllocationGovernance');
    }
    if (topics.includes('ESG')) {
      sources.add('esgGovernance');
    }
    if (topics.includes('EXECUTION')) {
      sources.add('governanceDigitalTwin');
    }
    if (topics.includes('OUTCOMES')) {
      sources.add('institutionalOutcomes');
    }
    if (topics.includes('SOVEREIGNTY') || topics.includes('PRIORITIES')) {
      sources.add('executiveSovereignty');
    }
    
    // Always consider context and memory fundamental
    sources.add('governanceCopilotContext');
    sources.add('governanceMemory');

    return Array.from(sources);
  }
}
