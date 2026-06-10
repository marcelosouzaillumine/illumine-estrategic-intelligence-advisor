import React from 'react';
import { cn } from '@/lib/utils';

export interface NarrativeStackProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  divider?: boolean;
}

export function NarrativeStack({ children, divider = false, className, ...props }: NarrativeStackProps) {
  return (
    <div 
      className={cn(
        "flex flex-col gap-6", 
        divider && "divide-y divide-border/40 [&>*]:pt-6 first:[&>*]:pt-0",
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
}
