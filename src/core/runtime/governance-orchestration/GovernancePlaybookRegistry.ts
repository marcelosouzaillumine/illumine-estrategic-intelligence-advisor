import { GovernancePlaybook } from './GovernanceOrchestrationTypes';

export class GovernancePlaybookRegistry {
  private static playbooks: GovernancePlaybook[] = [
    {
      playbookId: 'PB-LIQUIDITY-CRISIS-01',
      name: 'Liquidity Crisis Playbook',
      description: 'Orquestração de resposta emergencial para asfixia de caixa e colapso de capital de giro.',
      tenantScope: 'GLOBAL', // No MVP, acessível a todos via mock
      activationThresholds: ['LIQUIDITY_DROP_>_30%', 'COVENANT_BREACH_RISK_HIGH'],
      escalationRules: ['BOARD_EMERGENCY_MEETING', 'CFO_IMMEDIATE_ACTION'],
      supervisionRequirement: 'BOARD_ONLY'
    },
    {
      playbookId: 'PB-STRATEGIC-DIVESTMENT-02',
      name: 'Strategic Divestment Playbook',
      description: 'Orquestração estruturada para alienação de ativos core.',
      tenantScope: 'GLOBAL',
      activationThresholds: ['STRATEGIC_SIMULATION_DIVESTMENT'],
      escalationRules: ['BOARD_APPROVAL_REQUIRED'],
      supervisionRequirement: 'BOARD_ONLY'
    }
  ];

  static getPlaybook(playbookId: string): GovernancePlaybook | undefined {
    return this.playbooks.find(p => p.playbookId === playbookId);
  }

  static getAll(): GovernancePlaybook[] {
    return this.playbooks;
  }
}
