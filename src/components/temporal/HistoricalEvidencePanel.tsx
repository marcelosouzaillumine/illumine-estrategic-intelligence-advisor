import React from 'react';
import { Search, Database } from 'lucide-react';
import { TemporalProvenanceRecord } from '../../types/temporal/TemporalProvenanceRecord';

interface HistoricalEvidencePanelProps {
  provenance: TemporalProvenanceRecord | null;
}

export const HistoricalEvidencePanel: React.FC<HistoricalEvidencePanelProps> = ({ provenance }) => {
  if (!provenance) {
    return (
      <div className="p-6 bg-surface-container rounded-xl border border-border text-center">
        <Database size={24} className="text-muted-foreground mx-auto mb-2" />
        <p className="text-xs text-muted-foreground">Nenhum registro de proveniência (Provenance) carregado para este evento.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-eyebrow text-foreground uppercase tracking-widest flex items-center gap-2">
        <Search size={16} className="text-emerald-400" /> Proveniência Histórica
      </h3>

      <div className="bg-surface-container p-5 rounded-xl border border-emerald-500/10 space-y-4">
        <div>
          <span className="text-eyebrow text-muted-foreground block mb-1">Provenance ID</span>
          <div className="font-mono text-xs text-emerald-400 bg-success-soft0/10 px-2 py-1 rounded border border-emerald-500/20 inline-block">
            {provenance.provenanceId}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Evidence Bundle ID</span>
            <div className="font-mono text-[10px] text-foreground bg-surface-container-highest px-2 py-1 rounded border border-border">
              {provenance.evidenceBundleId}
            </div>
          </div>
          <div>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Explainability Chain ID</span>
            <div className="font-mono text-[10px] text-foreground bg-surface-container-highest px-2 py-1 rounded border border-border">
              {provenance.explainabilityChainId}
            </div>
          </div>
          <div className="col-span-2">
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Graph Lineage Signature</span>
            <div className="font-mono text-[10px] text-muted-foreground bg-surface-container-highest px-2 py-1 rounded border border-border select-all overflow-hidden text-ellipsis">
              {provenance.lineageId}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
