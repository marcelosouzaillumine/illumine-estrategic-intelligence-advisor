import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useOpportunityIntelligence } from '../../../data/adapters/innovation-intelligence.adapter';

interface OpportunityIntelligenceCapabilityProps {
  context: ExecutiveContext;
}

export const OpportunityIntelligenceCapability: React.FC<OpportunityIntelligenceCapabilityProps> = ({ context }) => {
  const { data, loading } = useOpportunityIntelligence(context);

  if (loading) return <div className="p-8 text-slate-400">Analisando Oportunidades...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Opportunity Governance</h1>
        <p className="text-slate-400 text-sm mt-1">Innovation Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Market Trends</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {data.mappedMarketTrends}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Disruptive Threats</h3>
          <div className="text-4xl font-light text-red-400 mt-4">
            {data.disruptiveThreats}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">New Theses</h3>
          <div className="text-4xl font-light text-emerald-400 mt-4">
            {data.newBusinessTheses}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Capture Rate</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {data.opportunityCaptureRate}%
          </div>
        </div>
      </div>
    </div>
  );
};
