import React from 'react';
import { ShieldOff, Lock, AlertOctagon } from 'lucide-react';

interface FiduciaryRestrictionOverlayProps {
  activeFiduciaryLocks: string[];
  blockedActions: string[];
  survivalTriggersActive: string[];
  consolidatedSeverity: string;
  failClosedTriggered: boolean;
}

const lockLabels: Record<string, { label: string; severity: 'CRITICAL' | 'HIGH' | 'MODERATE' }> = {
  DIVIDEND_BLOCKED: { label: 'Distribuição de Dividendos Bloqueada', severity: 'CRITICAL' },
  AGGRESSIVE_CAPEX_BLOCKED: { label: 'Capex Agressivo Bloqueado', severity: 'CRITICAL' },
  SHAREHOLDER_EXTRACTION_BLOCKED: { label: 'Extração Societária Bloqueada', severity: 'CRITICAL' },
  EXPANSION_LOCK: { label: 'Expansão Congelada', severity: 'HIGH' },
  SURVIVAL_MODE_ACTIVE: { label: 'Modo de Sobrevivência Ativo', severity: 'CRITICAL' },
  ALL_NON_ESSENTIAL_FROZEN: { label: 'Todas Operações Não-Essenciais Congeladas', severity: 'CRITICAL' },
  FAIL_CLOSED_LOCK: { label: 'Bloqueio Fail-Closed Ativo', severity: 'CRITICAL' }
};

export function FiduciaryRestrictionOverlay({
  activeFiduciaryLocks,
  blockedActions,
  survivalTriggersActive,
  consolidatedSeverity,
  failClosedTriggered
}: FiduciaryRestrictionOverlayProps) {

  const allLocks = [...new Set([...activeFiduciaryLocks, ...blockedActions])];
  const isCritical = consolidatedSeverity === 'CRÍTICA' || consolidatedSeverity === 'CRITICAL' || failClosedTriggered;
  const hasLocks = allLocks.length > 0 || survivalTriggersActive.length > 0;

  if (!hasLocks && !failClosedTriggered) {
    return (
      <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg w-full font-mono">
        <h3 className="text-zinc-400 text-xs font-semibold tracking-wider uppercase mb-4 flex items-center gap-2">
          <Lock size={14} />
          Fiduciary Restriction Overlay
        </h3>
        <div className="text-center py-6">
          <p className="text-zinc-600 text-xs">No active fiduciary restrictions.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`border p-6 rounded-lg w-full font-mono ${
      isCritical 
        ? 'bg-red-950/30 border-red-900/60' 
        : 'bg-zinc-950 border-zinc-800'
    }`}>
      <h3 className={`text-xs font-semibold tracking-wider uppercase mb-4 flex items-center gap-2 ${
        isCritical ? 'text-red-400' : 'text-zinc-400'
      }`}>
        {isCritical ? <AlertOctagon size={14} /> : <Lock size={14} />}
        Fiduciary Restriction Overlay
        {isCritical && (
          <span className="ml-auto text-[9px] px-2 py-0.5 bg-red-900/60 border border-red-800 rounded text-red-300 uppercase">
            Critical
          </span>
        )}
      </h3>

      {/* Active Locks */}
      <div className="space-y-2 mb-4">
        {allLocks.map((lock, idx) => {
          const info = lockLabels[lock] || { label: lock.replace(/_/g, ' '), severity: 'MODERATE' as const };
          const sevColor = info.severity === 'CRITICAL' 
            ? 'border-red-800 bg-red-950/50 text-red-300' 
            : info.severity === 'HIGH'
            ? 'border-orange-800 bg-orange-950/50 text-orange-300'
            : 'border-yellow-800 bg-yellow-950/50 text-yellow-300';

          return (
            <div key={idx} className={`flex items-center gap-3 p-3 border rounded ${sevColor}`}>
              <ShieldOff size={14} className="shrink-0" />
              <div className="flex-1">
                <p className="text-xs font-bold">{info.label}</p>
                <p className="text-[10px] opacity-60 mt-0.5 font-mono">{lock}</p>
              </div>
              <span className={`text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                info.severity === 'CRITICAL' ? 'border-red-700 text-red-400' : 
                info.severity === 'HIGH' ? 'border-orange-700 text-orange-400' :
                'border-yellow-700 text-yellow-400'
              }`}>
                {info.severity}
              </span>
            </div>
          );
        })}
      </div>

      {/* Survival Triggers */}
      {survivalTriggersActive.length > 0 && (
        <div className="border-t border-zinc-800 pt-3">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2">Survival Triggers Active</p>
          <div className="flex flex-wrap gap-1.5">
            {survivalTriggersActive.map((trigger, idx) => (
              <span 
                key={idx} 
                className="text-[10px] px-2 py-1 bg-red-950/40 border border-red-900/50 rounded text-red-400 font-mono"
              >
                {trigger}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Fail-closed Banner */}
      {failClosedTriggered && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-800/60 rounded">
          <p className="text-[10px] text-red-400 font-bold uppercase tracking-widest">⚠ Bloqueio Prudencial</p>
          <p className="text-[10px] text-red-300/70 mt-1">
            Inferências preditivas otimistas, selos de antifragilidade e autorizações de expansão estrutural estão suspensos enquanto a linhagem histórica for insuficiente.
          </p>
        </div>
      )}
    </div>
  );
}
