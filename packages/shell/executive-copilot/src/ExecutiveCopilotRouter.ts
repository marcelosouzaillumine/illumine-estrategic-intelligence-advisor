export interface CopilotRouteResult {
  readonly targetAgentId: string;
  readonly domainName: string;
  readonly confidence: number;
}

export class ExecutiveCopilotRouter {
  public static routePrompt(prompt: string, pageContext: string): CopilotRouteResult {
    const p = prompt.toLowerCase();
    const page = pageContext.toLowerCase();

    if (p.includes('risco') || p.includes('perigo') || page.includes('balanco') || page.includes('bp')) {
      return {
        targetAgentId: 'financial-risk-agent',
        domainName: 'Risk',
        confidence: 98
      };
    }

    if (p.includes('simular') || p.includes('cenario') || p.includes('se')) {
      return {
        targetAgentId: 'strategic-simulation-agent',
        domainName: 'Simulation',
        confidence: 97
      };
    }

    if (p.includes('conselho') || p.includes('parecer') || p.includes('decisao')) {
      return {
        targetAgentId: 'advisory-council-agent',
        domainName: 'Advisory',
        confidence: 96
      };
    }

    return {
      targetAgentId: 'cfo-governance-agent',
      domainName: 'Financial',
      confidence: 95
    };
  }
}
