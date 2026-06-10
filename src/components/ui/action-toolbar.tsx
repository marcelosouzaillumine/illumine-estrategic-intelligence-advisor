import React from 'react';
import { cn } from '@/lib/utils';

export interface ActionToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ActionToolbar({ children, className, ...props }: ActionToolbarProps) {
  return (
    <div 
      className={cn(
        "flex flex-wrap items-center justify-between gap-4 p-4",
        "bg-surface-container/60 backdrop-blur-md border border-border rounded-[24px]",
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
