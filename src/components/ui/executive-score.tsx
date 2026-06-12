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

  const r = 40;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(Math.max(value, 0), 100) / 100) * c;
  
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
          <svg width="96" height="96" viewBox="0 0 96 96" className="drop-shadow-sm">
            <circle cx="48" cy="48" r={r} fill="none" stroke="currentColor" strokeWidth="8" className="text-surface-container-highest" />
            <circle 
              cx="48" 
              cy="48" 
              r={r} 
              fill="none" 
              stroke={stroke} 
              strokeWidth="8"
              strokeDasharray={`${c} ${c}`} 
              strokeDashoffset={offset}
              strokeLinecap="round" 
              transform="rotate(-90 48 48)" 
              style={{ transition: 'stroke-dashoffset 0.8s ease-out' }} 
            />
            <text 
              x="48" 
              y="48" 
              textAnchor="middle" 
              dominantBaseline="central"
              style={{ fontSize: '24px', fontWeight: 800, fill: stroke }}
            >
              {Math.round(value)}
            </text>
          </svg>
          <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground text-center">{label}</p>
        </div>
      )}
    </ExecutiveSurface>
  );
}
