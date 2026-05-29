import React from 'react';
import { useScenarioSimulation } from '../../context/scenario-simulation/ScenarioSimulationProvider';

export const GovernanceForecastSurface: React.FC = () => {
  const { forecastOutput, sandboxResult, historyCyclesToUse } = useScenarioSimulation();

  if (!forecastOutput) {
    return (
      <div className="card-premium p-8 text-center text-muted-foreground font-mono text-xs animate-pulse">
        AGUARDANDO PROJEÇÃO DE FORECAST...
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
    riskColor = 'text-rose-500';
    riskBg = 'bg-rose-500/10 border-rose-500/25';
  } else if (riskBand === 'HIGH_RISK') {
    riskColor = 'text-amber-500';
    riskBg = 'bg-amber-500/10 border-amber-500/25';
  } else if (riskBand === 'MODERATE_RISK') {
    riskColor = 'text-blue-500';
    riskBg = 'bg-blue-500/10 border-blue-500/25';
  }

  return (
    <div className="card-premium p-8 space-y-6 relative overflow-hidden group hover:border-secondary/20 transition-all duration-300">
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-secondary uppercase block mb-1">SSPGL FORECAST ENGINE</span>
          <h3 className="text-base font-medium text-foreground tracking-tight">Projected Governance Exposure</h3>
        </div>
        <div className={`px-3 py-1 rounded-full border font-mono text-[10px] font-bold tracking-widest ${riskBg} ${riskColor}`}>
          {riskBand.replace('_', ' ')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Velocidade de Deterioração */}
        <div className="p-5 bg-surface-container/60 border border-border/60 rounded-xl space-y-3">
          <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground uppercase block">DETERIORATION VELOCITY</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono tracking-tight ${isDeclining ? 'text-rose-500' : 'text-emerald-500'}`}>
              {velocity > 0 ? `+${velocity}` : velocity}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">/ cycle maturity score change</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {isDeclining 
              ? 'Métricas de governança em trajetória descendente linear de maturidade fiduciária.'
              : 'Trajetória linear indica estabilização ou progressão de governança.'}
          </p>
        </div>

        {/* Liquidez Crise */}
        <div className="p-5 bg-surface-container/60 border border-border/60 rounded-xl space-y-3">
          <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground uppercase block">LIQUIDITY PRESSURE DAYS</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono tracking-tight ${activeForecast.liquidityDaysToCrisis < 90 ? 'text-rose-500' : activeForecast.liquidityDaysToCrisis < 180 ? 'text-amber-500' : 'text-foreground'}`}>
              {activeForecast.liquidityDaysToCrisis === 9999 ? '∞' : `${activeForecast.liquidityDaysToCrisis} Days`}
            </span>
            <span className="text-[10px] text-muted-foreground font-mono">to projected buffer exhaustion</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            {activeForecast.liquidityDaysToCrisis < 90
              ? 'Alerta crítico: caixa remanescente insustentável sob as taxas de queima atuais.'
              : activeForecast.liquidityDaysToCrisis === 9999
              ? 'Margem de caixa operacional estável. Sem pressão de queima de caixa identificada.'
              : 'Acompanhamento recomendado de custos e fluxo de recebíveis nos próximos ciclos.'}
          </p>
        </div>

        {/* Instabilidade & Fadiga */}
        <div className="p-5 bg-surface-container/60 border border-border/60 rounded-xl space-y-4">
          <div>
            <div className="flex justify-between items-center text-[10px] font-mono font-bold tracking-wider mb-1.5">
              <span className="text-muted-foreground">GOVERNANCE INSTABILITY</span>
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
              <span className="text-muted-foreground">OPERATIONAL FATIGUE INDEX</span>
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

      <div className="p-5 bg-surface-container/60 border border-border/60 rounded-xl font-mono text-xs">
        <span className="text-muted-foreground font-bold uppercase tracking-widest block mb-3">PROJECTED ESCALATION TRAJECTORY</span>
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
