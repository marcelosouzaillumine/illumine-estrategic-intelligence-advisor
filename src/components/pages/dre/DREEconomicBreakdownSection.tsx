import React from 'react';
import { Layers, AlertTriangle, Target } from 'lucide-react';
import { cn, formatCurrency } from '../../../lib/utils';
import { FiduciaryRuntimeAdapter } from '../../../services/FiduciaryRuntimeAdapter';
import {
  DRERevenueEconomicStructureViewModel,
  DREEconomicBurnRateViewModel,
  DREBreakEvenAnalysisViewModel
} from './view-models';

interface Props {
  isVisibleStructure: boolean;
  isVisibleBurnRate: boolean;
  isVisibleBreakEven: boolean;
  structureVM?: DRERevenueEconomicStructureViewModel;
  burnRateVM?: DREEconomicBurnRateViewModel;
  breakEvenVM?: DREBreakEvenAnalysisViewModel;
}

export function DREEconomicBreakdownSection({
  isVisibleStructure,
  isVisibleBurnRate,
  isVisibleBreakEven,
  structureVM,
  burnRateVM,
  breakEvenVM
}: Props) {
  if (!isVisibleStructure && !isVisibleBurnRate && !isVisibleBreakEven) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 mb-10">
      
      {/* ESTRUTURA ECONÔMICA DA RECEITA */}
      {isVisibleStructure && (
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-primary border border-primary flex items-center justify-center text-primary">
              <Layers size={20} />
            </div>
            <div>
              <h4 className="text-lg font-black text-primary">Estrutura Econômica</h4>
              <p className="text-secondary">Para cada R$ 100 vendidos</p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            {structureVM?.available ? (
               <div className="bg-surface-container/30 border border-border rounded-2xl p-6 text-center shadow-inner h-full flex items-center">
                  <p className="text-secondary">
                    {structureVM.narrative}
                  </p>
               </div>
            ) : (
               <p className="text-secondary">
                 {FiduciaryRuntimeAdapter.ExecutiveEmptyStatePolicy.getFallbackMessage(structureVM?.reason || 'INSUFFICIENT_DATA')}
               </p>
            )}
          </div>
        </div>
      )}

      {/* CONSUMO ECONÔMICO (BURN RATE) */}
      {isVisibleBurnRate && (
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-critical-soft border border-rose-100 flex items-center justify-center text-rose-600">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 className="text-lg font-black text-primary">Consumo Econômico</h4>
              <p className="text-secondary">Consumo Econômico do Resultado</p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            {burnRateVM?.available ? (
              burnRateVM.hasBurn ? (
               <div className="bg-critical-soft/50 border border-rose-100 rounded-2xl p-6 text-center shadow-inner h-full flex flex-col items-center justify-center">
                  <p className="text-sm font-medium text-rose-800 leading-relaxed whitespace-pre-line mb-4">
                    {burnRateVM.narrative}
                  </p>
                  <div className="w-full flex justify-between px-4">
                     <div className="text-center">
                        <p className="text-[9px] font-bold uppercase text-rose-400/80 mb-1">Déficit Econômico Mensal</p>
                        <p className="font-black text-rose-600">{burnRateVM.monthlyEconomicBurnFormatted}</p>
                     </div>
                     <div className="text-center">
                        <p className="text-[9px] font-bold uppercase text-rose-400/80 mb-1">Déficit Econômico do Exercício</p>
                        <p className="font-black text-rose-600">{burnRateVM.annualEconomicBurnFormatted}</p>
                     </div>
                  </div>
               </div>
              ) : (
               <div className="bg-success-soft/50 border border-emerald-100 rounded-2xl p-6 text-center shadow-inner h-full flex items-center justify-center">
                  <p className="text-sm font-bold text-emerald-700 leading-relaxed w-full">
                    {burnRateVM.narrative}
                  </p>
               </div>
              )
            ) : (
               <p className="text-secondary">
                 {FiduciaryRuntimeAdapter.ExecutiveEmptyStatePolicy.getFallbackMessage(burnRateVM?.reason || 'INSUFFICIENT_DATA')}
               </p>
            )}
          </div>
        </div>
      )}

      {/* PONTO DE EQUILÍBRIO E COBERTURA */}
      {isVisibleBreakEven && (
        <div className="bg-card border border-border rounded-3xl p-6 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
              <Target size={20} />
            </div>
            <div>
              <h4 className="text-lg font-black text-primary">Ponto de Equilíbrio</h4>
              <p className="text-secondary">Absorção & Cobertura</p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            {breakEvenVM?.available ? (
               <div className="bg-surface-container/30 border border-border rounded-2xl p-6 text-center shadow-inner h-full flex items-center justify-center flex-col">
                  <p className="text-secondary">
                    {breakEvenVM.narrative}
                  </p>
                  {breakEvenVM.absorptionClassification && (
                      <span className={cn("text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border mt-2", 
                      breakEvenVM.absorptionTone === 'success' ? "bg-success-soft text-emerald-600 border-emerald-200" :
                      breakEvenVM.absorptionTone === 'warning' ? "bg-warning-soft text-amber-600 border-amber-200" : "bg-critical-soft text-rose-600 border-rose-200"
                      )}>
                      Absorção {breakEvenVM.absorptionClassification}
                      </span>
                  )}
               </div>
            ) : (
               <p className="text-secondary">
                 {FiduciaryRuntimeAdapter.ExecutiveEmptyStatePolicy.getFallbackMessage(breakEvenVM?.reason || 'INSUFFICIENT_DATA')}
               </p>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
