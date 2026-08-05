import { ExecutiveKnowledgeRegistry } from './ExecutiveKnowledgeRegistry';
import { ExecutiveKnowledge } from '../contracts/ExecutiveKnowledge';

export class KnowledgeRetrievalService {
  constructor(private registry: ExecutiveKnowledgeRegistry) {}

  /**
   * Retrieves all relevant knowledge tied to a specific ontology concept.
   */
  retrieveForConcept(ontologyConceptId: string): ExecutiveKnowledge[] {
    return this.registry.findByConcept(ontologyConceptId);
  }
}
