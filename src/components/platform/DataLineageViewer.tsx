import React from 'react';
import { GitCommit, ArrowRight, Database } from 'lucide-react';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveText } from '../ui/executive-typography';
import { DataLineageTrace } from '@illumine/executive-contracts';

export interface DataLineageViewerProps {
  readonly trace: DataLineageTrace;
}

export const DataLineageViewer: React.FC<DataLineageViewerProps> = ({ trace }) => {
  return (
    <ExecutiveSurface className="p-4 mb-4 bg-card border border-border rounded-lg shadow-sm">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border/50">
        <GitCommit className="w-4 h-4 text-primary" />
        <ExecutiveText variant="sectionTitle" className="font-semibold text-primary">
          Visualizador de Data Lineage Trace ({trace.traceId})
        </ExecutiveText>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs p-3 bg-surface-container/30 rounded border border-border/30">
        <div className="flex items-center gap-1.5 font-medium text-foreground">
          <Database className="w-3.5 h-3.5 text-primary" />
          <span>{trace.dataSourceName}</span>
        </div>

        <ArrowRight className="w-4 h-4 text-muted-foreground hidden md:block" />

        <div className="font-medium text-muted-foreground">
          Transformação: <span className="text-foreground">{trace.transformationName}</span>
        </div>

        <ArrowRight className="w-4 h-4 text-muted-foreground hidden md:block" />

        <div className="font-bold text-success">
          Métrica: {trace.metricCode} ({trace.metricValue})
        </div>
      </div>
    </ExecutiveSurface>
  );
};
