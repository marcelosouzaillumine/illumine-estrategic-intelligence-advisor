import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ShieldAlert } from 'lucide-react';

export interface RiskPanelProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
}

export function RiskPanel({ title, children, className, ...props }: RiskPanelProps) {
  return (
    <ExecutiveSurface variant="critical" padding="lg" radius="lg" className={cn("flex flex-col gap-4", className)} {...props}>
      <div className="flex items-start gap-4">
        <ShieldAlert className="w-6 h-6 text-critical shrink-0 mt-1" strokeWidth={2} />
        <div className="flex-1 space-y-2">
          {title && <h3 className="font-medium text-lg text-critical-foreground tracking-tight leading-none">{title}</h3>}
          <div className="text-critical-foreground/90 text-sm leading-relaxed">{children}</div>
        </div>
      </div>
    </ExecutiveSurface>
  );
}
