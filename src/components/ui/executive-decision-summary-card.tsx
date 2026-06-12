import React from 'react';
import { cn } from '@/lib/utils';
import type { ExecutiveDecisionPayload } from '../../services/FiduciaryRuntimeAdapter';
import { ExecutiveStrategicSemanticCards } from './executive-strategic-semantic-cards';

export interface ExecutiveDecisionSummaryCardProps {
  payload: ExecutiveDecisionPayload;
  className?: string;
  moduleName?: string;
}

/**
 * @deprecated Utilize `ExecutiveStrategicSemanticCards` diretamente passando um `ExecutiveStrategicDiagnosisPayload`.
 * Este componente foi mantido por compatibilidade com relatórios em PDF e exportações antigas.
 */
export function ExecutiveDecisionSummaryCard({ payload, className, moduleName }: ExecutiveDecisionSummaryCardProps) {
  if (!payload) return null;

  // Conversão de compatibilidade (Legacy to Canonical)
  const mappedPayload = {
    analysisYear: new Date().getFullYear(),
    generatedAt: new Date().toISOString(),
    currentSituation: payload.summary || "Situação atual não providenciada.",
    strategicPriority: payload.thematicNarratives?.[0]?.content || "Prioridade em análise.",
    outlook: payload.boardConclusion?.content || "Perspectiva em consolidação.",
    priorityRecommendation: payload.priorityRecommendation?.content || "Recomendação não definida.",
    severityState: payload.priorityRecommendation?.severity === "monitoring" ? "warning" : payload.priorityRecommendation?.severity
  };

  return (
    <div className={cn("opacity-90", className)} title="Deprecation Warning: Use ExecutiveStrategicSemanticCards directly">
      <ExecutiveStrategicSemanticCards payload={mappedPayload as any} selectedYear={mappedPayload.analysisYear} />
    </div>
  );
}

