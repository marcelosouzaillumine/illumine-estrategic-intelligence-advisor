import React, { useState } from 'react';
import { useScenarioSimulation } from '../../context/scenario-simulation/ScenarioSimulationProvider';

export const SimulationLineageViewer: React.FC = () => {
  const { simulationOutput, forecastOutput } = useScenarioSimulation();
  const [copied, setCopied] = useState(false);

  if (!simulationOutput) {
    return (
      <div className="card-premium p-8 text-center text-muted-foreground font-mono text-xs animate-pulse">
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
    <div className="card-premium p-8 font-mono text-xs relative overflow-hidden group hover:border-secondary/20 transition-all duration-300">
      <div className="flex justify-between items-center mb-6 border-b border-border/40 pb-3 flex-wrap gap-2">
        <h4 className="text-foreground font-semibold tracking-wider uppercase">Fiduciary Lineage & Trace Audit</h4>
        <button
          onClick={copyToClipboard}
          className="px-3 py-1.5 rounded-full bg-surface-container border border-border hover:border-secondary hover:text-secondary text-muted-foreground transition-all duration-300 active:scale-95 cursor-pointer font-bold tracking-widest text-[9px] uppercase shadow-xs"
        >
          {copied ? 'COPIED!' : 'COPY SCHEMA'}
        </button>
      </div>

      <div className="space-y-4 text-foreground">
        <div>
          <span className="text-muted-foreground font-bold tracking-wider block mb-1.5 uppercase text-[9px]">AUDIT LINEAGE HASH</span>
          <span className="bg-surface-container border border-border px-3 py-2 rounded-lg text-emerald-600 dark:text-emerald-400 select-all font-semibold block overflow-x-auto whitespace-nowrap scrollbar-premium">
            {lineageHash}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground font-bold tracking-wider block mb-1.5 uppercase text-[9px]">CORRELATION ID</span>
          <span className="bg-surface-container border border-border px-3 py-2 rounded-lg text-secondary select-all block overflow-x-auto whitespace-nowrap scrollbar-premium font-semibold">
            {correlationId}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground font-bold tracking-wider block mb-1.5 uppercase text-[9px]">SOURCE RUNTIME TRACES</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {sourceRuntimeReferences.map((ref, idx) => (
              <span key={idx} className="bg-surface-container border border-border px-2.5 py-1 rounded-md text-[10px] text-muted-foreground font-semibold">
                {ref}
              </span>
            ))}
          </div>
        </div>

        {forecastOutput && (
          <div className="border-t border-border/40 pt-4 mt-4">
            <span className="text-muted-foreground font-bold tracking-wider block mb-1.5 uppercase text-[9px]">HISTORICAL BASIS</span>
            <span className="text-[11px] text-muted-foreground leading-relaxed italic block pl-1">
              {forecastOutput.historicalBasisSummary}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
