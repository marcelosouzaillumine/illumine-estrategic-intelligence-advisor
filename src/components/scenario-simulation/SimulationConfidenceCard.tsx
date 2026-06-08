import React from 'react';
import { useScenarioSimulation } from '../../context/scenario-simulation/ScenarioSimulationProvider';

import { useLanguage } from '../../contexts/LanguageContext';

export const SimulationConfidenceCard: React.FC = () => {
  const { t } = useLanguage();
  const { simulationOutput, forecastOutput } = useScenarioSimulation();

  if (!simulationOutput) {
    return (
      <div className="card-premium p-8 text-center text-muted-foreground font-mono text-xs animate-pulse">
        {t('scenario.confidence.loading')}
      </div>
    );
  }

  const { confidenceLevel, integrityState, assumptions, limitations } = simulationOutput;

  let confidenceLabel = t('scenario.confidence.highModel');
  let confidenceDesc = t('scenario.confidence.highModelDesc');
  let cardBorder = 'border-border/60 hover:border-secondary/20';
  let titleColor = 'text-emerald-500';

  if (confidenceLevel === 'INSUFFICIENT_HISTORY') {
    confidenceLabel = t('scenario.confidence.insufficientHistory');
    confidenceDesc = t('scenario.confidence.insufficientHistoryDesc');
    cardBorder = 'border-amber-500/30 bg-amber-500/5 shadow-[0_0_12px_rgba(245,158,11,0.08)]';
    titleColor = 'text-amber-500';
  } else if (integrityState === 'FAIL_CLOSED') {
    confidenceLabel = t('scenario.confidence.failClosed');
    confidenceDesc = t('scenario.confidence.failClosedDesc');
    cardBorder = 'border-rose-500/30 bg-rose-500/5 shadow-[0_0_12px_rgba(239,68,68,0.08)] animate-executive-pulse';
    titleColor = 'text-rose-500';
  }

  return (
    <div className={`card-premium p-8 transition-all duration-500 bg-surface-container/30 backdrop-blur-xl border-white/5 shadow-2xl ${cardBorder} space-y-6`}>
      <div className="flex flex-col gap-6">
        <div className="space-y-2 w-full">
          <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground uppercase block mb-1">{t('scenario.confidence.exposureTitle')}</span>
          <h3 className={`text-base font-bold font-mono tracking-wide ${titleColor}`}>{confidenceLabel}</h3>
          <p className="text-muted-foreground text-xs mt-2 leading-relaxed">
            {confidenceDesc}
          </p>
        </div>
        <div className="bg-surface-container/40 border border-border/40 px-5 py-4 rounded-2xl text-left font-mono text-[10px] font-bold tracking-wider text-muted-foreground shadow-inner w-full">
          <div className="mb-2 flex flex-col sm:flex-row sm:justify-between">{t('scenario.confidence.confidenceLabel')} <span className="text-foreground font-extrabold mt-1 sm:mt-0">{confidenceLevel}</span></div>
          <div className="flex flex-col sm:flex-row sm:justify-between">{t('scenario.confidence.integrityLabel')} <span className="text-foreground font-extrabold mt-1 sm:mt-0">{integrityState}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border/40 pt-6">
        <div className="space-y-3">
          <h4 className="text-foreground font-mono text-[11px] font-bold tracking-widest uppercase">{t('scenario.confidence.assumptionsTitle')}</h4>
          <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed list-disc list-inside">
            {assumptions.map((item, idx) => (
              <li key={idx} className="marker:text-secondary">{item}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="text-foreground font-mono text-[11px] font-bold tracking-widest uppercase">{t('scenario.confidence.limitationsTitle')}</h4>
          <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed list-disc list-inside">
            {limitations.map((item, idx) => (
              <li key={idx} className="marker:text-secondary">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
