import React from 'react';
import { Network, FileText, Database, GitMerge } from 'lucide-react';
import { InstitutionalIntelligenceSummary } from '../../types/intelligence/InstitutionalIntelligenceSummary';

interface Props {
  summary: InstitutionalIntelligenceSummary | null;
}

export const ExecutiveInstitutionalIntelligenceDashboard: React.FC<Props> = ({ summary }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="card-premium p-5 flex items-start gap-4">
        <div className="p-3 bg-primary rounded-lg">
          <Network size={24} className="text-primary" />
        </div>
        <div>
          <p className="text-eyebrow text-muted-foreground mb-1">Relações Causais</p>
          <span className="text-h2 font-display font-black text-foreground tabular-nums">
            {summary ? summary.causalRelationshipCount : 'N/A'}
          </span>
        </div>
      </div>

      <div className="card-premium p-5 flex items-start gap-4">
        <div className="p-3 bg-sky-500/10 rounded-lg">
          <FileText size={24} className="text-sky-400" />
        </div>
        <div>
          <p className="text-eyebrow text-muted-foreground mb-1">Evidências Conectadas</p>
          <span className="text-h2 font-display font-black text-foreground tabular-nums">
            {summary ? summary.evidenceCount : 'N/A'}
          </span>
        </div>
      </div>

      <div className="card-premium p-5 flex items-start gap-4">
        <div className="p-3 bg-success-soft0/10 rounded-lg">
          <Database size={24} className="text-emerald-400" />
        </div>
        <div>
          <p className="text-eyebrow text-muted-foreground mb-1">Eventos Históricos</p>
          <span className="text-h2 font-display font-black text-foreground tabular-nums">
            {summary ? summary.historicalRecordCount : 'N/A'}
          </span>
        </div>
      </div>

      <div className="card-premium p-5 flex items-start gap-4">
        <div className="p-3 bg-warning-soft0/10 rounded-lg">
          <GitMerge size={24} className="text-amber-400" />
        </div>
        <div>
          <p className="text-eyebrow text-muted-foreground mb-1">Impactos Estratégicos</p>
          <span className="text-h2 font-display font-black text-foreground tabular-nums">
            {summary ? summary.strategicImpactCount : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};
