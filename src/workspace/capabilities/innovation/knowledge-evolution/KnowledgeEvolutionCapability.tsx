import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useKnowledgeEvolution } from '../../../data/adapters/innovation-intelligence.adapter';

interface KnowledgeEvolutionCapabilityProps {
  context: ExecutiveContext;
}

export const KnowledgeEvolutionCapability: React.FC<KnowledgeEvolutionCapabilityProps> = ({ context }) => {
  const { data, loading } = useKnowledgeEvolution(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Knowledge Evolution...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Knowledge Evolution</h1>
        <p className="text-slate-400 text-sm mt-1">Innovation Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Learning Rate</h3>
          <div className="text-4xl font-light text-emerald-400 mt-4">
            {data.organizationalLearningRate}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Retention Index</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {data.knowledgeRetentionIndex}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Strategic Training</h3>
          <div className="text-4xl font-light text-slate-100 mt-4 flex items-baseline gap-2">
            {data.strategicTrainingHours} <span className="text-lg text-slate-500">hrs</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Internal SMEs</h3>
          <div className="text-4xl font-light text-amber-400 mt-4">
            {data.internalSMEs}
          </div>
        </div>
      </div>
    </div>
  );
};
