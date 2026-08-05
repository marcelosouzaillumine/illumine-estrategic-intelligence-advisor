import { InitializeBusinessContextCommand } from '../commands/InitializeBusinessContextCommand';
import { IOpportunityRepository } from '../ports/IOpportunityRepository';
import { IEventBusPublisher } from '../ports/IEventBusPublisher';
import { Opportunity } from '@domain/revenue/opportunity/Opportunity';

export class OpportunityCommandHandler {
  constructor(
    private readonly repository: IOpportunityRepository,
    private readonly eventBus: IEventBusPublisher
  ) {}

  async executeInitializeContext(command: InitializeBusinessContextCommand): Promise<string> {
    // Generate a new ID (in a real app, use UUID or let DB generate. For now, simple ID)
    const newId = `opp-${Date.now()}`;

    // 1. Create Aggregate (which also registers Domain Events internally)
    const opportunity = Opportunity.create(
      newId,
      command.tenantId,
      command.companyName,
      command.contactName,
      command.source,
      command.partnerReference,
      command.estimatedARR,
      command.createdBy
    );

    // 2. Persist Aggregate (Write Model + Event Sourcing prep)
    await this.repository.save(opportunity);

    // 3. Publish Domain Events to Event Bus (Triggers Sagas/Projections)
    await this.eventBus.publishAll(opportunity.domainEvents);
    
    // Clear events after publishing
    opportunity.clearEvents();

    return opportunity.id;
  }
}
