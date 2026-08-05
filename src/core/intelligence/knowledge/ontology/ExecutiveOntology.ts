import { ExecutiveVocabularyRegistry } from './ExecutiveVocabularyRegistry';
import { RelationshipType } from './contracts/OntologyRelationship';

export class ExecutiveOntology {
  constructor(private registry: ExecutiveVocabularyRegistry) {}

  /**
   * Evaluates whether a concept has a specific relationship type with a target concept.
   * e.g., isA('Current Ratio', 'Liquidity Indicator') => true
   * (Uses names instead of IDs for semantic querying).
   */
  hasRelationship(sourceName: string, targetName: string, type: RelationshipType): boolean {
    const sourceConcepts = this.registry.searchByTerm(sourceName);
    const targetConcepts = this.registry.searchByTerm(targetName);

    if (sourceConcepts.length === 0 || targetConcepts.length === 0) {
      return false;
    }

    const source = sourceConcepts[0];
    const target = targetConcepts[0];

    return source.relationships.some(
      r => r.type === type && r.targetConceptId === target.id
    );
  }

  isA(sourceName: string, targetName: string): boolean {
    return this.hasRelationship(sourceName, targetName, 'IS_A');
  }

  measures(sourceName: string, targetName: string): boolean {
    return this.hasRelationship(sourceName, targetName, 'MEASURES');
  }

  indicates(sourceName: string, targetName: string): boolean {
    return this.hasRelationship(sourceName, targetName, 'INDICATES');
  }
}
