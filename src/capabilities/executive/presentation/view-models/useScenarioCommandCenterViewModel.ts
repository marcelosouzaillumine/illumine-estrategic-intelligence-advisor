import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { WarRoomRuntime } from '../../../../core/war-room/WarRoomRuntime';
import { ScenarioCommandCenterApplicationService } from '../../application/ScenarioCommandCenterApplicationService';

export interface ScenarioCommandCenterState {
  scenarioId?: string;
  tenantId: string;
  mockTenantId: string;
  mockOrgId: string;
}

export interface ScenarioCommandCenterComputed {
  runtime: WarRoomRuntime;
}

export interface ScenarioCommandCenterActions {
  handleCrossNavigation: (targetWorkspace: string, path: string) => void;
}

export interface ScenarioCommandCenterViewModel {
  state: ScenarioCommandCenterState;
  computed: ScenarioCommandCenterComputed;
  actions: ScenarioCommandCenterActions;
}

export const useScenarioCommandCenterViewModel = (): ScenarioCommandCenterViewModel => {
  const { scenarioId } = useParams<{ scenarioId?: string }>();
  const { tenantId = 'TENANT_A' } = useParams<{ tenantId: string }>();
  const navigate = useNavigate();

  const appService = ScenarioCommandCenterApplicationService.getInstance();

  const mockTenantId = "tenant-1";
  const mockOrgId = "org-1";

  const runtime = useMemo(() => {
    return appService.getWarRoomRuntime();
  }, []);

  const handleCrossNavigation = (targetWorkspace: string, path: string) => {
    appService.executeCrossNavigation({
      tenantId,
      sourceWorkspace: 'WAR_ROOM',
      targetWorkspace,
      correlationId: `nav-${Date.now()}`,
      path
    }, navigate);
  };

  return {
    state: {
      scenarioId,
      tenantId,
      mockTenantId,
      mockOrgId
    },
    computed: {
      runtime
    },
    actions: {
      handleCrossNavigation
    }
  };
};
