import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useRiskExecutiveSummary } from '../../../data/adapters/risk-intelligence.adapter';

interface RiskOverviewCapabilityProps {
  context: ExecutiveContext;
}

export const RiskOverviewCapability: React.FC<RiskOverviewCapabilityProps> = ({ context }) => {
  const { data, loading } = useRiskExecutiveSummary(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Inteligência de Riscos...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Risk & Compliance Overview</h1>
        <p className="text-slate-400 text-sm mt-1">Risk Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Risk Health Score</h3>
          <div className="text-4xl font-light text-slate-100 mt-4 flex items-baseline gap-2">
            {data.healthScore.overallScore} <span className="text-lg text-slate-500">/ 100</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Critical Exposures</h3>
          <div className="text-4xl font-light text-red-400 mt-4">
            {data.criticalExposures}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Compliance Adherence</h3>
          <div className="text-4xl font-light text-emerald-400 mt-4">
            {data.complianceAdherenceIndex}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Overdue Action Plans</h3>
          <div className="text-4xl font-light text-amber-400 mt-4">
            {data.overdueActionPlans}
          </div>
        </div>
      </div>
    </div>
  );
};
