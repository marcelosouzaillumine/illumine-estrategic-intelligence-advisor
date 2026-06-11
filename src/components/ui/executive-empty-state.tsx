import React from 'react';
import { ExecutiveSurface } from './executive-surface';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

export interface ExecutiveEmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  className?: string;
}

export function ExecutiveEmptyState({
  icon: Icon,
  title,
  description,
  className
}: ExecutiveEmptyStateProps) {
  return (
    <ExecutiveSurface 
      padding="lg" 
      radius="xl"
      className={cn(
        "flex flex-col items-center justify-center text-center py-10", 
        className
      )}
    >
      <div className="w-12 h-12 bg-surface-container/30 rounded-xl flex items-center justify-center mb-5 text-muted-foreground/80">
        <Icon size={24} strokeWidth={2} />
      </div>
      <h3 className="text-[22px] font-semibold text-foreground tracking-tight mb-2">{title}</h3>
      <p className="text-[14px] leading-6 text-muted-foreground max-w-xl">
        {description}
      </p>
    </ExecutiveSurface>
  );
}
