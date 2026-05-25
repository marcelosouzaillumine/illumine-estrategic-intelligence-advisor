import { RiskMitigationPlan } from './types';

export class RiskMitigationRegistry {
  private mitigations: Map<string, RiskMitigationPlan> = new Map();

  /**
   * Registra um novo plano de mitigação para um risco.
   */
  public registerMitigation(plan: RiskMitigationPlan): void {
    if (!plan.planId) {
      throw new Error('Plano de mitigação requer um planId válido.');
    }
    this.mitigations.set(plan.planId, plan);
  }

  /**
   * Obtém os detalhes de um plano de mitigação pelo ID.
   */
  public getMitigation(planId: string): RiskMitigationPlan | undefined {
    return this.mitigations.get(planId);
  }

  /**
   * Atualiza o status de um plano de mitigação.
   */
  public updateStatus(planId: string, status: RiskMitigationPlan['status']): void {
    const plan = this.mitigations.get(planId);
    if (!plan) {
      throw new Error(`Plano de mitigação ${planId} não encontrado.`);
    }
    plan.status = status;
    this.mitigations.set(planId, plan);
  }

  /**
   * Retorna todos os planos de mitigação que estão atrasados.
   */
  public getDelayedMitigations(): RiskMitigationPlan[] {
    const today = new Date();
    return Array.from(this.mitigations.values()).filter(plan => {
      if (plan.status === 'Concluído') return false;
      const dueDate = new Date(plan.dueDate);
      return dueDate < today || plan.status === 'Atrasado';
    });
  }

  /**
   * Avalia a efetividade consolidada (0 a 1) baseada no status das mitigações.
   */
  public calculateEffectiveness(planId: string): number {
    const plan = this.mitigations.get(planId);
    if (!plan) return 0;
    
    switch (plan.status) {
      case 'Concluído': return 1.0;
      case 'Em Execução': return 0.6;
      case 'Planejado': return 0.2;
      case 'Atrasado': return 0.1;
      default: return 0;
    }
  }
}

export const riskMitigationRegistry = new RiskMitigationRegistry();
