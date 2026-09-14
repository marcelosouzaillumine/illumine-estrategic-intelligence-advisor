import React from 'react';
import { cn } from '@/lib/utils';

export interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ElementType;
  actions?: React.ReactNode;
}

export function SectionHeader({ 
  title, 
  description, 
  icon: Icon,
  actions, 
  className,
  ...props 
}: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 mt-8", className)} {...props}>
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 bg-surface-high rounded-md shrink-0">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        )}
        <div>
          <h2 className="text-primary font-semibold text-xl tracking-tight">{title}</h2>
          {description && <p className="text-secondary text-sm mt-1">{description}</p>}
        </div>
      </div>
      
      {actions && (
        <div className="flex items-center shrink-0 gap-2">
          {actions}
        </div>
      )}
    </div>
  );
}
