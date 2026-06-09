import { AdvisorClientContext } from '../../types/advisor/AdvisorClientContext';

/**
 * Guarda de Segurança Fail-Closed para o Advisor Workspace.
 * Garante que um Advisor (advisorId/tenantId) só pode acessar
 * organizações que fazem parte do seu portfólio.
 */
export class AdvisorTenantGuard {
  
  static enforceAccess(
    advisorTenantId: string, 
    requestedOrganizationId: string, 
    authorizedOrganizations: AdvisorClientContext[]
  ): boolean {
    const isAuthorized = authorizedOrganizations.some(org => org.organizationId === requestedOrganizationId);
    
    if (!isAuthorized) {
      console.error(`SECURITY VIOLATION: Advisor Tenant [${advisorTenantId}] attempted to access Organization [${requestedOrganizationId}] without authorization. Proceeding to Fail-Closed state.`);
      return false;
    }
    
    return true;
  }
}
