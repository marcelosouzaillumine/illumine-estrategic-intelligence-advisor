import React from 'react';
import { cn } from '@/lib/utils';
import type { ExecutiveDecisionPayload } from '../../../../services/FiduciaryRuntimeAdapter';
import { ExecutiveStrategicSemanticCards } from '../../../../components/ui/executive-strategic-semantic-cards';

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
    outlook: (typeof payload.boardConclusion === 'object' && payload.boardConclusion && 'content' in payload.boardConclusion ? payload.boardConclusion.content : typeof payload.boardConclusion === 'string' ? payload.boardConclusion : '') || "Perspectiva em consolidação.",
    priorityRecommendation: (typeof payload.priorityRecommendation === 'object' && payload.priorityRecommendation ? (payload.priorityRecommendation as any).content : payload.priorityRecommendation) || "Recomendação não definida.",
    severityState: (typeof payload.priorityRecommendation === 'object' && payload.priorityRecommendation ? ((payload.priorityRecommendation as any).severity === "monitoring" ? "warning" : (payload.priorityRecommendation as any).severity) : "warning")
  };

  return (
    <div className={cn("opacity-90", className)} title="Deprecation Warning: Use ExecutiveStrategicSemanticCards directly">
      <ExecutiveStrategicSemanticCards payload={mappedPayload as any} selectedYear={mappedPayload.analysisYear} />
    </div>
  );
}

