import React from 'react';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveHeading } from '../../ui/executive-heading';
import { ExecutiveText } from '../../ui/executive-typography';
import { Activity, ShieldCheck, Info } from 'lucide-react';
import { FinancialPositionScoreResult } from '../../../core/experience/contracts/FinancialPositionPureViewModel';

interface FinancialPositionScoreSectionProps {
  score?: FinancialPositionScoreResult;
}

export function FinancialPositionScoreSection({ score }: FinancialPositionScoreSectionProps) {
  if (!score || !score.available || !score.overall) return null;

  return (
    <div className="mb-8">
      <ExecutiveSurface variant="default" elevation="md" className="p-8 border-t border-t-border/40">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Activity className="text-foreground w-6 h-6" />
              <ExecutiveHeading as="h2" variant="moduleTitle" className="text-foreground">
                Financial Position Score™
              </ExecutiveHeading>
            </div>
            <ExecutiveText variant="bodyStandard" className="text-muted-foreground max-w-2xl">
              {score.overall.explanation}
            </ExecutiveText>
          </div>
          <div className="flex items-center gap-2 bg-brand-50 px-4 py-2 rounded-lg border border-brand-100">
            <Info className="w-4 h-4 text-brand-600" />
            <ExecutiveText variant="label" className="text-brand-800">
              Confiança da Análise: {score.overall.confidence === 'HIGH' ? 'Alta' : score.overall.confidence === 'MEDIUM' ? 'Média' : 'Baixa'}
            </ExecutiveText>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Overall Score */}
          <div className="col-span-1 flex flex-col items-center justify-center p-6 bg-background rounded-xl border border-border shadow-sm">
            <ExecutiveText variant="label" className="text-muted-foreground uppercase tracking-wider mb-2">
              Score Geral
            </ExecutiveText>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold text-foreground">{score.overall.value}</span>
              <span className="text-xl text-muted-foreground">/100</span>
            </div>
            <ExecutiveText variant="bodyStandard" className="mt-2 font-medium text-center">
              {score.overall.classification}
            </ExecutiveText>
          </div>

          {/* Dimensions */}
          <div className="col-span-1 md:col-span-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
            <DimensionCard title="Liquidez" dimension={score.dimensions.liquidity} />
            <DimensionCard title="Solvência e Estrutura" dimension={score.dimensions.solvencyAndCapitalStructure} />
            <DimensionCard title="Capital de Giro" dimension={score.dimensions.workingCapital} />
            <DimensionCard title="Qualidade do Ativo" dimension={score.dimensions.assetQuality} />
            <DimensionCard title="Evolução" dimension={score.dimensions.evolution} />
          </div>
        </div>
      </ExecutiveSurface>
    </div>
  );
}

function DimensionCard({ title, dimension }: { title: string, dimension: any }) {
  if (!dimension) return null;
  
  return (
    <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
      <div className="flex items-center justify-between mb-2">
        <ExecutiveText variant="label" className="text-foreground font-semibold">
          {title}
        </ExecutiveText>
        <span className="text-sm font-bold text-muted-foreground">{dimension.value}</span>
      </div>
      
      {/* Visual progress bar */}
      <div className="w-full bg-border h-1.5 rounded-full mb-3 overflow-hidden">
        <div 
          className="h-full bg-brand-500 rounded-full" 
          style={{ width: `${dimension.value}%` }} 
        />
      </div>

      <ExecutiveText variant="caption" className="text-muted-foreground leading-tight">
        {dimension.interpretation}
      </ExecutiveText>
    </div>
  );
}
