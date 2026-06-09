import { TwinRepository } from './TwinRepository';
import { InstitutionalDigitalTwin } from '../../types/digital-twin/InstitutionalDigitalTwin';
import { TwinDomain } from '../../types/digital-twin/TwinDomain';
import { TwinRelationship } from '../../types/digital-twin/TwinRelationship';

/**
 * Orquestrador principal do Digital Twin.
 * 
 * Regra Ouro: Zero Reexecução. Zero IA.
 * Apenas consolida as representações de estado e topologia persistidas pelo Repository.
 */
export class InstitutionalDigitalTwinRuntime {
  constructor(private readonly repository: TwinRepository) {}

  async loadInstitutionalTwin(tenantId: string): Promise<{
    twin: InstitutionalDigitalTwin | null;
    domains: TwinDomain[];
    relationships: TwinRelationship[];
  }> {
    const twin = await this.repository.loadTwin(tenantId);
    if (!twin) {
      return { twin: null, domains: [], relationships: [] };
    }

    const domains = await this.repository.loadDomains(tenantId);
    const relationships = await this.repository.loadRelationships(tenantId);

    return { twin, domains, relationships };
  }

  // O runtime age de forma puramente observacional. Se precisar montar relatórios,
  // ou conectar grafos adicionais, o fará através da TwinAssemblyEngine.
}
