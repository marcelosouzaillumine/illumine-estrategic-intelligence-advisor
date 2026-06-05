import React from 'react';
import { ExecutiveNarrative } from '../../../services/FiduciaryRuntimeAdapter';

interface ExecutiveEvidenceExplorerProps {
  narrative: ExecutiveNarrative;
}

export const ExecutiveEvidenceExplorer: React.FC<ExecutiveEvidenceExplorerProps> = ({ narrative }) => {
  if (!narrative.evidenceChain || narrative.evidenceChain.length === 0) {
    return (
      <div className="p-4 bg-red-900/20 border border-red-500/50 rounded">
        <p className="text-red-400 font-mono text-sm font-bold">[BLOCK] EVIDENCE_MISSING: Cannot render unevidenced narrative.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-slate-900 border border-slate-800 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-4">Evidence Chain</h3>
      <div className="grid gap-4">
        {narrative.evidenceChain.map(evidence => (
          <div key={evidence.evidenceId} className="p-4 bg-slate-800/50 rounded border border-slate-700/50">
            <div className="flex justify-between items-start mb-2">
              <span className="font-mono text-xs text-indigo-400">{evidence.evidenceId}</span>
              <span className="font-mono text-xs text-slate-500">{new Date(evidence.timestamp).toISOString()}</span>
            </div>
            <div className="mb-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Provenance Nodes</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {evidence.sourceNodes.map(node => (
                  <span key={node} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 font-mono">
                    {node}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Metrics Payload</span>
              <pre className="mt-1 p-2 bg-black/30 rounded text-xs text-emerald-400 font-mono overflow-x-auto">
                {JSON.stringify(evidence.metrics, null, 2)}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
