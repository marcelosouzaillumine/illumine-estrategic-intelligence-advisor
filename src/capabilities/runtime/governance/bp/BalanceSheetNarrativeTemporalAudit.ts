export class BalanceSheetNarrativeTemporalAudit {
  constructor(...args: any[]) {}
  [key: string]: any;
  static [key: string]: any;
  static audit(narrative: string, summary: any, indicators: any[]): { isDriftDetected: boolean; violations: string[] } {
    const violations: string[] = [];
    
    // Extractor helper to find currency strings and parse them
    const extractCurrency = (text: string, keyword: string): number | null => {
      const regex = new RegExp(`${keyword}[^R\\$]*R\\$\\s*([\\d\\.,]+)`, 'i');
      const match = text.match(regex);
      if (match && match[1]) {
        return parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
      }
      return null;
    };

    const extractRatio = (text: string, keyword: string): number | null => {
      const regex = new RegExp(`${keyword}[^\\d]*([\\d\\.,]+)`, 'i');
      const match = text.match(regex);
      if (match && match[1]) {
        return parseFloat(match[1].replace(/\./g, '').replace(',', '.'));
      }
      return null;
    };

    // 1. Patrimônio Líquido
    const expectedPL = summary.patrimonioLiquido;
    if (expectedPL !== undefined && expectedPL !== null) {
      const extractedPL = extractCurrency(narrative, 'patrimônio líquido');
      if (extractedPL !== null) {
        const diff = Math.abs(extractedPL - expectedPL);
        const monetaryTolerance = Math.min(1000, Math.abs(expectedPL) * 0.01);
        if (diff > monetaryTolerance) {
          violations.push(`SEMANTIC_DRIFT_DETECTED: Patrimônio Líquido (Esperado: ${expectedPL}, Encontrado: ${extractedPL})`);
        }
      }
    }

    // 2. Liquidez Real e Instantânea
    const liqRealInd = indicators.find(i => i.metricName === 'Liquidez Real');
    if (liqRealInd && liqRealInd.value !== undefined && !isNaN(Number(liqRealInd.value))) {
      const expectedLiqReal = Number(liqRealInd.value);
      const extractedLiqReal = extractRatio(narrative, 'Liquidez Real de');
      if (extractedLiqReal !== null) {
        const diff = Math.abs(extractedLiqReal - expectedLiqReal);
        if (diff > 0.1) {
          violations.push(`SEMANTIC_DRIFT_DETECTED: Liquidez Real (Esperado: ${expectedLiqReal}, Encontrado: ${extractedLiqReal})`);
        }
      }
    }

    const liqInstInd = indicators.find(i => i.metricName === 'Liquidez Instantânea Real');
    if (liqInstInd && liqInstInd.value !== undefined && !isNaN(Number(liqInstInd.value))) {
      const expectedLiqInst = Number(liqInstInd.value);
      const extractedLiqInst = extractRatio(narrative, 'Instantânea Real de');
      if (extractedLiqInst !== null) {
        const diff = Math.abs(extractedLiqInst - expectedLiqInst);
        if (diff > 0.1) {
          violations.push(`SEMANTIC_DRIFT_DETECTED: Liquidez Instantânea Real (Esperado: ${expectedLiqInst}, Encontrado: ${extractedLiqInst})`);
        }
      }
    }

    // 3. Capital Consumido (%)
    const capConsumidoInd = indicators.find(i => i.metricName === 'Capital Consumido');
    if (capConsumidoInd && capConsumidoInd.value !== undefined && !isNaN(Number(capConsumidoInd.value))) {
      const expectedCapConsumido = Number(capConsumidoInd.value) * 100;
      const extractedCapConsumido = extractRatio(narrative, 'representam'); // "estes representam X% do capital social"
      if (extractedCapConsumido !== null) {
        const diff = Math.abs(extractedCapConsumido - expectedCapConsumido);
        if (diff > 0.5) {
          violations.push(`SEMANTIC_DRIFT_DETECTED: Capital Consumido (Esperado: ${expectedCapConsumido}%, Encontrado: ${extractedCapConsumido}%)`);
        }
      }
    }

    return {
      isDriftDetected: violations.length > 0,
      violations
    };
  }
}
