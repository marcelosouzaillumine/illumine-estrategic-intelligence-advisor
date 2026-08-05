import React from 'react';
import { useCfoPlanning } from '../../../workspace/data/adapters/cfo-intelligence.adapter';
import { ExecutiveContext } from '../../../workspace/context/executive-context.types';
import { BudgetVarianceWidget } from '../widgets/finance/BudgetVarianceWidget';
import { ScenarioComparisonWidget } from '../widgets/finance/ScenarioComparisonWidget';
import { ForecastNarrativeWidget } from '../widgets/finance/ForecastNarrativeWidget';

const DUMMY_CONTEXT: ExecutiveContext = {
  office: 'cfo',
  period: { type: 'monthly', month: 8, year: 2026 },
  scenario: 'actual',
  currency: 'BRL'
};

export function CFOPlanningForecastSurface() {
  const { data, loading, error } = useCfoPlanning(DUMMY_CONTEXT);

  if (loading || !data) {
    return (
      <div className="flex-1 w-full h-full p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
          <p className="text-muted-foreground text-sm font-medium">Carregando Planning & Forecast...</p>
        </div>
      </div>
    );
  }

  // Convert scenario comparison map to array for chart
  const scenarioData = Object.entries(data.scenarios).map(([month, values]) => ({
    month,
    ...values
  }));

  return (
    <div className="flex-1 w-full h-full p-4 sm:p-6 lg:p-8 overflow-y-auto bg-surface-base">
      <div className="max-w-[1200px] mx-auto space-y-6">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Planning & Forecast</h1>
          <p className="text-sm text-muted-foreground mt-1">CFO Office • Realizado vs Orçado vs Projetado</p>
        </div>

        <ForecastNarrativeWidget insights={data.insights} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <BudgetVarianceWidget 
            varianceValue={data.budgetVariance.value} 
            variancePercentage={data.budgetVariance.percentage} 
          />
          {/* Reusing existing widget style for another metric to balance the row */}
          <div className="bg-surface-elevated border border-border rounded-xl p-5 shadow-sm h-full flex flex-col justify-center">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">Atingimento da Meta Anual</h3>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-2xl font-bold text-foreground">{(data.forecastVsTarget.percentage * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <ScenarioComparisonWidget data={scenarioData} />
        </div>

      </div>
    </div>
  );
}
