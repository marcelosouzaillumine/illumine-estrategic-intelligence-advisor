import { Contract, ContractStatus, ContractLifecycleService } from '@domain/contract';
import { SubscriptionCreationRequested } from './events/IntegrationEvents';

export class ActivateContractUseCase {
  constructor(private readonly lifecycleService: ContractLifecycleService) {}

  /**
   * Orchestrates the activation of a Contract and triggers the next domain in the pipeline.
   */
  public execute(contract: Contract): { contract: Contract; integrationEvent: SubscriptionCreationRequested } {
    // 1. Delegate business rules to the Domain Service (State Machine)
    const activatedContract = this.lifecycleService.transitionState(contract, ContractStatus.ACTIVE);

    // 2. (In real implementation) Save via ContractRepository
    
    // 3. Generate Integration Event to trigger Subscription/Billing (Cross-Domain Bridge)
    const integrationEvent: SubscriptionCreationRequested = {
      id: `EVT-${Date.now()}`,
      eventName: 'SubscriptionCreationRequested',
      occurredAt: new Date().toISOString(),
      source: 'application:revenue:contract',
      payload: {
        contractNumber: activatedContract.id,
        customerId: activatedContract.customer,
        planId: activatedContract.terms.planId,
        billingCycle: activatedContract.terms.billingCycle,
        currency: activatedContract.terms.currency,
      }
    };

    // 4. (In real implementation) Dispatch Integration Event to Message Bus / Event Grid

    return { contract: activatedContract, integrationEvent };
  }
}
