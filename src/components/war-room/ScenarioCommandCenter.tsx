import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from '../Common';
import { Target } from 'lucide-react';
import { WarRoomWorkspace } from './WarRoomWorkspace';
import { ExecutiveScenarioDashboard } from './ExecutiveScenarioDashboard';
import { MockWarRoomRepository } from '../../core/war-room/WarRoomRepository';
import { WarRoomRuntime } from '../../core/war-room/WarRoomRuntime';

export const ScenarioCommandCenter: React.FC = () => {
  const { scenarioId } = useParams<{ scenarioId?: string }>();
  const { tenantId = 'TENANT_A' } = useParams<{ tenantId: string }>();
  const navigate = useNavigate();

  const handleCrossNavigation = (targetWorkspace: string, path: string) => {
    const navRef = {
      tenantId,
      sourceWorkspace: 'WAR_ROOM',
      targetWorkspace,
      correlationId: `nav-${Date.now()}`
    };
    navigate(path, { state: { navRef } });
  };
  
  // Em uma implementação real, o tenantId viria do AuthContext
  const mockTenantId = "tenant-1";
  const mockOrgId = "org-1";

  const runtime = useMemo(() => {
    return new WarRoomRuntime(new MockWarRoomRepository());
  }, []);

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-10 space-y-8 pb-32 animate-executive-fade">
      <div className="flex justify-between items-start mb-4">
        <PageHeader
          title="Scenario Intelligence & War Room"
          subtitle="Superfície executiva para exploração de consequências institucionais previamente calculadas."
          icon={Target}
          transparent
        />
        <button
          onClick={() => handleCrossNavigation('ADVISOR', `/advisor`)}
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
        runtime={runtime} 
        tenantId={mockTenantId} 
        organizationId={mockOrgId} 
        initialScenarioId={scenarioId} 
      />
    </div>
  );
};
