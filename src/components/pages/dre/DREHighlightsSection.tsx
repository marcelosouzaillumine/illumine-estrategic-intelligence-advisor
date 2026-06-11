import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { cn } from '../../../lib/utils';
import { DREHighlightsViewModel } from './view-models';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { StatusBadge } from '../../Common';

interface Props {
  viewModel: DREHighlightsViewModel;
}

export function DREHighlightsSection({ viewModel }: Props) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col mb-10">
      <ExecutiveSurface padding="xl" radius="xl">
        <h3 className="text-xl font-semibold mb-1 text-foreground">{t('dre.highlights.title')}</h3>
        <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest mb-8">{t('dre.highlights.subtitle')}</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
          <ExecutiveSurface padding="lg" radius="lg" variant="transparent">
            <div className="border border-border space-y-2 h-fit p-6 rounded-2xl bg-surface-container/30">
              <p className="text-muted-foreground mb-4">{t('dre.highlights.composition')}</p>
              
              <div className="flex justify-between items-center text-xs text-foreground/70 mb-2">
                <span>Receita Operacional Bruta:</span>
                <span className="font-bold text-foreground">{viewModel.receitaBrutaFormatted}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-foreground/70 mb-3">
                <span>(-) Deduções da Receita:</span>
                <span className="font-bold text-rose-600">{viewModel.deducoesReceitaFormatted}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-foreground font-bold border-t border-border pt-3 mt-2">
                <span>(=) Receita Operacional Líquida:</span>
                <span className="text-emerald-600">{viewModel.recLiquidaFormatted}</span>
              </div>
            </div>
          </ExecutiveSurface>
          
          <ExecutiveSurface padding="lg" radius="lg" variant="transparent">
            <div className="border border-border h-fit flex flex-col justify-between p-6 rounded-2xl bg-surface-container/30">
              <div>
                <p className="text-muted-foreground mb-4">Ponto de Equilíbrio & Cobertura</p>
                
                <div className="flex justify-between items-center text-xs text-foreground/70 mb-2">
                  <span>Receita Operacional Líquida:</span>
                  <span className="font-bold text-foreground">{viewModel.recLiquidaFormatted}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-foreground/70 mb-3">
                  <span>(-) {viewModel.cmvLabel}:</span>
                  <span className="font-bold text-rose-600">{viewModel.custosVarFormatted}</span>
                </div>
                <div className="flex justify-between items-center text-sm text-foreground font-bold border-t border-border pt-3 mt-2">
                  <span>(=) Margem de Contribuição ({viewModel.margemContribPercent}):</span>
                  <span className="text-emerald-600">{viewModel.margemContribFormatted}</span>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex flex-col gap-2">
                  <div className="flex justify-between items-center text-xs text-foreground/70">
                    <span>Despesas Fixas:</span>
                    <span className="font-bold text-rose-600">{viewModel.despesasFixasFormatted}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-foreground font-bold bg-surface p-3 rounded-xl mt-2 border border-border">
                    <span>Ponto de Equilíbrio (Absoluto):</span>
                    <span className="text-blue-600">{viewModel.pontoEquilibrioFormatted}</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs text-foreground/70">
                    <span>Distância para Equilíbrio:</span>
                    <span className="font-bold text-rose-600">{viewModel.gapEquilibrioFormatted}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-foreground/70">
                    <span>Margem de Segurança:</span>
                    <span className="font-bold text-emerald-600">{viewModel.margemSegurancaValorFormatted}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-foreground/70">
                    <span>Índice de Cobertura Operacional:</span>
                    <StatusBadge 
                      status={viewModel.coberturaTone || 'neutral'} 
                      label={viewModel.indiceCoberturaOperacionalFormatted}
                    />
                  </div>
                </div>
              </div>
            </div>
          </ExecutiveSurface>
        </div>
      </ExecutiveSurface>
    </div>
  );
}
