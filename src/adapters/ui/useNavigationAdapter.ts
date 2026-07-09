import { useNavigate } from 'react-router-dom';
import { InstitutionalNavigationService } from '../../core/navigation/InstitutionalNavigationService';
import { InstitutionalNavigationReference, InstitutionalWorkspaceType } from '../../types/intelligence/InstitutionalNavigationReference';

export function useNavigationAdapter() {
  const navigate = useNavigate();

  const navigateToWorkspace = (
    targetWorkspace: InstitutionalWorkspaceType, 
    sourceWorkspace: InstitutionalWorkspaceType = 'EXECUTIVE_HOME',
    tenantId: string = 'SYSTEM_TENANT'
  ) => {
    const navRef: InstitutionalNavigationReference = {
      tenantId,
      sourceWorkspace,
      targetWorkspace,
      correlationId: `nav-${Date.now()}`
    };
    InstitutionalNavigationService.navigate(navigate, navRef);
  };

  return {
    navigateToWorkspace
  };
}
