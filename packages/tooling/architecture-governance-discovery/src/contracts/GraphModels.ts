export enum ArchitectureArtifactType {
  CAPABILITY = 'CAPABILITY',
  CONTRACT = 'CONTRACT',
  ENGINE = 'ENGINE',
  ORCHESTRATOR = 'ORCHESTRATOR',
  COMPONENT = 'COMPONENT',
  ROUTE = 'ROUTE',
  DATASET = 'DATASET',
  PROMPT = 'PROMPT',
  AGENT = 'AGENT',
  EVENT = 'EVENT',
  TEST = 'TEST',
  CONFIGURATION = 'CONFIGURATION',
  PACKAGE = 'PACKAGE'
}

export enum ArchitectureRelationshipType {
  DEPENDS_ON = 'DEPENDS_ON',
  IMPLEMENTS = 'IMPLEMENTS',
  EXPOSES = 'EXPOSES',
  CONSUMES = 'CONSUMES',
  PRODUCES = 'PRODUCES',
  BELONGS_TO = 'BELONGS_TO',
  TESTS = 'TESTS',
  EXTENDS = 'EXTENDS',
  IMPORTS = 'IMPORTS',
  CONFIGURES = 'CONFIGURES'
}

export interface ArchitectureArtifact {
  id: string;
  type: ArchitectureArtifactType;
  name: string;
  path?: string;
  version?: string;
  owner?: string;
  confidence?: 'HIGH' | 'MEDIUM' | 'LOW';
  discoveredAt?: string;
}

export interface ArchitectureRelationship {
  sourceId: string;
  targetId: string;
  type: ArchitectureRelationshipType;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  discoveryMethod: string;
}

export interface DiscoverySnapshot {
  snapshotId: string;
  timestamp: string;
  artifacts: ArchitectureArtifact[];
  relationships: ArchitectureRelationship[];
  metadata: {
    version: string;
    gitCommit: string;
    generatedAt: string;
    scannerVersion: string;
    schemaVersion: string;
  };
}
