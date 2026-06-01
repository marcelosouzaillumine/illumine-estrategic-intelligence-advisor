import React from 'react';
import { useScenarioSimulation } from '../../context/scenario-simulation/ScenarioSimulationProvider';
import { SimulationScenarioType, SimulationTimeHorizon } from '../../core/runtime/scenario-simulation/types';
import { ForecastIntegrityBadge } from './ForecastIntegrityBadge';
import { useLanguage } from '../../contexts/LanguageContext';

export const ScenarioSimulationPanel: React.FC = () => {
  const { t } = useLanguage();
  const {
    activeScenarioType,
    activeHorizon,
    historyCyclesToUse,
    setScenarioType,
    setHorizon,
    setHistoryCyclesToUse,
    simulationOutput,
    isRunning
  } = useScenarioSimulation();

  const scenarios: Array<{ type: SimulationScenarioType; label: string; desc: string }> = [
    { type: 'LIQUIDITY_STRESS', label: t('scenario.types.liquidityStress.label'), desc: t('scenario.types.liquidityStress.desc') },
    { type: 'OPERATIONAL_COLLAPSE', label: t('scenario.types.operationalCollapse.label'), desc: t('scenario.types.operationalCollapse.desc') },
    { type: 'MARGIN_DETERIORATION', label: t('scenario.types.marginDeterioration.label'), desc: t('scenario.types.marginDeterioration.desc') },
    { type: 'GOVERNANCE_BREAKDOWN', label: t('scenario.types.governanceBreakdown.label'), desc: t('scenario.types.governanceBreakdown.desc') },
    { type: 'MULTI_ENTITY_CONTAGION', label: t('scenario.types.multiEntityContagion.label'), desc: t('scenario.types.multiEntityContagion.desc') }
  ];

  const horizons: Array<{ value: SimulationTimeHorizon; label: string }> = [
    { value: '30_DAYS', label: t('scenario.horizons.days30') },
    { value: '90_DAYS', label: t('scenario.horizons.days90') },
    { value: '180_DAYS', label: t('scenario.horizons.days180') },
    { value: '365_DAYS', label: t('scenario.horizons.days365') }
  ];

  return (
    <div className="card-premium p-8 space-y-8 relative overflow-hidden group hover:border-secondary/20 transition-all duration-300">
      <div className="flex justify-between items-center border-b border-border/40 pb-4 flex-wrap gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-secondary uppercase block mb-1">{t('scenario.panel.platformLabel')}</span>
          <h3 className="text-base font-medium text-foreground tracking-tight">{t('scenario.panel.simulatorTitle')}</h3>
        </div>
        {simulationOutput && (
          <ForecastIntegrityBadge state={simulationOutput.integrityState} />
        )}
      </div>

      <div className="space-y-6">
        {/* Escolha do Cenário */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground uppercase block">{t('scenario.panel.step1')}</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map((scen) => (
              <button
                key={scen.type}
                onClick={() => setScenarioType(scen.type)}
                className={`p-4 border rounded-xl text-left transition-all duration-300 active:scale-[0.98] flex flex-col gap-1.5 cursor-pointer ${
                  activeScenarioType === scen.type
                    ? 'border-secondary bg-secondary/10 text-secondary shadow-[0_0_12px_rgba(255,133,82,0.12)]'
                    : 'border-border/60 bg-surface-container/40 text-muted-foreground hover:border-secondary/40 hover:text-foreground'
                }`}
              >
                <span className="text-xs font-semibold tracking-wider uppercase">{scen.label}</span>
                <span className="text-[10.5px] opacity-80 leading-relaxed font-sans">{scen.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Horizonte Temporal */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground uppercase block">{t('scenario.panel.step2')}</span>
            <div className="flex bg-surface-container/60 border border-border/60 p-1 rounded-xl gap-1">
              {horizons.map((hor) => (
                <button
                  key={hor.value}
                  onClick={() => setHorizon(hor.value)}
                  className={`flex-1 py-2 rounded-lg text-center font-mono text-xs font-bold transition-all cursor-pointer ${
                    activeHorizon === hor.value
                      ? 'bg-card text-secondary border border-border shadow-xs font-black'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {hor.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ciclos Históricos (Controle de Suficiência) */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground uppercase block">{t('scenario.panel.step3')}</span>
            <div className="flex bg-surface-container/60 border border-border/60 p-1 rounded-xl gap-1">
              {[1, 2, 3, 4].map((cycles) => (
                <button
                  key={cycles}
                  onClick={() => setHistoryCyclesToUse(cycles)}
                  className={`flex-1 py-2 rounded-lg text-center font-mono text-xs font-bold transition-all flex flex-col items-center justify-center cursor-pointer ${
                    historyCyclesToUse === cycles
                      ? cycles < 3
                        ? 'bg-amber-500/10 text-amber-500 border border-amber-500/35 shadow-sm'
                        : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/35 shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <span>{cycles === 1 ? t('scenario.cycles.singular', { count: String(cycles) }) : t('scenario.cycles.plural', { count: String(cycles) })}</span>
                  <span className="text-[8px] opacity-80 mt-0.5 tracking-wider uppercase font-semibold">
                    {cycles < 3 ? t('scenario.status.warning') : t('scenario.status.sufficient')}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {isRunning && (
        <div className="p-4 bg-secondary/5 border border-secondary/20 text-secondary rounded-xl text-center font-mono text-xs animate-pulse tracking-wide font-medium">
          {t('scenario.panel.executing')}
        </div>
      )}
    </div>
  );
};
