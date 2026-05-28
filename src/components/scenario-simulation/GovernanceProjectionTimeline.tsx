import React from 'react';
import { useScenarioSimulation } from '../../context/scenario-simulation/ScenarioSimulationProvider';

export const GovernanceProjectionTimeline: React.FC = () => {
  const { simulationOutput, sandboxResult, activeHorizon } = useScenarioSimulation();

  if (!simulationOutput) {
    return (
      <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl text-center text-slate-500 font-mono text-xs">
        CARREGANDO GRÁFICO DE PROJEÇÃO...
      </div>
    );
  }

  const baseScore = simulationOutput.projectedDeterioration.score;
  const sandboxScore = sandboxResult ? sandboxResult.simulatedOutput.projectedDeterioration.score : baseScore;

  // Gerar trajetórias de 4 pontos (ciclo inicial, meio-1, meio-2, fim de horizonte)
  const basePoints = [
    { label: 'Hoje', value: Math.round(baseScore * 0.25) },
    { label: 'T + 30%', value: Math.round(baseScore * 0.5) },
    { label: 'T + 60%', value: Math.round(baseScore * 0.75) },
    { label: activeHorizon.replace('_', ' '), value: baseScore }
  ];

  const sandPoints = [
    { label: 'Hoje', value: Math.round(sandboxScore * 0.25) },
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
    <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-4">
      <div className="flex justify-between items-center border-b border-slate-850 pb-2">
        <h4 className="text-slate-400 font-semibold tracking-wider uppercase text-xs font-mono">
          Governance Deterioration Projection
        </h4>
        <div className="flex gap-4 font-mono text-[10px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-slate-500 inline-block" />
            <span className="text-slate-400">BASELINE</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" />
            <span className="text-cyan-400">SANDBOX</span>
          </div>
        </div>
      </div>

      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          {/* Linhas de Grade de Fundo */}
          {[0, 25, 50, 75, 100].map((gridVal) => {
            const y = height - padding - (gridVal * (height - padding * 2)) / 100;
            return (
              <g key={gridVal} className="opacity-20">
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#334155" strokeWidth={1} strokeDasharray="3 3" />
                <text x={padding - 8} y={y + 3} fill="#94a3b8" fontSize={9} textAnchor="end" fontFamily="monospace">
                  {gridVal}
                </text>
              </g>
            );
          })}

          {/* Rótulos do Eixo X */}
          {basePoints.map((p, idx) => {
            const x = padding + (idx * (width - padding * 2)) / 3;
            return (
              <text key={idx} x={x} y={height - padding + 15} fill="#64748b" fontSize={9} textAnchor="middle" fontFamily="monospace">
                {p.label}
              </text>
            );
          })}

          {/* Linha da Baseline */}
          <path d={baseLinePath} fill="none" stroke="#64748b" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" opacity={0.6} />
          {baseCoords.map((c, idx) => (
            <circle key={idx} cx={c.x} cy={c.y} r={3} fill="#64748b" />
          ))}

          {/* Linha do Sandbox (se houver modificações ativas) */}
          {sandboxResult && (
            <>
              <path d={sandLinePath} fill="none" stroke="#06b6d4" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
              {sandCoords.map((c, idx) => (
                <circle key={idx} cx={c.x} cy={c.y} r={3.5} fill="#06b6d4" className="filter drop-shadow-[0_0_4px_rgba(6,182,212,0.5)]" />
              ))}
            </>
          )}
        </svg>
      </div>

      <div className="p-3 bg-slate-900/30 border border-slate-850 rounded-xl flex justify-between font-mono text-[10px] text-slate-400">
        <div>BASELINE TARGET SCORE: <span className="font-bold text-slate-200">{baseScore}%</span></div>
        {sandboxResult && (
          <div>SANDBOX TARGET SCORE: <span className="font-bold text-cyan-400">{sandboxScore}%</span></div>
        )}
      </div>
    </div>
  );
};
