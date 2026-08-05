import { describe, it, expect, beforeEach } from 'vitest';
import { ExecutiveVocabularyRegistry } from '../ExecutiveVocabularyRegistry';
import { OntologyGovernance } from '../OntologyGovernance';
import { SemanticResolverEngine } from '../SemanticResolverEngine';
import { ExecutiveOntologyPackage } from '../contracts/OntologyPackage';
import * as coreOntology from '../data/executive-core-ontology.json';

describe('SemanticResolverEngine', () => {
  let registry: ExecutiveVocabularyRegistry;
  let governance: OntologyGovernance;
  let resolver: SemanticResolverEngine;

  beforeEach(() => {
    registry = new ExecutiveVocabularyRegistry();
    governance = new OntologyGovernance();
    registry.registerPackage(coreOntology as any as ExecutiveOntologyPackage);
    resolver = new SemanticResolverEngine(registry, governance);
  });

  it('should translate raw technical inputs to rich semantic concepts', () => {
    const result = resolver.resolve('current_ratio');

    expect(result).toBeDefined();
    expect(result?.conceptId).toBe('financial.liquidity.current_ratio');
    expect(result?.name).toBe('Current Ratio');
    expect(result?.semanticType).toBe('METRIC');
    expect(result?.domain).toBe('FINANCIAL');
    expect(result?.meaning).toBe('Ability to cover short-term obligations');
    expect(result?.confidence).toBe(0.98);
    // Relationships point to "financial.liquidity", so relatedConcepts should include "Liquidity"
    expect(result?.relatedConcepts).toContain('Liquidity');
  });

  it('should return null for unknown concepts', () => {
    const result = resolver.resolve('unknown_metric_xyz');
    expect(result).toBeNull();
  });
});
