import React from 'react';
import { ShieldCheck, ShieldAlert } from 'lucide-react';
import { AIGroundingReference } from '../../core/runtime/ai-governance/AIGovernanceTypes';

export function CopilotGroundingBadge({ references }: { references: AIGroundingReference[] }) {
  if (references.length === 0) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-rose-500/10 text-rose-500 border border-rose-500/20">
        <ShieldAlert size={12} /> Não Baseado
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
      <ShieldCheck size={12} /> {references.length} Fonte{references.length > 1 ? 's' : ''} Institucional
    </span>
  );
}
