import React from 'react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

interface ProgressBarProps {
  score: number;
}

function ProgressBar({ score }: ProgressBarProps) {
  const blocks = 10;
  const filled = Math.round((score / 100) * blocks);
  
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: blocks }).map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "h-2 w-3 rounded-sm transition-all",
            i < filled ? "bg-executive-primary" : "bg-surface-container border border-border"
          )}
        />
      ))}
      <span className="ml-2 text-xs font-mono text-muted-foreground w-8 text-right">{score}%</span>
    </div>
  );
}

interface EvidenceIntegrityPanelProps {
  dataQuality: {
    integrityScore: number;
    originScore: number;
    recencyScore: number;
    completenessScore: number;
    historicalReliabilityScore: number;
    warnings: string[];
    missingEvidence: string[];
    isComplete: boolean;
    dataSource: string;
    lastUpdatedAt: string;
  };
}

export function EvidenceIntegrityPanel({ dataQuality }: EvidenceIntegrityPanelProps) {
  if (!dataQuality) return null;

  return (
    <ExecutiveSurface variant="default" padding="lg" radius="lg" className="border border-border">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-executive-primary" />
          <ExecutiveHeading as="h4" className="text-foreground tracking-widest uppercase text-sm">
            Evidence Integrity Score™
          </ExecutiveHeading>
        </div>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-light text-primary leading-none">{dataQuality.integrityScore}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Progress Bars */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <ExecutiveText variant="caption" className="text-muted-foreground uppercase">Origem dos Dados</ExecutiveText>
            <ProgressBar score={dataQuality.originScore} />
          </div>
          <div className="flex justify-between items-center">
            <ExecutiveText variant="caption" className="text-muted-foreground uppercase">Atualidade</ExecutiveText>
            <ProgressBar score={dataQuality.recencyScore} />
          </div>
          <div className="flex justify-between items-center">
            <ExecutiveText variant="caption" className="text-muted-foreground uppercase">Completude</ExecutiveText>
            <ProgressBar score={dataQuality.completenessScore} />
          </div>
          <div className="flex justify-between items-center">
            <ExecutiveText variant="caption" className="text-muted-foreground uppercase">Confiabilidade Histórica</ExecutiveText>
            <ProgressBar score={dataQuality.historicalReliabilityScore} />
          </div>
        </div>

        {/* Details List */}
        <div className="bg-surface-container/30 rounded-lg p-5 border border-border">
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-success mt-0.5 shrink-0" />
              <div>
                <ExecutiveText variant="microLabel" className="text-muted-foreground uppercase block">Fonte Principal</ExecutiveText>
                <span className="text-sm text-foreground">{dataQuality.dataSource}</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className={dataQuality.isComplete ? "text-success mt-0.5 shrink-0" : "text-warning-soft0 mt-0.5 shrink-0"} />
              <div>
                <ExecutiveText variant="microLabel" className="text-muted-foreground uppercase block">Integridade</ExecutiveText>
                <span className="text-sm text-foreground">{dataQuality.isComplete ? "Balanço conciliado e período fechado" : "Aviso de completude acionado"}</span>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={16} className="text-success mt-0.5 shrink-0" />
              <div>
                <ExecutiveText variant="microLabel" className="text-muted-foreground uppercase block">Última Atualização</ExecutiveText>
                <span className="text-sm text-foreground">
                  {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(dataQuality.lastUpdatedAt))}
                </span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </ExecutiveSurface>
  );
}
