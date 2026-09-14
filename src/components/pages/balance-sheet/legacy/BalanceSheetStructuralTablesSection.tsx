import React from 'react';
import { Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '../../../../lib/utils';
import { BalanceSheetStructuralTablesViewModel } from '../view-models';
import { ExecutiveSurface } from '../../../ui/executive-surface';
import { ExecutiveHeading } from '../../../ui/executive-heading';
import { ExecutiveText } from '../../../ui/executive-typography';
import { ExecutiveBadge } from '../../../ui/executive-badge';

export function BalanceSheetStructuralTablesSection({
  viewModel
}: {
  viewModel: any;
}) {
  const isArray = Array.isArray(viewModel);
  const isEmpty = isArray ? viewModel.length === 0 : (viewModel?.isEmpty ?? true);
  const sections = isArray ? viewModel : (viewModel?.sections ?? []);
  
  return (
    <div>
      <div className="flex items-start justify-between px-2 mb-4">
        <div>
          <ExecutiveHeading as="h3" variant="moduleTitle">Análise Estrutural do Balanço</ExecutiveHeading>
          <div className="text-executive-secondary">Detalhamento de Contas e Participação (AV/AH)</div>
        </div>
        <div className="flex gap-4">
           <ExecutiveSurface padding="none" variant="default" elevation="sm" className="flex items-center h-8 gap-2 px-3 rounded-full">
             <span className="w-1.5 h-1.5 rounded-full bg-primary" />
             <ExecutiveText as="span" variant="microLabel" className="text-executive-secondary">AV: Análise Vertical</ExecutiveText>
           </ExecutiveSurface>
           <ExecutiveSurface padding="none" variant="default" elevation="sm" className="flex items-center h-8 gap-2 px-3 rounded-full">
             <span className="w-1.5 h-1.5 rounded-full bg-success" />
             <ExecutiveText as="span" variant="microLabel" className="text-executive-secondary">AH: Análise Horizontal</ExecutiveText>
           </ExecutiveSurface>
        </div>
      </div>

      {isEmpty ? (
        <ExecutiveSurface padding="none" className="flex flex-col items-center justify-center py-24 rounded-[40px] border-dashed border-border shadow-sm">
          <div className="w-16 h-16 bg-surface-container/30 rounded-full flex items-center justify-center mb-4">
            <Calendar size={28} className="text-muted-foreground" />
          </div>
          <ExecutiveText as="p" variant="bodyStandard" className="text-executive-secondary">Sem dados para análise</ExecutiveText>
          <p className="text-executive-secondary">
            Nenhum dado estrutural encontrado para análise.
          </p>
        </ExecutiveSurface>
      ) : (
        <div className="space-y-8">
          {sections.filter((s: any) => s && Array.isArray(s.rows)).map((section: any, idx: number) => {
            const colorTheme = section.tone === 'assets' ? 'emerald' : section.tone === 'liabilities' ? 'blue' : 'primary';
            const badgeVariant = section.tone === 'assets' ? 'success' : section.tone === 'liabilities' ? 'info' : 'neutral';
            return (
            <ExecutiveSurface padding="none" key={idx} className="rounded-[32px] overflow-hidden group">
              <div className={cn("px-6 py-5 border-b flex items-start justify-between bg-surface-container/30", `border-${colorTheme}-100/50`)}>
                <div className="flex items-start gap-3">
                  <div className={cn("w-2 h-6 rounded-full", `bg-${colorTheme}-500`)} />
                  <ExecutiveHeading as="h4" variant="submoduleTitle">{section.titleLabel}</ExecutiveHeading>
                </div>
                <ExecutiveBadge variant={badgeVariant}>
                  Detalhamento Estrutural
                </ExecutiveBadge>
              </div>
              
              <div className="p-2">
                <ExecutiveText as="div" variant="microLabel" className="flex items-center px-4 py-3 border-b border-border text-executive-secondary">
                  <div className="flex-1">Conta Contábil</div>
                  <div className="w-32 text-right">Saldo (R$)</div>
                  <div className="w-24 text-right">AV (%)</div>
                  <div className="w-28 text-right">AH (%)</div>
                </ExecutiveText>
                
                <div className="space-y-1 mt-2">
                  {section.rows.map((row, i) => {
                    return (
                    <div key={i} className={cn(
                      "flex items-center px-4 py-2.5 rounded-2xl transition-all duration-200 hover:bg-surface-container/30",
                      row.level === 1 ? "bg-surface-container/30/50" : ""
                    )}>
                      <div className="flex-1 flex items-center pr-4">
                        <ExecutiveText
                          as="span"
                          variant={row.level === 1 ? "bodyStrong" : "bodyStandard"} 
                          className="truncate"
                          style={{ paddingLeft: row.level > 1 ? `${(row.level - 1) * 16}px` : '0px' }}
                        >
                          {row.level > 1 && (
                            <span className="inline-block w-3 h-[1px] bg-foreground/20 mr-2.5 align-middle" />
                          )}
                          {row.label}
                        </ExecutiveText>
                      </div>
                      
                      <div className="w-32 text-right">
                        <ExecutiveText
                          as="span"
                          variant={row.level === 1 ? "bodyStrong" : "bodyStandard"}
                          className="tabular-nums"
                        >
                          {row.valueFormatted}
                        </ExecutiveText>
                      </div>
                      
                      <div className="w-24 text-right flex items-center justify-end">
                        <ExecutiveText as="span" variant="microLabel" className={cn(
                          "inline-flex items-center justify-center px-2 py-0.5 rounded-[6px] tabular-nums border",
                          "bg-surface-container/50 text-executive-secondary border-border"
                        )}>
                          {row.verticalAnalysis !== null && row.verticalAnalysis !== undefined ? (`${Math.min(row.verticalAnalysis, 100).toFixed(2)}%`) : (
                            <ExecutiveText as="span" variant="microLabel" className="text-executive-secondary tabular-nums">-</ExecutiveText>
                          )}
                        </ExecutiveText>
                      </div>
                      
                      <div className="w-28 text-right flex items-center justify-end">
                        {(row.horizontalAnalysis ?? 0) !== 0 && row.horizontalAnalysis !== null && row.horizontalAnalysis !== undefined ? (
                          <ExecutiveText as="span" variant="microLabel" className={cn(
                            "inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-[6px] tabular-nums border",
                            row.horizontalAnalysis > 0 ? "bg-success-soft text-success border-success/20" : row.horizontalAnalysis < 0 ? "bg-critical-soft text-critical border-critical/20" : "bg-surface-container/30 text-executive-secondary border-border"
                          )}>
                            {row.horizontalAnalysis > 0 ? <TrendingUp size={10} strokeWidth={3} /> : <TrendingDown size={10} strokeWidth={3} />}
                            {Math.abs(row.horizontalAnalysis).toFixed(2)}%
                          </ExecutiveText>
                        ) : (
                           <ExecutiveText as="span" variant="caption" className="inline-flex items-center justify-center px-2 py-0.5 text-executive-secondary">
                             —
                           </ExecutiveText>
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
