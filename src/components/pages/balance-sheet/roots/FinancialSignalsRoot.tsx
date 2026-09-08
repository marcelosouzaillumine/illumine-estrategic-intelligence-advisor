import React from 'react';
import { ExecutiveEmptyState } from '../../../ui/executive-empty-state';
import { ExecutiveSurface } from '../../../ui/executive-surface';
import { ExecutiveHeading } from '../../../ui/executive-heading';
import { ExecutiveText } from '../../../ui/executive-typography';
import { AlertCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { ExecutiveAnalyticalMissing } from '../../../ui/executive-analytical-missing';
import { ExecutiveTraceabilityPanel } from '../../../ui/executive-traceability-panel';
import { IntelligenceSignal } from '../../../../capabilities/financial/contracts/IntelligenceSignal';

export const FinancialSignalsRoot = ({ context }: any) => {
  const { pureViewModel } = context.intelligence.financialPosition;
  const signalsWrapper = pureViewModel?.signals;
  const questionsWrapper = pureViewModel?.executiveQuestions;

  const state = signalsWrapper?.state || 'UNAVAILABLE';

  if (state === 'UNAVAILABLE') {
    const fallbackReason = signalsWrapper?.availabilityReason || {
      type: "LOW_CONFIDENCE",
      title: "Análise indisponível",
      explanation: "Os dados necessários para esta análise não estão disponíveis.",
      impact: "Não é possível determinar a posição."
    };
    return <ExecutiveAnalyticalMissing reason={fallbackReason} className="my-8" />;
  }

  const signals: IntelligenceSignal[] = signalsWrapper?.items || [];

  if (state === 'AVAILABLE_EMPTY') {
    return (
      <div className="w-full my-8 flex flex-col gap-4">
        <div className="flex items-center gap-3 mb-2 pb-2 border-b border-border">
          <ExecutiveHeading as="h2" variant="moduleTitle" className="text-foreground leading-tight tracking-tight">
            Sinais de Inteligência Patrimonial
          </ExecutiveHeading>
        </div>
        <ExecutiveEmptyState
          title="Sem alertas adicionais específicos"
          description="O diagnóstico estrutural já resume o risco atual. Não existem alertas materiais isolados (Signals) que excedam os parâmetros normais de atenção além da classificação do próprio Balanço."
        />
      </div>
    );
  }


  return (
    <div className="w-full my-8 flex flex-col gap-4">
      <div className="flex items-center gap-3 mb-2 pb-2 border-b border-border">
        <ExecutiveHeading as="h2" variant="moduleTitle" className="text-foreground leading-tight tracking-tight">
          Sinais de Inteligência Patrimonial
        </ExecutiveHeading>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {signals.map((signal: IntelligenceSignal, idx: number) => {
          const isCritical = signal.severity === 'critical';
          const isWarning = signal.severity === 'attention';
          
          return (
            <ExecutiveSurface key={idx} padding="none" radius="md" className={cn(
              "border-2 shadow-sm flex flex-col overflow-hidden",
              isCritical ? "border-red-400 dark:border-red-600" :
              isWarning ? "border-amber-400 dark:border-amber-600" :
              "border-border"
            )}>
              <div className={cn(
                "flex items-center gap-2 px-4 py-3 border-b",
                isCritical ? "bg-red-100 border-red-300 dark:bg-red-950 dark:border-red-700" :
                isWarning ? "bg-amber-100 border-amber-300 dark:bg-amber-950 dark:border-amber-700" :
                "bg-surface-container border-border"
              )}>
                {isCritical ? <AlertCircle className="w-5 h-5 text-state-critical-foreground" /> :
                 isWarning ? <AlertTriangle className="w-5 h-5 text-state-warning-foreground" /> :
                 <ShieldCheck className="w-5 h-5 text-state-success-foreground" />}
                <ExecutiveHeading as="h4" variant="submoduleTitle" className="text-foreground capitalize">
                  {signal.severity === 'attention' ? 'Atenção' : signal.severity === 'critical' ? 'Crítico' : 'Informativo'}
                </ExecutiveHeading>
              </div>

              <div className="p-4 flex flex-col gap-4 bg-card">
                <div>
                  <ExecutiveText variant="microLabel" className="uppercase tracking-wider font-semibold text-primary mb-1">
                    Observação
                  </ExecutiveText>
                  <ExecutiveText variant="bodyStandard" className="text-foreground">
                    {signal.observation.text}
                  </ExecutiveText>
                </div>
                
                <div>
                  <ExecutiveText variant="microLabel" className="uppercase tracking-wider font-semibold text-primary mb-1">
                    Evidência
                  </ExecutiveText>
                  <ExecutiveText variant="bodyStandard" className="text-foreground">
                    {signal.evidence.text} {signal.sourceMetric && `(${signal.sourceMetric.name}: ${signal.sourceMetric.value})`}
                  </ExecutiveText>
                </div>

                <div>
                  <ExecutiveText variant="microLabel" className="uppercase tracking-wider font-semibold text-primary mb-1">
                    Interpretação
                  </ExecutiveText>
                  <ExecutiveText variant="bodyStandard" className="text-executive-secondary">
                    {signal.interpretation.text}
                  </ExecutiveText>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 p-4 bg-surface-container rounded-lg border border-border">
                  <div>
                    <ExecutiveText variant="microLabel" className="uppercase tracking-wider font-semibold text-muted-foreground mb-1">Materialidade</ExecutiveText>
                    <ExecutiveText variant="bodyStandard" className="font-medium capitalize">{
                      signal.materiality === 'critical' ? 'Crítica' :
                      signal.materiality === 'high' ? 'Alta' :
                      signal.materiality === 'moderate' ? 'Moderada' : 'Baixa'
                    }</ExecutiveText>
                  </div>
                  <div>
                    <ExecutiveText variant="microLabel" className="uppercase tracking-wider font-semibold text-muted-foreground mb-1">Persistência</ExecutiveText>
                    <ExecutiveText variant="bodyStandard" className="font-medium capitalize">{
                      signal.persistence === 'structural' ? 'Estrutural' :
                      signal.persistence === 'conjunctural' ? 'Conjuntural' : 'Desconhecida'
                    }</ExecutiveText>
                  </div>
                  <div>
                    <ExecutiveText variant="microLabel" className="uppercase tracking-wider font-semibold text-muted-foreground mb-1">Horizonte</ExecutiveText>
                    <ExecutiveText variant="bodyStandard" className="font-medium capitalize">{
                      signal.horizon === 'short_term' ? 'Curto Prazo' :
                      signal.horizon === 'medium_term' ? 'Médio Prazo' :
                      signal.horizon === 'long_term' ? 'Longo Prazo' : 'Desconhecido'
                    }</ExecutiveText>
                  </div>
                  <div>
                    <ExecutiveText variant="microLabel" className="uppercase tracking-wider font-semibold text-muted-foreground mb-1">Confiança</ExecutiveText>
                    <ExecutiveText variant="bodyStandard" className="font-medium capitalize">{
                      signal.confidence === 'high' ? 'Alta' :
                      signal.confidence === 'medium' ? 'Média' : 'Baixa'
                    }</ExecutiveText>
                  </div>
                </div>

                {signal.relatedQuestion && questionsWrapper?.items?.find((q: any) => q.id === signal.relatedQuestion) && (
                  <div className="mt-2 pt-4 border-t border-border">
                    <ExecutiveText variant="microLabel" className="uppercase tracking-wider font-semibold text-primary mb-1">
                      Questão Executiva
                    </ExecutiveText>
                    <ExecutiveText variant="bodyStandard" className="text-foreground italic">
                      {questionsWrapper.items.find((q: any) => q.id === signal.relatedQuestion)?.question}
                    </ExecutiveText>
                  </div>
                )}
                
                {signal.traceability && (
                  <ExecutiveTraceabilityPanel traceability={signal.traceability} />
                )}
              </div>
            </ExecutiveSurface>
          );
        })}
      </div>
    </div>
  );
};
