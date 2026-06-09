import { InstitutionalDigitalTwin } from '../../types/digital-twin/InstitutionalDigitalTwin';
import { TwinDomain } from '../../types/digital-twin/TwinDomain';
import { TwinRelationship } from '../../types/digital-twin/TwinRelationship';

export interface TwinRepository {
  loadTwin(tenantId: string): Promise<InstitutionalDigitalTwin | null>;
  saveTwin(twin: InstitutionalDigitalTwin): Promise<void>;
  
  loadDomains(tenantId: string): Promise<TwinDomain[]>;
  saveDomains(tenantId: string, domains: TwinDomain[]): Promise<void>;
  
  loadRelationships(tenantId: string): Promise<TwinRelationship[]>;
  saveRelationships(tenantId: string, relationships: TwinRelationship[]): Promise<void>;
}
