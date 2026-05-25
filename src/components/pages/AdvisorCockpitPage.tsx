import React from 'react';
import { useTenancy } from '../../context/TenancyProvider';
import { WorkspaceSwitcher } from '../tenancy/WorkspaceSwitcher';
import { BriefcaseBusiness, Activity, ShieldCheck, AlertTriangle } from 'lucide-react';

export function AdvisorCockpitPage() {
  const { context, permissions, isTenantResolved } = useTenancy();

  if (!isTenantResolved || !context) {
    return <div className="p-8">Resolving Tenant Context...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in bg-background min-h-screen">
      
      <div className="flex items-center justify-between border-b border-border pb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
            <BriefcaseBusiness className="text-primary" />
            Advisor Cockpit
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Gestão Multi-Cliente Isolada. Tenant: <span className="font-mono text-secondary">{context.activeTenantId}</span>
          </p>
        </div>
        <WorkspaceSwitcher />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-surface-container border border-border rounded-xl">
          <h3 className="font-medium flex items-center gap-2 text-sm mb-4"><ShieldCheck className="text-green-500" size={18}/> Status Institucional do Workspace</h3>
          <p className="text-xs text-muted-foreground mb-2">Grupo Operacional: {context.activeGroupId}</p>
          <div className="bg-background border border-border p-3 rounded text-sm text-foreground">
            Compliance Fiduciário: <strong>Adequado</strong>
          </div>
        </div>

        <div className="p-6 bg-surface-container border border-border rounded-xl">
          <h3 className="font-medium flex items-center gap-2 text-sm mb-4"><Activity className="text-primary" size={18}/> Health Score do Grupo</h3>
          <div className="text-3xl font-bold text-foreground">A-</div>
          <p className="text-xs text-muted-foreground mt-1">Última consolidação: 2h atrás</p>
        </div>

        <div className="p-6 bg-surface-container border border-amber-500/30 rounded-xl">
          <h3 className="font-medium flex items-center gap-2 text-sm mb-4"><AlertTriangle className="text-amber-500" size={18}/> Alertas de Risco</h3>
          <p className="text-sm text-foreground">1 Risco Sistêmico detectado na última varredura.</p>
          <button className="text-xs text-secondary underline mt-2">Ver Relatório Board Pack</button>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium text-foreground mb-4">Ações Disponíveis (ACL)</h3>
        <div className="flex gap-4">
          <button 
            disabled={!permissions?.canRunScenario}
            className={`px-4 py-2 rounded text-sm font-medium ${permissions?.canRunScenario ? 'bg-primary text-primary-foreground hover:bg-primary/90' : 'bg-neutral/20 text-muted-foreground cursor-not-allowed'}`}
          >
            Laboratório de Cenários
          </button>
          <button 
            disabled={!permissions?.canViewReports}
            className={`px-4 py-2 rounded text-sm font-medium ${permissions?.canViewReports ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90' : 'bg-neutral/20 text-muted-foreground cursor-not-allowed'}`}
          >
            Emitir Board Pack
          </button>
        </div>
      </div>

    </div>
  );
}
