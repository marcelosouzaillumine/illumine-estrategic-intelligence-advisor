import React from 'react';
import { TemporalTrajectoryPoint } from '../../core/runtime/institutional-memory/types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface GovernanceTrajectoryGraphProps {
  series: TemporalTrajectoryPoint[];
}

export const GovernanceTrajectoryGraph: React.FC<GovernanceTrajectoryGraphProps> = ({ series }) => {
  if (!series || series.length === 0) {
    return null; // Dummy Renderer: Fail-closed se não houver dados.
  }

  // Formatting timestamp for display
  const data = series.map((point) => ({
    ...point,
    period: new Date(point.timestamp).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })
  }));

  // Extrair o lineage mais recente para o Audit Reference
  const latestLineage = series[series.length - 1].lineageHash.substring(0, 8);
  const confidence = series[series.length - 1].confidenceState.level;

  return (
    <div className="governance-trajectory-graph p-6 bg-slate-900 border border-slate-700 rounded-lg shadow-md text-slate-100">
      <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-50">Governance & Maturity Trajectory</h3>
          <p className="text-xs text-slate-400 mt-1">Longitudinal evolution of institutional scores</p>
        </div>
        <div className="text-right">
          <div className="text-xs font-mono text-slate-400">Ref Lineage: {latestLineage}</div>
          <div className="text-xs font-mono text-slate-400">Confidence: {confidence}</div>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="period" stroke="#94a3b8" fontSize={12} tickMargin={10} />
            <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
              itemStyle={{ fontSize: '13px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            <Line type="monotone" dataKey="temporalGovernanceScore" name="Gov Score" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="maturityScore" name="Maturity" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="fatigueScore" name="Fatigue" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" />
            <Line type="monotone" dataKey="deteriorationScore" name="Deterioration" stroke="#ef4444" strokeWidth={2} strokeDasharray="3 3" />
            <Line type="monotone" dataKey="resilienceScore" name="Resilience" stroke="#8b5cf6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* For SSR/Test accessibility since ResponsiveContainer drops children without DOM width */}
      <div className="hidden" aria-hidden="true" data-testid="graph-data-payload">
        {JSON.stringify(data)}
      </div>
    </div>
  );
};
