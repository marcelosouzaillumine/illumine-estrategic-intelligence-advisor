import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
import { Target, CheckCircle2, AlertTriangle, AlertCircle, TrendingUp } from 'lucide-react';
import { ExecutivePositionSummaryResult } from '../../../core/experience/contracts/FinancialPositionPureViewModel';

interface ExecutivePositionSummarySectionProps {
  summary?: ExecutivePositionSummaryResult;
}

export function ExecutivePositionSummarySection({ summary }: ExecutivePositionSummarySectionProps) {
  if (!summary || !summary.available) return null;

  return (
    <div className="mb-8">
      <ExecutiveSurface variant="default" elevation="md" className="p-8 border-l-4 border-l-brand-600">
        <div className="flex items-center gap-3 mb-6">
          <Target className="text-brand-600 w-6 h-6" />
          <ExecutiveHeading as="h2" variant="moduleTitle" className="text-brand-600">
            Executive Position Summary™
          </ExecutiveHeading>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Assessment */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <ExecutiveText variant="label" className="text-muted-foreground uppercase tracking-wider mb-2 block">
                Situação Atual
              </ExecutiveText>
              <ExecutiveHeading as="h3" variant="sectionTitle" className="text-foreground">
                {summary.status.classification}
              </ExecutiveHeading>
              <ExecutiveText variant="bodyStandard" className="text-muted-foreground mt-2">
                {summary.status.narrative}
              </ExecutiveText>
            </div>
            
            <div className="p-4 bg-brand-50 rounded-xl border border-brand-100">
              <ExecutiveText variant="label" className="text-brand-700 font-bold mb-2 block">
                Questão Central
              </ExecutiveText>
              <ExecutiveText variant="bodyStandard" className="text-brand-800 italic">
                "{summary.centralQuestion.question}"
              </ExecutiveText>
            </div>
          </div>

          <div className="hidden lg:block lg:col-span-1 border-r border-border/50"></div>

          {/* Strengths and Attentions */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <ExecutiveText variant="label" className="text-foreground font-semibold">
                  Principais Forças
                </ExecutiveText>
              </div>
              <div className="space-y-3">
                {summary.strengths.length > 0 ? summary.strengths.map((s, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-success shrink-0" />
                    <div>
                      <span className="font-semibold text-foreground text-sm">{s.title}: </span>
                      <span className="text-muted-foreground text-sm">{s.explanation}</span>
                    </div>
                  </div>
                )) : (
                  <ExecutiveText variant="caption" className="text-muted-foreground italic">Nenhuma força destacada no momento.</ExecutiveText>
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-border/50">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-5 h-5 text-warning" />
                <ExecutiveText variant="label" className="text-foreground font-semibold">
                  Principais Atenções
                </ExecutiveText>
              </div>
              <div className="space-y-3">
                {summary.attentionPoints.length > 0 ? summary.attentionPoints.map((a, idx) => (
                  <div key={idx} className="flex gap-2 items-start">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-warning shrink-0" />
                    <div>
                      <span className="font-semibold text-foreground text-sm">{a.title}: </span>
                      <span className="text-muted-foreground text-sm">{a.explanation}</span>
                    </div>
                  </div>
                )) : (
                  <ExecutiveText variant="caption" className="text-muted-foreground italic">Nenhum ponto de atenção crítico identificado.</ExecutiveText>
                )}
              </div>
            </div>
          </div>

        </div>
      </ExecutiveSurface>
    </div>
  );
}
