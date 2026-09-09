import { ExecutiveProposalContract } from '@illumine/executive-contracts';
import { ExecutiveROIEngine } from './ExecutiveROIEngine';

export class ExecutiveProposalEngine {
  public static generateProposal(companyName: string, annualInvestment: number): ExecutiveProposalContract {
    const roi = ExecutiveROIEngine.calculateROI(companyName, annualInvestment);

    return {
      proposalId: `prop-${Date.now()}`,
      companyName,
      scopeSummary: 'Implantação da Illumine OS™ Executive Governance & Decision Platform (Saas Enterprise).',
      annualInvestmentValue: annualInvestment,
      projectedEbitdaGain: roi.annualSavingsEstimated,
      projectedPaybackMonths: parseFloat((roi.paybackPeriodDays / 30).toFixed(1)),
      generatedAt: new Date().toISOString(),
      status: 'SENT'
    };
  }
}
