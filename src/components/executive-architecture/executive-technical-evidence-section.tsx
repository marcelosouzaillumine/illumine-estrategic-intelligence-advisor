import * as React from 'react';

export interface ExecutiveTechnicalEvidenceSectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'aria-label'> {
  children: React.ReactNode;
  'aria-label': string;
}

export const ExecutiveTechnicalEvidenceSection =
  React.forwardRef<HTMLElement, ExecutiveTechnicalEvidenceSectionProps>(
    ({ children, ...props }, ref) => (
      <section
        ref={ref}
        data-eac-block="technical-evidence"
        {...props}
      >
        {children}
      </section>
    )
  );

ExecutiveTechnicalEvidenceSection.displayName =
  'ExecutiveTechnicalEvidenceSection';
