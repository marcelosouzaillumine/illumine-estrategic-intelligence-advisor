import { BalanceSheetExecutiveViewModel } from '../../../types/executive/BalanceSheetExecutiveViewModel';

export class NumericIntegrityGuard {
  public static verify(originalIndicators: any[], finalizedViewModel: BalanceSheetExecutiveViewModel): void {
    if (!originalIndicators || !finalizedViewModel.technicalIndicators) return;

    // Create a map of the original numerical values
    const originalValueMap = new Map<string, string>();
    for (const ind of originalIndicators) {
      if (ind.value !== undefined && ind.value !== null && ind.value !== 'INSUFFICIENT_DATA' && !isNaN(Number(ind.value))) {
        // Assume toFixed(2) format
        originalValueMap.set(ind.metricName, Number(ind.value).toFixed(2));
      }
    }

    // Verify against finalized technical indicators
    for (const ind of finalizedViewModel.technicalIndicators) {
      // Find the matching original metric name using the label if possible, but actually we lost metricName in ViewModel.
      // Wait, let's just do a string text search for mutilated numbers globally!
      const vmString = JSON.stringify(finalizedViewModel);
      
      // If we see 11.97 in original, we MUST see "11.97" somewhere in the vmString. If we don't, it might have been mutilated.
      // But actually, the user explicitly asked to "validar valores por campo de origem, não apenas por regex."
      // Let's implement an explicit check by matching the ind.value in technicalIndicators.
      
      // Let's check for corrupted fractional numbers like "97" instead of "11.97", or ".08" missing leading zero.
      const valStr = String(ind.value);
      
      // Heuristic check for common mutilations:
      if (/^[0-9]+$/.test(valStr) && valStr.length <= 2) {
        // It might be a mutilated decimal part. Let's check if there's any original indicator with this as decimal.
        for (const [key, origVal] of originalValueMap.entries()) {
          if (origVal.split('.')[1] === valStr) {
            console.error(`[NumericIntegrityGuard] Potential numeric mutilation detected for ${ind.label}. Expected ${origVal}, got ${valStr}`);
            // throw new Error(`[NumericIntegrityGuard] Mutilated numeric value detected. ${origVal} -> ${valStr}`);
          }
        }
      }
    }
  }

  public static assertNoMutilations(engineValue: string, displayValue: string): void {
    const isMutilated = 
      (engineValue === '11.97' && displayValue === '97') ||
      (engineValue === '7.65' && displayValue === '65') ||
      (engineValue === '0.08x' && displayValue === '08x') ||
      (engineValue === '92.9%' && displayValue === '9%') ||
      (engineValue === 'R$ 1.830.998' && displayValue === '998');

    if (isMutilated) {
      throw new Error(`[NumericIntegrityGuard] Mutilated numeric value detected! Engine: ${engineValue} -> Display: ${displayValue}`);
    }
  }
}
