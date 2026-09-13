import React from 'react';
import { cn } from '../../../../lib/utils';
import { ExecutiveText, ExecutiveSpacingRegistry } from '../../../../components/ui/executive-typography';

export interface ExecutiveDriverPanelProps {
  label: string;
  title: string;
  description: string;
  className?: string;
}

export const ExecutiveDriverRhythm = {
  labelToTitle: "gap-2", // 8px
  titleToDescription: "gap-3" // 12px
};

export function ExecutiveDriverPanel({
  label,
  title,
  description,
  className
}: ExecutiveDriverPanelProps) {
  return (
    <div className={cn("flex-1 flex flex-col justify-center", ExecutiveDriverRhythm.titleToDescription, className)}>
      <div className={cn("flex flex-col", ExecutiveDriverRhythm.labelToTitle)}>
        <ExecutiveText variant="microLabel">{label}</ExecutiveText>
        <ExecutiveText variant="sectionTitle" as="h4">
          {title}
        </ExecutiveText>
      </div>
      
      <ExecutiveText variant="moduleSubtitle" as="p" className="max-w-[70ch]">
        {description}
      </ExecutiveText>
    </div>
  );
}
