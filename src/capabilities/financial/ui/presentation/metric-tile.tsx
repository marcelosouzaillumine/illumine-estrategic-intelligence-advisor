import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { Loader2, AlertCircle, FileX } from 'lucide-react';
import { Skeleton } from '../../../../components/ui/skeleton';
import { ExecutiveCallout } from '../../../../components/ui/executive-callout';


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
  error?: string | boolean;
}

export function MetricTile({ 
  label, 
  value, 
  trend,
  icon: Icon,
  variant = 'default',
  loading = false,
  empty = false,
  emptyMessage = 'Dados indisponíveis',
  error,
  className,
  onClick,
  ...props 
}: MetricTileProps) {
  
  if (error) {
    const errorMessage = typeof error === 'string' ? error : 'Erro ao carregar indicador';
    return (
      <ExecutiveCallout 
        variant="critical" 
        title="Indisponível"
      >
        <span className="text-xs">{errorMessage}</span>
      </ExecutiveCallout>
    );
  }

  const getTrendColor = (direction: string) => {
    switch (direction) {
      case 'up': return 'text-success';
      case 'down': return 'text-critical';
      default: return 'text-executive-muted';
    }
  };

  const effectiveVariant = (empty || value === undefined) ? 'default' : variant;

  return (
    <ExecutiveSurface 
      variant={effectiveVariant}
      padding="md"
      radius="md"
      interactive={!!onClick}
      onClick={onClick}
      className={cn("flex flex-col gap-4 min-h-[140px]", className)} 
      {...props}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-[10px] font-black uppercase tracking-widest text-executive-muted">{label}</span>
        {Icon && <Icon className="w-5 h-5 text-executive-muted shrink-0" strokeWidth={2} />}
      </div>
      
      {loading ? (
        <div className="flex flex-col gap-2 pt-1">
          <Skeleton className="h-10 w-[70%]" />
          <Skeleton className="h-3 w-[40%]" />
        </div>
      ) : empty || value === undefined ? (
        <div className="flex flex-col items-start gap-2 py-2 flex-1 justify-center">
          <FileX className="w-6 h-6 text-executive-muted mb-1" />
          <span className="text-sm font-medium italic text-executive-muted">{emptyMessage}</span>
        </div>
      ) : (
        <div className="flex flex-col justify-end flex-1">
          <div className="flex items-baseline gap-3">
            <span className={cn("font-medium tabular-nums text-3xl md:text-4xl tracking-tighter leading-none", variant === 'success' ? 'text-success' : variant === 'critical' ? 'text-critical' : 'text-primary')}>{value}</span>
          </div>
          
          {trend && (
            <div className="flex items-center gap-2 mt-2">
              <span className={cn("text-[10px] font-black uppercase tracking-widest flex items-center gap-1", getTrendColor(trend.direction))}>
                {trend.direction === 'up' ? '↗' : trend.direction === 'down' ? '↘' : '→'}
                {trend.value}
              </span>
              {trend.label && <span className="text-[10px] font-bold uppercase tracking-widest text-executive-muted/60">{trend.label}</span>}
            </div>
          )}
        </div>
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
