import { ProposalStatus } from './ProposalStatus';

export interface Proposal {
  id: string;
  opportunityRef: string;
  accountRef: string;
  templateRef: string;
  status: ProposalStatus;
  currentVersionId: string;
  createdAt: string;
  updatedAt: string;
}
