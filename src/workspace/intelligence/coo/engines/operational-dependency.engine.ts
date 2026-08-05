export interface CrossDomainDependency {
  sourceOffice: string;
  targetOffice: string;
  dependencyType: 'blocking' | 'delaying' | 'enhancing';
  description: string;
  impactScore: number; // 0-10
}

export class OperationalDependencyEngine {
  public async computeDependencies(rawData: any): Promise<CrossDomainDependency[]> {
    return rawData.dependencies || [
      {
        sourceOffice: 'coo',
        targetOffice: 'commercial',
        dependencyType: 'blocking',
        description: 'Capacidade produtiva limitando o atingimento de metas comerciais (Falta de estoque para pronta entrega).',
        impactScore: 8.5
      },
      {
        sourceOffice: 'coo',
        targetOffice: 'cfo',
        dependencyType: 'delaying',
        description: 'Ciclo de recebimento de suprimentos atrasando fluxo de pagamentos projetado.',
        impactScore: 6.0
      }
    ];
  }
}
