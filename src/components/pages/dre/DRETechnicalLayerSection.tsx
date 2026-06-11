import React, { useState } from 'react';
import { Database, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { cn, formatCurrency } from '../../../lib/utils';
import { DRETechnicalLayerViewModel } from './view-models';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveEmptyState } from '../../ui/executive-empty-state';
import { StatusBadge } from '../../Common';
import { 
  ExecutiveTable, 
  ExecutiveTableHeader, 
  ExecutiveTableBody, 
  ExecutiveTableRow, 
  ExecutiveTableHead, 
  ExecutiveTableCell 
} from '../../ui/executive-table';

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
        className="w-full bg-surface hover:bg-muted transition-colors border border-border rounded-2xl p-4 flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
            <Database size={16} />
          </div>
          <div className="text-left">
            <h4 className="text-sm font-bold text-primary">Camada Técnica & KPIs</h4>
            <p className="text-xs text-muted-foreground">Métricas Contábeis, Gráficos e Tabelas</p>
          </div>
        </div>
        <div className="text-muted-foreground font-bold text-xs uppercase tracking-wider flex items-center gap-2">
          {showTechnicalLayer ? 'Ocultar Detalhes' : 'Expandir Detalhes'}
          <ChevronDown className={cn("w-4 h-4 transform transition-transform", showTechnicalLayer ? "rotate-180" : "rotate-0")} />
        </div>
      </button>

      {showTechnicalLayer && (
        <div className="mt-8 space-y-10 animate-in fade-in slide-in-from-top-4 duration-300">
          <ExecutiveSurface padding="none" radius="xl">
            <div className="overflow-hidden border border-border rounded-xl">
            <div className="px-6 py-5 border-b border-border bg-muted/30 flex items-center justify-between">
              <h4 className="text-sm font-bold text-primary uppercase tracking-widest">{translateLabel('Detalhamento da DRE')}</h4>
              <StatusBadge status="info" label={translateLabel('Análise Horizontal e Vertical')} />
            </div>
            <div className="overflow-x-auto">
              <ExecutiveTable empty={viewModel.rows.length === 0}>
                <ExecutiveTableHeader>
                  <ExecutiveTableRow>
                    <ExecutiveTableHead className="w-[300px]">{translateLabel('Conta')}</ExecutiveTableHead>
                    <ExecutiveTableHead className="text-right">{translateLabel('Valor (R$)')}</ExecutiveTableHead>
                    <ExecutiveTableHead className="text-right">{translateLabel('AV (%)')}</ExecutiveTableHead>
                    <ExecutiveTableHead className="text-right">{translateLabel('AH (1 Ano)')}</ExecutiveTableHead>
                    <ExecutiveTableHead className="text-right">{translateLabel('AH (2 Anos)')}</ExecutiveTableHead>
                    <ExecutiveTableHead className="text-right">{translateLabel('AH (3 Anos)')}</ExecutiveTableHead>
                  </ExecutiveTableRow>
                </ExecutiveTableHeader>
                <ExecutiveTableBody>
                  {viewModel.rows.length > 0 ? (
                    viewModel.rows.map((row, i) => (
                      <ExecutiveTableRow key={i} className={cn(row.isTotal ? 'bg-muted/30 font-bold' : '')}>
                        <ExecutiveTableCell>
                          <span
                            className={cn('block break-words overflow-visible', row.isTotal ? 'text-foreground font-bold' : 'text-muted-foreground font-medium')}
                            style={{ paddingLeft: row.level > 1 ? `${(row.level - 1) * 20}px` : '0px' }}
                          >
                            {row.level > 1 && (
                              <span className="inline-block w-2 h-2 border-b border-l border-border mr-2 mb-0.5" />
                            )}
                            {row.label}
                          </span>
                        </ExecutiveTableCell>
                        <ExecutiveTableCell className={cn("text-right font-mono", row.val < 0 ? "text-rose-600" : "text-muted-foreground")}>
                          {formatCurrency(row.val)}
                        </ExecutiveTableCell>
                        <ExecutiveTableCell className="text-right font-bold text-muted-foreground text-xs">
                          {row.av.toFixed(2)}%
                        </ExecutiveTableCell>
                        <ExecutiveTableCell className={cn(
                          "text-right font-bold text-xs",
                          row.ah1 === null ? "text-muted-foreground" : row.ah1 > 0 ? "text-emerald-600" : row.ah1 < 0 ? "text-rose-600" : "text-muted-foreground"
                        )}>
                          {row.ah1 !== null ? (
                            <div className="flex items-center justify-end gap-1">
                              {row.ah1 > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                              {Math.abs(row.ah1).toFixed(2)}%
                            </div>
                          ) : '—'}
                        </ExecutiveTableCell>
                        <ExecutiveTableCell className={cn(
                          "text-right font-bold text-xs",
                          row.ah2 === null ? "text-muted-foreground" : row.ah2 > 0 ? "text-emerald-600" : row.ah2 < 0 ? "text-rose-600" : "text-muted-foreground"
                        )}>
                          {row.ah2 !== null ? (
                            <div className="flex items-center justify-end gap-1">
                              {row.ah2 > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                              {Math.abs(row.ah2).toFixed(2)}%
                            </div>
                          ) : '—'}
                        </ExecutiveTableCell>
                        <ExecutiveTableCell className={cn(
                          "text-right font-bold text-xs",
                          row.ah3 === null ? "text-muted-foreground" : row.ah3 > 0 ? "text-emerald-600" : row.ah3 < 0 ? "text-rose-600" : "text-muted-foreground"
                        )}>
                          {row.ah3 !== null ? (
                            <div className="flex items-center justify-end gap-1">
                              {row.ah3 > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                              {Math.abs(row.ah3).toFixed(2)}%
                            </div>
                          ) : '—'}
                        </ExecutiveTableCell>
                      </ExecutiveTableRow>
                    ))
                  ) : (
                     <ExecutiveTableRow>
                       <ExecutiveTableCell colSpan={6} className="p-0">
                         <ExecutiveEmptyState 
                           title="Nenhum dado disponível"
                           description="Não há detalhamento técnico da DRE para este período."
                         />
                       </ExecutiveTableCell>
                     </ExecutiveTableRow>
                  )}
                </ExecutiveTableBody>
              </ExecutiveTable>
            </div>
          </div>
          </ExecutiveSurface>
        </div>
      )}
    </div>
  );
}
