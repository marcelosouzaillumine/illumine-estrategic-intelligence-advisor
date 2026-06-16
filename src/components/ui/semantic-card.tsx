import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, Info, Lightbulb, ShieldAlert } from 'lucide-react';
import { ExecutiveSurface } from './executive-surface';
// Layout‑only className policy: only spacing/flex utilities may be used; visual styling must rely on design tokens.

export interface SemanticCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  variant?: 'default' | 'info' | 'insight' | 'success' | 'warning' | 'critical';
  title?: React.ReactNode;
  description?: React.ReactNode;
  value?: React.ReactNode;
  actions?: React.ReactNode;
  children?: React.ReactNode;
  icon?: boolean;
}

const variantConfig = {
  default: {
    icon: null,
    iconColor: '',
  },
  info: {
    icon: Info,
    iconColor: 'text-primary',
  },
  insight: {
    icon: Lightbulb,
    iconColor: 'text-insight',
  },
  success: {
    icon: CheckCircle2,
    iconColor: 'text-success',
  },
  warning: {
    icon: AlertTriangle,
    iconColor: 'text-warning',
  },
  critical: {
    icon: ShieldAlert,
    iconColor: 'text-critical',
  },
};

export function SemanticCard({ 
  variant = 'default', 
  title, 
  description, 
  value, 
  actions, 
  children, 
  className,
  icon = false,
  ...props 
}: SemanticCardProps) {
  
  const config = variantConfig[variant];
  const IconComponent = config.icon;

  return (
    <ExecutiveSurface 
      variant={variant}
      padding="lg"
      radius="lg"
      className={cn("flex flex-col gap-6", className)} 
      {...props}
    >
      {(title || description || actions || value || (icon && IconComponent)) && (
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-start gap-4 flex-1">
              {icon && IconComponent && (
                <div className={cn("mt-1 shrink-0", config.iconColor)}>
                  <IconComponent size={24} strokeWidth={2} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                {title && <h3 className={cn("text-base font-semibold text-foreground tracking-tight", description && "mb-1")}>{title}</h3>}
                {description && <p className="text-executive-secondary text-sm leading-relaxed max-w-2xl">{description}</p>}
              </div>
            </div>
            {actions && <div className="shrink-0">{actions}</div>}
          </div>
          {value && <div className="font-medium tabular-nums text-4xl tracking-tighter mt-2">{value}</div>}
        </div>
      )}
      {children && <div className="flex-1 text-base leading-relaxed">{children}</div>}
    </ExecutiveSurface>
  );
}
