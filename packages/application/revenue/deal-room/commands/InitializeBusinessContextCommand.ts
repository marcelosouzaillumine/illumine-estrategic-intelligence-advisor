import { LeadSource } from '@domain/revenue/opportunity/value-objects/LeadSource';

export class InitializeBusinessContextCommand {
  constructor(
    public readonly tenantId: string,
    public readonly companyName: string,
    public readonly contactName: string,
    public readonly contactEmail: string,
    public readonly segment: string,
    public readonly createdBy: string,
    public readonly executiveOffice: string = 'revenue-office',
    public readonly source: LeadSource = LeadSource.INTERNAL_EXECUTIVE,
    public readonly partnerReference: string | null = null,
    public readonly estimatedARR: number = 0
  ) {}
}
