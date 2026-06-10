import React from 'react';
import { Layers, ChevronDown } from 'lucide-react';
import { BalanceSheetTechnicalLayerViewModel } from './view-models';
import { cn } from '../../../lib/utils';

export function BalanceSheetTechnicalLayerSection({
  viewModel
}: {
  viewModel: BalanceSheetTechnicalLayerViewModel;
}) {
  const getToneClasses = (tone: string) => {
    switch (tone) {
      case 'insufficient':
        return 'bg-surface-container text-muted-foreground border-border';
      case 'critical':
        return 'bg-critical-soft text-rose-700 border-rose-200';
      case 'warning':
        return 'bg-warning-soft text-amber-700 border-amber-200';
      case 'info':
        return 'bg-blue-50 text-blue-500 border-blue-200';
      case 'success':
        return 'bg-success-soft text-emerald-700 border-emerald-200';
      default:
        return 'bg-surface-container text-muted-foreground border-border';
    }
  };

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
          <p className="text-secondary">
            Métricas e avaliações brutas utilizadas para o embasamento da Tese Patrimonial e elaboração do Score Matemático.
          </p>
        </div>
      
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {viewModel.families.map((family) => (
            <div key={family.familyName} className="space-y-4">
              <h4 className="text-[10px] font-black text-primary uppercase tracking-widest border-b border-border pb-2">{family.familyName}</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {family.indicators.map((ind, idx) => (
                  <div key={idx} className="bg-surface-container/30 border border-border rounded-2xl p-5 hover:shadow-md transition-all group relative cursor-help flex flex-col justify-between" title={`Rationale: ${ind.rationale || ''}`}>
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground w-2/3 leading-relaxed">{ind.label}</span>
                      <span className={cn(
                        "text-[8px] font-black uppercase px-2 py-1 rounded-full tracking-wider border whitespace-nowrap",
                        getToneClasses(ind.classificationTone)
                      )}>
                        {ind.classificationLabel}
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <span className="text-2xl font-black text-primary leading-none">
                        {ind.formattedValue}
                      </span>
                      {ind.confidence !== undefined && ind.confidence < 100 && (
                        <span className="text-[8px] font-bold text-muted-foreground">Confiança {ind.confidence}%</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </details>
  );
}
