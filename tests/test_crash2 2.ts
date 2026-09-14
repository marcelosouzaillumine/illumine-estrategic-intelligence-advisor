import { BalanceSheetIntelligenceUseCase } from '../src/capabilities/financial/application/usecases/BalanceSheetIntelligenceUseCase';

const input = {
  current: {
    ano: 2025,
    ativoTotal: 2342899.29,
    ativoCirculante: 1997906.06
  },
  history: [
    {
      ano: 2025,
      ativoTotal: 2342899.29,
      ativoCirculante: 1997906.06
    }
  ],
  analysisPeriod: 2025
};

const usecase = new BalanceSheetIntelligenceUseCase();
try {
  const result = usecase.analyzeBalanceSheet(input as any);
  console.log("SUCCESS");
  console.log(result.pureViewModel.overview.observation);
} catch (e) {
  console.error("CRASHED:", e);
}
