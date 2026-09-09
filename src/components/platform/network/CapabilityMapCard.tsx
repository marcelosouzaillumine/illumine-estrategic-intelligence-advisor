import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { Cpu, ShieldCheck, Activity } from 'lucide-react';
import { IntelligenceCapabilityRegistry } from '../../../../packages/intelligence/intelligence-network/src/IntelligenceCapabilityRegistry';

export const CapabilityMapCard: React.FC = () => {
  const capabilities = IntelligenceCapabilityRegistry.getRegisteredCapabilities();

  return (
    <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-border/40 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <h3 className="font-semibold text-sm">Registered Governance Capabilities Map</h3>
        </div>
        <ExecutiveBadge variant="success">Registry Active</ExecutiveBadge>
      </div>

      <div className="space-y-2 text-xs">
        {capabilities.map((cap) => (
          <div key={cap.capabilityId} className="p-2.5 rounded bg-background/50 border border-border/30 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground">{cap.name}</span>
                <span className="text-[10px] text-muted-foreground font-mono">v{cap.version}</span>
              </div>
              <p className="text-[11px] text-muted-foreground">Owner: {cap.owner} | Latency: {cap.expectedLatencyMs}ms</p>
            </div>
            <ExecutiveBadge variant="info">Score: {cap.confidenceScore}</ExecutiveBadge>
          </div>
        ))}
      </div>
    </ExecutiveSurface>
  );
};
