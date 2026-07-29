export interface AgentActionMapping {
  readonly agentId: string;
  readonly domainName: string;
  readonly supportedActions: string[];
}

export class ExecutiveAgentActionRegistry {
  private static readonly REGISTRY: Map<string, AgentActionMapping> = new Map([
    [
      'financial-agent',
      {
        agentId: 'cfo-intelligence-agent',
        domainName: 'Financial',
        supportedActions: ['Explicar resultado', 'Encontrar causas', 'Comparar períodos', 'Recomendar ações']
      }
    ],
    [
      'risk-agent',
      {
        agentId: 'financial-risk-agent',
        domainName: 'Risk',
        supportedActions: ['Identificar riscos', 'Avaliar impacto', 'Monitorar tendência']
      }
    ],
    [
      'simulation-agent',
      {
        agentId: 'strategic-simulation-agent',
        domainName: 'Simulation',
        supportedActions: ['Simular cenário', 'Projetar impacto', 'Comparar alternativas']
      }
    ],
    [
      'advisory-council',
      {
        agentId: 'advisory-council-agent',
        domainName: 'Advisory',
        supportedActions: ['Emitir parecer', 'Priorizar decisões', 'Recomendar execução']
      }
    ]
  ]);

  public static getActionsForAgent(agentKey: string): AgentActionMapping | undefined {
    return this.REGISTRY.get(agentKey);
  }

  public static getAllMappings(): AgentActionMapping[] {
    return Array.from(this.REGISTRY.values());
  }
}
