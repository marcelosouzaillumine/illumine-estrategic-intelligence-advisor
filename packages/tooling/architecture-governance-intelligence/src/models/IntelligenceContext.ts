export interface IntelligenceContext {
  readonly discoverySnapshotId: string;
  readonly evaluationSnapshotId: string;
  readonly certificationHistoryId?: string;
  readonly analyzerVersion: string;
  readonly generatedAt: string;
}
