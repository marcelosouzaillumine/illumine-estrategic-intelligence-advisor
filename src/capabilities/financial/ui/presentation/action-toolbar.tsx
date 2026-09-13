import React from 'react';
import { cn } from '@/lib/utils';

export interface ActionToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ActionToolbar({ children, className, ...props }: ActionToolbarProps) {
  return (
    <div 
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 p-3",
        "bg-surface-container/60 backdrop-blur-md border border-border rounded-2xl",
        "shadow-sm sticky top-4 z-10",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}

export function ActionToolbarGroup({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
}

export interface ActionToolbarButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'success' | 'secondary' | 'critical' | 'neutral';
  icon?: React.ReactNode;
}

export function ActionToolbarButton({
  children,
  variant = 'neutral',
  icon,
  className,
  ...props
}: ActionToolbarButtonProps) {
  const variantStyles = {
    success: 'bg-success-soft hover:bg-success text-success hover:text-white border-success/20',
    secondary: 'bg-secondary/10 hover:bg-secondary text-secondary hover:text-white border-secondary/20',
    critical: 'bg-critical-soft hover:bg-destructive text-destructive hover:text-white border-destructive/20',
    neutral: 'bg-surface-container hover:bg-surface-container/80 text-executive-secondary hover:text-foreground border-border'
  };

  return (
    <button
      className={cn(
        "px-2.5 py-1 h-7 border rounded-md transition-all flex items-center gap-1.5 cursor-pointer shadow-sm text-[10px] font-bold uppercase tracking-wider",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {icon && <span className="[&>svg]:w-3 [&>svg]:h-3 flex items-center">{React.isValidElement(icon) ? icon : icon ? React.createElement(icon as any, { size: 12 }) : null}</span>}
      <span>{children}</span>
    </button>
  );
}
