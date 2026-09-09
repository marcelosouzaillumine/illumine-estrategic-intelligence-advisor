import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useLeadershipIntelligence } from '../../../data/adapters/people-intelligence.adapter';

interface LeadershipCapabilityProps {
  context: ExecutiveContext;
}

export const LeadershipCapability: React.FC<LeadershipCapabilityProps> = ({ context }) => {
  const { data, loading } = useLeadershipIntelligence(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Inteligência de Liderança...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Leadership Governance</h1>
        <p className="text-slate-400 text-sm mt-1">People Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Leadership Readiness</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {(data.leadershipReadiness * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Succession Pipeline Coverage</h3>
          <div className="text-4xl font-light text-slate-100 mt-4 text-emerald-400">
            {(data.successionPipelineCoverage * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Strategic Alignment</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {(data.strategicAlignment * 100).toFixed(1)}%
          </div>
        </div>
      </div>
    </div>
  );
};
