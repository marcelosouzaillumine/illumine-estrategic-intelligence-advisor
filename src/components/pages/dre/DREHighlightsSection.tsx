import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { cn } from '../../../lib/utils';
import { DREHighlightsViewModel } from './view-models';

interface Props {
  viewModel: DREHighlightsViewModel;
}

export function DREHighlightsSection({ viewModel }: Props) {
  const { t } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 rounded-[40px] shadow-2xl relative overflow-hidden flex flex-col border border-border">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      <h3 className="text-xl font-black mb-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">{t('dre.highlights.title')}</h3>
      <p className="text-[10px] text-blue-400/80 uppercase font-bold tracking-widest mb-8">{t('dre.highlights.subtitle')}</p>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        <div className="p-6 bg-card/5 rounded-2xl border border-white/5 space-y-2 relative z-10 h-fit">
          <p className="text-secondary">{t('dre.highlights.composition')}</p>
          
          <div className="flex justify-between items-center text-xs text-white/70 mb-2">
            <span>Receita Operacional Bruta:</span>
            <span className="font-bold">{viewModel.receitaBrutaFormatted}</span>
          </div>
          <div className="flex justify-between items-center text-xs text-white/70 mb-3">
            <span>(-) Deduções da Receita:</span>
            <span className="font-bold text-rose-300">{viewModel.deducoesReceitaFormatted}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-white font-bold border-t border-white/10 pt-3 mt-2">
            <span>(=) Receita Operacional Líquida:</span>
            <span className="text-emerald-400">{viewModel.recLiquidaFormatted}</span>
          </div>
        </div>
        
        <div className="p-6 bg-card/5 rounded-2xl border border-white/5 relative z-10 h-fit flex flex-col justify-between">
          <div>
            <p className="text-secondary">Ponto de Equilíbrio & Cobertura</p>
            
            <div className="flex justify-between items-center text-xs text-white/70 mb-2">
              <span>Receita Operacional Líquida:</span>
              <span className="font-bold">{viewModel.recLiquidaFormatted}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-white/70 mb-3">
              <span>(-) {viewModel.cmvLabel}:</span>
              <span className="font-bold text-rose-300">{viewModel.custosVarFormatted}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-white font-bold border-t border-white/10 pt-3 mt-2">
              <span>(=) Margem de Contribuição ({viewModel.margemContribPercent}):</span>
              <span className="text-emerald-400">{viewModel.margemContribFormatted}</span>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs text-white/70">
                <span>Despesas Fixas:</span>
                <span className="font-bold text-rose-300">{viewModel.despesasFixasFormatted}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-white font-bold bg-card/5 p-3 rounded-xl mt-2 border border-white/5">
                <span>Ponto de Equilíbrio (Absoluto):</span>
                <span className="text-blue-400">{viewModel.pontoEquilibrioFormatted}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex flex-col gap-3">
              <div className="flex justify-between items-center text-xs text-white/70">
                <span>Gap para Equilíbrio:</span>
                <span className="font-bold text-rose-300">{viewModel.gapEquilibrioFormatted}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-white/70">
                <span>Margem de Segurança:</span>
                <span className="font-bold text-emerald-400">{viewModel.margemSegurancaValorFormatted}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-white/70">
                <span>Índice de Cobertura Operacional:</span>
                <span className={cn(
                  "font-bold text-sm", 
                  viewModel.coberturaTone === 'success' ? "text-emerald-400" : 
                  viewModel.coberturaTone === 'info' ? "text-blue-400" : 
                  viewModel.coberturaTone === 'warning' ? "text-amber-400" : 
                  "text-rose-400"
                )}>
                  {viewModel.indiceCoberturaOperacionalFormatted}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
