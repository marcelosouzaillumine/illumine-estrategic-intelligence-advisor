import React from 'react';
import { Layers, AlertTriangle, Target } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { FiduciaryRuntimeAdapter } from '../../../services/FiduciaryRuntimeAdapter';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveCallout } from '../../ui/executive-callout';
import { StatusBadge } from '../../Common';
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
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 mb-10 items-stretch">
      
      {/* ESTRUTURA ECONÔMICA DA RECEITA */}
      {isVisibleStructure && (
        <ExecutiveSurface padding="xl" radius="xl" className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <Layers className="text-secondary w-6 h-6" />
            <div>
              <h4 className="text-lg font-bold text-primary">Estrutura Econômica</h4>
              <p className="text-sm text-secondary">Para cada R$ 100 vendidos</p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            {structureVM?.available ? (
               <ExecutiveCallout variant="info">
                  <p className="text-center">
                    {structureVM.narrative}
                  </p>
               </ExecutiveCallout>
            ) : (
               <p className="text-secondary text-center">
                 {FiduciaryRuntimeAdapter.ExecutiveEmptyStatePolicy.getFallbackMessage(structureVM?.reason || 'INSUFFICIENT_DATA')}
               </p>
            )}
          </div>
        </ExecutiveSurface>
      )}

      {/* CONSUMO ECONÔMICO (BURN RATE) */}
      {isVisibleBurnRate && (
        <ExecutiveSurface padding="xl" radius="xl" className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="text-secondary w-6 h-6" />
            <div>
              <h4 className="text-lg font-bold text-primary">Consumo Econômico</h4>
              <p className="text-sm text-secondary">Consumo Econômico do Resultado</p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            {burnRateVM?.available ? (
              burnRateVM.hasBurn ? (
               <ExecutiveCallout variant="critical">
                  <p className="text-sm font-medium leading-relaxed whitespace-pre-line mb-4 text-center">
                    {burnRateVM.narrative}
                  </p>
                  <div className="w-full flex justify-between px-2 gap-4">
                     <div className="text-center flex-1">
                        <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Déficit Mensal</p>
                        <p className="font-bold">{burnRateVM.monthlyEconomicBurnFormatted}</p>
                     </div>
                     <div className="text-center flex-1">
                        <p className="text-[10px] font-bold uppercase opacity-80 mb-1">Déficit do Exercício</p>
                        <p className="font-bold">{burnRateVM.annualEconomicBurnFormatted}</p>
                     </div>
                  </div>
               </ExecutiveCallout>
              ) : (
               <ExecutiveCallout variant="success">
                  <p className="text-sm font-bold leading-relaxed w-full text-center">
                    {burnRateVM.narrative}
                  </p>
               </ExecutiveCallout>
              )
            ) : (
               <p className="text-secondary text-center">
                 {FiduciaryRuntimeAdapter.ExecutiveEmptyStatePolicy.getFallbackMessage(burnRateVM?.reason || 'INSUFFICIENT_DATA')}
               </p>
            )}
          </div>
        </ExecutiveSurface>
      )}

      {/* PONTO DE EQUILÍBRIO E COBERTURA */}
      {isVisibleBreakEven && (
        <ExecutiveSurface padding="xl" radius="xl" className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <Target className="text-secondary w-6 h-6" />
            <div>
              <h4 className="text-lg font-bold text-primary">Ponto de Equilíbrio</h4>
              <p className="text-sm text-secondary">Absorção & Cobertura</p>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            {breakEvenVM?.available ? (
               <ExecutiveCallout variant="info">
                  <p className="mb-3">
                    {breakEvenVM.narrative}
                  </p>
                  {breakEvenVM.absorptionClassification && (
                      <StatusBadge 
                        status={breakEvenVM.absorptionTone || 'neutral'} 
                        label={`Absorção ${breakEvenVM.absorptionClassification}`} 
                      />
                  )}
               </ExecutiveCallout>
            ) : (
               <p className="text-secondary text-center">
                 {FiduciaryRuntimeAdapter.ExecutiveEmptyStatePolicy.getFallbackMessage(breakEvenVM?.reason || 'INSUFFICIENT_DATA')}
               </p>
            )}
          </div>
        </ExecutiveSurface>
      )}

    </div>
  );
}
