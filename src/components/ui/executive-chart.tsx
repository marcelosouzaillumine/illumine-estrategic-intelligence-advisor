import React from 'react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, BarChart, Bar, LineChart, Line, ComposedChart } from 'recharts';

/**
 * Phase 2 & 9: Full Recharts Encapsulation.
 * Pages MUST NOT import 'recharts' directly.
 * All charting needs are served through these canonical wrappers.
 */

// Basic Axis and Grid Wrappers (Phase 5: Readability Governance)
export function ExecutiveChartGrid({ horizontal = true, vertical = false, ...props }: any) {
  return (
    <CartesianGrid strokeDasharray="3 3" vertical={vertical} horizontal={horizontal} stroke="var(--color-border)" {...props} />
  );
}

export function ExecutiveChartXAxis({ ...props }: any) {
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

export function ExecutiveChartYAxis({ ...props }: any) {
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

export function ExecutiveChartTooltip({ ...props }: any) {
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

// Re-exports of Recharts data components, to ensure pages don't import Recharts
export const ExecutiveAreaChart = AreaChart;
export const ExecutiveArea = Area;
export const ExecutiveBarChart = BarChart;
export const ExecutiveBar = Bar;
export const ExecutiveLineChart = LineChart;
export const ExecutiveLine = Line;
export const ExecutiveComposedChart = ComposedChart;
export const ExecutiveLegend = Legend;

// Main Chart Container
export interface ExecutiveChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  height?: number | string;
  children: React.ReactNode;
  empty?: boolean;
  emptyMessage?: string;
  error?: boolean;
  errorMessage?: string;
}

export function ExecutiveChart({
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
    <div style={{ height }} className={cn("w-full relative", className)} {...props}>
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
          {children as React.ReactElement}
        </ResponsiveContainer>
      )}
    </div>
  );
}
