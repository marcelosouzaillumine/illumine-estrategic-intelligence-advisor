import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveSurface } from './executive-surface';
import { Skeleton } from './skeleton';
import { ExecutiveCallout } from './executive-callout';
import { FileX } from 'lucide-react';
// Layout‑only className policy: only spacing/flex utilities may be used; visual styling must rely on design tokens.

export interface ExecutiveScoreProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value?: number;
  color?: 'emerald' | 'blue' | 'amber' | 'rose' | 'slate';
  variant?: 'default' | 'insight' | 'warning' | 'critical' | 'success';
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  error?: string | boolean;
  maxValue?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function ExecutiveScore({ 
  label, 
  value = 0, 
  color = 'slate',
  variant = 'default',
  loading = false,
  empty = false,
  emptyMessage = 'Dados indisponíveis',
  error,
  maxValue,
  size = 'md',
  className,
  onClick,
  ...props 
}: ExecutiveScoreProps) {
  
  if (error) {
    const errorMessage = typeof error === 'string' ? error : 'Erro ao carregar score';
    return (
      <ExecutiveCallout 
        variant="critical" 
        title="Indisponível"
      >
        <span className="text-xs">{errorMessage}</span>
      </ExecutiveCallout>
    );
  }

  const sizeMap = {
    sm: { r: 28, stroke: 6, font: '16px', box: 64 },
    md: { r: 40, stroke: 8, font: '24px', box: 96 },
    lg: { r: 60, stroke: 12, font: '36px', box: 144 },
    xl: { r: 80, stroke: 16, font: '48px', box: 192 }
  };
  const { r, stroke: strokeWidth, font, box } = sizeMap[size] || sizeMap.md;
  const center = box / 2;

  const c = 2 * Math.PI * r;
  const max = maxValue ?? 100;
  const percentage = Math.min(Math.max(value, 0), max) / max;
  const offset = c - percentage * c;
  
  const colorMap: Record<string, string> = {
    emerald: 'var(--color-success)', // maps to success token
    blue: 'var(--color-info)', // maps to info token (primary)
    amber: 'var(--color-warning)', // maps to warning token
    rose: 'var(--color-critical)', // maps to critical token
    slate: 'var(--color-neutral)' // maps to neutral token
  };
  const stroke = colorMap[color] || colorMap.slate;

  return (
    <ExecutiveSurface 
      variant={variant}
      padding="md"
      radius="md"
      interactive={!!onClick}
      onClick={onClick}
      className={cn("flex flex-col items-center justify-center gap-4 min-h-[160px]", className)} 
      {...props}
    >
      {loading ? (
        <div className="flex flex-col items-center gap-4">
          <Skeleton className="w-[96px] h-[96px] rounded-full" />
          <Skeleton className="h-4 w-[80%]" />
        </div>
      ) : empty || value === undefined ? (
        <div className="flex flex-col items-center gap-2 py-4 flex-1 justify-center opacity-60">
          <FileX className="w-8 h-8 text-muted-foreground mb-2" />
          <span className="text-sm font-medium italic text-muted-foreground text-center">{emptyMessage}</span>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <svg width={box} height={box} viewBox={`0 0 ${box} ${box}`} className="drop-shadow-sm">
            <circle cx={center} cy={center} r={r} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-surface-container-highest" />
            <circle 
              cx={center} 
              cy={center} 
              r={r} 
              fill="none" 
              stroke={stroke} 
              strokeWidth={strokeWidth}
              strokeDasharray={`${c} ${c}`} 
              strokeDashoffset={offset}
              strokeLinecap="round" 
              transform={`rotate(-90 ${center} ${center})`} 
              style={{ transition: 'stroke-dashoffset 0.8s ease-out' }} 
            />
            <text 
              x={center} 
              y={center - (maxValue ? 4 : 0)} 
              textAnchor="middle" 
              dominantBaseline="central"
              style={{ fontSize: font, fontWeight: 800, fill: stroke }}
            >
              {Math.round(value)}
            </text>
            {maxValue && (
              <text 
                x={center} 
                y={center + (size === 'sm' ? 12 : size === 'lg' ? 24 : size === 'xl' ? 32 : 16)} 
                textAnchor="middle" 
                dominantBaseline="central"
                style={{ fontSize: size === 'sm' ? '8px' : size === 'lg' ? '14px' : size === 'xl' ? '18px' : '10px', fontWeight: 700, fill: 'var(--color-muted-foreground)' }}
              >
                / {maxValue}
              </text>
            )}
          </svg>
          <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground text-center">{label}</p>
        </div>
      )}
    </ExecutiveSurface>
  );
}
