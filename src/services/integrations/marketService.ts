/**
 * Market Service
 * Integration with Banco Central do Brasil (SGS) and other sources for financial benchmarks.
 */

export interface MarketBenchmark {
  name: string;
  value: number;
  color: string;
  degraded?: boolean;
}

export const fetchBenchmarks = async (): Promise<MarketBenchmark[]> => {
  try {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    const monthStr = lastMonth.getMonth() + 1;
    const yearStr = lastMonth.getFullYear();

    // No hardcoded fallbacks per architectural rules
    const benchmarks: MarketBenchmark[] = [
      { name: 'CDI', value: 0, color: 'text-blue-500', degraded: true },
      { name: 'IPCA', value: 0, color: 'text-rose-500', degraded: true },
      { name: 'Poupança', value: 0, color: 'text-amber-500', degraded: true },
      { name: 'Ibovespa', value: 0, color: 'text-emerald-500', degraded: true }
    ];

    try {
      // 1. Fetch CDI from BCB (Code 4391 - CDI acumulada no mês)
      const cdiResponse = await fetch(`https://api.bcb.gov.br/dados/serie/bcdata.sgs.4391/dados/ultimos/1?formato=json`);
      const cdiData = await cdiResponse.json();
      if (cdiData && cdiData.length > 0) {
        benchmarks[0].value = parseFloat(cdiData[0].valor);
        benchmarks[0].degraded = false;
      }

      // 2. Fetch IPCA from BCB (Code 433 - IPCA mensal)
      const ipcaResponse = await fetch(`https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/1?formato=json`);
      const ipcaData = await ipcaResponse.json();
      if (ipcaData && ipcaData.length > 0) {
        benchmarks[1].value = parseFloat(ipcaData[1]?.valor || ipcaData[0].valor);
        benchmarks[1].degraded = false;
      }

      // 3. Fetch Ibovespa (Requires stock market APIs)
      // No mock data. Value remains 0 / degraded until integrated with real API.

    } catch (err) {
      console.warn('Market Data Fetch Error (operating in degraded mode):', err);
    }

    return benchmarks;
  } catch (error) {
    console.error('Critical Market Service Error (returning degraded mode):', error);
    return [
      { name: 'CDI', value: 0, color: 'text-blue-500', degraded: true },
      { name: 'IPCA', value: 0, color: 'text-rose-500', degraded: true },
      { name: 'Poupança', value: 0, color: 'text-amber-500', degraded: true },
      { name: 'Ibovespa', value: 0, color: 'text-emerald-500', degraded: true }
    ];
  }
};
