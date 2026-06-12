import React from 'react';
import { Layers, ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface ExecutiveTechnicalLayerProps {
  title?: string;
  subtitle?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function ExecutiveTechnicalLayer({
  title = "Camada Técnica",
  subtitle = "Indicadores Quantitativos Subjacentes e Memória de Cálculo",
  description = "Métricas, fórmulas e avaliações brutas utilizadas para o embasamento da Tese Patrimonial e elaboração do Score Matemático.",
  children,
  className
}: ExecutiveTechnicalLayerProps) {
  return (
    <details className={cn("group bg-card border border-border rounded-[32px] open:shadow-2xl open:shadow-slate-200/40 transition-all duration-500 mb-12 overflow-hidden", className)}>
      <summary className="flex items-center justify-between p-8 cursor-pointer list-none hover:bg-surface-container/30/50 transition-colors">
        <div className="flex items-center gap-3">
          <Layers size={20} className="text-muted-foreground group-open:text-primary transition-colors" />
          <h3 className="text-lg font-black text-primary group-open:text-primary">{title}</h3>
        </div>
        <ChevronDown size={20} className="text-muted-foreground group-open:rotate-180 transition-transform" />
      </summary>
      <div className="p-8 border-t border-border bg-surface-container/30/30">
        <div className="flex flex-col mb-6 border-b border-border pb-4">
          <h4 className="text-sm font-black text-primary mb-2">{subtitle}</h4>
          <p className="text-sm text-foreground/68 font-normal">
            {description}
          </p>
        </div>
        
        {children}
      </div>
    </details>
  );
}
