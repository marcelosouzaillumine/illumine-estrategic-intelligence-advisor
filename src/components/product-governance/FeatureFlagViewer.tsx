import React from 'react';
import { FeatureFlagRegistry } from '../../core/runtime/product-governance/FeatureFlagRegistry';
import { ToggleRight, ToggleLeft } from 'lucide-react';

export function FeatureFlagViewer() {
  const flags = FeatureFlagRegistry.getAllFlags();

  return (
    <div className="bg-surface-container border border-border rounded-lg p-6">
      <h3 className="text-sm font-semibold text-foreground mb-4">Feature Flags (Runtime)</h3>
      <div className="space-y-3">
        {flags.map(flag => (
          <div key={flag.flagId} className="flex items-center justify-between p-3 border border-border/50 rounded bg-background">
            <div>
              <div className="text-sm font-medium text-foreground">{flag.flagId}</div>
              <div className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest mt-1">
                Audience: {flag.audience}
              </div>
            </div>
            {flag.isEnabled ? (
              <ToggleRight className="text-emerald-500" size={24} />
            ) : (
              <ToggleLeft className="text-muted-foreground" size={24} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
