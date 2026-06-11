import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ExecutiveSurface } from './executive-surface';
import { ExecutiveChartTooltip } from './executive-chart';
import { cn } from '@/lib/utils';

export interface ExecutiveDistributionCardProps {
  title: string;
  subtitle?: string;
  data: Array<{ name: string; value: number; fill?: string }>;
  formatValue: (val: number) => string;
  empty?: boolean;
  className?: string;
}

export function ExecutiveDistributionCard({
  title,
  subtitle,
  data,
  formatValue,
  empty = false,
  className
}: ExecutiveDistributionCardProps) {
  const hasData = !empty && data && data.length > 0;
  const isSingleSegment = hasData && data.length === 1;

  return (
    <ExecutiveSurface padding="none" className={cn("flex flex-col p-5 w-full h-full bg-card border-border/60", className)}>
      {/* Cabeçalho */}
      <div className="flex flex-col mb-4 pb-4 border-b border-border/40 shrink-0">
        <h3 className="text-[18px] font-semibold text-foreground tracking-tight leading-none">{title}</h3>
        {subtitle && (
          <p className="text-[13px] text-foreground/65 mt-1.5">{subtitle}</p>
        )}
      </div>

      {/* Área Gráfica e Legenda */}
      <div className="flex-1 flex flex-col xl:flex-row items-center justify-center gap-2 mt-2">
        {hasData ? (
          <>
            <div className="w-[240px] h-[240px] shrink-0 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={85}
                    outerRadius={115}
                    paddingAngle={isSingleSegment ? 0 : 4}
                    dataKey="value"
                    stroke="none"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill || '#3b82f6'} />
                    ))}
                  </Pie>
                  <ExecutiveChartTooltip formatter={(value: number) => formatValue(value)} />
                </RechartsPieChart>
              </ResponsiveContainer>
              {isSingleSegment && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <span className="text-[26px] font-bold text-foreground leading-none">100%</span>
                  <span className="text-[11px] font-medium text-foreground/60 mt-1 max-w-[120px] truncate">{data[0].name}</span>
                </div>
              )}
            </div>

            {/* Legenda Lateral / Inferior */}
            <div className="flex-1 w-full flex flex-col justify-center space-y-2.5 pl-2">
              {data.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.fill || '#3b82f6' }} />
                  <div className="flex flex-col">
                    <span className="text-[13px] font-medium text-foreground leading-snug">{item.name}</span>
                    <span className="text-[13px] font-medium text-foreground/70">{formatValue(item.value)}</span>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center w-full h-full min-h-[200px]">
            <p className="text-sm text-muted-foreground">Nenhum dado disponível.</p>
          </div>
        )}
      </div>
    </ExecutiveSurface>
  );
}
