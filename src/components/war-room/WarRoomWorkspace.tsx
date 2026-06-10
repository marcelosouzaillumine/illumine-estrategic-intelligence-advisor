import React, { useState, useEffect } from 'react';
import { WarRoomRuntime } from '../../core/war-room/WarRoomRuntime';
import { WarRoomViewModel, UIWarRoomScenario, UIWarRoomImpact } from '../../viewmodels/war-room/WarRoomViewModel';
import { InstitutionalObservabilityRegistry } from '../../core/observability/InstitutionalObservabilityRegistry';
import { PageHeader } from '../Common';
import { Shield, Target } from 'lucide-react';
import { ScenarioCatalog } from './ScenarioCatalog';
import { ImpactExplorer } from './ImpactExplorer';
import { RiskPropagationViewer } from './RiskPropagationViewer';
import { EvidenceCorrelationPanel } from './EvidenceCorrelationPanel';

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
  const [scenarios, setScenarios] = useState<UIWarRoomScenario[]>([]);
  const [activeScenario, setActiveScenario] = useState<UIWarRoomScenario | null>(null);
  const [impacts, setImpacts] = useState<UIWarRoomImpact[]>([]);
  const [evidences, setEvidences] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (tenantId) {
      InstitutionalObservabilityRegistry.recordWarRoomOpened(
        tenantId,
        `ctx-${Date.now()}`,
        'CURRENT_USER',
        activeScenario?.id
      );
    }
  }, [tenantId, activeScenario]);

  useEffect(() => {
    let active = true;
    const loadContext = async () => {
      if (!tenantId || !organizationId) return;
      setLoading(true);
      try {
        const data = await runtime.loadScenarioContext(tenantId, organizationId, initialScenarioId);
        if (!active) return;

        setScenarios(WarRoomViewModel.mapScenarios(data.availableScenarios));
        
        if (data.activeScenario) {
          setActiveScenario(WarRoomViewModel.mapScenarios([data.activeScenario])[0]);
          setImpacts(WarRoomViewModel.mapImpacts(data.impacts));
          setEvidences(data.evidences);
        }
      } catch (e) {
        console.error('Failed to load War Room context', e);
      } finally {
        if (active) setLoading(false);
      }
    };
    loadContext();
    return () => { active = false; };
  }, [runtime, tenantId, organizationId, initialScenarioId]);

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
