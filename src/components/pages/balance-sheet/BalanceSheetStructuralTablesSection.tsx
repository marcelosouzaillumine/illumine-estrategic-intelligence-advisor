import React from 'react';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { BalanceSheetStructuralTablesViewModel } from './view-models';
import { ExecutiveSurface } from '../../ui/executive-surface';

export function BalanceSheetStructuralTablesSection({
  viewModel
}: {
  viewModel: BalanceSheetStructuralTablesViewModel;
}) {
  return (
    <div>
      <div className="flex items-start justify-between px-2 mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Análise Estrutural do Balanço</h3>
          <div className="text-foreground/70">Detalhamento de Contas e Participação (AV/AH)</div>
        </div>
        <div className="flex gap-4">
           <ExecutiveSurface padding="none" variant="default" elevation="sm" className="flex items-center h-8 gap-2 px-3 rounded-full">
             <span className="w-1.5 h-1.5 rounded-full bg-primary" />
             <span className="text-[10px] font-medium text-foreground/70 uppercase tracking-wider">AV: Análise Vertical</span>
           </ExecutiveSurface>
           <ExecutiveSurface padding="none" variant="default" elevation="sm" className="flex items-center h-8 gap-2 px-3 rounded-full">
             <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
             <span className="text-[10px] font-medium text-foreground/70 uppercase tracking-wider">AH: Análise Horizontal</span>
           </ExecutiveSurface>
        </div>
      </div>

      {viewModel.isEmpty ? (
        <ExecutiveSurface padding="none" className="flex flex-col items-center justify-center py-24 rounded-[40px] border-dashed border-border shadow-sm">
          <div className="w-16 h-16 bg-surface-container/30 rounded-full flex items-center justify-center mb-4">
            <Calendar size={28} className="text-muted-foreground" />
          </div>
          <p className="text-foreground/70 font-semibold">Sem dados para análise</p>
          <p className="text-foreground/70">
            Nenhum dado estrutural encontrado para análise.
          </p>
        </ExecutiveSurface>
      ) : (
        <div className="space-y-8">
          {viewModel.sections.map((section, idx) => {
            const colorTheme = section.tone === 'assets' ? 'emerald' : section.tone === 'liabilities' ? 'blue' : 'primary';
            return (
            <ExecutiveSurface padding="none" key={idx} className="rounded-[32px] overflow-hidden group">
              <div className={cn("px-6 py-5 border-b flex items-start justify-between bg-surface-container/30/50", `border-${colorTheme}-100/50`)}>
                <div className="flex items-start gap-3">
                  <div className={cn("w-2 h-6 rounded-full", `bg-${colorTheme}-500`)} />
                  <h4 className="text-base font-bold text-foreground tracking-tight">{section.titleLabel}</h4>
                </div>
                <span className={cn("text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full", `bg-${colorTheme}-50 text-${colorTheme}-600`)}>
                  Detalhamento Estrutural
                </span>
              </div>
              
              <div className="p-2">
                <div className="flex items-start px-4 py-3 border-b border-border text-[9px] font-bold text-foreground/70 uppercase tracking-[0.2em]">
                  <div className="flex-1">Conta Contábil</div>
                  <div className="w-32 text-right">Saldo (R$)</div>
                  <div className="w-24 text-right">AV (%)</div>
                  <div className="w-28 text-right">AH (%)</div>
                </div>
                
                <div className="space-y-1 mt-2">
                  {section.rows.map((row, i) => {
                    return (
                    <div key={i} className={cn(
                      "flex items-start px-4 py-3 rounded-2xl transition-all duration-200 hover:bg-surface-container/30",
                      row.level === 1 ? "bg-surface-container/30/50" : ""
                    )}>
                      <div className="flex-1 flex items-start">
                        <span 
                          className={cn(
                            "text-xs block truncate pr-4", 
                            row.level === 1 ? "font-bold text-foreground" : "font-semibold text-foreground/70"
                          )}
                          style={{ paddingLeft: row.level > 1 ? `${(row.level - 1) * 16}px` : '0px' }}
                        >
                          {row.level > 1 && (
                            <span className="inline-block w-3 h-[1px] bg-surface-container mr-2 align-middle opacity-50" />
                          )}
                          {row.label}
                        </span>
                      </div>
                      
                      <div className="w-32 text-right font-display text-sm font-bold text-foreground tabular-nums pt-[2px]">
                        {row.valueFormatted}
                      </div>
                      
                      <div className="w-24 text-right flex flex-col items-end justify-start">
                        <span className={cn(
                          "inline-flex items-start justify-center px-2 py-1 rounded-lg text-[10px] font-bold tabular-nums border",
                          (row.verticalAnalysis ?? 0) > 100 ? "bg-critical-soft text-rose-600 border-rose-200" : "bg-surface-container/50 text-foreground/70 border-border"
                        )}>
                          {row.verticalAnalysis !== null && row.verticalAnalysis !== undefined ? (row.verticalAnalysis > 100 ? '> 100%' : `${row.verticalAnalysis.toFixed(2)}%`) : (
                            <span className="text-[10px] font-bold text-foreground/70 tabular-nums uppercase tracking-widest">-</span>
                          )}
                        </span>
                      </div>
                      
                      <div className="w-28 text-right flex justify-end items-start">
                        {(row.horizontalAnalysis ?? 0) !== 0 && row.horizontalAnalysis !== null && row.horizontalAnalysis !== undefined ? (
                          <span className={cn(
                            "inline-flex items-center justify-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold tabular-nums border",
                            row.horizontalAnalysis > 0 ? "bg-success-soft text-emerald-600 border-emerald-100" : row.horizontalAnalysis < 0 ? "bg-critical-soft text-rose-600 border-rose-100" : "bg-surface-container/30 text-foreground/70 border-border"
                          )}>
                            {row.horizontalAnalysis > 0 ? <TrendingUp size={10} strokeWidth={3} /> : <TrendingDown size={10} strokeWidth={3} />}
                            {Math.abs(row.horizontalAnalysis).toFixed(2)}%
                          </span>
                        ) : (
                           <span className="inline-flex items-start justify-center px-2 py-1 text-foreground/70 text-[10px] font-bold">
                             —
                           </span>
                        )}
                      </div>
                     </div>
                    );
                  })}
                </div>
              </div>
            </ExecutiveSurface>
            );
          })}
        </div>
      )}
    </div>
  );
}
