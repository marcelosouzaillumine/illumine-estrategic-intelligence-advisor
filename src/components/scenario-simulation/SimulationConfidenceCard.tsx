import React from 'react';
import { useScenarioSimulation } from '../../context/scenario-simulation/ScenarioSimulationProvider';

export const SimulationConfidenceCard: React.FC = () => {
  const { simulationOutput, forecastOutput } = useScenarioSimulation();

  if (!simulationOutput) {
    return (
      <div className="card-premium p-8 text-center text-muted-foreground font-mono text-xs animate-pulse">
        CARREGANDO ANÁLISE DE CONFIANÇA FIDUCIÁRIA...
      </div>
    );
  }

  const { confidenceLevel, integrityState, assumptions, limitations } = simulationOutput;

  let confidenceLabel = 'HIGH MODEL STABILITY';
  let confidenceDesc = 'Base histórica consolidada e auditada com mais de 3 ciclos operacionais disponíveis.';
  let cardBorder = 'border-border/60 hover:border-secondary/20';
  let titleColor = 'text-emerald-500';

  if (confidenceLevel === 'INSUFFICIENT_HISTORY') {
    confidenceLabel = 'INSUFFICIENT HISTORY WARNING';
    confidenceDesc = 'A simulação está degradada devido à ausência de dados históricos suficientes (mínimo de 3 ciclos). Margem elevada de incerteza operacional.';
    cardBorder = 'border-amber-500/30 bg-amber-500/5 shadow-[0_0_12px_rgba(245,158,11,0.08)]';
    titleColor = 'text-amber-500';
  } else if (integrityState === 'FAIL_CLOSED') {
    confidenceLabel = 'FAIL-CLOSED REJECTION';
    confidenceDesc = 'Operação suspensa temporariamente por auditoria de segurança ou quebra de linhagem de dados.';
    cardBorder = 'border-rose-500/30 bg-rose-500/5 shadow-[0_0_12px_rgba(239,68,68,0.08)] animate-executive-pulse';
    titleColor = 'text-rose-500';
  }

  return (
    <div className={`card-premium p-8 transition-all duration-300 ${cardBorder} space-y-6`}>
      <div className="flex justify-between items-start gap-6 flex-wrap md:flex-nowrap">
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold tracking-widest text-muted-foreground uppercase block mb-1">FIDUCIARY CONFIDENCE EXPOSURE</span>
          <h3 className={`text-base font-bold font-mono tracking-wide ${titleColor}`}>{confidenceLabel}</h3>
          <p className="text-muted-foreground text-xs mt-2 leading-relaxed max-w-2xl">
            {confidenceDesc}
          </p>
        </div>
        <div className="bg-surface-container/60 border border-border/60 px-4 py-3 rounded-xl text-right font-mono text-[10px] font-bold tracking-wider text-muted-foreground shrink-0 shadow-xs">
          <div className="mb-1">CONFIDENCE: <span className="text-foreground font-extrabold">{confidenceLevel}</span></div>
          <div>INTEGRITY: <span className="text-foreground font-extrabold">{integrityState}</span></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border/40 pt-6">
        <div className="space-y-3">
          <h4 className="text-foreground font-mono text-[11px] font-bold tracking-widest uppercase">ASSUMPTIONS & FOUNDATIONS</h4>
          <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed list-disc list-inside">
            {assumptions.map((item, idx) => (
              <li key={idx} className="marker:text-secondary">{item}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-3">
          <h4 className="text-foreground font-mono text-[11px] font-bold tracking-widest uppercase">LIMITATIONS & EXCLUSIONS</h4>
          <ul className="space-y-2 text-xs text-muted-foreground leading-relaxed list-disc list-inside">
            {limitations.map((item, idx) => (
              <li key={idx} className="marker:text-secondary">{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
