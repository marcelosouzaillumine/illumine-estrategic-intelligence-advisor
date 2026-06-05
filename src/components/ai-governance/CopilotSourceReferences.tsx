import React from 'react';
import { AIGroundingReference } from '../../services/FiduciaryRuntimeAdapter';
import { FileText, Activity, Hash } from 'lucide-react';

export function CopilotSourceReferences({ references }: { references: AIGroundingReference[] }) {
  if (references.length === 0) return null;

  return (
    <div className="mt-3 border-t border-border pt-3">
      <p className="text-xs font-medium text-muted-foreground mb-2">Fontes Utilizadas:</p>
      <div className="flex flex-wrap gap-2">
        {references.map((ref, idx) => (
          <div key={idx} className="flex items-center gap-2 bg-surface-container border border-border rounded px-2 py-1 text-[11px] text-muted-foreground">
            <FileText size={12} className="text-primary" />
            <span>{ref.sourceType} {ref.reportVersion ? `v${ref.reportVersion}` : ''}</span>
            <span className="w-px h-3 bg-border"></span>
            <Hash size={12} />
            <span className="font-mono text-[10px]" title={ref.lineageHash}>{ref.lineageHash.substring(0, 8)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
