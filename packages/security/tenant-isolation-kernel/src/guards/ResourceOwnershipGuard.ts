import { TenantIsolationContext } from '../contracts/TenantIsolationContext';
import { TenantIsolationKernel } from '../kernel/TenantIsolationKernel';

export interface CognitiveResource {
  resourceId: string;
  tenantId: string;
  type: string;
}

export class ResourceOwnershipGuard {
  static enforceOwnership(context: TenantIsolationContext, resource: CognitiveResource): void {
    TenantIsolationKernel.authorizeResource(context, resource.tenantId);
  }
}
