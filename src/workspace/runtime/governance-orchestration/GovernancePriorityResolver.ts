import { InstitutionalPriority } from './GovernanceOrchestrationTypes';

export class GovernancePriorityResolver {
  static resolve(playbookId: string): InstitutionalPriority[] {
    if (playbookId === 'PB-LIQUIDITY-CRISIS-01') {
      return [
        {
          priorityId: 'PRIO-' + Date.now() + '-1',
          domain: 'FINANCE',
          action: 'Securitização imediata de recebíveis.',
          urgency: 'CRITICAL',
          rationale: 'Risco de não pagamento de folha D+5.'
        },
        {
          priorityId: 'PRIO-' + Date.now() + '-2',
          domain: 'OPERATIONS',
          action: 'Corte de 30% em frota não essencial.',
          urgency: 'HIGH',
          rationale: 'Otimização de caixa rápido sem afetar core business.'
        }
      ];
    }
    return [];
  }
}
