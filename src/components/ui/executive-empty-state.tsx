import React from 'react';
import { ExecutiveSurface } from './executive-surface';
import { cn } from '@/lib/utils';

export interface ExecutiveEmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  maxWidth?: "sm" | "md" | "lg";
  compact?: boolean;
  className?: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
}

export function ExecutiveEmptyState({
  icon,
  title,
  description,
  maxWidth = "md",
  compact = false,
  className,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction
}: ExecutiveEmptyStateProps) {
  return (
    <ExecutiveSurface 
      padding="none" 
      radius="xl"
      className={cn(
        "flex flex-col items-center justify-center text-center w-full",
        compact ? "py-8" : "py-10 md:py-12",
        "gap-5",
        className
      )}
    >
      {icon && (
        <div className="text-muted-foreground/60 flex items-center justify-center [&>svg]:w-10 [&>svg]:h-10">
          {icon}
        </div>
      )}
      <div className="flex flex-col items-center gap-3">
        <h3 className="text-[24px] md:text-[26px] font-semibold text-foreground tracking-tight text-center">{title}</h3>
        <p className={cn(
          "text-[14px] md:text-[15px] leading-snug text-foreground/70 text-center w-full",
          maxWidth === 'sm' ? 'max-w-[40ch]' : maxWidth === 'lg' ? 'max-w-[80ch]' : 'max-w-[60ch]'
        )}>
          {description}
        </p>
        {actionLabel && onAction && (
          <div className="flex items-center gap-3 mt-4">
            <button 
              onClick={onAction}
              className="px-6 py-2.5 bg-executive text-white rounded-xl text-sm font-medium hover:bg-executive/90 transition-colors shadow-sm"
            >
              {actionLabel}
            </button>
            {secondaryActionLabel && onSecondaryAction && (
              <button 
                onClick={onSecondaryAction}
                className="px-6 py-2.5 bg-surface text-secondary border border-border rounded-xl text-sm font-medium hover:bg-surface-container/30 hover:text-foreground transition-colors shadow-sm"
              >
                {secondaryActionLabel}
              </button>
            )}
          </div>
        )}
      </div>
    </ExecutiveSurface>
  );
}
