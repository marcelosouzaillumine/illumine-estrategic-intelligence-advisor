import { WarRoomRepository } from './WarRoomRepository';
import { ScenarioReference } from '../../types/war-room/ScenarioReference';
import { ScenarioImpactReference } from '../../types/war-room/ScenarioImpactReference';

/**
 * Runtime Observacional do War Room.
 * ZERO execução de engines fiduciárias. ZERO simulação em tempo real.
 * Atua apenas consolidando e entregando impactos já processados.
 */
export class WarRoomRuntime {
  constructor(private readonly repository: WarRoomRepository) {}

  async loadScenarioContext(tenantId: string, organizationId: string, scenarioId?: string): Promise<{
    availableScenarios: ScenarioReference[];
    activeScenario: ScenarioReference | null;
    impacts: ScenarioImpactReference[];
    evidences: string[];
  }> {
    const availableScenarios = await this.repository.loadScenarioHistory(tenantId, organizationId);
    
    if (!scenarioId) {
      return { availableScenarios, activeScenario: null, impacts: [], evidences: [] };
    }

    const activeScenario = await this.repository.loadScenario(tenantId, scenarioId);
    const impacts = await this.repository.loadScenarioImpacts(tenantId, scenarioId);
    const evidences = await this.repository.loadScenarioEvidence(tenantId, scenarioId);

    return { availableScenarios, activeScenario, impacts, evidences };
  }
}
