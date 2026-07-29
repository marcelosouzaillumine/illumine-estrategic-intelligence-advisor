import React from 'react';
import { Target } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { ExecutiveSurface } from '../ui/executive-surface';
import { ExecutiveHeading } from '../ui/executive-heading';
import { ExecutiveText } from '../ui/executive-typography';
import { ExecutiveNarrative } from '../ui/executive-narrative';

export function ConsolidatedExecutiveSummaryCard({ narrative }: { narrative: string }) {
  const { t } = useLanguage();
  return (
    <ExecutiveSurface className="p-8 relative overflow-hidden flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
          <Target size={24} className="text-primary" />
        </div>
        <div>
          <ExecutiveHeading as="h3" variant="submoduleTitle" className="uppercase tracking-widest">
            {t('summary.executive_summary')}
          </ExecutiveHeading>
          <ExecutiveText variant="caption" className="text-muted-foreground uppercase font-bold tracking-widest mt-0.5">
            {t('summary.diagnostico_consolidado')}
          </ExecutiveText>
        </div>
      </div>

      <div className="bg-muted/40 p-6 rounded-2xl border border-border">
        <ExecutiveNarrative variant="summary">
          {narrative}
        </ExecutiveNarrative>
      </div>
    </ExecutiveSurface>
  );
}

