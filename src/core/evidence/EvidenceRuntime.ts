import { EvidenceRepository } from './EvidenceRepository';
import { EvidenceRecord, EvidenceLifecycle, EvidenceLineage, EvidenceProvenance } from '../../types/evidence/EvidenceRecord';

export class EvidenceRuntime {
  constructor(private readonly repository: EvidenceRepository) {}

  async loadEvidence(tenantId: string, organizationId: string): Promise<EvidenceRecord[]> {
    return this.repository.loadEvidence(tenantId, organizationId);
  }

  async loadEvidenceHistory(tenantId: string, evidenceId: string): Promise<EvidenceLifecycle | null> {
    return this.repository.loadEvidenceHistory(tenantId, evidenceId);
  }

  async loadEvidenceRelationships(tenantId: string, evidenceId: string): Promise<EvidenceLineage | null> {
    return this.repository.loadEvidenceRelationships(tenantId, evidenceId);
  }

  async loadEvidenceUsage(tenantId: string, evidenceId: string): Promise<EvidenceProvenance | null> {
    return this.repository.loadEvidenceUsage(tenantId, evidenceId);
  }
}
