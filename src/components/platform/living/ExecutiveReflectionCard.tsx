import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { BookOpen, CheckCircle, HelpCircle } from 'lucide-react';
import { ExecutiveReflectionContract } from '../../../../packages/domain/executive-contracts/src/living/ExecutiveReflectionContract';

export interface ExecutiveReflectionCardProps {
  readonly reflection: ExecutiveReflectionContract;
}

export const ExecutiveReflectionCard: React.FC<ExecutiveReflectionCardProps> = ({ reflection }) => {
  return (
    <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-purple-500/30">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-purple-400" />
          <h4 className="font-bold text-sm text-foreground">Executive Reflection™ (Encerramento do Dia)</h4>
        </div>
        <ExecutiveBadge variant="info">Wisdom Registrada</ExecutiveBadge>
      </div>
      <div className="space-y-2 text-xs">
        <div className="p-2.5 rounded bg-background/50 border border-border/30">
          <span className="font-bold text-purple-300 block text-[10px] uppercase">{reflection.primaryDecisionQuestionText}</span>
          <span className="text-foreground text-[11px] font-semibold">{reflection.userPrimaryDecisionAnswerText}</span>
        </div>
        <div className="p-2.5 rounded bg-purple-500/10 border border-purple-500/20 text-[11px]">
          <span className="font-bold text-purple-300 block text-[10px] uppercase">Aprendizado Institucional a Preservar:</span>
          <span className="text-foreground">{reflection.keyLearningToRegisterText}</span>
        </div>
      </div>
    </ExecutiveSurface>
  );
};
