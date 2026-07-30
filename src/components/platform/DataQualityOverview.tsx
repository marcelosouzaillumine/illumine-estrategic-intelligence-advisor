import React from 'react';
import { ShieldCheck, Database, AlertTriangle } from 'lucide-react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveBadge } from '../ui/executive-badge';
import { ExecutiveText } from '../ui/executive-typography';
import { DataQualityReport } from '@illumine/executive-contracts';

export interface DataQualityOverviewProps {
  readonly report: DataQualityReport;
}

export const DataQualityOverview: React.FC<DataQualityOverviewProps> = ({ report }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center justify-between gap-4 mb-3 pb-2 border-b border-border/50">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-primary" />
          <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
            Data Governance Center — Qualidade do Tecido de Dados
          </ExecutiveText>
        </div>
        <ExecutiveBadge variant="success">
          Confiabilidade: {report.confidenceScore}%
        </ExecutiveBadge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        <div className="p-3 bg-surface-container/30 rounded border border-border/30">
          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Cobertura de Dados</span>
          <span className="font-bold text-foreground text-base">{report.dataCoveragePercent}%</span>
        </div>

        <div className="p-3 bg-surface-container/30 rounded border border-border/30">
          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Inconsistências</span>
          <span className="font-bold text-warning text-base">{report.inconsistencyCount}</span>
        </div>

        <div className="p-3 bg-surface-container/30 rounded border border-border/30">
          <span className="text-muted-foreground block text-[10px] uppercase font-semibold">Registros Atrasados</span>
          <span className="font-bold text-foreground text-base">{report.delayedRecordsCount}</span>
        </div>
      </div>
    </ExecutiveSurface>
  );
};
