import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useComplianceIntelligence } from '../../../data/adapters/risk-intelligence.adapter';

interface ComplianceCapabilityProps {
  context: ExecutiveContext;
}

export const ComplianceCapability: React.FC<ComplianceCapabilityProps> = ({ context }) => {
  const { data, loading } = useComplianceIntelligence(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Compliance...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Compliance Intelligence</h1>
        <p className="text-slate-400 text-sm mt-1">Risk Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Adherence Index</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {data.complianceAdherenceIndex}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Critical Gaps</h3>
          <div className="text-4xl font-light text-red-400 mt-4">
            {data.criticalComplianceGaps}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Upcoming Deadlines</h3>
          <div className="text-4xl font-light text-amber-400 mt-4">
            {data.upcomingDeadlines30Days}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Non-Conformities</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {data.nonConformities}
          </div>
        </div>
      </div>
    </div>
  );
};
