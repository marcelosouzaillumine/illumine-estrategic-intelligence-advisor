import React, { useEffect, useState } from 'react';
import { useCfoPerformance } from '../../../workspace/data/adapters/cfo-intelligence.adapter';
import { ExecutiveContext } from '../../../workspace/context/executive-context.types';
import { RevenuePerformanceWidget } from '../widgets/finance/RevenuePerformanceWidget';
import { EbitdaPerformanceWidget } from '../widgets/finance/EbitdaPerformanceWidget';
import { CashPositionWidget } from '../widgets/finance/CashPositionWidget';
import { ForecastNarrativeWidget } from '../widgets/finance/ForecastNarrativeWidget';

const DUMMY_CONTEXT: ExecutiveContext = {
  office: 'cfo',
  period: { type: 'monthly', month: 8, year: 2026 },
  scenario: 'actual',
  currency: 'BRL'
};

export function CFOPerformanceSurface() {
  const { data, loading, error } = useCfoPerformance(DUMMY_CONTEXT);

  if (loading || !data) {
    return (
      <div className="flex-1 w-full h-full p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
          <p className="text-muted-foreground text-sm font-medium">Carregando Executive Intelligence...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full h-full p-4 sm:p-6 lg:p-8 overflow-y-auto bg-surface-base">
      <div className="max-w-[1200px] mx-auto space-y-6">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Financial Performance</h1>
          <p className="text-sm text-muted-foreground mt-1">CFO Office • Visão Executiva Consolidada</p>
        </div>

        {/* Executive Summary Narrative */}
        <ForecastNarrativeWidget insights={data.insights} />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <RevenuePerformanceWidget 
            value={data.revenue.value} 
            trend={data.revenue.trend} 
            percentageChange={data.revenue.percentageChange} 
          />
          <EbitdaPerformanceWidget 
            value={data.ebitda.value} 
            margin={data.ebitda.margin} 
            trend={data.ebitda.trend} 
          />
          <CashPositionWidget 
            value={data.cashFlow.value} 
            trend={data.cashFlow.trend} 
          />
        </div>

      </div>
    </div>
  );
}
