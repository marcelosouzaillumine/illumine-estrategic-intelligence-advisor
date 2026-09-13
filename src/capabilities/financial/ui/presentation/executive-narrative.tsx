import React from 'react';
import { cn } from '@/lib/utils';
import { Info, Lightbulb, ShieldAlert, CheckCircle2, FileText } from 'lucide-react';
import { ExecutiveText, ExecutiveSpacingRegistry } from '../../../../components/ui/executive-typography';

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
    <div className={cn("bg-transparent flex flex-col", ExecutiveSpacingRegistry.elementGap, className)} {...props}>
      {(title || IconComponent) && (
        <div className={cn("flex items-center", ExecutiveSpacingRegistry.elementGap, "mb-1")}>
          {IconComponent && (
            <div className={cn("shrink-0", config.color)}>
              <IconComponent size={14} strokeWidth={2.5} />
            </div>
          )}
          {title && (
            <ExecutiveText variant="label" as="h4">
              {title}
            </ExecutiveText>
          )}
        </div>
      )}
      <ExecutiveText variant="body" as="div" className="max-w-[78ch]">
        {children}
      </ExecutiveText>
    </div>
  );
}
