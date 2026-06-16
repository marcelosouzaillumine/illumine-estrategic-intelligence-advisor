import React from 'react';
import { useCommandCenter } from '../../context/governance-command-center/GovernanceCommandCenterProvider';

export const ExecutiveIncidentRadar: React.FC = () => {
  const { activeIncidents } = useCommandCenter();

  // Contagem de severidades
  const counts = {
    SYSTEMIC: activeIncidents.filter(i => i.incident.severity === 'SYSTEMIC' && i.currentStatus !== 'RESOLVED').length,
    CRITICAL: activeIncidents.filter(i => i.incident.severity === 'CRITICAL' && i.currentStatus !== 'RESOLVED').length,
    HIGH: activeIncidents.filter(i => i.incident.severity === 'HIGH' && i.currentStatus !== 'RESOLVED').length,
    MODERATE: activeIncidents.filter(i => i.incident.severity === 'MODERATE' && i.currentStatus !== 'RESOLVED').length,
    LOW: activeIncidents.filter(i => i.incident.severity === 'LOW' && i.currentStatus !== 'RESOLVED').length
  };

  const maxVal = Math.max(1, counts.SYSTEMIC, counts.CRITICAL, counts.HIGH, counts.MODERATE, counts.LOW);

  // Coordenadas para o SVG
  const width = 300;
  const height = 180;
  const cx = width / 2;
  const cy = height / 2 + 10;
  const rMax = 60;

  // Direções dos 5 eixos (em radianos)
  const angles = [
    -Math.PI / 2, // SYSTEMIC (Top)
    -Math.PI / 2 + (Math.PI * 2) / 5, // CRITICAL
    -Math.PI / 2 + (Math.PI * 4) / 5, // HIGH
    -Math.PI / 2 + (Math.PI * 6) / 5, // MODERATE
    -Math.PI / 2 + (Math.PI * 8) / 5 // LOW
  ];

  const categories = ['SYSTEMIC', 'CRITICAL', 'HIGH', 'MODERATE', 'LOW'];

  const getCoordinates = (index: number, val: number) => {
    const angle = angles[index];
    const distance = (val / maxVal) * rMax;
    const x = cx + distance * Math.cos(angle);
    const y = cy + distance * Math.sin(angle);
    return { x, y };
  };

  const points = categories.map((cat, idx) => {
    const val = counts[cat as keyof typeof counts];
    return getCoordinates(idx, val);
  });

  const pathD = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <div className="p-5 bg-slate-950/70 border border-border rounded-xl space-y-4 flex flex-col justify-between">
      <div className="flex justify-between items-center border-b border-border pb-2">
        <h4 className="text-muted-foreground font-semibold tracking-wider uppercase text-xs font-mono">
          Severity Exposure Radar
        </h4>
        <span className="text-[10px] font-mono text-muted-foreground uppercase">
          ACTIVE EXPOSURE AXES
        </span>
      </div>

      <div className="flex justify-center items-center py-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[220px] overflow-visible">
          {/* Círculos concêntricos */}
          {[0.25, 0.5, 0.75, 1.0].map((scale, i) => (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={rMax * scale}
              fill="none"
              stroke="var(--color-state-neutral)"
              strokeWidth={0.5}
              strokeDasharray={i === 3 ? 'none' : '2 2'}
              opacity={0.3}
            />
          ))}

          {/* Linhas dos eixos */}
          {angles.map((angle, i) => {
            const x = cx + rMax * Math.cos(angle);
            const y = cy + rMax * Math.sin(angle);
            const labelX = cx + (rMax + 20) * Math.cos(angle);
            const labelY = cy + (rMax + 8) * Math.sin(angle);

            return (
              <g key={i} className="opacity-40">
                <line x1={cx} y1={cy} x2={x} y2={y} stroke="var(--color-primary)" strokeWidth={0.5} />
                <text
                  x={labelX}
                  y={labelY}
                  fill="var(--color-state-insufficient)"
                  fontSize={8}
                  textAnchor="middle"
                  fontFamily="monospace"
                  alignmentBaseline="middle"
                >
                  {categories[i]}
                </text>
              </g>
            );
          })}

          {/* Área sombreada do radar */}
          {maxVal > 0 && (
            <path
              d={pathD}
              fill="rgba(6, 182, 212, 0.15)"
              stroke="var(--color-primary)"
              strokeWidth={1.5}
              strokeLinejoin="round"
            />
          )}

          {/* Pontos de dados */}
          {points.map((p, idx) => (
            <circle
              key={idx}
              cx={p.x}
              cy={p.y}
              r={2.5}
              fill="var(--color-primary)"
              className="filter drop-shadow-[0_0_3px_rgba(6,182,212,0.5)]"
            />
          ))}
        </svg>
      </div>

      <div className="grid grid-cols-5 gap-1 border-t border-border pt-3 text-center font-mono text-[9px] text-muted-foreground">
        <div>SYS: <span className="font-bold text-rose-400">{counts.SYSTEMIC}</span></div>
        <div>CRI: <span className="font-bold text-red-400">{counts.CRITICAL}</span></div>
        <div>HIG: <span className="font-bold text-amber-400">{counts.HIGH}</span></div>
        <div>MOD: <span className="font-bold text-cyan-400">{counts.MODERATE}</span></div>
        <div>LOW: <span className="font-bold text-muted-foreground">{counts.LOW}</span></div>
      </div>
    </div>
  );
};
