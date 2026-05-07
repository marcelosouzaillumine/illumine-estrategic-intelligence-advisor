
export interface BenchmarkMetric {
  min: number;
  median: number;
  top: number;
  unit: string;
}

export interface SectorBenchmarks {
  ebitdaMargin: BenchmarkMetric;
  currentLiquidity: BenchmarkMetric;
  leverage: BenchmarkMetric; // Net Debt / EBITDA
  netMargin: BenchmarkMetric;
}

export const SECTOR_BENCHMARKS: Record<string, SectorBenchmarks> = {
  'Saúde': {
    ebitdaMargin: { min: 8, median: 15, top: 22, unit: '%' },
    currentLiquidity: { min: 0.9, median: 1.2, top: 1.8, unit: 'x' },
    leverage: { min: 3.5, median: 2.2, top: 1.0, unit: 'x' }, // For leverage, lower is usually better, but I'll store them as absolute values and handle display logic
    netMargin: { min: 2, median: 5, top: 10, unit: '%' }
  },
  'Indústria': {
    ebitdaMargin: { min: 10, median: 18, top: 28, unit: '%' },
    currentLiquidity: { min: 1.0, median: 1.5, top: 2.5, unit: 'x' },
    leverage: { min: 4.0, median: 2.5, top: 1.5, unit: 'x' },
    netMargin: { min: 3, median: 7, top: 12, unit: '%' }
  },
  'Varejo': {
    ebitdaMargin: { min: 4, median: 7, top: 12, unit: '%' },
    currentLiquidity: { min: 0.8, median: 1.1, top: 1.5, unit: 'x' },
    leverage: { min: 4.5, median: 3.0, top: 2.0, unit: 'x' },
    netMargin: { min: 1, median: 3, top: 6, unit: '%' }
  },
  'Serviços': {
    ebitdaMargin: { min: 15, median: 25, top: 40, unit: '%' },
    currentLiquidity: { min: 1.2, median: 2.0, top: 3.5, unit: 'x' },
    leverage: { min: 3.0, median: 1.5, top: 0.5, unit: 'x' },
    netMargin: { min: 8, median: 15, top: 25, unit: '%' }
  },
  'Tecnologia': {
    ebitdaMargin: { min: 10, median: 22, top: 45, unit: '%' },
    currentLiquidity: { min: 1.5, median: 3.0, top: 6.0, unit: 'x' },
    leverage: { min: 2.5, median: 1.0, top: 0.0, unit: 'x' },
    netMargin: { min: 5, median: 12, top: 30, unit: '%' }
  }
};

export const BENCHMARK_SOURCES = [
  { name: 'Banco Central do Brasil', metric: 'Indicadores de Crédito e Endividamento' },
  { name: 'Serasa Experian', metric: 'Painel de Inadimplência e Saúde PME' },
  { name: 'CVM / B3', metric: 'Relatórios de Desempenho Setorial (Empresas Listadas)' },
  { name: 'Big Four Publications', metric: 'Benchmarks de Rentabilidade e Estrutura de Capital' }
];
