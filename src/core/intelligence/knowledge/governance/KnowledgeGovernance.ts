import { ExecutiveKnowledge } from '../contracts/ExecutiveKnowledge';

export interface GovernanceValidationResult {
  approved: boolean;
  reasons?: string[];
  error?: string;
}

export class KnowledgeGovernance {
  
  validate(knowledge: ExecutiveKnowledge): GovernanceValidationResult {
    const reasons: string[] = [];

    if (!knowledge.metadata || !knowledge.metadata.source) {
      reasons.push('Knowledge must declare a source.');
    }

    if (!knowledge.metadata || !knowledge.metadata.version) {
      reasons.push('Knowledge must declare a version.');
    }

    if (!knowledge.ontologyReferences || knowledge.ontologyReferences.length === 0) {
      reasons.push('Knowledge must be associated with at least one Ontology Concept.');
    }

    // Experimental knowledge might require strict approval
    if (knowledge.maturity === 'EXPERIMENTAL' && knowledge.confidence > 0.8) {
      reasons.push('EXPERIMENTAL knowledge cannot have confidence > 0.8.');
    }

    if (reasons.length > 0) {
      return {
        approved: false,
        error: 'Knowledge Governance Validation Failed',
        reasons
      };
    }

    return { approved: true };
  }
}
