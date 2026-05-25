import React, { useState, useEffect } from 'react';
import { Activity, Play, ShieldAlert, History, TrendingUp, Network } from 'lucide-react';
import { cn } from '../../lib/utils';
import { RuntimeExecutionRegistry } from '../../core/runtime/observability/RuntimeExecutionRegistry';
import { RuntimeHealthMonitor } from '../../core/runtime/observability/RuntimeHealthMonitor';
import { ExecutionReplayEngine } from '../../core/runtime/observability/ExecutionReplayEngine';
import { RuntimeExecutionRecord, RuntimeHealthSnapshot, ReplayExecutionResult } from '../../core/runtime/observability/observability-types';
import { ConsolidatedExecutiveAdvisoryReport } from '../../core/runtime/consolidated/advisory/advisoryTypes';

// Simple fallback components inside the file for the MVP
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
  if (!replay) return <div className="text-sm text-muted-foreground">Selecione uma execução para Replay.</div>;
  const report = replay.snapshotReport;
  
  return (
    <div className="space-y-4">
      <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-lg flex items-center gap-2 text-rose-500 text-xs font-medium uppercase">
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
          <span className="text-lg font-bold text-foreground">{report.advisorySeverity}</span>
        </div>
      </div>

      <div className="p-4 bg-background border border-border rounded-xl">
        <h4 className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
          <ShieldAlert size={16} className="text-amber-500"/> Governance Violations
        </h4>
        <ul className="space-y-1">
          {report.governanceViolations.map((v, i) => (
            <li key={i} className="text-xs text-muted-foreground">• [{v.severity}] {v.message}</li>
          ))}
          {report.governanceViolations.length === 0 && <span className="text-xs text-emerald-500">Nenhuma violação.</span>}
        </ul>
      </div>
      
      <ExecutionTraceTree trace={replay.trace} />
    </div>
  );
}

export function RuntimeObservabilityPage() {
  const [executions, setExecutions] = useState<RuntimeExecutionRecord[]>([]);
  const [health, setHealth] = useState<RuntimeHealthSnapshot | null>(null);
  const [selectedExecution, setSelectedExecution] = useState<string | null>(null);
  const [activeReplay, setActiveReplay] = useState<ReplayExecutionResult | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const ex = await RuntimeExecutionRegistry.listAllExecutions();
    setExecutions(ex);
    const sn = await RuntimeHealthMonitor.generateSnapshot();
    setHealth(sn);
  };

  const handleSelectExecution = async (id: string) => {
    setSelectedExecution(id);
    const replay = await ExecutionReplayEngine.loadHistoricalReplay(id);
    setActiveReplay(replay);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in bg-background min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <Activity className="text-secondary" />
            Observabilidade Institucional
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Monitoramento operacional, telemetria e Explainability Forense do Motor de Inteligência Consolidada.
          </p>
        </div>
        <button onClick={loadData} className="px-4 py-2 border border-border rounded-button text-sm hover:bg-surface-container">
          Refresh Telemetry
        </button>
      </div>

      {health && (
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 border border-border rounded-xl bg-surface-container">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Execuções Totais</p>
            <p className="text-2xl font-bold text-foreground mt-1">{health.totalExecutions}</p>
          </div>
          <div className="p-4 border border-border rounded-xl bg-surface-container">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Avg Duration</p>
            <p className="text-2xl font-bold text-secondary mt-1">{health.avgDurationMs}ms</p>
          </div>
          <div className="p-4 border border-border rounded-xl bg-surface-container">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Failure Rate</p>
            <p className={cn("text-2xl font-bold mt-1", health.failureRate > 0 ? "text-rose-500" : "text-emerald-500")}>
              {(health.failureRate * 100).toFixed(1)}%
            </p>
          </div>
          <div className="p-4 border border-border rounded-xl bg-surface-container">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">Critical Blocks</p>
            <p className="text-2xl font-bold text-rose-500 mt-1">{health.criticalViolationsDetected}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-12 gap-8">
        {/* Left: Execution Timeline */}
        <div className="col-span-5 space-y-4">
          <h3 className="font-medium text-sm flex items-center gap-2"><TrendingUp size={16}/> Timeline de Execuções</h3>
          <div className="space-y-2">
            {executions.map(ex => (
              <div 
                key={ex.executionId}
                onClick={() => handleSelectExecution(ex.executionId)}
                className={cn(
                  "p-3 border rounded-xl cursor-pointer transition-all",
                  selectedExecution === ex.executionId ? "border-secondary bg-surface-container" : "border-border hover:border-neutral/30"
                )}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-mono text-muted-foreground">{new Date(ex.timestamp).toLocaleString()}</span>
                  <span className={cn("text-[10px] px-2 py-0.5 rounded uppercase font-bold", 
                    ex.executionStatus === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-500" : 
                    ex.executionStatus === 'BLOCKED' ? "bg-amber-500/10 text-amber-500" : "bg-rose-500/10 text-rose-500"
                  )}>
                    {ex.executionStatus}
                  </span>
                </div>
                <div className="flex gap-4 text-xs">
                  <span>Group: <span className="font-medium">{ex.groupId}</span></span>
                  <span>Duration: <span className="font-mono">{ex.runtimeDurationMs}ms</span></span>
                </div>
              </div>
            ))}
            {executions.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma execução registrada.</p>}
          </div>
        </div>

        {/* Right: Replay Panel */}
        <div className="col-span-7">
          <div className="p-6 border border-border rounded-2xl bg-background shadow-sm h-full">
            <ExecutionReplayPanel replay={activeReplay} />
          </div>
        </div>
      </div>
    </div>
  );
}
