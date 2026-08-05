export const startupCompanyFixture = {
  performance: {
    revenue: { value: 1000000, percentageChange: 80 },
    ebitda: { value: -500000, margin: -50 },
  },
  cashIntelligence: {
    liquidity: { runwayDays: 360 } // Well funded
  },
  insights: [
    {
      title: 'Hipercrescimento e Runway',
      description: 'A receita quase dobrou, sustentada por captação que garante 12 meses de runway.',
      confidenceScore: 90
    }
  ]
};
