import React from 'react';
import { LucideIcon } from 'lucide-react';

export type ExecutiveActionVariant = 'primary' | 'secondary' | 'ghost' | 'destructive';

interface ExecutiveActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ExecutiveActionVariant;
  icon?: LucideIcon;
  size?: 'sm' | 'md' | 'lg';
}

export function ExecutiveAction({ 
  children, 
  variant = 'secondary', 
  icon: Icon,
  size = 'md',
  className = '',
  ...props 
}: ExecutiveActionProps) {
  
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 rounded-md';
  
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    ghost: 'hover:bg-accent hover:text-accent-foreground text-foreground',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm'
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs gap-1.5',
    md: 'h-10 px-4 text-sm gap-2',
    lg: 'h-12 px-6 text-base gap-2.5'
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {Icon && <Icon className={iconSizes[size]} />}
      {children}
    </button>
  );
}
