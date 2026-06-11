import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveSurface } from './executive-surface';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
// Layout‑only className policy: only spacing/flex utilities may be used; visual styling must rely on design tokens.

export interface ExecutiveChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  height?: number | string;
  children: React.ReactNode;
  empty?: boolean;
  emptyMessage?: string;
  error?: boolean;
  errorMessage?: string;
}

// These colors follow the Executive Standard tokens.
export const chartColors = [
  'var(--color-chart-1)', // chart-1
  'var(--color-chart-2)', // chart-2
  'var(--color-chart-3)', // chart-3
  'var(--color-chart-4)', // chart-4
  'var(--color-chart-5)', // chart-5
];

export function ExecutiveChart({
  title,
  description,
  height = 300,
  empty = false,
  emptyMessage = 'Nenhum dado disponível para este gráfico.',
  error = false,
  errorMessage = 'Erro ao carregar os dados do gráfico.',
  children,
  className,
  ...props
}: ExecutiveChartProps) {
  return (
    <ExecutiveSurface padding="md" radius="md" className={cn("flex flex-col gap-4", className)} {...props}>
      {(title || description) && (
        <div className="flex flex-col gap-1.5">
          {title && <h3 className="font-semibold text-lg tracking-tight leading-none">{title}</h3>}
          {description && <p className="text-foreground/70 text-sm leading-snug">{description}</p>}
        </div>
      )}

      <div style={{ height }} className="w-full relative">
        {error ? (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-high/50 rounded-lg">
            <span className="text-critical text-sm font-medium">{errorMessage}</span>
          </div>
        ) : empty ? (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-high/50 rounded-lg">
            <span className="text-muted-foreground text-sm italic">{emptyMessage}</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {/* The child will be the specific Recharts chart (e.g. LineChart, BarChart).
                Using React.cloneElement or just children. This wrapper handles the container. */}
            {children as React.ReactElement}
          </ResponsiveContainer>
        )}
      </div>
    </ExecutiveSurface>
  );
}

export function ExecutiveChartGrid({ horizontal = true, vertical = false }) {
  return (
    <CartesianGrid strokeDasharray="3 3" vertical={vertical} horizontal={horizontal} stroke="var(--color-border)" />
  );
}

export function ExecutiveChartXAxis({ ...props }) {
  return (
    <XAxis 
      stroke="var(--color-muted-foreground)" 
      fontSize={11} 
      tickLine={false} 
      axisLine={false}
      tick={{ fill: 'var(--color-muted-foreground)' }}
      {...props} 
    />
  );
}

export function ExecutiveChartYAxis({ ...props }) {
  return (
    <YAxis 
      stroke="var(--color-muted-foreground)" 
      fontSize={11} 
      tickLine={false} 
      axisLine={false}
      tick={{ fill: 'var(--color-muted-foreground)' }}
      {...props} 
    />
  );
}

export function ExecutiveChartTooltip({ ...props }) {
  return (
    <Tooltip 
      contentStyle={{ 
        backgroundColor: 'var(--color-card)', 
        borderColor: 'var(--color-border)',
        borderRadius: '12px',
        boxShadow: 'var(--shadow-sm)',
        color: 'var(--color-foreground)',
        fontSize: '12px'
      }}
      itemStyle={{ color: 'var(--color-foreground)', fontWeight: 500 }}
      {...props} 
    />
  );
}
