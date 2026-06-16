import React from 'react';
import { Building2, Compass, Briefcase, Zap } from 'lucide-react';
import { BalanceSheetInstitutionalContextViewModel } from './view-models';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveInfoCard } from '../../ui/executive-info-card';
import { ExecutiveHeading } from '../../ui/executive-heading';

export function BalanceSheetInstitutionalContextSection({
  context
}: {
  context: BalanceSheetInstitutionalContextViewModel;
}) {
  return (
    <ExecutiveSurface variant="transparent" padding="none" className="bg-surface-container/30 rounded-[32px] p-6 md:p-8 border border-border mt-8 mb-12 relative overflow-hidden w-full flex flex-col items-start justify-start">
      <ExecutiveHeading as="h3" variant="moduleTitle" className="mb-6">Contexto Institucional da Operação</ExecutiveHeading>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Segmento */}
        <ExecutiveInfoCard
          icon={<Building2 size={18} />}
          label="Segmento de Atuação"
          value={context.segment}
          tone="info"
        />

        {/* Modelo de Negócio */}
        <ExecutiveInfoCard
          icon={<Briefcase size={18} />}
          label="Modelo de Negócio"
          value={context.businessModel}
          tone="success"
        />

        {/* Maturidade */}
        <ExecutiveInfoCard
          icon={<Compass size={18} />}
          label="Grau de Maturidade"
          value={context.stage}
          tone="warning"
        />

        {/* Intensidade de Capital */}
        <ExecutiveInfoCard
          icon={<Zap size={18} />}
          label="Intensidade de Capital"
          value={context.capitalIntensity}
          tone="default"
        />

      </div>
    </ExecutiveSurface>
  );
}
