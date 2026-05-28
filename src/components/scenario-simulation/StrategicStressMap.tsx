import React from 'react';
import { useScenarioSimulation } from '../../context/scenario-simulation/ScenarioSimulationProvider';
import { StrategicStressLevel } from '../../core/runtime/scenario-simulation/types';

export const StrategicStressMap: React.FC = () => {
  const { simulationOutput, sandboxResult } = useScenarioSimulation();

  if (!simulationOutput) {
    return (
      <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl text-center text-slate-500 font-mono text-xs">
        CARREGANDO MAPA DE STRESS...
      </div>
    );
  }

  // Se houver sandbox, exibir o stress do sandbox. Senão, o original.
  const activeOutput = sandboxResult ? sandboxResult.simulatedOutput : simulationOutput;
  const currentStress: StrategicStressLevel = activeOutput.stressClassification;

  const stressLevels: Array<{
    level: StrategicStressLevel;
    label: string;
    description: string;
    bgStyle: string;
    activeBorder: string;
    textColor: string;
  }> = [
    {
      level: 'LIGHT',
      label: 'Nível 1: LIGHT STRESS',
      description: 'Métricas fiduciárias estáveis. Sem risco iminente de deterioração ou quebra operacional.',
      bgStyle: 'bg-emerald-950/20 border-slate-850 hover:bg-emerald-950/30 text-emerald-400',
      activeBorder: 'border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.15)] bg-emerald-950/45',
      textColor: 'text-emerald-400'
    },
    {
      level: 'MODERATE',
      label: 'Nível 2: MODERATE STRESS',
      description: 'Deterioração sutil identificada. Recomenda-se acompanhamento e alinhamento de custos.',
      bgStyle: 'bg-cyan-950/20 border-slate-850 hover:bg-cyan-950/30 text-cyan-400',
      activeBorder: 'border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)] bg-cyan-950/45',
      textColor: 'text-cyan-400'
    },
    {
      level: 'HIGH',
      label: 'Nível 3: HIGH STRESS',
      description: 'Aceleração de custos e queima de liquidez. Ações de contingência e CFO recomendadas.',
      bgStyle: 'bg-amber-950/20 border-slate-850 hover:bg-amber-950/30 text-amber-400',
      activeBorder: 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)] bg-amber-950/45',
      textColor: 'text-amber-400'
    },
    {
      level: 'EXTREME',
      label: 'Nível 4: EXTREME STRESS',
      description: 'Risco crítico de liquidez negativa e bloqueio societário. Requer intervenção imediata do Board.',
      bgStyle: 'bg-rose-950/20 border-slate-850 hover:bg-rose-950/30 text-rose-400',
      activeBorder: 'border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.15)] bg-rose-950/45 animate-pulse',
      textColor: 'text-rose-400'
    }
  ];

  return (
    <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
      <div className="flex justify-between items-center border-b border-slate-850 pb-2">
        <h4 className="text-slate-400 font-semibold tracking-wider uppercase text-xs font-mono">
          Strategic Stress Classification
        </h4>
        {sandboxResult && (
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-cyan-950/30 text-cyan-400 border border-cyan-500/20">
            SANDBOX PROJECTION
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stressLevels.map((s, idx) => {
          const isActive = currentStress === s.level;
          return (
            <div
              key={idx}
              className={`p-4 border rounded-xl transition-all duration-300 flex flex-col justify-between ${
                isActive ? s.activeBorder : s.bgStyle + ' opacity-55 hover:opacity-85'
              }`}
            >
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[11px] font-mono font-bold uppercase ${isActive ? s.textColor : 'text-slate-400'}`}>
                    {s.label}
                  </span>
                  {isActive && <span className="w-2.5 h-2.5 rounded-full bg-current animate-ping" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  {s.description}
                </p>
              </div>

              {isActive && (
                <div className="mt-4 pt-2 border-t border-slate-800/80 text-[10px] font-mono text-slate-300 flex justify-between">
                  <span>STATUS: ACTIVE</span>
                  <span>SCORE: {activeOutput.projectedDeterioration.score}%</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
