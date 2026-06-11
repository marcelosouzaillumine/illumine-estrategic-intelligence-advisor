

export interface DataPoint {
  year: string | number;
  value: number;
}

export interface HistoricalSeries {
  metricName: string;
  data: DataPoint[];
}

export interface HistoricalInsightDriver {
  description: string;
}

export interface HistoricalExecutiveNarrative {
  narrative: string;
  drivers: HistoricalInsightDriver[];
}

export class HistoricalInsightEngine {
  
  public static detectTrend(series: HistoricalSeries): 'up' | 'down' | 'stable' {
    if (series.data.length < 2) return 'stable';
    const first = series.data[0].value;
    const last = series.data[series.data.length - 1].value;
    const delta = last - first;
    
    // threshold for stability (e.g. within 2% variance could be stable)
    const variance = first !== 0 ? Math.abs(delta / first) : 0;
    if (variance < 0.02) return 'stable';

    return delta > 0 ? 'up' : 'down';
  }

  public static detectInflectionPoint(series: HistoricalSeries): boolean {
    if (series.data.length < 3) return false;
    // Simple inflection: V-shape or inverted V-shape
    for (let i = 1; i < series.data.length - 1; i++) {
      const prev = series.data[i - 1].value;
      const curr = series.data[i].value;
      const next = series.data[i + 1].value;
      
      if ((curr > prev && curr > next) || (curr < prev && curr < next)) {
        return true;
      }
    }
    return false;
  }

  public static detectAcceleration(series: HistoricalSeries): boolean {
    if (series.data.length < 3) return false;
    // Simple acceleration: delta(t) > delta(t-1)
    const d1 = series.data[series.data.length - 2].value - series.data[series.data.length - 3].value;
    const d2 = series.data[series.data.length - 1].value - series.data[series.data.length - 2].value;
    return d2 > d1 && d2 > 0;
  }

  public static detectCapitalStrengthening(equitySeries: HistoricalSeries, assetSeries: HistoricalSeries): HistoricalExecutiveNarrative | null {
    const eqTrend = this.detectTrend(equitySeries);
    const asTrend = this.detectTrend(assetSeries);

    if (eqTrend === 'up' && asTrend === 'up') {
      const p1 = equitySeries.data[0].value;
      const p2 = equitySeries.data[equitySeries.data.length - 1].value;
      const growth = p1 !== 0 ? ((p2 - p1) / p1) * 100 : 0;

      return {
        narrative: 'O patrimônio líquido apresentou crescimento consistente ao longo do período, reforçando a estrutura de capital.',
        drivers: [
          { description: `Crescimento de Patrimônio Líquido de ${growth.toFixed(1)}%` },
          { description: 'Expansão de Ativos acompanhada por capitalização' }
        ]
      };
    }
    return null;
  }

  public static detectCapitalDeterioration(equitySeries: HistoricalSeries, liabilitiesSeries: HistoricalSeries): HistoricalExecutiveNarrative | null {
    const eqTrend = this.detectTrend(equitySeries);
    const liTrend = this.detectTrend(liabilitiesSeries);

    if (eqTrend === 'down' && liTrend === 'up') {
      return {
        narrative: 'Houve retração patrimonial associada ao aumento de passivos, sinalizando pressão sobre a estrutura de capital.',
        drivers: [
          { description: 'Erosão contínua do Patrimônio Líquido' },
          { description: 'Expansão de Capital de Terceiros (Passivos)' }
        ]
      };
    }
    return null;
  }

  public static detectStructuralStability(seriesList: HistoricalSeries[]): HistoricalExecutiveNarrative | null {
    const allStable = seriesList.every(s => this.detectTrend(s) === 'stable');
    if (allStable) {
      return {
        narrative: 'A estrutura patrimonial permaneceu estável ao longo do período analisado, sem oscilações materiais.',
        drivers: [
          { description: 'Estabilidade em todos os eixos de capital' }
        ]
      };
    }
    return null;
  }

  public static detectCashEvolution(cashSeries: HistoricalSeries): HistoricalExecutiveNarrative | null {
    const trend = this.detectTrend(cashSeries);
    const inflection = this.detectInflectionPoint(cashSeries);

    if (trend === 'up') {
      return {
        narrative: 'Observou-se fortalecimento da posição de caixa, ampliando a margem de segurança financeira.',
        drivers: [
          { description: 'Crescimento da linha de Disponibilidades' }
        ]
      };
    } else if (trend === 'down') {
      return {
        narrative: 'Ocorreu consumo de disponibilidades ao longo do período analisado.',
        drivers: [
          { description: 'Redução contínua da posição de Caixa' }
        ]
      };
    } else if (inflection) {
      return {
        narrative: 'A evolução de caixa apresentou oscilações com pontos de inflexão marcados durante o período.',
        drivers: [
          { description: 'Volatilidade na manutenção de saldos de liquidez' }
        ]
      };
    }

    return null;
  }

  public static detectProfitabilityEvolution(profitSeries: HistoricalSeries, marginSeries?: HistoricalSeries): HistoricalExecutiveNarrative | null {
    const pTrend = this.detectTrend(profitSeries);
    
    if (pTrend === 'up') {
      return {
        narrative: 'A operação consolidou expansão de resultados líquidos ao longo da série histórica.',
        drivers: [
          { description: 'Trajetória ascendente de Lucro' }
        ]
      };
    } else if (pTrend === 'down') {
      return {
        narrative: 'Evidencia-se compressão dos resultados líquidos no período avaliado.',
        drivers: [
          { description: 'Deterioração de Lucro' }
        ]
      };
    }
    return null;
  }

  /**
   * Main orchestrator function for a set of historical series.
   */
  public static generateExecutiveNarrative(
    context: { module: 'BP' | 'DRE' | 'DFC' | 'DLPA', globalFiduciaryStatus: string },
    seriesDict: Record<string, HistoricalSeries>
  ): HistoricalExecutiveNarrative {
    
    let defaultNarrative: HistoricalExecutiveNarrative = {
      narrative: 'A evolução histórica reflete estabilidade operacional.',
      drivers: [{ description: 'Sem oscilações anormais detectadas' }]
    };

    if (context.module === 'BP') {
      if (seriesDict.equity && seriesDict.assets) {
        const strengthening = this.detectCapitalStrengthening(seriesDict.equity, seriesDict.assets);
        if (strengthening) return strengthening;
      }
      if (seriesDict.equity && seriesDict.liabilities) {
        const deterioration = this.detectCapitalDeterioration(seriesDict.equity, seriesDict.liabilities);
        // Do not return alarming narrative if global status is healthy
        if (deterioration && context.globalFiduciaryStatus !== 'HEALTHY' && context.globalFiduciaryStatus !== 'RESILIENT') {
          return deterioration;
        }
      }
    } else if (context.module === 'DRE') {
      if (seriesDict.profit) {
        const profEvol = this.detectProfitabilityEvolution(seriesDict.profit);
        if (profEvol) return profEvol;
      }
    } else if (context.module === 'DFC') {
      if (seriesDict.cash) {
        const cashEvol = this.detectCashEvolution(seriesDict.cash);
        if (cashEvol) return cashEvol;
      }
    }

    // Default fallback, ensures a summary is always returned
    return defaultNarrative;
  }
}
