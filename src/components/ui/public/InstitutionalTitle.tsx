import React from 'react';
import { cn } from '@/lib/utils';

interface InstitutionalTitleProps {
  chapter?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  align?: 'left' | 'center';
  className?: string;
}

export function InstitutionalTitle({
  chapter,
  title,
  subtitle,
  align = 'center',
  className
}: InstitutionalTitleProps) {
  return (
    <div className={cn(
      "mb-16 md:mb-24 max-w-5xl mx-auto px-6",
      align === 'center' ? 'text-center' : 'text-left',
      className
    )}>
      {chapter && (
        <span className="text-sm font-semibold text-slate-500 uppercase tracking-widest mb-4 block">
          {chapter}
        </span>
      )}
      
      <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
        {title}
      </h2>
      
      {subtitle && (
        <div className="text-xl md:text-3xl font-medium text-slate-400 leading-relaxed max-w-4xl mx-auto">
          {subtitle}
        </div>
      )}
    </div>
  );
}
