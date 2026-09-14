import React from 'react';
import { ShieldCheck, FileText, Lock, AlertCircle, ArrowUpRight } from 'lucide-react';
import { ExecutiveSurface } from '../../../../components/ui/executive-surface';
import { ExecutiveHeading } from '../../../../components/ui/executive-heading';
import { ExecutiveText } from '../../../../components/ui/executive-typography';
import { ExecutiveBadge } from '../../../../components/ui/executive-badge';
import { Button } from '../../../../components/ui/button';
import { ConflictProjection } from '../../../../contracts/governance/FiduciaryValidationProjection';

export interface ExecutiveConflictCardProps {
  conflict: ConflictProjection;
  onReview?: (id: string) => void;
  onEscalate?: (id: string) => void;
  onResolve?: (id: string) => void;
  className?: string;
}

export function ExecutiveConflictCard({
  conflict,
  onReview,
  onEscalate,
  onResolve,
  className = ''
}: ExecutiveConflictCardProps) {
  const isCritical = conflict.severity === 'CRITICAL';
  const isHigh = conflict.severity === 'HIGH';

  const severityVariant = isCritical ? 'critical' : isHigh ? 'warning' : 'info';
  const statusVariant = conflict.status === 'RESOLVED' ? 'success' : conflict.status === 'BLOCKED' ? 'critical' : 'warning';

  return (
    <ExecutiveSurface 
      padding="lg" 
      radius="xl" 
      className={`space-y-6 hover:border-primary/40 transition-all duration-300 shadow-sm hover:shadow-md ${className}`}
    >
      {/* 1. Identity Layer */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <ExecutiveSurface padding="sm" radius="md" className="w-10 h-10 flex items-center justify-center font-bold text-xs text-primary shadow-sm">
            {conflict.director.split(' ').map(n => n[0]).join('')}
          </ExecutiveSurface>
          <div>
            <div className="flex items-center gap-2">
              <ExecutiveHeading as="h3" variant="submoduleTitle">
                {conflict.director}
              </ExecutiveHeading>
              <ExecutiveBadge variant="neutral">
                {conflict.role}
              </ExecutiveBadge>
            </div>
            <ExecutiveText as="span" variant="caption" className="font-mono text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <FileText className="w-3.5 h-3.5 text-primary" />
              Case ID: {conflict.conflictId}
            </ExecutiveText>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ExecutiveBadge variant={severityVariant}>
            Severidade {conflict.severity}
          </ExecutiveBadge>
          <ExecutiveBadge variant={statusVariant}>
            {conflict.status}
          </ExecutiveBadge>
        </div>
      </div>

      {/* 2. Context Layer */}
      <ExecutiveSurface padding="sm" radius="lg" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <ExecutiveText as="div" variant="caption" className="text-muted-foreground uppercase font-bold tracking-wider mb-1">
            Partes Envolvidas
          </ExecutiveText>
          <ExecutiveText as="div" variant="bodyStandard" className="font-semibold text-foreground">
            {conflict.partiesInvolved.join(' ↔ ')}
          </ExecutiveText>
        </div>
        <div>
          <ExecutiveText as="div" variant="caption" className="text-muted-foreground uppercase font-bold tracking-wider mb-1">
            Natureza do Vínculo
          </ExecutiveText>
          <ExecutiveText as="div" variant="bodyStandard" className="text-muted-foreground font-medium">
            {conflict.relationship}
          </ExecutiveText>
        </div>
        <div>
          <ExecutiveText as="div" variant="caption" className="text-muted-foreground uppercase font-bold tracking-wider mb-1">
            Exposição Financeira
          </ExecutiveText>
          <ExecutiveText as="div" variant="bodyStandard" className="font-mono font-bold text-warning">
            {conflict.financialExposure}
          </ExecutiveText>
        </div>
      </ExecutiveSurface>

      {/* 3. Evidence Layer */}
      <div className="space-y-2">
        <ExecutiveText as="div" variant="caption" className="text-muted-foreground uppercase font-bold tracking-wider flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-success" />
          Evidências & Proveniência Auditável
        </ExecutiveText>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {conflict.evidence.map(ev => (
            <ExecutiveSurface key={ev.id} padding="sm" radius="md" className="flex justify-between items-center">
              <div>
                <ExecutiveText as="p" variant="bodyStandard" className="font-medium text-foreground">
                  {ev.source}
                </ExecutiveText>
                <ExecutiveText as="span" variant="caption" className="font-mono text-muted-foreground">
                  Hash: {ev.provenanceHash}
                </ExecutiveText>
              </div>
              <ExecutiveBadge variant="success">
                {ev.confidenceScore}% Confiança
              </ExecutiveBadge>
            </ExecutiveSurface>
          ))}
        </div>
      </div>

      {/* 4. Decision Layer */}
      <ExecutiveSurface variant="warning" padding="sm" radius="lg" className="space-y-2">
        <div className="flex justify-between items-center">
          <ExecutiveText as="span" variant="caption" className="font-bold uppercase tracking-wider text-warning flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Recomendação da Governança Executiva
          </ExecutiveText>
          <ExecutiveBadge variant="neutral">
            Status: {conflict.approvalState}
          </ExecutiveBadge>
        </div>
        <ExecutiveText as="p" variant="bodyStandard" className="text-foreground font-medium">
          {conflict.recommendation}
        </ExecutiveText>
      </ExecutiveSurface>

      {/* 5. Action Layer */}
      <div className="pt-2 flex justify-between items-center border-t border-border">
        <ExecutiveText as="span" variant="caption" className="font-mono text-muted-foreground flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-success" />
          Linhagem: {conflict.provenance.lineageHash}
        </ExecutiveText>
        <div className="flex items-center gap-3">
          {onEscalate && (
            <Button 
              variant="destructive" 
              size="sm"
              onClick={() => onEscalate(conflict.id)}
            >
              Escalar ao Conselho
            </Button>
          )}
          {onReview && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onReview(conflict.id)}
            >
              Revisar Dossiê <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </ExecutiveSurface>
  );
}
