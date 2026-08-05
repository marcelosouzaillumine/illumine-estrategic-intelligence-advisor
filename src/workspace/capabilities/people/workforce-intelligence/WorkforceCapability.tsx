import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useWorkforceIntelligence, useWorkforceCapacity } from '../../../data/adapters/people-intelligence.adapter';

interface WorkforceCapabilityProps {
  context: ExecutiveContext;
}

export const WorkforceCapability: React.FC<WorkforceCapabilityProps> = ({ context }) => {
  const { data: workforce, loading: loadingWF } = useWorkforceIntelligence(context);
  const { data: capacity, loading: loadingCap } = useWorkforceCapacity(context);

  if (loadingWF || loadingCap) return <div className="p-8 text-slate-400">Processando Workforce Intelligence...</div>;
  if (!workforce || !capacity) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Workforce & Capacity Intelligence</h1>
        <p className="text-slate-400 text-sm mt-1">People Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Total Headcount</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {workforce.headcount}
          </div>
          <div className="text-sm text-slate-400 mt-2">
            Open Positions: <span className="text-emerald-400">{workforce.openPositions}</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Turnover Rate</h3>
          <div className="text-4xl font-light text-slate-100 mt-4 text-amber-400">
            {(workforce.turnoverRate * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Capacity Utilization</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {((capacity.utilizedCapacity / capacity.installedCapacity) * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-slate-400 mt-2">
            Installed: {capacity.installedCapacity}h
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Overload Index</h3>
          <div className="text-4xl font-light text-slate-100 mt-4 text-red-400">
            {(capacity.overloadIndex * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-6">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4">Critical Human Bottlenecks</h3>
        <ul className="space-y-3">
          {capacity.criticalBottlenecks.map((bottleneck, idx) => (
            <li key={idx} className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-slate-200">{bottleneck}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
