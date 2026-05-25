import React from 'react';
import { Workflow } from 'lucide-react';
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
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in bg-background min-h-screen">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Workflow className="text-primary" />
            Governance Orchestration & Playbooks
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Autonomous Governance Coordination: Acionamento supervisionado de playbooks institucionais e orquestração de contingência.
          </p>
        </div>
      </div>

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
