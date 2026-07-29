export interface IndustryAgentAnalysis {
  agentName: string;
  industry: 'HEALTHCARE' | 'FAMILY_BUSINESS' | 'INDUSTRIAL' | 'SERVICES';
  recommendation: string;
  confidenceScore: number;
  mustAutoMergeForbidden: true;
}

export class HealthcareAdvisorAgent {
  public static analyze(): IndustryAgentAnalysis {
    return {
      agentName: 'Healthcare Advisor Agent',
      industry: 'HEALTHCARE',
      recommendation: 'Reduzir taxa de glosa em 0.8% renegociando critérios de auditoria com operadoras.',
      confidenceScore: 0.96,
      mustAutoMergeForbidden: true
    };
  }
}

export class FamilyGovernanceAdvisorAgent {
  public static analyze(): IndustryAgentAnalysis {
    return {
      agentName: 'Family Governance Advisor Agent',
      industry: 'FAMILY_BUSINESS',
      recommendation: 'Formalizar conselho de família e constituir protocolo de sucessão até Q4.',
      confidenceScore: 0.98,
      mustAutoMergeForbidden: true
    };
  }
}

export class IndustrialOperationsAdvisorAgent {
  public static analyze(): IndustryAgentAnalysis {
    return {
      agentName: 'Industrial Operations Advisor Agent',
      industry: 'INDUSTRIAL',
      recommendation: 'Elevar OEE para 88% eliminando micro-paradas na linha 2 de montagem.',
      confidenceScore: 0.95,
      mustAutoMergeForbidden: true
    };
  }
}

export class ServicesGrowthAdvisorAgent {
  public static analyze(): IndustryAgentAnalysis {
    return {
      agentName: 'Services Growth Advisor Agent',
      industry: 'SERVICES',
      recommendation: 'Expandir contratos com receita recorrente mensal para atingir meta de 75%.',
      confidenceScore: 0.94,
      mustAutoMergeForbidden: true
    };
  }
}
