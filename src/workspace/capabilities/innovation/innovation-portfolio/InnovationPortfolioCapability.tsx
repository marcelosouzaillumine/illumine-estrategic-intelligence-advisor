import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useInnovationPortfolio } from '../../../data/adapters/innovation-intelligence.adapter';

interface InnovationPortfolioCapabilityProps {
  context: ExecutiveContext;
}

export const InnovationPortfolioCapability: React.FC<InnovationPortfolioCapabilityProps> = ({ context }) => {
  const { data, loading } = useInnovationPortfolio(context);

  if (loading) return <div className="p-8 text-slate-400">Analisando Portfólio...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Innovation Portfolio</h1>
        <p className="text-slate-400 text-sm mt-1">Innovation Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Active Projects</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {data.activeProjects}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Expected ROI</h3>
          <div className="text-4xl font-light text-emerald-400 mt-4">
            {data.expectedROI}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">CAPEX Allocated</h3>
          <div className="text-3xl font-light text-slate-100 mt-4">
            ${(data.totalCapexAllocated / 1000000).toFixed(1)}M
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Projects At Risk</h3>
          <div className="text-4xl font-light text-red-400 mt-4">
            {data.projectsAtRisk}
          </div>
        </div>
      </div>
    </div>
  );
};
