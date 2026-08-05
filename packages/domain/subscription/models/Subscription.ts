import { AggregateRoot } from '../../shared';
import { 
  SubscriptionId, 
  CustomerReference, 
  ContractReference, 
  SubscriptionPlanReference, 
  SubscriptionStatus, 
  BillingCycle, 
  SubscriptionPeriod, 
  RenewalPolicy, 
  PricingSnapshotReference, 
  SubscriptionMetrics 
} from '../value-objects/SubscriptionValueObjects';

export interface Subscription extends AggregateRoot<SubscriptionId> {
  customer: CustomerReference;
  contract: ContractReference;
  plan: SubscriptionPlanReference;
  pricing: PricingSnapshotReference;
  status: SubscriptionStatus;
  billingCycle: BillingCycle;
  period: SubscriptionPeriod;
  renewal: RenewalPolicy;
  metrics: SubscriptionMetrics;
}
