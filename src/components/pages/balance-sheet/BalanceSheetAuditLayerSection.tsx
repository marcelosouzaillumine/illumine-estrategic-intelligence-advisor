import React from 'react';
import { ShieldAlert, ChevronDown } from 'lucide-react';
import { BalanceSheetAuditLayerViewModel } from './view-models';
import { cn } from '../../../lib/utils';
import { ExecutiveRestrictionRow } from '../../ui/executive-restriction-row';

export function BalanceSheetAuditLayerSection({
  viewModel
}: {
  viewModel: BalanceSheetAuditLayerViewModel;
}) {
  // Tone helpers removed in favor of canonical components and inline neutral styles

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 content-start">
              {viewModel.structuralRestrictions.overrides.map((override, idx) => {
                const s = override.severityLabel.toLowerCase();
                const severity = s.includes('crítico') || s.includes('critical') ? 'critical' : s.includes('alta') ? 'warning' : 'attention';
                return (
                  <ExecutiveRestrictionRow
                    key={idx}
                    title={override.overrideNameLabel}
                    severity={severity}
                    status="Em vigor"
                  />
                );
              })}
            </div>
            
            <div className="mt-6 pt-6 border-t border-border flex flex-col gap-4">
              <div className="flex items-center justify-between bg-surface-container/30 p-4 rounded-2xl border border-border">
                <div className="flex flex-col">
                  <span className="text-[10px] font-medium text-foreground/50 mb-1">Score Original</span>
                  <span className="text-[14px] font-semibold text-foreground/70">{viewModel.structuralRestrictions.originalClassificationLabel}</span>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center px-4">
                  <span className="text-[9px] font-medium text-foreground/40 mb-1 uppercase tracking-widest">Teto Aplicado</span>
                  <div className="w-full flex items-center">
                    <div className="h-px bg-border/60 flex-1"></div>
                    <div className="text-border/60 ml-1 text-[10px]">▶</div>
                  </div>
                </div>
                
                <div className="flex flex-col text-right">
                  <span className="text-[10px] font-medium text-foreground/50 mb-1">Resultado Final</span>
                  <span className="text-[14px] font-bold text-foreground">{viewModel.structuralRestrictions.classificationCeilingLabel}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Governance Consistency */}
        {viewModel.governanceConsistency && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between border-b border-border pb-2 mb-4">
              <h4 className="text-sm font-black text-primary">Validação de Consistência Institucional</h4>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-foreground/65">Status</span>
                <span className={cn(
                  "px-2 py-0.5 rounded-sm border text-[11px] font-medium",
                  viewModel.governanceConsistency.statusTone === 'success' 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                    : viewModel.governanceConsistency.statusTone === 'critical'
                    ? "bg-rose-50 text-rose-700 border-rose-200"
                    : "bg-amber-50 text-amber-700 border-amber-200"
                )}>
                  {viewModel.governanceConsistency.statusLabel}
                </span>
              </div>
            </div>
            
            {viewModel.governanceConsistency.hasIssues ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 overflow-y-auto max-h-[300px] pr-2 content-start">
                {viewModel.governanceConsistency.issues.map((issue, idx) => {
                  let severity: "critical" | "warning" | "attention" | "info" = "info";
                  if (issue.type === 'critical') severity = 'critical';
                  else if (issue.type === 'warning') severity = 'warning';
                  else if (issue.type === 'disclosure') severity = 'attention';
                  
                  // Extract specific title if message follows "Title: Description" format
                  let title = issue.typeLabel;
                  let description = issue.message;
                  
                  const colonIndex = issue.message.indexOf(':');
                  if (colonIndex > 0 && colonIndex < 80) {
                    title = issue.message.substring(0, colonIndex).trim();
                    description = issue.message.substring(colonIndex + 1).trim();
                  }
                  
                  return (
                    <ExecutiveRestrictionRow
                      key={idx}
                      title={title}
                      severity={severity}
                      description={description}
                    />
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
