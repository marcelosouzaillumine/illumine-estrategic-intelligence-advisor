import React from 'react';
import { CommercialPipelineReadModel } from '@application/revenue/pipeline/read-models/CommercialPipelineReadModel';
import { ExecutiveMetricCard } from '@/components/ui/executive-metric-card';
import { PipelineKanbanBoard } from './PipelineKanbanBoard';
import { Target, TrendingUp, Handshake, ShieldAlert, CircleDollarSign, CheckSquare, Activity, Briefcase } from 'lucide-react';
import { ExecutiveText } from '@/components/ui/executive-typography';

interface CommercialPipelineDashboardProps {
  pipeline: CommercialPipelineReadModel;
  onSelectOpportunity?: (id: string) => void;
}

export function CommercialPipelineDashboard({ pipeline, onSelectOpportunity }: CommercialPipelineDashboardProps) {
  const { metrics, board } = pipeline;

  const kpis = [
    { label: 'Pipeline Coverage', value: `${metrics.pipelineCoverage}x`, icon: Target, context: 'vs Quota' },
    { label: 'Forecast Accuracy', value: `${metrics.forecastAccuracy}%`, icon: CheckSquare, context: 'Historic' },
    { label: 'Expected ARR', value: `$${(metrics.expectedArr / 1000).toFixed(0)}k`, icon: TrendingUp, context: 'Risk-adjusted' },
    { label: 'Avg Ticket', value: `$${(metrics.averageTicket / 1000).toFixed(1)}k`, icon: CircleDollarSign, context: 'Enterprise' },
    { label: 'Sales Cycle', value: `${metrics.averageSalesCycle}d`, icon: Activity, context: 'Avg Lead to Close' },
    { label: 'Gross Margin', value: `${metrics.expectedGrossMargin}%`, icon: ShieldAlert, context: 'Expected' },
    { label: 'Active Partners', value: metrics.activeExecutivePartners, icon: Handshake, context: 'Institutional' },
    { label: 'Active Advisors', value: metrics.activeAdvisors, icon: Briefcase, context: 'Certified' }
  ];

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Revenue Header Area / Executive KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <ExecutiveMetricCard 
            key={index}
            label={kpi.label}
            value={kpi.value}
            icon={kpi.icon}
            helper={kpi.context}
            density="analytical"
          />
        ))}
      </div>

      {/* Commercial Pipeline Board */}
      <div className="flex-1 min-h-0 bg-white rounded-3xl border border-border shadow-sm flex flex-col p-8">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <div>
            <ExecutiveText variant="moduleTitle">Commercial Pipeline</ExecutiveText>
            <ExecutiveText variant="caption" className="text-muted-foreground mt-1">
              {metrics.activeOpportunities} active opportunities • ${(metrics.totalPipelineValue / 1000000).toFixed(1)}M Total Value
            </ExecutiveText>
          </div>
        </div>
        
        <div className="flex-1 min-h-0 relative">
          <div className="absolute inset-0">
            <PipelineKanbanBoard cards={board.cards} onSelectCard={onSelectOpportunity} />
          </div>
        </div>
      </div>
    </div>
  );
}
