import { BenchmarkRiskPattern } from './BenchmarkTypes';

export class SectorRiskPatternAnalyzer {
  /**
   * Stub de análise de padrões setoriais.
   * Não identifica empresas isoladas.
   */
  static identifyPatterns(sector: string): BenchmarkRiskPattern[] {
    if (sector === 'VAREJO') {
      return [
        {
          patternId: 'PTRN-RET-1',
          description: 'Descolamento entre Capital de Giro e Crescimento',
          occurrenceRate: 65.5,
          severity: 'WARNING'
        },
        {
          patternId: 'PTRN-RET-2',
          description: 'Aumento na concentração de dívida curto prazo',
          occurrenceRate: 42.0,
          severity: 'CRITICAL'
        }
      ];
    }

    if (sector === 'AEROSPACE') {
      return []; // Coorte muito pequena, o privacy guard não deixaria isso chegar na UI de qualquer modo, mas o analyzer fica mudo
    }

    return [];
  }
}
