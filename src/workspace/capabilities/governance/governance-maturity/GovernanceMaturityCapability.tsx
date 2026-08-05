import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useGovernanceMaturity } from '../../../data/adapters/governance-intelligence.adapter';

interface GovernanceMaturityCapabilityProps {
  context: ExecutiveContext;
}

export const GovernanceMaturityCapability: React.FC<GovernanceMaturityCapabilityProps> = ({ context }) => {
  const { data, loading } = useGovernanceMaturity(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Governance Maturity...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Governance Maturity</h1>
        <p className="text-slate-400 text-sm mt-1">Governance Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Process Maturity</h3>
          <div className="text-2xl font-light text-emerald-400 mt-4">
            {data.processMaturityLevel}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Active Forums</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {data.activeForumsCount}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Cadence Adherence</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {(data.managementCadenceAdherence * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Transparency Index</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {data.transparencyIndex} <span className="text-lg text-slate-500">/ 100</span>
          </div>
        </div>
      </div>
    </div>
  );
};
