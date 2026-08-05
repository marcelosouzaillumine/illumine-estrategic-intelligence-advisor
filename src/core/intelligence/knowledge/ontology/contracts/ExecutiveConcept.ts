import { OntologyRelationship } from './OntologyRelationship';

export type ExecutiveDomain = 
  | 'UNIVERSAL'
  | 'FINANCIAL'
  | 'COMMERCIAL'
  | 'PEOPLE'
  | 'OPERATIONS'
  | 'STRATEGY'
  | 'GOVERNANCE'
  | 'RISK'
  | 'INNOVATION'
  | 'MISSION';

export type ConceptType = 
  | 'METRIC'
  | 'CONCEPT'
  | 'DIMENSION'
  | 'FACTOR'
  | 'EVENT'
  | 'DECISION';

export interface ConceptAttributes {
  unit?: string;       // e.g., 'currency', 'ratio', 'percentage', 'count'
  frequency?: string;  // e.g., 'monthly', 'annual', 'realtime'
  direction?: 'HIGHER_IS_BETTER' | 'LOWER_IS_BETTER' | 'NEUTRAL';
  criticality?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ConceptMetadata {
  version: string;
  confidence: number;
  maturity: 'EXPERIMENTAL' | 'BETA' | 'PRODUCTION';
}

export interface ExecutiveConcept {
  id: string; // e.g., 'financial.liquidity.current_ratio'
  name: string;
  type: ConceptType;
  domain: ExecutiveDomain;
  description: string;
  semanticRole: string; // Describes the role this concept plays (e.g., 'Short term liquidity capacity')
  synonyms: string[];
  relationships: OntologyRelationship[];
  attributes: ConceptAttributes;
  metadata: ConceptMetadata;
}
