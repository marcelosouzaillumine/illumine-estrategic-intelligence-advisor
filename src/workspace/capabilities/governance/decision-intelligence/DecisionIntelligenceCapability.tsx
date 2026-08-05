import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useDecisionGovernance } from '../../../data/adapters/governance-intelligence.adapter';

interface DecisionIntelligenceCapabilityProps {
  context: ExecutiveContext;
}

export const DecisionIntelligenceCapability: React.FC<DecisionIntelligenceCapabilityProps> = ({ context }) => {
  const { data, loading } = useDecisionGovernance(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Decision Intelligence...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Decision Intelligence</h1>
        <p className="text-slate-400 text-sm mt-1">Governance Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Open Decisions</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {data.openDecisions}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Delayed Decisions</h3>
          <div className="text-4xl font-light text-red-400 mt-4">
            {data.delayedDecisions}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Avg Decision Time</h3>
          <div className="text-4xl font-light text-slate-100 mt-4">
            {data.averageDecisionTimeDays} <span className="text-lg text-slate-500">days</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Without Action</h3>
          <div className="text-4xl font-light text-amber-400 mt-4">
            {data.criticalDecisionsWithoutAction}
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 mt-6">
        <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4">Decision Lifecycle Bottlenecks</h3>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {Object.entries(data.decisionsByLifecycle).map(([state, count]) => (
            <div key={state} className="p-4 bg-slate-800/50 rounded-lg text-center">
              <div className="text-sm text-slate-400 mb-1">{state}</div>
              <div className="text-2xl font-semibold text-slate-200">{count as React.ReactNode}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
