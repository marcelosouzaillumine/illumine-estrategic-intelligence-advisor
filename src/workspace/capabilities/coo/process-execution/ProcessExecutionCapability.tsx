import React from 'react';
import { ExecutiveContext } from '../../../context/executive-context.types';
import { useProcessExecution } from '../../../data/adapters/coo-intelligence.adapter';

interface ProcessExecutionCapabilityProps {
  context: ExecutiveContext;
}

export const ProcessExecutionCapability: React.FC<ProcessExecutionCapabilityProps> = ({ context }) => {
  const { data, loading } = useProcessExecution(context);

  if (loading) return <div className="p-8 text-slate-400">Processando Inteligência de Execução...</div>;
  if (!data) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">Process & Execution Governance</h1>
        <p className="text-slate-400 text-sm mt-1">COO Office</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Productivity</h3>
          <div className="text-3xl font-light text-slate-100 mt-4">
            {data.metrics.productivity.toFixed(1)} <span className="text-sm text-slate-500">un/h</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Efficiency</h3>
          <div className="text-3xl font-light text-slate-100 mt-4">
            {(data.metrics.efficiency * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Capacity Utilization</h3>
          <div className="text-3xl font-light text-slate-100 mt-4 text-amber-400">
            {(data.metrics.capacityUtilization * 100).toFixed(1)}%
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Cycle Time</h3>
          <div className="text-3xl font-light text-slate-100 mt-4">
            {data.metrics.cycleTime.toFixed(1)} <span className="text-sm text-slate-500">h</span>
          </div>
        </div>
      </div>

      {(data.oee !== undefined || data.quality !== undefined) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.oee !== undefined && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">OEE (Overall Equipment Effectiveness)</h3>
              <div className="text-4xl font-light text-slate-100 mt-4">
                {(data.oee * 100).toFixed(1)}%
              </div>
            </div>
          )}
          {data.quality !== undefined && (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-2">Quality Rate</h3>
              <div className="text-4xl font-light text-slate-100 mt-4">
                {(data.quality * 100).toFixed(1)}%
              </div>
            </div>
          )}
        </div>
      )}

      {data.insights && data.insights.length > 0 && (
        <section className="mt-8 space-y-4">
          <h3 className="text-sm font-medium text-slate-500 uppercase tracking-widest">Execution Insights</h3>
          {data.insights.map((insight: any, idx: number) => (
            <div key={idx} className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-lg">
              <h4 className="font-medium text-slate-200 mb-1">{insight.title}</h4>
              <p className="text-slate-400 text-sm">{insight.narrative}</p>
              <div className="mt-3 p-3 bg-slate-900/50 rounded border border-slate-700/30">
                <p className="text-xs text-amber-400/90 font-medium uppercase tracking-wider mb-1">Recommendation</p>
                <p className="text-sm text-slate-300">{insight.recommendation}</p>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
};
