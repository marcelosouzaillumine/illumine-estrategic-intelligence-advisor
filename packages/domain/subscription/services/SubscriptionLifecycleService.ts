import { Subscription } from '../models/Subscription';
import { SubscriptionStatus } from '../value-objects/SubscriptionValueObjects';

export class SubscriptionLifecycleService {
  /**
   * Valida e executa a transição de estado da assinatura.
   * Aplica regras rígidas da máquina de estados do domínio.
   */
  public transitionState(subscription: Subscription, targetStatus: SubscriptionStatus): Subscription {
    if (!this.canTransition(subscription.status, targetStatus)) {
      throw new Error(`Invalid subscription state transition from ${subscription.status} to ${targetStatus}`);
    }

    const updatedSubscription = { ...subscription, status: targetStatus, updatedAt: new Date().toISOString() };

    return updatedSubscription;
  }

  private canTransition(current: SubscriptionStatus, target: SubscriptionStatus): boolean {
    const transitions: Record<SubscriptionStatus, SubscriptionStatus[]> = {
      [SubscriptionStatus.PENDING]: [SubscriptionStatus.ACTIVE],
      [SubscriptionStatus.ACTIVE]: [SubscriptionStatus.PAUSED, SubscriptionStatus.PAST_DUE, SubscriptionStatus.CANCELLED],
      [SubscriptionStatus.PAUSED]: [SubscriptionStatus.ACTIVE, SubscriptionStatus.CANCELLED],
      [SubscriptionStatus.PAST_DUE]: [SubscriptionStatus.ACTIVE, SubscriptionStatus.CANCELLED],
      [SubscriptionStatus.CANCELLED]: [SubscriptionStatus.EXPIRED],
      [SubscriptionStatus.EXPIRED]: [], // Terminal state
    };

    return transitions[current]?.includes(target) ?? false;
  }
}
