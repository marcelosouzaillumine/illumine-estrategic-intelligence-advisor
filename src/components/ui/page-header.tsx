import React from 'react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title: React.ReactNode;
  description?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
}

export function PageHeader({ 
  title, 
  description, 
  breadcrumbs, 
  actions, 
  className,
  ...props 
}: PageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-4 mb-8", className)} {...props}>
      {breadcrumbs && <div className="text-sm font-medium text-muted-foreground uppercase tracking-widest">{breadcrumbs}</div>}
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl text-primary font-medium tracking-tight leading-[1.1]">{title}</h1>
          {description && <p className="text-executive-secondary text-lg max-w-3xl leading-relaxed">{description}</p>}
        </div>
        
        {actions && (
          <div className="flex items-center shrink-0 gap-3 pb-1">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
