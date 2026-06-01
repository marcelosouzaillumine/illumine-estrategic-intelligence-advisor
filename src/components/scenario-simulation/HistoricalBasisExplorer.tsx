import React from 'react';
import { useScenarioSimulation } from '../../context/scenario-simulation/ScenarioSimulationProvider';
import { useLanguage } from '../../contexts/LanguageContext';

export const HistoricalBasisExplorer: React.FC = () => {
  const { t } = useLanguage();
  const { simulationInput, historyCyclesToUse } = useScenarioSimulation();

  if (!simulationInput) {
    return (
      <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl text-center text-slate-500 font-mono text-xs">
        {t('scenario.historyExplorer.loading')}
      </div>
    );
  }

  const activeCycles = simulationInput.historicalCycles.slice(0, historyCyclesToUse);

  return (
    <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
      <div className="flex justify-between items-center border-b border-slate-850 pb-2">
        <h4 className="text-slate-400 font-semibold tracking-wider uppercase text-xs font-mono">
          {t('scenario.historyExplorer.title')}
        </h4>
        <span className="text-[10px] font-mono text-slate-500 uppercase">
          {t('scenario.historyExplorer.activeCycles', { count: activeCycles.length.toString() })}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-slate-500">
              <th className="py-2 pr-4 font-normal">{t('scenario.historyExplorer.columns.cycle')}</th>
              <th className="py-2 px-4 font-normal text-right">{t('scenario.historyExplorer.columns.maturity')}</th>
              <th className="py-2 px-4 font-normal text-right">{t('scenario.historyExplorer.columns.netMargin')}</th>
              <th className="py-2 px-4 font-normal text-right">{t('scenario.historyExplorer.columns.cashValue')}</th>
              <th className="py-2 px-4 font-normal text-center">{t('scenario.historyExplorer.columns.anomalies')}</th>
              <th className="py-2 px-4 font-normal text-center">{t('scenario.historyExplorer.columns.violations')}</th>
              <th className="py-2 pl-4 font-normal text-right">{t('scenario.historyExplorer.columns.auditLineage')}</th>
            </tr>
          </thead>
          <tbody>
            {activeCycles.map((cycle, idx) => (
              <tr key={idx} className="border-b border-slate-850 hover:bg-slate-900/30 transition-all">
                <td className="py-3 pr-4 font-bold text-slate-300">{cycle.period}</td>
                <td className="py-3 px-4 text-right">
                  <span className={`px-1.5 py-0.5 rounded font-bold ${cycle.maturityScore >= 80 ? 'text-emerald-400 bg-emerald-950/20 border border-emerald-500/10' : cycle.maturityScore >= 60 ? 'text-amber-400 bg-amber-950/20 border border-amber-500/10' : 'text-rose-400 bg-rose-950/20 border border-rose-500/10'}`}>
                    {cycle.maturityScore}%
                  </span>
                </td>
                <td className="py-3 px-4 text-right text-slate-300">{(cycle.netMargin * 100).toFixed(1)}%</td>
                <td className="py-3 px-4 text-right text-slate-300">
                  ${(cycle.cashValue / 1000).toFixed(0)}k
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-1.5 py-0.5 rounded ${cycle.anomaliesCount > 0 ? 'text-amber-400 bg-amber-950/30' : 'text-slate-500'}`}>
                    {cycle.anomaliesCount}
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`px-1.5 py-0.5 rounded ${cycle.violationsCount > 0 ? 'text-rose-400 bg-rose-950/30 font-bold border border-rose-500/15' : 'text-slate-500'}`}>
                    {cycle.violationsCount}
                  </span>
                </td>
                <td className="py-3 pl-4 text-right text-slate-500 select-all hover:text-slate-300 text-[10px] truncate max-w-[120px]">
                  {cycle.lineageHash}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {activeCycles.length < 3 && (
        <div className="p-3 bg-amber-950/20 border border-amber-500/20 rounded-lg flex items-start gap-2.5">
          <span className="text-amber-400 text-sm mt-0.5">⚠️</span>
          <p className="text-slate-400 text-xs leading-relaxed">
            <span className="text-amber-400 font-bold">{t('scenario.historyExplorer.warningTitle')}</span>{t('scenario.historyExplorer.warningDesc')}
          </p>
        </div>
      )}
    </div>
  );
};
