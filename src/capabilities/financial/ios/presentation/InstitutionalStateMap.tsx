import React from 'react';
import { Map } from 'lucide-react';

export function InstitutionalStateMap({ tenantId }: { tenantId: string }) {
  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Map className="text-emerald-500" />
        <h3 className="text-sm font-semibold text-foreground">Institutional State Map</h3>
      </div>
      <div className="p-4 border border-dashed border-border/50 rounded flex justify-center items-center h-32">
        <span className="text-muted-foreground text-sm">Macro State Visualizer</span>
      </div>
    </div>
  );
}
