import React from 'react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { BrainCircuit, ArrowDown, UserCheck } from 'lucide-react';
import { useExecutiveFormatter } from '../../core/localization';

interface HumanJudgmentGateProps {
  reviewerName: string;
  reviewerRole: string;
  date: string;
  authorityLevel: string;
  isConfirmed: boolean;
}

export function HumanJudgmentGate({ reviewerName, reviewerRole, date, authorityLevel, isConfirmed }: HumanJudgmentGateProps) {
  const formatter = useExecutiveFormatter();
  return (
    <ExecutiveSurface variant="default" padding="xl" radius="xl" className="border border-border">
      <div className="flex flex-col items-center text-center space-y-6">
        
        <div>
          <div className="flex justify-center mb-2">
            <div className="bg-surface-container p-3 rounded-full border border-border">
              <BrainCircuit size={24} className="text-primary" />
            </div>
          </div>
          <ExecutiveHeading as="h5" className="text-foreground text-sm uppercase tracking-widest">
            AI Recommendation Issued
          </ExecutiveHeading>
        </div>

        <ArrowDown size={20} className="text-muted-foreground/30" />

        <div className="bg-warning-soft0/10 border border-warning-soft0/30 px-6 py-3 rounded-full">
          <ExecutiveText variant="microLabel" className="text-warning-soft0 uppercase tracking-widest font-bold">
            Executive Review Required
          </ExecutiveText>
        </div>

        <ArrowDown size={20} className="text-muted-foreground/30" />

        <div className="w-full max-w-md bg-surface-container/30 border border-border rounded-xl p-6 relative overflow-hidden">
          {isConfirmed && (
            <div className="absolute top-0 left-0 w-1 h-full bg-success"></div>
          )}
          
          <div className="flex justify-center mb-4">
            <div className={`p-3 rounded-full border ${isConfirmed ? 'bg-success/10 border-success/30 text-success' : 'bg-surface-container border-border text-muted-foreground'}`}>
              <UserCheck size={24} />
            </div>
          </div>
          
          <ExecutiveHeading as="h5" className={`text-sm uppercase tracking-widest mb-4 ${isConfirmed ? 'text-success' : 'text-muted-foreground'}`}>
            {isConfirmed ? 'Human Judgment Confirmed' : 'Awaiting Human Judgment'}
          </ExecutiveHeading>

          {isConfirmed && (
            <div className="grid grid-cols-2 gap-4 text-left border-t border-border pt-4">
              <div>
                <ExecutiveText variant="microLabel" className="text-muted-foreground block mb-1">Reviewed By</ExecutiveText>
                <div className="text-sm font-bold text-foreground">{reviewerName}</div>
                <div className="text-xs text-muted-foreground">{reviewerRole}</div>
              </div>
              <div>
                <ExecutiveText variant="microLabel" className="text-muted-foreground block mb-1">Authority Level</ExecutiveText>
                <div className="text-sm font-bold text-foreground">{authorityLevel}</div>
                <div className="text-xs text-muted-foreground">{formatter.date(date, { dateStyle: 'short' })}</div>
              </div>
            </div>
          )}
        </div>

      </div>
    </ExecutiveSurface>
  );
}
