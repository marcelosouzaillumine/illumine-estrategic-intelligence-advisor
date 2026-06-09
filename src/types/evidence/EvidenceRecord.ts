import { InstitutionalArtifact } from '../data-fabric/InstitutionalArtifact';

export type EvidenceCategory = 'LEGAL' | 'FINANCIAL' | 'OPERATIONAL' | 'COMPLIANCE' | 'STRATEGIC';

export interface EvidenceRecord extends InstitutionalArtifact {
  evidenceCategory: EvidenceCategory;
  validFrom: string;
  validUntil?: string;
  authenticityHash: string;
  factIds: string[]; // Fatos institucionais comprovados por esta evidência
}

export interface EvidenceLifecycle {
  evidenceId: string;
  tenantId: string;
  events: {
    eventType: 'CREATED' | 'VERIFIED' | 'CHALLENGED' | 'REVOKED' | 'ARCHIVED';
    timestamp: string;
    actorId: string;
    reason?: string;
  }[];
}

export interface EvidenceLineage {
  lineageId: string;
  evidenceId: string;
  derivedFromArtifactIds: string[];
  usedInArtifactIds: string[];
}

export interface EvidenceProvenance {
  provenanceId: string;
  evidenceId: string;
  originSystem: string;
  originAuthor: string;
  extractionMethod: 'MANUAL' | 'API' | 'FILE_PARSER' | 'AI_EXTRACTION';
  confidenceScore: number;
}
