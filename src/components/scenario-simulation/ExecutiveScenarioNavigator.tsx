import React, { useState } from 'react';
import { useScenarioSimulation } from '../../context/scenario-simulation/ScenarioSimulationProvider';
import { SandboxConfig } from '../../core/runtime/scenario-simulation/types';

export const ExecutiveScenarioNavigator: React.FC = () => {
  const {
    sandboxActions,
    applySandboxAction,
    removeSandboxAction,
    clearSandbox,
    sandboxResult
  } = useScenarioSimulation();

  const [intensity, setIntensity] = useState<number>(0.5);

  const availableActions: Array<{
    type: SandboxConfig['actionType'];
    label: string;
    description: string;
  }> = [
    {
      type: 'HIRING_FREEZE',
      label: 'Hiring Freeze',
      description: 'Bloqueio de novas contratações operacionais para redução de custos fixos.'
    },
    {
      type: 'DEBT_INCREASE',
      label: 'Debt Financing',
      description: 'Aporte de caixa emergencial via captação de passivos de curto prazo.'
    },
    {
      type: 'SUPPLIER_CONCENTRATION',
      label: 'Supplier Concentration',
      description: 'Concentração de contratos para obter ganhos de escala nas compras.'
    },
    {
      type: 'RESTRUCTURING',
      label: 'Restructuring Plan',
      description: 'Reestruturação corporativa profunda para otimização de margens de contribuição.'
    },
    {
      type: 'EXPANSION',
      label: 'Market Expansion',
      description: 'Investimento em canais de captação de receita circulante rápida.'
    },
    {
      type: 'OPERATIONAL_CONTRACTION',
      label: 'Operational Contraction',
      description: 'Redução e encerramento de filiais com margem negativa ou deficitária.'
    }
  ];

  const handleActionToggle = (type: SandboxConfig['actionType']) => {
    const isActive = sandboxActions.some(a => a.actionType === type);
    if (isActive) {
      removeSandboxAction(type);
    } else {
      applySandboxAction({ actionType: type, intensity });
    }
  };

  return (
    <div className="card-premium p-8 space-y-6 relative overflow-hidden group hover:border-secondary/20 transition-all duration-300">
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <h4 className="text-sm font-medium text-foreground tracking-tight">
          Strategic Decisions Sandbox Controls
        </h4>
        {sandboxActions.length > 0 && (
          <button
            onClick={clearSandbox}
            className="text-[10px] font-mono text-rose-500 hover:text-rose-600 uppercase border border-rose-500/20 px-3 py-1 rounded-full bg-rose-500/10 cursor-pointer transition-all duration-200"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Intensidade */}
        <div className="flex flex-col gap-2.5 p-4 bg-surface-container/60 border border-border/60 rounded-xl">
          <div className="flex justify-between text-[11px] font-mono font-bold tracking-widest text-muted-foreground">
            <span>DECISION INTENSITY / LEVER FORCE</span>
            <span className="text-secondary font-black">{(intensity * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={intensity}
            onChange={(e) => setIntensity(parseFloat(e.target.value))}
            className="w-full accent-secondary h-1.5 bg-surface-container-high rounded-lg cursor-pointer"
          />
        </div>

        {/* Grade de Decisões */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {availableActions.map((act) => {
            const activeAction = sandboxActions.find(a => a.actionType === act.type);
            const isActive = !!activeAction;

            return (
              <button
                key={act.type}
                onClick={() => handleActionToggle(act.type)}
                className={`p-4 border rounded-xl text-left transition-all duration-300 flex flex-col justify-between gap-2.5 active:scale-[0.98] cursor-pointer ${
                  isActive
                    ? 'border-secondary bg-secondary/10 text-secondary shadow-[0_0_12px_rgba(255,133,82,0.12)]'
                    : 'border-border/60 bg-surface-container/40 text-muted-foreground hover:border-secondary/40 hover:text-foreground'
                }`}
              >
                <div>
                  <span className={`text-xs font-semibold tracking-wider uppercase block ${isActive ? 'text-secondary font-bold' : 'text-foreground'}`}>
                    {act.label}
                  </span>
                  <p className="text-[10.5px] leading-relaxed mt-1 opacity-90">
                    {act.description}
                  </p>
                </div>

                {isActive && (
                  <div className="mt-2 text-[9px] font-mono tracking-widest font-bold flex justify-between w-full border-t border-secondary/20 pt-2 text-secondary/90">
                    <span>STATUS: SIMULATED</span>
                    <span>INTENSITY: {(activeAction.intensity * 100).toFixed(0)}%</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {sandboxResult && (
        <div className="p-4 bg-secondary/5 border border-secondary/20 rounded-xl flex justify-between items-center font-mono text-xs">
          <span className="text-muted-foreground font-semibold uppercase tracking-wider">Sandbox Stress Delta:</span>
          <span className={`font-bold tracking-wide ${sandboxResult.stressDelta <= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
            {sandboxResult.stressDelta > 0 ? `+${sandboxResult.stressDelta}` : sandboxResult.stressDelta}% Score Impact
          </span>
        </div>
      )}
    </div>
  );
};
