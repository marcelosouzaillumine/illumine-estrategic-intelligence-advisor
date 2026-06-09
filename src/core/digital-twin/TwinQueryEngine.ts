import { TwinRepository } from './TwinRepository';
import { TwinDomain } from '../../types/digital-twin/TwinDomain';
import { TwinRelationship } from '../../types/digital-twin/TwinRelationship';

/**
 * Motor de Consulta Isolado do Digital Twin.
 * Somente consultas a dados persistidos.
 * Nenhuma execução fiduciária. Nenhuma inferência relacional.
 */
export class TwinQueryEngine {
  constructor(private readonly repository: TwinRepository) {}

  async loadDomain(tenantId: string, objectId: string): Promise<TwinDomain | null> {
    // Na vida real, haveria um cache de navegação rápida ou índice Elastic
    const domain = (await this.repository.loadDomains(tenantId)).find(d => d.objectId === objectId);
    return domain || null;
  }

  async loadDomainRelationships(tenantId: string, objectId: string): Promise<TwinRelationship[]> {
    const relationships = await this.repository.loadRelationships(tenantId);
    return relationships.filter(r => r.sourceDomainId === objectId || r.targetDomainId === objectId);
  }

  // Métodos marcados como stub para integração com Time Machine / Evidence Layer
  async loadDomainTimelineId(tenantId: string, domainId: string): Promise<string | null> {
    const domain = await this.loadDomain(tenantId, domainId);
    return domain?.timelineId || null;
  }

  async loadDomainGraphNodeId(tenantId: string, domainId: string): Promise<string | null> {
    const domain = await this.loadDomain(tenantId, domainId);
    return domain?.graphNodeId || null;
  }
}
