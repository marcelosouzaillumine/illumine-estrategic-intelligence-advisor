import { buildBPHierarchy, BPSummary } from '../../lib/bpEngine';
import { calculateDreCascade } from '../../lib/dreCascade';
import { calculateFinancialMetrics, FinancialMetrics } from '../../lib/financial-engine';
import { HistoricalPeriodData } from '../intelligence/temporal-causality-engine';

export interface HistoricalFinancialSeries {
  companyId: string;
  periods: number[];
  series: HistoricalPeriodData[];
  metadata: {
    hasGaps: boolean;
    totalCycles: number;
  };
}

export function buildHistoricalSeries(clientId: string, allEntries: any[]): HistoricalFinancialSeries {
  // 1. Agrupar entradas por ano
  const yearGroups: Record<number, any[]> = {};
  allEntries.forEach(entry => {
    if (entry.year && typeof entry.year === 'number') {
      if (!yearGroups[entry.year]) {
        yearGroups[entry.year] = [];
      }
      yearGroups[entry.year].push(entry);
    }
  });

  const years = Object.keys(yearGroups).map(Number).sort((a, b) => a - b);
  
  let hasGaps = false;
  if (years.length > 1) {
    for (let i = 1; i < years.length; i++) {
      if (years[i] - years[i - 1] > 1) {
        hasGaps = true;
      }
    }
  }

  const series: HistoricalPeriodData[] = [];

  years.forEach(year => {
    const yearEntries = yearGroups[year];
    
    // BP Data
    const bpEntries = yearEntries.filter(e => 
      e.type === 'Balanço Patrimonial' || e.type === 'BP' || e.tipo === 'Balanço Patrimonial' || e.tipo === 'BP'
    );
    
    // DRE Data
    const dreEntries = yearEntries.filter(e => 
      e.type === 'DRE' || e.tipo === 'DRE'
    );

    let bpSummary: BPSummary = {} as BPSummary;
    if (bpEntries.length > 0) {
      const { summary } = buildBPHierarchy(bpEntries);
      bpSummary = summary;
    } else {
      // Cria um mock vazio seguro
      bpSummary = {
        ativoCirculante: 0,
        passivoCirculante: 0,
        patrimonioLiquido: 0,
        estoques: 0,
        passivosFinanceiros: 0,
        ativoTotal: 0,
        ativoNaoCirculante: 0,
        caixaEquivalentes: 0,
        clientes: 0,
        passivoTotal: 0,
        passivoNaoCirculante: 0,
        fornecedores: 0,
        capitalSocial: 0,
        lucrosPrejuizos: 0,
        altaConversibilidade: 0,
        mediaConversibilidade: 0,
        baixaConversibilidade: 0,
        restritaConversibilidade: 0,
        creditosSocios: 0,
        salariosEncargos: 0
      } as unknown as BPSummary;
    }

    let ebitda = 0;
    let lucroLiquido = 0;
    
    if (dreEntries.length > 0) {
      const cascade = calculateDreCascade(dreEntries);
      ebitda = cascade.find(r => r.id === 'EBITDA')?.computedValue || 0;
      lucroLiquido = cascade.find(r => r.id === 'LUCRO_LIQ')?.computedValue || 0;
    }

    // Só inclui na série histórica se tiver materialidade (evita sujar com anos completamente vazios)
    if (bpEntries.length > 0 || dreEntries.length > 0) {
      const metrics = calculateFinancialMetrics(bpSummary, ebitda, lucroLiquido, 'Geral');
      series.push({
        year,
        bp: bpSummary,
        metrics
      });
    }
  });

  return {
    companyId: clientId,
    periods: series.map(s => s.year),
    series,
    metadata: {
      hasGaps,
      totalCycles: series.length
    }
  };
}
