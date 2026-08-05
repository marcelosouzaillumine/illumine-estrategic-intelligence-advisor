import { AggregateRoot } from '../../shared';
import { TenantIdentifier, WorkspaceIdentifier, ProvisioningStatus, InfrastructureConfig } from '../value-objects/ProvisioningValueObjects';

export interface TenantProfile extends AggregateRoot<TenantIdentifier> {
  name: string;
  adminEmail: string;
  subscriptionId: string;
  status: ProvisioningStatus;
  workspaces: WorkspaceIdentifier[];
  infra: InfrastructureConfig;
}
