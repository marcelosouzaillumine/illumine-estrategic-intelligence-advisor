import { ExecutiveJourneyContract } from '@illumine/executive-contracts';

export class ExecutiveJourneyEngine {
  public static getActiveJourney(companyId: string): ExecutiveJourneyContract {
    return {
      journeyId: `jrn-${companyId}-${Date.now()}`,
      companyId,
      currentStage: 'UNDERSTAND',
      stageProgressPercent: 40.0,
      activeJourneyStepName: 'Demonstração em 5 Minutos & Percepção de Valor',
      nextRequiredAction: 'Revisar Top 3 Prioridades e Aprovar Recomendação'
    };
  }
}
