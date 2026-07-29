import React from 'react';
import { Activity, Lock, TrendingUp, Users, DollarSign, Layers, Target, BarChart2 } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { ExecutivePerspectiveViewData, ExecutiveIconKey } from '../view-models/ExecutivePerspectiveViewData';

interface ExecutiveActionMatrixProps {
  actionMatrix: ExecutivePerspectiveViewData['actionMatrix'];
}

function renderIcon(iconKey: ExecutiveIconKey, size: number) {
  switch (iconKey) {
    case 'trending-up': return <TrendingUp size={size} />;
    case 'users': return <Users size={size} />;
    case 'dollar-sign': return <DollarSign size={size} />;
    case 'layers': return <Layers size={size} />;
    case 'target': return <Target size={size} />;
    case 'bar-chart': return <BarChart2 size={size} />;
    default: return <Activity size={size} />;
  }
}

export function ExecutiveActionMatrix({ actionMatrix }: ExecutiveActionMatrixProps) {
  if (actionMatrix.length === 0) {
    return (
      <div className="mb-12 p-8 bg-slate-50 rounded-[32px] border border-dashed border-border text-center relative overflow-hidden">
        <div className="absolute -left-10 -top-10 w-40 h-40 bg-slate-100 rounded-full blur-2xl opacity-50" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="p-4 rounded-full bg-slate-100 text-muted-foreground mb-3 border border-border">
            <Lock size={24} strokeWidth={2} />
          </div>
          <h5 className="text-xs font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Matriz de Ação Executiva Bloqueada</h5>
          <p className="text-[11px] text-muted-foreground font-medium leading-relaxed max-w-2xl mx-auto">
            Ausência de evidências fiduciárias suficientes ou dados incompletos para a geração de recomendações. Insira lançamentos válidos de balanço e DRE para liberar a matriz de ação executiva.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="flex items-center gap-3 mb-2">
        <Activity className="text-primary" size={20} />
        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Matriz de Ação Executiva</h4>
      </div>
      <p className="text-xs text-muted-foreground mb-6 ml-8">Plano de ação priorizado por área de gestão e impacto esperado.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {actionMatrix.map((action) => {
          return (
            <div key={action.id} className={cn(
              "rounded-2xl p-5 border hover:shadow-md transition-all group",
              action.managementArea.tone === 'success' ? 'bg-success-soft/60 border-emerald-200/70 hover:border-emerald-300' :
              action.managementArea.tone === 'info' ? 'bg-blue-50/60 border-blue-200/70 hover:border-blue-300' :
              action.managementArea.tone === 'attention' ? 'bg-primary-50/60 border-primary-200/70 hover:border-primary-300' :
              action.managementArea.tone === 'warning' ? 'bg-warning-soft/60 border-amber-200/70 hover:border-amber-300' :
              action.managementArea.tone === 'critical' ? 'bg-critical-soft border-rose-200/70 hover:border-rose-300' :
              'bg-slate-50/60 border-border hover:border-border'
            )}>
              {/* Header: Área de Gestão */}
              <div className="flex items-center justify-between mb-3">
                <div className={cn(
                  "flex items-center gap-2 px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-widest", 
                  action.managementArea.tone === 'success' ? 'text-emerald-600 bg-success-soft border-emerald-200' :
                  action.managementArea.tone === 'info' ? 'text-blue-600 bg-blue-50 border-blue-200' :
                  action.managementArea.tone === 'attention' ? 'text-primary-600 bg-primary-50 border-primary-200' :
                  action.managementArea.tone === 'warning' ? 'text-amber-600 bg-warning-soft border-amber-200' :
                  action.managementArea.tone === 'critical' ? 'text-rose-600 bg-critical-soft border-rose-200' :
                  'text-muted-foreground bg-slate-50 border-border'
                )}>
                  {renderIcon(action.managementArea.icon, 11)}
                  {action.managementArea.label}
                </div>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-black border uppercase tracking-widest",
                  action.priority.tone === 'critical' ? 'bg-rose-100 text-rose-700 border-rose-200' :
                  action.priority.tone === 'warning' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                  'bg-emerald-100 text-emerald-700 border-emerald-200'
                )}>
                  {action.priority.label}
                </span>
              </div>

              {/* Ação Principal */}
              <p className="text-sm font-bold text-muted-foreground leading-snug mb-3 group-hover:text-muted-foreground transition-colors">
                {action.action}
              </p>

              {/* Metadados */}
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="px-2 py-1 bg-white/80 border border-border rounded-lg text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                  🕐 {action.timeline}
                </span>
              </div>

              {action.fiduciaryEvidence && (
                <div className="mt-4 pt-3 border-t border-border space-y-1 text-[10px] text-muted-foreground leading-relaxed">
                  <div><strong className="text-muted-foreground">Evidência:</strong> {action.fiduciaryEvidence}</div>
                  {action.expectedImpact && <div><strong className="text-muted-foreground">Impacto Esperado:</strong> {action.expectedImpact}</div>}
                  {action.executionRisk && <div><strong className="text-muted-foreground">Risco da Não Execução:</strong> {action.executionRisk}</div>}
                  {action.monitoringKpi && <div><strong className="text-muted-foreground">KPI de Sucesso:</strong> {action.monitoringKpi}</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
