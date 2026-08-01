import React from 'react';
import { cn } from '@/lib/utils';

interface InstitutionalCardProps {
  className?: string;
  children: React.ReactNode;
  variant?: 'default' | 'highlight' | 'feature';
  hoverable?: boolean;
}

export function InstitutionalCard({
  className,
  children,
  variant = 'default',
  hoverable = true
}: InstitutionalCardProps) {
  const variantClasses = {
    default: 'bg-white/5 border-white/10 shadow-2xl',
    highlight: 'bg-white/5 border-white/10 backdrop-blur-sm relative overflow-hidden',
    feature: 'bg-white/5 border-white/5 shadow-none'
  };

  const hoverClasses = hoverable 
    ? 'hover:border-white/30 transition-colors duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]' 
    : '';

  return (
    <div className={cn(
      "rounded-3xl border overflow-hidden relative",
      variantClasses[variant],
      hoverClasses,
      className
    )}>
      {children}
    </div>
  );
}
