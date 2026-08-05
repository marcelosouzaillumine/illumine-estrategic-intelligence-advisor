import { ExecutiveVocabularyRegistry } from './ExecutiveVocabularyRegistry';
import { OntologyGovernance } from './OntologyGovernance';

export interface SemanticResolutionResult {
  conceptId: string;
  name: string;
  semanticType: string;
  domain: string;
  meaning: string;
  relatedConcepts: string[];
  confidence: number;
}

export class SemanticResolverEngine {
  constructor(
    private registry: ExecutiveVocabularyRegistry,
    private governance: OntologyGovernance
  ) {}

  /**
   * Translates a raw technical string into a rich semantic concept definition.
   */
  resolve(rawInput: string): SemanticResolutionResult | null {
    // 1. Basic Normalization
    const normalizedInput = rawInput.trim().toLowerCase().replace(/_/g, ' ');
    
    // 2. Search in Registry (by name or synonym)
    const matches = this.registry.searchByTerm(normalizedInput);
    
    if (matches.length === 0) {
      return null;
    }
    
    // 3. For now, take the best match (first one). In advanced implementations, this could use embeddings or fuzzy matching.
    const bestMatch = matches[0];

    // 4. Governance check: is this concept deprecated?
    const activeConceptId = this.governance.resolveActiveConceptId(bestMatch.id);
    const activeConcept = this.registry.findConcept(activeConceptId);
    
    if (!activeConcept) {
       return null;
    }

    // 5. Gather related concept names for context enrichment
    const relatedNames = this.registry.findRelatedConcepts(activeConcept.id).map(c => c.name);

    return {
      conceptId: activeConcept.id,
      name: activeConcept.name,
      semanticType: activeConcept.type,
      domain: activeConcept.domain,
      meaning: activeConcept.semanticRole, // Using semanticRole as meaning
      relatedConcepts: relatedNames,
      confidence: activeConcept.metadata.confidence
    };
  }
}
