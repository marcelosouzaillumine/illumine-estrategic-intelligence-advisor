import React from 'react';
import { cn } from '@/lib/utils';
import { Info, Lightbulb, ShieldAlert, CheckCircle2, FileText } from 'lucide-react';

export interface ExecutiveNarrativeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: 'summary' | 'insight' | 'risk' | 'recommendation' | 'board-note';
  title?: React.ReactNode;
  icon?: React.ElementType;
  children: React.ReactNode;
}

const variantConfig = {
  summary: { defaultIcon: Info, color: 'text-primary' },
  insight: { defaultIcon: Lightbulb, color: 'text-insight' },
  risk: { defaultIcon: ShieldAlert, color: 'text-critical' },
  recommendation: { defaultIcon: CheckCircle2, color: 'text-success' },
  'board-note': { defaultIcon: FileText, color: 'text-secondary' },
};

export function ExecutiveNarrative({
  variant = 'summary',
  title,
  icon,
  children,
  className,
  ...props
}: ExecutiveNarrativeProps) {
  const config = variantConfig[variant];
  const IconComponent = icon || config.defaultIcon;

  return (
    <div className={cn("bg-transparent flex flex-col gap-3", className)} {...props}>
      {(title || IconComponent) && (
        <div className="flex items-center gap-2.5 mb-1">
          {IconComponent && (
            <div className={cn("shrink-0", config.color)}>
              <IconComponent size={14} strokeWidth={2.5} />
            </div>
          )}
          {title && (
            <h4 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-foreground/50">
              {title}
            </h4>
          )}
        </div>
      )}
      <div className="text-[16px] font-normal leading-[1.75] text-foreground/80 max-w-[78ch]">
        {children}
      </div>
    </div>
  );
}
