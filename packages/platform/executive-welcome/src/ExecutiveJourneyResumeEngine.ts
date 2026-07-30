export interface JourneyResumeItem {
  readonly lastAnalyzedTopic: string;
  readonly recommendedNextAction: string;
}

export class ExecutiveJourneyResumeEngine {
  public static getResumeState(): JourneyResumeItem {
    return {
      lastAnalyzedTopic: 'Capital de Giro & SG&A de TI',
      recommendedNextAction: 'Concluir a chancela do plano de repactuação fiduciária'
    };
  }
}
