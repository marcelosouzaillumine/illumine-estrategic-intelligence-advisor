import { ImportedDataset, ImportStatus } from './IntegrationGovernanceTypes';

export class ImportReviewQueue {
  private static queue: ImportedDataset[] = [];

  static enqueue(dataset: ImportedDataset) {
    this.queue.push(dataset);
  }

  static getQueueForTenant(tenantId: string, workspaceId: string): ImportedDataset[] {
    return this.queue.filter(d => d.tenantId === tenantId && d.workspaceId === workspaceId);
  }

  static updateStatus(importId: string, status: ImportStatus) {
    const item = this.queue.find(d => d.importId === importId);
    if (item) {
      item.status = status;
    }
  }

  static clearMockDataForTenant(tenantId: string) {
    this.queue = this.queue.filter(q => q.tenantId !== tenantId);
  }

  static getAll(): ImportedDataset[] {
    return this.queue;
  }
}
