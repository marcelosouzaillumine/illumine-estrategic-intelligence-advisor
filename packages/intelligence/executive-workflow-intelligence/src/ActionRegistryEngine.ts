import { WorkflowRiskLevel } from '@illumine/executive-contracts';

export interface ActionDefinition {
  readonly actionId: string;
  readonly code: string;
  readonly title: string;
  readonly description: string;
  readonly defaultRiskLevel: WorkflowRiskLevel;
}

export class ActionRegistryEngine {
  private static readonly actions: readonly ActionDefinition[] = [
    {
      actionId: 'act-01',
      code: 'REDUCE_OPEX_MARGIN',
      title: 'Redução Graduada de Despesas Operacionais',
      description: 'Plano de corte e otimização de OPEX parametrizado.',
      defaultRiskLevel: 'MEDIUM'
    },
    {
      actionId: 'act-02',
      code: 'RENEGOTIATE_DEBT_TERMS',
      title: 'Renegociação de Passivos e Dívidas',
      description: 'Reestruturação do cronograma de amortização de curto prazo.',
      defaultRiskLevel: 'HIGH'
    },
    {
      actionId: 'act-03',
      code: 'EXECUTE_M_AND_A_ACQUISITION',
      title: 'Aquisição Estratégica M&A',
      description: 'Execução de transação corporativa de M&A.',
      defaultRiskLevel: 'CRITICAL'
    }
  ];

  public static getActionDefinitions(): readonly ActionDefinition[] {
    return this.actions;
  }
}
