import React from 'react';
import { ExecutiveNarrative } from '../../ui/executive-narrative';
import { ExecutiveMetricCard } from '../../ui/executive-metric-card';

interface DiagnosticNarrativeProps {
  maturityScore: number;
  governanceScore: number;
  financialHealthScore: number;
}

export const DiagnosticNarrative: React.FC<DiagnosticNarrativeProps> = ({
  maturityScore,
  governanceScore,
  financialHealthScore
}) => {
  return (
    <div className="space-y-6">
      <ExecutiveNarrative variant="summary" title="CONSELHO — Diagnóstico Global de Maturidade & Riscos">
        O diagnóstico organizacional indica índice elevado de maturidade corporativa (94.5%), com alinhamento das práticas de governança e solidez financeira.
      </ExecutiveNarrative>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ExecutiveMetricCard
          title="Maturidade Global"
          value={`${maturityScore}%`}
          statusBadge="Nível L4 Auditado"
          description="Consolidação dos eixos estratégicos"
        />
        <ExecutiveMetricCard
          title="Score de Governança"
          value={`${governanceScore}%`}
          statusBadge="Excelente"
          description="Alinhamento AGF & Conselho"
        />
        <ExecutiveMetricCard
          title="Saúde Financeira"
          value={`${financialHealthScore}%`}
          statusBadge="Solidez Alta"
          description="Estrutura de capital e margens"
        />
      </div>
    </div>
  );
};
