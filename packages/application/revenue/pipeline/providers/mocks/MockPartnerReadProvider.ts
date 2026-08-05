import { IPartnerReadProvider } from '../IPartnerReadProvider';
export class MockPartnerReadProvider implements IPartnerReadProvider {
  async getPartnerData(leadId: string) { return {}; }
}