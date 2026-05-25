import React, { useEffect, useState } from 'react';
import { Cpu } from 'lucide-react';
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
    return <div className="p-8">Inicializando Institutional Operating System...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in bg-background min-h-screen">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Cpu className="text-primary" />
            Institutional Operating System (IOS)
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Unified Cognitive Infrastructure: Sincronização central de governança, riscos operacionais e contingências cruzadas.
          </p>
        </div>
      </div>

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
