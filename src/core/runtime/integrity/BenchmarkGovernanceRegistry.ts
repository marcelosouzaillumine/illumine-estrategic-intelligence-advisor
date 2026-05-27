export interface SectorBenchmark {
  economicModel: string;
  sourceType: 'BOARD_CUSTOM' | 'SECTOR_SPECIFIC' | 'GENERIC_MODEL' | 'NONE';
  benchmarkOrigin: string;
  confidenceLevel: 'HIGH_CONFIDENCE' | 'MEDIUM_CONFIDENCE' | 'LOW_CONFIDENCE' | 'UNAVAILABLE';
  targetCmvMax: number;
  targetEbitdaMin: number;
  targetAdminMax: number;
  targetFinMax: number;
  targetTribMax: number;
  targetAbsorcaoMin: number;
}

export class BenchmarkGovernanceRegistry {
  private static benchmarks: Record<string, SectorBenchmark> = {
    'cosméticos': {
      economicModel: 'Industrial',
      sourceType: 'SECTOR_SPECIFIC',
      benchmarkOrigin: 'Indústria Cosmética Brasileira — EBITDA Médio Estimado',
      confidenceLevel: 'MEDIUM_CONFIDENCE',
      targetCmvMax: 60,
      targetEbitdaMin: 15,
      targetAdminMax: 10,
      targetFinMax: 5,
      targetTribMax: 15,
      targetAbsorcaoMin: 1.5,
    },
    'saúde': {
      economicModel: 'Saúde / Hospitalar',
      sourceType: 'SECTOR_SPECIFIC',
      benchmarkOrigin: 'Setor de Saúde Privada — EBITDA Médio Estimado',
      confidenceLevel: 'MEDIUM_CONFIDENCE',
      targetCmvMax: 55,
      targetEbitdaMin: 18,
      targetAdminMax: 15,
      targetFinMax: 4,
      targetTribMax: 15,
      targetAbsorcaoMin: 1.3,
    },
    'tecnologia': {
      economicModel: 'SaaS / Tecnologia',
      sourceType: 'SECTOR_SPECIFIC',
      benchmarkOrigin: 'Benchmark SaaS Brasil — EBITDA Médio Estimado',
      confidenceLevel: 'MEDIUM_CONFIDENCE',
      targetCmvMax: 25,
      targetEbitdaMin: 25,
      targetAdminMax: 15,
      targetFinMax: 2,
      targetTribMax: 12,
      targetAbsorcaoMin: 2.0,
    },
    'varejo': {
      economicModel: 'Varejo / Comércio',
      sourceType: 'SECTOR_SPECIFIC',
      benchmarkOrigin: 'Associação Brasileira de Varejo — EBITDA Médio Estimado',
      confidenceLevel: 'MEDIUM_CONFIDENCE',
      targetCmvMax: 70,
      targetEbitdaMin: 10,
      targetAdminMax: 12,
      targetFinMax: 3,
      targetTribMax: 10,
      targetAbsorcaoMin: 1.2,
    },
    'serviços': {
      economicModel: 'Serviço',
      sourceType: 'SECTOR_SPECIFIC',
      benchmarkOrigin: 'Média Regional do Setor de Serviços — EBITDA Médio Estimado',
      confidenceLevel: 'MEDIUM_CONFIDENCE',
      targetCmvMax: 40,
      targetEbitdaMin: 20,
      targetAdminMax: 15,
      targetFinMax: 3,
      targetTribMax: 12,
      targetAbsorcaoMin: 1.5,
    },
    'default': {
      economicModel: 'Geral',
      sourceType: 'GENERIC_MODEL',
      benchmarkOrigin: 'Modelo Econômico Geral do Mercado',
      confidenceLevel: 'LOW_CONFIDENCE',
      targetCmvMax: 50,
      targetEbitdaMin: 15,
      targetAdminMax: 12,
      targetFinMax: 4,
      targetTribMax: 15,
      targetAbsorcaoMin: 1.5,
    }
  };

  public static getBenchmark(segment: string, boardConfig?: any): SectorBenchmark {
    if (boardConfig?.customBenchmark) {
      return {
        ...this.benchmarks['default'],
        ...boardConfig.customBenchmark,
        sourceType: 'BOARD_CUSTOM',
        benchmarkOrigin: 'Referência definida pelo Board',
        confidenceLevel: 'HIGH_CONFIDENCE',
      };
    }

    const norm = (segment || 'default').toLowerCase();
    if (norm.includes('cosmético') || norm.includes('beleza') || norm.includes('cosmetico')) return this.benchmarks['cosméticos'];
    if (norm.includes('hospital') || norm.includes('saúde') || norm.includes('clinica')) return this.benchmarks['saúde'];
    if (norm.includes('saas') || norm.includes('tecnologia') || norm.includes('software') || norm.includes('serviço de internet')) return this.benchmarks['tecnologia'];
    if (norm.includes('varejo') || norm.includes('comércio') || norm.includes('atacado')) return this.benchmarks['varejo'];
    if (norm.includes('serviço') || norm.includes('servicos')) return this.benchmarks['serviços'];

    return this.benchmarks['default'];
  }
}
