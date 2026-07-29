
// Simple fallback components inside the file for the MVP

import React, { useState, useEffect } from 'react';
import { Activity, Play, ShieldAlert, History, TrendingUp, Network, RefreshCw } from 'lucide-react';
import { PageHeader, StatusBadge } from '../Common';
import { cn } from '../../lib/utils';
import { FiduciaryRuntimeAdapter } from '../../services/FiduciaryRuntimeAdapter';
import { RuntimeExecutionRecord, RuntimeHealthSnapshot, ReplayExecutionResult } from '../../services/FiduciaryRuntimeAdapter';
import { ConsolidatedExecutiveAdvisoryReport } from '../../services/FiduciaryRuntimeAdapter';
import { ExecutivePageTemplate } from '../ui/executive-page-template';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveAccordion } from '../ui/executive-accordion';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { createPortal } from 'react-dom';
import { ExecutiveSummarySection } from '../ui/executive-summary-section';
import { ExecutiveStrategicTensions } from '../ui/executive-strategic-tensions';
import { ExecutiveDecisionTrace } from '../ui/executive-decision-trace';
import { useRuntimeObservabilityPageViewModel } from '../../viewmodels/useRuntimeObservabilityPageViewModel';
import { useRuntimeObservabilityViewModel } from '../../viewmodels/useRuntimeObservabilityViewModel';

function ExecutionTraceTree({ trace }: { trace: any }) {
  if (!trace) return null;
  return (
    <div className="p-4 bg-surface-container/50 border border-border rounded-xl space-y-2">
      <h3 className="text-sm font-medium text-foreground flex items-center gap-2"><Network size={16}/> Execution Trace Tree</h3>
      <div className="space-y-1">
        {trace.stages.map((s: any, i: number) => (
          <div key={i} className="flex justify-between text-xs p-2 rounded bg-background border border-border">
            <span className={cn(s.status === 'SUCCESS' ? 'text-emerald-500' : 'text-rose-500')}>{s.stageName}</span>
            <span className="text-muted-foreground font-mono">{s.durationMs}ms</span>
          </div>
        ))}
        <div className="flex justify-between text-xs p-2 rounded bg-secondary/10 border border-secondary/20">
          <span className="text-secondary font-medium">TOTAL RUNTIME</span>
          <span className="text-secondary font-mono">{trace.totalDurationMs}ms</span>
        </div>
      </div>
    </div>
  );
}

function ExecutionReplayPanel({ replay }: { replay: ReplayExecutionResult | null }) {
 if (!replay) return <div className="text-sm text-executive-secondary">Selecione uma execução para Replay.</div>;
  const report = replay.snapshotReport as any as ConsolidatedExecutiveAdvisoryReport;
  
  return (
    <div className="space-y-4">
      <div className="bg-critical-soft0/10 border border-rose-500/30 p-3 rounded-lg flex items-center gap-2 text-rose-500 text-xs font-medium uppercase">
        <History size={14} /> FORENSIC REPLAY MODE - READING IMMUTABLE SNAPSHOT (VERSION: {replay.executionRecord.runtimeVersion})
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-surface-container border border-border rounded-xl">
          <h4 className="text-xs font-medium text-foreground uppercase tracking-widest mb-2">Final Confidence</h4>
          <span className={cn("text-lg font-bold", 
            report.finalConfidence === 'HIGH' ? 'text-emerald-500' : 
            report.finalConfidence === 'MEDIUM' ? 'text-amber-500' : 'text-rose-500'
          )}>
            {report.finalConfidence}
          </span>
        </div>
        
        <div className="p-4 bg-surface-container border border-border rounded-xl">
          <h4 className="text-xs font-medium text-foreground uppercase tracking-widest mb-2">Advisory Severity</h4>
          <span className="text-lg font-bold text-foreground">{report.violations.some(v => v.severity === 'CRITICAL') ? 'CRITICAL' : 'MODERATE'}</span>
        </div>
      </div>

      <div className="p-4 bg-background border border-border rounded-xl">
        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <ShieldAlert size={16} className="text-amber-500"/> Governance Violations
        </h4>
        <ul className="space-y-1">
          {report.violations.map((v, i) => (
            <li key={i} className="text-xs text-muted-foreground">• [{v.severity}] {v.message}</li>
          ))}
          {report.violations.length === 0 && <span className="text-xs text-emerald-500">Nenhuma violação.</span>}
        </ul>
      </div>
      
      <ExecutionTraceTree trace={replay.trace} />
    </div>
  );
}


