import React from 'react';
import { Lock } from 'lucide-react';

export function PrivacyProtectionBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-bold uppercase" title="O BenchmarkPrivacyGuard assegura que nenhum dado identificável vazou para este painel.">
      <Lock size={12} /> Privacy Preserved
    </span>
  );
}
