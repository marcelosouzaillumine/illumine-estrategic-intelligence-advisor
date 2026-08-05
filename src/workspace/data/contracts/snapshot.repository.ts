export interface SnapshotQueryOptions {
  tenantId: string;
  periodId?: string;
  domain?: string;
  limit?: number;
}

export interface SnapshotRepository {
  getSnapshot(id: string): Promise<any | null>;
  saveSnapshot(id: string, snapshot: any): Promise<void>;
  listSnapshots(options: SnapshotQueryOptions): Promise<any[]>;
}
