import { GoldenDatasetProfile } from './RealityValidationTypes';
import { RealityValidationAuditLogger } from './RealityValidationAuditLogger';

export class GoldenDatasetIsolationEngine {
  private static activeSandboxes: Map<string, Map<string, GoldenDatasetProfile>> = new Map();

  static loadDataset(tenantId: string, dataset: GoldenDatasetProfile): void {
    if (!this.activeSandboxes.has(tenantId)) {
      this.activeSandboxes.set(tenantId, new Map());
    }
    this.activeSandboxes.get(tenantId)!.set(dataset.datasetId, dataset);
    RealityValidationAuditLogger.logEvent(
      tenantId,
      'GOLDEN_DATASET_LOADED',
      'Dataset [' + dataset.name + '] carregado em sandbox isolado. Produção: INTOCADA.'
    );
  }

  static getDatasets(tenantId: string): GoldenDatasetProfile[] {
    return Array.from(this.activeSandboxes.get(tenantId)?.values() ?? []);
  }

  static clearSandbox(tenantId: string): void {
    this.activeSandboxes.delete(tenantId);
    RealityValidationAuditLogger.clear(tenantId);
  }

  static validateIsolation(tenantId: string, otherTenantId: string): boolean {
    const tenantDatasets = this.activeSandboxes.get(tenantId);
    const otherDatasets = this.activeSandboxes.get(otherTenantId);
    // Cross-tenant leakage check: datasets must be completely separate
    if (!tenantDatasets || !otherDatasets) return true;
    const tenantIds = new Set(tenantDatasets.keys());
    const otherIds = new Set(otherDatasets.keys());
    for (const id of tenantIds) {
      if (otherIds.has(id)) return false;
    }
    return true;
  }
}
