import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useOrganizationalCulture } from '../../../data/adapters/people-intelligence.adapter';

interface CultureCapabilityProps {
  context: ExecutiveContext;
}

export const CultureCapability: React.FC<CultureCapabilityProps> = ({ context }) => {
  const { data, loading } = useOrganizationalCulture(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Inteligência de Cultura...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Organizational Culture</h1>
        <p className="text-slate-400 text-sm mt-1">People Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">eNPS</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {data.eNPS}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Culture Alignment</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {data.cultureAlignmentScore} <span className="text-lg text-slate-500">/ 100</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Employee Satisfaction</h3>
          <div className="text-4xl font-light text-emerald-400 mt-4">
            {data.employeeSatisfaction}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Burnout Risk Index</h3>
          <div className="text-4xl font-light text-amber-400 mt-4">
            {data.burnoutRiskIndex} <span className="text-lg text-slate-500">/ 100</span>
          </div>
        </div>
      </div>
    </div>
  );
};
