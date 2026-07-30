import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ShieldCheck, Activity, Clock, CheckCircle2 } from 'lucide-react';
import { IntegrationEventBusEngine } from '../../../../packages/intelligence/enterprise-data-integration-fabric/src/IntegrationEventBusEngine';

export const IntegrationTrustScoreCard: React.FC = () => {
  const trustData = IntegrationEventBusEngine.calculateIntegrationTrustScore();

  return (
    <ExecutiveSurface variant="default" padding="md" radius="lg" className="border border-border/40">

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <h3 className="font-semibold text-sm">Integration Trust Score (EDIF v1.0)</h3>
        </div>
        <ExecutiveBadge variant="success">Trust Score: {trustData.compositeTrustScore}</ExecutiveBadge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-2.5 rounded-lg bg-background/50 border border-border/30">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>Connector Health</span>
          </div>
          <span className="text-base font-bold text-foreground">{trustData.healthScore}%</span>
        </div>

        <div className="p-2.5 rounded-lg bg-background/50 border border-border/30">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Data Freshness</span>
          </div>
          <span className="text-base font-bold text-foreground">{trustData.freshnessScore}%</span>
        </div>

        <div className="p-2.5 rounded-lg bg-background/50 border border-border/30">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Domain Certification</span>
          </div>
          <span className="text-base font-bold text-foreground">{trustData.certificationScore}%</span>
        </div>
      </div>
    </ExecutiveSurface>
  );
};
