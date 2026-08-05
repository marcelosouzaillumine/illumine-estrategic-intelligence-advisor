import { AggregateRoot } from '../../shared';
import { 
  EntitlementId, 
  TenantReference, 
  LicenseReference, 
  EntitlementStatus, 
  Capability, 
  UsageLimit, 
  FeatureGate 
} from '../value-objects/EntitlementValueObjects';

export interface Entitlement extends AggregateRoot<EntitlementId> {
  tenantReference: TenantReference;
  licenseReference: LicenseReference;
  capabilities: Capability[];
  usageLimits: UsageLimit[];
  featureGates: FeatureGate[];
  status: EntitlementStatus;
}
