import * as React from 'react';

export interface ExecutiveDecisionTraceSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'aria-label'> {
  children: React.ReactNode;
  'aria-label': string;
}

export const ExecutiveDecisionTraceSection =
  React.forwardRef<HTMLElement, ExecutiveDecisionTraceSectionProps>(
    ({ children, ...props }, ref) => (
      <section
        ref={ref}
        data-eac-block="decision-trace"
        {...props}
      >
        {children}
      </section>
    )
  );

ExecutiveDecisionTraceSection.displayName =
  'ExecutiveDecisionTraceSection';
