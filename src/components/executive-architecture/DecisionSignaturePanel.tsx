import React from 'react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { FileSignature, ShieldCheck, Database } from 'lucide-react';
import { DecisionSignature } from '../../../packages/shell/executive-intelligence-layer/src/governance/DecisionRecord';
import { useExecutiveFormatter } from '../../core/localization';

interface DecisionSignaturePanelProps {
  signature: DecisionSignature;
}

export function DecisionSignaturePanel({ signature }: DecisionSignaturePanelProps) {
  const formatter = useExecutiveFormatter();
  if (!signature) return null;

  return (
    <ExecutiveSurface variant="default" padding="xl" radius="xl" className="border-2 border-executive-primary/20 bg-primary/5">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-executive-primary text-white rounded-lg">
          <FileSignature size={20} />
        </div>
        <div>
          <ExecutiveHeading as="h4" className="text-foreground text-lg tracking-wide">
            Executive Decision Signature™
          </ExecutiveHeading>
          <ExecutiveText variant="caption" className="text-muted-foreground uppercase">
            Institutional Memory Record
          </ExecutiveText>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-8 gap-x-6">
        <div>
          <ExecutiveText variant="microLabel" className="text-muted-foreground uppercase mb-1">Decision ID</ExecutiveText>
          <div className="font-mono text-sm text-foreground font-bold">{signature.decisionId}</div>
        </div>

        <div>
          <ExecutiveText variant="microLabel" className="text-muted-foreground uppercase mb-1">Approved By</ExecutiveText>
          <div className="text-sm text-foreground font-bold">{signature.approvedBy}</div>
          <div className="text-xs text-muted-foreground">{signature.role}</div>
        </div>

        <div>
          <ExecutiveText variant="microLabel" className="text-muted-foreground uppercase mb-1">Signature Date</ExecutiveText>
          <div className="text-sm text-foreground font-bold">
            {formatter.date(signature.signatureDate, { dateStyle: 'medium', timeStyle: 'short' })}
          </div>
        </div>

        <div>
          <ExecutiveText variant="microLabel" className="text-muted-foreground uppercase mb-1">Risk Acceptance</ExecutiveText>
          <div className={`text-sm font-bold uppercase ${
            signature.riskAcceptance === 'CRITICAL' ? 'text-critical' :
            signature.riskAcceptance === 'HIGH' ? 'text-warning-soft0' :
            signature.riskAcceptance === 'MODERATE' ? 'text-amber-500' : 'text-success'
          }`}>
            {signature.riskAcceptance}
          </div>
        </div>

        <div>
          <ExecutiveText variant="microLabel" className="text-muted-foreground uppercase mb-1">Evidence Version</ExecutiveText>
          <div className="flex items-center gap-1.5 text-sm text-foreground font-bold">
            <Database size={14} className="text-muted-foreground" />
            {signature.evidenceVersion}
          </div>
        </div>

        <div>
          <ExecutiveText variant="microLabel" className="text-muted-foreground uppercase mb-1">AI Confidence Score</ExecutiveText>
          <div className="flex items-center gap-1.5 text-sm text-foreground font-bold">
            <ShieldCheck size={14} className="text-success" />
            {signature.confidenceScore}%
          </div>
        </div>
      </div>
      
      <div className="mt-8 pt-4 border-t border-primary/10 flex justify-between items-center">
        <ExecutiveText variant="caption" className="text-muted-foreground italic">
          Model Algorithm: {signature.modelAlgorithmVersion}
        </ExecutiveText>
        <div className="flex items-center gap-2 text-success">
          <ShieldCheck size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">Institutional Record Created</span>
        </div>
      </div>
    </ExecutiveSurface>
  );
}
