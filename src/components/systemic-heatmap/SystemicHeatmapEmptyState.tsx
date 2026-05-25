import React from 'react';
import { Network } from 'lucide-react';

export function SystemicHeatmapEmptyState() {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border rounded-xl bg-surface-container/50">
      <Network size={48} className="text-muted-foreground/30 mb-4" />
      <h3 className="text-lg font-medium text-foreground mb-2">Mapa sistêmico indisponível</h3>
      <p className="text-sm text-muted-foreground">runtime consolidado não executado.</p>
    </div>
  );
}
