import React from 'react';
import { useLanguage } from '../../../contexts/LanguageContext';
import { cn } from '../../../lib/utils';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText, ExecutiveMetric } from '../../ui/executive-typography';
import { ExecutiveBadge } from '../../ui/executive-badge';
import { ExecutiveSurface } from '../../ui/executive-surface';

interface Props {
  score: number;
  classification: string;
  classificationColor: string;
  drivers: string[];
}

export function DREHealthScoreSection({ score, classification, classificationColor, drivers }: Props) {
  const { t } = useLanguage();

  const getTone = (colorStr: string) => {
    switch (colorStr) {
      case 'emerald': return 'success';
      case 'rose': return 'critical';
      default: return 'critical';
    }
  };

  return (
    <ExecutiveSurface variant="secondary" padding="md" radius="xl" className="mb-12 animate-executive-fade flex flex-col">
      <ExecutiveHeading as="h4" variant="moduleTitle" className="mb-4 border-b border-border pb-2">
        Índice de Saúde Operacional
      </ExecutiveHeading>
      
      <div className="flex flex-col md:flex-row items-start md:items-center gap-8 mb-6">
        <div className="flex items-center gap-4">
          <ExecutiveMetric variant="heroMetric">{Math.min(score, 100)}</ExecutiveMetric>
          <div className="flex flex-col">
            <ExecutiveText variant="bodyStandard" className="text-executive-muted">Índice metodológico global</ExecutiveText>
            <div className="mt-1">
              <ExecutiveBadge variant={getTone(classificationColor)}>{classification}</ExecutiveBadge>
            </div>
          </div>
        </div>
      </div>

      <ExecutiveText variant="microLabel" className="text-executive-secondary mb-6 italic border-l-2 border-primary/30 pl-3">
        O Índice de Saúde Operacional consolida a avaliação da DRE, sendo derivado da capacidade da operação em gerar resultado recorrente sustentado.
      </ExecutiveText>

      {drivers && drivers.length > 0 && (
        <div className="flex flex-col">
          <ExecutiveHeading as="h4" variant="submoduleTitle" className="mb-4">Principais Determinantes</ExecutiveHeading>
          <ul className="space-y-3">
            {drivers.map((driver: string, i: number) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 bg-primary mt-2 shrink-0" />
                <ExecutiveText variant="bodyStandard" className="text-executive-secondary">
                  {driver}
                </ExecutiveText>
              </li>
            ))}
          </ul>
        </div>
      )}
    </ExecutiveSurface>
  );
}
