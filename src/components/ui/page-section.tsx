import React from 'react';
import { cn } from '@/lib/utils';

export interface PageSectionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export function PageSection({
  title,
  description,
  actions,
  children,
  className,
  ...props
}: PageSectionProps) {
  return (
    <section className={cn("space-y-8", className)} {...props}>
      {(title || description || actions) && (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-6">
          <div className="space-y-2">
            {title && <h2 className="text-3xl font-medium tracking-tight text-primary">{title}</h2>}
            {description && <p className="text-muted-foreground text-base max-w-3xl leading-relaxed">{description}</p>}
          </div>
          {actions && (
            <div className="shrink-0 flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      )}
      <div className="w-full">
        {children}
      </div>
    </section>
  );
}
