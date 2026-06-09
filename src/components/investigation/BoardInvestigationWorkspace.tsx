import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BoardInvestigationRuntime } from '../../core/investigation/BoardInvestigationRuntime';
import { BoardInvestigationViewModel, UIBoardInvestigationViewModel } from '../../viewmodels/investigation/BoardInvestigationViewModel';
import { ExecutiveInvestigationDashboard } from './ExecutiveInvestigationDashboard';
import { InvestigationTimeline } from './InvestigationTimeline';
import { RelationshipExplorer } from './RelationshipExplorer';
import { Search, Info, History, ShieldAlert, Database, Network } from 'lucide-react';
import { InstitutionalObservabilityRegistry } from '../../core/observability/InstitutionalObservabilityRegistry';

export const BoardInvestigationWorkspace: React.FC = () => {
  const { tenantId, nodeId } = useParams<{ tenantId: string; nodeId: string }>();
  const navigate = useNavigate();

  const handleCrossNavigation = (targetWorkspace: string, path: string) => {
    const navRef = {
      tenantId: tenantId || 'SYSTEM_TENANT',
      sourceWorkspace: 'INVESTIGATION',
      targetWorkspace,
      correlationId: `nav-${Date.now()}`
    };
    navigate(path, { state: { navRef } });
  };

  const [data, setData] = useState<UIBoardInvestigationViewModel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!nodeId) return;
      setLoading(true);
      
      const tenantId = 'SYSTEM_TENANT'; // In a real app this comes from auth context
      const userId = 'CURRENT_USER';
      const correlationId = crypto.randomUUID();

      await InstitutionalObservabilityRegistry.recordEvent({
        eventId: crypto.randomUUID(),
        eventType: 'INVESTIGATION_STARTED',
        tenantId,
        correlationId,
        engineId: 'BoardInvestigationWorkspace',
        timestamp: new Date().toISOString(),
        severity: 'INFO',
        userId,
        role: 'SYSTEM',
        lineageId: 'N/A',
        runtimeAuthority: 'System',
        sourceModule: 'InvestigationWorkspace',
        targetOutput: 'UI',
        metadata: { targetNodeId: nodeId }
      });

      const { result } = await BoardInvestigationRuntime.startInvestigation({
        objectId: `ctx-${Date.now()}`,
        objectType: 'INVESTIGATION_CONTEXT',
        title: `Investigação do nó ${nodeId}`,
        description: 'Contexto de investigação em tempo real',
        sourceDomain: 'BoardInvestigation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tenantId: tenantId || 'SYSTEM_TENANT',
        userId,
        correlationId,
        lineageId: 'N/A'
      }, nodeId);

      if (active) {
        setData(BoardInvestigationViewModel.adapt(result));
        setLoading(false);
      }
    };

    load();

    return () => {
      active = false;
      // Triggers when component unmounts or nodeId changes
      InstitutionalObservabilityRegistry.recordEvent({
        eventId: crypto.randomUUID(),
        eventType: 'INVESTIGATION_ENDED',
        tenantId: 'SYSTEM_TENANT',
        correlationId: 'N/A',
        engineId: 'BoardInvestigationWorkspace',
        timestamp: new Date().toISOString(),
        severity: 'INFO',
        userId: 'CURRENT_USER',
        role: 'SYSTEM',
        lineageId: 'N/A',
        runtimeAuthority: 'System',
        sourceModule: 'InvestigationWorkspace',
        targetOutput: 'UI'
      }).catch(console.error);
    };
  }, [nodeId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground">
        <Search className="animate-pulse mb-4 text-primary" size={32} />
        <p className="text-eyebrow text-muted-foreground">Iniciando Investigação Institucional...</p>
      </div>
    );
  }

  if (!data?.targetNode) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground">
        <Info className="mb-4 text-amber-500" size={32} />
        <p className="text-eyebrow text-muted-foreground">Nó não encontrado na memória institucional persistida.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-6 lg:px-10 space-y-8 pb-32 animate-executive-fade">
      <header className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-h1 font-display font-black text-foreground tracking-tight flex items-center gap-2">
              <Search className="text-primary" />
              Workspace de Investigação
            </h1>
            <p className="text-sm text-muted-foreground max-w-2xl">
              Este ambiente não calcula novas métricas. Ele atua exclusivamente como lente sobre a memória causal da organização.
            </p>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={() => handleCrossNavigation('INTELLIGENCE_FABRIC', `/intelligence/${nodeId}`)}
              className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent text-accent text-sm font-display font-medium rounded-[12px] transition-colors border border-accent shadow-sm"
            >
              <Network size={16} />
              <span>Contexto no Intelligence Fabric</span>
            </button>
            <button
              onClick={() => handleCrossNavigation('WAR_ROOM', `/war-room`)}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-sm font-display font-medium rounded-[12px] transition-colors border border-amber-500/30 shadow-sm"
            >
              <span>Testar em War Room</span>
            </button>
            <button
              onClick={() => handleCrossNavigation('DIGITAL_TWIN', `/digital-twin`)}
              className="btn-secondary"
            >
              <span>Voltar ao Digital Twin</span>
            </button>
            <button
              onClick={() => handleCrossNavigation('TIME_MACHINE', `/governance-time-machine/${nodeId}`)}
              className="btn-secondary"
            >
              <History size={16} className="text-teal-400" />
              <span>Ver na Time Machine</span>
            </button>
            <button
              onClick={() => handleCrossNavigation('MEMORY', `/memory`)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-sm font-display font-medium rounded-[12px] transition-colors border border-emerald-500/30 shadow-sm"
            >
              <Database size={16} />
              <span>Memória Institucional</span>
            </button>
          </div>
        </div>
      </header>

      <ExecutiveInvestigationDashboard metrics={data.metrics} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="card-premium p-5">
            <span className="text-[10px] uppercase font-bold tracking-widest text-primary mb-2 block">Objeto Investigado</span>
            <h2 className="text-h3 font-display font-bold text-foreground leading-snug">
              {data.targetNode.title}
            </h2>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="text-xs font-mono bg-surface-container text-muted-foreground px-2 py-1 rounded">
                {data.targetNode.type}
              </span>
              <span className="text-xs font-bold uppercase tracking-wider bg-primary text-primary px-2 py-1 rounded">
                {data.targetNode.confidence}
              </span>
            </div>
            {data.targetNode.description && (
              <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                {data.targetNode.description}
              </p>
            )}
          </div>

          <InvestigationTimeline timeline={[data.targetNode]} /> 
          {/* Note: The UI just renders what the ViewModel gives. In a complete scenario, timeline might come from loadTimeline. For layout purposes we just pass the node if there's no temporal array in VM yet. */}
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <RelationshipExplorer title="Evidências" nodes={data.evidences} />
            <RelationshipExplorer title="Causas (Drivers)" nodes={data.causes} />
            <div className="space-y-6">
              <RelationshipExplorer title="Dependências" nodes={data.dependencies} />
              <RelationshipExplorer title="Impactos" nodes={data.impacts} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
