import { LeadSource } from './value-objects/LeadSource';
import { OpportunityCreatedEvent } from './events/OpportunityCreatedEvent';

export class Opportunity {
  private _domainEvents: any[] = [];
  
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public company: string,
    public sponsor: string,
    public source: LeadSource,
    public partnerReference: string | null,
    public estimatedARR: number,
    public currentStage: string,
    public createdBy: string,
    public createdAt: Date,
    // Add AI/Intelligence structures as requested by user
    public insights: any[] = [],
    public recommendations: any[] = [],
    public riskSignals: any[] = []
  ) {}

  public get domainEvents() {
    return this._domainEvents;
  }

  public clearEvents() {
    this._domainEvents = [];
  }

  private addEvent(event: any) {
    this._domainEvents.push(event);
  }

  // Factory method
  public static create(
    id: string,
    tenantId: string,
    company: string,
    sponsor: string,
    source: LeadSource,
    partnerReference: string | null,
    estimatedARR: number,
    createdBy: string
  ): Opportunity {
    const opp = new Opportunity(
      id,
      tenantId,
      company,
      sponsor,
      source,
      partnerReference,
      estimatedARR,
      'qualification', // initial stage
      createdBy,
      new Date()
    );

    // Register Domain Event
    opp.addEvent(
      new OpportunityCreatedEvent(id, tenantId, {
        companyName: company,
        sponsorName: sponsor,
        source,
        createdBy,
        estimatedDealValue: estimatedARR
      })
    );

    return opp;
  }
}
