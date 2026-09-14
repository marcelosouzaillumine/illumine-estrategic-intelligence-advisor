import React from 'react';
import { AlertTriangle } from 'lucide-react';

export function CopilotPolicyWarning({ reason }: { reason: string }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-critical-soft0/10 border border-rose-500/20 rounded-lg text-rose-500 mt-2">
      <AlertTriangle className="shrink-0 mt-0.5" size={16} />
      <div className="text-sm">
        <strong className="block mb-1">Ação Bloqueada por Política Institucional</strong>
        {reason}
      </div>
    </div>
  );
}
