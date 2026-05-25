import React from 'react';
import { ShieldCheck, Activity, Users, Database } from 'lucide-react';

export function TenantGovernancePage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in bg-background min-h-screen">
      <div>
        <h1 className="text-2xl font-semibold text-foreground flex items-center gap-2">
          <ShieldCheck className="text-primary" />
          Governança Multi-Tenant
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Visão de Master Admin: Rastreabilidade Cross-Tenant, Isolamento Fiduciário e Permissões.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <div className="p-4 bg-surface-container border border-border rounded-xl">
          <div className="text-muted-foreground text-xs mb-1 flex items-center gap-1"><Database size={12}/> Tenants Ativos</div>
          <div className="text-2xl font-bold text-foreground">1</div>
        </div>
        <div className="p-4 bg-surface-container border border-border rounded-xl">
          <div className="text-muted-foreground text-xs mb-1 flex items-center gap-1"><Users size={12}/> Workspaces Operacionais</div>
          <div className="text-2xl font-bold text-foreground">2</div>
        </div>
        <div className="p-4 bg-surface-container border border-border rounded-xl">
          <div className="text-muted-foreground text-xs mb-1 flex items-center gap-1"><Activity size={12}/> Execuções Rastreadas</div>
          <div className="text-2xl font-bold text-foreground">1.042</div>
        </div>
        <div className="p-4 bg-surface-container border border-border rounded-xl">
          <div className="text-muted-foreground text-xs mb-1 flex items-center gap-1"><ShieldCheck size={12}/> Leakage Detectado</div>
          <div className="text-2xl font-bold text-green-500">0</div>
        </div>
      </div>

      <div className="bg-surface-container border border-border rounded-xl p-6 mt-8">
        <h2 className="text-lg font-medium text-foreground mb-4 border-b border-border pb-2">Tenant Audit Timeline (Log de Acesso)</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-4 text-sm">
            <span className="text-xs text-muted-foreground font-mono w-24">12:45:00</span>
            <span className="bg-secondary/10 text-secondary px-2 py-0.5 rounded text-xs font-bold">SWITCH_WORKSPACE</span>
            <span className="text-foreground">Advisory Team alterou workspace para <strong>WS-DEMO-02</strong>. Cache local invalidado.</span>
          </div>
          <div className="flex items-start gap-4 text-sm">
            <span className="text-xs text-muted-foreground font-mono w-24">12:30:15</span>
            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold">LOGIN</span>
            <span className="text-foreground">Master Admin acessou Tenant <strong>TENANT-ILLUMINE-HQ</strong>.</span>
          </div>
        </div>
      </div>

    </div>
  );
}
