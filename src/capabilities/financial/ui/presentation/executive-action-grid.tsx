import React from 'react';
import { cn } from '../../../../lib/utils';

export interface ExecutiveActionGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function ExecutiveActionGrid({ children, className, ...props }: ExecutiveActionGridProps) {
  return (
    <div 
      className={cn("w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5", className)}
      {...props}
    >
      {children}
    </div>
  );
}
