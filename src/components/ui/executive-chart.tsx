import React from 'react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Area, BarChart, Bar, LineChart, Line, ComposedChart, Cell } from 'recharts';

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

/** @deprecated Use o novo ExecutiveChart V2 com tipagem forte e abstração interna. */
export const ExecutiveAreaChart = AreaChart;
/** @deprecated */
export const ExecutiveArea = Area;
/** @deprecated */
export const ExecutiveBarChart = BarChart;
/** @deprecated */
export const ExecutiveBar = Bar;
/** @deprecated */
export const ExecutiveLineChart = LineChart;
/** @deprecated */
export const ExecutiveLine = Line;
/** @deprecated */
export const ExecutiveComposedChart = ComposedChart;
/** @deprecated */
export const ExecutiveLegend = Legend;

import { SemanticVariant, getExecutiveSeriesDefinition } from './executive-chart-series-registry';
export type { SemanticVariant };

export type ChartType = 'line' | 'area' | 'bar' | 'composed';

export interface ExecutiveChartSeries {
  key: string;
  label: string;
  variant: SemanticVariant;
}

export interface ExecutiveChartProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'children'> {
  height?: number | string;
  type?: ChartType;
  data?: any[];
  series?: ExecutiveChartSeries[];
  xKey?: string;
  yFormatter?: (value: number) => string;
  children?: React.ReactNode;
  empty?: boolean;
  emptyMessage?: string;
  error?: boolean;
  errorMessage?: string;
}



export function ExecutiveChart({
  height = 300,
  type,
  data,
  series,
  xKey,
  yFormatter,
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
     <span className="text-executive-secondary text-sm italic">{emptyMessage}</span>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          {children ? (
            children as React.ReactElement
          ) : (
            <>
              {type === 'area' && data && series && (
                <AreaChart data={data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                  <defs>
                    {series.map(s => {
                      const def = getExecutiveSeriesDefinition(s.variant);
                      return (
                        <linearGradient key={`grad-${s.key}`} id={`color-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={def.color} stopOpacity={0.1}/>
                          <stop offset="95%" stopColor={def.color} stopOpacity={0}/>
                        </linearGradient>
                      );
                    })}
                  </defs>
                  <ExecutiveChartGrid vertical={false} />
                  <ExecutiveChartXAxis dataKey={xKey || 'name'} dy={10} />
                  <ExecutiveChartTooltip 
                    formatter={yFormatter}
                    labelStyle={{ color: 'var(--color-muted-foreground)', fontWeight: 'bold' }}
                  />
                  {series.map(s => {
                    const def = getExecutiveSeriesDefinition(s.variant);
                    return (
                      <Area 
                        key={s.key} 
                        type="monotone" 
                        dataKey={s.key} 
                        name={s.label} 
                        stroke={def.color} 
                        strokeWidth={def.strokeWidth || 2} 
                        fillOpacity={1} 
                        fill={`url(#color-${s.key})`} 
                      />
                    );
                  })}
                </AreaChart>
              )}
              {type === 'bar' && data && series && (
                <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <ExecutiveChartGrid vertical={false} />
                  <ExecutiveChartXAxis dataKey={xKey || 'name'} dy={10} />
                  <ExecutiveChartTooltip 
                    formatter={yFormatter}
                    labelStyle={{ color: 'var(--color-muted-foreground)', fontWeight: 'bold' }}
                  />
                  {series.map(s => {
                    const def = getExecutiveSeriesDefinition(s.variant);
                    return (
                      <Bar 
                        key={s.key} 
                        dataKey={s.key} 
                        name={s.label} 
                        fill={def.color} 
                        barSize={32}
                        radius={[4, 4, 0, 0]}
                      >
                        {data.map((entry, index) => {
                          // Se o dado tiver um 'variant' específico (ex: perDatumVariant para waterfall), sobrescrevemos a cor padrão da série
                          const cellColor = entry.variant ? getExecutiveSeriesDefinition(entry.variant).color : def.color;
                          return <Cell key={`cell-${index}`} fill={cellColor} />;
                        })}
                      </Bar>
                    );
                  })}
                </BarChart>
              )}
            </>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
}
