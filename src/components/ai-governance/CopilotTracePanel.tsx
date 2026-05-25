import React from 'react';
import { Fingerprint } from 'lucide-react';

export function CopilotTracePanel({ traceId, riskLevel }: { traceId: string; riskLevel: string }) {
  return (
    <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50 text-[10px] text-muted-foreground">
      <div className="flex items-center gap-1 font-mono">
        <Fingerprint size={10} />
        {traceId}
      </div>
      <div>
        Risk: <span className="font-semibold">{riskLevel}</span>
      </div>
    </div>
  );
}
