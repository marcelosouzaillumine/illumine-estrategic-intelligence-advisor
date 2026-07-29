import React from 'react';
import { GitCommit } from 'lucide-react';
import { useConsolidatedExecutive } from '../../context/ConsolidatedExecutiveContext';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';

export function ConsolidatedLineagePanel() {
  const { report } = useConsolidatedExecutive();
  
  if (!report) return null;

  return (
    <ExecutiveSurface className="p-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
          <GitCommit size={20} className="text-primary" />
        </div>
        <div>
          <ExecutiveHeading as="h3" variant="submoduleTitle" className="uppercase tracking-widest">
            Lineage & Rastreabilidade
          </ExecutiveHeading>
          <ExecutiveText variant="caption" className="text-muted-foreground uppercase font-bold tracking-widest mt-0.5">
            Integridade Ponto-a-Ponto
          </ExecutiveText>
        </div>
      </div>
      <ExecutiveText variant="bodyStandard" className="text-muted-foreground font-medium leading-relaxed">
        Todas as agregações consolidadas e deduções de intragrupo possuem proveniência rastreável nativamente na arquitetura. Nenhuma soma foi executada pela View Layer.
      </ExecutiveText>
    </ExecutiveSurface>
  );
}

