import { BenchmarkExecutionRecord, BenchmarkMetric } from './BenchmarkTypes';
import { BenchmarkDatasetBuilder } from './BenchmarkDatasetBuilder';
import { BenchmarkCohortBuilder } from './BenchmarkCohortBuilder';
import { BenchmarkPrivacyGuard } from './BenchmarkPrivacyGuard';
import { BenchmarkAuditLogger } from './BenchmarkAuditLogger';
import { BenchmarkConfidenceIndex } from './BenchmarkConfidenceIndex';
import { BenchmarkLineageBinder } from './BenchmarkLineageBinder';

export class InstitutionalBenchmarkEngine {
  /**
   * Executa a Inteligência Comparativa para um setor/porte desejado.
   * Se violar a privacidade, devolve o erro e trava o gráfico.
   */
  static runComparativeAnalysis(
    sectorToCompare: string,
    revenueBandToCompare: string
  ): BenchmarkExecutionRecord {
    
    const executionId = `EXEC-${Date.now()}`;
    const rawNetworkData = BenchmarkDatasetBuilder.extractSafeInstitutionalNetworkData();
    
    const cohort = BenchmarkCohortBuilder.buildCohort(sectorToCompare, revenueBandToCompare, rawNetworkData);

    const privacyViolation = BenchmarkPrivacyGuard.inspectCohort(cohort);
    
    if (privacyViolation) {
      BenchmarkAuditLogger.logEvent('PRIVACY_BLOCKED', cohort.cohortSignature, privacyViolation.message);
      
      return {
        executionId,
        cohortSignature: cohort.cohortSignature,
        timestamp: new Date().toISOString(),
        status: 'BLOCKED_BY_PRIVACY',
        lineage: BenchmarkLineageBinder.bind(executionId, cohort.cohortSignature, 'N/A')
      };
    }

    // Se chegou aqui, a coorte é segura. Geramos a matemática agregada.
    const confidenceDist = BenchmarkConfidenceIndex.calculateIndex(cohort);

    const systemicRiskMetric: BenchmarkMetric = {
      metricName: 'Systemic Risk Distribution',
      p25: 30, // Mocked aggregation
      p50: 45,
      p75: 70,
      average: 50
    };

    BenchmarkAuditLogger.logEvent('BENCHMARK_EXECUTED', cohort.cohortSignature, 'Cálculo de benchmark executado com sucesso e anonimato garantido.');

    return {
      executionId,
      cohortSignature: cohort.cohortSignature,
      timestamp: new Date().toISOString(),
      status: 'COMPLETED',
      lineage: BenchmarkLineageBinder.bind(executionId, cohort.cohortSignature, 'v1.0.0'),
      anonymizedComparison: {
        cohortSignature: cohort.cohortSignature,
        metrics: [systemicRiskMetric],
        confidenceDistribution: confidenceDist
      }
    };
  }
}
