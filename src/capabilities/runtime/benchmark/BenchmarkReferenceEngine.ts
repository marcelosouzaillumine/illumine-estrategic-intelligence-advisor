export interface BenchmarkContext {
  sector: string;
  size: 'SMALL' | 'MEDIUM' | 'LARGE' | 'ENTERPRISE';
  maturity: 'STARTUP' | 'GROWTH' | 'MATURE' | 'DECLINE';
  operationalIntensity: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface BenchmarkReference {
  targetValue: number;
  prudenceThreshold: number;
}

export class BenchmarkReferenceEngine {
  /**
   * Retorna o benchmark e a faixa de prudência esperados para um dado KPI.
   */
  public static getBenchmark(kpi: string, context: BenchmarkContext): BenchmarkReference {
    // Mocks/stubs para demonstração. O real buscaria de uma base de dados estruturada.
    if (kpi === 'EBITDA_MARGIN') {
      return {
        targetValue: 18, // 18%
        prudenceThreshold: 10 // 10% minimo sustentavel
      };
    }

    if (kpi === 'GROSS_MARGIN') {
      return {
        targetValue: 40,
        prudenceThreshold: 25
      };
    }

    return {
      targetValue: 0,
      prudenceThreshold: 0
    };
  }
}
