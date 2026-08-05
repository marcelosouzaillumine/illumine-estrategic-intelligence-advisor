import { IProposalReadProvider } from '../IProposalReadProvider';
export class MockProposalReadProvider implements IProposalReadProvider {
  async getProposalData(leadId: string) { return {}; }
}