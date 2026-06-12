import React from 'react';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { BalanceSheetRiskDivergenceViewModel } from './view-models';
import { cn } from '../../../lib/utils';
import { ExecutiveSurface } from '../../ui/executive-surface';
import { ExecutiveMetricCard } from '../../ui/executive-metric-card';
import { ExecutiveRiskRow } from '../../ui/executive-risk-row';

export function BalanceSheetRiskDivergenceSection({
  viewModel
}: {
  viewModel: BalanceSheetRiskDivergenceViewModel;
}) {
  const getCardTone = (tone: string): 'neutral' | 'success' | 'warning' | 'critical' | 'info' => {
    switch (tone) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'critical': return 'critical';
      case 'info': return 'info';
      default: return 'neutral';
    }
  };

  const getBadgeColor = (tone: string) => {
    switch (tone) {
      case 'success': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'critical': return 'bg-critical';
      case 'info': return 'bg-info';
      default: return 'bg-foreground/20';
    }
  };

  const getBadgeLabel = (tone: string) => {
    switch (tone) {
      case 'success': return 'ESTÁVEL';
      case 'warning': return 'ATENÇÃO';
      case 'critical': return 'CRÍTICO';
      case 'info': return 'INFO';
      default: return 'NEUTRO';
    }
  };

  return (
    <ExecutiveSurface variant="transparent" padding="none" className="bg-surface-container/30 rounded-[32px] p-8 border border-border mt-12 relative overflow-hidden flex flex-col items-start justify-start w-full">
      <div className="w-full flex flex-col items-start justify-start gap-8">
        <div className="w-full flex-1 flex flex-col items-start justify-start">
          <h3 className="text-xl font-bold text-foreground mb-4">Análise de Divergência de Risco</h3>
          
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <ExecutiveMetricCard
              label="Classificação Matemática"
              value={viewModel.mathClassificationLabel}
            />
            
            <ExecutiveMetricCard
              label="Classificação Fiduciária"
              value={viewModel.fiduciaryClassificationLabel}
              tone={getCardTone(viewModel.fiduciaryClassificationTone)}
              statusBadge={
                <span>{getBadgeLabel(viewModel.fiduciaryClassificationTone)}</span>
              }
            />
            
            <ExecutiveMetricCard
              label="Indicador de Síntese"
              value={
                <div className="flex items-baseline gap-1">
                  <span>{viewModel.globalScore}</span>
                  <span className="text-[10px] font-bold text-foreground/70 uppercase tracking-widest">pontos</span>
                </div>
              }
            />
          </div>
          
          {viewModel.criticalOffenders && viewModel.criticalOffenders.length > 0 && (
            <ExecutiveSurface variant="transparent" padding="none" className="w-full bg-gradient-to-br from-rose-500/[0.03] to-transparent border border-rose-200/50 p-6 sm:p-8 rounded-[32px] relative overflow-hidden flex flex-col items-start justify-start">
              <div className="absolute -top-10 -right-10 p-8 opacity-[0.03]">
                <AlertTriangle size={180} strokeWidth={1} />
              </div>
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="p-3 bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-xl shadow-lg shadow-rose-500/30">
                  <AlertTriangle size={20} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col items-start justify-start">
                  <h4 className="text-lg font-bold text-foreground tracking-tight">Ofensores Fiduciários Críticos</h4>
                  <p className="text-[11px] font-bold text-rose-600/80 uppercase tracking-[0.2em] mt-1">Matriz de Impacto Estrutural</p>
                </div>
              </div>
              
              <div className="w-full flex flex-col relative z-10 items-start justify-start border border-border/30 rounded-[24px] overflow-hidden bg-card shadow-sm">
                {viewModel.criticalOffenders.map((offender, i) => {
                  // Define o tone com base na classificação. (Nesta seção a maioria é crítico)
                  const classStr = offender.classification.toUpperCase();
                  let tone: "critical" | "warning" | "success" | "info" | "neutral" = "critical";
                  if (classStr.includes("ATENÇÃO") || classStr.includes("WARNING") || classStr.includes("ALERTA") || classStr.includes("MODERAD")) {
                    tone = "warning";
                  }

                  return (
                    <ExecutiveRiskRow
                      key={i}
                      title={offender.metricName}
                      severityTone={tone}
                      severityLabel={offender.classification}
                      consequence={offender.impact}
                      action={<AlertCircle size={14} />}
                    />
                  );
                })}
              </div>
            </ExecutiveSurface>
          )}
        </div>
      </div>
    </ExecutiveSurface>
  );
}
