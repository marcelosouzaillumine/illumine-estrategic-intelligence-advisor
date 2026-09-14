import { InstitutionalArtifact } from '../../../../../types/data-fabric/InstitutionalArtifact';

export type DataSourceCategory = 
  | 'FINANCIAL' 
  | 'ESG' 
  | 'GOVERNANCE' 
  | 'RISK' 
  | 'COMPLIANCE' 
  | 'OPERATIONAL' 
  | 'STRATEGIC';

/**
 * Fonte de Dados Institucional.
 * Representa um documento ou sistema de onde fatos e evidências foram extraídos.
 */
export interface InstitutionalDataSource extends InstitutionalArtifact {
  artifactType: 'DATA_SOURCE';
  name: string;
  category: DataSourceCategory;
  provider: string; // ex: ERP X, Auditoria Y, Sistema Z
  version: string;
  reliabilityScore: number; // 0-100
  lastSyncAt: string;
  schemaHash?: string;
}
