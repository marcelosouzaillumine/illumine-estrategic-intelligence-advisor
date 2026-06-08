export interface LegacyConsumptionRecord {
  component: string;
  field: string;
  source: 'LEGACY' | 'GOVERNANCE_OUTPUT';
  exerciseYear: number;
}

export class BalanceSheetLegacyConsumptionAudit {
  /**
   * Maps exactly which components are consuming legacy fallbacks.
   */
  public static auditConsumption(
    componentName: string,
    fieldName: string,
    content: string,
    exerciseYear: number
  ): LegacyConsumptionRecord {
    // Very simplified heuristic to detect our known legacy strings
    const isLegacy = 
      content.includes('59,6 mil') || 
      content.includes('Liquidez Real (0,32)') || 
      content.includes('Liquidez Instantânea Real (0,17)') || 
      content.includes('51% do ativo total') || 
      content.includes('Loss Absorption Crítico');

    return {
      component: componentName,
      field: fieldName,
      source: isLegacy ? 'LEGACY' : 'GOVERNANCE_OUTPUT',
      exerciseYear
    };
  }
}
