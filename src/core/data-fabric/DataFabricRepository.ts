import { InstitutionalDataSource } from '../../types/data-fabric/InstitutionalDataSource';
import { DataLineage } from '../../types/data-fabric/DataLineage';
import { InstitutionalArtifact } from '../../types/data-fabric/InstitutionalArtifact';

export interface DataFabricRepository {
  loadSources(tenantId: string, organizationId: string): Promise<InstitutionalDataSource[]>;
  loadLineage(tenantId: string, artifactId: string): Promise<DataLineage[]>;
  loadArtifacts(tenantId: string, organizationId: string): Promise<InstitutionalArtifact[]>;
  loadDependencies(tenantId: string, artifactId: string): Promise<InstitutionalArtifact[]>;
}

export class MockDataFabricRepository implements DataFabricRepository {
  async loadSources(tenantId: string, organizationId: string): Promise<InstitutionalDataSource[]> {
    return [];
  }
  async loadLineage(tenantId: string, artifactId: string): Promise<DataLineage[]> {
    return [];
  }
  async loadArtifacts(tenantId: string, organizationId: string): Promise<InstitutionalArtifact[]> {
    return [];
  }
  async loadDependencies(tenantId: string, artifactId: string): Promise<InstitutionalArtifact[]> {
    return [];
  }
}
