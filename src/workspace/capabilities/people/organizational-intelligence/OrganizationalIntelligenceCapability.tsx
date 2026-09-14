import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useOrganizationalIntelligence } from '../../../data/adapters/people-intelligence.adapter';

interface OrganizationalIntelligenceCapabilityProps {
  context: ExecutiveContext;
}

export const OrganizationalIntelligenceCapability: React.FC<OrganizationalIntelligenceCapabilityProps> = ({ context }) => {
  const { data, loading } = useOrganizationalIntelligence(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Inteligência Organizacional...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Organizational Governance</h1>
        <p className="text-slate-400 text-sm mt-1">People Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Cross-Functional Collab</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {(data.crossFunctionalCollaboration * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Silo Index</h3>
          <div className="text-4xl font-light text-slate-100 mt-4 text-amber-400">
            {(data.siloIndex * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-slate-400 mt-2">
            Higher indicates isolation
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Knowledge Concentration</h3>
          <div className="text-4xl font-light text-slate-100 mt-4 text-red-400">
            {(data.knowledgeConcentrationRisk * 100).toFixed(1)}%
          </div>
          <div className="text-sm text-slate-400 mt-2">
            Key-person dependency risk
          </div>
        </div>
      </div>
    </div>
  );
};
