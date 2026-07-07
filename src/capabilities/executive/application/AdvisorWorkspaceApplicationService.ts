import { InstitutionalNavigationService } from '../../../core/navigation/InstitutionalNavigationService';
import { InstitutionalObservabilityRegistry } from '../../../core/observability/InstitutionalObservabilityRegistry';
import { InstitutionalNavigationReference } from '../../../types/intelligence/InstitutionalNavigationReference';
import { NavigateFunction } from 'react-router-dom';

export class AdvisorWorkspaceApplicationService {
  static performNavigation(
    targetWorkspace: string,
    path: string,
    navigate: NavigateFunction
  ) {
    const navRef: InstitutionalNavigationReference = {
      tenantId: 'SYSTEM_TENANT',
      sourceWorkspace: 'ADVISOR',
      targetWorkspace: targetWorkspace as any,
      correlationId: `nav-${Date.now()}`
    };
    
    // Using standard navigate to pass the state, InstitutionalNavigationService might wrap this
    // but the original code did: navigate(path, { state: { navRef } });
    navigate(path, { state: { navRef } });
  }

  static recordPortfolioLoaded(tenantId: string, advisorId: string) {
    InstitutionalObservabilityRegistry.recordExecutiveEvent(
      'ADVISOR_PORTFOLIO_LOADED',
      tenantId,
      `load-${Date.now()}`,
      { advisorId }
    );
  }

  static recordOrganizationSelected(tenantId: string, orgId: string, advisorId: string) {
    InstitutionalObservabilityRegistry.recordExecutiveEvent(
      'ADVISOR_ORGANIZATION_SELECTED',
      tenantId,
      `select-${Date.now()}`,
      { orgId, advisorId }
    );
  }
}
