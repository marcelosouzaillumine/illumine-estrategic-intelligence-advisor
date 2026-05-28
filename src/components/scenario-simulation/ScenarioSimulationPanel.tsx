import React from 'react';
import { useScenarioSimulation } from '../../context/scenario-simulation/ScenarioSimulationProvider';
import { SimulationScenarioType, SimulationTimeHorizon } from '../../core/runtime/scenario-simulation/types';
import { ForecastIntegrityBadge } from './ForecastIntegrityBadge';

export const ScenarioSimulationPanel: React.FC = () => {
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
    { type: 'LIQUIDITY_STRESS', label: 'Liquidity Stress', desc: 'Simula choque abrupto nas disponibilidades de caixa.' },
    { type: 'OPERATIONAL_COLLAPSE', label: 'Operational Collapse', desc: 'Simula quebra de entrega e atraso de processos chaves.' },
    { type: 'MARGIN_DETERIORATION', label: 'Margin Deterioration', desc: 'Simula compressão drástica de margens financeiras.' },
    { type: 'GOVERNANCE_BREAKDOWN', label: 'Governance Breakdown', desc: 'Simula falhas de controle e atrito de conselho.' },
    { type: 'MULTI_ENTITY_CONTAGION', label: 'Multi-Entity Contagion', desc: 'Simula inadimplência cruzada entre subsidiárias.' }
  ];

  const horizons: Array<{ value: SimulationTimeHorizon; label: string }> = [
    { value: '30_DAYS', label: '30 Dias' },
    { value: '90_DAYS', label: '90 Dias' },
    { value: '180_DAYS', label: '180 Dias' },
    { value: '365_DAYS', label: '365 Dias' }
  ];

  return (
    <div className="p-6 bg-slate-950/70 border border-slate-800 rounded-xl space-y-6">
      <div className="flex justify-between items-center border-b border-slate-850 pb-3 flex-wrap gap-2">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">SSPGL RUNTIME PLATFORM</span>
          <h3 className="text-sm font-bold text-slate-200 font-mono mt-0.5">Governance Scenario Simulator</h3>
        </div>
        {simulationOutput && (
          <ForecastIntegrityBadge state={simulationOutput.integrityState} />
        )}
      </div>

      <div className="space-y-4">
        {/* Escolha do Cenário */}
        <div>
          <span className="text-[10px] font-mono text-slate-500 uppercase block mb-2">1. SELECT STRESS SCENARIO</span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {scenarios.map((scen) => (
              <button
                key={scen.type}
                onClick={() => setScenarioType(scen.type)}
                className={`p-3 border rounded-xl text-left transition-all hover:border-slate-700 active:scale-[0.98] flex flex-col gap-1 ${
                  activeScenarioType === scen.type
                    ? 'border-cyan-500 bg-cyan-950/20 text-cyan-400'
                    : 'border-slate-850 bg-slate-900/40 text-slate-400 hover:text-slate-350'
                }`}
              >
                <span className="text-xs font-mono font-bold">{scen.label}</span>
                <span className="text-[10px] opacity-80 leading-normal font-sans">{scen.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Horizonte Temporal */}
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase block mb-2">2. TIME HORIZON</span>
            <div className="flex bg-slate-900/60 border border-slate-850 p-1 rounded-xl gap-1">
              {horizons.map((hor) => (
                <button
                  key={hor.value}
                  onClick={() => setHorizon(hor.value)}
                  className={`flex-1 py-1.5 rounded-lg text-center font-mono text-xs font-bold transition-all ${
                    activeHorizon === hor.value
                      ? 'bg-slate-800 text-cyan-400 border border-slate-700'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  {hor.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ciclos Históricos (Controle de Suficiência) */}
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase block mb-2">3. HISTORICAL SUFFICIENCY TESTER</span>
            <div className="flex bg-slate-900/60 border border-slate-850 p-1 rounded-xl gap-1">
              {[1, 2, 3, 4].map((cycles) => (
                <button
                  key={cycles}
                  onClick={() => setHistoryCyclesToUse(cycles)}
                  className={`flex-1 py-1.5 rounded-lg text-center font-mono text-xs font-bold transition-all flex flex-col items-center justify-center ${
                    historyCyclesToUse === cycles
                      ? cycles < 3
                        ? 'bg-amber-950/40 text-amber-400 border border-amber-800'
                        : 'bg-slate-800 text-emerald-400 border border-slate-700'
                      : 'text-slate-400 hover:text-slate-300'
                  }`}
                >
                  <span>{cycles} {cycles === 1 ? 'Ciclo' : 'Ciclos'}</span>
                  <span className="text-[8px] opacity-60">
                    {cycles < 3 ? 'WARNING' : 'SUFFICIENT'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {isRunning && (
        <div className="p-3 bg-cyan-950/20 border border-cyan-800/20 text-cyan-400 rounded-lg text-center font-mono text-xs animate-pulse">
          Executing deterministic forecast calculations...
        </div>
      )}
    </div>
  );
};
