import { User } from '../../../domain/identity/User';
import { Tenant, Membership } from '../../../domain/tenant/Tenant';
import { SystemCapability } from '../../../domain/authorization/Capabilities';

export interface ExecutiveContext {
  user: User;
  tenant: Tenant;
  membership: Membership;
  capabilities: SystemCapability[];
  locale: string;
}
