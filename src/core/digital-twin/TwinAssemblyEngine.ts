import { TwinDomain } from '../../types/digital-twin/TwinDomain';
import { InstitutionalDigitalTwin } from '../../types/digital-twin/InstitutionalDigitalTwin';
import { TwinRepository } from './TwinRepository';

export interface AssembledTwinDomain extends TwinDomain {
  // Conexões estendidas resolvidas do Knowledge Graph / Time Machine
  historicalSnapshotsCount: number;
  evidenceBundleCount: number;
  causalRelationshipsCount: number;
}

/**
 * Motor de Montagem do Digital Twin.
 * Combina referências estáticas do Twin Repository com metadados de outros repositórios
 * (como Knowledge Graph ou Timeline) de maneira determinística, SEM GERAÇÃO DE NOVOS DADOS.
 */
export class TwinAssemblyEngine {
  constructor(private readonly repository: TwinRepository) {}

  async assembleDomain(tenantId: string, objectId: string): Promise<AssembledTwinDomain | null> {
    const domains = await this.repository.loadDomains(tenantId);
    const domain = domains.find(d => d.objectId === objectId);
    if (!domain) return null;

    // Em uma implementação real, os counts viriam de queries isoladas aos repositórios.
    // Zero inference: apenas dados brutos.
    return {
      ...domain,
      historicalSnapshotsCount: domain.timelineId ? 1 : 0, 
      evidenceBundleCount: 0,
      causalRelationshipsCount: 0
    };
  }

  async assembleTwinOverview(tenantId: string): Promise<{
    twin: InstitutionalDigitalTwin | null;
    domains: AssembledTwinDomain[];
  }> {
    const twin = await this.repository.loadTwin(tenantId);
    if (!twin) return { twin: null, domains: [] };

    const rawDomains = await this.repository.loadDomains(tenantId);
    const assembled: AssembledTwinDomain[] = rawDomains.map(d => ({
      ...d,
      historicalSnapshotsCount: d.timelineId ? 1 : 0,
      evidenceBundleCount: 0,
      causalRelationshipsCount: 0
    }));

    return { twin, domains: assembled };
  }
}
