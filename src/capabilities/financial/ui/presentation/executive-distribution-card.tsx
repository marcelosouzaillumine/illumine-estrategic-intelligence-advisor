import React from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveChartTooltip } from '../../../../components/ui/executive-chart';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText, ExecutiveMetric } from '../../../../components/ui/executive-typography';
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
      <div className="flex flex-col mb-4 pb-4 border-b border-border/40 shrink-0" // @allow-margin
      >
        <ExecutiveHeading as="h3" variant="submoduleTitle">{title}</ExecutiveHeading>
        {subtitle && (
          <ExecutiveText as="p" variant="moduleSubtitle" className="mt-1.5" // @allow-margin
        >{subtitle}</ExecutiveText>
        )}
      </div>

      {/* Área Gráfica e Legenda */}
      <div className="flex-1 flex flex-col xl:flex-row items-center justify-center gap-2 mt-2" // @allow-margin
      >
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
                      <Cell key={`cell-${index}`} fill={entry.fill || 'var(--chart-primary)'} />
                    ))}
                  </Pie>
                  <ExecutiveChartTooltip formatter={(value: number) => formatValue(value)} />
                </RechartsPieChart>
              </ResponsiveContainer>
              {isSingleSegment && (
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                  <ExecutiveMetric variant="metricCompact">100%</ExecutiveMetric>
                  <ExecutiveText as="span" variant="microLabel" className="mt-1 max-w-[120px] truncate" // @allow-margin
                >{data[0].name}</ExecutiveText>
                </div>
              )}
            </div>

            {/* Legenda Lateral / Inferior */}
            <div className="flex-1 w-full flex flex-col justify-center space-y-2.5 pl-2">
              {data.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.fill || 'var(--color-primary)' }} />
                  <div className="flex flex-col">
                    <ExecutiveText as="span" variant="bodyStrong">{item.name}</ExecutiveText>
                    <ExecutiveText as="span" variant="bodyStandard" className="text-muted-foreground">{formatValue(item.value)}</ExecutiveText>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center w-full h-full min-h-[200px]">
            <ExecutiveText as="p" variant="bodyStandard" className="text-center">Nenhum dado disponível.</ExecutiveText>
          </div>
        )}
      </div>
    </ExecutiveSurface>
  );
}
