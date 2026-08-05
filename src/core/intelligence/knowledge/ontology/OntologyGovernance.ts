import { ExecutiveConcept } from './contracts/ExecutiveConcept';

export interface SemanticConflict {
  conceptId: string;
  issue: string;
}

export class OntologyGovernance {
  private deprecatedConcepts: Map<string, string> = new Map(); // Old ID -> New Replacement ID

  /**
   * Registers a concept as deprecated and points to the new replacement concept.
   */
  deprecateConcept(oldConceptId: string, replacementConceptId: string): void {
    this.deprecatedConcepts.set(oldConceptId, replacementConceptId);
  }

  /**
   * Resolves an ID to its active replacement if deprecated, otherwise returns the original ID.
   */
  resolveActiveConceptId(conceptId: string): string {
    let currentId = conceptId;
    let iterations = 0;
    
    // Follow the deprecation chain
    while (this.deprecatedConcepts.has(currentId)) {
      if (iterations > 10) {
        throw new Error(`Circular deprecation loop detected for concept: ${conceptId}`);
      }
      currentId = this.deprecatedConcepts.get(currentId)!;
      iterations++;
    }

    return currentId;
  }

  /**
   * Validates a concept for architectural integrity before it can be registered.
   */
  validateConceptIntegrity(concept: ExecutiveConcept): SemanticConflict[] {
    const conflicts: SemanticConflict[] = [];

    if (!concept.name || concept.name.trim() === '') {
      conflicts.push({ conceptId: concept.id, issue: 'Concept name cannot be empty.' });
    }

    if (!concept.semanticRole || concept.semanticRole.trim() === '') {
      conflicts.push({ conceptId: concept.id, issue: 'Concept must define a semanticRole.' });
    }

    // Checking for self-referential relationships
    if (concept.relationships && concept.relationships.some(r => r.targetConceptId === concept.id)) {
      conflicts.push({ conceptId: concept.id, issue: 'Concept cannot have a relationship pointing to itself.' });
    }

    return conflicts;
  }
}
