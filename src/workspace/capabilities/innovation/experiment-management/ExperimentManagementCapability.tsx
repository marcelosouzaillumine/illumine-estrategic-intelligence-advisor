import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useExperimentManagement } from '../../../data/adapters/innovation-intelligence.adapter';

interface ExperimentManagementCapabilityProps {
  context: ExecutiveContext;
}

export const ExperimentManagementCapability: React.FC<ExperimentManagementCapabilityProps> = ({ context }) => {
  const { data, loading } = useExperimentManagement(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Gestão de Experimentos...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Experiment Management</h1>
        <p className="text-slate-400 text-sm mt-1">Innovation Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Active Experiments</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {data.activeExperiments}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Fast Fail Rate</h3>
          <div className="text-4xl font-light text-amber-400 mt-4">
            {data.fastFailRate}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Successful Conversions</h3>
          <div className="text-4xl font-light text-emerald-400 mt-4">
            {data.successfulConversions}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Funnel Yield</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {data.innovationFunnelYield}%
          </div>
        </div>
      </div>
    </div>
  );
};
