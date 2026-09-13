import React from 'react';

export interface ExecutiveSummarySectionProps extends Omit<React.HTMLAttributes<HTMLElement>, 'aria-label'> {
  children: React.ReactNode;
  'aria-label': string;
}

export const ExecutiveSummarySection = React.forwardRef<HTMLElement, ExecutiveSummarySectionProps>(
  ({ children, 'aria-label': ariaLabel, className, ...props }, ref) => {
    return (
      <section
        ref={ref}
        data-eac-block="executive-summary"
        data-eac-version="1"
        aria-label={ariaLabel}
        className={className}
        {...props}
      >
        {children}
      </section>
    );
  }
);

ExecutiveSummarySection.displayName = 'ExecutiveSummarySection';
