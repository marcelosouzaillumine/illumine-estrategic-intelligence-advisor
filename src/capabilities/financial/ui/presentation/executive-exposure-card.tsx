import React from 'react';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText, ExecutiveMetric } from '../../../../components/ui/executive-typography';
import { cn } from '@/lib/utils';

export interface ExecutiveExposureCardProps {
  title: string;
  subtitle?: string;
  metrics: Array<{
    label: string;
    percentage: number;
    colorClass: string;
  }>;
  className?: string;
}

export function ExecutiveExposureCard({ title, subtitle, metrics, className }: ExecutiveExposureCardProps) {
  return (
    <ExecutiveSurface 
      padding="none" 
      className={cn("flex flex-col p-5 w-full h-full bg-card border-border/60", className)}
    >
      <div className="flex flex-col mb-5 pb-4 border-b border-border/40 shrink-0" // @allow-margin
      >
        <ExecutiveHeading as="h3" variant="submoduleTitle">{title}</ExecutiveHeading>
        {subtitle && (
          <ExecutiveText as="p" variant="moduleSubtitle" className="mt-1.5" // @allow-margin
        >{subtitle}</ExecutiveText>
        )}
      </div>
      
      <div 
        className="flex-1 flex flex-col justify-center gap-5 mt-1" // @allow-margin
      >
        {metrics.map((metric, idx) => (
          <div key={idx} className="flex flex-col gap-1.5">
            <ExecutiveText 
              as="span" 
              variant="microLabel" 
              className="mt-1 max-w-[120px] truncate" // @allow-margin
            >{metric.label}</ExecutiveText>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2.5 bg-surface-container/50 rounded-full overflow-hidden flex">
                <div className={cn("h-full transition-all duration-700 ease-out", metric.colorClass)} style={{ width: `${Math.min(100, Math.max(0, metric.percentage))}%` }} />
              </div>
              <ExecutiveText as="span" variant="bodyStrong" className="w-[42px] text-right tabular-nums">{metric.percentage.toFixed(1)}%</ExecutiveText>
            </div>
          </div>
        ))}
      </div>
    </ExecutiveSurface>
  );
}
