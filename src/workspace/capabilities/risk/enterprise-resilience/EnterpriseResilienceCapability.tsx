import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useEnterpriseResilience } from '../../../data/adapters/risk-intelligence.adapter';

interface EnterpriseResilienceCapabilityProps {
  context: ExecutiveContext;
}

export const EnterpriseResilienceCapability: React.FC<EnterpriseResilienceCapabilityProps> = ({ context }) => {
  const { data, loading } = useEnterpriseResilience(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Resiliência Corporativa...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Enterprise Resilience</h1>
        <p className="text-slate-400 text-sm mt-1">Risk Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Readiness Index</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {data.resilienceReadinessIndex}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">No Continuity Plan</h3>
          <div className="text-4xl font-light text-red-400 mt-4">
            {data.processesWithoutContinuityPlan}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Suppliers at Risk</h3>
          <div className="text-4xl font-light text-amber-400 mt-4">
            {data.criticalSuppliersAtRisk}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Key Person Dependency</h3>
          <div className="text-4xl font-light text-amber-400 mt-4">
            {data.keyPersonDependencyCount}
          </div>
        </div>
      </div>
    </div>
  );
};
