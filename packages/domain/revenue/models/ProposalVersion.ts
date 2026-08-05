import { ProposalPricingSnapshot } from './ProposalPricingSnapshot';
import { ProposalContentSnapshot } from './ProposalContentSnapshot';
import { ProposalImplementationPlan } from './ProposalImplementationPlan';
import { ProposalLocalization } from './ProposalLocalization';

export interface ProposalVersion {
  id: string;
  proposalId: string;
  versionNumber: number;
  pricingSnapshot: ProposalPricingSnapshot;
  contentSnapshot: ProposalContentSnapshot;
  implementationPlan: ProposalImplementationPlan;
  localization: ProposalLocalization;
  createdBy: string;
  createdAt: string;
}
