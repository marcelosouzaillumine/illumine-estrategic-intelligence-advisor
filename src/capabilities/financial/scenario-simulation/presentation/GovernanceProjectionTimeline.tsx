import React from 'react';
import { useScenarioSimulation } from '../../../../context/scenario-simulation/ScenarioSimulationProvider';
import { useLanguage } from '../../../../contexts/LanguageContext';


export const GovernanceProjectionTimeline: React.FC = () => {
  const { t } = useLanguage();
  const { simulationOutput, sandboxResult, activeHorizon } = useScenarioSimulation();

  if (!simulationOutput) {
    return (
      <div className="card-premium p-8 text-center text-muted-foreground font-mono text-xs animate-pulse">
        {t('scenario.timeline.loading')}
      </div>
    );
  }

  const baseScore = simulationOutput.projectedDeterioration.score;
  const sandboxScore = sandboxResult ? sandboxResult.simulatedOutput.projectedDeterioration.score : baseScore;

  // Gerar trajetórias de 4 pontos (ciclo inicial, meio-1, meio-2, fim de horizonte)
  const basePoints = [
    { label: t('scenario.timeline.today'), value: Math.round(baseScore * 0.25) },
    { label: 'T + 30%', value: Math.round(baseScore * 0.5) },
    { label: 'T + 60%', value: Math.round(baseScore * 0.75) },
    { label: activeHorizon.replace('_', ' '), value: baseScore }
  ];

  const sandPoints = [
    { label: t('scenario.timeline.today'), value: Math.round(sandboxScore * 0.25) },
    { label: 'T + 30%', value: Math.round(sandboxScore * 0.5) },
    { label: 'T + 60%', value: Math.round(sandboxScore * 0.75) },
    { label: activeHorizon.replace('_', ' '), value: sandboxScore }
  ];

  // Configurações do SVG
  const width = 500;
  const height = 180;
  const padding = 35;

  const getCoordinates = (index: number, value: number) => {
    const x = padding + (index * (width - padding * 2)) / 3;
    const y = height - padding - (value * (height - padding * 2)) / 100;
    return { x, y };
  };

  const baseCoords = basePoints.map((p, idx) => getCoordinates(idx, p.value));
  const sandCoords = sandPoints.map((p, idx) => getCoordinates(idx, p.value));

  const baseLinePath = baseCoords.map((c, idx) => `${idx === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const sandLinePath = sandCoords.map((c, idx) => `${idx === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');

  return (
    <div className="card-premium p-8 space-y-6 relative overflow-hidden group hover:border-secondary/20 transition-all duration-300">
      <div className="flex justify-between items-center border-b border-border/40 pb-4">
        <h4 className="text-sm font-medium text-foreground tracking-tight">
          {t('scenario.timeline.title')}
        </h4>
        <div className="flex gap-4 font-mono text-[10px] font-bold tracking-widest">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-muted-foreground/50 rounded-full inline-block" />
            <span className="text-muted-foreground">{t('scenario.timeline.baseline')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1 bg-secondary rounded-full inline-block" />
            <span className="text-secondary">{t('scenario.timeline.sandbox')}</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          {/* Linhas de Grade de Fundo */}
          {[0, 25, 50, 75, 100].map((gridVal) => {
            const y = height - padding - (gridVal * (height - padding * 2)) / 100;
            return (
              <g key={gridVal} className="opacity-40">
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="currentColor" className="text-border" strokeWidth={1} strokeDasharray="3 3" />
                <text x={padding - 8} y={y + 3} fill="currentColor" className="text-muted-foreground font-mono text-[9px]" textAnchor="end">
                  {gridVal}
                </text>
              </g>
            );
          })}

          {/* Rótulos do Eixo X */}
          {basePoints.map((p, idx) => {
            const x = padding + (idx * (width - padding * 2)) / 3;
            return (
              <text key={idx} x={x} y={height - padding + 18} fill="currentColor" className="text-muted-foreground font-mono text-[9px] font-semibold" textAnchor="middle">
                {p.label}
              </text>
            );
          })}

          {/* Linha da Baseline */}
          <path d={baseLinePath} fill="none" stroke="currentColor" className="text-muted-foreground" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" opacity={0.4} />
          {baseCoords.map((c, idx) => (
            <circle key={idx} cx={c.x} cy={c.y} r={3} fill="currentColor" className="text-muted-foreground" opacity={0.6} />
          ))}

          {/* Linha do Sandbox (se houver modificações ativas) */}
          {sandboxResult && (
            <>
              <path d={sandLinePath} fill="none" stroke="currentColor" className="text-secondary" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              {sandCoords.map((c, idx) => (
                <circle key={idx} cx={c.x} cy={c.y} r={3.5} fill="currentColor" className="text-secondary filter drop-shadow-[0_0_4px_rgba(255,133,82,0.4)]" />
              ))}
            </>
          )}
        </svg>
      </div>

      <div className="p-4 bg-surface-container/60 border border-border/60 rounded-xl flex justify-between font-mono text-[10px] text-muted-foreground">
        <div>{t('scenario.timeline.baselineTarget')} <span className="font-bold text-foreground">{baseScore}%</span></div>
        {sandboxResult && (
          <div>{t('scenario.timeline.sandboxTarget')} <span className="font-bold text-secondary">{sandboxScore}%</span></div>
        )}
      </div>
    </div>
  );
};
