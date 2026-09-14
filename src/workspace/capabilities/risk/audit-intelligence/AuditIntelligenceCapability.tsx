import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useAuditIntelligence } from '../../../data/adapters/risk-intelligence.adapter';

interface AuditIntelligenceCapabilityProps {
  context: ExecutiveContext;
}

export const AuditIntelligenceCapability: React.FC<AuditIntelligenceCapabilityProps> = ({ context }) => {
  const { data, loading } = useAuditIntelligence(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Auditoria...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Audit Governance</h1>
        <p className="text-slate-400 text-sm mt-1">Risk Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Open Findings</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {data.openAuditFindings}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Critical Findings</h3>
          <div className="text-4xl font-light text-red-400 mt-4">
            {data.criticalFindings}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Recurrent Issues</h3>
          <div className="text-4xl font-light text-amber-400 mt-4">
            {data.recurrentAuditIssues}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Avg Resolution Time</h3>
          <div className="text-4xl font-light text-slate-100 mt-4 flex items-baseline gap-2">
            {data.averageResolutionTimeDays} <span className="text-lg text-slate-500">days</span>
          </div>
        </div>
      </div>
    </div>
  );
};
