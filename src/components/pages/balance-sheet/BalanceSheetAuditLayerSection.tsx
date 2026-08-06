import React from 'react';
import { ShieldAlert } from 'lucide-react';
import { BalanceSheetAuditLayerViewModel } from './view-models';
import { cn } from '../../../lib/utils';
import { ExecutiveRiskCard } from '../../ui/executive-risk-card';
import { ExecutiveClassificationFlow } from '../../ui/executive-classification-flow';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText, ExecutiveMetric } from '../../ui/executive-typography';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveAccordion } from '../../ui/executive-accordion';



export function BalanceSheetAuditLayerSection({
  viewModel,
  evidenceTrace
}: {
  viewModel: BalanceSheetAuditLayerViewModel;
  evidenceTrace?: any;
}) {
  // Tone helpers removed in favor of canonical components and inline neutral styles

  return (
    <ExecutiveAccordion
      variant="risk"
      icon={<ShieldAlert />}
      title="Governança Metodológica e Restrições Estruturais"
      subtitle="Auditoria de conformidade, ofensores críticos e consistência da base de dados."
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        
        {/* Global Index and Critical Offenders */}
        {viewModel.globalScore !== undefined && (
          <div className="flex flex-col">
            <ExecutiveHeading as="h4" variant="submoduleTitle" className="mb-4 border-b border-border pb-2">Índice Patrimonial</ExecutiveHeading>
            <div className="flex items-center gap-4 mb-4">
              <ExecutiveMetric variant="heroMetric">{Math.min(viewModel.globalScore, 100)}</ExecutiveMetric>
              <ExecutiveText variant="bodyStandard" className="text-executive-muted">Índice metodológico global</ExecutiveText>
            </div>
            <ExecutiveText variant="microLabel" className="text-executive-secondary mb-6 italic border-l-2 border-primary/30 pl-3">
              O Índice Patrimonial é um indicador metodológico composto utilizado para consolidar a avaliação patrimonial da organização, devendo ser interpretado em conjunto com as análises dimensionais e não como medida isolada.
            </ExecutiveText>
            
            {viewModel.criticalOffenders && viewModel.criticalOffenders.length > 0 && (
              <>
                <ExecutiveHeading as="h4" variant="submoduleTitle" className="mb-4 border-b border-border pb-2">Ofensores Críticos</ExecutiveHeading>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 items-stretch">
                  {viewModel.criticalOffenders.map((offender, idx) => (
                    <ExecutiveRiskCard
                      key={idx}
                      title={offender.metricName}
                      severity="critical"
                      badgeLabel={offender.classification}
                      description={offender.impact}
                      className="h-full"
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        
        {/* Structural Risks Overrides */}
        {viewModel.structuralRestrictions && (
          <div className="flex flex-col">
            <ExecutiveHeading as="h4" variant="submoduleTitle" className="mb-4 border-b border-border pb-2">Restrições Estruturais e Tetos de Classificação</ExecutiveHeading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 items-stretch">
              {viewModel.structuralRestrictions.overrides.map((override, idx) => {
                const s = override.severityLabel.toLowerCase();
                const severity = s.includes('crítico') || s.includes('critical') ? 'critical' : s.includes('alta') ? 'warning' : 'attention';
                return (
                  <ExecutiveRiskCard
                    key={idx}
                    title={override.overrideNameLabel}
                    severity={severity}
                    badgeLabel={override.severityLabel}
                    status="Em vigor"
                    className="h-full"
                  />
                );
              })}
            </div>
            
            <div className="mt-8 flex flex-col gap-4">
              {(() => {
                const mapLabelToVariant = (label: string) => {
                  const s = label.toLowerCase();
                  if (s.includes('crítico') || s.includes('critical')) return 'critical';
                  if (s.includes('alta') || s.includes('warning') || s.includes('alerta')) return 'warning';
                  if (s.includes('médio') || s.includes('atenção') || s.includes('attention')) return 'attention';
                  if (s.includes('saudável') || s.includes('success') || s.includes('resiliente')) return 'success';
                  return 'neutral';
                };
                return (
                  <ExecutiveClassificationFlow 
                    steps={[
                      { 
                        label: "Índice Original", 
                        value: <ExecutiveBadge variant={mapLabelToVariant(viewModel.structuralRestrictions.originalClassificationLabel)}>{viewModel.structuralRestrictions.originalClassificationLabel}</ExecutiveBadge> 
                      },
                      { 
                        label: "Teto Aplicado", 
                        value: <ExecutiveBadge variant="neutral">Nenhum</ExecutiveBadge> 
                      },
                      { 
                        label: "Resultado Final", 
                        value: <ExecutiveBadge variant={mapLabelToVariant(viewModel.structuralRestrictions.classificationCeilingLabel)}>{viewModel.structuralRestrictions.classificationCeilingLabel}</ExecutiveBadge> 
                      }
                    ]}
                  />
                );
              })()}
            </div>
          </div>
        )}

        {/* Governance Consistency */}
        {viewModel.governanceConsistency && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
              <ExecutiveHeading as="h4" variant="submoduleTitle">Validação de Consistência Institucional</ExecutiveHeading>
              <div className="flex items-center gap-2">
                <ExecutiveText as="span" variant="caption" className="text-executive-muted">Status</ExecutiveText>
                <ExecutiveBadge variant={viewModel.governanceConsistency.statusTone}>
                  {viewModel.governanceConsistency.statusLabel}
                </ExecutiveBadge>
              </div>
            </div>
            
            {viewModel.governanceConsistency.hasIssues ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto max-h-[400px] pr-2 items-stretch">
                {viewModel.governanceConsistency.issues.map((issue, idx) => {
                  
                  // Extract specific title if message follows "Title: Description" format
                  let title = issue.typeLabel;
                  let description = issue.message;
                  
                  const colonIndex = issue.message.indexOf(':');
                  if (colonIndex > 0 && colonIndex < 80) {
                    title = issue.message.substring(0, colonIndex).trim();
                    description = issue.message.substring(colonIndex + 1).trim();
                  }
                  
                  return (
                    <ExecutiveRiskCard
                      key={idx}
                      title={title}
                      severity={issue.severity}
                      badgeLabel={issue.severityLabel}
                      description={description}
                      className="h-full"
                    />
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4 bg-surface-container/30 border border-border rounded-xl text-center">
                <ExecutiveText as="p" variant="bodyStandard" className="text-executive-secondary">Nenhuma inconsistência fiduciária detectada.</ExecutiveText>
              </div>
            )}
          </div>
        )}
      </div>

    </ExecutiveAccordion>
  );
}
