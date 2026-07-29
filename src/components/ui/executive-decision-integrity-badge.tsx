import React from 'react';
import { ShieldCheck, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { ExecutiveSurface } from './executive-surface';
import { ExecutiveText } from './executive-typography';
import { ExecutiveBadge } from './executive-badge';

export interface ExecutiveDecisionIntegrityBadgeProps {
  score: number;
  evidenceComplete?: boolean;
  provenanceValid?: boolean;
  policyApplied?: boolean;
  approvalRecorded?: boolean;
  className?: string;
}

export function ExecutiveDecisionIntegrityBadge({
  score,
  evidenceComplete = true,
  provenanceValid = true,
  policyApplied = true,
  approvalRecorded = true,
  className = ''
}: ExecutiveDecisionIntegrityBadgeProps) {
  const isHealthy = score >= 90;

  return (
    <ExecutiveSurface 
      variant={isHealthy ? 'success' : 'warning'} 
      padding="sm" 
      radius="lg" 
      className={`flex items-center gap-4 ${className}`}
    >
      <div className="flex items-center gap-3">
        <ExecutiveSurface padding="sm" radius="md" className="flex items-center justify-center">
          <ShieldCheck className={`w-5 h-5 ${isHealthy ? 'text-success' : 'text-warning'}`} />
        </ExecutiveSurface>
        <div>
          <div className="flex items-center gap-2">
            <ExecutiveText as="span" variant="caption" className="font-semibold uppercase tracking-wider text-muted-foreground">
              Decision Integrity Index
            </ExecutiveText>
            <ExecutiveBadge variant={isHealthy ? 'success' : 'warning'}>
              {score.toFixed(1)}%
            </ExecutiveBadge>
          </div>
          <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground font-mono">
            {evidenceComplete && (
              <span className="flex items-center gap-1 text-success font-medium">
                <CheckCircle2 className="w-3 h-3" /> Evidence Complete
              </span>
            )}
            {provenanceValid && (
              <span className="flex items-center gap-1 text-success font-medium">
                <Lock className="w-3 h-3" /> Provenance Valid
              </span>
            )}
            {policyApplied && (
              <span className="flex items-center gap-1 text-success font-medium">
                <Sparkles className="w-3 h-3" /> Policy Applied
              </span>
            )}
            {approvalRecorded && (
              <span className="flex items-center gap-1 text-success font-medium">
                <CheckCircle2 className="w-3 h-3" /> Approval Recorded
              </span>
            )}
          </div>
        </div>
      </div>
    </ExecutiveSurface>
  );
}
