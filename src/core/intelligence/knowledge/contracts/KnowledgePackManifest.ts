export type PackStatus = 
  | 'ACTIVE'
  | 'DEPRECATED'
  | 'EXPERIMENTAL';

export interface OntologyDependency {
  id: string;
  minimumVersion: string;
}

export interface KnowledgeCoverage {
  concepts: number;
  patterns: number;
  benchmarks: number;
}

export interface KnowledgePackManifest {
  id: string;
  version: string;
  domain: string;
  requiredOntology: OntologyDependency;
  supportedCapabilities: string[]; // e.g., ['balance-sheet']
  coverage: KnowledgeCoverage;
  maturity: string; // e.g., 'VALIDATED', 'CERTIFIED'
  status: PackStatus;
}
