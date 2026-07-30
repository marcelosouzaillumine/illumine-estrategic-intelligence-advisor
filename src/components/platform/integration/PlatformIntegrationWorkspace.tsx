import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { IntegrationTrustScoreCard } from './IntegrationTrustScoreCard';
import { Database, Network, ShieldCheck, Layers, Cpu } from 'lucide-react';
import { SourceAdapterRegistryEngine } from '../../../../packages/intelligence/enterprise-data-integration-fabric/src/SourceAdapterRegistryEngine';

export interface PlatformIntegrationWorkspaceProps {
  readonly companyId?: string;
}

export const PlatformIntegrationWorkspace: React.FC<PlatformIntegrationWorkspaceProps> = ({
  companyId = 'empresa-demo'
}) => {
  const adapters = SourceAdapterRegistryEngine.getAvailableAdapters();

  return (
    <div className="w-full space-y-6">
      {/* 1. Platform Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-background/80 border border-border/60 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-foreground">Enterprise Data Integration Fabric</h1>
              <ExecutiveBadge variant="success">EDIF v1.0 Governed</ExecutiveBadge>
            </div>
            <p className="text-xs text-muted-foreground">Sistema circulatório de dados corporativos integrados, normalizados e submetidos a governança de domínio.</p>
          </div>
        </div>
      </div>

      {/* 2. Trust Score Observability Card */}
      <IntegrationTrustScoreCard />

      {/* 3. Adapters & Integration Mesh Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ExecutiveSurface variant="default" padding="md" radius="lg">

          <div className="flex items-center gap-2 mb-3">
            <Cpu className="w-4 h-4 text-blue-400" />
            <h3 className="font-semibold text-sm">Active Source Adapters</h3>
          </div>
          <div className="space-y-2">
            {adapters.map((adapter) => (
              <div key={adapter.adapterId} className="flex items-center justify-between p-2.5 rounded-md bg-background/50 border border-border/40 text-xs">
                <span className="font-medium text-foreground">{adapter.name}</span>
                <ExecutiveBadge variant="success">CONNECTED ({adapter.category})</ExecutiveBadge>
              </div>
            ))}
          </div>
        </ExecutiveSurface>

        <ExecutiveSurface variant="default" padding="md" radius="lg">

          <div className="flex items-center gap-2 mb-3">
            <Layers className="w-4 h-4 text-purple-400" />
            <h3 className="font-semibold text-sm">Fiduciary Integration Pipeline</h3>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-2 rounded bg-background/40 border border-border/30">
              <span className="font-bold text-emerald-400">Step 1:</span> Connector Framework (OAUTH2 mTLS)
            </div>
            <div className="p-2 rounded bg-background/40 border border-border/30">
              <span className="font-bold text-emerald-400">Step 2:</span> Raw Data Isolation Layer (Raw Landing Zone)
            </div>
            <div className="p-2 rounded bg-background/40 border border-border/30">
              <span className="font-bold text-emerald-400">Step 3:</span> Transformation & Canonical Normalization
            </div>
            <div className="p-2 rounded bg-background/40 border border-border/30">
              <span className="font-bold text-emerald-400">Step 4:</span> Domain Governance Boundary Certification
            </div>
          </div>
        </ExecutiveSurface>
      </div>

      {/* 4. Audit Trail & Composition Status */}
      <ExecutiveSurface variant="default" padding="md" radius="lg">

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>CertifiedEnterpriseDataset Composer active for {companyId}</span>
          </div>
          <span>Domain Governance Registry v1.0 Compliant</span>
        </div>
      </ExecutiveSurface>
    </div>
  );
};
