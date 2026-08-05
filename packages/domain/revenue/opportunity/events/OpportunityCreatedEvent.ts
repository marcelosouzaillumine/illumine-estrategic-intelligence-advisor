export class OpportunityCreatedEvent {
  public readonly eventName = 'OpportunityCreated';
  public readonly occurredAt: Date;

  constructor(
    public readonly opportunityId: string,
    public readonly tenantId: string,
    public readonly data: {
      companyName: string;
      sponsorName: string;
      source: string;
      createdBy: string;
      estimatedDealValue: number;
    }
  ) {
    this.occurredAt = new Date();
  }
}
