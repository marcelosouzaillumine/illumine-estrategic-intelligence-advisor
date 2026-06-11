import React from 'react';
import { cn } from '@/lib/utils';

export interface ExecutiveSurfaceProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'info' | 'insight' | 'success' | 'warning' | 'critical' | 'transparent';
  elevation?: 'none' | 'sm' | 'md' | 'lg';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
}

const variantStyles = {
  default: 'bg-card text-card-foreground border border-border',
  primary: 'bg-primary text-primary-foreground border-transparent',
  secondary: 'bg-secondary text-secondary-foreground border-transparent',
  info: 'bg-surface-high text-foreground border border-border',
  insight: 'bg-insight/10 text-insight-foreground border-transparent',
  success: 'bg-success/10 text-success-foreground border-transparent',
  warning: 'bg-warning/10 text-warning-foreground border-transparent',
  critical: 'bg-critical/10 text-critical-foreground border-transparent',
  transparent: 'bg-transparent text-foreground border-transparent',
};

const elevationStyles = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};

const paddingStyles = {
  none: 'p-0',
  sm: 'p-3 md:p-4',
  md: 'p-4 md:p-6',
  lg: 'p-6 md:p-8',
  xl: 'p-8 md:p-10',
};

const radiusStyles = {
  sm: 'rounded-lg',
  md: 'rounded-xl',
  lg: 'rounded-[24px]',
  xl: 'rounded-[32px]',
};

export const ExecutiveSurface = React.forwardRef<HTMLDivElement, ExecutiveSurfaceProps>(({
  variant = 'default',
  elevation = 'sm',
  padding = 'lg',
  radius = 'lg',
  interactive = false,
  className,
  onClick,
  ...props
}, ref) => {
  const isNavigable = interactive || !!onClick;
  
  return (
    <div
      ref={ref}
      onClick={onClick}
      role={isNavigable ? 'button' : undefined}
      tabIndex={isNavigable ? 0 : undefined}
      onKeyDown={isNavigable ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick?.(e as any); } } : undefined}
      className={cn(
        "transition-all duration-300",
        variantStyles[variant],
        variant === 'default' || variant === 'info' ? elevationStyles[elevation] : 'shadow-none',
        paddingStyles[padding],
        radiusStyles[radius],
        isNavigable && "cursor-pointer hover:shadow-md hover:border-secondary/30 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 ring-offset-background",
        className
      )}
      {...props}
    />
  );
});

ExecutiveSurface.displayName = 'ExecutiveSurface';
