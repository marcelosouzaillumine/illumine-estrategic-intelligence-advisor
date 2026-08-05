import { Identifier } from '../../shared';

export type LicenseKey = Identifier;

export enum LicenseStatus {
  ISSUED = 'ISSUED',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  REVOKED = 'REVOKED'
}

export interface SeatLimit {
  maxSeats: number;
  allocatedSeats: number;
}

export interface ExpirationPolicy {
  expiresAt: string;
  isPerpetual: boolean;
}
