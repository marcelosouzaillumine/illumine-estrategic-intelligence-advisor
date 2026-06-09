import { EvidenceRecord, EvidenceLifecycle, EvidenceLineage, EvidenceProvenance } from '../../types/evidence/EvidenceRecord';

export interface EvidenceRepository {
  loadEvidence(tenantId: string, organizationId: string): Promise<EvidenceRecord[]>;
  loadEvidenceHistory(tenantId: string, evidenceId: string): Promise<EvidenceLifecycle | null>;
  loadEvidenceRelationships(tenantId: string, evidenceId: string): Promise<EvidenceLineage | null>;
  loadEvidenceUsage(tenantId: string, evidenceId: string): Promise<EvidenceProvenance | null>;
}

export class MockEvidenceRepository implements EvidenceRepository {
  async loadEvidence(tenantId: string, organizationId: string): Promise<EvidenceRecord[]> { return []; }
  async loadEvidenceHistory(tenantId: string, evidenceId: string): Promise<EvidenceLifecycle | null> { return null; }
  async loadEvidenceRelationships(tenantId: string, evidenceId: string): Promise<EvidenceLineage | null> { return null; }
  async loadEvidenceUsage(tenantId: string, evidenceId: string): Promise<EvidenceProvenance | null> { return null; }
}
