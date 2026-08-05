import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useCapabilityDevelopment } from '../../../data/adapters/people-intelligence.adapter';

interface CapabilityDevelopmentCapabilityProps {
  context: ExecutiveContext;
}

export const CapabilityDevelopmentCapability: React.FC<CapabilityDevelopmentCapabilityProps> = ({ context }) => {
  const { data, loading } = useCapabilityDevelopment(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Capability Development...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Capability Development</h1>
        <p className="text-slate-400 text-sm mt-1">People Office • Strategic Academy</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Training Adoption Rate</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {(data.trainingAdoptionRate * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Skills Gap Index</h3>
          <div className="text-4xl font-light text-amber-400 mt-4">
            {data.skillsGapIndex} <span className="text-lg text-slate-500">/ 100</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">ROI on Training</h3>
          <div className="text-4xl font-light text-emerald-400 mt-4">
            {data.roiOnTraining.toFixed(1)}x
          </div>
        </div>
      </div>
    </div>
  );
};
