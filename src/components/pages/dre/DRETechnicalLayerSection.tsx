import React, { useState } from 'react';
import { Database, TrendingUp, TrendingDown } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { cn, formatCurrency } from '../../../lib/utils';
import { DRETechnicalLayerViewModel } from './view-models';

interface Props {
  viewModel: DRETechnicalLayerViewModel;
}

export function DRETechnicalLayerSection({ viewModel }: Props) {
  const { translateLabel } = useLanguage();
  const [showTechnicalLayer, setShowTechnicalLayer] = useState(false);

  return (
    <div className="mb-10">
      <button 
        onClick={() => setShowTechnicalLayer(!showTechnicalLayer)}
        className="w-full bg-surface-container hover:bg-slate-200 transition-colors border border-border rounded-2xl p-4 flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center text-muted-foreground group-hover:text-muted-foreground transition-colors">
            <Database size={16} />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-black text-primary">Camada Técnica & KPIs</h4>
            <p className="text-secondary">Métricas Contábeis, Gráficos e Tabelas</p>
          </div>
        </div>
        <div className="text-muted-foreground font-bold text-xs uppercase tracking-wider flex items-center gap-2">
          {showTechnicalLayer ? 'Ocultar Detalhes' : 'Expandir Detalhes'}
          <div className={cn("transform transition-transform", showTechnicalLayer ? "rotate-180" : "rotate-0")}>
            ▼
          </div>
        </div>
      </button>

      {showTechnicalLayer && (
        <div className="mt-8 space-y-10 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-card border border-border rounded-[40px] shadow-sm overflow-hidden mb-10">
            <div className="px-6 py-5 border-b border-border bg-surface-container/30/50 flex items-center justify-between">
              <h4 className="text-sm font-black text-primary uppercase tracking-widest">{translateLabel('Detalhamento da DRE')}</h4>
              <span className="text-[9px] font-black uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-600">
                {translateLabel('Análise Horizontal e Vertical')}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-container/30/50 border-b border-border">
                    <th className="text-left py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{translateLabel('Conta')}</th>
                    <th className="text-right py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{translateLabel('Valor (R$)')}</th>
                    <th className="text-right py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{translateLabel('AV (%)')}</th>
                    <th className="text-right py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{translateLabel('AH (1 Ano)')}</th>
                    <th className="text-right py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{translateLabel('AH (2 Anos)')}</th>
                    <th className="text-right py-2.5 md:py-4 px-5 md:px-8 text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{translateLabel('AH (3 Anos)')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {viewModel.rows.length > 0 ? (
                    viewModel.rows.map((row, i) => (
                      <tr key={i} className={cn('hover:bg-surface-container/30 transition-colors group', row.isTotal ? 'bg-surface-container/30/30 font-bold' : '')}>
                        <td className="py-2.5 md:py-4 px-5 md:px-8">
                          <span
                            className={cn('block break-words overflow-visible', row.isTotal ? 'text-primary font-bold' : 'text-muted-foreground font-medium')}
                            style={{ paddingLeft: row.level > 1 ? `${(row.level - 1) * 20}px` : '0px' }}
                          >
                            {row.level > 1 && (
                              <span className="inline-block w-2 h-2 border-b border-l border-border mr-2 mb-0.5" />
                            )}
                            {row.label}
                          </span>
                        </td>
                        <td className={cn("py-2.5 md:py-4 px-5 md:px-8 text-right font-mono", row.val < 0 ? "text-rose-500" : "text-muted-foreground")}>
                          {formatCurrency(row.val)}
                        </td>
                        <td className="py-2.5 md:py-4 px-5 md:px-8 text-right font-bold text-muted-foreground text-xs">
                          {row.av.toFixed(2)}%
                        </td>
                        <td className={cn(
                          "py-2.5 md:py-4 px-5 md:px-8 text-right font-black text-xs",
                          row.ah1 === null ? "text-muted-foreground" : row.ah1 > 0 ? "text-emerald-500" : row.ah1 < 0 ? "text-rose-500" : "text-muted-foreground"
                        )}>
                          {row.ah1 !== null ? (
                            <div className="flex items-center justify-end gap-1">
                              {row.ah1 > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                              {Math.abs(row.ah1).toFixed(2)}%
                            </div>
                          ) : '—'}
                        </td>
                        <td className={cn(
                          "py-2.5 md:py-4 px-5 md:px-8 text-right font-black text-xs",
                          row.ah2 === null ? "text-muted-foreground" : row.ah2 > 0 ? "text-emerald-500" : row.ah2 < 0 ? "text-rose-500" : "text-muted-foreground"
                        )}>
                          {row.ah2 !== null ? (
                            <div className="flex items-center justify-end gap-1">
                              {row.ah2 > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                              {Math.abs(row.ah2).toFixed(2)}%
                            </div>
                          ) : '—'}
                        </td>
                        <td className={cn(
                          "py-2.5 md:py-4 px-5 md:px-8 text-right font-black text-xs",
                          row.ah3 === null ? "text-muted-foreground" : row.ah3 > 0 ? "text-emerald-500" : row.ah3 < 0 ? "text-rose-500" : "text-muted-foreground"
                        )}>
                          {row.ah3 !== null ? (
                            <div className="flex items-center justify-end gap-1">
                              {row.ah3 > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                              {Math.abs(row.ah3).toFixed(2)}%
                            </div>
                          ) : '—'}
                        </td>
                      </tr>
                    ))
                  ) : (
                     <tr className="transition-colors group">
                       <td colSpan={6} className="py-2.5 md:py-4 px-5 md:px-8 text-center text-muted-foreground">
                         Nenhum dado disponível.
                       </td>
                     </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
