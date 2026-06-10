import React from 'react';
import { ShieldAlert, ChevronDown } from 'lucide-react';
import { BalanceSheetAuditLayerViewModel } from './view-models';
import { cn } from '../../../lib/utils';

export function BalanceSheetAuditLayerSection({
  viewModel
}: {
  viewModel: BalanceSheetAuditLayerViewModel;
}) {
  const getConsistencyToneClasses = (tone: string) => {
    switch (tone) {
      case 'success':
        return 'bg-success-soft text-emerald-600 border-emerald-200';
      case 'critical':
        return 'bg-critical-soft text-rose-600 border-rose-200';
      case 'warning':
      default:
        return 'bg-warning-soft text-amber-600 border-amber-200';
    }
  };

  const getIssueToneClasses = (type: string) => {
    switch (type) {
      case 'critical':
        return {
          container: 'bg-critical-soft border-l-4 border-rose-500 rounded-r-lg',
          label: 'text-rose-400',
          text: 'text-rose-900'
        };
      case 'warning':
        return {
          container: 'bg-warning-soft border-l-4 border-amber-500 rounded-r-lg',
          label: 'text-amber-500',
          text: 'text-amber-900'
        };
      case 'disclosure':
        return {
          container: 'bg-primary border-l-4 border-primary rounded-r-lg',
          label: 'text-primary',
          text: 'text-primary'
        };
      default:
        return {
          container: 'bg-surface-container border-l-4 border-border rounded-r-lg',
          label: 'text-muted-foreground',
          text: 'text-primary'
        };
    }
  };

  return (
    <details className="group bg-card border border-border rounded-[32px] open:shadow-2xl open:shadow-slate-200/40 transition-all duration-500 mb-12 overflow-hidden">
      <summary className="flex items-center justify-between p-8 cursor-pointer list-none hover:bg-surface-container/30/50 transition-colors">
        <div className="flex items-center gap-3">
          <ShieldAlert size={20} className="text-muted-foreground group-open:text-primary transition-colors" />
          <h3 className="text-lg font-black text-primary group-open:text-primary">Restrições Fiduciárias Ativas</h3>
        </div>
        <ChevronDown size={20} className="text-muted-foreground group-open:rotate-180 transition-transform" />
      </summary>
      <div className="p-6 border-t border-border grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Structural Risks Overrides */}
        {viewModel.structuralRestrictions && (
          <div className="flex flex-col">
            <h4 className="text-sm font-black text-primary mb-4 border-b border-border pb-2">Restrições Estruturais e Tetos de Classificação</h4>
            <div className="space-y-3 flex-1">
              {viewModel.structuralRestrictions.overrides.map((override, idx) => (
                <div key={idx} className="border rounded-xl p-3 flex items-center justify-between bg-critical-soft/50 border-rose-200">
                  <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{override.overrideNameLabel}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-bold text-rose-500 border border-rose-200 bg-rose-100 px-2 py-0.5 rounded-full uppercase">
                      {override.severityLabel}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-rose-600">Em vigor</span>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-4 pt-4 border-t border-border flex items-center justify-between bg-surface-container/30 p-3 rounded-xl">
              <div className="text-center">
                <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground block mb-1">Score Matemático</span>
                <span className="text-sm font-black text-muted-foreground">{viewModel.structuralRestrictions.originalClassificationLabel}</span>
              </div>
              <div className="text-muted-foreground">→</div>
              <div className="text-center">
                <span className="text-[8px] font-black uppercase tracking-widest text-rose-500 block mb-1">Teto Aplicado</span>
                <span className="text-sm font-black text-rose-600">{viewModel.structuralRestrictions.classificationCeilingLabel}</span>
              </div>
            </div>
          </div>
        )}

        {/* Governance Consistency */}
        {viewModel.governanceConsistency && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
              <h4 className="text-sm font-black text-primary">Validação de Consistência Institucional</h4>
              <div className={cn("px-3 py-1 rounded-full border text-[9px] font-bold tracking-widest", getConsistencyToneClasses(viewModel.governanceConsistency.statusTone))}>
                Status: {viewModel.governanceConsistency.statusLabel}
              </div>
            </div>
            
            {viewModel.governanceConsistency.hasIssues ? (
              <div className="flex flex-col gap-2 overflow-y-auto max-h-[250px] pr-2">
                {viewModel.governanceConsistency.issues.map((issue, idx) => {
                  const tone = getIssueToneClasses(issue.type);
                  return (
                    <div key={idx} className={cn("p-3", tone.container)}>
                      <span className={cn("text-[9px] font-black uppercase tracking-widest block mb-0.5", tone.label)}>{issue.typeLabel}</span>
                      <span className={cn("text-[10px] font-bold leading-relaxed", tone.text)}>{issue.message}</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center p-4 bg-surface-container/30 border border-border rounded-xl text-center">
                <p className="text-secondary">Nenhuma inconsistência fiduciária detectada.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </details>
  );
}
