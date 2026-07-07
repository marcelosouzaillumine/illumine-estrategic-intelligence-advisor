import React from 'react';
import { WarRoomRuntime } from '../../core/war-room/WarRoomRuntime';
import { Target } from 'lucide-react';
import { ScenarioCatalog } from './ScenarioCatalog';
import { ImpactExplorer } from './ImpactExplorer';
import { RiskPropagationViewer } from './RiskPropagationViewer';
import { EvidenceCorrelationPanel } from './EvidenceCorrelationPanel';
import { useWarRoomWorkspaceViewModel } from '../../capabilities/executive/presentation/view-models/useWarRoomWorkspaceViewModel';

interface WarRoomWorkspaceProps {
  runtime: WarRoomRuntime;
  tenantId: string;
  organizationId: string;
  initialScenarioId?: string;
}

export const WarRoomWorkspace: React.FC<WarRoomWorkspaceProps> = ({
  runtime,
  tenantId,
  organizationId,
  initialScenarioId
}) => {
  const { state } = useWarRoomWorkspaceViewModel({
    runtime,
    tenantId,
    organizationId,
    initialScenarioId
  });

  const { scenarios, activeScenario, impacts, evidences, loading } = state;

  if (!tenantId || !organizationId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Target className="text-muted-foreground/60 mb-4" size={48} />
        <p className="text-eyebrow text-muted-foreground uppercase tracking-widest">Contexto indisponível.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Target className="animate-spin-slow text-amber-500 mb-4" size={32} />
        <p className="text-eyebrow text-muted-foreground uppercase tracking-widest">Sincronizando Cenários Institucionais...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Coluna 1: Catálogo de Cenários */}
        <div className="xl:col-span-3 space-y-6">
          <ScenarioCatalog 
            scenarios={scenarios} 
            activeScenarioId={activeScenario?.id || null}
          />
        </div>

        {/* Coluna 2: Exploração de Impactos */}
        <div className="xl:col-span-4 space-y-6">
          <ImpactExplorer impacts={impacts} />
        </div>

        {/* Coluna 3: Propagação de Riscos (Knowledge Graph) */}
        <div className="xl:col-span-3 space-y-6">
          <RiskPropagationViewer impacts={impacts} />
        </div>

        {/* Coluna 4: Correlação de Evidências */}
        <div className="xl:col-span-2 space-y-6">
          <EvidenceCorrelationPanel evidences={evidences} />
        </div>
      </div>
    </div>
  );
};
