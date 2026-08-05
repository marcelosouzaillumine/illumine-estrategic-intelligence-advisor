import { RepositoryFactory } from '../factory/repository.factory';

export type EnterpriseDataSource = 'FIRESTORE' | 'POSTGRES' | 'MOCK' | 'ERP' | 'DATA_WAREHOUSE';

export class DataSourceRegistry {
  private static activeSource: EnterpriseDataSource = 'FIRESTORE';

  static setActiveDataSource(source: EnterpriseDataSource) {
    this.activeSource = source;
    // For now we map ERP, DATA_WAREHOUSE to MOCK or FIRESTORE at the repository factory level if not implemented
    const mappedSource = source === 'POSTGRES' || source === 'ERP' || source === 'DATA_WAREHOUSE' 
      ? 'FIRESTORE' // fallback
      : source;
      
    RepositoryFactory.setDataSource(mappedSource as any);
  }

  static getActiveDataSource(): EnterpriseDataSource {
    return this.activeSource;
  }
}
