import React from 'react';
import { useScenarioSimulation } from '../../context/scenario-simulation/ScenarioSimulationProvider';
import { useLanguage } from '../../contexts/LanguageContext';

export const MultiEntityContagionSurface: React.FC = () => {
  const { t } = useLanguage();
  const { simulationOutput, sandboxResult } = useScenarioSimulation();

  if (!simulationOutput) {
    return (
      <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl text-center text-slate-500 font-mono text-xs">
        {t('scenario.multiEntity.loading')}
      </div>
    );
  }

  const activeOutput = sandboxResult ? sandboxResult.simulatedOutput : simulationOutput;
  const currentScore = activeOutput.projectedDeterioration.score;

  // Definir entidades em risco de contágio de forma gráfica
  const entities = [
    { id: activeOutput.tenantId, name: t('scenario.multiEntity.roles.core'), role: t('scenario.multiEntity.roleLabels.core'), status: currentScore > 60 ? 'CRITICAL' : 'STABLE', score: currentScore },
    { id: 'SUB-01', name: t('scenario.multiEntity.roles.sub1'), role: t('scenario.multiEntity.roleLabels.subsidiary'), status: currentScore > 50 ? 'ELEVATED' : 'STABLE', score: Math.round(currentScore * 0.6) },
    { id: 'SUB-02', name: t('scenario.multiEntity.roles.sub2'), role: t('scenario.multiEntity.roleLabels.supplierChain'), status: currentScore > 75 ? 'CRITICAL' : currentScore > 40 ? 'ELEVATED' : 'STABLE', score: Math.round(currentScore * 0.45) },
    { id: 'HOLDING-01', name: t('scenario.multiEntity.roles.holding'), role: t('scenario.multiEntity.roleLabels.parentGroup'), status: currentScore > 70 ? 'SYSTEMIC' : currentScore > 50 ? 'ELEVATED' : 'STABLE', score: Math.round(currentScore * 0.75) }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SYSTEMIC':
        return 'text-rose-400 border-rose-500 bg-rose-950/20';
      case 'CRITICAL':
        return 'text-red-400 border-red-500 bg-red-950/20';
      case 'ELEVATED':
        return 'text-amber-400 border-amber-500 bg-amber-950/20';
      default:
        return 'text-emerald-400 border-emerald-500 bg-emerald-950/20';
    }
  };

  return (
    <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
      <div className="flex justify-between items-center border-b border-slate-850 pb-2">
        <h4 className="text-slate-400 font-semibold tracking-wider uppercase text-xs font-mono">
          {t('scenario.multiEntity.gridTitle')}
        </h4>
        <span className="text-[10px] font-mono text-slate-500 uppercase">
          {t('scenario.multiEntity.topologyLabel')}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {entities.map((ent, idx) => {
          const statusStyle = getStatusColor(ent.status);
          return (
            <div key={idx} className={`p-4 border rounded-xl flex flex-col justify-between space-y-3 ${statusStyle}`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase opacity-60 block">{ent.role}</span>
                  <h5 className="text-xs font-mono font-bold text-slate-100">{ent.name}</h5>
                </div>
                <span className="text-[10px] font-mono font-bold opacity-80">{ent.status}</span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>{t('scenario.multiEntity.exposureProgression')}</span>
                  <span>{ent.score}%</span>
                </div>
                <div className="w-full bg-slate-900/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-1.5 rounded-full bg-current transition-all duration-500"
                    style={{ width: `${ent.score}%` }}
                  />
                </div>
              </div>

              <div className="text-[10px] font-mono text-slate-400/80 border-t border-slate-800/40 pt-1.5 flex justify-between">
                <span>{t('scenario.multiEntity.entityLabel')} {ent.id}</span>
                <span>{t('scenario.multiEntity.liabilityScope')}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Relações gráficas de contágio - Setas indicativas */}
      <div className="p-3 bg-slate-900/30 border border-slate-850 rounded-xl space-y-2">
        <span className="text-[9px] font-mono text-slate-500 uppercase block">{t('scenario.multiEntity.contagionFlow')}</span>
        <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400">
          <span className="text-slate-200">{t('scenario.multiEntity.roles.core')}</span>
          <span className="text-rose-500">{t('scenario.multiEntity.flow.resources')}</span>
          <span className="text-slate-200">{t('scenario.multiEntity.roleLabels.parentGroup')}</span>
          <span className="text-amber-500">{t('scenario.multiEntity.flow.friction')}</span>
          <span className="text-slate-200">{t('scenario.multiEntity.roles.sub1')}</span>
        </div>
      </div>
    </div>
  );
};
