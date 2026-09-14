import React from 'react';
import { Workflow } from 'lucide-react';
import { GovernancePlaybookPanel } from '../../../../components/governance-orchestration/GovernancePlaybookPanel';
import { StrategicResponseTimeline } from '../../../../components/governance-orchestration/StrategicResponseTimeline';
import { InstitutionalPriorityBoard } from '../../../../components/governance-orchestration/InstitutionalPriorityBoard';
import { CrossDomainCoordinationPanel } from '../../../../components/governance-orchestration/CrossDomainCoordinationPanel';
import { GovernanceRecommendationFeed } from '../../../../components/governance-orchestration/GovernanceRecommendationFeed';
import { RecoveryPathViewer } from '../../../../components/governance-orchestration/RecoveryPathViewer';
import { EscalationOrchestrationPanel } from '../../../../components/governance-orchestration/EscalationOrchestrationPanel';
import { PlaybookSimulationViewer } from '../../../../components/governance-orchestration/PlaybookSimulationViewer';
import { ExecutivePageTemplate } from '../../../../components/ui/executive-page-template';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveAccordion } from '../../../../components/ui/executive-accordion';
import { ExecutiveEmptyState } from '../../../../components/ui/executive-empty-state';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { StatusBadge } from '../../../../components/Common';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../../../../components/ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../../../components/ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../../../components/ui/executive-decision-trace';
import { useGovernanceOrchestrationPageViewModel } from '../../../../viewmodels/useGovernanceOrchestrationPageViewModel';




export function GovernanceOrchestrationPage() {
  // Adapter: useGovernanceOrchestrationPageAdapter
  // ViewModel: useGovernanceOrchestrationPageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = useGovernanceOrchestrationPageViewModel({ clientId: '' });
  const tenantId = 'TENANT-HQ'; // Mock MVP Tenant

  return (
    <ExecutivePageTemplate header={{
      title: "Orquestração de Governança",
      description: "Acionamento supervisionado de playbooks institucionais e orquestração de contingência corporativa.",
    }}>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

        <div className="flex items-center gap-3">
          <StatusBadge status="Verde" label="Orquestrador Conectado" />
        </div>
      
      </div>

      <div className="mt-12 mb-8 border-t border-border pt-8" />
      <ExecutiveAccordion
        title="Painel de Playbooks e Resposta Estratégica"
        subtitle="Monitore as prioridades institucionais, escalonamentos e planos de recuperação de desvios."
        variant="analytics"
        defaultExpanded
      >

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
      <ExecutiveSummarySection 
        status={{ label: 'Orquestração Ativa', variant: 'success' }}
        question="Como os playbooks institucionais garantem resposta rápida a desvios?"
        opinion="O comitê fiduciário homologa os playbooks e matrizes de escalonamento para mitigação coordenada de riscos."
        driver="Playbooks de crise, trilhas de recuperação, coordenação cross-domain e timeline de resposta."
        implication="Prontidão operacional e eliminação de pontos céticos na execução contingencial."
        executiveQuestion="Realizar simulados trimestrais dos playbooks de maior impacto."
      >
        <ExecutiveStrategicTensions tensions={[]} />
        <ExecutiveDecisionTrace trace={[]} />
      </ExecutiveSummarySection>
      </ExecutiveAccordion>
    </ExecutivePageTemplate>
  );
}
