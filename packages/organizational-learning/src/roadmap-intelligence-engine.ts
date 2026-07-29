export interface PriorityItem {
  featureId: string;
  category: 'HIGH_VALUE_RECOMMENDED' | 'REMOVAL_CANDIDATE';
  dataJustification: string;
}

export class RoadmapIntelligenceEngine {
  public static generatePriorities(): PriorityItem[] {
    return [
      {
        featureId: 'Executive Narrative Enhancements',
        category: 'HIGH_VALUE_RECOMMENDED',
        dataJustification: 'Uso de 84% e alto retorno semanal dos executivos'
      }
    ];
  }
}
