import React from 'react';
import { Layers } from 'lucide-react';

export function OperationalSynchronizationViewer({ tenantId }: { tenantId: string }) {
  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Layers className="text-indigo-500" />
        <h3 className="text-sm font-semibold text-foreground">Operational Synchronization</h3>
      </div>
      <div className="p-4 border border-dashed border-border/50 rounded flex justify-center items-center h-32">
        <span className="text-muted-foreground text-sm">Synchronization Matrix</span>
      </div>
    </div>
  );
}
