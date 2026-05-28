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
    <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
      <div className="flex justify-between items-center border-b border-slate-850 pb-2">
        <h4 className="text-slate-400 font-semibold tracking-wider uppercase text-xs font-mono">
          Strategic Decisions Sandbox Controls
        </h4>
        {sandboxActions.length > 0 && (
          <button
            onClick={clearSandbox}
            className="text-[10px] font-mono text-rose-400 hover:text-rose-300 uppercase border border-rose-500/20 px-2 py-0.5 rounded bg-rose-950/20"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Intensidade */}
        <div className="flex flex-col gap-1.5 p-3 bg-slate-900/30 border border-slate-850 rounded-lg">
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>DECISION INTENSITY / LEVER FORCE</span>
            <span className="text-cyan-400 font-bold">{(intensity * 100).toFixed(0)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={intensity}
            onChange={(e) => setIntensity(parseFloat(e.target.value))}
            className="w-full accent-cyan-500 h-1 bg-slate-950 rounded-lg cursor-pointer"
          />
        </div>

        {/* Grade de Decisões */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {availableActions.map((act) => {
            const activeAction = sandboxActions.find(a => a.actionType === act.type);
            const isActive = !!activeAction;

            return (
              <button
                key={act.type}
                onClick={() => handleActionToggle(act.type)}
                className={`p-3.5 border rounded-xl text-left transition-all duration-200 flex flex-col justify-between gap-1.5 active:scale-[0.98] ${
                  isActive
                    ? 'border-cyan-500 bg-cyan-950/30 text-cyan-400 shadow-md shadow-cyan-500/5'
                    : 'border-slate-850 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                }`}
              >
                <div>
                  <span className={`text-xs font-mono font-bold block ${isActive ? 'text-cyan-300' : 'text-slate-300'}`}>
                    {act.label}
                  </span>
                  <p className="text-[10px] text-slate-400 leading-normal mt-1">
                    {act.description}
                  </p>
                </div>

                {isActive && (
                  <div className="mt-2 text-[9px] font-mono flex justify-between w-full border-t border-cyan-500/20 pt-1 text-cyan-500">
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
        <div className="p-3 bg-cyan-950/20 border border-cyan-500/20 rounded-lg flex justify-between items-center font-mono text-xs">
          <span className="text-slate-400">Sandbox Stress Delta:</span>
          <span className={`font-bold ${sandboxResult.stressDelta <= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {sandboxResult.stressDelta > 0 ? `+${sandboxResult.stressDelta}` : sandboxResult.stressDelta}% Score Impact
          </span>
        </div>
      )}
    </div>
  );
};
