import { 
  Subscription, 
  SubscriptionStatus, 
  BillingCycle, 
  RenewalPolicy,
  SubscriptionPlanReference,
  PricingSnapshotReference,
  SubscriptionMetrics
} from '@domain/subscription';

interface CreateSubscriptionCommand {
  contractReference: string;
  customerReference: string;
  planId: string;
  planVersion: string;
  pricingSnapshotId: string;
  currency: string;
  amount: number;
  billingCycle: string;
  startDate: string;
}

export class CreateSubscriptionUseCase {
  /**
   * Translates an approved Contract (from ContractActivated or SubscriptionCreationRequested)
   * into a PENDING Subscription, freezing the economic terms.
   */
  public execute(command: CreateSubscriptionCommand): Subscription {
    
    const plan: SubscriptionPlanReference = {
      planId: command.planId,
      planVersion: command.planVersion,
    };

    const pricing: PricingSnapshotReference = {
      snapshotId: command.pricingSnapshotId,
      capturedAt: new Date().toISOString(),
      currency: command.currency,
      amount: command.amount,
    };

    // Calculate MRR/ARR contribution based on cycle
    const isAnnual = command.billingCycle === 'ANNUAL';
    const metrics: SubscriptionMetrics = {
      monthlyRecurringRevenue: isAnnual ? command.amount / 12 : command.amount,
      annualRecurringRevenue: isAnnual ? command.amount : command.amount * 12,
      currency: command.currency,
    };

    const subscription: Subscription = {
      id: `SUB-${Date.now()}`,
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      customer: command.customerReference,
      contract: command.contractReference,
      plan,
      pricing,
      status: SubscriptionStatus.PENDING,
      billingCycle: command.billingCycle as BillingCycle,
      period: { startDate: command.startDate },
      renewal: RenewalPolicy.AUTO_RENEW,
      metrics,
    };

    // Next steps: Save to Repository, Dispatch Domain Event (SubscriptionCreated)

    return subscription;
  }
}
