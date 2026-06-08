import React from 'react';
import { useScenarioSimulation } from '../../context/scenario-simulation/ScenarioSimulationProvider';
import { useLanguage } from '../../contexts/LanguageContext';

export const GovernanceForecastSurface: React.FC = () => {
  const { t } = useLanguage();
  const { forecastOutput, sandboxResult, historyCyclesToUse } = useScenarioSimulation();

  if (!forecastOutput) {
    return (
      <div className="card-premium p-8 text-center text-muted-foreground font-mono text-xs animate-pulse">
        {t('scenario.forecast.loading')}
      </div>
    );
  }

  // Se houver sandbox ativo, podemos deduzir e exibir deltas interessantes ou usar o output projetado.
  const activeForecast = forecastOutput;

  // Formatar a velocidade de deterioração
  const velocity = activeForecast.deteriorationVelocity;
  const isDeclining = velocity < 0;

  // Mapear faixas de risco determinísticas
  const riskBand = activeForecast.deterministicRiskBand;
  let riskColor = 'text-emerald-500';
  let riskBg = 'bg-emerald-500/10 border-emerald-500/25';

  if (riskBand === 'CRITICAL_RISK') {
    riskColor = 'text-rose-400';
    riskBg = 'bg-rose-950/40 border-rose-500/30 shadow-[0_0_15px_rgba(225,29,72,0.2)]';
  } else if (riskBand === 'HIGH_RISK') {
    riskColor = 'text-amber-400';
    riskBg = 'bg-amber-950/40 border-amber-500/30 shadow-[0_0_15px_rgba(217,119,6,0.15)]';
  } else if (riskBand === 'MODERATE_RISK') {
    riskColor = 'text-blue-400';
    riskBg = 'bg-blue-950/40 border-blue-500/30';
  }

  return (
    <div className="card-premium p-8 space-y-8 relative overflow-hidden group hover:border-secondary/30 transition-all duration-500 bg-surface-container/30 backdrop-blur-xl border-white/5 shadow-2xl">
      <div className="flex justify-between items-center border-b border-border/40 pb-5">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-secondary uppercase block mb-1">{t('scenario.forecast.engineLabel')}</span>
          <h3 className="text-base font-medium text-foreground tracking-tight">{t('scenario.forecast.exposureTitle')}</h3>
        </div>
        <div className={`px-3 py-1 rounded-full border font-mono text-[10px] font-bold tracking-widest ${riskBg} ${riskColor}`}>
          {riskBand.replace('_', ' ')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Velocidade de Deterioração */}
        <div className="p-6 bg-surface-container/40 border border-border/40 rounded-2xl space-y-4 h-full flex flex-col justify-center">
          <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground uppercase block">{t('scenario.forecast.velocityTitle')}</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono tracking-tight ${isDeclining ? 'text-rose-500' : 'text-emerald-500'}`}>
              {velocity > 0 ? `+${velocity}` : velocity}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">{t('scenario.forecast.velocityUnit')}</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {isDeclining 
              ? t('scenario.forecast.velocityDescDeclining')
              : t('scenario.forecast.velocityDescStable')}
          </p>
        </div>

        {/* Liquidez Crise */}
        <div className="p-6 bg-surface-container/40 border border-border/40 rounded-2xl space-y-4 h-full flex flex-col justify-center relative overflow-hidden">
          {activeForecast.liquidityDaysToCrisis < 90 && (
            <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 blur-2xl rounded-full translate-x-1/2 -translate-y-1/2" />
          )}
          <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground uppercase block">{t('scenario.forecast.liquidityTitle')}</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono tracking-tight ${activeForecast.liquidityDaysToCrisis < 90 ? 'text-rose-500' : activeForecast.liquidityDaysToCrisis < 180 ? 'text-amber-500' : 'text-foreground'}`}>
              {activeForecast.liquidityDaysToCrisis === 9999 ? '∞' : `${activeForecast.liquidityDaysToCrisis} ${t('scenario.forecast.days')}`}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">{t('scenario.forecast.liquidityUnit')}</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {activeForecast.liquidityDaysToCrisis < 90
              ? t('scenario.forecast.liquidityDescCritical')
              : activeForecast.liquidityDaysToCrisis === 9999
              ? t('scenario.forecast.liquidityDescStable')
              : t('scenario.forecast.liquidityDescWarning')}
          </p>
        </div>

        {/* Instabilidade & Fadiga */}
        <div className="p-6 bg-surface-container/40 border border-border/40 rounded-2xl space-y-6 h-full flex flex-col justify-center">
          <div>
            <div className="flex justify-between items-center text-[10px] font-mono font-bold tracking-wider mb-1.5">
              <span className="text-muted-foreground">{t('scenario.forecast.instabilityTitle')}</span>
              <span className={activeForecast.governanceInstabilityIndex > 50 ? 'text-rose-500 font-extrabold' : 'text-foreground font-extrabold'}>
                {activeForecast.governanceInstabilityIndex}%
              </span>
            </div>
            <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-1.5 rounded-full transition-all duration-500 ${activeForecast.governanceInstabilityIndex > 50 ? 'bg-rose-500' : 'bg-secondary'}`}
                style={{ width: `${activeForecast.governanceInstabilityIndex}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-[10px] font-mono font-bold tracking-wider mb-1.5">
              <span className="text-muted-foreground">{t('scenario.forecast.fatigueTitle')}</span>
              <span className={activeForecast.operationalFatigueIndex > 50 ? 'text-amber-500 font-extrabold' : 'text-foreground font-extrabold'}>
                {activeForecast.operationalFatigueIndex}%
              </span>
            </div>
            <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-1.5 rounded-full transition-all duration-500 ${activeForecast.operationalFatigueIndex > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${activeForecast.operationalFatigueIndex}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 bg-surface-container/40 border border-border/40 rounded-2xl font-mono text-xs shadow-inner">
        <span className="text-muted-foreground font-bold uppercase tracking-widest block mb-4">{t('scenario.forecast.trajectoryTitle')}</span>
        <div className="flex flex-wrap items-center gap-2">
          {activeForecast.projectedEscalationTrajectory.map((step, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-muted-foreground/50">➔</span>}
              <span className={`px-3 py-1 rounded-full border text-[10px] font-bold tracking-wider ${
                idx === activeForecast.projectedEscalationTrajectory.length - 1
                  ? 'bg-rose-500/10 text-rose-500 border-rose-500/25'
                  : 'bg-card text-muted-foreground border-border'
              }`}>
                {step}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};
