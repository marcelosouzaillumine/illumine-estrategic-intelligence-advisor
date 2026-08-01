import React from 'react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { MessagesSquare, AlertCircle, XCircle, RotateCcw, FileText, CheckSquare } from 'lucide-react';

interface DeliberationRecordPanelProps {
  deliberation: {
    keyConcerns: string[];
    premisesChallenged: string[];
    alternatives: string[];
    executiveNotes: string;
    boardComments: string;
  };
}

export function DeliberationRecordPanel({ deliberation }: DeliberationRecordPanelProps) {
  if (!deliberation) return null;

  return (
    <ExecutiveSurface variant="default" padding="xl" radius="xl" className="border border-border">
      <div className="flex items-center gap-2 mb-6">
        <MessagesSquare size={18} className="text-executive-primary" />
        <ExecutiveHeading as="h4" className="text-foreground tracking-widest uppercase text-sm">
          Deliberation Record™
        </ExecutiveHeading>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-surface-container/30 p-5 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={14} className="text-warning-soft0" />
            <ExecutiveText variant="microLabel" className="uppercase tracking-widest">Key Concerns</ExecutiveText>
          </div>
          <ul className="space-y-2">
            {deliberation.keyConcerns.map((c, i) => (
              <li key={i} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-warning-soft0">•</span> {c}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-surface-container/30 p-5 rounded-lg border border-border">
          <div className="flex items-center gap-2 mb-3">
            <XCircle size={14} className="text-critical" />
            <ExecutiveText variant="microLabel" className="uppercase tracking-widest">Premises Challenged</ExecutiveText>
          </div>
          <ul className="space-y-2">
            {deliberation.premisesChallenged.map((p, i) => (
              <li key={i} className="text-sm text-foreground flex items-start gap-2">
                <span className="text-critical">•</span> {p}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-surface-container/30 p-5 rounded-lg border border-border mb-6">
        <div className="flex items-center gap-2 mb-3">
          <RotateCcw size={14} className="text-muted-foreground" />
          <ExecutiveText variant="microLabel" className="uppercase tracking-widest">Alternatives Considered (Discarded)</ExecutiveText>
        </div>
        <ul className="space-y-2">
          {deliberation.alternatives.map((a, i) => (
            <li key={i} className="text-sm text-muted-foreground flex items-start gap-2 line-through decoration-muted-foreground/30">
              <span className="text-muted-foreground/50">•</span> {a}
            </li>
          ))}
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FileText size={14} className="text-executive-secondary" />
            <ExecutiveText variant="microLabel" className="uppercase tracking-widest">Executive Notes</ExecutiveText>
          </div>
          <p className="text-sm text-foreground italic border-l-2 border-executive-secondary pl-3 py-1">
            "{deliberation.executiveNotes}"
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-3">
            <CheckSquare size={14} className="text-executive-primary" />
            <ExecutiveText variant="microLabel" className="uppercase tracking-widest">Board Comments</ExecutiveText>
          </div>
          <p className="text-sm text-foreground italic border-l-2 border-executive-primary pl-3 py-1">
            "{deliberation.boardComments}"
          </p>
        </div>
      </div>

    </ExecutiveSurface>
  );
}
