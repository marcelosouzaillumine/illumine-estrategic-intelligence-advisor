import { ExecutiveIdentityContext } from '../../executive-identity-context/src/ExecutiveIdentityContext';
import { TenantIsolationViolationError } from '../../executive-identity-context/src/TenantIsolationViolationError';

export class TenantIsolationGuard {
  /**
   * Valida se a memória ou transação pode ser acessada pela Identidade atual.
   * Lança TenantIsolationViolationError caso a fronteira seja violada (AR-GFC-ERI-008).
   */
  static authorize(identity: ExecutiveIdentityContext, requestedTenantId: string, requestedOrganizationId?: string): void {
    if (identity.tenantId !== requestedTenantId) {
      throw new TenantIsolationViolationError({
        requestedTenant: requestedTenantId,
        activeTenant: identity.tenantId,
        sessionId: identity.sessionId,
        reason: 'Cross Tenant Leakage Attempt'
      });
    }

    if (requestedOrganizationId && identity.organizationId !== requestedOrganizationId) {
      throw new TenantIsolationViolationError({
        requestedTenant: requestedOrganizationId,
        activeTenant: identity.organizationId,
        sessionId: identity.sessionId,
        reason: 'Cross Organization Leakage Attempt within Tenant'
      });
    }
  }
}
