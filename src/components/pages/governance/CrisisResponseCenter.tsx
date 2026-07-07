import React from 'react';
import { Workflow, ShieldAlert } from 'lucide-react';
import { PageHeader } from '../../Common';
import { GovernancePlaybookPanel } from '../../governance-orchestration/GovernancePlaybookPanel';
import { StrategicResponseTimeline } from '../../governance-orchestration/StrategicResponseTimeline';
import { InstitutionalPriorityBoard } from '../../governance-orchestration/InstitutionalPriorityBoard';
import { CrossDomainCoordinationPanel } from '../../governance-orchestration/CrossDomainCoordinationPanel';
import { GovernanceRecommendationFeed } from '../../governance-orchestration/GovernanceRecommendationFeed';
import { RecoveryPathViewer } from '../../governance-orchestration/RecoveryPathViewer';
import { EscalationOrchestrationPanel } from '../../governance-orchestration/EscalationOrchestrationPanel';
import { PlaybookSimulationViewer } from '../../governance-orchestration/PlaybookSimulationViewer';
import { useCrisisResponseViewModel } from '../../../viewmodels/governance/useCrisisResponseViewModel';

export function CrisisResponseCenter() {
  const { state, computed } = useCrisisResponseViewModel();
  const { tenantId, crisisState } = state;
  const { isCritical } = computed;

  // Zero-Logic-UI Fail-closed
  if (!isCritical) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground space-y-4">
        <ShieldAlert size={48} className="text-muted-foreground" />
        <h3 className="text-lg font-bold text-muted-foreground">Monitoramento Nominal</h3>
        <p className="text-sm max-w-md text-center">
          Nenhum sinal crítico escalado no momento. A orquestração de resposta a crises (playbooks) permanece em fail-closed.
        </p>
      </div>
    );
  }

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

