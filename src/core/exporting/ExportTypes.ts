export interface ExportSnapshotMetadata {
  exportId: string;
  timestamp: string;
  tenantId: string;
  runtimeExecutionId: string;
  calibrationProfile: string;
  confidenceSnapshot: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE';
  lineageHash: string;
  reportVersion: string;
  generatedBy: string;
}
