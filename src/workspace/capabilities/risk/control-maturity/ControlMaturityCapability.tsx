import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useControlEffectiveness } from '../../../data/adapters/risk-intelligence.adapter';

interface ControlMaturityCapabilityProps {
  context: ExecutiveContext;
}

export const ControlMaturityCapability: React.FC<ControlMaturityCapabilityProps> = ({ context }) => {
  const { data, loading } = useControlEffectiveness(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Control Maturity...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Control Maturity</h1>
        <p className="text-slate-400 text-sm mt-1">Risk Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Maturity Level</h3>
          <div className="text-3xl font-light text-emerald-400 mt-4 capitalize">
            {data.controlMaturityLevel}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Effectiveness Index</h3>
          <div className="text-4xl font-light text-slate-100 mt-4 flex items-baseline gap-2">
            {data.controlEffectivenessIndex} <span className="text-lg text-slate-500">/ 100</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Failed Tests (30d)</h3>
          <div className="text-4xl font-light text-amber-400 mt-4">
            {data.failedTests30Days}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Recurrent Failures</h3>
          <div className="text-4xl font-light text-red-400 mt-4">
            {data.recurrentFailures}
          </div>
        </div>
      </div>
    </div>
  );
};
