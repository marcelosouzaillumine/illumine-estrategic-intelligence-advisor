import { Opportunity } from '@domain/revenue/opportunity/Opportunity';

export interface IOpportunityRepository {
  save(opportunity: Opportunity): Promise<void>;
  findById(opportunityId: string, tenantId: string): Promise<Opportunity | null>;
}
