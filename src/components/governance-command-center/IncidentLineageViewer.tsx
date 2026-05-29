import React, { useState } from 'react';
import { useCommandCenter } from '../../context/governance-command-center/GovernanceCommandCenterProvider';

export const IncidentLineageViewer: React.FC = () => {
  const { selectedIncident } = useCommandCenter();
  const [copied, setCopied] = useState(false);

  if (!selectedIncident) {
    return (
      <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl text-center text-xs text-slate-500 font-mono">
        SELECIONE UM INCIDENTE PARA AUDITAR LINHAGEM...
      </div>
    );
  }

  const { lineageHash, correlationId, sourceRuntimeReferences } = selectedIncident;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify({ lineageHash, correlationId }, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-5 bg-slate-950/70 border border-slate-800 rounded-xl font-mono text-[11px] space-y-3">
      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
        <h4 className="text-slate-400 font-bold tracking-wider uppercase text-[10px]">Fiduciary Trace Lineage</h4>
        <button
          onClick={copyToClipboard}
          className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-all active:scale-95 text-[9px]"
        >
          {copied ? 'COPIED!' : 'COPY SCHEMA'}
        </button>
      </div>

      <div className="space-y-3 text-slate-300">
        <div>
          <span className="text-slate-500 block mb-1">INCIDENT ID</span>
          <span className="bg-slate-900/60 border border-slate-800 px-2 py-1 rounded text-cyan-400 select-all block">
            {selectedIncident.incidentId}
          </span>
        </div>

        <div>
          <span className="text-slate-500 block mb-1">AUDIT LINEAGE HASH</span>
          <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-emerald-400 select-all font-semibold block overflow-x-auto whitespace-nowrap">
            {lineageHash}
          </span>
        </div>

        <div>
          <span className="text-slate-500 block mb-1">CORRELATION ID</span>
          <span className="bg-slate-900 border border-slate-800 px-2 py-1 rounded text-cyan-400 select-all block overflow-x-auto whitespace-nowrap">
            {correlationId}
          </span>
        </div>

        <div>
          <span className="text-slate-500 block mb-1">ORIGINATING RUNTIME ENGINES</span>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {sourceRuntimeReferences.map((ref, idx) => (
              <span key={idx} className="bg-slate-900/60 border border-slate-850 px-2 py-0.5 rounded text-[9px] text-slate-400">
                {ref}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
