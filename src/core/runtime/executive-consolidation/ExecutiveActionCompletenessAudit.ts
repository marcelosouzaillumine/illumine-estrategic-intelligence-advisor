import { ExecutiveRecommendation } from './ExecutiveRecommendationDeduplicationEngine';

export interface ExecutiveActionCompletenessResult {
  title: string;
  executiveTop5: ExecutiveRecommendation[];
  isComplete: boolean;
}

export class ExecutiveActionCompletenessAudit {
  /**
   * Avalia a lista de ações da diretoria.
   * Se a quantidade for inferior a 5, degrada semanticamente o título
   * de "Top 5 Ações da Diretoria" para "Ações Prioritárias da Diretoria".
   */
  public static auditAndFormatTitle(executiveTop5: ExecutiveRecommendation[]): ExecutiveActionCompletenessResult {
    const isComplete = executiveTop5.length >= 5;
    
    return {
      title: isComplete ? 'Top 5 Ações da Diretoria' : 'Ações Prioritárias da Diretoria',
      executiveTop5,
      isComplete
    };
  }
}
