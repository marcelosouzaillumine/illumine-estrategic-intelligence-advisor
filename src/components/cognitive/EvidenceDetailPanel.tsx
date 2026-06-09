import React from 'react';
import { CognitiveEvidenceItem } from '../../viewmodels/cognitive/ExecutiveCognitiveViewModel';
import { FileText } from 'lucide-react';
import { InvestigationLauncherWrapper } from '../investigation/InvestigationLauncherWrapper';

interface EvidenceDetailPanelProps {
  evidences: CognitiveEvidenceItem[];
}

export const EvidenceDetailPanel: React.FC<EvidenceDetailPanelProps> = ({ evidences }) => {
  if (!evidences || evidences.length === 0) {
    return (
      <div className="p-4 bg-surface-container/30 border border-border rounded-xl">
        <h3 className="text-sm font-bold text-foreground mb-1">Evidências Institucionais</h3>
        <p className="text-xs text-muted-foreground">
          Nenhuma evidência conectada disponível para esta estrutura cognitiva.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-foreground uppercase tracking-wider">Evidências Diretas</h3>
      <div className="flex flex-col gap-2">
        {evidences.map((ev) => (
          <div key={ev.id} className="p-3 bg-surface-container/50 border border-border rounded-lg flex items-start gap-3">
            <div className="mt-0.5">
              <FileText className="text-muted-foreground" size={16} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">{ev.title}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-[10px] font-mono text-muted-foreground bg-surface-container px-1.5 py-0.5 rounded">
                  ID: {ev.id.split('-').pop()}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground border border-border px-1.5 py-0.5 rounded">
                  {ev.source}
                </span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  ev.confidence === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                  ev.confidence === 'HIGH' ? 'bg-blue-100 text-blue-800' :
                  ev.confidence === 'MEDIUM' ? 'bg-amber-100 text-amber-800' :
                  'bg-slate-100 text-muted-foreground'
                }`}>
                  Confiança: {ev.confidence}
                </span>
                <InvestigationLauncherWrapper 
                  tenantId="SYSTEM_TENANT" 
                  nodeId={ev.id} 
                  originSurface="COGNITIVE_DRAWER" 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
