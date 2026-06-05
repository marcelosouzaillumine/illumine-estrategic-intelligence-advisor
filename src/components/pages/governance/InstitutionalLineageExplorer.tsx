// src/components/pages/governance/InstitutionalLineageExplorer.tsx

import React from 'react';
import { Database, Hash, FileText, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { LineageAppendix, InstitutionalDisclosure } from '../../../services/FiduciaryRuntimeAdapter';

interface InstitutionalLineageExplorerProps {
  lineageAppendix?: LineageAppendix;
  disclosureSet?: InstitutionalDisclosure[];
  dataMode: 'REAL' | 'MOCK' | 'EMPTY' | 'ERROR';
}

export function InstitutionalLineageExplorer({ lineageAppendix, disclosureSet, dataMode }: InstitutionalLineageExplorerProps) {
  const isMock = dataMode === 'MOCK';

  // 1. Resolve hashes with mock isolation
  const mainHash = isMock ? 'MOCK_LINEAGE' : (lineageAppendix?.boardPackLineageHash || 'N/A');
  
  const runtimeHashes = isMock 
    ? {
        DRE: 'MOCK_LINEAGE_DRE_DEGRADED',
        BP: 'MOCK_LINEAGE_BP_DEGRADED',
        DLPA: 'MOCK_LINEAGE_DLPA_DEGRADED',
        DFC: 'MOCK_LINEAGE_DFC_DEGRADED'
      }
    : (lineageAppendix?.runtimeHashes || {});

  const propagationHashes = isMock
    ? ['MOCK_PROPAGATION_01', 'MOCK_PROPAGATION_02']
    : (lineageAppendix?.propagationHashes || []);

  const activeDisclosures = disclosureSet || [];

  return (
    <div className="p-6 rounded-[32px] border border-slate-200 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-950/40 backdrop-blur-md space-y-6 shadow-xs">
      {/* Sandbox banner if mock data is used */}
      {isMock && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-600 dark:text-amber-400">Demo dataset / No real financial data loaded</h4>
            <p className="text-[10px] text-amber-655/70 mt-0.5 uppercase tracking-widest font-medium">
              Linhagem e chaves de auditoria marcadas como simuladas. Nenhuma conclusão ou parecer fiduciário real deve ser inferido deste painel.
            </p>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-white/5 pb-3 justify-between">
        <div className="flex items-center gap-3">
          <Database className="w-5 h-5 text-slate-500 dark:text-zinc-400" />
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-800 dark:text-zinc-300">
            Explorer de Linhagem e Auditoria Fiduciária
          </h3>
        </div>
        <span className="text-[9px] font-mono font-bold uppercase tracking-widest px-2.5 py-1 bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-650 dark:text-zinc-400 rounded shadow-xs">
          {isMock ? 'SANDBOX MODE' : 'REAL DATA VERIFIED'}
        </span>
      </div>

      {/* Main Ledger Hash */}
      <div className="p-4 rounded-xl bg-slate-100/80 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-900 flex flex-col gap-2 shadow-xs">
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500">
          Hash de Linhagem Consolidado (Board Pack Ledger)
        </span>
        <div className="flex items-center gap-2">
          <Hash className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
          <span className="font-mono text-xs text-purple-700 dark:text-purple-300 font-bold select-all truncate">
            {mainHash}
          </span>
        </div>
      </div>

      {/* Grid: Sub-Runtime Hashes */}
      <div className="space-y-3">
        <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500">
          Chaves Criptográficas de Runtime e Integridade
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {Object.entries(runtimeHashes).map(([runtimeName, hashVal]) => (
            <div key={runtimeName} className="p-3 bg-slate-100/50 dark:bg-zinc-950/40 border border-slate-200 dark:border-zinc-900 rounded-xl flex flex-col gap-1 shadow-xs">
              <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                Runtime {runtimeName}
              </span>
              <div className="flex items-center gap-1.5 min-w-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-450 dark:text-zinc-500 shrink-0" />
                <span className="font-mono text-[10px] text-slate-700 dark:text-zinc-300 truncate select-all">
                  {hashVal}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Propagation / Evidence hashes */}
      {propagationHashes.length > 0 && (
        <div className="space-y-2">
          <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500">
            Cadeia de Evidência e Propagação de Dados
          </span>
          <div className="p-3 bg-slate-100/60 dark:bg-zinc-950/50 border border-slate-200 dark:border-zinc-900 rounded-xl space-y-1.5 font-mono text-[9px] text-slate-600 dark:text-zinc-400 shadow-xs">
            {propagationHashes.map((propHash, idx) => (
              <div key={idx} className="flex items-center gap-2 py-0.5 border-b border-slate-200 dark:border-white/5 last:border-b-0">
                <span className="text-slate-400 dark:text-zinc-600 font-bold">[{idx + 1}]</span>
                <span className="truncate select-all">{propHash}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Disclosure / Auditable Footnote set */}
      {activeDisclosures.length > 0 && (
        <div className="space-y-3.5 pt-4 border-t border-slate-200 dark:border-white/5">
          <span className="block text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500">
            Divulgações Fiduciárias & Ressalvas de Auditoria
          </span>
          <div className="space-y-3">
            {activeDisclosures.map((disc, idx) => {
              const badgeColors = disc.severity === 'CRITICAL' || disc.severity === 'RESTRICTED'
                ? 'bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20'
                : disc.severity === 'ELEVATED' || disc.severity === 'HIGH'
                ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20'
                : 'bg-slate-100 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-500/20';

              return (
                <div key={idx} className="p-4 bg-slate-100/80 dark:bg-zinc-950/60 border border-slate-200 dark:border-zinc-900 rounded-2xl space-y-2 flex flex-col justify-between shadow-xs">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-slate-550 dark:text-zinc-500" />
                      <span className="text-[10px] font-bold text-slate-700 dark:text-zinc-300 font-mono">
                        {disc.disclosureId}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[8px] font-mono bg-slate-200/50 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 px-1.5 py-0.5 rounded border border-slate-200 dark:border-zinc-800">
                        {disc.sourceRuntime}
                      </span>
                      <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${badgeColors}`}>
                        {disc.severity}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-slate-700 dark:text-zinc-300 leading-snug">
                    {disc.message}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
