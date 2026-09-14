export interface NormalizedBalanceSheet {
  year: number;
  assets: {
    currentAssets?: number;
    nonCurrentAssets?: number;
    cashAndEquivalents?: number;
    accountsReceivable?: number;
    inventory?: number;
    fixedAssets?: number;
    total?: number;
  };
  liabilities: {
    currentLiabilities?: number;
    nonCurrentLiabilities?: number;
    suppliers?: number;
    laborObligations?: number;
    taxes?: number;
    financialDebtsShortTerm?: number;
    financialDebtsLongTerm?: number;
    total?: number;
  };
  equity: {
    capital?: number;
    retainedEarnings?: number;
    total?: number;
  };
}

export interface HistoricalPeriodCoverage {
  available: boolean;
  analysisPeriod: number;
  firstPeriod: number;
  lastPeriod: number;
  availablePeriods: number[];
  filteredPeriods: number[];
}

export interface NormalizedBalanceSheetDataset {
  current: NormalizedBalanceSheet;
  history: NormalizedBalanceSheet[];
  coverage: HistoricalPeriodCoverage;
}
