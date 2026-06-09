import React, { useEffect, useState } from 'react';
import { History, Target, AlertTriangle, Layers } from 'lucide-react';
import { GovernanceTimeMachineRuntime } from '../../core/temporal/GovernanceTimeMachineRuntime';
import { InstitutionalDriftEngine } from '../../core/temporal/InstitutionalDriftEngine';

interface ExecutiveTimeMachineDashboardProps {
  runtime: GovernanceTimeMachineRuntime;
  driftEngine: InstitutionalDriftEngine;
  tenantId: string;
  timelineId: string;
}

export const ExecutiveTimeMachineDashboard: React.FC<ExecutiveTimeMachineDashboardProps> = ({
  runtime,
  driftEngine,
  tenantId,
  timelineId
}) => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalSnapshots: 0,
    structuralPivots: 0,
    newRisks: 0,
    loading: true
  });

  useEffect(() => {
    const load = async () => {
      try {
        const history = await runtime.loadInstitutionalHistory(tenantId, timelineId);
        const drift = await driftEngine.detectDrift(tenantId, timelineId);

        setStats({
          totalEvents: history.events.length,
          totalSnapshots: history.snapshots.length,
          structuralPivots: drift.structuralPivots,
          newRisks: drift.newRisksDetected,
          loading: false
        });
      } catch (err) {
        console.error("Dashboard failed to load temporal stats:", err);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };
    load();
  }, [runtime, driftEngine, tenantId, timelineId]);

  if (stats.loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-24 bg-slate-900 rounded-xl border border-border"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Total Events */}
      <div className="card-premium p-5 flex items-center justify-between">
        <div>
          <span className="text-eyebrow text-muted-foreground block mb-1">Eventos Históricos</span>
          <span className="text-h2 font-display font-black text-foreground tabular-nums">{stats.totalEvents}</span>
        </div>
        <History size={24} className="text-primary" />
      </div>

      {/* Total Snapshots */}
      <div className="card-premium p-5 flex items-center justify-between">
        <div>
          <span className="text-eyebrow text-muted-foreground block mb-1">Snapshots Persistidos</span>
          <span className="text-h2 font-display font-black text-foreground tabular-nums">{stats.totalSnapshots}</span>
        </div>
        <Target size={24} className="text-sky-400/50" />
      </div>

      {/* Structural Pivots */}
      <div className="card-premium p-5 flex items-center justify-between">
        <div>
          <span className="text-eyebrow text-muted-foreground block mb-1">Pivôs Estruturais</span>
          <span className="text-h2 font-display font-black text-emerald-400 tabular-nums">{stats.structuralPivots}</span>
        </div>
        <Layers size={24} className="text-emerald-400/50" />
      </div>

      {/* New Risks */}
      <div className="card-premium p-5 flex items-center justify-between">
        <div>
          <span className="text-eyebrow text-muted-foreground block mb-1">Riscos Emergentes</span>
          <span className="text-h2 font-display font-black text-amber-400 tabular-nums">{stats.newRisks}</span>
        </div>
        <AlertTriangle size={24} className="text-amber-400/50" />
      </div>
    </div>
  );
};
