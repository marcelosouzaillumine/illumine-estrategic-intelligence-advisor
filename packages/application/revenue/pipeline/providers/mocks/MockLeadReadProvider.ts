import { ILeadReadProvider } from '../ILeadReadProvider';
import { OpportunityReadModel } from '../../read-models/OpportunityReadModel';
export class MockLeadReadProvider implements ILeadReadProvider {
  async getLeads(): Promise<OpportunityReadModel[]> {
    return [
      { id: '1', title: 'Global Platform Expansion', company: 'Stark Industries', value: 1200000, stage: 'Qualified', probability: 30, badges: ['Enterprise', 'Strategic'], lastUpdate: '2 hours ago', nextAction: 'Discovery Call', executiveSponsor: 'Tony Stark', origin: 'Inbound', businessObjectives: [], painPoints: [] }
    ];
  }
  async getLead(id: string): Promise<OpportunityReadModel | null> {
    const leads = await this.getLeads();
    return leads.find(l => l.id === id) || null;
  }
}