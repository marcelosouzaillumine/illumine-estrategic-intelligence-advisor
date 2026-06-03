import { LifecycleClassificationEngine, LifecycleStage } from '../core/runtime/semantic/LifecycleClassificationEngine';

export interface FiscalYearScope {
  selectedYear: number;
  analysisMode: 'ANNUAL' | 'LONGITUDINAL';
  currentYearData: {
    bp: any[];
    dre: any[];
    dfc: any[];
    dlpa: any[];
    indicators: any[];
  };
  previousYearsData: any[];
  historicalDataToDate: any[];
  futureYearsData?: any[]; // optional, ideally not passed to annual engines
  historicalCycles: number;
  isFirstCycle: boolean;
  lifecycleStage: LifecycleStage;
}

export function buildFiscalYearScope({
  selectedYear,
  allHistoryData = [],
  foundationYear,
  analysisMode = 'ANNUAL'
}: {
  selectedYear: number;
  allHistoryData: any[];
  foundationYear?: number;
  analysisMode?: 'ANNUAL' | 'LONGITUDINAL';
}): FiscalYearScope {
  const selectedYearNum = Number(selectedYear);
  const foundationYearNum = foundationYear ? Number(foundationYear) : selectedYearNum - 1; // Default to previous year if unknown

  const currentYearRecords = allHistoryData.filter((x: any) => Number(x.year) === selectedYearNum);
  const previousYearsData = allHistoryData.filter((x: any) => Number(x.year) < selectedYearNum);
  const historicalDataToDate = allHistoryData.filter((x: any) => Number(x.year) <= selectedYearNum);
  const futureYearsData = allHistoryData.filter((x: any) => Number(x.year) > selectedYearNum);

  // Normalize currentYearData into distinct statements
  const currentYearData = {
    bp: currentYearRecords.filter((x: any) => x.type === 'Ativo' || x.type === 'Passivo' || x.docType === 'BP' || String(x.type).toUpperCase().includes('BP')),
    dre: currentYearRecords.filter((x: any) => x.type === 'DRE' || x.docType === 'DRE'),
    dfc: currentYearRecords.filter((x: any) => x.type === 'DFC' || x.docType === 'DFC'),
    dlpa: currentYearRecords.filter((x: any) => x.type === 'DLPA' || x.docType === 'DLPA'),
    indicators: currentYearRecords.filter((x: any) => x.type === 'INDICATOR' || x.category === 'Indicator')
  };

  const distinctFiscalYears = new Set(historicalDataToDate.map((x: any) => Number(x.year)));
  const historicalCycles = distinctFiscalYears.size;
  const isFirstCycle = historicalCycles <= 1 || selectedYearNum <= foundationYearNum + 1;

  const lifecycleStage = LifecycleClassificationEngine.classify({
    historicalCycles,
    analysisYear: selectedYearNum,
    foundationYear: foundationYearNum
  });

  const scope: FiscalYearScope = {
    selectedYear: selectedYearNum,
    analysisMode,
    currentYearData,
    previousYearsData,
    historicalDataToDate,
    historicalCycles,
    isFirstCycle,
    lifecycleStage
  };

  if (analysisMode === 'LONGITUDINAL') {
    scope.futureYearsData = futureYearsData;
  }

  return scope;
}
