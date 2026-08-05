import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useDigitalTransformation } from '../../../data/adapters/innovation-intelligence.adapter';

interface DigitalTransformationCapabilityProps {
  context: ExecutiveContext;
}

export const DigitalTransformationCapability: React.FC<DigitalTransformationCapabilityProps> = ({ context }) => {
  const { data, loading } = useDigitalTransformation(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Transformação Digital...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Digital Transformation</h1>
        <p className="text-slate-400 text-sm mt-1">Innovation Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Maturity Level</h3>
          <div className="text-3xl font-light text-amber-400 mt-4 capitalize">
            {data.digitalMaturityLevel}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Automation Rate</h3>
          <div className="text-4xl font-light text-slate-100 mt-4 flex items-baseline gap-2">
            {data.automationRate} <span className="text-lg text-slate-500">%</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Tech Adoption Index</h3>
          <div className="text-4xl font-light text-emerald-400 mt-4">
            {data.techAdoptionIndex}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Legacy Systems</h3>
          <div className="text-4xl font-light text-red-400 mt-4">
            {data.legacySystemsToModernize}
          </div>
        </div>
      </div>
    </div>
  );
};
