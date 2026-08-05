import { describe, it, expect } from 'vitest';
import { ExecutiveVocabularyRegistry } from '../ExecutiveVocabularyRegistry';
import { OntologyGovernance } from '../OntologyGovernance';
import { ExecutiveOntologyPackage } from '../contracts/OntologyPackage';
import * as coreOntology from '../data/executive-core-ontology.json';

describe('OntologyIntegrity', () => {
  it('should not contain orphaned concepts or invalid relationships in core ontology', () => {
    const registry = new ExecutiveVocabularyRegistry();
    const pkg = coreOntology as any as ExecutiveOntologyPackage;
    
    // Register package - should throw if duplicated IDs exist
    expect(() => registry.registerPackage(pkg)).not.toThrow();

    // Validating all relationships point to valid targets
    for (const concept of pkg.concepts) {
      if (concept.relationships) {
        for (const rel of concept.relationships) {
          const targetExists = registry.findConcept(rel.targetConceptId);
          expect(targetExists, `Relationship ${rel.type} in ${concept.id} points to missing target: ${rel.targetConceptId}`).toBeDefined();
        }
      }
    }
  });

  it('should pass structural governance validation for core ontology', () => {
    const governance = new OntologyGovernance();
    const pkg = coreOntology as any as ExecutiveOntologyPackage;

    for (const concept of pkg.concepts) {
      const conflicts = governance.validateConceptIntegrity(concept);
      expect(conflicts.length, `Concept ${concept.id} has semantic conflicts: ${JSON.stringify(conflicts)}`).toBe(0);
    }
  });
});
