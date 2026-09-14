import React from 'react';
import { useCfoCashIntelligence } from '../../../workspace/data/adapters/cfo-intelligence.adapter';
import { ExecutiveContext } from '../../../workspace/context/executive-context.types';
import { CashPositionWidget } from '../widgets/finance/CashPositionWidget';
import { CashForecastWidget } from '../widgets/finance/CashForecastWidget';
import { LiquidityRiskWidget } from '../widgets/finance/LiquidityRiskWidget';
import { ForecastNarrativeWidget } from '../widgets/finance/ForecastNarrativeWidget';

const DUMMY_CONTEXT: ExecutiveContext = {
  office: 'cfo',
  period: { type: 'monthly', month: 8, year: 2026 },
  scenario: 'actual',
  currency: 'BRL'
};

export function CFOCashIntelligenceSurface() {
  const { data, loading, error } = useCfoCashIntelligence(DUMMY_CONTEXT);

  if (loading || !data) {
    return (
      <div className="flex-1 w-full h-full p-4 sm:p-6 lg:p-8 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin mb-4" />
          <p className="text-muted-foreground text-sm font-medium">Carregando Cash Governance...</p>
        </div>
      </div>
    );
  }

  // Convert mock data forecast object to array for chart
  const forecastData = Object.entries(data.forecast.monthly).map(([month, values]) => ({
    period: month,
    ...values
  }));

  return (
    <div className="flex-1 w-full h-full p-4 sm:p-6 lg:p-8 overflow-y-auto bg-surface-base">
      <div className="max-w-[1200px] mx-auto space-y-6">
        
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Cash Governance</h1>
          <p className="text-sm text-muted-foreground mt-1">CFO Office • Visão de Liquidez e Ciclo de Caixa</p>
        </div>

        <ForecastNarrativeWidget insights={data.insights} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CashPositionWidget 
            value={data.freeCashFlow.value} 
            trend={data.freeCashFlow.trend} 
          />
          <LiquidityRiskWidget 
            risk={data.liquidity.risk as any} 
            runwayDays={data.liquidity.runwayDays} 
          />
        </div>

        <div className="mt-6">
          <CashForecastWidget data={forecastData} />
        </div>

      </div>
    </div>
  );
}
