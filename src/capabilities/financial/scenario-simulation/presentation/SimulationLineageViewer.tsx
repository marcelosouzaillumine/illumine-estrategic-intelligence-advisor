import React, { useState } from 'react';
import { useScenarioSimulation } from '../../../../context/scenario-simulation/ScenarioSimulationProvider';
import { useLanguage } from '../../../../contexts/LanguageContext';
import { Database } from 'lucide-react';

export const SimulationLineageViewer: React.FC = () => {
  const { t } = useLanguage();
  const { simulationOutput, forecastOutput } = useScenarioSimulation();
  const [copied, setCopied] = useState(false);

  if (!simulationOutput) {
    return (
      <div className="card-premium p-8 text-center text-muted-foreground font-mono text-xs animate-pulse">
        {t('scenario.lineage.loading')}
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
    <div className="card-premium p-8 font-mono text-xs relative overflow-hidden group hover:border-secondary/30 transition-all duration-500 bg-surface-container/30 backdrop-blur-xl border-white/5 shadow-2xl">
      <div className="flex justify-between items-center border-b border-border/40 pb-5">
        <h4 className="text-sm font-medium text-foreground tracking-tight">
          {t('scenario.lineage.title')}
        </h4>
        <Database size={16} className="text-muted-foreground" />
      </div>

      <div className="space-y-4 text-foreground pt-4">
        <button
          onClick={copyToClipboard}
          className="w-full px-3 py-1.5 rounded-full bg-surface-container border border-border hover:border-secondary hover:text-secondary text-muted-foreground transition-all duration-300 active:scale-95 cursor-pointer font-bold tracking-widest text-[9px] uppercase shadow-xs"
        >
          {copied ? t('scenario.lineage.copied') : t('scenario.lineage.copySchema')}
        </button>

        <div className="flex justify-between items-center p-3 bg-surface-container/40 rounded-xl">
          <span className="text-[9px] font-bold tracking-widest text-muted-foreground">{t('scenario.lineage.auditHash')}</span>
          <span className="text-[10px] font-mono text-emerald-500 font-bold bg-success-soft0/10 px-2 py-1 rounded select-all">
            {lineageHash}
          </span>
        </div>

        <div className="flex justify-between items-center p-3 bg-surface-container/40 rounded-xl">
          <span className="text-[9px] font-bold tracking-widest text-muted-foreground">{t('scenario.lineage.correlationId')}</span>
          <span className="text-[10px] font-mono text-foreground font-bold bg-surface-container-high px-2 py-1 rounded select-all">
            {correlationId}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground font-bold tracking-wider block mb-1.5 uppercase text-[9px]">{t('scenario.lineage.sourceRuntimeTraces')}</span>
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
            <span className="text-muted-foreground font-bold tracking-wider block mb-1.5 uppercase text-[9px]">{t('scenario.lineage.historicalBasis')}</span>
            <span className="text-[11px] text-muted-foreground leading-relaxed italic block pl-1">
              {forecastOutput.historicalBasisSummary}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
