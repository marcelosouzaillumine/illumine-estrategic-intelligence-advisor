import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { CheckCircle2 } from 'lucide-react';

export interface RecommendationPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
}

export function RecommendationPanel({ title, children, className, ...props }: RecommendationPanelProps) {
  return (
    <ExecutiveSurface variant="success" padding="lg" radius="lg" className={cn("flex flex-col gap-4", className)} {...props}>
      <div className="flex items-start gap-4">
        <CheckCircle2 className="w-6 h-6 text-success shrink-0 mt-1" strokeWidth={2} />
        <div className="flex-1 space-y-2">
          {title && <h3 className="font-medium text-lg text-success-foreground tracking-tight leading-none">{title}</h3>}
          <div className="text-success-foreground/90 text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </ExecutiveSurface>
  );
}
