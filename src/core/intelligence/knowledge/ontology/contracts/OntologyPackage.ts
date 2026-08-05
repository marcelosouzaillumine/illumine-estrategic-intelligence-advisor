import { ExecutiveConcept } from './ExecutiveConcept';

export type OntologyLayer = 'UNIVERSAL' | 'DOMAIN' | 'CAPABILITY';

export interface ExecutiveOntologyPackage {
  id: string; // e.g., 'financial-core'
  version: string; // e.g., '1.0.0'
  layer: OntologyLayer;
  domain?: string; // Optional: Only required for DOMAIN or CAPABILITY layers
  capabilityId?: string; // Optional: Only required for CAPABILITY layer
  concepts: ExecutiveConcept[];
  dependencies: string[]; // IDs of other packages this package depends on
}
