export interface InstitutionalProvenance {
  provenanceId: string;
  objectId: string;
  origin: string; // Source system, module, or user
  timestamp: string;
  runtimeProducer: string; // Engine or Service that produced the object
  associatedEvidenceId?: string; // Optional link to an EvidenceRecord
  associatedSnapshotId?: string; // Optional link to a TemporalSnapshot
  tenantId: string;
}
