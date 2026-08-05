import { AggregateRoot } from '../../shared';
import { 
  TenantId, 
  CustomerReference, 
  EntitlementReference, 
  TenantStatus, 
  OperationalHealth,
  TenantConfig, 
  AdminIdentity 
} from '../value-objects/ProvisioningValueObjects';

export interface TenantEnvironment extends AggregateRoot<TenantId> {
  customerReference: CustomerReference;
  entitlementReference: EntitlementReference;
  configuration: TenantConfig;
  adminIdentity: AdminIdentity;
  capabilities: string[]; // snapshot of granted capability codes
  status: TenantStatus;
  operationalHealth: OperationalHealth;
  activatedAt?: string;
}
