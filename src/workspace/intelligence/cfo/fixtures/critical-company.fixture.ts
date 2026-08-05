export const criticalCompanyFixture = {
  performance: {
    revenue: { value: 5000000, percentageChange: -10 },
    ebitda: { value: -200000, margin: -4 },
  },
  cashIntelligence: {
    liquidity: { runwayDays: 15 }
  },
  insights: [
    {
      title: 'Risco de Insolvência',
      description: 'O caixa suporta apenas 15 dias de operação devido à queima de caixa.',
      confidenceScore: 95
    }
  ]
};
