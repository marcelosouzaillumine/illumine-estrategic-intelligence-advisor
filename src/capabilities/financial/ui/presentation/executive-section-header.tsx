import React from 'react';
import { cn } from '@/lib/utils';
import { ExecutiveText } from '../../../../components/ui/executive-typography';

export interface ExecutiveSectionHeaderProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}

export function ExecutiveSectionHeader({ title, subtitle, className }: ExecutiveSectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1.5 mb-6", className)}>
      <ExecutiveText variant="sectionTitle" as="h3">
        {title}
      </ExecutiveText>
      {subtitle && (
        <ExecutiveText variant="sectionSubtitle" as="p" className="max-w-3xl">
          {subtitle}
        </ExecutiveText>
      )}
    </div>
  );
}
