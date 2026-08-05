import React from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ExecutiveText } from './executive-typography';

interface ExecutivePlaceholderProps {
  icon?: LucideIcon;
  title: string;
  description?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  minHeight?: string;
}

/**
 * Canonica component for Empty States, Placeholders, and Work-in-Progress views.
 * Resolves the recurrent flex-collapse issue by enforcing proper w-full and max-w bounds.
 */
export function ExecutivePlaceholder({
  icon: Icon,
  title,
  description,
  children,
  className,
  minHeight = 'min-h-[400px]',
}: ExecutivePlaceholderProps) {
  return (
    <div
      className={cn(
        'w-full bg-card border border-border rounded-xl p-8 flex flex-col items-center justify-center text-center',
        minHeight,
        className
      )}
      style={{ minWidth: '300px' }}
    >
      {Icon && (
        <Icon size={48} className="text-muted-foreground mb-4 opacity-50" />
      )}
      <ExecutiveText variant="moduleTitle" className="mb-2">
        {title}
      </ExecutiveText>
      
      {description && (
        <ExecutiveText 
          variant="bodyStandard"
          className="max-w-lg w-full text-center mx-auto mt-2 shrink-0"
          style={{ minWidth: '280px' }}
        >
          {description}
        </ExecutiveText>
      )}
      
      {children && (
        <div className="mt-6 w-full flex justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
