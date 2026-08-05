import React from 'react';
import { LifecycleStageDefinition } from '../../types/ExecutiveWorkspaceMetadata';
import { ExecutiveText } from '@/components/ui/executive-typography';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface DynamicLifecycleStepperProps {
  stages: LifecycleStageDefinition[];
  currentStageId: string;
}

export function DynamicLifecycleStepper({ stages, currentStageId }: DynamicLifecycleStepperProps) {
  const { t } = useTranslation();
  
  // Sort stages by order
  const orderedStages = [...stages].sort((a, b) => a.order - b.order);
  const currentIndex = orderedStages.findIndex(s => s.id === currentStageId);

  return (
    <div className="w-full flex items-center overflow-x-auto py-2 hide-scrollbar">
      {orderedStages.map((stage, index) => {
        const isPast = index < currentIndex;
        const isCurrent = index === currentIndex;
        
        return (
          <div key={stage.id} className="flex items-center shrink-0">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full border-2 text-xs font-bold shrink-0 transition-colors",
              isCurrent ? "border-primary bg-primary text-primary-foreground" :
              isPast ? "border-primary bg-primary/10 text-primary" :
              "border-muted-foreground/30 bg-muted/20 text-muted-foreground"
            )}>
              {isPast ? <Check size={14} /> : (index + 1)}
            </div>
            
            <div className="ml-3 mr-4 flex flex-col">
              <ExecutiveText variant={isCurrent ? "label" : "caption"} className={cn(
                isCurrent ? "text-foreground font-bold" : "text-muted-foreground"
              )}>
                {t(stage.titleKey)}
              </ExecutiveText>
              {/* Optional: Show SLA or Status underneath */}
            </div>

            {index < orderedStages.length - 1 && (
              <div className={cn(
                "w-12 h-0.5 mx-2 shrink-0 transition-colors",
                isPast ? "bg-primary" : "bg-border"
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}
