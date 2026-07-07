import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AdvisorCommandApplicationService } from '../../application/AdvisorCommandApplicationService';
import { AdvisorWorkspaceRuntime } from '../../../../core/advisor/AdvisorWorkspaceRuntime';
import { AdvisorContextEngine } from '../../../../core/advisor/AdvisorContextEngine';

export function useAdvisorCommandCenterViewModel() {
  const { organizationId } = useParams<{ organizationId: string }>();
  
  const advisorId = 'CURRENT_ADVISOR';
  const tenantId = 'ADVISOR_FIRM_TENANT';

  useEffect(() => {
    AdvisorCommandApplicationService.recordWorkspaceOpened(organizationId, advisorId, tenantId);
  }, [organizationId, advisorId, tenantId]);

  return {
    state: {
      advisorId,
      tenantId,
      runtime: AdvisorCommandApplicationService.runtime,
      contextEngine: AdvisorCommandApplicationService.contextEngine
    },
    computed: {},
    actions: {}
  };
}
