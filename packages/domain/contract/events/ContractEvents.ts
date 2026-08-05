import { DomainEvent } from '../../shared';

export interface ContractCreated extends DomainEvent {
  metadata: { contractNumber: string; customerId: string };
}

export interface ContractSubmitted extends DomainEvent {
  metadata: { contractNumber: string };
}

export interface ContractSigned extends DomainEvent {
  metadata: { contractNumber: string; acceptanceReference: string };
}

export interface ContractActivated extends DomainEvent {
  metadata: { contractNumber: string };
}

export interface ContractSuspended extends DomainEvent {
  metadata: { contractNumber: string; reason: string };
}

export interface ContractTerminated extends DomainEvent {
  metadata: { contractNumber: string; reason: string };
}
