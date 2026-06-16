import React from 'react';
import { Layers, AlertTriangle, Target } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { FiduciaryRuntimeAdapter } from '../../../services/FiduciaryRuntimeAdapter';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveCallout } from '../../ui/executive-callout';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { DreExecutiveViewModel } from '../../../core/runtime/dre/DreExecutiveViewModelBuilder';

interface Props {
  isVisibleStructure: boolean;
  isVisibleBurnRate: boolean;
  isVisibleBreakEven: boolean;
  viewModel?: DreExecutiveViewModel | null;
}

export function DREEconomicBreakdownSection({
  isVisibleStructure,
  isVisibleBurnRate,
  isVisibleBreakEven,
  viewModel
}: Props) {
  const structureVM = viewModel?.economicBreakdown?.structureVM;
  const burnRateVM = viewModel?.economicBreakdown?.burnRateVM;
  const breakEvenVM = viewModel?.economicBreakdown?.breakEvenVM;
  if (!isVisibleStructure && !isVisibleBurnRate && !isVisibleBreakEven) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6 mb-10 items-stretch">
      
      {/* ESTRUTURA ECONÔMICA DA RECEITA */}
      {isVisibleStructure && (
        <ExecutiveSurface padding="xl" radius="xl" className="flex flex-col h-full">
          <div className="flex items-center gap-3 mb-6">
            <Layers className="text-secondary w-6 h-6" />
            <div>
              <ExecutiveHeading as="h4" variant="submoduleTitle" className="text-primary">Estrutura Econômica</ExecutiveHeading>
              <ExecutiveText variant="microLabel" className="text-executive-secondary">Para cada R$ 100 vendidos</ExecutiveText>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            {structureVM?.available ? (
               <ExecutiveCallout variant="info">
                  <ExecutiveText variant="bodyStandard" className="text-center">
                    {structureVM.narrative}
                  </ExecutiveText>
               </ExecutiveCallout>
            ) : (
               <ExecutiveText variant="bodyStandard" className="text-executive-secondary text-center">
                 {FiduciaryRuntimeAdapter.ExecutiveEmptyStatePolicy.getFallbackMessage(structureVM?.reason || 'INSUFFICIENT_DATA')}
               </ExecutiveText>
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
              <ExecutiveHeading as="h4" variant="submoduleTitle" className="text-primary">Consumo Econômico</ExecutiveHeading>
              <ExecutiveText variant="microLabel" className="text-executive-secondary">Consumo Econômico do Resultado</ExecutiveText>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            {burnRateVM?.available ? (
              burnRateVM.hasBurn ? (
               <ExecutiveCallout variant="critical">
                  <ExecutiveText variant="bodyStandard" className="whitespace-pre-line mb-4 text-center">
                    {burnRateVM.narrative}
                  </ExecutiveText>
                  <div className="w-full flex justify-between px-2 gap-4">
                     <div className="text-center flex-1">
                        <ExecutiveText variant="microLabel" className="uppercase mb-1">Déficit Mensal</ExecutiveText>
                        <ExecutiveText variant="bodyStandard">{burnRateVM.monthlyEconomicBurnFormatted}</ExecutiveText>
                     </div>
                     <div className="text-center flex-1">
                        <ExecutiveText variant="microLabel" className="uppercase mb-1">Déficit do Exercício</ExecutiveText>
                        <ExecutiveText variant="bodyStandard">{burnRateVM.annualEconomicBurnFormatted}</ExecutiveText>
                     </div>
                  </div>
               </ExecutiveCallout>
              ) : (
               <ExecutiveCallout variant="success">
                  <ExecutiveText variant="bodyStandard" className="w-full text-center">
                    {burnRateVM.narrative}
                  </ExecutiveText>
               </ExecutiveCallout>
              )
            ) : (
               <ExecutiveText variant="bodyStandard" className="text-executive-secondary text-center">
                 {FiduciaryRuntimeAdapter.ExecutiveEmptyStatePolicy.getFallbackMessage(burnRateVM?.reason || 'INSUFFICIENT_DATA')}
               </ExecutiveText>
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
              <ExecutiveHeading as="h4" variant="submoduleTitle" className="text-primary">Ponto de Equilíbrio</ExecutiveHeading>
              <ExecutiveText variant="microLabel" className="text-executive-secondary">Absorção & Cobertura</ExecutiveText>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center">
            {breakEvenVM?.available ? (
               <ExecutiveCallout variant="info">
                  <ExecutiveText variant="bodyStandard" className="mb-3">
                    {breakEvenVM.narrative}
                  </ExecutiveText>
                  {breakEvenVM.absorptionClassification && (
                      <ExecutiveBadge variant={(breakEvenVM.absorptionTone as any) || 'info'}>
                        {`Absorção ${breakEvenVM.absorptionClassification}`}
                      </ExecutiveBadge>
                  )}
               </ExecutiveCallout>
            ) : (
               <ExecutiveText variant="bodyStandard" className="text-executive-secondary text-center">
                 {FiduciaryRuntimeAdapter.ExecutiveEmptyStatePolicy.getFallbackMessage(breakEvenVM?.reason || 'INSUFFICIENT_DATA')}
               </ExecutiveText>
            )}
          </div>
        </ExecutiveSurface>
      )}

    </div>
  );
}
