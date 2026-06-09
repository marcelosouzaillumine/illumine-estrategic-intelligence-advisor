import React from 'react';
import { useScenarioSimulation } from '../../context/scenario-simulation/ScenarioSimulationProvider';
import { SimulationPropagationSeverity } from '../../services/FiduciaryRuntimeAdapter';
import { useLanguage } from '../../contexts/LanguageContext';

export const PropagationTimelineViewer: React.FC = () => {
  const { t } = useLanguage();
  const { simulationOutput, sandboxResult } = useScenarioSimulation();

  if (!simulationOutput) {
    return (
      <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl text-center text-slate-500 font-mono text-xs">
        {t('scenario.propagation.loading')}
      </div>
    );
  }

  const activeOutput = sandboxResult ? sandboxResult.simulatedOutput : simulationOutput;
  const chain = activeOutput.propagationChain || [];

  const getSeverityStyle = (sev: SimulationPropagationSeverity) => {
    switch (sev) {
      case 'SYSTEMIC':
        return 'text-rose-400 bg-rose-950/30 border-rose-500/30';
      case 'CRITICAL':
        return 'text-amber-400 bg-amber-950/30 border-amber-500/30';
      case 'ELEVATED':
        return 'text-cyan-400 bg-cyan-950/30 border-cyan-500/30';
      default:
        return 'text-emerald-400 bg-emerald-950/30 border-emerald-500/20';
    }
  };

  return (
    <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
      <div className="flex justify-between items-center border-b border-slate-850 pb-2">
        <h4 className="text-slate-400 font-semibold tracking-wider uppercase text-xs font-mono">
          {t('scenario.propagation.timelineTitle')}
        </h4>
        <span className="text-[10px] font-mono text-slate-500 uppercase">
          {t('scenario.propagation.nodesDetected', { count: chain.length.toString() })}
        </span>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
        {chain.map((node, idx) => {
          const sevStyle = getSeverityStyle(node.severity);
          return (
            <div key={idx} className="relative group">
              {/* Ponto na timeline */}
              <span className="absolute -left-[20px] top-1.5 w-3 h-3 rounded-full bg-slate-950 border-2 border-slate-700 group-hover:border-slate-500 transition-all flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-current" />
              </span>

              <div className="p-4 bg-slate-900/35 border border-slate-850/80 rounded-xl hover:border-slate-800 transition-all space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {t('scenario.propagation.step', { step: node.step.toString() })}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-200">
                      {node.contagionType.replace(/_/g, ' ')}
                    </span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${sevStyle}`}>
                    {node.severity}
                  </span>
                </div>

                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                  <span>{t('scenario.propagation.targetEntity', { id: node.entityId })}</span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {node.impactDescription}
                </p>
              </div>
            </div>
          );
        })}

        {chain.length === 0 && (
          <div className="p-4 bg-slate-900/20 border border-slate-850 rounded-xl text-center text-xs text-slate-500 font-mono">
            {t('scenario.propagation.empty')}
          </div>
        )}
      </div>
    </div>
  );
};
