import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useStrategicAlignment } from '../../../data/adapters/governance-intelligence.adapter';

interface StrategicAlignmentCapabilityProps {
  context: ExecutiveContext;
}

export const StrategicAlignmentCapability: React.FC<StrategicAlignmentCapabilityProps> = ({ context }) => {
  const { data, loading } = useStrategicAlignment(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Alinhamento Estratégico...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Strategic Alignment</h1>
        <p className="text-slate-400 text-sm mt-1">Governance Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Strategy Execution Index</h3>
          <div className="text-4xl font-light text-slate-100 mt-4 flex items-baseline gap-2">
            {data.strategyExecutionIndex} <span className="text-lg text-slate-500">/ 100</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">OKRs On Track</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {(data.okrsOnTrackPercentage * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Critical Goals at Risk</h3>
          <div className="text-4xl font-light text-red-400 mt-4">
            {data.criticalGoalsAtRisk}
          </div>
        </div>
      </div>
    </div>
  );
};
