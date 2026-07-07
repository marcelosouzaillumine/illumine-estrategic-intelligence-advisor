import { useState, useEffect } from 'react';
import { WarRoomRuntime } from '../../../../core/war-room/WarRoomRuntime';
import { WarRoomViewModel, UIWarRoomScenario, UIWarRoomImpact } from '../../../../viewmodels/war-room/WarRoomViewModel';
import { WarRoomApplicationService } from '../../application/WarRoomApplicationService';

export interface UseWarRoomWorkspaceViewModelProps {
  runtime: WarRoomRuntime;
  tenantId: string;
  organizationId: string;
  initialScenarioId?: string;
}

export function useWarRoomWorkspaceViewModel({
  runtime,
  tenantId,
  organizationId,
  initialScenarioId
}: UseWarRoomWorkspaceViewModelProps) {
  const [scenarios, setScenarios] = useState<UIWarRoomScenario[]>([]);
  const [activeScenario, setActiveScenario] = useState<UIWarRoomScenario | null>(null);
  const [impacts, setImpacts] = useState<UIWarRoomImpact[]>([]);
  const [evidences, setEvidences] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tenantId) {
      WarRoomApplicationService.recordWarRoomOpened(tenantId, activeScenario?.id);
    }
  }, [tenantId, activeScenario]);

  useEffect(() => {
    let active = true;
    const loadContext = async () => {
      if (!tenantId || !organizationId) return;
      setLoading(true);
      try {
        const data = await runtime.loadScenarioContext(tenantId, organizationId, initialScenarioId);
        if (!active) return;

        setScenarios(WarRoomViewModel.mapScenarios(data.availableScenarios));
        
        if (data.activeScenario) {
          setActiveScenario(WarRoomViewModel.mapScenarios([data.activeScenario])[0]);
          setImpacts(WarRoomViewModel.mapImpacts(data.impacts));
          setEvidences(data.evidences);
        }
      } catch (e) {
        console.error('Failed to load War Room context', e);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadContext();
    return () => { active = false; };
  }, [runtime, tenantId, organizationId, initialScenarioId]);

  return {
    state: {
      scenarios,
      activeScenario,
      impacts,
      evidences,
      loading
    },
    computed: {
      // computed derived state
    },
    actions: {
      // actions for UI
    }
  };
}
