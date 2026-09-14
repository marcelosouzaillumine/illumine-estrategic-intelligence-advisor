

import React, { useEffect, useState } from 'react';
import { Cpu, Loader2 } from 'lucide-react';
import { InstitutionalOperatingSystem } from '../../../../services/FiduciaryRuntimeAdapter';
import { InstitutionalPulsePanel } from '../../../../components/ios/InstitutionalPulsePanel';
import { UnifiedGovernanceTimelinePanel } from '../../../../components/ios/UnifiedGovernanceTimelinePanel';
import { InstitutionalContextViewer } from '../../../../components/ios/InstitutionalContextViewer';
import { InstitutionalDependencyGraph } from '../../../../components/ios/InstitutionalDependencyGraph';
import { GovernanceCoordinationCenter } from '../../../../components/ios/GovernanceCoordinationCenter';
import { CrossDomainStateBoard } from '../../../../components/ios/CrossDomainStateBoard';
import { OperationalSynchronizationViewer } from '../../../../components/ios/OperationalSynchronizationViewer';
import { InstitutionalStateMap } from '../../../../components/ios/InstitutionalStateMap';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../../../../components/ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../../../../components/ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../../../../components/ui/executive-decision-trace';
import { useInstitutionalIOSPageViewModel } from '../../../../viewmodels/useInstitutionalIOSPageViewModel';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { ExecutivePageTemplate } from '../../../../components/ui/executive-page-template';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveAccordion } from '../../../../components/ui/executive-accordion';
import { ExecutiveEmptyState } from '../../../../components/ui/executive-empty-state';
import { ExecutiveMetricCard } from '../../../../components/ui/executive-metric-card';
import { StatusBadge } from '../../../../components/Common';

export function InstitutionalIOSPage() {
  // Adapter: useInstitutionalIOSPageAdapter
  // ViewModel: useInstitutionalIOSPageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = useInstitutionalIOSPageViewModel({ clientId: '' });
  const portal = createPortal;
  const tenantId = 'TENANT-HQ';
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    InstitutionalOperatingSystem.clearSandbox(tenantId);
    
    // Simula sincronização inicial do IOS
    InstitutionalOperatingSystem.synchronize(tenantId);
    setSynced(true);

    return () => {
      InstitutionalOperatingSystem.clearSandbox(tenantId);
    };
  }, [tenantId]);

  if (!synced) {
    return (
      <div className="flex items-center justify-center min-h-[400px] gap-3 text-muted-foreground">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-body-sm font-medium uppercase tracking-widest">Inicializando Institutional Operating System...</span>
      </div>
    );
  }

  return (
    <ExecutivePageTemplate header={{
      title: "Institutional OS",
      description: "Unified Cognitive Infrastructure: Sincronização central de governança, riscos operacionais e contingências cruzadas.",
    }}>
      <ExecutiveSurface padding="sm" radius="md" className="flex items-center gap-4 flex-wrap mb-6">
        <StatusBadge status="Verde" label="IOS Online" />
        <StatusBadge status="Ativo" label={tenantId} />
      </ExecutiveSurface>

      <InstitutionalPulsePanel tenantId={tenantId} />

      <div className="mt-12 mb-8 border-t border-border pt-8" />
      <ExecutiveAccordion
        title="Governance Infrastructure"
        subtitle="Sincronização cross-domain, estado institucional e timeline de governança."
        variant="analytics"
        defaultExpanded
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <InstitutionalContextViewer tenantId={tenantId} />
              <InstitutionalDependencyGraph tenantId={tenantId} />
            </div>
            
            <GovernanceCoordinationCenter tenantId={tenantId} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <CrossDomainStateBoard tenantId={tenantId} />
              <OperationalSynchronizationViewer tenantId={tenantId} />
              <InstitutionalStateMap tenantId={tenantId} />
            </div>
          </div>

          <div className="space-y-6">
            <UnifiedGovernanceTimelinePanel tenantId={tenantId} />
          </div>
        </div>
      </ExecutiveAccordion>
      <ExecutiveSummarySection 
        status={{ label: 'IOS Sincronizado', variant: 'success' }}
        question="Qual a integridade da infraestrutura cognitiva unificada (IOS)?"
        opinion="A infraestrutura de governança e sincronização de dados cross-domain está 100% online e operacional."
        driver="Linhas do tempo unificadas, mapeamento de dependências e sincronização operacional."
        implication="Mitigação de riscos de coordenação entre os diferentes domínios e departamentos."
        executiveQuestion="Monitorar os eventos críticos de sincronização e manter a infraestrutura atualizada."
      >
        <ExecutiveStrategicTensions tensions={[]} />
        <ExecutiveDecisionTrace trace={[]} />
      </ExecutiveSummarySection>
    </ExecutivePageTemplate>
  );
}
