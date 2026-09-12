import React from 'react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { Waypoints, ArrowDown } from 'lucide-react';
import { FinancialEvidenceContract } from '../../../packages/shell/executive-intelligence-layer/src/contracts/FinancialEvidenceContract';

interface DecisionIntelligenceTraceProps {
  decision: string;
  assumptions?: string[];
  evidenceTrail: FinancialEvidenceContract[];
  recommendation: string;
}

export function DecisionIntelligenceTrace({ decision, assumptions = [], evidenceTrail, recommendation }: DecisionIntelligenceTraceProps) {
  if (!decision || evidenceTrail.length === 0) return null;

  return (
    <ExecutiveSurface variant="default" padding="lg" radius="lg" className="border border-border">
      <div className="flex items-center gap-2 mb-6">
        <Waypoints size={16} className="text-executive-primary" />
        <ExecutiveHeading as="h4" className="text-foreground tracking-widest uppercase text-sm">
          Decision Governance Trace™
                          </ExecutiveHeading>
      </div>

      <div className="flex flex-col items-center text-center space-y-4">
        {/* DECISION */}
        <div className="w-full">
          <ExecutiveText variant="microLabel" className="text-muted-foreground uppercase tracking-widest mb-1">DECISION</ExecutiveText>
          <div className="bg-primary/10 text-primary px-4 py-3 rounded-lg border border-primary/20 inline-block font-semibold shadow-sm">
            {decision}
          </div>
        </div>

        {assumptions.length > 0 && (
          <>
            <ArrowDown size={16} className="text-muted-foreground/40" />
            <div className="w-full">
              <ExecutiveText variant="microLabel" className="text-muted-foreground uppercase tracking-widest mb-1">ASSUMPTIONS</ExecutiveText>
              <div className="bg-surface-container/50 px-4 py-3 rounded-lg border border-border inline-block text-sm text-muted-foreground">
                <ul className="list-disc list-inside text-left">
                  {assumptions.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
            </div>
          </>
        )}

        <ArrowDown size={16} className="text-muted-foreground/40" />

        {/* EVIDENCE */}
        <div className="w-full">
          <ExecutiveText variant="microLabel" className="text-muted-foreground uppercase tracking-widest mb-1">EVIDENCE</ExecutiveText>
          <div className="bg-surface-container/50 px-4 py-3 rounded-lg border border-border inline-block text-sm text-foreground text-left">
            <ul className="space-y-2">
              {evidenceTrail.map((ev, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="text-primary mt-0.5">•</span>
                  <span>{ev.description} <span className="text-muted-foreground text-xs">({ev.confidence}%)</span></span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ArrowDown size={16} className="text-muted-foreground/40" />

        {/* RECOMMENDATION */}
        <div className="w-full">
          <ExecutiveText variant="microLabel" className="text-muted-foreground uppercase tracking-widest mb-1">RECOMMENDATION</ExecutiveText>
          <div className="bg-warning-soft0/10 text-warning-soft0 px-4 py-3 rounded-lg border border-warning-soft0/20 inline-block font-semibold shadow-sm">
            {recommendation}
          </div>
        </div>

      </div>
    </ExecutiveSurface>
  );
}
