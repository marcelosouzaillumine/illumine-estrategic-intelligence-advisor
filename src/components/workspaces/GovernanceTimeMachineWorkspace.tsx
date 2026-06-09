import React, { useState, useEffect } from 'react';
import { History, Database, Network } from 'lucide-react';
import { PageHeader } from '../Common';
import { GovernanceTimeMachineViewModel } from '../../viewmodels/temporal/GovernanceTimeMachineViewModel';
import { TimelineExplorer } from '../temporal/TimelineExplorer';
import { SnapshotComparisonPanel } from '../temporal/SnapshotComparisonPanel';
import { HistoricalEvidencePanel } from '../temporal/HistoricalEvidencePanel';
import { InstitutionalChangePanel } from '../temporal/InstitutionalChangePanel';
import { InstitutionalTimeline } from '../../types/temporal/InstitutionalTimeline';
import { TemporalSnapshot } from '../../types/temporal/TemporalSnapshot';
import { TimelineEvent } from '../../types/temporal/TimelineEvent';
import { TemporalLineage } from '../../types/temporal/TemporalLineage';
import { InstitutionalMilestone } from '../../types/temporal/InstitutionalMilestone';
import { TemporalProvenanceRecord } from '../../types/temporal/TemporalProvenanceRecord';

import { InstitutionalDriftEngine } from '../../core/temporal/InstitutionalDriftEngine';
import { GovernanceTimeMachineRuntime } from '../../core/temporal/GovernanceTimeMachineRuntime';
import { ExecutiveTimeMachineDashboard } from '../temporal/ExecutiveTimeMachineDashboard';
import { useNavigate } from 'react-router-dom';

interface GovernanceTimeMachineWorkspaceProps {
  viewModel: GovernanceTimeMachineViewModel;
  runtime: GovernanceTimeMachineRuntime;
  driftEngine: InstitutionalDriftEngine;
  tenantId: string;
  timelineId: string;
}

export const GovernanceTimeMachineWorkspace: React.FC<GovernanceTimeMachineWorkspaceProps> = ({
  viewModel,
  runtime,
  driftEngine,
  tenantId,
  timelineId
}) => {
  const navigate = useNavigate();

  const handleCrossNavigation = (targetWorkspace: string, path: string) => {
    const navRef = {
      tenantId,
      sourceWorkspace: 'TIME_MACHINE',
      targetWorkspace,
      correlationId: `nav-${Date.now()}`
    };
    navigate(path, { state: { navRef } });
  };

  const [timeline, setTimeline] = useState<InstitutionalTimeline | null>(null);
  const [snapshots, setSnapshots] = useState<TemporalSnapshot[]>([]);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [milestones, setMilestones] = useState<InstitutionalMilestone[]>([]);
  
  const [selectedEventId, setSelectedEventId] = useState<string | undefined>();
  const [activeLineage, setActiveLineage] = useState<TemporalLineage | null>(null);
  const [activeProvenance, setActiveProvenance] = useState<TemporalProvenanceRecord | null>(null);
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContext = async () => {
      setLoading(true);
      try {
        const { timeline: t, snapshots: s, events: e } = await viewModel.fetchHistoricalContext(tenantId, timelineId);
        const m = await viewModel.fetchMilestones(tenantId, timelineId);
        
        setTimeline(t);
        setSnapshots(s);
        setEvents(e);
        setMilestones(m);
      } catch (err) {
        console.error("Failed to load time machine context:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContext();
  }, [tenantId, timelineId, viewModel]);

  // Handler for event selection
  const handleSelectEvent = async (eventId: string) => {
    setSelectedEventId(eventId);
    const ev = events.find(e => e.eventId === eventId);
    if (!ev) return;

    // Simulate fetching lineage based on event's snapshot transitions
    // In reality, this would map the event to the related snapshots
    // For this boilerplate, we're using mock queries
    const lineage = await viewModel.fetchSnapshotComparison(tenantId, "snap-001", "snap-002");
    setActiveLineage(lineage);

    const provenance = await viewModel.fetchProvenance(tenantId, `prov-${eventId}`);
    setActiveProvenance(provenance);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="text-eyebrow text-muted-foreground mt-4">Carregando Histórico Institucional...</p>
      </div>
    );
  }

  if (!timeline) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground">
        <History size={48} className="mb-4 text-muted-foreground/60" />
        <p>Nenhuma Linha do Tempo localizada para este escopo.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-8 pb-32 animate-executive-fade">
      <div className="flex justify-between items-start mb-4">
        <PageHeader
          title="Governance Time Machine"
          subtitle="Navegação Histórica e Auditabilidade Institucional"
          icon={History}
          transparent
        />
        <div className="flex gap-2">
          <button
            onClick={() => handleCrossNavigation('INTELLIGENCE_FABRIC', `/intelligence/root`)}
            className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent text-accent text-sm font-display font-medium rounded-[12px] transition-colors border border-accent shadow-sm"
          >
            <Network size={16} />
            <span>Intelligence Fabric</span>
          </button>
          <button
            onClick={() => handleCrossNavigation('ADVISOR', `/advisor`)}
            className="btn-secondary"
          >
            <History size={16} className="text-teal-400" />
            <span>Voltar ao Advisor Workspace</span>
          </button>
          <button
            onClick={() => handleCrossNavigation('DIGITAL_TWIN', `/digital-twin`)}
            className="btn-secondary"
          >
            <History size={16} className="text-primary" />
            <span>Voltar ao Digital Twin</span>
          </button>
          <button
            onClick={() => handleCrossNavigation('WAR_ROOM', `/war-room`)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-sm font-display font-medium rounded-[12px] transition-colors border border-amber-500/30 shadow-sm"
          >
            <span>Ver Evolução dos Cenários</span>
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

      <ExecutiveTimeMachineDashboard 
        runtime={runtime} 
        driftEngine={driftEngine} 
        tenantId={tenantId} 
        timelineId={timelineId} 
      />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        
        {/* Coluna 1: Linha do Tempo */}
        <div className="xl:col-span-4 card-premium p-6 h-[800px] overflow-y-auto">
          <TimelineExplorer 
            events={events} 
            milestones={milestones} 
            selectedEventId={selectedEventId}
            onSelectEvent={handleSelectEvent}
          />
        </div>

        {/* Coluna Central & Direita: Detalhes do Estado e Comparação */}
        <div className="xl:col-span-8 space-y-8">
          
          <SnapshotComparisonPanel lineage={activeLineage} />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <InstitutionalChangePanel lineage={activeLineage} />
            <HistoricalEvidencePanel provenance={activeProvenance} />
          </div>
          
        </div>
      </div>
    </div>
  );
};
