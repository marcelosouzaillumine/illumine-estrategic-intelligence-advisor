import React from 'react';
import { Layers, ChevronDown } from 'lucide-react';
import { BalanceSheetTechnicalLayerViewModel } from './view-models';
import { cn } from '../../../lib/utils';
import { ExecutiveTechnicalMetricCard } from '../../ui/executive-technical-metric-card';

export function BalanceSheetTechnicalLayerSection({
  viewModel
}: {
  viewModel: BalanceSheetTechnicalLayerViewModel;
}) {
  // Helper is no longer needed since ExecutiveTechnicalMetricCard manages semantic tones

  return (
    <details className="group bg-card border border-border rounded-[32px] open:shadow-2xl open:shadow-slate-200/40 transition-all duration-500 mb-12 overflow-hidden">
      <summary className="flex items-center justify-between p-8 cursor-pointer list-none hover:bg-surface-container/30/50 transition-colors">
        <div className="flex items-center gap-3">
          <Layers size={20} className="text-muted-foreground group-open:text-primary transition-colors" />
          <h3 className="text-lg font-black text-primary group-open:text-primary">Camada Técnica</h3>
        </div>
        <ChevronDown size={20} className="text-muted-foreground group-open:rotate-180 transition-transform" />
      </summary>
      <div className="p-8 border-t border-border bg-surface-container/30/30">
        <div className="flex flex-col mb-6 border-b border-border pb-4">
          <h4 className="text-sm font-black text-primary mb-2">Indicadores Quantitativos Subjacentes</h4>
          <p className="text-sm text-foreground/68 font-normal">
            Métricas e avaliações brutas utilizadas para o embasamento da Tese Patrimonial e elaboração do Score Matemático.
          </p>
        </div>
      
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {viewModel.families.map((family) => (
            <div key={family.familyName} className="space-y-4">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-widest border-b border-border pb-2">{family.familyName}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {family.indicators.map((ind, idx) => {
                  let tone = ind.classificationTone as any;
                  if (tone === 'insufficient') tone = 'neutral';
                  
                  return (
                    <ExecutiveTechnicalMetricCard
                      key={idx}
                      label={ind.label}
                      value={ind.formattedValue}
                      statusLabel={ind.classificationLabel}
                      statusTone={tone}
                      confidence={ind.confidence !== undefined && ind.confidence < 100 ? ind.confidence : undefined}
                      description={ind.rationale}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}
