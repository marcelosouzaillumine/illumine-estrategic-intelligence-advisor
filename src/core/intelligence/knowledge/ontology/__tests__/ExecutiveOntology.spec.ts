import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutiveVocabularyRegistry } from '../ExecutiveVocabularyRegistry';
import { ExecutiveOntology } from '../ExecutiveOntology';
import { ExecutiveOntologyPackage } from '../contracts/OntologyPackage';
import * as coreOntology from '../data/executive-core-ontology.json';

describe('ExecutiveOntology', () => {
  let registry: ExecutiveVocabularyRegistry;
  let ontology: ExecutiveOntology;

  beforeEach(() => {
    registry = new ExecutiveVocabularyRegistry();
    // Assuming the json aligns with ExecutiveOntologyPackage structure
    registry.registerPackage(coreOntology as any as ExecutiveOntologyPackage);
    ontology = new ExecutiveOntology(registry);
  });

  it('should correctly evaluate MEASURES relationships', () => {
    const result = ontology.measures('Current Ratio', 'Liquidity');
    expect(result).toBe(true);
  });

  it('should correctly evaluate INDICATES relationships', () => {
    const result = ontology.indicates('Current Ratio', 'Liquidity');
    expect(result).toBe(true);
  });

  it('should return false for incorrect relationships', () => {
    const result = ontology.isA('Current Ratio', 'Liquidity');
    expect(result).toBe(false); // Current Ratio MEASURES Liquidity, but IS_A is not defined in the JSON for it
  });
});
