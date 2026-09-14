import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
import { History, TrendingUp, AlertCircle, LineChart, HelpCircle } from 'lucide-react';
import { HistoricalIntelligenceResult } from '../../../core/experience/contracts/FinancialPositionPureViewModel';

interface HistoricalEvolutionSectionProps {
  historicalEvolution?: HistoricalIntelligenceResult;
}

export function HistoricalEvolutionSection({ historicalEvolution }: HistoricalEvolutionSectionProps) {
  if (!historicalEvolution || !historicalEvolution.trajectory) return null;

  return (
    <div className="mb-8">
      <ExecutiveSurface variant="default" elevation="md" className="p-8 border-t border-t-border/40">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <History className="text-foreground w-6 h-6" />
              <ExecutiveHeading as="h2" variant="moduleTitle" className="text-foreground">
                Historical Intelligence Evolution™
              </ExecutiveHeading>
            </div>
            <ExecutiveText variant="bodyStandard" className="text-muted-foreground">
              Trajetória Patrimonial
            </ExecutiveText>
          </div>
          <div className="flex items-center gap-2 bg-brand-50 px-4 py-2 rounded-lg border border-brand-100">
            <LineChart className="w-4 h-4 text-brand-600" />
            <ExecutiveText variant="label" className="text-brand-800">
              Confiança Temporal: {historicalEvolution.trajectory.confidence === 'high' ? 'Alta' : historicalEvolution.trajectory.confidence === 'medium' ? 'Média' : 'Baixa'}
            </ExecutiveText>
          </div>
        </div>

        {/* Trajetória */}
        <div className="bg-muted/30 p-6 rounded-xl border border-border/50 mb-8">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              {historicalEvolution.trajectory.classification === 'strengthening' ? (
                <TrendingUp className="w-6 h-6 text-green-600" />
              ) : historicalEvolution.trajectory.classification === 'deteriorating' ? (
                <AlertCircle className="w-6 h-6 text-red-600" />
              ) : (
                <History className="w-6 h-6 text-brand-600" />
              )}
            </div>
            <div>
              <ExecutiveText variant="label" className="text-foreground font-bold mb-1 uppercase tracking-wide">
                {historicalEvolution.trajectory.classification === 'strengthening' ? 'Expansão patrimonial consistente' :
                 historicalEvolution.trajectory.classification === 'deteriorating' ? 'Retração patrimonial material' :
                 historicalEvolution.trajectory.classification === 'stable' ? 'Manutenção da estrutura de capital' : 
                 historicalEvolution.trajectory.classification}
              </ExecutiveText>
              <ExecutiveText variant="bodyStandard" className="text-muted-foreground leading-relaxed">
                {historicalEvolution.trajectory.explanation}
              </ExecutiveText>
            </div>
          </div>
        </div>

        {/* Movimentos Principais */}
        <div className="mb-8">
          <ExecutiveText variant="label" className="text-foreground font-semibold mb-4 uppercase tracking-wider">
            Movimentos Estruturais Principais
          </ExecutiveText>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {historicalEvolution.movements.map((movement, idx) => (
              <div key={idx} className="bg-background border border-border p-4 rounded-lg shadow-sm">
                <div className="flex justify-between items-center mb-2">
                  <ExecutiveText variant="bodyStandard" className="font-semibold text-foreground">
                    {movement.metric}
                  </ExecutiveText>
                  <span className={`text-sm font-bold ${typeof movement.variation.percentage === 'number' ? (movement.variation.percentage > 0 ? 'text-green-600' : 'text-red-600') : 'text-muted-foreground'}`}>
                    {typeof movement.variation.percentage === 'number' ? `${movement.variation.percentage > 0 ? '+' : ''}${movement.variation.percentage.toFixed(1)}%` : movement.variation.percentage === 'SIGN_INVERSION' ? 'Inversão de Sinal' : 'N/A'}
                  </span>
                </div>
                <ExecutiveText variant="caption" className="text-muted-foreground italic mb-2">
                  {movement.period}
                </ExecutiveText>
                <ExecutiveText variant="bodyStandard" className="text-muted-foreground leading-tight">
                  {movement.interpretation}
                </ExecutiveText>
              </div>
            ))}
          </div>
        </div>

        {/* Questão Executiva Derivada */}
        <div className="bg-brand-900 text-brand-50 p-6 rounded-xl relative overflow-hidden">
          <div className="flex items-start gap-4">
            <HelpCircle className="w-6 h-6 text-brand-300 mt-1 flex-shrink-0" />
            <div>
              <ExecutiveText variant="label" className="text-brand-300 uppercase tracking-wider mb-2 block">
                Ponto de Reflexão Histórica
              </ExecutiveText>
              <ExecutiveText variant="bodyLarge" className="text-brand-50 font-medium leading-relaxed">
                Quais mudanças relevantes podem ser observadas na estrutura patrimonial ao longo do período de {historicalEvolution.periodCoverage.firstYear} a {historicalEvolution.periodCoverage.lastYear}?
              </ExecutiveText>
              <ExecutiveText variant="bodyStandard" className="text-brand-200 mt-4 italic">
                {historicalEvolution.executiveContext.implication}
              </ExecutiveText>
            </div>
          </div>
        </div>

      </ExecutiveSurface>
    </div>
  );
}
