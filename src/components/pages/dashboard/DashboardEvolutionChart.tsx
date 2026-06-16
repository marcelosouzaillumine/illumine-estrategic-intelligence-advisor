import React from 'react';
import { AreaChart, Area } from 'recharts';
import { ExecutiveChartGrid, ExecutiveChartXAxis, ExecutiveChartYAxis, ExecutiveChartTooltip } from '@/components/ui/executive-chart';

export function DashboardEvolutionChart({ data, colors, formatCurrency }: any) {
  return (
    <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={colors.primary} stopOpacity={0.25} />
          <stop offset="95%" stopColor={colors.primary} stopOpacity={0} />
        </linearGradient>
        <linearGradient id="colorEbitda" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor={colors.secondary} stopOpacity={0.25} />
          <stop offset="95%" stopColor={colors.secondary} stopOpacity={0} />
        </linearGradient>
      </defs>
      <ExecutiveChartGrid vertical={false} />
      <ExecutiveChartXAxis dataKey="name" dy={10} />
      <ExecutiveChartYAxis tickFormatter={(v: number) => `R$${v / 1000}k`} />
      <ExecutiveChartTooltip formatter={(value: number) => [formatCurrency(value), '']} />
      <Area 
        type="monotone" 
        dataKey="Receita" 
        stroke={colors.primary} 
        strokeWidth={4} 
        fillOpacity={1} 
        fill="url(#colorRec)" 
        animationDuration={2000}
      />
      <Area 
        type="monotone" 
        dataKey="EBITDA" 
        stroke={colors.secondary} 
        strokeWidth={4} 
        fillOpacity={1} 
        fill="url(#colorEbitda)" 
        animationDuration={2500}
      />
    </AreaChart>
  );
}
