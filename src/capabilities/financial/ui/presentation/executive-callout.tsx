import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { AlertTriangle, CheckCircle2, Info, Lightbulb, ShieldAlert } from 'lucide-react';

export interface ExecutiveCalloutProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: 'default' | 'info' | 'insight' | 'success' | 'warning' | 'critical';
  title?: React.ReactNode;
  children?: React.ReactNode;
}

const variantConfig = {
  default: { icon: Info, iconColor: 'text-primary' },
  info: { icon: Info, iconColor: 'text-primary' },
  insight: { icon: Lightbulb, iconColor: 'text-insight' },
  success: { icon: CheckCircle2, iconColor: 'text-success' },
  warning: { icon: AlertTriangle, iconColor: 'text-warning' },
  critical: { icon: ShieldAlert, iconColor: 'text-critical' },
};

export function ExecutiveCallout({ 
  variant = 'info', 
  title, 
  children, 
  className,
  ...props 
}: ExecutiveCalloutProps) {
  const config = variantConfig[variant];
  const IconComponent = config.icon;

  return (
    <ExecutiveSurface
      variant={variant}
      padding="md"
      radius="md"
      className={cn("flex flex-col gap-3", className)}
      {...props}
    >
      <div className="flex items-start gap-4">
        {IconComponent && (
          <div className={cn("mt-1 shrink-0", config.iconColor)}>
            <IconComponent size={20} strokeWidth={2} />
          </div>
        )}
        <div className="flex-1 space-y-1.5">
          {title && <h4 className="text-base font-semibold text-foreground tracking-tight mb-2">{title}</h4>}
          {children && <div className="text-executive-secondary text-sm leading-relaxed max-w-3xl">{children}</div>}
        </div>
      </div>
    </ExecutiveSurface>
  );
}
