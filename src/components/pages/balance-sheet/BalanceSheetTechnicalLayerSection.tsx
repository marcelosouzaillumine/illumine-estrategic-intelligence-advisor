import React from 'react';
import { BalanceSheetTechnicalLayerViewModel } from './view-models';
import { ExecutiveTechnicalMetricCard } from '../../ui/executive-technical-metric-card';
import { ExecutiveTechnicalLayer } from '../../ui/executive-technical-layer';

export function BalanceSheetTechnicalLayerSection({
  viewModel
}: {
  viewModel: BalanceSheetTechnicalLayerViewModel;
}) {
  return (
    <ExecutiveTechnicalLayer
      title="Camada Técnica"
      subtitle="Indicadores Quantitativos Subjacentes"
      description="Métricas e avaliações brutas utilizadas para o embasamento da Tese Patrimonial e elaboração do Score Matemático."
    >
      <div className="grid grid-cols-1 gap-10">
        {viewModel.families.map((family) => (
          <div key={family.familyName} className="space-y-4">
            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest border-b border-border pb-2">{family.familyName}</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
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
    </ExecutiveTechnicalLayer>
  );
}
