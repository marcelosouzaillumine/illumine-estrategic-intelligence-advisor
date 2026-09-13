import React from 'react';
import { PageHeader } from '../../../../components/Common';
import { Target } from 'lucide-react';
import { WarRoomWorkspace } from '../../../../components/war-room/WarRoomWorkspace';
import { ExecutiveScenarioDashboard } from '../../../../components/war-room/ExecutiveScenarioDashboard';
import { useScenarioCommandCenterViewModel } from '../../../executive/presentation/view-models/useScenarioCommandCenterViewModel';

export const ScenarioCommandCenter: React.FC = () => {
  const { state, computed, actions } = useScenarioCommandCenterViewModel();

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-10 space-y-8 pb-32 animate-executive-fade">
      <div className="flex justify-between items-start mb-4">
        <PageHeader
          title="Scenario Governance & War Room"
          subtitle="Superfície executiva para exploração de consequências institucionais previamente calculadas."
          icon={Target}
          transparent
        />
        <button
          onClick={() => actions.handleCrossNavigation('ADVISOR', `/advisor`)}
          className="btn-secondary"
        >
          <span>Voltar ao Advisor Workspace</span>
        </button>
      </div>

      <ExecutiveScenarioDashboard 
        totalScenarios={0} 
        totalImpacts={0} 
        totalRisks={0} 
        totalEvidences={0} 
      />

      <WarRoomWorkspace 
        runtime={computed.runtime} 
        tenantId={state.mockTenantId} 
        organizationId={state.mockOrgId} 
        initialScenarioId={state.scenarioId} 
      />
    </div>
  );
};
