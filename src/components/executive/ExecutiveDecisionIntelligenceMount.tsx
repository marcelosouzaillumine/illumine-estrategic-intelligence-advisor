import React, { useMemo } from 'react';
import { ExecutiveDecisionIntelligenceEngine } from '@illumine/executive-decision-intelligence';
import { ExecutiveExperienceComposer } from '@illumine/executive-experience-composer';
import { ExecutiveDecisionSurface } from './ExecutiveDecisionSurface';
import { ExecutiveIntelligenceRuntimeInspector } from './ExecutiveIntelligenceRuntimeInspector';
import { ExecutiveDecisionContextCard } from './ExecutiveDecisionContextCard';
import { ExecutiveIntentCard } from './ExecutiveIntentCard';
import { ExecutiveDiagnosisCard } from './ExecutiveDiagnosisCard';
import { ExecutiveDeliberationCard } from './ExecutiveDeliberationCard';
import { ExecutiveEvidenceCard } from './ExecutiveEvidenceCard';
import { ExecutiveExecutionCard } from './ExecutiveExecutionCard';
import { ExecutiveLearningCard } from './ExecutiveLearningCard';
import { ExecutiveEmptyState } from '../ui/executive-empty-state';
import { ShieldAlert, AlertTriangle } from 'lucide-react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveBadge } from '../ui/executive-badge';

export interface ExecutiveDecisionIntelligenceMountProps {
  readonly pageId: string;
  readonly companyId?: string;
  readonly companyName?: string;
  readonly period?: string;
  readonly financialData?: Record<string, number>;
  readonly previousPeriodFinancialData?: Record<string, number>;
  readonly runtimePermission?: 'ALLOW' | 'RESTRICT' | 'BLOCK';
  readonly onExplore?: () => void;
}

export const ExecutiveDecisionIntelligenceMount: React.FC<ExecutiveDecisionIntelligenceMountProps> = ({
  pageId,
  companyId = 'comp-100',
  companyName,
  period = '2026',
  financialData,
  previousPeriodFinancialData,
  runtimePermission = 'ALLOW',
  onExplore
}) => {
  // Graduated Protection Rule CFDI v2.1:
  // BLOCK mode -> Pause AI runtime and display Executive Empty State
  if (runtimePermission === 'BLOCK') {
    return (
      <ExecutiveSurface variant="critical" padding="lg" radius="lg" className="w-full mb-6">
        <ExecutiveEmptyState
          icon={<ShieldAlert className="w-10 h-10 text-critical" />}
          title="Integridade Financeira Necessária — Deliberação Pausada"
          description="O Conselho de Agentes Executivos e os motores de prescrição estratégica estão temporariamente suspensos. Foram identificadas inconsistências críticas nos demonstrativos contábeis selecionados."
          actionLabel="Verificar Integridade dos Dados"
          onAction={() => alert('Auditoria Fiduciária: Inconsistência de Batimento detectada (FIN-004). Reprocesse o lançamento.')}
        />
      </ExecutiveSurface>
    );
  }

  const decisionOutput = useMemo(() => {
    return ExecutiveDecisionIntelligenceEngine.evaluate({
      companyId,
      companyName,
      userId: 'user-c-level',
      pageId,
      period,
      financialData,
      previousPeriodFinancialData
    });
  }, [companyId, companyName, pageId, period, financialData, previousPeriodFinancialData]);

  useMemo(() => {
    return ExecutiveExperienceComposer.compose({
      companyId,
      companyName,
      userId: 'user-c-level',
      pageId,
      period,
      activeFinancialMetrics: financialData
    });
  }, [companyId, companyName, pageId, period, financialData]);

  const ctx = decisionOutput.context;

  return (
    <div className="w-full space-y-4 mb-6">
      {/* RESTRICT Mode Warning Banner */}
      {runtimePermission === 'RESTRICT' && (
        <ExecutiveSurface variant="warning" padding="sm" radius="md" className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
          <div className="flex-1">
            <span className="font-bold text-xs uppercase tracking-wider text-warning">Modo Restrito de Inteligência Executiva</span>
            <p className="text-xs text-muted-foreground">Diagnóstico fiduciário em modo analítico. Recomendações prescritivas desativadas até batimento contábil completo.</p>
          </div>
          <ExecutiveBadge variant="warning">Modo Diagnóstico</ExecutiveBadge>
        </ExecutiveSurface>
      )}

      {/* Dynamic Runtime Inspector */}
      <ExecutiveIntelligenceRuntimeInspector pageId={pageId} hasRealData={!!financialData} />

      {/* Layer 1 — Executive Context */}
      <ExecutiveDecisionContextCard context={ctx} />

      {/* Layer 2 — Executive Intent */}
      <ExecutiveIntentCard context={ctx} />

      {/* Layer 3 — Executive Understanding / Synthesis */}
      <ExecutiveDecisionSurface
        pageTitle={pageId}
        opportunityTitle={decisionOutput.signal.signalTitle}
        opportunityDetail={`${decisionOutput.narrative.executiveHeadline} (${decisionOutput.recommendation.expectedImpactText})`}
        onExploreAnalysis={onExplore}
      />

      {/* Layer 4 — Executive Diagnosis */}
      <ExecutiveDiagnosisCard context={ctx} />

      {/* Layer 5 — Executive Deliberation */}
      {runtimePermission === 'ALLOW' && <ExecutiveDeliberationCard context={ctx} />}

      {/* Layer 6 — Executive Evidence */}
      <ExecutiveEvidenceCard context={ctx} />

      {/* Layer 7 — Executive Execution */}
      {runtimePermission === 'ALLOW' && <ExecutiveExecutionCard context={ctx} />}

      {/* Layer 8 — Executive Learning */}
      <ExecutiveLearningCard context={ctx} />
    </div>
  );
};

