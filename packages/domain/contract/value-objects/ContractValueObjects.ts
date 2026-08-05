import { Identifier } from '../../shared';

export type ContractNumber = Identifier;
export type CustomerReference = Identifier;

export interface ContractPeriod {
  startDate: string;
  endDate?: string; // Optional for perpetual/indefinite contracts
}

export enum ContractStatus {
  DRAFT = 'DRAFT',
  PENDING_SIGNATURE = 'PENDING_SIGNATURE',
  SIGNED = 'SIGNED',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  TERMINATED = 'TERMINATED'
}

export interface ContractOrigin {
  proposalReference?: string;
  acceptanceReference?: string;
}

export interface ContractTerms {
  planId: string;
  period: ContractPeriod;
  currency: string;
  billingCycle: string;
  specialConditions?: string;
  sla?: string;
}

export interface ContractLifecycle {
  signedAt?: string;
  activatedAt?: string;
  terminatedAt?: string;
  terminationReason?: string;
}
