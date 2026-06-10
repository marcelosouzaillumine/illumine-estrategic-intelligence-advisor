import React from 'react';
import { useTenancy } from '../../context/TenancyProvider';
import { WorkspaceSwitcher } from '../tenancy/WorkspaceSwitcher';
import { BriefcaseBusiness, Activity, ShieldCheck, AlertTriangle, Loader2 } from 'lucide-react';
import { PageHeader } from '../Common';
import { cn } from '../../lib/utils';

export function AdvisorCockpitPage() {
  const { context, permissions, isTenantResolved } = useTenancy();

  if (!isTenantResolved || !context) {
    return (
      <div className="flex items-center justify-center min-h-[400px] gap-3 text-muted-foreground">
        <Loader2 size={20} className="animate-spin" />
        <span className="text-body-sm font-medium uppercase tracking-widest">Resolvendo Contexto Tenant...</span>
      </div>
    );
  }

  const statusCards = [
    {
      icon: ShieldCheck,
      iconColor: 'text-success',
      iconBg: 'bg-success-soft',
      title: 'Status Institucional',
      subtitle: `Grupo: ${context.activeGroupId}`,
      value: 'Compliance Adequado',
      valueColor: 'text-success',
    },
    {
      icon: Activity,
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      title: 'Health Score do Grupo',
      subtitle: 'Última consolidação: 2h atrás',
      value: 'A-',
      valueColor: 'text-foreground',
    },
    {
      icon: AlertTriangle,
      iconColor: 'text-warning',
      iconBg: 'bg-warning-soft',
      title: 'Alertas de Risco',
      subtitle: '1 Risco Sistêmico detectado',
      value: '1',
      valueColor: 'text-warning',
    },
  ];

  return (
    <div className="max-w-[1440px] mx-auto px-6 lg:px-10 space-y-12 pb-32 animate-executive-fade">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <PageHeader
          title="Advisor Cockpit"
          subtitle={`Gestão Multi-Cliente Isolada. Tenant: ${context.activeTenantId}`}
          icon={BriefcaseBusiness}
          transparent
        />
        <WorkspaceSwitcher />
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statusCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="card-premium p-8 space-y-4">
              <div className="flex items-center gap-4">
                <div className={cn('w-10 h-10 rounded-md flex items-center justify-center', card.iconBg, card.iconColor)}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{card.title}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">{card.subtitle}</p>
                </div>
              </div>
              <p className={cn('text-h3 font-medium tracking-tight', card.valueColor)}>{card.value}</p>
            </div>
          );
        })}
      </div>

      {/* ACL Actions */}
      <div className="card-premium p-8 space-y-6">
        <div>
          <h3 className="text-h3 font-medium text-foreground tracking-tight">Ações Disponíveis</h3>
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-widest mt-1">Controle de Acesso por Permissão (ACL)</p>
        </div>
        <div className="flex gap-4 flex-wrap">
          <button
            disabled={!permissions?.canRunScenario}
            className={cn(
              'flex items-center gap-2 px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] rounded-button transition-all',
              permissions?.canRunScenario
                ? 'btn-executive'
                : 'bg-surface-container text-muted-foreground border border-border cursor-not-allowed opacity-50'
            )}
          >
            Laboratório de Cenários
          </button>
          <button
            disabled={!permissions?.canViewReports}
            className={cn(
              'flex items-center gap-2 px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] rounded-button transition-all border',
              permissions?.canViewReports
                ? 'border-secondary text-secondary hover:bg-secondary hover:text-primary-foreground'
                : 'bg-surface-container text-muted-foreground border-border cursor-not-allowed opacity-50'
            )}
          >
            Emitir Board Pack
          </button>
        </div>
      </div>
    </div>
  );
}
