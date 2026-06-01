import React from 'react';
import { useScenarioSimulation } from '../../context/scenario-simulation/ScenarioSimulationProvider';
import { StrategicStressLevel } from '../../core/runtime/scenario-simulation/types';
import { useLanguage } from '../../contexts/LanguageContext';

export const StrategicStressMap: React.FC = () => {
  const { t } = useLanguage();
  const { simulationOutput, sandboxResult } = useScenarioSimulation();

  if (!simulationOutput) {
    return (
      <div className="card-premium p-8 text-center text-muted-foreground font-mono text-xs animate-pulse">
        {t('scenario.stress.loading')}
      </div>
    );
  }

  // Se houver sandbox, exibir o stress do sandbox. Senão, o original.
  const activeOutput = sandboxResult ? sandboxResult.simulatedOutput : simulationOutput;
  const currentStress: StrategicStressLevel = activeOutput.stressClassification;

  const stressLevels: Array<{
    level: StrategicStressLevel;
    label: string;
    description: string;
    bgStyle: string;
    activeBorder: string;
    textColor: string;
  }> = [
    {
      level: 'LIGHT',
      label: t('scenario.stress.levels.light.label'),
      description: t('scenario.stress.levels.light.desc'),
      bgStyle: 'bg-emerald-500/5 border-border/60 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
      activeBorder: 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.12)] text-emerald-600 dark:text-emerald-400',
      textColor: 'text-emerald-600 dark:text-emerald-400'
    },
    {
      level: 'MODERATE',
      label: t('scenario.stress.levels.moderate.label'),
      description: t('scenario.stress.levels.moderate.desc'),
      bgStyle: 'bg-blue-500/5 border-border/60 hover:bg-blue-500/10 text-blue-600 dark:text-blue-400',
      activeBorder: 'border-blue-500 bg-blue-500/10 shadow-[0_0_12px_rgba(59,130,246,0.12)] text-blue-600 dark:text-blue-400',
      textColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      level: 'HIGH',
      label: t('scenario.stress.levels.high.label'),
      description: t('scenario.stress.levels.high.desc'),
      bgStyle: 'bg-amber-500/5 border-border/60 hover:bg-amber-500/10 text-amber-600 dark:text-amber-400',
      activeBorder: 'border-amber-500 bg-amber-500/10 shadow-[0_0_12px_rgba(245,158,11,0.12)] text-amber-600 dark:text-amber-400',
      textColor: 'text-amber-600 dark:text-amber-400'
    },
    {
      level: 'EXTREME',
      label: t('scenario.stress.levels.extreme.label'),
      description: t('scenario.stress.levels.extreme.desc'),
      bgStyle: 'bg-rose-500/5 border-border/60 hover:bg-rose-500/10 text-rose-600 dark:text-rose-400',
      activeBorder: 'border-rose-500 bg-rose-500/10 shadow-[0_0_12px_rgba(239,68,68,0.12)] text-rose-600 dark:text-rose-400 animate-executive-pulse',
      textColor: 'text-rose-600 dark:text-rose-400'
    }
  ];

  return (
    <div className="card-premium p-8 space-y-6 relative overflow-hidden group hover:border-secondary/20 transition-all duration-300">
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <h4 className="text-sm font-medium text-foreground tracking-tight">
          {t('scenario.stress.title')}
        </h4>
        {sandboxResult && (
          <span className="text-[10px] font-mono font-bold px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 tracking-wider">
            {t('scenario.stress.sandboxProjection')}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stressLevels.map((s, idx) => {
          const isActive = currentStress === s.level;
          return (
            <div
              key={idx}
              className={`p-5 border rounded-xl transition-all duration-300 flex flex-col justify-between ${
                isActive ? s.activeBorder : s.bgStyle + ' opacity-60 hover:opacity-100'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className={`text-[10px] font-mono font-bold uppercase tracking-wider ${isActive ? s.textColor : 'text-muted-foreground'}`}>
                    {s.label}
                  </span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-current animate-ping" />}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed font-sans">
                  {s.description}
                </p>
              </div>

              {isActive && (
                <div className="mt-4 pt-3 border-t border-border/30 text-[9px] font-mono tracking-wider text-muted-foreground flex justify-between uppercase font-bold">
                  <span>{t('scenario.stress.statusActive')}</span>
                  <span>{t('scenario.stress.score', { value: String(activeOutput.projectedDeterioration.score) })}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
