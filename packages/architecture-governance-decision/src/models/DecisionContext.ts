export interface DecisionContext {
  readonly id: string;
  readonly contextVersion: string;
  readonly contextHash: string;
  readonly certificationSnapshotId: string;
  readonly advisorySnapshotId: string;
  readonly riskSnapshotId: string;
  readonly evolutionSnapshotId: string;
  readonly intelligenceSnapshotId: string;
  readonly createdAt: string;
}
