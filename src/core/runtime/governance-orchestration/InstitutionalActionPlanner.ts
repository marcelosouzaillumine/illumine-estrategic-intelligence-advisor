import { GovernanceActionPlan } from './GovernanceOrchestrationTypes';

export class InstitutionalActionPlanner {
  static planSequence(recommendationId: string, playbookId: string): GovernanceActionPlan {
    let actions: string[] = [];
    
    if (playbookId === 'PB-LIQUIDITY-CRISIS-01') {
      actions = [
        'D+0: Convocação do Conselho de Administração',
        'D+1: Ativação do Comitê de Crise Financeira',
        'D+3: Assinatura de Waiver Preventivo com Credores',
        'D+15: Aprovação de plano de desinvestimento (se necessário)'
      ];
    }

    return {
      planId: 'PLAN-' + Date.now(),
      recommendationId,
      actions,
      timelineMonths: 1
    };
  }
}
