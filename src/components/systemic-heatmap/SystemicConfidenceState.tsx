import React from 'react';
import { ShieldAlert, Info } from 'lucide-react';
import { StressPropagationConfidence } from '../../services/FiduciaryRuntimeAdapter';
import { cn } from '../../lib/utils';

export function SystemicConfidenceState({ level }: { level: StressPropagationConfidence | 'EXACT_MATCH' }) {
  const confValue = level;
  if (confValue === 'LOW_CONFIDENCE_PROPAGATION') {
    return (
      <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-rose-500 text-sm font-medium">
        <ShieldAlert size={16} />
        Mapa sistêmico com baixa confiança: dependências ou dados insuficientes.
      </div>
    );
  }

  if (confValue === 'UNVERIFIED_DEPENDENCY') {
    return (
      <div className="flex items-center gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-500 text-sm font-medium">
        <Info size={16} />
        Dependência não verificada: contágio bloqueado por governança.
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
      Confiança Sistêmica: {level}
    </div>
  );
}
