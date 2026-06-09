import { InstitutionalObject } from '../intelligence/InstitutionalObject';

export type InstitutionalArtifactType = 
  | 'DATA_SOURCE'
  | 'EVIDENCE'
  | 'MEMORY'
  | 'POLICY'
  | 'BOARD_DECISION'
  | 'SCENARIO'
  | 'RISK'
  | 'KPI'
  | 'DOCUMENT'
  | 'AUDIT_RECORD';

export type ArtifactStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED' | 'REVOKED';

export interface InstitutionalArtifact extends InstitutionalObject {
  artifactId: string;
  artifactType: InstitutionalArtifactType;
  sourceId: string;
  provenanceString: string;
  status: ArtifactStatus;
  metadata?: Record<string, unknown>;
}
