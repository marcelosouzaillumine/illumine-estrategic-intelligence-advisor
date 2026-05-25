import { OperationalDependency } from './IOSTypes';

export class OperationalDependencyResolver {
  static resolve(tenantId: string): OperationalDependency[] {
    return [
      {
        dependencyId: 'DEP-1',
        bottleneckNode: 'Aprovação de Pagamentos Extraordinários',
        impactedWorkflows: ['WF-CAP-99', 'WF-SUPPLY-44'],
        criticality: 'HIGH'
      },
      {
        dependencyId: 'DEP-2',
        bottleneckNode: 'Distribuição Região Sul',
        impactedWorkflows: ['WF-LOG-12'],
        criticality: 'MEDIUM'
      }
    ];
  }
}
