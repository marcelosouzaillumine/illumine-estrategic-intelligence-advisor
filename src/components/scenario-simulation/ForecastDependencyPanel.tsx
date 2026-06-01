import React from 'react';
import { useScenarioSimulation } from '../../context/scenario-simulation/ScenarioSimulationProvider';
import { useLanguage } from '../../contexts/LanguageContext';

export const ForecastDependencyPanel: React.FC = () => {
  const { t } = useLanguage();
  const { simulationOutput, historyCyclesToUse } = useScenarioSimulation();

  const dependencies = [
    { name: t('scenario.dependency.ledger.name'), status: 'VALIDATED', description: t('scenario.dependency.ledger.desc') },
    { name: t('scenario.dependency.tenant.name'), status: 'VALIDATED', description: t('scenario.dependency.tenant.desc') },
    { name: t('scenario.dependency.financial.name'), status: 'VALIDATED', description: t('scenario.dependency.financial.desc') },
    {
      name: t('scenario.dependency.history.name'),
      status: historyCyclesToUse >= 3 ? 'VALIDATED' : 'WARNING',
      description: t('scenario.dependency.history.desc', { count: historyCyclesToUse.toString() })
    }
  ];

  return (
    <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl">
      <h4 className="text-slate-400 font-semibold tracking-wider uppercase text-xs font-mono mb-4 border-b border-slate-850 pb-2">
        {t('scenario.dependency.title')}
      </h4>

      <div className="space-y-3.5">
        {dependencies.map((dep, idx) => {
          const isValid = dep.status === 'VALIDATED';
          return (
            <div key={idx} className="flex items-start gap-3 p-3 bg-slate-900/40 border border-slate-800/60 rounded-lg hover:border-slate-700/60 transition-all">
              <span className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${isValid ? 'bg-emerald-500 shadow-lg shadow-emerald-500/20' : 'bg-amber-500 shadow-lg shadow-amber-500/20 animate-pulse'}`} />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono font-semibold text-slate-200">{dep.name}</span>
                  <span className={`text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded ${isValid ? 'bg-emerald-950/30 text-emerald-400 border border-emerald-500/20' : 'bg-amber-950/30 text-amber-400 border border-amber-500/20'}`}>
                    {dep.status}
                  </span>
                </div>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">
                  {dep.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {simulationOutput && (
        <div className="mt-4 pt-3 border-t border-slate-850/80">
          <span className="text-slate-500 font-mono text-[10px] uppercase block mb-1.5">{t('scenario.dependency.metadata')}</span>
          <div className="flex flex-wrap gap-1.5">
            {simulationOutput.dependencies.map((dep, idx) => (
              <span key={idx} className="text-[10px] font-mono px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
                {dep}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
