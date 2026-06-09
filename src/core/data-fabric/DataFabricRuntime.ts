import { DataFabricRepository } from './DataFabricRepository';
import { InstitutionalDataSource } from '../../types/data-fabric/InstitutionalDataSource';
import { InstitutionalArtifact } from '../../types/data-fabric/InstitutionalArtifact';
import { DataLineage } from '../../types/data-fabric/DataLineage';

/**
 * Orquestra o acesso consolidado aos artefatos institucionais.
 * Zero cálculos. Zero inferência fiduciária.
 */
export class DataFabricRuntime {
  constructor(private readonly repository: DataFabricRepository) {}

  async loadInstitutionalSources(tenantId: string, organizationId: string): Promise<InstitutionalDataSource[]> {
    return this.repository.loadSources(tenantId, organizationId);
  }

  async loadDomainArtifacts(tenantId: string, organizationId: string): Promise<InstitutionalArtifact[]> {
    return this.repository.loadArtifacts(tenantId, organizationId);
  }

  async loadLineageMap(tenantId: string, artifactId: string): Promise<DataLineage[]> {
    return this.repository.loadLineage(tenantId, artifactId);
  }

  async loadSourceDependencies(tenantId: string, artifactId: string): Promise<InstitutionalArtifact[]> {
    return this.repository.loadDependencies(tenantId, artifactId);
  }
}
