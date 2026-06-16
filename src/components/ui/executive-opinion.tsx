import React from 'react';
import { cn } from '../../lib/utils';
import { ExecutiveText } from './executive-typography';

export interface ExecutiveOpinionProps {
  statusBadge: React.ReactNode;
  opinion: string;
  driver: string;
  implication: string;
  action: string;
  className?: string;
}

export const ExecutiveOpinionRhythm = {
  badgeToOpinion: "gap-6",     // 24px
  opinionToDriver: "mt-8",     // 32px
  driverToImplication: "gap-2", // 8px
  implicationToAction: "mt-6", // 24px
  actionLabelToAction: "gap-1"  // 4px
};

export function ExecutiveOpinion({
  statusBadge,
  opinion,
  driver,
  implication,
  action,
  className
}: ExecutiveOpinionProps) {
  return (
    <div className={cn("flex flex-col w-full", className)}>
      
      {/* 1. Status & Parecer */}
      <div className={cn("flex flex-col items-start w-full", ExecutiveOpinionRhythm.badgeToOpinion)}>
        {statusBadge && (
          <div className="w-full flex justify-start">
            {statusBadge}
          </div>
        )}
        <ExecutiveText variant="moduleTitle" as="h3" className="max-w-[65ch]">
          {opinion}
        </ExecutiveText>
      </div>

      {/* 2. Driver & Implicação */}
      <div className={cn("flex flex-col w-full", ExecutiveOpinionRhythm.opinionToDriver, ExecutiveOpinionRhythm.driverToImplication)}>
        <ExecutiveText variant="microLabel" className="text-executive-muted">
          Fator Primário
        </ExecutiveText>
        <ExecutiveText variant="submoduleTitle" as="h4">
          {driver}
        </ExecutiveText>
        <ExecutiveText variant="bodyLarge" as="p" className="max-w-[70ch] mt-1 text-executive-secondary">
          {implication}
        </ExecutiveText>
      </div>

      {/* 3. Ação Recomendada */}
      <div className={cn("flex flex-col items-start w-full", ExecutiveOpinionRhythm.implicationToAction, ExecutiveOpinionRhythm.actionLabelToAction)}>
        <ExecutiveText variant="microLabel" className="text-executive-muted">
          Ação Estratégica
        </ExecutiveText>
        <div className="bg-executive-primary/5 px-4 py-3 rounded-md border-l-2 border-executive-primary mt-1">
          <ExecutiveText variant="bodyStrong" as="p" className="text-executive-primary">
            {action}
          </ExecutiveText>
        </div>
      </div>

    </div>
  );
}
