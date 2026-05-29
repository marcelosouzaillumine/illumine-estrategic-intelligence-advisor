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
    <div className="card-premium p-8 space-y-8 relative overflow-hidden group hover:border-secondary/20 transition-all duration-300">
      <div className="flex justify-between items-center border-b border-border/40 pb-4 flex-wrap gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-widest text-secondary uppercase block mb-1">SSPGL RUNTIME PLATFORM</span>
          <h3 className="text-base font-medium text-foreground tracking-tight">Governance Scenario Simulator</h3>
        </div>
        {simulationOutput && (
          <ForecastIntegrityBadge state={simulationOutput.integrityState} />
        )}
      </div>

      <div className="space-y-6">
        {/* Escolha do Cenário */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground uppercase block">1. SELECT STRESS SCENARIO</span>
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
            <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground uppercase block">2. TIME HORIZON</span>
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
            <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground uppercase block">3. HISTORICAL SUFFICIENCY TESTER</span>
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
                  <span>{cycles} {cycles === 1 ? 'Ciclo' : 'Ciclos'}</span>
                  <span className="text-[8px] opacity-80 mt-0.5 tracking-wider uppercase font-semibold">
                    {cycles < 3 ? 'WARNING' : 'SUFFICIENT'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {isRunning && (
        <div className="p-4 bg-secondary/5 border border-secondary/20 text-secondary rounded-xl text-center font-mono text-xs animate-pulse tracking-wide font-medium">
          Executing deterministic forecast calculations...
        </div>
      )}
    </div>
  );
};
