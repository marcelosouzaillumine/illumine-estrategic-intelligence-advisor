import React, { useState } from 'react';
import { useScenarioSimulation } from '../../context/scenario-simulation/ScenarioSimulationProvider';

export const SimulationLineageViewer: React.FC = () => {
  const { simulationOutput, forecastOutput } = useScenarioSimulation();
  const [copied, setCopied] = useState(false);

  if (!simulationOutput) {
    return (
      <div className="p-4 bg-slate-900/50 border border-slate-800 rounded-xl text-center text-sm text-slate-500 font-mono">
        AGUARDANDO SIMULAÇÃO ATIVA...
      </div>
    );
  }

  const { lineageHash, correlationId, sourceRuntimeReferences } = simulationOutput;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify({ lineageHash, correlationId }, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl font-mono text-xs">
      <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-2">
        <h4 className="text-slate-400 font-semibold tracking-wider uppercase">Fiduciary Lineage & Trace Audit</h4>
        <button
          onClick={copyToClipboard}
          className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-all active:scale-95"
        >
          {copied ? 'COPIED!' : 'COPY SCHEMA'}
        </button>
      </div>

      <div className="space-y-3 text-slate-300">
        <div>
          <span className="text-slate-500 block mb-1">AUDIT LINEAGE HASH</span>
          <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-emerald-400 select-all font-semibold block overflow-x-auto whitespace-nowrap">
            {lineageHash}
          </span>
        </div>

        <div>
          <span className="text-slate-500 block mb-1">CORRELATION ID</span>
          <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-cyan-400 select-all block overflow-x-auto whitespace-nowrap">
            {correlationId}
          </span>
        </div>

        <div>
          <span className="text-slate-500 block mb-1">SOURCE RUNTIME TRACES</span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {sourceRuntimeReferences.map((ref, idx) => (
              <span key={idx} className="bg-slate-900/60 border border-slate-800/80 px-2 py-0.5 rounded text-[10px] text-slate-400">
                {ref}
              </span>
            ))}
          </div>
        </div>

        {forecastOutput && (
          <div className="border-t border-slate-800/80 pt-2 mt-2">
            <span className="text-slate-500 block mb-1">HISTORICAL BASIS</span>
            <span className="text-[11px] text-slate-400 leading-relaxed italic block">
              {forecastOutput.historicalBasisSummary}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
