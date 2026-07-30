import React from 'react';
import { cn } from '../../lib/utils';
import { ExecutiveSurface } from './executive-surface';
import { ExecutiveBadge } from './executive-badge';
import { ShieldCheck, Database, FileCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export interface PlatformRegistrationSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  question: string;
  complianceOpinion: string;
  dataIntegrityDriver: string;
  auditAction: string;
  statusLabel?: string;
  statusVariant?: 'success' | 'warning' | 'info' | 'neutral';
  children?: React.ReactNode;
}

/**
 * PlatformRegistrationSummary — Síntese de Governança Cadastral e Compliance de Dados
 * Wave 18.3 (PWGE v1.0 / ADR-077)
 *
 * Substitui o ExecutiveSummarySection em superfícies do Platform Workspace,
 * garantindo isolamento absoluto de componentes de consultoria executiva C-Level.
 */
export const PlatformRegistrationSummary: React.FC<PlatformRegistrationSummaryProps> = ({
  title,
  question,
  complianceOpinion,
  dataIntegrityDriver,
  auditAction,
  statusLabel = 'Base Homologada',
  statusVariant = 'success',
  children,
  className,
  ...props
}) => {
  return (
    <ExecutiveSurface
      padding="lg"
      radius="xl"
      className={cn("bg-card border border-border space-y-6 shadow-sm", className)}
      {...props}
    >
      {/* Header: Title & Status */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <Database size={18} className="text-primary shrink-0" />
          <h2 className="text-base font-semibold text-foreground">
            {title}
          </h2>
        </div>

        <ExecutiveBadge variant={statusVariant}>
          <ShieldCheck size={13} className="mr-1 inline-block" />
          {statusLabel}
        </ExecutiveBadge>
      </div>

      {/* Primary Governance Question */}
      <div className="bg-muted/30 rounded-xl p-4 border border-border/40 space-y-1">
        <span className="text-[11px] font-semibold text-primary uppercase tracking-wider block">
          Pergunta Primária de Compliance & Cadastros
        </span>
        <p className="text-sm font-semibold text-foreground">
          {question}
        </p>
      </div>

      {/* 3-Column Compliance Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Compliance Opinion */}
        <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <FileCheck size={14} className="text-primary" />
            <span>Parecer de Integridade</span>
          </div>
          <p className="text-xs text-foreground font-medium leading-relaxed">
            {complianceOpinion}
          </p>
        </div>

        {/* Data Integrity Driver */}
        <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <Database size={14} className="text-primary" />
            <span>Driver de Integridade</span>
          </div>
          <p className="text-xs text-foreground font-medium leading-relaxed">
            {dataIntegrityDriver}
          </p>
        </div>

        {/* Audit Action */}
        <div className="p-3.5 rounded-xl bg-card border border-border/60 space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <CheckCircle2 size={14} className="text-emerald-500" />
            <span>Ação de Governança</span>
          </div>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium leading-relaxed">
            {auditAction}
          </p>
        </div>
      </div>

      {children}
    </ExecutiveSurface>
  );
};
