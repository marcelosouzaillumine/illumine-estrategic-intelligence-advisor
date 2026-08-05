import { ExecutiveConcept } from './contracts/ExecutiveConcept';
import { ExecutiveOntologyPackage } from './contracts/OntologyPackage';

export class ExecutiveVocabularyRegistry {
  private concepts: Map<string, ExecutiveConcept> = new Map();
  private packages: Map<string, ExecutiveOntologyPackage> = new Map();

  registerPackage(pkg: ExecutiveOntologyPackage): void {
    if (this.packages.has(pkg.id)) {
      throw new Error(`Package ${pkg.id} already registered.`);
    }
    
    this.packages.set(pkg.id, pkg);
    
    for (const concept of pkg.concepts) {
      if (this.concepts.has(concept.id)) {
        throw new Error(`Semantic Conflict: Concept ${concept.id} already exists in the registry.`);
      }
      this.concepts.set(concept.id, concept);
    }
  }

  findConcept(id: string): ExecutiveConcept | undefined {
    return this.concepts.get(id);
  }

  searchByTerm(term: string): ExecutiveConcept[] {
    const termLower = term.toLowerCase();
    const results: ExecutiveConcept[] = [];
    
    for (const concept of this.concepts.values()) {
      if (concept.name.toLowerCase().includes(termLower) || 
          concept.synonyms.some(s => s.toLowerCase().includes(termLower))) {
        results.push(concept);
      }
    }
    return results;
  }

  findRelatedConcepts(id: string): ExecutiveConcept[] {
    const concept = this.findConcept(id);
    if (!concept) return [];

    const relatedIds = concept.relationships.map(r => r.targetConceptId);
    return relatedIds.map(rid => this.concepts.get(rid)).filter((c): c is ExecutiveConcept => c !== undefined);
  }

  validateConcept(id: string): boolean {
    return this.concepts.has(id);
  }
}
