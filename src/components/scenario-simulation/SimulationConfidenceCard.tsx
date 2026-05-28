import React from 'react';
import { useScenarioSimulation } from '../../context/scenario-simulation/ScenarioSimulationProvider';

export const SimulationConfidenceCard: React.FC = () => {
  const { simulationOutput, forecastOutput } = useScenarioSimulation();

  if (!simulationOutput) {
    return (
      <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl text-center text-slate-500 font-mono text-xs">
        CARREGANDO ANÁLISE DE CONFIANÇA FIDUCIÁRIA...
      </div>
    );
  }

  const { confidenceLevel, integrityState, assumptions, limitations } = simulationOutput;

  let confidenceLabel = 'HIGH MODEL STABILITY';
  let confidenceDesc = 'Base histórica consolidada e auditada com mais de 3 ciclos operacionais disponíveis.';
  let cardBorder = 'border-slate-800';
  let titleColor = 'text-cyan-400';

  if (confidenceLevel === 'INSUFFICIENT_HISTORY') {
    confidenceLabel = 'INSUFFICIENT HISTORY WARNING';
    confidenceDesc = 'A simulação está degradada devido à ausência de dados históricos suficientes (mínimo de 3 ciclos). Margem elevada de incerteza operacional.';
    cardBorder = 'border-amber-500/30 bg-amber-950/10';
    titleColor = 'text-amber-400';
  } else if (integrityState === 'FAIL_CLOSED') {
    confidenceLabel = 'FAIL-CLOSED REJECTION';
    confidenceDesc = 'Operação suspensa temporariamente por auditoria de segurança ou quebra de linhagem de dados.';
    cardBorder = 'border-rose-500/30 bg-rose-950/10';
    titleColor = 'text-rose-400';
  }

  return (
    <div className={`p-6 border rounded-xl transition-all ${cardBorder} space-y-4`}>
      <div className="flex justify-between items-start gap-4">
        <div>
          <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase block mb-1">FIDUCIARY CONFIDENCE EXPOSURE</span>
          <h3 className={`text-base font-bold font-mono ${titleColor}`}>{confidenceLabel}</h3>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed max-w-xl">
            {confidenceDesc}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg text-right font-mono text-[11px] text-slate-400">
          <div>CONFIDENCE: <span className="font-bold text-slate-200">{confidenceLevel}</span></div>
          <div>INTEGRITY: <span className="font-bold text-slate-200">{integrityState}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-850 pt-4">
        <div>
          <h4 className="text-slate-400 font-mono text-[11px] font-semibold uppercase mb-2">ASSUMPTIONS & FOUNDATIONS</h4>
          <ul className="space-y-1.5 text-xs text-slate-400 leading-relaxed list-disc list-inside">
            {assumptions.map((item, idx) => (
              <li key={idx} className="marker:text-slate-600">{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-slate-400 font-mono text-[11px] font-semibold uppercase mb-2">LIMITATIONS & EXCLUSIONS</h4>
          <ul className="space-y-1.5 text-xs text-slate-400 leading-relaxed list-disc list-inside">
            {limitations.map((item, idx) => (
              <li key={idx} className="marker:text-slate-600">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
