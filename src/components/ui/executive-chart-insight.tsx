import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveHeading } from './executive-heading';
import { ExecutiveText } from './executive-typography';
import { ExecutiveBadge } from './executive-badge';

export interface ExecutiveChartInsightProps {
  title: React.ReactNode;
  description: React.ReactNode;
  icon?: React.ReactNode;
  severity?: 'critical' | 'warning' | 'attention' | 'info' | 'success' | 'neutral';
  className?: string;
}

export function ExecutiveChartInsight({
  title,
  description,
  icon,
  severity = 'neutral',
  className
}: ExecutiveChartInsightProps) {
  
  // Semantic background based on severity
  const getSeverityBg = () => {
    switch (severity) {
      case 'critical': return 'bg-critical/5 border-critical/10';
      case 'warning': return 'bg-warning/5 border-warning/10';
      case 'attention': return 'bg-attention/5 border-attention/10';
      case 'success': return 'bg-success/5 border-success/10';
      case 'info': return 'bg-info/5 border-info/10';
      case 'neutral':
      default: return 'bg-surface-high/30 border-border/40';
    }
  };

  return (
    <div className={cn("flex flex-col gap-2 p-4 rounded-xl border", getSeverityBg(), className)}>
      <div className="flex items-center gap-2">
        {icon && <div className="text-foreground/70 shrink-0">{icon}</div>}
        <ExecutiveHeading as="h5" variant="cardTitle" className="flex-1">
          {title}
        </ExecutiveHeading>
      </div>
      <ExecutiveText as="p" variant="bodyStandard" className="text-foreground/80 leading-relaxed">
        {description}
      </ExecutiveText>
    </div>
  );
}
