import { OperationalProjection } from './IOSTypes';

export class InstitutionalStateProjection {
  static project(tenantId: string): OperationalProjection[] {
    return [
      {
        projectionId: 'PROJ-IOS-1',
        domain: 'FINANCE_OPERATIONS',
        projectedState: 'Estabilização de fluxo via retenção de pagamentos não-core.',
        timeframeMonths: 3
      },
      {
        projectionId: 'PROJ-IOS-2',
        domain: 'SUPPLY_CHAIN',
        projectedState: 'Contenção de estoque causando 15% de ruptura na ponta de vendas.',
        timeframeMonths: 6
      }
    ];
  }
}
