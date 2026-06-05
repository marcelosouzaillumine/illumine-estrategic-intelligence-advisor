import React from 'react';
import { ImportedDataset } from '../../services/FiduciaryRuntimeAdapter';
import { SourceTrustBadge } from './SourceTrustBadge';
import { AlertTriangle, Hash, Check, X } from 'lucide-react';

export function ImportReviewQueueTable({ 
  queue, 
  onApprove, 
  onPublish 
}: { 
  queue: ImportedDataset[], 
  onApprove: (id: string) => void,
  onPublish: (dataset: ImportedDataset) => void
}) {
  if (queue.length === 0) {
    return <div className="p-8 text-center text-sm text-muted-foreground bg-surface-container border border-border rounded-lg">Fila de Revisão Vazia.</div>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-muted-foreground">
            <th className="p-3 font-medium">Dataset / Connector</th>
            <th className="p-3 font-medium">Trust</th>
            <th className="p-3 font-medium">Violations</th>
            <th className="p-3 font-medium">Status</th>
            <th className="p-3 font-medium text-right">Ação</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {queue.map(item => (
            <tr key={item.importId} className="hover:bg-surface-container/50 transition-colors">
              <td className="p-3">
                <div className="font-mono text-xs">{item.importId}</div>
                <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-1">
                  <Hash size={10}/> {item.lineage.datasetHash.substring(0, 8)}
                </div>
              </td>
              <td className="p-3"><SourceTrustBadge trust={item.trustLevel} /></td>
              <td className="p-3">
                {item.violations.length > 0 ? (
                  <span className="flex items-center gap-1 text-amber-500 text-xs">
                    <AlertTriangle size={12}/> {item.violations.length} Aviso(s)
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">0</span>
                )}
              </td>
              <td className="p-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-500/10 border border-zinc-500/20 uppercase">{item.status}</span>
              </td>
              <td className="p-3 text-right">
                {item.status === 'PENDING_REVIEW' && (
                  <button onClick={() => onApprove(item.importId)} className="text-xs font-medium text-emerald-500 hover:text-emerald-400">
                    Aprovar (Mock)
                  </button>
                )}
                {item.status === 'APPROVED' && (
                  <button onClick={() => onPublish(item)} className="text-xs font-medium text-primary hover:text-primary/80">
                    Publicar
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
