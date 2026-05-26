import React from 'react';
import { Workflow } from 'lucide-react';
import { PageHeader } from '../Common';
import { GovernancePlaybookPanel } from '../governance-orchestration/GovernancePlaybookPanel';
import { StrategicResponseTimeline } from '../governance-orchestration/StrategicResponseTimeline';
import { InstitutionalPriorityBoard } from '../governance-orchestration/InstitutionalPriorityBoard';
import { CrossDomainCoordinationPanel } from '../governance-orchestration/CrossDomainCoordinationPanel';
import { GovernanceRecommendationFeed } from '../governance-orchestration/GovernanceRecommendationFeed';
import { RecoveryPathViewer } from '../governance-orchestration/RecoveryPathViewer';
import { EscalationOrchestrationPanel } from '../governance-orchestration/EscalationOrchestrationPanel';
import { PlaybookSimulationViewer } from '../governance-orchestration/PlaybookSimulationViewer';

export function GovernanceOrchestrationPage() {
  const tenantId = 'TENANT-HQ'; // Mock MVP Tenant

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      <PageHeader
        title="Governance Orchestration & Playbooks"
        subtitle="Autonomous Governance Coordination: Acionamento supervisionado de playbooks institucionais e orquestração de contingência."
        icon={Workflow}
        transparent
      />

      <GovernancePlaybookPanel tenantId={tenantId} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InstitutionalPriorityBoard tenantId={tenantId} />
            <EscalationOrchestrationPanel tenantId={tenantId} />
          </div>

          <CrossDomainCoordinationPanel tenantId={tenantId} />
          <RecoveryPathViewer tenantId={tenantId} />
          <PlaybookSimulationViewer tenantId={tenantId} />
        </div>

        <div className="space-y-6">
          <GovernanceRecommendationFeed tenantId={tenantId} />
          <StrategicResponseTimeline tenantId={tenantId} />
        </div>
      </div>
    </div>
  );
}
