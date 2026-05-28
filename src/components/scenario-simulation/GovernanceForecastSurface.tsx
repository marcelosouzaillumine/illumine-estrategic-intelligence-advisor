import React from 'react';
import { useScenarioSimulation } from '../../context/scenario-simulation/ScenarioSimulationProvider';

export const GovernanceForecastSurface: React.FC = () => {
  const { forecastOutput, sandboxResult, historyCyclesToUse } = useScenarioSimulation();

  if (!forecastOutput) {
    return (
      <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl text-center text-slate-500 font-mono text-xs">
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
  let riskColor = 'text-emerald-400';
  let riskBg = 'bg-emerald-950/20 border-emerald-500/20';

  if (riskBand === 'CRITICAL_RISK') {
    riskColor = 'text-rose-400';
    riskBg = 'bg-rose-950/20 border-rose-500/20';
  } else if (riskBand === 'HIGH_RISK') {
    riskColor = 'text-amber-400';
    riskBg = 'bg-amber-950/20 border-amber-500/20';
  } else if (riskBand === 'MODERATE_RISK') {
    riskColor = 'text-cyan-400';
    riskBg = 'bg-cyan-950/20 border-cyan-500/20';
  }

  return (
    <div className="p-6 bg-slate-950/70 border border-slate-800 rounded-xl space-y-6">
      <div className="flex justify-between items-center border-b border-slate-850 pb-3">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">SSPGL FORECAST ENGINE</span>
          <h3 className="text-sm font-bold text-slate-200 font-mono mt-0.5">Projected Governance Exposure</h3>
        </div>
        <div className={`px-2.5 py-1 rounded border font-mono text-xs ${riskBg} ${riskColor}`}>
          {riskBand.replace('_', ' ')}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Velocidade de Deterioração */}
        <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl space-y-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">DETERIORATION VELOCITY</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${isDeclining ? 'text-rose-400' : 'text-emerald-400'}`}>
              {velocity > 0 ? `+${velocity}` : velocity}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">/ cycle maturity score change</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {isDeclining 
              ? 'Métricas de governança em trajetória descendente linear de maturidade fiduciária.'
              : 'Trajetória linear indica estabilização ou progressão de governança.'}
          </p>
        </div>

        {/* Liquidez Crise */}
        <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl space-y-2">
          <span className="text-[10px] font-mono text-slate-500 uppercase block">LIQUIDITY PRESSURE DAYS</span>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold font-mono ${activeForecast.liquidityDaysToCrisis < 90 ? 'text-rose-400' : activeForecast.liquidityDaysToCrisis < 180 ? 'text-amber-400' : 'text-slate-200'}`}>
              {activeForecast.liquidityDaysToCrisis === 9999 ? '∞' : `${activeForecast.liquidityDaysToCrisis} Days`}
            </span>
            <span className="text-[10px] text-slate-500 font-mono">to projected buffer exhaustion</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            {activeForecast.liquidityDaysToCrisis < 90
              ? 'Alerta crítico: caixa remanescente insustentável sob as taxas de queima atuais.'
              : activeForecast.liquidityDaysToCrisis === 9999
              ? 'Margem de caixa operacional estável. Sem pressão de queima de caixa identificada.'
              : 'Acompanhamento recomendado de custos e fluxo de recebíveis nos próximos ciclos.'}
          </p>
        </div>

        {/* Instabilidade & Fadiga */}
        <div className="p-4 bg-slate-900/40 border border-slate-850 rounded-xl space-y-3">
          <div>
            <div className="flex justify-between items-center text-[10px] font-mono mb-1">
              <span className="text-slate-500">GOVERNANCE INSTABILITY</span>
              <span className={activeForecast.governanceInstabilityIndex > 50 ? 'text-rose-400' : 'text-slate-300'}>
                {activeForecast.governanceInstabilityIndex}%
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-1.5 rounded-full transition-all duration-500 ${activeForecast.governanceInstabilityIndex > 50 ? 'bg-rose-500' : 'bg-cyan-500'}`}
                style={{ width: `${activeForecast.governanceInstabilityIndex}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center text-[10px] font-mono mb-1">
              <span className="text-slate-500">OPERATIONAL FATIGUE INDEX</span>
              <span className={activeForecast.operationalFatigueIndex > 50 ? 'text-amber-400' : 'text-slate-300'}>
                {activeForecast.operationalFatigueIndex}%
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-1.5 overflow-hidden">
              <div 
                className={`h-1.5 rounded-full transition-all duration-500 ${activeForecast.operationalFatigueIndex > 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                style={{ width: `${activeForecast.operationalFatigueIndex}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-slate-900/20 border border-slate-850 rounded-xl font-mono text-xs">
        <span className="text-slate-500 uppercase tracking-wider block mb-2">PROJECTED ESCALATION TRAJECTORY</span>
        <div className="flex flex-wrap items-center gap-2">
          {activeForecast.projectedEscalationTrajectory.map((step, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <span className="text-slate-600">➔</span>}
              <span className={`px-2 py-0.5 rounded border text-[11px] font-bold ${
                idx === activeForecast.projectedEscalationTrajectory.length - 1
                  ? 'bg-rose-950/20 text-rose-400 border-rose-500/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
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
