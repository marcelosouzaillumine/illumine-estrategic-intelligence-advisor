import React from 'react';

export type ExecutiveBadgeVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'destructive';

interface ExecutiveBadgeProps {
  children: React.ReactNode;
  variant?: ExecutiveBadgeVariant;
  className?: string;
}

export function ExecutiveBadge({ children, variant = 'default', className = '' }: ExecutiveBadgeProps) {
  const baseStyles = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  
  const variants = {
    default: 'bg-primary text-primary-foreground hover:bg-primary/80',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'text-foreground border border-input hover:bg-accent hover:text-accent-foreground',
    destructive: 'bg-destructive/10 text-destructive border border-destructive/20',
    primary: 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
}
