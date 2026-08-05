import { AggregateRoot } from '../../shared';
import { 
  LicenseId, 
  CustomerReference, 
  SubscriptionReference, 
  LicenseKey, 
  LicenseStatus, 
  LicensePeriod, 
  LicenseCapacity, 
  LicenseScope 
} from '../value-objects/LicenseValueObjects';

export interface License extends AggregateRoot<LicenseId> {
  customer: CustomerReference;
  subscription: SubscriptionReference;
  licenseKey: LicenseKey;
  scope: LicenseScope;
  capacity: LicenseCapacity;
  period: LicensePeriod;
  status: LicenseStatus;
  issuedAt?: string;
  expiresAt?: string;
}
