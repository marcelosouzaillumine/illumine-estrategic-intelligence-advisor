import { TemporalFiduciaryIntegrityEngine, TemporalValidationResult } from './TemporalFiduciaryIntegrityEngine';

export interface FilterResult {
  filteredRawData: any;
  validationResult: TemporalValidationResult;
}

export class TemporalEvidenceFilter {
  public static filter(rawData: any, analysisYear: number): FilterResult {
    if (!rawData || typeof rawData !== 'object') {
      return {
        filteredRawData: rawData,
        validationResult: {
          analysisYear,
          eligibleYears: [],
          blockedYears: [],
          temporalIntegrity: 'VALID',
          perspective: 'EXECUTIVE'
        }
      };
    }

    // Determine perspective
    const perspective: 'EXECUTIVE' | 'RETROSPECTIVE' = (
      rawData.perspective === 'RETROSPECTIVE' ||
      rawData.runtimeMode === 'RETROSPECTIVE' ||
      rawData.compliance?.runtimeMode === 'RETROSPECTIVE' ||
      rawData.rawFinancialData?.runtimeMode === 'RETROSPECTIVE' ||
      rawData.rawFinancialData?.perspective === 'RETROSPECTIVE'
    ) ? 'RETROSPECTIVE' : 'EXECUTIVE';

    const integrityOverride = !!(rawData.integrityOverride || rawData.rawFinancialData?.integrityOverride);

    // Detect all years present in raw input arrays
    const detectedYears: number[] = [];
    const collectYears = (arr: any[]) => {
      if (!Array.isArray(arr)) return;
      arr.forEach(item => {
        if (item && typeof item === 'object') {
          const yr = Number(item.year);
          if (!isNaN(yr) && yr > 0) {
            detectedYears.push(yr);
          }
        }
      });
    };

    collectYears(rawData.bpData);
    collectYears(rawData.dreData);
    collectYears(rawData.dfcData);
    collectYears(rawData.dfcDataForRuntime);
    collectYears(rawData.dlpaData);
    collectYears(rawData.historicalSeries);
    collectYears(rawData.historicalCyclesRaw);
    if (rawData.rawFinancialData && Array.isArray(rawData.rawFinancialData.allHistoryData)) {
      collectYears(rawData.rawFinancialData.allHistoryData);
    }
    if (rawData.rawFinancialData && Array.isArray(rawData.rawFinancialData.currentYearData)) {
      collectYears(rawData.rawFinancialData.currentYearData);
    }

    const validationResult = TemporalFiduciaryIntegrityEngine.validate(
      analysisYear,
      detectedYears,
      perspective,
      integrityOverride
    );

    const filteredRawData = { ...rawData };

    const filterArray = (arr: any[]) => {
      if (!Array.isArray(arr)) return arr;
      return arr.filter(item => {
        if (item && typeof item === 'object' && 'year' in item) {
          const yr = Number(item.year);
          return isNaN(yr) || yr <= analysisYear;
        }
        return true;
      });
    };

    if (perspective === 'EXECUTIVE') {
      if (filteredRawData.bpData) filteredRawData.bpData = filterArray(filteredRawData.bpData);
      if (filteredRawData.dreData) filteredRawData.dreData = filterArray(filteredRawData.dreData);
      if (filteredRawData.dfcData) filteredRawData.dfcData = filterArray(filteredRawData.dfcData);
      if (filteredRawData.dfcDataForRuntime) filteredRawData.dfcDataForRuntime = filterArray(filteredRawData.dfcDataForRuntime);
      if (filteredRawData.dlpaData) filteredRawData.dlpaData = filterArray(filteredRawData.dlpaData);
      if (filteredRawData.historicalSeries) filteredRawData.historicalSeries = filterArray(filteredRawData.historicalSeries);
      if (filteredRawData.historicalCyclesRaw) filteredRawData.historicalCyclesRaw = filterArray(filteredRawData.historicalCyclesRaw);

      if (filteredRawData.rawFinancialData) {
        filteredRawData.rawFinancialData = { ...filteredRawData.rawFinancialData };
        if (Array.isArray(filteredRawData.rawFinancialData.allHistoryData)) {
          filteredRawData.rawFinancialData.allHistoryData = filterArray(filteredRawData.rawFinancialData.allHistoryData);
        }
        if (Array.isArray(filteredRawData.rawFinancialData.currentYearData)) {
          filteredRawData.rawFinancialData.currentYearData = filterArray(filteredRawData.rawFinancialData.currentYearData);
        }
      }
    } else {
      // RETROSPECTIVE: Filter statement data to keep current calculations clean, but do not filter histories/series
      if (filteredRawData.bpData) filteredRawData.bpData = filterArray(filteredRawData.bpData);
      if (filteredRawData.dreData) filteredRawData.dreData = filterArray(filteredRawData.dreData);
      if (filteredRawData.dfcData) filteredRawData.dfcData = filterArray(filteredRawData.dfcData);
      if (filteredRawData.dfcDataForRuntime) filteredRawData.dfcDataForRuntime = filterArray(filteredRawData.dfcDataForRuntime);
      if (filteredRawData.dlpaData) filteredRawData.dlpaData = filterArray(filteredRawData.dlpaData);
      if (filteredRawData.historicalCyclesRaw) filteredRawData.historicalCyclesRaw = filterArray(filteredRawData.historicalCyclesRaw);
    }

    return { filteredRawData, validationResult };
  }

  public static filterByAnalysisYear(cycles: any[], analysisYear: number): any[] {
    if (!Array.isArray(cycles)) return [];
    return cycles.filter(item => {
      if (item && typeof item === 'object' && 'year' in item) {
        const yr = Number(item.year);
        return isNaN(yr) || yr <= analysisYear;
      }
      return true;
    });
  }
}
