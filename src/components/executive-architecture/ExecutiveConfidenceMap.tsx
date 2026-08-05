import React from 'react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { Radar, AlertTriangle, UserCheck } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

interface ConfidenceItemProps {
  label: string;
  score: number;
  basis: string;
}

function ConfidenceItem({ label, score, basis }: ConfidenceItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <ExecutiveText variant="microLabel" className="text-muted-foreground uppercase">{label}</ExecutiveText>
        <span className={cn(
          "text-xs font-bold",
          score >= 90 ? "text-success" : score >= 70 ? "text-warning-soft0" : "text-critical"
        )}>{score}%</span>
      </div>
      <div className="h-1.5 w-full bg-surface-container/50 rounded-full overflow-hidden">
        <div 
          className={cn(
            "h-full rounded-full",
            score >= 90 ? "bg-success" : score >= 70 ? "bg-warning-soft0" : "bg-critical"
          )}
          style={{ width: `${score}%` }}
        />
      </div>
      <ExecutiveText variant="caption" className="text-muted-foreground mt-1">Base: {basis}</ExecutiveText>
    </div>
  );
}

interface ExecutiveConfidenceMapProps {
  confidenceMap: {
    financial: { score: number; basis: string };
    causal: { score: number; basis: string };
    recommendation: { score: number; basis: string };
    uncertainties: string[];
    executiveJudgmentRequired: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  decision: string;
  overallScore: number;
}

export function ExecutiveConfidenceMap({ confidenceMap, decision, overallScore }: ExecutiveConfidenceMapProps) {
  const { t } = useTranslation('executive');
  if (!confidenceMap) return null;

  return (
    <ExecutiveSurface variant="default" padding="lg" radius="lg" className="border border-border">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Radar size={16} className="text-executive-primary" />
          <ExecutiveHeading as="h4" className="text-foreground tracking-widest uppercase text-sm">
            Executive Confidence Map™
          </ExecutiveHeading>
        </div>
        <div className="text-right">
          <ExecutiveText variant="microLabel" className="text-muted-foreground uppercase">Overall</ExecutiveText>
          <div className="text-2xl font-light text-primary">{overallScore}%</div>
        </div>
      </div>

      <div className="mb-6">
        <ExecutiveText variant="body" className="text-muted-foreground">
          Recomendação: <strong className="text-foreground font-medium">{decision}</strong>
        </ExecutiveText>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <ConfidenceItem label="Dados Financeiros" score={confidenceMap.financial.score} basis={confidenceMap.financial.basis} />
        <ConfidenceItem label="Diagnóstico (Causal)" score={confidenceMap.causal.score} basis={confidenceMap.causal.basis} />
        <ConfidenceItem label={t('executive:decision.recommendation')} score={confidenceMap.recommendation.score} basis={confidenceMap.recommendation.basis} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-border">
        {confidenceMap.uncertainties && confidenceMap.uncertainties.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle size={14} className="text-warning-soft0" />
              <ExecutiveText variant="microLabel" className="text-foreground uppercase tracking-widest">Incertezas Mapeadas</ExecutiveText>
            </div>
            <ul className="space-y-2">
              {confidenceMap.uncertainties.map((u, i) => (
                <li key={i} className="flex gap-2 items-start">
                  <span className="text-warning-soft0 mt-0.5">⚠</span>
                  <span className="text-sm text-muted-foreground">{u}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 mb-3">
            <UserCheck size={14} className={
              confidenceMap.executiveJudgmentRequired === 'HIGH' ? "text-critical" : 
              confidenceMap.executiveJudgmentRequired === 'MEDIUM' ? "text-warning-soft0" : "text-success"
            } />
            <ExecutiveText variant="microLabel" className="text-foreground uppercase tracking-widest">Julgamento Executivo</ExecutiveText>
          </div>
          <div className="bg-surface-container/30 rounded-lg p-4 border border-border">
            <ExecutiveText variant="body" className="text-muted-foreground mb-2">Necessidade de intervenção fiduciária humana:</ExecutiveText>
            <div className={cn(
              "font-bold uppercase tracking-widest",
              confidenceMap.executiveJudgmentRequired === 'HIGH' ? "text-critical" : 
              confidenceMap.executiveJudgmentRequired === 'MEDIUM' ? "text-warning-soft0" : "text-success"
            )}>
              {confidenceMap.executiveJudgmentRequired === 'HIGH' ? 'Alto (Requer Diretoria)' : 
               confidenceMap.executiveJudgmentRequired === 'MEDIUM' ? 'Médio (Requer Revisão)' : 'Baixo (Padrão)'}
            </div>
          </div>
        </div>
      </div>

    </ExecutiveSurface>
  );
}
