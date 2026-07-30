import { ExecutiveCRMContract, CRMOpportunityItem } from '@illumine/executive-contracts';

export class ExecutiveLeadEngine {
  public static getActiveCRM(): ExecutiveCRMContract {
    const item1: CRMOpportunityItem = {
      opportunityId: 'opp-01',
      companyName: 'Grupo Industrial Alfa',
      stage: 'PROPOSAL',
      expectedValue: 180000,
      winProbabilityPercent: 85,
      assignedOwner: 'VP Comercial & CEO',
      nextRequiredAction: 'Apresentação de Proposta com ROI Estimado',
      riskLevel: 'LOW'
    };

    const item2: CRMOpportunityItem = {
      opportunityId: 'opp-02',
      companyName: 'Tech Logistics S.A.',
      stage: 'EXECUTIVE_DEMO',
      expectedValue: 240000,
      winProbabilityPercent: 70,
      assignedOwner: 'Diretor de Contas',
      nextRequiredAction: 'Executar Demo em 5 Minutos (EPX v1.0)',
      riskLevel: 'MEDIUM'
    };

    const opportunities = [item1, item2];
    const totalPipelineValue = opportunities.reduce((acc, curr) => acc + curr.expectedValue, 0);
    const weightedPipelineValue = opportunities.reduce((acc, curr) => acc + (curr.expectedValue * curr.winProbabilityPercent) / 100, 0);

    return {
      crmBatchId: `crm-${Date.now()}`,
      opportunities,
      totalPipelineValue,
      weightedPipelineValue,
      generatedAt: new Date().toISOString()
    };
  }
}
