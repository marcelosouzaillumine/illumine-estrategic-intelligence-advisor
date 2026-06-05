// src/core/runtime/benchmark/BenchmarkCohortRepository.ts

export interface BenchmarkCohort {
  id: string;
  name: string;
  benchmarkESGIM: number;
  benchmarkIRI: number;
  benchmarkPAI: number;
  benchmarkGEI: number;
  benchmarkBRI: number;
}

export class BenchmarkCohortRepository {
  private static cohorts: BenchmarkCohort[] = [
    {
      id: 'FAMILY_BUSINESS',
      name: 'Empresas Familiares',
      benchmarkESGIM: 72,
      benchmarkIRI: 70,
      benchmarkPAI: 75,
      benchmarkGEI: 68,
      benchmarkBRI: 74
    },
    {
      id: 'HOLDING_GROUP',
      name: 'Grupos de Holding S/A',
      benchmarkESGIM: 78,
      benchmarkIRI: 75,
      benchmarkPAI: 78,
      benchmarkGEI: 72,
      benchmarkBRI: 78
    },
    {
      id: 'BAM_ORGANIZATION',
      name: 'Organizações BAM (Business as Mission)',
      benchmarkESGIM: 70,
      benchmarkIRI: 78,
      benchmarkPAI: 85,
      benchmarkGEI: 70,
      benchmarkBRI: 76
    },
    {
      id: 'THIRD_SECTOR',
      name: 'Organizações do Terceiro Setor',
      benchmarkESGIM: 65,
      benchmarkIRI: 65,
      benchmarkPAI: 80,
      benchmarkGEI: 60,
      benchmarkBRI: 68
    },
    {
      id: 'HEALTHCARE',
      name: 'Hospitais & Serviços de Saúde',
      benchmarkESGIM: 80,
      benchmarkIRI: 72,
      benchmarkPAI: 75,
      benchmarkGEI: 75,
      benchmarkBRI: 80
    },
    {
      id: 'INDUSTRY',
      name: 'Indústrias & Operações Fabris',
      benchmarkESGIM: 75,
      benchmarkIRI: 70,
      benchmarkPAI: 70,
      benchmarkGEI: 70,
      benchmarkBRI: 75
    }
  ];

  public static getCohort(id: string): BenchmarkCohort | undefined {
    return this.cohorts.find(c => c.id === id);
  }

  public static getAllCohorts(): BenchmarkCohort[] {
    return this.cohorts;
  }
}
