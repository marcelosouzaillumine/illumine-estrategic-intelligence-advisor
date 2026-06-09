import { ScenarioReference } from '../../types/war-room/ScenarioReference';
import { ScenarioImpactReference } from '../../types/war-room/ScenarioImpactReference';

/**
 * Repositório Observacional do War Room.
 * Apenas leitura (Read-Only). 
 * Recupera cenários pre-calculados, impactos e evidências.
 */
export interface WarRoomRepository {
  loadScenario(tenantId: string, scenarioId: string): Promise<ScenarioReference | null>;
  loadScenarioHistory(tenantId: string, organizationId: string): Promise<ScenarioReference[]>;
  loadScenarioImpacts(tenantId: string, scenarioId: string): Promise<ScenarioImpactReference[]>;
  loadScenarioEvidence(tenantId: string, scenarioId: string): Promise<string[]>; // IDs das evidências
}

// Em uma implementação real, criariamos FirestoreWarRoomRepository.
// Aqui usamos um In-Memory Mock para fins de demonstração da camada fiduciária sem state persistido externo.
export class MockWarRoomRepository implements WarRoomRepository {
  async loadScenario(tenantId: string, scenarioId: string): Promise<ScenarioReference | null> {
    return null;
  }

  async loadScenarioHistory(tenantId: string, organizationId: string): Promise<ScenarioReference[]> {
    return [];
  }

  async loadScenarioImpacts(tenantId: string, scenarioId: string): Promise<ScenarioImpactReference[]> {
    return [];
  }

  async loadScenarioEvidence(tenantId: string, scenarioId: string): Promise<string[]> {
    return [];
  }
}
