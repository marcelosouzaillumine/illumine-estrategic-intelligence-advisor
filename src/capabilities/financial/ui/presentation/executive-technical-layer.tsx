import React from 'react';
import { Layers } from 'lucide-react';
import { ExecutiveAccordion } from '../../../../components/ui/executive-accordion';
import { cn } from '../../../../lib/utils';

export interface ExecutiveTechnicalLayerProps {
  title?: string;
  subtitle?: string;
  description?: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function ExecutiveTechnicalLayer({
  title = "Camada Técnica",
  subtitle = "Indicadores Quantitativos Subjacentes e Memória de Cálculo",
  description = "Métricas, fórmulas e avaliações brutas utilizadas para o embasamento da Tese Patrimonial e elaboração do Score Matemático.",
  defaultExpanded = false,
  children,
  className
}: ExecutiveTechnicalLayerProps) {
  return (
    <ExecutiveAccordion
      variant="technical"
      icon={<Layers />}
      title={title}
      subtitle={subtitle}
      className={className}
      defaultExpanded={defaultExpanded}
    >
        {children}
    </ExecutiveAccordion>
  );
}
