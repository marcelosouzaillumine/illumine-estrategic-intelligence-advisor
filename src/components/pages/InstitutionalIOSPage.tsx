import React, { useEffect, useState } from 'react';
import { Cpu, Loader2 } from 'lucide-react';
import { PageHeader } from '../Common';
import { InstitutionalOperatingSystem } from '../../core/runtime/ios/InstitutionalOperatingSystem';
import { InstitutionalPulsePanel } from '../ios/InstitutionalPulsePanel';
import { UnifiedGovernanceTimelinePanel } from '../ios/UnifiedGovernanceTimelinePanel';
import { InstitutionalContextViewer } from '../ios/InstitutionalContextViewer';
import { InstitutionalDependencyGraph } from '../ios/InstitutionalDependencyGraph';
import { GovernanceCoordinationCenter } from '../ios/GovernanceCoordinationCenter';
import { CrossDomainStateBoard } from '../ios/CrossDomainStateBoard';
import { OperationalSynchronizationViewer } from '../ios/OperationalSynchronizationViewer';
import { InstitutionalStateMap } from '../ios/InstitutionalStateMap';

export function InstitutionalIOSPage() {
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
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      <PageHeader
        title="Institutional Operating System (IOS)"
        subtitle="Unified Cognitive Infrastructure: Sincronização central de governança, riscos operacionais e contingências cruzadas."
        icon={Cpu}
        transparent
      />

      <InstitutionalPulsePanel tenantId={tenantId} />

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
    </div>
  );
}
