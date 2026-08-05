import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useEnterpriseRiskOverview } from '../../../data/adapters/risk-intelligence.adapter';

interface EnterpriseRiskCapabilityProps {
  context: ExecutiveContext;
}

export const EnterpriseRiskCapability: React.FC<EnterpriseRiskCapabilityProps> = ({ context }) => {
  const { data, loading } = useEnterpriseRiskOverview(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Enterprise Risk...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Enterprise Risk Management</h1>
        <p className="text-slate-400 text-sm mt-1">Risk Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Active Risks</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {data.activeRisksCount}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">High Prob/Impact</h3>
          <div className="text-4xl font-light text-red-400 mt-4">
            {data.highProbabilityHighImpact}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">No Clear Owner</h3>
          <div className="text-4xl font-light text-amber-400 mt-4">
            {data.risksWithNoOwner}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Trend</h3>
          <div className="text-3xl font-light text-slate-100 mt-4 capitalize">
            {data.riskExposureTrend}
          </div>
        </div>
      </div>
    </div>
  );
};
