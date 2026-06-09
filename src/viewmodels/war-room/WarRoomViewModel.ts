import { ScenarioReference } from '../../types/war-room/ScenarioReference';
import { ScenarioImpactReference } from '../../types/war-room/ScenarioImpactReference';

export interface UIWarRoomScenario {
  id: string;
  name: string;
  confidenceLevel: string;
  category: string;
  date: string;
}

export interface UIWarRoomImpact {
  id: string;
  description: string;
  severity: string;
  type: string;
}

/**
 * Adaptador visual Fail-Closed. 
 * ZERO agregação matemática ou derivação de KPIs lógicos aqui.
 */
export class WarRoomViewModel {
  static mapScenarios(scenarios: ScenarioReference[]): UIWarRoomScenario[] {
    return scenarios.map(s => ({
      id: s.objectId,
      name: s.title,
      confidenceLevel: s.confidenceLevel,
      category: s.category,
      date: new Date(s.createdAt).toLocaleDateString('pt-BR')
    }));
  }

  static mapImpacts(impacts: ScenarioImpactReference[]): UIWarRoomImpact[] {
    return impacts.map(i => ({
      id: i.impactId,
      description: i.description,
      severity: i.severity,
      type: i.relationshipType
    }));
  }
}
