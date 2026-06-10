import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveSurface } from './executive-surface';
import { Loader2 } from 'lucide-react';

export interface MetricTileProps extends React.HTMLAttributes<HTMLDivElement> {
  label: React.ReactNode;
  value?: React.ReactNode;
  trend?: {
    value: string;
    direction: 'up' | 'down' | 'neutral';
    label?: string;
  };
  icon?: React.ElementType;
  variant?: 'default' | 'insight' | 'warning' | 'critical' | 'success';
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
}

export function MetricTile({ 
  label, 
  value, 
  trend,
  icon: Icon,
  variant = 'default',
  loading = false,
  empty = false,
  emptyMessage = 'Indisponível',
  className,
  onClick,
  ...props 
}: MetricTileProps) {
  
  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up': return 'text-success';
      case 'down': return 'text-critical';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <ExecutiveSurface 
      variant={variant}
      padding="md"
      radius="md"
      interactive={!!onClick}
      onClick={onClick}
      className={cn("flex flex-col gap-4", className)} 
      {...props}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{label}</span>
        {Icon && <Icon className="w-5 h-5 text-secondary shrink-0" strokeWidth={2} />}
      </div>
      
      {loading ? (
        <div className="flex items-center gap-2 py-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">Carregando...</span>
        </div>
      ) : empty || value === undefined ? (
        <div className="flex items-center gap-2 py-2">
          <span className="text-sm italic text-muted-foreground">{emptyMessage}</span>
        </div>
      ) : (
        <>
          <div className="flex items-baseline gap-3">
            <span className="text-primary font-medium tabular-nums text-4xl tracking-tighter leading-none">{value}</span>
          </div>
          
          {trend && (
            <div className="flex items-center gap-2 mt-1">
              <span className={cn("text-[10px] font-black uppercase tracking-widest flex items-center gap-1", getTrendColor(trend.direction))}>
                {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'}
                {trend.value}
              </span>
              {trend.label && <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">{trend.label}</span>}
            </div>
          )}
        </>
      )}
    </ExecutiveSurface>
  );
}

export function MetricGrid({ children, className, columns = 4, ...props }: React.HTMLAttributes<HTMLDivElement> & { columns?: 2 | 3 | 4 | 5 }) {
  const colStyles = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5',
  };
  
  return (
    <div className={cn("grid gap-4", colStyles[columns] || colStyles[4], className)} {...props}>
      {children}
    </div>
  );
}