export function RuntimeObservabilityPage() {
  // Adapter: useRuntimeObservabilityPageAdapter
  // ViewModel: useRuntimeObservabilityPageViewModel
  const { state: vmState, computed: vmComputed, actions: vmActions } = useRuntimeObservabilityPageViewModel({ clientId: '' });
  const portal = createPortal;
  const [executions, setExecutions] = useState<RuntimeExecutionRecord[]>([]);
  const [health, setHealth] = useState<RuntimeHealthSnapshot | null>(null);
  const [selectedExecution, setSelectedExecution] = useState<string | null>(null);
  const [activeReplay, setActiveReplay] = useState<ReplayExecutionResult | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const ex = await FiduciaryRuntimeAdapter.RuntimeExecutionRegistry.listAllExecutions();
    setExecutions(ex);
    const sn = await FiduciaryRuntimeAdapter.RuntimeHealthMonitor.generateSnapshot();
    setHealth(sn);
  };

  const handleSelectExecution = async (id: string) => {
    setSelectedExecution(id);
    const res = await FiduciaryRuntimeAdapter.ExecutionReplayEngine.loadHistoricalReplay(id);
    setActiveReplay(res);
  };

  return (
    <ExecutivePageTemplate header={{
      title: "Observabilidade Institucional",
      description: "Monitoramento operacional, telemetria e Explainability Forense do Motor de Inteligência Consolidada.",
    }}>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">

        <div className="flex items-center gap-3">
          <StatusBadge status="Verde" label="Telemetry Connected" />
        </div>
        <button onClick={loadData} className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-zinc-800 transition-colors shrink-0">
          <RefreshCw size={14} /> Refresh Telemetry
        </button>
      
      </div>

      <div className="mt-12 mb-8 border-t border-border pt-8" />
      <ExecutiveAccordion
        title="Painel de Monitoramento de Execuções"
        subtitle="Analise a integridade, velocidade e rastreabilidade forense do sistema."
        variant="analytics"
        defaultExpanded
      >

      <div className="space-y-12">

      {health && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card-premium p-6 space-y-2">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Execuções Totais</p>
            <p className="text-h3 font-medium text-foreground tabular-nums">{health.totalExecutions}</p>
          </div>
          <div className="card-premium p-6 space-y-2">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Avg Duration</p>
      <p className="text-h3 font-medium text-executive-secondary tabular-nums">{health.avgDurationMs}ms</p>
          </div>
          <div className="card-premium p-6 space-y-2">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Failure Rate</p>
            <p className={cn("text-h3 font-medium tabular-nums", health.failureRate > 0 ? "text-destructive" : "text-success")}>
              {(health.failureRate * 100).toFixed(1)}%
            </p>
          </div>
          <div className="card-premium p-6 space-y-2">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Critical Blocks</p>
            <p className="text-h3 font-medium text-destructive tabular-nums">{health.criticalViolationsDetected}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-8">
        {/* Left: Execution Timeline */}
        <div className="col-span-5 space-y-4">
          <h3 className="text-h3 font-medium text-foreground tracking-tight flex items-center gap-2"><TrendingUp size={18}/> Timeline de Execuções</h3>
          <div className="space-y-2">
            {executions.map(ex => (
              <div 
                key={ex.executionId}
                onClick={() => handleSelectExecution(ex.executionId)}
                className={cn(
                  "p-4 border rounded-md cursor-pointer transition-all",
                  selectedExecution === ex.executionId ? "border-secondary bg-surface-container shadow-sm" : "border-border hover:border-secondary/30"
                )}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-mono text-muted-foreground">{new Date(ex.timestamp).toLocaleString()}</span>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-button uppercase font-bold", 
                    ex.executionStatus === 'COMPLETED' ? "bg-success-soft text-success" : 
                    ex.executionStatus === 'BLOCKED' ? "bg-warning-soft text-warning" : "bg-critical-soft text-destructive"
                  )}>
                    {ex.executionStatus}
                  </span>
                </div>
                <div className="flex gap-4 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  <span>Group: <span className="text-foreground font-bold">{ex.groupId}</span></span>
                  <span>Duration: <span className="font-mono text-foreground">{ex.runtimeDurationMs}ms</span></span>
                </div>
              </div>
            ))}
      {executions.length === 0 && <p className="text-body-sm text-executive-secondary">Nenhuma execução registrada.</p>}
          </div>
        </div>

        {/* Right: Replay Panel */}
        <div className="col-span-7">
          <div className="card-premium p-8 h-full">
            <ExecutionReplayPanel replay={activeReplay} />
          </div>
        </div>
      </div>
       <ExecutiveSummarySection 
         status={{ label: 'Runtime Saudável', variant: 'success' }}
         question="Como garantir a auditoria e rastreabilidade forense das execuções do sistema?"
         opinion="O comitê fiduciário homologa a telemetria do motor de inteligência e o log determinístico de decisões."
         driver="Uptime do sistema, latência de execução e árvore de rastreamento forense."
         implication="Garantia de auditabilidade integral e ausência de alucinações nos pareceres automáticos."
         action="Manter a retenção contínua dos logs de observabilidade por 5 anos."
       >
         <ExecutiveStrategicTensions tensions={[]} />
         <ExecutiveDecisionTrace trace={[]} />
       </ExecutiveSummarySection>
      </div>
      </ExecutiveAccordion>
    </ExecutivePageTemplate>
  );
}
