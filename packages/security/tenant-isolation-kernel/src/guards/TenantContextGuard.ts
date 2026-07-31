import { TenantIsolationContext } from '../contracts/TenantIsolationContext';
import { TenantIsolationKernel } from '../kernel/TenantIsolationKernel';

export class TenantContextGuard {
  static enforce(context: TenantIsolationContext): void {
    TenantIsolationKernel.validateContext(context);
  }
}
