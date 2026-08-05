export type ExecutiveSnapshotStatus = 'GENERATING' | 'READY' | 'FAILED' | 'STALE';

export interface ExecutiveSnapshotMetadata {
  id: string; // Unique identifier for this snapshot instance
  tenantId: string;
  periodId: string; // e.g., '2026-08'
  generatedAt: string; // ISO String
  generatedBy: string; // e.g., 'system:cfo-pipeline', 'user:admin'
  lastUpdatedAt: string; // ISO String
  dataQuality: 'high' | 'medium' | 'low';
  confidenceScore: number; // 0-100
  version: string; // e.g., 'v1'
  schemaVersion: string;
  engineVersion: string;
  providerVersion: string;
  sourceVersion: string;
  pipelineVersion: string;
  calibrationVersion: string;
  validationVersion: string;
  snapshotHash: string;
  processingTime: number; // in milliseconds
  tenantSchemaVersion: string;
  source: string; // e.g., 'financial-engine-v2', 'erp-sync'
  status: ExecutiveSnapshotStatus;
}

/**
 * Base interface for all executive domain data returned to surfaces.
 * Enforces that all intelligence is traceable and auditable.
 */
export interface ExecutiveDataPayload {
  metadata: ExecutiveSnapshotMetadata;
}
