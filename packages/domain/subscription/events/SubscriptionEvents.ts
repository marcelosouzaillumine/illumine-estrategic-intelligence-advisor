import { DomainEvent } from '../../shared';

export interface SubscriptionCreated extends DomainEvent {
  metadata: { subscriptionId: string; contractReference: string };
}

export interface SubscriptionActivated extends DomainEvent {
  metadata: { subscriptionId: string; startDate: string };
}

export interface SubscriptionRenewed extends DomainEvent {
  metadata: { subscriptionId: string; newRenewalDate: string };
}

export interface SubscriptionPaused extends DomainEvent {
  metadata: { subscriptionId: string; reason: string };
}

export interface SubscriptionCancelled extends DomainEvent {
  metadata: { subscriptionId: string; reason: string };
}

export interface SubscriptionExpired extends DomainEvent {
  metadata: { subscriptionId: string };
}
